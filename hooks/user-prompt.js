#!/usr/bin/env node
/* UserPromptSubmit hook v2
 * Injects strong context for ALL output (code AND markdown)
 * Adds EARS, planning rules, test protocol reminder
 */
const fs = require('fs')
const path = require('path')
const os = require('os')

const SKILL = path.join(os.homedir(), '.claude', 'skills', 'code-craftsman')
const FLAG = path.join(SKILL, 'state', 'enabled.flag')
const SESSION = path.join(SKILL, 'state', 'session.json')

function isEnabled() {
  if (!fs.existsSync(FLAG)) return false
  try {
    const s = JSON.parse(fs.readFileSync(SESSION, 'utf8'))
    if (s.paused_until && new Date(s.paused_until) > new Date()) return false
    return true
  } catch { return false }
}

async function main() {
  if (!isEnabled()) return process.exit(0)

  let input = ''
  for await (const chunk of process.stdin) input += chunk
  let prompt = ''
  try { prompt = JSON.parse(input).prompt || '' } catch {}

  const promptLower = prompt.toLowerCase()
  const isPlanning = /plan|planejamento|architecture|design|escrev.*\.md|markdown/i.test(prompt)
  const isCoding = /implement|code|escrev.*funç|build|criar arquivo/i.test(prompt)

  const bypassed = (() => {
    try {
      const s = JSON.parse(fs.readFileSync(SESSION, 'utf8'))
      return s.bypassed_rules || []
    } catch { return [] }
  })()

  const bypassNote = bypassed.length > 0
    ? `\n⚠️ Bypassed rules: ${bypassed.join(', ')}`
    : ''

  let reminder = `[code-craftsman v2 ACTIVE] HARD RULES:

## OUTPUT (toda resposta — código E markdown)
- Caveman compulsório: drop articles/filler/pleasantries
- Tabelas > prosa
- Fragmentos OK
- Code blocks intactos
- Resposta direta ≤300 chars idealmente

## CODE
- Function ≤20 lines, ≤2 params, ≤2 indent
- File ≤500 lines, line ≤120 chars
- No Manager/Util/Helper/Processor names
- No I-prefix interfaces
- No interface without 2nd impl
- No UseCase for CRUD
- No commented code (delete — git keeps)
- TDD: test BEFORE code (RED→GREEN→REFACTOR)

## ARCHITECTURE
- Flat-first: 3 files per feature (entry/logic/persistence)
- Modular monolith: pasta por domínio
- No cross-domain imports
- YAGNI > Clean Arch ritual
- Abstrai por dor real, nunca preventivo`

  if (isPlanning) {
    reminder += `

## PLANNING MODE DETECTED — extra rules
- Plano técnico: ≤500 linhas TOTAL
- Estrutura obrigatória: Contexto → Stack (tabela) → Arch (tree) → Schemas (código) → Endpoints (tabela) → Components (tree) → Milestones (tabela) → Trade-offs (tabela) → Tests (matriz)
- PROIBIDO: parágrafos >3 linhas, "Note that...", repetir tabelas em prosa
- Requisitos em formato EARS:
  - Event: "When X, the Y shall Z"
  - State: "While X, the Y shall Z"
  - Unwanted: "If X, then the Y shall Z"
- Toda feature DEVE listar tests:
  - Unit (Vitest, RED first)
  - Snapshot (auto se UI render)
  - Contract (auto se HTTP externo, Zod schema)
  - E2E (opt-in — perguntar pós impl)
  - Mutation (Stryker ≥70%)
  - Coverage ratchet ≥80% novo código
- TDD obrigatório explicitado em CADA milestone — não genérico no final`
  }

  if (isCoding) {
    reminder += `

## CODING MODE DETECTED — extra rules
- Sequência: 1) test failing (RED) → 2) min code passes (GREEN) → 3) refactor
- Sem teste prévio = bloqueia (hook pre-edit)
- Auto-trigger: HTTP externo → contract test (Pact/MSW + Zod)
- Auto-trigger: UI render → snapshot inline ≤50 linhas
- Comentário só explica WHY (motivação), não WHAT
- Manter comentários de agentes anteriores (contexto p/ próximos)`
  }

  reminder += `

## ANTI-LAZY (resistir preguiça LLM)
- Não simplificar 1ª resposta — usar conhecimento real direto
- Não pseudo-código quando código real possível
- Não múltiplas opções ao invés de decidir
- Não TODO sem implementar (usa // SPIKE: se exploratório)
- Questionar TODA interface/UseCase/DTO/Mapper proposto

${bypassNote}`

  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'UserPromptSubmit',
      additionalContext: reminder,
    },
  }))
  process.exit(0)
}

main().catch(() => process.exit(0))
