# Política de segurança

## Versões com suporte

Só a versão mais recente recebe correções de segurança. Antes de relatar um problema, confira se ele também acontece nela.

## Como relatar uma falha

Não abra uma issue pública, porque isso expõe o problema antes da correção.

1. Abra a aba **Security** deste repositório.
2. Clique em **Report a vulnerability**.
3. Explique o que acontece, como repetir o problema, qual sistema e versão você usa e qual é o impacto.

O projeto é mantido por uma pessoa, em tempo livre. Não há prazo garantido de resposta, mas todo relato será lido. Depois da correção, a falha pode ser divulgada, com crédito a quem relatou, se a pessoa quiser.

## O que entra aqui

- Instalar ou atualizar um aplicativo sem a conferência do arquivo.
- Executar código por meio do launcher.
- Acessar arquivos fora do que o launcher precisa.

## Como o launcher se protege

- Não tem conta nem login, e não coleta dados.
- Baixa os aplicativos só das Releases públicas no GitHub.
- Confere o código SHA-512 de cada arquivo antes de instalar.
- Os instaladores não têm certificado pago. Por isso, o sistema mostra um aviso na primeira vez.

Falhas no Syvo e nos outros aplicativos devem ser relatadas no repositório de cada um.
