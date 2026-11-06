'use strict';
// a lista de aplicativos do launcher. app novo entra aqui: em obras so precisa de nome e descricao.
// quando ficar pronto, ganha repo (publico), nome do bundle no mac e pasta no windows.
const APPS = [
  {
    id: 'syvo', nome: 'Syvo', icone: '💰', estado: 'disponivel',
    descricao: 'Organize seu dinheiro, crie metas, aprenda a investir e prepare o imposto de renda.',
    repo: 'kauavfialho/syvo', bundleMac: 'Syvo.app', pastaWin: 'syvo', exeWin: 'Syvo.exe'
  },
  {
    id: 'computador', nome: 'Bastion', icone: '💻', estado: 'disponivel',
    descricao: 'Cuide do seu computador: saúde do PC, limpeza, jogos, periféricos e formatação. Só para Windows.',
    repo: 'kauavfialho/bastion', bundleMac: 'Bastion.app', pastaWin: 'bastion', exeWin: 'Bastion.exe'
  },
  {
    id: 'vida', nome: 'Gestão da vida', icone: '🗓️', estado: 'em-obras',
    descricao: 'Organize sua rotina, suas tarefas e seus objetivos em um só lugar.'
  },
  {
    id: 'treinos', nome: 'Dieta e treinos', icone: '💪', estado: 'em-obras',
    descricao: 'Acompanhe sua alimentação, sua academia e seus treinos.'
  }
];
module.exports = { APPS };
