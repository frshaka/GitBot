# GitBot - PT-BR

CLI para gerar mensagens de commit com IA via OpenRouter, seguindo Conventional Commits com emojis. Suporta configuração rápida de chave e modelo, e fluxo interativo de confirmação.

## Instalação

### Linux
```bash
sudo curl -L https://github.com/frshaka/GitBot/releases/download/v2.0.1/gitbot-linux-x64 -o /usr/local/bin/gitbot
sudo chmod +x /usr/local/bin/gitbot
gitbot -help
```

### macOS
```bash
sudo curl -L https://github.com/frshaka/GitBot/releases/download/v2.0.1/gitbot-macos-x64 -o /usr/local/bin/gitbot
sudo chmod +x /usr/local/bin/gitbot
# se o Gatekeeper bloquear
xattr -d com.apple.quarantine /usr/local/bin/gitbot
gitbot -help
```

### Windows
```powershell
$dest = "$env:USERPROFILEin"
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

Defina a chave da API:
```bash
gitbot key sk-orv1-sua_chave
```

Defina o modelo de IA:
```bash
gitbot model openai/gpt-oss-20b:free
```

Ordem de leitura, primeiro variáveis de ambiente, depois git config:
- `OPENROUTER_API_KEY`, fallback para `git config --global gitbot.key`
- `GITBOT_MODEL`, fallback para `git config --global gitbot.model`

## Uso

Dentro de um repositório Git com alterações staged:
```bash
git add .
gitbot commit
```

O comando envia o diff ao modelo de IA, exibe a mensagem sugerida e aguarda confirmação para realizar o commit. Pressione `c` para confirmar, `e` para editar no editor padrão, ou qualquer outra tecla para cancelar.

## Alternativas de instalação

Instalação global a partir do fonte:
```bash
npm install -g .
gitbot -help
```

## Solução de problemas

1. Erro 401, verifique se a chave começa com `sk-orv1`, sem espaços extras.
2. Modelo sem permissão, teste `deepseek/deepseek-chat-v3.1:free` ou `openai/gpt-oss-20b:free`.
3. No Windows, reabra o terminal após adicionar a pasta ao PATH.
4. Evite commitar `.env` com credenciais, prefira `gitbot key`.
5. Se o `pkg` gerar binários com nomes diferentes, atualize os links da release.

## Atualizações

Baixe a nova versão na página de releases, substitua o binário instalado, e repita os passos de instalação.

## Sobre

O script principal encontra-se em `bin/gitbot.js` e utiliza as bibliotecas `commander` e `node-fetch`.

---

# GitBot - English

CLI to generate commit messages with AI via OpenRouter, following Conventional Commits with emojis. Supports quick key and model configuration, and an interactive confirmation flow.

## Installation

### Linux
```bash
sudo curl -L https://github.com/frshaka/GitBot/releases/download/v2.0.1/gitbot-linux-x64 -o /usr/local/bin/gitbot
sudo chmod +x /usr/local/bin/gitbot
gitbot -help
```

### macOS
```bash
sudo curl -L https://github.com/frshaka/GitBot/releases/download/v2.0.1/gitbot-macos-x64 -o /usr/local/bin/gitbot
sudo chmod +x /usr/local/bin/gitbot
# if Gatekeeper blocks it
xattr -d com.apple.quarantine /usr/local/bin/gitbot
gitbot -help
```

### Windows
```powershell
$dest = "$env:USERPROFILEin"
New-Item -ItemType Directory -Force -Path $dest | Out-Null
Invoke-WebRequest "https://github.com/frshaka/GitBot/releases/download/v2.0.1/gitbot-win-x64.exe" -OutFile "$dest\gitbot.exe"
$path = [Environment]::GetEnvironmentVariable("Path", "User")
if (-not $path.Split(";") -contains $dest) {
  [Environment]::SetEnvironmentVariable("Path", "$path;$dest", "User")
}
# open a new terminal
gitbot -help
```

## Configuration

Set your API key:
```bash
gitbot key sk-orv1-your_key
```

Set the AI model:
```bash
gitbot model openai/gpt-oss-20b:free
```

Read order, environment variables first, then git config:
- `OPENROUTER_API_KEY`, fallback to `git config --global gitbot.key`
- `GITBOT_MODEL`, fallback to `git config --global gitbot.model`

## Usage

Inside a Git repository with staged changes:
```bash
git add .
gitbot commit
```

The command sends the diff to the AI model, shows the suggested message, and waits for confirmation to commit. Press `c` to confirm, `e` to edit in your default editor, or any other key to cancel.

## Alternative installation

Global install from source:
```bash
npm install -g .
gitbot -help
```

## Troubleshooting

1. Error 401, check if your key starts with `sk-orv1`, with no trailing spaces.
2. Model permission issue, try `deepseek/deepseek-chat-v3.1:free` or `openai/gpt-oss-20b:free`.
3. On Windows, reopen the terminal after adding the folder to PATH.
4. Avoid committing `.env` with credentials, prefer `gitbot key`.
5. If `pkg` generated different binary names, update the release links.

## Updates

Download the new version from releases, replace the installed binary, and repeat the installation steps.

## About

Main script is at `bin/gitbot.js`, it uses `commander` and `node-fetch`.


