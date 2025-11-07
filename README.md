# GitBot Commit

GibBot Commit é uma ferramenta de linha de comando que automatiza a geração de mensagens de commit utilizando IA via OpenRouter. As mensagens seguem o padrão Conventional Commits com emojis e são geradas a partir das alterações preparadas no Git.

## Instalação

1. Instale as dependências com o NPM:
   ```
   npm install -g .
   ```

2. Defina a variável `OPENROUTER_API_KEY` em um arquivo `.env` para habilitar as chamadas à API.

## Uso

Dentro de um repositório Git com alterações `staged`, execute:

```
$ gitbot commit
```

O comando envia o diff ao modelo de IA, exibe a mensagem sugerida e aguarda confirmação para realizar o commit. Pressione `c` para confirmar `e` para editar com seu editor de textos padrão ou qualquer outra tecla para cancelar.

## Sobre

O script principal encontra-se em `bin/gitbot.js` e utiliza as bibliotecas `commander` e `node-fetch`. Também há um script `instalador.iss` para criação de um instalador Windows.

---

Este projeto foi criado como ferramenta de automação de commits utilizando IA.
