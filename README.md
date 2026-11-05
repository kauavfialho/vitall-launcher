# Vital Solutions

Um launcher gratuito que reúne os aplicativos da Vital Solutions em um só lugar. Por ele, você instala, abre e atualiza cada um, sem ficar procurando arquivos. Cada projeto tem o seu próprio repositório.

## Aplicativos

| Aplicativo | O que faz | Situação | Projeto |
|---|---|---|---|
| 💰 Syvo | Organiza o dinheiro, cria metas, ensina a investir e ajuda a preparar o imposto de renda. | Disponível | [syvo-solution](https://github.com/kauavfialho/syvo-solution) |
| 💻 Gestão do computador | Cuida do computador e ajuda a fazer backup dos arquivos. | Em obras | Em breve |
| 🗓️ Gestão da vida | Organiza rotina, tarefas e objetivos. | Em obras | Em breve |
| 💪 Dieta e treinos | Acompanha alimentação, academia e treinos. | Em obras | Em breve |

## Baixar

Escolha o arquivo na página [Releases](https://github.com/kauavfialho/vital-solutions/releases/latest).

| Sistema | Instalador | Portátil, sem instalar |
|---|---|---|
| Windows | `Vital-Solutions-x.x.x-win-x64.exe` | `Vital-Solutions-x.x.x-win-x64-portable.exe` |
| Mac com Apple Silicon (M1 ou mais novo) | `Vital-Solutions-x.x.x-mac-arm64.dmg` | `Vital-Solutions-x.x.x-mac-arm64.zip` |
| Mac com Intel | `Vital-Solutions-x.x.x-mac-x64.dmg` | `Vital-Solutions-x.x.x-mac-x64.zip` |

O app não tem certificado pago, então o sistema avisa na primeira vez.

**Mac:** se aparecer um aviso de que o app não pode ser aberto, vá em Ajustes do Sistema, Privacidade e Segurança, e clique em "Abrir Mesmo Assim". Se o aviso disser que o app está danificado, rode no Terminal:

```bash
xattr -cr "/Applications/Vital Solutions.app"
```

**Windows:** na tela azul do SmartScreen, clique em "Mais informações" e depois em "Executar assim mesmo".

## Para quem desenvolve

Para adicionar um aplicativo, siga o guia [Como colocar um aplicativo no Vital Solutions](docs/ADICIONAR-APP.md).


```bash
npm install
```

```bash
npm start
```

```bash
npm test
```

Para publicar uma versão, atualize `version` no `package.json` e envie uma tag `v*`.

## Licença

MIT.
