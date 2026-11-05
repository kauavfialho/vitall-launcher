'use strict';
// descobre o que esta instalado, baixa com conferencia de sha512 e instala.
const { net, shell } = require('electron');
const { execFile, spawn } = require('node:child_process');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { promisify } = require('node:util');
const { sha512DoYml, arquivoDaRelease } = require('./regras');
const rodar = promisify(execFile);
const CABECALHO = { 'User-Agent': 'Vitall-Launcher-App' };

function pastasMac(){
  // o teste automatico instala numa pasta descartavel
  if(process.env.VITAL_PASTA_APPS) return [process.env.VITAL_PASTA_APPS];
  return ['/Applications', path.join(os.homedir(), 'Applications')];
}
function caminhoInstalado(app){
  if(process.platform === 'darwin'){
    for(const pasta of pastasMac()){
      const p = path.join(pasta, app.bundleMac);
      if(fs.existsSync(p)) return p;
    }
    return null;
  }
  if(process.platform === 'win32'){
    const base = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
    const p = path.join(base, 'Programs', app.pastaWin, app.exeWin);
    return fs.existsSync(p) ? p : null;
  }
  return null;
}
async function versaoInstalada(app){
  const p = caminhoInstalado(app);
  if(!p) return null;
  try {
    if(process.platform === 'darwin'){
      const { stdout } = await rodar('/usr/bin/plutil', ['-extract', 'CFBundleShortVersionString', 'raw', path.join(p, 'Contents', 'Info.plist')]);
      return stdout.trim();
    }
    const comando = `(Get-Item -LiteralPath '${p.replace(/'/g, "''")}').VersionInfo.ProductVersion`;
    const { stdout } = await rodar('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', comando]);
    return stdout.trim().split('.').slice(0, 3).join('.');
  } catch(e){
    return '0.0.0';   // esta instalado, mas nao deu pra ler a versao: oferece atualizar em vez de sumir
  }
}
async function ofertaDoGithub(app){
  const url = process.env.VITAL_URL_RELEASE || `https://api.github.com/repos/${app.repo}/releases/latest`;
  const r = await net.fetch(url, { headers: Object.assign({ Accept: 'application/vnd.github+json' }, CABECALHO) });
  if(r.status === 404) return null;
  if(!r.ok) throw new Error(`O GitHub respondeu ${r.status}.`);
  return arquivoDaRelease(await r.json(), process.platform, process.arch);
}
async function estaAberto(app){
  const p = caminhoInstalado(app);
  if(!p) return false;
  try {
    if(process.platform === 'darwin'){
      await rodar('/usr/bin/pgrep', ['-f', path.join(p, 'Contents', 'MacOS') + '/']);
      return true;
    }
    const { stdout } = await rodar('tasklist', ['/FI', `IMAGENAME eq ${app.exeWin}`, '/NH']);
    return stdout.toLowerCase().includes(app.exeWin.toLowerCase());
  } catch(e){
    return false;   // pgrep sai com erro quando nao acha nada
  }
}
async function baixar(url, destino, avisar){
  const r = await net.fetch(url, { headers: CABECALHO });
  if(!r.ok || !r.body) throw new Error(`Não consegui baixar (${r.status}).`);
  const total = Number(r.headers.get('content-length')) || 0;
  const hash = crypto.createHash('sha512');
  const saida = fs.createWriteStream(destino);
  let recebido = 0, ultimo = -1;
  try {
    for await (const pedaco of r.body){
      hash.update(pedaco);
      recebido += pedaco.length;
      if(!saida.write(pedaco)) await new Promise(ok => saida.once('drain', ok));
      const pct = total ? Math.floor(recebido / total * 100) : null;
      if(pct !== ultimo){ ultimo = pct; avisar({ fase: 'baixando', pct }); }
    }
  } finally {
    await new Promise(ok => saida.end(ok));
  }
  return hash.digest('base64');
}
function pastaDestinoMac(){
  for(const pasta of pastasMac()){
    try {
      fs.mkdirSync(pasta, { recursive: true });
      fs.accessSync(pasta, fs.constants.W_OK);
      return pasta;
    } catch(e){ /* tenta a proxima */ }
  }
  throw new Error('Não tenho permissão para instalar na pasta Aplicativos.');
}
async function instalarMac(app, dmg, temp, versao){
  const montagem = path.join(temp, 'montagem');
  const novo = path.join(temp, 'novo', app.bundleMac);
  fs.mkdirSync(montagem, { recursive: true });
  fs.mkdirSync(path.dirname(novo), { recursive: true });
  await rodar('/usr/bin/hdiutil', ['attach', dmg, '-nobrowse', '-readonly', '-mountpoint', montagem]);
  try {
    await rodar('/usr/bin/ditto', [path.join(montagem, app.bundleMac), novo]);
  } finally {
    await rodar('/usr/bin/hdiutil', ['detach', montagem, '-force']).catch(() => {});
  }
  await rodar('/usr/bin/codesign', ['--verify', '--deep', novo]);
  const { stdout } = await rodar('/usr/bin/plutil', ['-extract', 'CFBundleShortVersionString', 'raw', path.join(novo, 'Contents', 'Info.plist')]);
  if(stdout.trim() !== versao) throw new Error('O instalador baixado não é da versão esperada.');
  await rodar('/usr/bin/xattr', ['-cr', novo]).catch(() => {});

  const antigo = caminhoInstalado(app);
  const destino = antigo || path.join(pastaDestinoMac(), app.bundleMac);
  const reserva = path.join(temp, 'antigo-' + app.bundleMac);
  // guarda o app antigo ate o novo estar no lugar. se falhar, ele volta.
  if(antigo) await rodar('/bin/mv', [antigo, reserva]);
  try {
    await rodar('/bin/mv', [novo, destino]);
  } catch(e){
    if(antigo) await rodar('/bin/mv', [reserva, antigo]);
    throw new Error('Não consegui colocar o aplicativo na pasta Aplicativos.');
  }
}
function instalarWindows(instalador){
  return new Promise((ok, falha) => {
    const p = spawn(instalador, ['--updated', '/S'], { stdio: 'ignore' });
    p.on('error', falha);
    p.on('exit', cod => cod === 0 ? ok() : falha(new Error(`O instalador terminou com erro (${cod}).`)));
  });
}
async function instalar(app, avisar){
  if(await estaAberto(app)) throw new Error(`Feche o ${app.nome} e tente de novo.`);
  const oferta = await ofertaDoGithub(app);
  if(!oferta) throw new Error('Não encontrei um instalador para este computador.');
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'vital-instalacao-'));
  try {
    avisar({ fase: 'preparando' });
    const rYml = await net.fetch(oferta.urlYml, { headers: CABECALHO });
    if(!rYml.ok) throw new Error('Não encontrei a conferência do arquivo.');
    const esperado = sha512DoYml(await rYml.text(), oferta.arquivo);
    if(!esperado) throw new Error('A versão publicada não tem código de conferência.');
    const destino = path.join(temp, oferta.arquivo);
    const obtido = await baixar(oferta.urlInstalador, destino, avisar);
    if(obtido !== esperado) throw new Error('O arquivo baixado veio diferente do publicado. Nada foi alterado.');
    avisar({ fase: 'instalando' });
    if(process.platform === 'darwin') await instalarMac(app, destino, temp, oferta.versao);
    else if(process.platform === 'win32') await instalarWindows(destino);
    else throw new Error('Este sistema ainda não é compatível.');
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
}
async function abrir(app){
  const p = caminhoInstalado(app);
  if(!p) throw new Error(`${app.nome} não está instalado.`);
  const erro = await shell.openPath(p);
  if(erro) throw new Error(erro);
}
module.exports = { versaoInstalada, ofertaDoGithub, instalar, abrir };
