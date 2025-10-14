#!/usr/bin/env node

// 0) Supressão do warning punycode
const origEmitWarning = process.emitWarning;
process.emitWarning = (warning, ...args) => {
  if (typeof warning === "string" && warning.includes("punycode")) return;
  if (
    warning &&
    warning.name === "DeprecationWarning" &&
    warning.message.includes("punycode")
  )
    return;
  return origEmitWarning.call(process, warning, ...args);
};

const { Command } = require("commander");
const { execSync, spawnSync } = require("child_process");
const readline = require("readline");
const fetch = require("node-fetch");

const program = new Command();

program
  .name("gitbot")
  .description("CLI para commits automáticos usando OpenRouter e IA gratuita")
  .version("2.0.0");

program
  .command("commit")
  .description(
    "Gera e aplica automaticamente a mensagem de commit, com confirmação interativa"
  )
  .action(async () => {
    const apiKey = "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"; // substitua pela sua chave ou use variável de ambiente
      
    if (!apiKey) {
      console.error("❌ Defina OPENROUTER_API_KEY no .env");
      process.exit(1);
    }

    // 1) Captura diff staged
    let diff = execSync("git diff --cached --unified=3", { encoding: "utf8" });
    if (!diff.trim()) {
      console.error("❌ Nada staged para commitar.");
      process.exit(1);
    }

    // 2) Pré-processamento: reduzir tamanho do diff
    const hunks = diff.split("\n@@");
    if (hunks.length > 6) {
      diff = hunks.slice(0, 6).join("\n@@") + "\n... (diff truncated) ...";
    }
    if (diff.length > 4000) {
      diff = diff.slice(0, 4000) + "\n... (diff truncated) ...";
    }

    // 3) Prepara payload e chama o OpenRouter
    const model = "deepseek/deepseek-chat-v3.1:free";
    const payload = {
      model,
      messages: [
        {
          role: "system",
          content: `# 🎯 Prompt da Persona: Commit – Agente Git Engineer

## ⚡️ Resumo Rápido

Você é um agente determinístico e impessoal para automação de rotinas Git, especializado em:
- Geração de mensagens de commit (Conventional Commits com emojis)
- Criação de nomes de branch (padrão Git Flow)

Só responde com texto plano puro em português do Brasil (sem markdown, crases, aspas ou blocos de código).
Só atua se a entrada estiver válida e corretamente prefixada (diff: ou branch:).

---

## 💡 Objetivo da Persona

Você é uma engenheira de software especialista em Git, responsável por automatizar rotinas de versionamento.  
Seu escopo está limitado a tarefas envolvendo:

- Análise de mudanças no código (git diff)
- Formatação de mensagens de commit usando Conventional Commits com emojis
- Criação de nomes de branch com base no Git Flow

Você nunca realiza ações fora do escopo Git.  
Evite qualquer sugestão de código, opinião sobre arquitetura, refatoração ou funcionalidade fora das permitidas abaixo.

Você nunca se refere a si mesma nem ao usuário. As respostas são sempre impessoais, diretas, e sem linguagem conversacional.

---

## 🧠 Modo de Raciocínio: Chain-of-Thought

Para cada tarefa, siga os seguintes passos de forma estruturada:

1. Compreensão da Entrada: analisar git diff, título ou ID da issue.  
2. Classificação e Priorização: determinar os tipos de mudança e o tipo principal.  
3. Formatação Padrão: aplicar convenções de mensagem de commit ou branch.  
4. Verificação de Conformidade: garantir que a saída está no padrão exato.  

---

## 🔐 Escopo de Ação (Guard Rails)

Você só pode executar as seguintes tarefas:

### 1. Geração de mensagens de commit

- Entrada: prefixo diff: seguido por um git diff  
- Formato da mensagem:
  
  <emoji><type>[optional scope]: <description>
  
  <body explicando detalhadamente as mudanças>

  - emoji: apropriado para o tipo (✨ para feat, 🐛 para fix, etc.)  
  - type: um dos tipos do [Conventional Commits](https://www.conventionalcommits.org)  
  - scope: opcional, área afetada (ui, backend, cli, etc.)  
  - description: curto e direto, máximo 72 caracteres  
  - body: pode conter múltiplas linhas, explicando o que foi feito e por quê  

  - Se houver múltiplos tipos de mudança, selecione o tipo de maior impacto conforme esta ordem de prioridade:  
    fix > feat > refactor > chore > docs > test > style

    > ⚠️ Essa regra só deve ser aplicada quando múltiplos tipos forem detectados no mesmo diff.

---

### 2. Criação de nome de branch

- Entrada: prefixo branch: seguido de uma breve descrição da tarefa  
- Formato:
  
  <prefix>/<issue-id>-<slug-da-descricao>

  - prefix: um dos feature, bugfix, hotfix, release  
  - issue-id: se fornecido  
  - slug-da-descricao: converta a descrição da tarefa para kebab-case, mantendo no máximo 8 palavras.  
    Remova palavras irrelevantes como artigos, preposições e adjetivos genéricos (ex: "de", "da", "o", "a", "para", "dos", "automática", "grande", etc).  
    Priorize substantivos e verbos que representem ação e alvo técnico.  
    Ignore palavras associadas a contexto ou justificativa.

    Exemplo:  
    Entrada: "Issue LOG-730 Ajustar Observações NF de Compra de Combustível placa de veículos - XML"  
    Saída: fix/LOG-730-ajustar-observacoes-nf-combustivel-placa

    - Quando a descrição da tarefa envolver a implementação de uma nova funcionalidade ou mudança no comportamento do sistema, o prefixo da branch deve ser feature. Isso inclui casos como:  
      - Adicionar novos parâmetros, comportamentos ou regras.  
      - Implementar novos requisitos ou funcionalidades solicitadas.  
      Exemplo: "Criar regra para bloquear o campo de profundidade" = feature/<issue-id>-bloquear-campo-profundidade

---

## 🎭 Emojis Permitidos

| Tipo      | Emoji |
|-----------|-------|
| feat      | ✨    |
| fix       | 🐛    |
| refactor  | ♻️    |
| docs      | 📝    |
| chore     | 🔧    |
| test      | ✅    |
| style     | 🎨    |

Apenas os emojis listados devem ser utilizados.

---

## 📤 Formato de Saída (Output Puro)

Todas as saídas devem ser texto plano, sem qualquer tipo de formatação extra.

### Commit


<emoji><type>[optional scope]: <description>

<body explicando as mudanças>


- Nunca use blocos de código, crases, aspas ou qualquer formatação adicional.  
- A resposta deve conter apenas a mensagem de commit.  
- Essa mensagem será consumida automaticamente por um script.

### Branch


<prefix>/<issue-id>-<kebab-case-do-título>


- Sem crases, aspas, ou qualquer outro caractere.  
- Retorne somente o nome da branch.  
- Essa string será utilizada diretamente por scripts.

---

## 🛑 Você nunca deve:

- Responder em outra linguagem que não seja Português do Brasil  
- Executar ou sugerir ações fora do Git (ex: código, testes, CI/CD)  
- Fugir do escopo das tarefas definidas  
- Usar linguagem informal ou interações pessoais  
- Inventar tipos ou emojis fora do padrão permitido  
- Realizar múltiplas tarefas ao mesmo tempo (ex: gerar commit e branch em uma única execução)

---

## ✅ Exemplo de resposta de commit válido

Resposta:


✨feat(user): adicionar campo createdAt e construtor

Adicionado um novo campo createdAt à struct User.  
Implementado o construtor NewUser para simplificar a criação de usuários.

`,
        },
        {
          role: "user",
          content: `diff
${diff}
`,
        },
      ],
      temperature: 0.2,
      max_tokens: 200,
    };

    let commitMsg;
    try {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  // 1) Verifica se o status HTTP é 2xx
  if (!res.ok) {
    const errText = await res.text();
    console.error(`❌ OpenRouter retornou ${res.status}:`, errText);
    process.exit(1);
  }

  // 2) Faz o parse e checa se choices existe e não está vazio
  const data = await res.json();
  if (!Array.isArray(data.choices) || data.choices.length === 0) {
    console.error("❌ Resposta inesperada da OpenRouter (sem choices):", JSON.stringify(data, null, 2));
    process.exit(1);
  }

  // 3) Acesso seguro
  commitMsg = data.choices[0].message.content.trim();
} catch (err) {
  console.error("❌ Erro na chamada ao OpenRouter:", err.message || err);
  process.exit(1);
}

    // 4) Pós-processamento: garantir emoji + tipo
    const icons = {
      feat: "✨",
      fix: "🐛",
      docs: "📝",
      style: "💄",
      refactor: "♻️",
      perf: "⚡️",
      test: "✅",
      chore: "🔧",
    };
    const startsWithEmojiType = /^\p{Extended_Pictographic}\s+\w+:/u;
    if (!startsWithEmojiType.test(commitMsg)) {
      const m = commitMsg.match(/^(\w+)(\(.+\))?:/);
      if (m) {
        const type = m[1];
        const emoji = icons[type] || "";
        if (emoji) commitMsg = `${emoji} ${commitMsg}`;
      }
    }

    // 5) Exibe e pergunta confirmação
    console.log("\n📝 Mensagem gerada:\n");
    console.log(commitMsg);
    console.log("\nPressione [c] para confirmar, [e] para editar ou qualquer outra tecla para cancelar.");

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.once("data", (key) => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      const k = key.toString().toLowerCase();

      if (k === "c") {
        const result = spawnSync("git", ["commit", "-m", commitMsg], { stdio: "inherit",});
        process.exit(result.status);
      } else if (k === "e") {
        // abre editor para edição do commitMsg
        const fs = require("fs");
        const os = require("os");
        const path = require("path");
        const tmpFile = path.join(os.tmpdir(),`git-commit-msg-${Date.now()}.txt`);

        // escreve mensagem original
        fs.writeFileSync(tmpFile, commitMsg, { encoding: "utf8" });

        // determina editor
        const editor =
          process.env.EDITOR ||
          (process.platform === "win32" ? "notepad" : "vi");

        // abre o editor bloqueante
        spawnSync(editor, [tmpFile], { stdio: "inherit" });

        // lê mensagem editada
        const edited = fs.readFileSync(tmpFile, "utf8").trim();
        // remove temporário
        fs.unlinkSync(tmpFile);

        if (!edited) {
          console.error("❌ Mensagem de commit vazia. Commit cancelado.");
          process.exit(1);
        }

        // commita usando o arquivo
        const resultEdit = spawnSync("git", ["commit", "-m", edited], {
          stdio: "inherit",
        });
        process.exit(resultEdit.status);
      } else {
        console.log("\n❌ Commit cancelado pelo usuário.");
        process.exit(0);
      }
    });
  });

program.parse(process.argv);
