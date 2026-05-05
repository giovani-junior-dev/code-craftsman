# 🔨 code-craftsman

> **Always-on quality enforcement for Claude Code.**
> Forces real engineering discipline. Blocks LLM laziness, over-engineering, vibe coding, redundancy.
> Enforces TDD, Clean Code, flat-first architecture, EARS requirements, mutation testing.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Skill](https://img.shields.io/badge/Claude_Code-Skill-blue)](https://docs.claude.com/en/docs/claude-code)
[![Caveman](https://img.shields.io/badge/style-caveman-orange)](https://github.com/JuliusBrussee/caveman)

---

## ⚠️ Why this skill exists

LLMs (Claude, GPT, Opus) **have deep knowledge** of software engineering. But they're trained to iterate — generate simple answer first, wait for you to correct, burn more tokens. More iteration = more revenue for AI companies.

Result: you pay for code worse than what the model can produce.

**This skill forces LLM to use real knowledge from the 1st response:**

- ❌ Blocks lazy patterns (`Manager`, `Util`, `IRepository` without 2nd impl, `UseCase` for CRUD)
- ❌ Blocks over-engineering (ritualistic Clean Arch, 18 files for 1 feature)
- ❌ Blocks code without tests (TDD non-negotiable)
- ❌ Blocks quality regression (Quality Gate ratchet)
- ✅ Forces flat-first, YAGNI, abstract by real pain
- ✅ Compresses output (no fluff/pleasantries)
- ✅ Auto-trigger snapshot/contract/mutation tests
- ✅ E2E opt-in with recorded ADR

---

## 📊 Measured results

Real test comparing delivery app plan (same prompt, same stack):

| Metric | Without skill | With skill |
|---|---|---|
| Plan lines | 783 | **463** (-29%) |
| EARS requirements | 0 | **7** |
| Mutation testing | ❌ | ✅ |
| Snapshot/contract auto-trigger | ❌ | ✅ |
| TDD explicit mandate | partial | **complete** |
| E2E opt-in protocol | ❌ | ✅ |

**Effectiveness:** 92% — forces real discipline without becoming formatting tyranny.

---

## 🚀 Installation

### Claude Code

#### Option 1 — Direct clone (recommended)

```bash
git clone https://github.com/giovani-junior-dev/code-craftsman.git ~/.claude/skills/code-craftsman
```

Restart Claude Code. Skill appears in any session.

#### Option 2 — As plugin (future)

```bash
# When published to marketplace
claude plugin install code-craftsman
```

### Cursor / Windsurf / Cline / Copilot

Skill follows universal `SKILL.md` spec. Works in any agent that supports it:

```bash
# Cursor
mkdir -p ~/.cursor/skills/
git clone https://github.com/giovani-junior-dev/code-craftsman.git ~/.cursor/skills/code-craftsman

# Windsurf
git clone https://github.com/giovani-junior-dev/code-craftsman.git ~/.codeium/windsurf/skills/code-craftsman

# Cline
git clone https://github.com/giovani-junior-dev/code-craftsman.git ~/.cline/skills/code-craftsman
```

### Gemini CLI

```bash
gemini extensions install https://github.com/giovani-junior-dev/code-craftsman
```

### Codex CLI

```bash
codex skill add https://github.com/giovani-junior-dev/code-craftsman
```

### Generic (npx skills)

```bash
npx skills add giovani-junior-dev/code-craftsman -a <agent>
```

---

## 🎯 Per-project setup (optional, recommended)

After global skill install, activate quality gate in a Node.js/TypeScript project:

```bash
cd /path/to/your-project
bash ~/.claude/skills/code-craftsman/install.sh
```

**What it does:**
- Installs dev deps: biome, knip, stryker, dependency-cruiser, jscpd, madge, msw, zod
- Configures hooks in `.claude/settings.json`
- Adds visual statusline
- Creates `.code-craftsman/baseline.json` with initial metrics
- Adds npm scripts: `craftsman:check`, `craftsman:full`, etc

**After install:**
```bash
npm run craftsman:check    # Quality gate
npm run craftsman:full     # Macro validation (mutation + security + ratchet)
npm run craftsman:baseline # Reset baseline after intentional improvement
```

---

## 🎮 Available commands

### Toggle and state

| Command | Function |
|---|---|
| `/code-craftsman:on` | Activate skill |
| `/code-craftsman:off` | Disable in this session |
| `/code-craftsman:pause 30m` | Temporary pause |
| `/code-craftsman:status` | State + metrics |
| `/code-craftsman:bypass <rule> <reason>` | Specific bypass (creates ADR) |

### Operations

| Command | Function |
|---|---|
| `/code-craftsman:install` | Install in current project |
| `/code-craftsman:report` | Full report |
| `/code-craftsman:baseline-update` | Freeze new baseline |
| `/code-craftsman:e2e-decide <feature>` | Ask about E2E + create ADR |

---

## 📐 Enforced rules

### Functions
- ≤20 lines
- ≤2 indentation levels
- ≤2 parameters (3+ → encapsulate in object)
- No boolean flag parameter

### Files
- ≤500 lines total (avg ~200)
- ≤120 chars per line
- ≤15 imports

### Naming (BLOCKED)
- ❌ `Manager`, `Processor`, `Handler`, `Util`, `Helper` (generic)
- ❌ `I` prefix on interfaces (`IRepository`)
- ❌ `m_`, `_private`, Hungarian Notation
- ❌ Suffixes: `NameString`, `UserData`, `OrderInfo`

### Architecture (BLOCKED)
- ❌ Interface without 2nd real implementation
- ❌ UseCase for simple CRUD
- ❌ DTO/Mapper in 3+ layers without real pain
- ❌ Preventive dependency inversion (YAGNI)
- ❌ Cross-domain imports (`billing/` imports `orders/`)

### Tests
- TDD mandatory (RED → GREEN → REFACTOR)
- ≥80% coverage on modified files
- ≥70% mutation score (Stryker)
- 1 assert/test, ≤100ms unit
- F.I.R.S.T compliance
- Auto-trigger:
  - UI render → snapshot test
  - External HTTP → contract test (Pact/MSW + Zod)
  - Financial logic → mutation test
  - E2E → opt-in (asks after feature complete)

### Quality Gate Ratchet (only goes up or holds)
- Lint violations: cannot rise
- Code duplication: cannot rise
- Cyclomatic complexity: cannot rise
- File size violations: cannot rise
- Test coverage: only holds or rises

---

## 🧪 Per-feature test protocol

```
1. EARS requirement (When/shall format)
2. ATDD acceptance test (failing)
3. TDD unit loop (red-green-refactor)
4. Auto-trigger:
   ├─ UI render? → snapshot test
   ├─ External call? → contract test
   └─ Continue with unit only
5. Mutation testing (Stryker ≥70%)
6. Coverage ratchet (changed files ≥80%)
7. F.I.R.S.T compliance check
8. E2E question (opt-in with ADR)
9. Final quality gate ratchet
10. PR
```

---

## 🆘 SPIKE marker (only TDD exception)

For temporary exploration:

```typescript
// SPIKE: validating Stripe Connect for split payment merchants — expires 2026-05-12
// SPIKE-ISSUE: #234

// exploratory code without tests
```

**Strict rules (enforced):**
- Reason ≥15 chars, non-generic (forbidden: `testing`, `wip`, `tmp`)
- Expiration ≤7 days
- Issue # required
- After expires → blocks editing (force conversion to real or delete)
- Branch `spike/*` forbidden to merge into main

---

## 📊 Statusline

Real-time visual indicator:

```
🔨 craftsman ON │ ratchet ✓ │ cov 82% │ mut 74% │ lint 0 │ ⚡ -47% tok
```

| State | Appearance |
|---|---|
| Active + green | `🔨 craftsman ON │ ratchet ✓ │ cov 82%` |
| Active + regression | `🔨 craftsman ON │ ⚠️ ratchet FAIL` |
| Paused | `🔨 craftsman ⏸ paused 24m` |
| Disabled | `🔨 craftsman OFF` |
| Bypass active | `🔨 craftsman ON │ ⚠ 2 bypass` |

---

## 🏗️ Project structure

```
code-craftsman/
├── SKILL.md                    # Always-active manifesto
├── README.md                   # This file
├── install.sh                  # Per-project installer
├── LICENSE                     # MIT
│
├── scripts/                    # 12 Node.js scripts
│   ├── toggle.sh, pause.sh, bypass.sh
│   ├── statusline.sh
│   ├── quality-gate.js, baseline-init.js, metrics-collector.js
│   ├── self-validate.js, coverage-ratchet.js
│   ├── tdd-enforcer.js, first-checker.js
│   ├── snapshot-validator.js, contract-detector.js
│   └── e2e-prompt.js
│
├── hooks/                      # 4 Claude Code hooks
│   ├── pre-edit.js             # PreToolUse Write|Edit
│   ├── post-edit.js            # PostToolUse Write|Edit
│   ├── user-prompt.js          # UserPromptSubmit
│   └── stop.js                 # Stop hook
│
├── config/                     # 6 configs
│   ├── thresholds.json
│   ├── biome.json
│   ├── dependency-cruiser.cjs
│   ├── stryker.config.json
│   ├── knip.json
│   └── baseline.template.json
│
├── templates/                  # 11 templates
│   ├── ears-requirement.md
│   ├── adr.md
│   ├── tdd-cycle.md
│   ├── unit-test.template
│   ├── snapshot-test.template
│   ├── contract-test.template
│   ├── e2e-playwright.template
│   ├── e2e-decision-adr.md     # Structured ADR
│   ├── spike-marker.md         # SPIKE protocol
│   ├── acceptance-test.template
│   └── module-flat.template
│
├── references/                 # 6 knowledge base files
│   ├── clean-code-rules.md
│   ├── anti-patterns.md
│   ├── architecture-rules.md
│   ├── tdd-protocol.md
│   ├── test-strategy.md
│   └── llm-laziness-guard.md
│
├── commands/                   # 9 slash commands
│   ├── on.md, off.md, pause.md
│   ├── status.md, bypass.md
│   ├── report.md, baseline-update.md
│   ├── install.md, e2e-decide.md
│
└── state/                      # Runtime state
    ├── enabled.flag
    ├── session.json
    └── stats.json
```

**Total:** ~57 files, ~240KB

---

## 🛠️ Integrated tools stack

The skill orchestrates these free tools:

| Tool | Function |
|---|---|
| **Biome** | Lint+format (Rust-based, 10x faster than ESLint+Prettier) |
| **Knip** | Dead code, circular deps, duplication |
| **Stryker** | Mutation testing (tests the quality of your tests) |
| **Vitest/Jest** | Test runner |
| **dependency-cruiser** | Arch boundaries (forbids cross-imports) |
| **Madge** | Circular deps visualization |
| **Pact** | Consumer-driven contracts |
| **MSW** | Mock Service Worker (HTTP in tests) |
| **Zod / TypeBox** | Runtime schema validation |
| **Playwright** | E2E (opt-in) |
| **Semgrep** | Security scanning (optional) |
| **Gitleaks** | Secrets detection (optional) |

---

## 📚 Research sources

Skill built from research on:

- **[Lucas video — Why I no longer Review AI](https://www.youtube.com/watch?v=qToBgU8K4Ms)** — ratchet, baseline, AI babysitting its own PR
- **[Fabio Akita Flow #588](https://www.youtube.com/watch?v=4c7pbOxYn_A)** — harness > LLM, junior dev mindset, "AI reflects who you are"
- **[Clean Architecture in the AI era](https://www.youtube.com/watch?v=qLEg0PLWj2k)** — flat-first, strategic DDD, abstract by pain
- **Clean Code (Robert C. Martin)** — measurable rules: names, functions, classes, tests, smells
- **[mattpocock/skills](https://github.com/mattpocock/skills)** — 16 skills (TDD, diagnose, grill-with-docs, etc)
- **[JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman)** — 65% output token reduction

Full research documented via NotebookLM.

---

## 🤝 Contributing

PRs welcome. Areas of interest:

- Multi-language support (Python/Go/Rust)
- Adapters for other IDEs (JetBrains, VS Code extension)
- CI/CD integration (GitHub Actions workflow template)
- Mutation testing for other languages
- SKILL.md internationalization
- Additional tests validating enforcement

### Dev setup

```bash
git clone https://github.com/giovani-junior-dev/code-craftsman.git
cd code-craftsman

# Test scripts in isolation
node scripts/tdd-enforcer.js test-file.ts
bash scripts/statusline.sh
```

### Philosophy

This skill applies its own rules to itself. PRs must:
- Follow caveman style in commits and PRs
- Not introduce abstraction without real pain (YAGNI)
- Add tests where applicable
- Keep scripts ≤500 lines

---

## 🎯 Roadmap

- [x] v1 — Core: hooks, configs, Clean Code rules
- [x] v2 — Planning enforcement (EARS, mutation, snapshot/contract triggers)
- [x] v2.1 — Strict SPIKE protocol, structured E2E ADR
- [ ] v3 — Multi-language (Python pytest, Go test)
- [ ] v3.1 — Cloud integrations (GitHub Actions, GitLab CI)
- [ ] v4 — Plugin marketplace publication

---

## ⚖️ Supreme principle

> Simple code = easy to refactor
> This skill prefers **simple-working** over **elegant-broken**

YAGNI > ritualistic Clean Architecture
Measure > opine
Force quality from 1st response > iterate

---

## 📜 License

MIT — see [LICENSE](./LICENSE)

---

## 🙏 Inspiration

> "The only way to go fast is to go well."
> — Robert C. Martin

> "AI reflects who you are."
> — Fabio Akita

> "Why use many token when few do trick."
> — caveman philosophy
