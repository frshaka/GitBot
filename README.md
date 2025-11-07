# GitBot

CLI para gerar mensagens de commit com IA via OpenRouter, seguindo Conventional Commits com emojis. Suporta configuração rápida de chave e modelo, e fluxo interativo de confirmação.

## Instalação

### Linux

```
sudo curl -L https://github.com/frshaka/GitBot/releases/download/v2.0.1/gitbot-linux-x64 -o /usr/local/bin/gitbot
sudo chmod +x /usr/local/bin/gitbot
gitbot -help
```

### macOS

```
sudo curl -L https://github.com/frshaka/GitBot/releases/download/v2.0.1/gitbot-macos-x64 -o /usr/local/bin/gitbot
sudo chmod +x /usr/local/bin/gitbot
# se o Gatekeeper bloquear
xattr -d com.apple.quarantine /usr/local/bin/gitbot
gitbot -help
```

### Windows

```
$dest = "$env:USERPROFILE\bin"
New-Item -ItemType Directory -Force -Path $dest | Out-Null
Invoke-WebRequest "https://github.com/frshaka/GitBot/releases/download/v2.0.1/gitbot-win-x64.exe" -OutFile "$dest\gitbot.exe"
$path = [Environment]::GetEnvironmentVariable("Path", "User")
if (-not $path.Split(";") -contains $dest) {
  [Environment]::SetEnvironmentVariable("Path", "$path;$dest", "User")
}
# abra um novo terminal
gitbot -help
```

## Configuração

Defina a chave apikey:
```
gitbot key sk-orv1-sua_chave
```

Defina o modelo de IA que será utilizado:
```
gitbot model anthropic/claude-3.5-sonnet
```

Ordem de leitura, primeiro variáveis de ambiente, depois git config.
OPENROUTER_API_KEY, fallback para git config --global gitbot.key
GITBOT_MODEL, fallback para git config --global gitbot.model

## Uso

Dentro de um repositório Git com alterações `staged`, execute:
```
git add .
gitbot commit
```
O comando envia o diff ao modelo de IA, exibe a mensagem sugerida e aguarda confirmação para realizar o commit. Pressione `c` para confirmar `e` para editar com seu editor de textos padrão ou qualquer outra tecla para cancelar.

## Alternativas de instalação
Instalação global a partir do fonte.
```
npm install -g .
gitbot -help
```

## Solução de problemas

1. Erro 401, verifique se a chave começa com sk-orv1, sem espaços extras.
2.Modelo sem permissão, teste anthropic/claude-3.5-sonnet ou openrouter/auto.
3.No Windows, reabra o terminal após adicionar a pasta ao PATH.
4.Evite commitar .env com credenciais, prefira gitbot key.
5.Se o pkg gerar binários com nomes diferentes, atualize os links da release.

## Atualizações
Baixe a nova versão na página de releases, substitua o binário instalado, e repita os passos de instalação.

## Sobre
O script principal encontra-se em `bin/gitbot.js` e utiliza as bibliotecas `commander` e `node-fetch`.

---
