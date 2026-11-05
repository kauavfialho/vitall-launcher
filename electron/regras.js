'use strict';
// as decisoes do launcher, sem electron, pra dar pra testar no node.
function partesVersao(v){
  const m = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(String(v || '').trim());
  return m ? m.slice(1).map(Number) : null;
}
function versaoMaior(nova, atual){
  const a = partesVersao(nova), b = partesVersao(atual);
  if(!a || !b) return false;
  for(let i = 0; i < 3; i++){
    if(a[i] !== b[i]) return a[i] > b[i];
  }
  return false;
}
function nomesDaPlataforma(plataforma, arq){
  if(plataforma === 'darwin') return { sufixo: `-mac-${arq}.dmg`, yml: 'latest-mac.yml' };
  if(plataforma === 'win32') return { sufixo: `-win-${arq}.exe`, yml: 'latest.yml' };
  return null;
}
function sha512DoYml(texto, arquivo){
  const linhas = String(texto).split(/\r?\n/);
  for(let i = 0; i < linhas.length; i++){
    const m = /^\s*-?\s*url:\s*(.+?)\s*$/.exec(linhas[i]);
    if(!m || m[1] !== arquivo) continue;
    for(let j = i + 1; j < linhas.length; j++){
      if(/^\s*-\s*url:/.test(linhas[j])) break;
      const h = /^\s*sha512:\s*(\S+)\s*$/.exec(linhas[j]);
      if(h) return h[1];
    }
  }
  return null;
}
// o que a release oferece para este sistema, ou null se nao tiver instalador dele
function arquivoDaRelease(release, plataforma, arq){
  const nomes = nomesDaPlataforma(plataforma, arq);
  if(!release || !nomes || !partesVersao(release.tag_name)) return null;
  const ativos = release.assets || [];
  const instalador = ativos.find(a => a.name.endsWith(nomes.sufixo));
  const yml = ativos.find(a => a.name === nomes.yml);
  if(!instalador || !yml) return null;
  return {
    versao: String(release.tag_name).replace(/^v/, ''),
    arquivo: instalador.name,
    urlInstalador: instalador.browser_download_url,
    urlYml: yml.browser_download_url
  };
}
// o botao que a tela mostra. sem internet, quem ja tem instalado continua podendo abrir.
function situacao(app, versaoInstalada, oferta, semInternet){
  if(app.estado !== 'disponivel') return { acao: 'em-obras' };
  if(versaoInstalada){
    const atualizar = oferta && versaoMaior(oferta.versao, versaoInstalada);
    return { acao: atualizar ? 'atualizar' : 'abrir', versaoInstalada, versaoNova: atualizar ? oferta.versao : null };
  }
  if(oferta) return { acao: 'instalar', versaoNova: oferta.versao };
  return { acao: 'indisponivel', motivo: semInternet ? 'Sem conexão. Conecte-se à internet para instalar.' : 'Ainda não há instalador para este computador.' };
}
module.exports = { versaoMaior, sha512DoYml, arquivoDaRelease, situacao, nomesDaPlataforma };
