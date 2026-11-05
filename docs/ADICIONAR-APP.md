# Como colocar um aplicativo no Vitall Launcher

Guia para levar um projeto novo, como o gerenciador de computador, para o launcher. Serve para quem desenvolve e para um assistente de IA que continue o trabalho em outro computador.

## Como os projetos se organizam

- Cada aplicativo tem o seu próprio repositório público no GitHub de `kauavfialho`.
- O `vitall-launcher` é só o launcher. Ele instala, abre e atualiza os outros aplicativos.
- O Syvo é o exemplo pronto: [syvo](https://github.com/kauavfialho/syvo).

## O que o aplicativo precisa ter

1. Um repositório público, com licença MIT e README em dois idiomas: `README.md` em inglês, que é o padrão, e `README.pt-BR.md` em português, com o seletor de idioma no topo.
2. Uma Release com tag no formato `vX.Y.Z`, sem nada depois do número.
3. Estes arquivos em cada Release:

| Arquivo | Para quê |
|---|---|
| `Nome-mac-arm64.dmg` | Instalador do Mac com Apple Silicon |
| `Nome-mac-x64.dmg` | Instalador do Mac com Intel |
| `Nome-win-x64.exe` | Instalador do Windows, que aceita instalação silenciosa com `/S` |
| `latest-mac.yml` e `latest.yml` | Códigos SHA-512 que o launcher confere antes de instalar |
| `Nome-mac-arm64.zip`, `Nome-mac-x64.zip` e `Nome-win-x64-portable.exe` | Versões portáteis, para baixar sem instalar |

Os nomes não levam a versão de propósito: assim o link `releases/latest/download/` nunca quebra e o README pode ter download direto.

Com Electron e `electron-builder`, os arquivos `latest*.yml` saem sozinhos. Copie a seção `build` do `package.json` e o `.github/workflows/instaladores.yml` deste repositório, e troque o nome do aplicativo.

Se o aplicativo não usar Electron, ele precisa gerar os mesmos arquivos. O launcher lê o SHA-512 de cada instalador no `latest*.yml`, no formato `- url:` seguido de `sha512:` em base64.

## Como ligar ao launcher

Em `electron/catalogo.js`, troque o cartão de `em-obras` para `disponivel`:

```js
{
  id: 'computador', nome: 'Gestão do computador', icone: '💻', estado: 'disponivel',
  descricao: 'Cuide do seu computador e faça backup dos seus arquivos.',
  repo: 'kauavfialho/NOME-DO-REPOSITORIO',
  bundleMac: 'Nome.app',
  pastaWin: 'nome-do-pacote',
  exeWin: 'Nome.exe'
}
```

- `bundleMac` é o nome do aplicativo em Aplicativos.
- `pastaWin` é o `name` do `package.json`. O launcher procura o app em `%LOCALAPPDATA%\Programs\<pastaWin>\<exeWin>`.

Depois, atualize:

- a tabela de aplicativos no `README.md`, com o link do novo repositório;
- o teste do catálogo em `testes/regras.test.js`;
- `version` no `package.json`, publicando uma nova tag `v*`.

## Combinados do projeto

- Tudo em português do Brasil: tela, textos, comentários e commits.
- Público: da criança ao idoso. Letra legível, botões com palavras e texto sem termos difíceis.
- Commits só no nome do dono do projeto, sem coautoria ou atribuição a uma IA.
- Não publique arquivos de anotação local, como `CLAUDE.md`, nem senhas, chaves ou dados pessoais.
- Antes de tornar um repositório público, procure segredos em todo o histórico do Git.
- Teste o aplicativo de verdade antes de publicar. Diga com clareza o que não foi testado.

## Como continuar em outro computador

1. Instale o GitHub CLI e faça login:

```bash
gh auth login
```

2. Abra o Claude Code na pasta do aplicativo e envie:

```text
Leia https://github.com/kauavfialho/vitall-launcher/blob/main/docs/ADICIONAR-APP.md. Quero publicar este aplicativo no GitHub seguindo esse guia e colocá-lo no launcher Vitall Launcher. Primeiro, analise o projeto e procure segredos e dados pessoais em todo o histórico do Git. Depois, me mostre o plano e o que você vai publicar antes de enviar qualquer coisa.
```
