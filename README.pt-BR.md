<img src="build/icon.png" width="96" alt="">

# Vitall Launcher

**🌐 Idioma:** [English](https://github.com/kauavfialho/vitall-launcher#readme) | **Português**

Um launcher gratuito que reúne os aplicativos da Vitall Studios em um só lugar. Por ele, você instala, abre e atualiza cada um, sem ficar procurando arquivos. Cada projeto tem o seu próprio repositório.

O app está disponível em português, inglês e espanhol: é só escolher no seletor do topo.

## Aplicativos

| Aplicativo | O que faz | Situação | Projeto |
|---|---|---|---|
| 💰 Syvo | Organiza o dinheiro, cria metas, ensina a investir e ajuda a preparar o imposto de renda. | Disponível | [syvo](https://github.com/kauavfialho/syvo/blob/main/README.pt-BR.md) |
| 💻 Gestão do computador | Cuida do computador e ajuda a fazer backup dos arquivos. | Em obras | Em breve |
| 🗓️ Gestão da vida | Organiza rotina, tarefas e objetivos. | Em obras | Em breve |
| 💪 Dieta e treinos | Acompanha alimentação, academia e treinos. | Em obras | Em breve |

## Baixar

Clique no arquivo do seu computador e o download começa na hora. O link sempre traz a versão mais recente, e o tamanho é aproximado.

### Instalador (recomendado)

| Computador | Download | Tamanho |
|---|---|---|
| Windows 64 bits | [⬇️ Baixar para Windows (.exe)](https://github.com/kauavfialho/vitall-launcher/releases/latest/download/Vitall-Launcher-win-x64.exe) | 116 MB |
| Mac com chip Apple (M1, M2, M3 ou mais novo) | [⬇️ Baixar para Mac Apple (.dmg)](https://github.com/kauavfialho/vitall-launcher/releases/latest/download/Vitall-Launcher-mac-arm64.dmg) | 115 MB |
| Mac com processador Intel | [⬇️ Baixar para Mac Intel (.dmg)](https://github.com/kauavfialho/vitall-launcher/releases/latest/download/Vitall-Launcher-mac-x64.dmg) | 121 MB |

### Portátil (usa sem instalar)

| Computador | Download | Tamanho |
|---|---|---|
| Windows 64 bits | [⬇️ Baixar portátil para Windows (.exe)](https://github.com/kauavfialho/vitall-launcher/releases/latest/download/Vitall-Launcher-win-x64-portable.exe) | 105 MB |
| Mac com chip Apple (M1, M2, M3 ou mais novo) | [⬇️ Baixar portátil para Mac Apple (.zip)](https://github.com/kauavfialho/vitall-launcher/releases/latest/download/Vitall-Launcher-mac-arm64.zip) | 112 MB |
| Mac com processador Intel | [⬇️ Baixar portátil para Mac Intel (.zip)](https://github.com/kauavfialho/vitall-launcher/releases/latest/download/Vitall-Launcher-mac-x64.zip) | 117 MB |

Não sabe qual é o seu Mac? Clique na maçã, no canto da tela, e depois em **Sobre Este Mac**. No Windows, os arquivos são para sistemas de 64 bits, que é o padrão dos computadores atuais. Não há versão para Windows 32 bits.

Veja [todas as versões](https://github.com/kauavfialho/vitall-launcher/releases).

O app não tem certificado pago, então o sistema avisa na primeira vez.

**Mac:** se aparecer um aviso de que o app não pode ser aberto, vá em Ajustes do Sistema, Privacidade e Segurança, e clique em "Abrir Mesmo Assim". Se o aviso disser que o app está danificado, rode no Terminal:

```bash
xattr -cr "/Applications/Vitall Launcher.app"
```

**Windows:** na tela azul do SmartScreen, clique em "Mais informações" e depois em "Executar assim mesmo".

## Para quem desenvolve

Para adicionar um aplicativo, siga o guia [Como colocar um aplicativo no Vitall Launcher](docs/ADICIONAR-APP.md).


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
