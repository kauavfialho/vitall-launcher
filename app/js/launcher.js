// a tela do launcher: desenha um cartao por aplicativo e fala com o electron pela ponte.
(function(){
  const grade = document.getElementById('apps');
  const estado = {};   // progresso e erro de cada app, sobrevive quando a lista redesenha

  function criar(tag, classe, texto){
    const el = document.createElement(tag);
    if(classe) el.className = classe;
    if(texto !== undefined) el.textContent = texto;
    return el;
  }
  function botao(texto, classe, aoClicar, desligado){
    const b = criar('button', classe, texto);
    b.type = 'button';
    b.disabled = !!desligado;
    b.addEventListener('click', aoClicar);
    return b;
  }
  function textoFase(p){
    if(p.fase === 'baixando') return p.pct === null || p.pct === undefined ? 'Baixando…' : `Baixando: ${p.pct}%`;
    if(p.fase === 'instalando') return 'Instalando…';
    return 'Preparando…';
  }
  async function acao(app, fn){
    estado[app.id] = { fase: 'preparando' };
    desenhar();
    try {
      await fn();
      estado[app.id] = null;
    } catch(e){
      estado[app.id] = { erro: String(e.message || e).replace(/^Error invoking remote method '[^']+': (Error: )?/, '') };
    }
    await atualizarLista();
  }
  async function abrir(app){
    try {
      await window.vital.abrir(app.id);
      estado[app.id] = null;
    } catch(e){
      estado[app.id] = { erro: 'Não consegui abrir. Tente de novo.' };
      desenhar();
    }
  }

  let lista = [];
  function cartao(app){
    const c = criar('article', 'cartao' + (app.acao === 'em-obras' ? ' em-obras' : ''));
    const topo = criar('div', 'cartao-topo');
    const icone = criar('span', 'icone', app.icone);
    icone.setAttribute('aria-hidden', 'true');
    topo.append(icone);
    if(app.acao === 'em-obras') topo.append(criar('span', 'selo obra', '🚧 Em obras'));
    else if(app.versaoInstalada) topo.append(criar('span', 'selo', 'Instalado'));
    c.append(topo, criar('h2', '', app.nome), criar('p', '', app.descricao));

    const acoes = criar('div', 'acoes');
    const e = estado[app.id];
    const ocupado = (e && !e.erro) || app.ocupado;
    if(app.versaoInstalada) acoes.append(criar('div', 'status', `Versão ${app.versaoInstalada}`));
    if(ocupado){
      const f = e || { fase: 'preparando' };
      acoes.append(criar('div', 'status', textoFase(f)));
      const barra = criar('div', 'barra'), cheio = criar('span');
      cheio.style.width = `${f.fase === 'instalando' ? 100 : (f.pct || 0)}%`;
      barra.append(cheio);
      acoes.append(barra);
    } else {
      if(e && e.erro){
        const erro = criar('div', 'status erro', e.erro);
        erro.setAttribute('role', 'alert');
        acoes.append(erro);
      }
      if(app.acao === 'em-obras') acoes.append(botao('Em breve', 'secundario', () => {}, true));
      if(app.acao === 'indisponivel') acoes.append(criar('div', 'status', app.motivo));
      if(app.acao === 'instalar') acoes.append(botao(`Instalar versão ${app.versaoNova}`, 'principal', () => acao(app, () => window.vital.instalar(app.id))));
      if(app.acao === 'atualizar'){
        acoes.append(botao(`Atualizar para ${app.versaoNova}`, 'principal', () => acao(app, () => window.vital.instalar(app.id))));
        acoes.append(botao('Abrir', 'secundario', () => abrir(app)));
      }
      if(app.acao === 'abrir') acoes.append(botao('Abrir', 'principal', () => abrir(app)));
    }
    c.append(acoes);
    return c;
  }
  function desenhar(){ grade.replaceChildren(...lista.map(cartao)); }
  async function atualizarLista(){
    try {
      lista = await window.vital.listar();
      desenhar();
    } catch(e){
      grade.replaceChildren(criar('p', 'carregando', 'Não consegui carregar os aplicativos. Feche e abra de novo.'));
    }
  }

  window.vital.aoProgresso(p => {
    estado[p.id] = p;
    desenhar();
  });
  // voltou para a janela: o usuario pode ter instalado ou removido algo
  window.addEventListener('focus', () => { if(!Object.values(estado).some(e => e && !e.erro)) atualizarLista(); });
  window.vital.versao().then(v => { document.getElementById('versao').textContent = `Vitall Launcher ${v}`; });
  atualizarLista();
})();
