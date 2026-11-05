'use strict';
const { app, BrowserWindow, ipcMain, net, protocol, session, shell } = require('electron');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { APPS } = require('./catalogo');
const { situacao } = require('./regras');
const instalador = require('./instalador');

const PASTA_APP = path.join(__dirname, '..', 'app');
const ORIGEM = 'app://vital';
if(process.env.VITAL_PASTA_DADOS) app.setPath('userData', process.env.VITAL_PASTA_DADOS);
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true } }]);

let janela = null;
const emAndamento = new Set();

function daTela(evento){
  const url = evento.senderFrame && evento.senderFrame.url;
  return typeof url === 'string' && url.startsWith(ORIGEM + '/');
}
function atender(canal, fn){
  ipcMain.handle(canal, (evento, ...args) => {
    if(!daTela(evento)) throw new Error('pedido fora do app');
    return fn(...args);
  });
}
function appDisponivel(id){
  const a = APPS.find(x => x.id === id && x.estado === 'disponivel');
  if(!a) throw new Error('Aplicativo indisponível.');
  return a;
}
async function descrever(a){
  const base = { id: a.id, nome: a.nome, icone: a.icone, descricao: a.descricao };
  if(a.estado !== 'disponivel') return Object.assign(base, situacao(a));
  const versao = await instalador.versaoInstalada(a);
  let oferta = null, semInternet = false;
  try { oferta = await instalador.ofertaDoGithub(a); } catch(e){ semInternet = true; }
  return Object.assign(base, situacao(a, versao, oferta, semInternet), { ocupado: emAndamento.has(a.id) });
}
function registrarPontes(){
  atender('apps:listar', () => Promise.all(APPS.map(descrever)));
  atender('launcher:versao', () => app.getVersion());
  atender('apps:abrir', id => instalador.abrir(appDisponivel(id)));
  atender('apps:instalar', async id => {
    const a = appDisponivel(id);
    if(emAndamento.has(id)) throw new Error('A instalação já está em andamento.');
    emAndamento.add(id);
    try {
      await instalador.instalar(a, dados => {
        if(janela && !janela.isDestroyed()) janela.webContents.send('apps:progresso', Object.assign({ id }, dados));
      });
    } finally {
      emAndamento.delete(id);
    }
  });
}
function registrarProtocolo(){
  protocol.handle('app', pedido => {
    const url = new URL(pedido.url);
    const relativo = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
    const arquivo = path.resolve(PASTA_APP, '.' + relativo);
    if(url.host !== 'vital' || !arquivo.startsWith(PASTA_APP + path.sep)) return new Response('nao achei', { status: 404 });
    return net.fetch(pathToFileURL(arquivo).toString());
  });
}
function criarJanela(){
  janela = new BrowserWindow({
    width: 1000, height: 700, minWidth: 640, minHeight: 520,
    backgroundColor: '#f1ede2', autoHideMenuBar: true, title: 'Vitall Launcher',
    icon: path.join(__dirname, '..', 'build', 'icon.png'),
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false, sandbox: true }
  });
  janela.webContents.setWindowOpenHandler(({ url }) => {
    if(/^https:\/\//.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  janela.webContents.on('will-navigate', (e, url) => { if(!url.startsWith(ORIGEM + '/')) e.preventDefault(); });
  janela.on('closed', () => { janela = null; });
  janela.loadURL(ORIGEM + '/index.html');
}
if(!app.requestSingleInstanceLock()){
  app.quit();
} else {
  app.on('second-instance', () => { if(janela){ if(janela.isMinimized()) janela.restore(); janela.focus(); } });
  app.whenReady().then(() => {
    session.defaultSession.setPermissionRequestHandler((_wc, _p, responder) => responder(false));
    registrarProtocolo();
    registrarPontes();
    criarJanela();
    app.on('activate', () => { if(BrowserWindow.getAllWindows().length === 0) criarJanela(); });
  });
  app.on('window-all-closed', () => { if(process.platform !== 'darwin') app.quit(); });
}
