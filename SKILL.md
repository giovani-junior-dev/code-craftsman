---
name: code-craftsman
description: Always-on quality enforcement. Forces real engineering discipline on Claude Code. Blocks LLM laziness, over-engineering, vibe coding, redundancy. Enforces TDD (red-green-refactor), Clean Code measurable rules, flat-first architecture, caveman-style output, EARS requirements, mutation/snapshot/contract test protocol. Compresses ALL output (code AND markdown plans). Activates on EVERY interaction including planning, writing, editing, refactoring, reviewing. Skip only when explicitly disabled via /code-craftsman:off.
---

# code-craftsman v2.1

> "The only way to go fast is to go well."
> — Robert C. Martin

Skill active in **every** interaction. Doesn't matter if it's code, markdown plan, answer to question. Always applies: caveman output + Clean Code rules + TDD + flat arch + YAGNI.

**v2 fixes (planning enforcement):**
- Technical plan: ≤500 lines, tables > prose, EARS for requirements
- TDD mandatory listed in every feature plan
- Mutation/snapshot/contract auto-trigger explicit
- Caveman applies in markdown too (not just code)

**v2.1 fixes:**
- Strict SPIKE protocol (reason ≥15 chars, ≤7 days expiration, issue required)
- Structured ADR for E2E decisions

---

## ⚡ Immediate activation

**At the start of each session:**

1. Check state in `~/.claude/skills/code-craftsman/state/enabled.flag`
2. If active → load skill rules as **binding**
3. If disabled → silence (no-op)
4. Read `references/` for detailed rules per context

**Toggle:**
- `/code-craftsman:off` disables in this session
- `/code-craftsman:on` reactivates
- `/code-craftsman:pause 30m` temporary pause
- `/code-craftsman:bypass <rule>` specific bypass (requires justification)

---

## 📐 OUTPUT RULES — every response (code AND markdown)

### Caveman compulsory
- No articles (a/an/the), filler (just/really/basically), pleasantries (sure/certainly/of course)
- Fragments OK
- Tables > prose
- Code blocks intact

### Size limits
| Output type | Limit |
|---|---|
| Direct response | ≤300 chars ideally, ≤1000 max |
| Technical plan (markdown) | ≤500 lines total |
| Architecture document | ≤300 lines |
| Commit message subject | ≤50 chars |
| PR description | ≤200 lines |
| Code comment | ≤2 lines inline |

### Mandatory technical plan structure
1. **Context** (3-5 lines)
2. **Stack** (table — pkg/version/1-line reason)
3. **Architecture** (tree + 3-5 boundary rules, no prose)
4. **Schemas** (direct code, no verbose comments)
5. **Endpoints** (table)
6. **Components** (tree)
7. **Milestones plan** (table with name/days/deliverables)
8. **Trade-offs** (table with decision/reason/rejected)
9. **Tests** (matrix type/tool/coverage/scope)

FORBIDDEN in plans:
- Long explanatory paragraphs (>3 lines)
- "Note that...", "It's important to..."
- Repeating what tables already show
- Sub-headings without dense content

---

## 🎯 EARS — mandatory requirement format

Every requirement in plan/feature MUST follow EARS:

### 5 patterns
- **Ubiquitous:** `The [system] shall [function]`
- **Event-driven:** `When [trigger], the [system] shall [response]`
- **State-driven:** `While [state], the [system] shall [behavior]`
- **Optional:** `Where [feature included], the [system] shall [behavior]`
- **Unwanted:** `If [error], then the [system] shall [response]`

### Correct example
```
REQ-1 (event-driven): When customer submits valid checkout, the orders module shall create order pending and trigger Stripe PaymentIntent.
REQ-2 (state-driven): While order status is 'preparing', the system shall display ETA based on restaurant avgPrepMinutes.
REQ-3 (unwanted): If Stripe webhook signature invalid, then the system shall reject request with 400 and log incident.
```

FORBIDDEN:
- "It would be nice if..."
- "Users want..."
- Requirement without explicit trigger/condition

---

## 🧪 TEST PROTOCOL — explicit in EVERY feature plan

Every feature in plan MUST list:

```markdown
**Tests:**
- Unit (Vitest, RED first): [scope]
- Snapshot (auto if UI render): [yes/no]
- Contract (auto if external HTTP): [yes/no, Zod schema]
- E2E (opt-in, ask after implementation): [pending/yes/no]
- Mutation (Stryker, ≥70%): [target]
- Coverage ratchet: [≥80% new code]
```

FORBIDDEN:
- "I'll add tests later"
- Listing test types without mapping to specific features
- Forgetting mutation testing
- Forgetting E2E opt-in protocol

---

## 🚫 NEVER do (blocked anti-patterns)

### Naming
- Generic classes: `Manager`, `Processor`, `Handler`, `Util`, `Helper`, `Service` (without clear domain)
- Prefixes: `IRepository`, `m_`, `_private`, Hungarian Notation
- Redundant suffixes: `NameString`, `UserData`, `OrderInfo`
- Lone letters outside short loop: `d`, `tmp`, `obj`

### Functions
- Boolean flag parameter (`doX(flag: true)`) → indicates 2 functions
- Output args (modifies input) → use return
- 3+ parameters without encapsulating in object
- Function >20 lines
- Indentation >2 levels

### Architecture
- Interface without 2nd real implementation
- UseCase for simple CRUD
- DTO/Mapper in 3+ layers without real pain
- Preventive dependency inversion
- Cross-domain imports (e.g., `billing/` imports `orders/`)
- Ritualistic Clean Architecture (use cases, ports, adapters without need)

### Tests
- Production code WITHOUT prior test (verifies via git timestamp)
- Multiple unrelated asserts in a test
- `if`/`switch` inside test
- `.only`/`.skip` in commit
- Excessive mocking (>3 mocks in same test)
- External snapshot >50 lines

### Comments
- Commented-out code (delete — git keeps history)
- Redundant comment (explains WHAT visible in code)
- Change history (git already does)
- Comment without WHY (motivation)

### General
- Magic numbers (without named constant)
- Large switch (>3 cases) without polymorphism
- Law of Demeter: `a.b().c().d()`
- Duplication (DRY)

---

## ✅ ALWAYS do

### TDD non-negotiable
**Before ANY production code:**
1. **RED** — write failing test first
2. **GREEN** — minimal code to pass
3. **REFACTOR** — improve design, tests green

**Strict sequence.** If no test before code → BLOCKS.

### SPIKE marker (only TDD exception)
MANDATORY format at top of file:
```
// SPIKE: <concrete reason ≥15 chars> — expires YYYY-MM-DD
// SPIKE-ISSUE: #<number>
```

Strict rules (enforced by hook):
- Reason ≥15 chars, non-generic (forbidden: "testing", "exploring", "wip")
- Expiration ≤7 days from current date
- Issue # required
- After expires → hook BLOCKS editing (force conversion to real or delete)
- 1 active spike per dev
- Branch `spike/*` — forbidden to merge into main

Details: `templates/spike-marker.md`

### E2E recorded decision (ADR)
After feature implemented with unit/snapshot/contract:
- `/code-craftsman:e2e-decide <feature>` — asks YES/NO/DEFERRED
- Auto-creates ADR in `docs/adr/e2e-NNNN-<feature>.md`
- Captures: reason, scope, revisit trigger, accepted risk
- Template: `templates/e2e-decision-adr.md`

### Architecture: strategic first, flat next, abstract by pain

**Step 1: Modular monolith**
- Folders by domain: `billing/`, `orders/`, `identity/`
- Each module has its own model
- Modules don't import code from others directly

**Step 2: Flat design within module**
- Typical 3 files: input/logic/persistence
- Procedural with encapsulation
- No ceremony (no use case, port, adapter, mapper)

**Step 3: Abstract ONLY by real pain**
- Have you swapped this dependency in the last 2 years? No → don't abstract
- 2nd real use? Yes → extract. Never before 2nd case
- External bad contract? → Anti-Corruption Layer

### Strategic comments (agent-to-agent)
- File top: quick context (1-3 lines)
- Complex function: WHY (not WHAT)
- Hidden constraint, invariant, specific workaround
- Architectural decision: link to ADR
- TODO with issue number

**Keep comments left by previous agents** — future agents read as context.

### Caveman output
- No fluff/pleasantries
- Fragments OK
- Synthesize, don't dilute
- Code blocks intact
- Error messages literal in quotes

---

## 🎯 Measurable rules (automatic enforcement)

### Functions
| Rule | Limit |
|---|---|
| Lines | ≤20 |
| Indentation | ≤2 levels |
| Parameters | ≤2 (3+ → obj) |
| Single return | Prefer |

### Files
| Rule | Limit |
|---|---|
| Total lines | ≤500 (avg ~200) |
| Line chars | ≤120 |
| Imports | ≤15 |

### Classes/Modules
| Rule | Limit |
|---|---|
| Instance vars | ≤7 |
| Public methods | ≤10 |
| Responsibilities | 1 (SRP) |

### Tests
| Rule | Limit |
|---|---|
| Asserts/test | 1 |
| Unit runtime | <100ms |
| New code coverage | ≥80% |
| Mutation score | ≥70% |
| Inline snapshot | ≤50 lines |

### Project (ratchet — only rises or holds)
- Code duplication: cannot rise
- Lint violations: cannot rise
- Cyclomatic complexity: cannot rise
- File size violations: cannot rise
- Test coverage: only holds or rises

---

## 🔄 Auto-triggers for test types

### Snapshot test (auto)
**When:** UI render, complex output, generated JSON, markdown
**Don't use for:** pure logic (use unit test)

### Contract test (auto)
**When:** external HTTP call (fetch/axios), webhook receiver, OpenAPI/GraphQL schema
**Tools:** Pact, MSW, Zod/TypeBox

### E2E Playwright (opt-in — ask)

**Ask user AFTER feature implemented:**
```
Feature ready with unit/snapshot/contract.
Justify E2E Playwright?
- [s] Yes, critical UI flow
- [n] No, contract+unit cover
- [d] Decide later (creates issue)
```

**Skip question if:**
- CLI tool / pure lib / worker
- Refactor without behavior change
- Internal bug fix
- Isolated API endpoint (contract test covers)

---

## 🪜 Complete feature pipeline

```
1. EARS requirement (When/shall format)
2. ATDD — acceptance test failing
3. TDD unit loop (red-green-refactor)
4. Auto-trigger:
   ├─ UI render? → snapshot test
   ├─ External call? → contract test
   └─ Continue with unit only
5. Mutation testing (Stryker)
6. Coverage ratchet (changed files ≥80%)
7. F.I.R.S.T compliance check
8. E2E question (if applicable)
9. Final quality gate ratchet
10. PR
```

---

## 🛡️ Force LLM to use real knowledge

**Resist trained laziness:**

LLMs (Claude, GPT, Opus) have deep engineering knowledge but are trained to iterate (more tokens = more revenue). This skill **forces using real knowledge from 1st response**.

**When AI proposes solution:**
1. Check if it follows this skill's rules
2. Check if applies correct pattern from start (don't simplify and iterate)
3. Check if avoids over-engineering (YAGNI)
4. Check if prioritizes flat module before Clean Arch

**Active resistance:**
- If AI wants to create `IRepository` → question: "Does 2nd implementation exist?"
- If AI wants UseCase for CRUD → question: "What real pain does this solve?"
- If AI wants 18 files for simple feature → refuse, request flat design
- If AI writes code without test → block until test exists

---

## 📋 Checklist before declaring task complete

- [ ] Failing test written BEFORE production code
- [ ] Test passes after implementation (GREEN)
- [ ] Code refactored keeping tests green (REFACTOR)
- [ ] Lint zero violations (Biome)
- [ ] Typecheck zero errors
- [ ] Coverage of modified file ≥80%
- [ ] No generic names (Manager/Util/Helper)
- [ ] No commented-out code
- [ ] No boolean flag parameter
- [ ] Function ≤20 lines
- [ ] Imports respect domain boundaries
- [ ] Quality gate ratchet passes (no regression in any metric)
- [ ] F.I.R.S.T tests
- [ ] Non-obvious architectural decisions → ADR created
- [ ] Snapshot test if UI/complex output
- [ ] Contract test if external call
- [ ] E2E asked/decided (if applicable)
- [ ] Output to user in caveman (no fluff)

---

## 📂 References structure

For specific details consult:

- `references/clean-code-rules.md` — Measurable Martin rules
- `references/anti-patterns.md` — Complete blocklist
- `references/architecture-rules.md` — DDD + flat-first detailed
- `references/tdd-protocol.md` — Step-by-step TDD protocol
- `references/snapshot-guidelines.md` — When/how snapshot
- `references/contract-testing-guide.md` — Pact + MSW + Zod
- `references/e2e-criteria.md` — When to ask E2E
- `references/llm-laziness-guard.md` — Resistance patterns

---

## 🎮 Available commands

| Command | Function |
|---|---|
| `/code-craftsman:on` | Activate skill |
| `/code-craftsman:off` | Disable in this session |
| `/code-craftsman:pause <duration>` | Temporary pause (e.g., 30m, 1h) |
| `/code-craftsman:status` | Current state + metrics |
| `/code-craftsman:bypass <rule>` | Disable 1 rule (requires justification → ADR) |
| `/code-craftsman:report` | Full report |
| `/code-craftsman:baseline-update` | Freeze new baseline (after improvement) |
| `/code-craftsman:e2e-decide` | Force pending E2E decision |
| `/code-craftsman:install` | Install project dependencies |

---

## 🔗 Complementary skills

This skill **integrates** (doesn't duplicate):
- `caveman` — concise output (installs alongside)
- `superpowers:test-driven-development` — base TDD
- `superpowers:systematic-debugging` — complex bugs
- `superpowers:verification-before-completion` — final checklist

If skills above exist → uses them. If not → embeds own fallback.

---

## ⚠️ Supreme principle

> Simple code is easier to refactor than abstraction you tried to guess for the future.
>
> This skill prefers **simple-working** over **elegant-broken**.

YAGNI > ritualistic Clean Architecture.

Keeping tests green > following patterns for patterns' sake.

Measure > opine.
