// a tela do launcher: desenha um cartao por aplicativo e fala com o electron pela ponte.
(function(){
  // os textos sao escritos em portugues e trocados aqui. erro que vem do instalador passa pelo mesmo dicionario.
  const IDIOMAS = { pt: 'Português', en: 'English', es: 'Español' };
  const TEXTOS = {
    en: {
      'Seus aplicativos em um só lugar.': 'All your apps in one place.', 'Carregando…': 'Loading…',
      'Organize seu dinheiro, crie metas, aprenda a investir e prepare o imposto de renda.': 'Organize your money, set goals, learn to invest and prepare your Brazilian income tax.',
      'Gestão do computador': 'Computer management', 'Cuide do seu computador e faça backup dos seus arquivos.': 'Take care of your computer and back up your files.',
      'Gestão da vida': 'Life management', 'Organize sua rotina, suas tarefas e seus objetivos em um só lugar.': 'Organize your routine, tasks and goals in one place.',
      'Dieta e treinos': 'Diet and workouts', 'Acompanhe sua alimentação, sua academia e seus treinos.': 'Track your food, gym sessions and workouts.',
      '🚧 Em obras': '🚧 In progress', 'Em breve': 'Coming soon', 'Instalado': 'Installed', 'Abrir': 'Open', 'Versão': 'Version', 'Instalar versão': 'Install version', 'Atualizar para': 'Update to',
      'Baixando…': 'Downloading…', 'Baixando:': 'Downloading:', 'Instalando…': 'Installing…', 'Preparando…': 'Preparing…',
      'Não consegui abrir. Tente de novo.': "I couldn't open it. Try again.", 'Não consegui carregar os aplicativos. Feche e abra de novo.': "I couldn't load the apps. Close and reopen.",
      'Sem conexão. Conecte-se à internet para instalar.': 'No connection. Connect to the internet to install.', 'Ainda não há instalador para este computador.': "There's no installer for this computer yet.",
      'O arquivo baixado veio diferente do publicado. Nada foi alterado.': 'The downloaded file differs from the published one. Nothing was changed.', 'Não encontrei um instalador para este computador.': "I couldn't find an installer for this computer.",
      'Não encontrei a conferência do arquivo.': "I couldn't find the file's verification.", 'A versão publicada não tem código de conferência.': 'The published version has no verification code.', 'O instalador baixado não é da versão esperada.': "The downloaded installer isn't the expected version.",
      'Não consegui colocar o aplicativo na pasta Aplicativos.': "I couldn't put the app in the Applications folder.", 'Não tenho permissão para instalar na pasta Aplicativos.': "I don't have permission to install in the Applications folder.", 'Este sistema ainda não é compatível.': "This system isn't supported yet.", 'A instalação já está em andamento.': 'The installation is already in progress.'
    },
    es: {
      'Seus aplicativos em um só lugar.': 'Tus aplicaciones en un solo lugar.', 'Carregando…': 'Cargando…',
      'Organize seu dinheiro, crie metas, aprenda a investir e prepare o imposto de renda.': 'Organiza tu dinero, crea metas, aprende a invertir y prepara el impuesto sobre la renta de Brasil.',
      'Gestão do computador': 'Gestión de la computadora', 'Cuide do seu computador e faça backup dos seus arquivos.': 'Cuida tu computadora y haz copias de seguridad de tus archivos.',
      'Gestão da vida': 'Gestión de la vida', 'Organize sua rotina, suas tarefas e seus objetivos em um só lugar.': 'Organiza tu rutina, tus tareas y tus objetivos en un solo lugar.',
      'Dieta e treinos': 'Dieta y entrenamientos', 'Acompanhe sua alimentação, sua academia e seus treinos.': 'Sigue tu alimentación, tu gimnasio y tus entrenamientos.',
      '🚧 Em obras': '🚧 En obras', 'Em breve': 'Próximamente', 'Instalado': 'Instalado', 'Abrir': 'Abrir', 'Versão': 'Versión', 'Instalar versão': 'Instalar versión', 'Atualizar para': 'Actualizar a',
      'Baixando…': 'Descargando…', 'Baixando:': 'Descargando:', 'Instalando…': 'Instalando…', 'Preparando…': 'Preparando…',
      'Não consegui abrir. Tente de novo.': 'No pude abrirla. Inténtalo de nuevo.', 'Não consegui carregar os aplicativos. Feche e abra de novo.': 'No pude cargar las aplicaciones. Cierra y abre de nuevo.',
      'Sem conexão. Conecte-se à internet para instalar.': 'Sin conexión. Conéctate a internet para instalar.', 'Ainda não há instalador para este computador.': 'Aún no hay instalador para esta computadora.',
      'O arquivo baixado veio diferente do publicado. Nada foi alterado.': 'El archivo descargado es distinto del publicado. No se cambió nada.', 'Não encontrei um instalador para este computador.': 'No encontré un instalador para esta computadora.',
      'Não encontrei a conferência do arquivo.': 'No encontré la verificación del archivo.', 'A versão publicada não tem código de conferência.': 'La versión publicada no tiene código de verificación.', 'O instalador baixado não é da versão esperada.': 'El instalador descargado no es de la versión esperada.',
      'Não consegui colocar o aplicativo na pasta Aplicativos.': 'No pude poner la aplicación en la carpeta Aplicaciones.', 'Não tenho permissão para instalar na pasta Aplicativos.': 'No tengo permiso para instalar en la carpeta Aplicaciones.', 'Este sistema ainda não é compatível.': 'Este sistema aún no es compatible.', 'A instalação já está em andamento.': 'La instalación ya está en curso.'
    }
  };
  function descobrirIdioma(){
    let salvo = null;
    try { salvo = localStorage.getItem('vitall-idioma'); } catch(e){}
    if(IDIOMAS[salvo]) return salvo;
    const sistema = String(navigator.language || 'en').slice(0, 2).toLowerCase();
    return IDIOMAS[sistema] ? sistema : 'en';
  }
  const idioma = descobrirIdioma();
  document.documentElement.lang = idioma === 'pt' ? 'pt-BR' : idioma;
  const T = texto => (TEXTOS[idioma] && TEXTOS[idioma][texto]) || texto;
  // feche o app tem o nome no meio, entao trata a parte
  const traduzirErro = msg => {
    const m = /^Feche o (.+) e tente de novo\.$/.exec(msg);
    if(!m) return T(msg);
    if(idioma === 'en') return 'Close ' + T(m[1]) + ' and try again.';
    if(idioma === 'es') return 'Cierra ' + T(m[1]) + ' e inténtalo de nuevo.';
    return msg;
  };

  document.getElementById('subtitulo').textContent = T('Seus aplicativos em um só lugar.');
  document.getElementById('carregando').textContent = T('Carregando…');
  const seletor = document.getElementById('idiomas');
  Object.entries(IDIOMAS).forEach(([codigo, nome]) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = codigo.toUpperCase();
    b.title = nome;
    b.lang = codigo;
    b.setAttribute('aria-label', nome);
    b.setAttribute('aria-pressed', codigo === idioma ? 'true' : 'false');
    if(codigo === idioma) b.className = 'ativo';
    b.addEventListener('click', () => {
      if(codigo === idioma) return;
      try { localStorage.setItem('vitall-idioma', codigo); } catch(e){}
      location.reload();
    });
    seletor.append(b);
  });

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
    if(p.fase === 'baixando') return p.pct === null || p.pct === undefined ? T('Baixando…') : `${T('Baixando:')} ${p.pct}%`;
    if(p.fase === 'instalando') return T('Instalando…');
    return T('Preparando…');
  }
  async function acao(app, fn){
    estado[app.id] = { fase: 'preparando' };
    desenhar();
    try {
      await fn();
      estado[app.id] = null;
    } catch(e){
      estado[app.id] = { erro: traduzirErro(String(e.message || e).replace(/^Error invoking remote method '[^']+': (Error: )?/, '')) };
    }
    await atualizarLista();
  }
  async function abrir(app){
    try {
      await window.vital.abrir(app.id);
      estado[app.id] = null;
    } catch(e){
      estado[app.id] = { erro: T('Não consegui abrir. Tente de novo.') };
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
    if(app.acao === 'em-obras') topo.append(criar('span', 'selo obra', T('🚧 Em obras')));
    else if(app.versaoInstalada) topo.append(criar('span', 'selo', T('Instalado')));
    c.append(topo, criar('h2', '', T(app.nome)), criar('p', '', T(app.descricao)));

    const acoes = criar('div', 'acoes');
    const e = estado[app.id];
    const ocupado = (e && !e.erro) || app.ocupado;
    if(app.versaoInstalada) acoes.append(criar('div', 'status', `${T('Versão')} ${app.versaoInstalada}`));
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
      if(app.acao === 'em-obras') acoes.append(botao(T('Em breve'), 'secundario', () => {}, true));
      if(app.acao === 'indisponivel') acoes.append(criar('div', 'status', T(app.motivo)));
      if(app.acao === 'instalar') acoes.append(botao(`${T('Instalar versão')} ${app.versaoNova}`, 'principal', () => acao(app, () => window.vital.instalar(app.id))));
      if(app.acao === 'atualizar'){
        acoes.append(botao(`${T('Atualizar para')} ${app.versaoNova}`, 'principal', () => acao(app, () => window.vital.instalar(app.id))));
        acoes.append(botao(T('Abrir'), 'secundario', () => abrir(app)));
      }
      if(app.acao === 'abrir') acoes.append(botao(T('Abrir'), 'principal', () => abrir(app)));
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
      grade.replaceChildren(criar('p', 'carregando', T('Não consegui carregar os aplicativos. Feche e abra de novo.')));
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
