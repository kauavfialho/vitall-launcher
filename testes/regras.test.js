'use strict';
const test = require('node:test');
const assert = require('node:assert');
const { versaoMaior, sha512DoYml, arquivoDaRelease, situacao } = require('../electron/regras');
const { APPS } = require('../electron/catalogo');

const ativo = n => ({ name: n, browser_download_url: 'https://x/' + n });
const release = { tag_name: 'v2.2.0', assets: ['Syvo-2.2.0-mac-arm64.dmg', 'Syvo-2.2.0-mac-x64.dmg', 'Syvo-2.2.0-win-x64.exe', 'latest.yml', 'latest-mac.yml'].map(ativo) };
const syvo = APPS.find(a => a.id === 'syvo');

test('compara versao por numero e ignora tag estranha', () => {
  assert.ok(versaoMaior('v2.10.0', '2.9.0'));
  assert.ok(!versaoMaior('2.2.0', '2.2.0'));
  assert.ok(!versaoMaior('beta', '2.2.0'));
});
test('escolhe o arquivo do sistema e do processador', () => {
  assert.strictEqual(arquivoDaRelease(release, 'darwin', 'arm64').arquivo, 'Syvo-2.2.0-mac-arm64.dmg');
  assert.strictEqual(arquivoDaRelease(release, 'win32', 'x64').arquivo, 'Syvo-2.2.0-win-x64.exe');
  assert.strictEqual(arquivoDaRelease(release, 'linux', 'x64'), null);
  assert.strictEqual(arquivoDaRelease({ tag_name: 'v1.0.0', assets: [ativo('Syvo-1.0.0-win-x64.exe')] }, 'win32', 'x64'), null);
});
test('acha o sha512 certo', () => {
  const yml = 'files:\n  - url: a.dmg\n    sha512: AAA\n  - url: b.dmg\n    sha512: BBB\n';
  assert.strictEqual(sha512DoYml(yml, 'b.dmg'), 'BBB');
  assert.strictEqual(sha512DoYml(yml, 'c.dmg'), null);
});
test('o botao certo para cada situacao', () => {
  const oferta = { versao: '2.2.0' };
  assert.strictEqual(situacao(syvo, null, oferta).acao, 'instalar');
  assert.strictEqual(situacao(syvo, '2.2.0', oferta).acao, 'abrir');
  assert.strictEqual(situacao(syvo, '2.1.0', oferta).acao, 'atualizar');
  assert.strictEqual(situacao(syvo, '2.3.0', oferta).acao, 'abrir');
  assert.strictEqual(situacao(syvo, '2.2.0', null, true).acao, 'abrir');
  const sem = situacao(syvo, null, null, true);
  assert.strictEqual(sem.acao, 'indisponivel');
  assert.match(sem.motivo, /internet/);
});
test('catalogo tem o syvo e o bastion disponiveis e as ideias em obras', () => {
  assert.deepStrictEqual(APPS.map(a => a.id), ['syvo', 'computador', 'vida', 'treinos']);
  assert.strictEqual(APPS.find(a => a.id === 'computador').repo, 'kauavfialho/bastion');
  APPS.filter(a => !['syvo', 'computador'].includes(a.id)).forEach(a => {
    assert.strictEqual(a.estado, 'em-obras');
    assert.strictEqual(situacao(a).acao, 'em-obras');
  });
  APPS.filter(a => a.estado === 'disponivel').forEach(a => {
    assert.ok(a.repo && a.bundleMac && a.pastaWin && a.exeWin, a.id);
  });
});

test('bastion so tem instalador de windows: no mac aparece como indisponivel', () => {
  const r = { tag_name: 'v1.0.0', assets: ['Bastion-win-x64.exe', 'Bastion-win-arm64.exe', 'Bastion-win-x64-portable.exe', 'latest.yml'].map(ativo) };
  const bastion = APPS.find(a => a.id === 'computador');
  assert.strictEqual(arquivoDaRelease(r, 'win32', 'x64').arquivo, 'Bastion-win-x64.exe');
  assert.strictEqual(arquivoDaRelease(r, 'win32', 'arm64').arquivo, 'Bastion-win-arm64.exe');
  assert.strictEqual(arquivoDaRelease(r, 'darwin', 'arm64'), null);
  assert.strictEqual(situacao(bastion, null, null).acao, 'indisponivel');
});

test('nome sem versao tambem e reconhecido', () => {
  const r = { tag_name: 'v3.0.0', assets: ['App-mac-arm64.dmg', 'App-mac-arm64.zip', 'App-win-x64.exe', 'App-win-x64-portable.exe', 'latest.yml', 'latest-mac.yml'].map(ativo) };
  assert.strictEqual(arquivoDaRelease(r, 'darwin', 'arm64').arquivo, 'App-mac-arm64.dmg');
  assert.strictEqual(arquivoDaRelease(r, 'win32', 'x64').arquivo, 'App-win-x64.exe');
  assert.strictEqual(arquivoDaRelease(r, 'darwin', 'arm64').versao, '3.0.0');
});
