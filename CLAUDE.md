# CLAUDE.md

Behavioral guidelines for AI agents (Claude Code, Cursor, Codex, etc) working in this repo or any project where `code-craftsman` skill is active.

Bias toward **discipline over speed**. Trivial tasks → use judgment. Real code → follow rules.

> **Companion to the [code-craftsman](https://github.com/giovani-junior-dev/code-craftsman) skill.** The skill enforces these rules via hooks. This file documents them so any AI tool — even without the skill loaded — can follow.

---

## 1. Think Before Coding

**No assumptions. No hidden confusion. Surface tradeoffs.**

Before any implementation:
- State assumptions explicitly. If uncertain → ask.
- Multiple interpretations → present them. Don't pick silently.
- Simpler approach exists → say it. Push back when warranted.
- Something unclear → stop. Name it. Ask.

Use **EARS format** for requirements:
- `When [trigger], the [system] shall [response]`
- `If [error], then the [system] shall [response]`

No "It would be nice if..." or "Users want..." — non-falsifiable.

---

## 2. Simplicity First (YAGNI)

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked
- No abstractions for single-use code
- No "flexibility" or "configurability" not requested
- No error handling for impossible scenarios
- 200 lines that could be 50 → rewrite

Ask: "Would a senior engineer say this is overcomplicated?" Yes → simplify.

**Architecture rule:** flat first, modular monolith, abstract by real pain.
- 3 files per feature: input/logic/persistence
- No `IRepository` without 2nd impl
- No UseCase for CRUD
- No DTO/Mapper layers without justification
- Imports cross domain boundaries → BLOCKED

---

## 3. TDD Non-Negotiable

**RED → GREEN → REFACTOR. Always.**

Sequence:
1. Write failing test
2. Minimal code to pass
3. Refactor with tests green

If no test before code → BLOCKED by hook.

**F.I.R.S.T:**
- **F**ast (<100ms unit)
- **I**ndependent (random order passes)
- **R**epeatable (any environment)
- **S**elf-validating (boolean)
- **T**imely (before production)

**Coverage:** ≥80% on changed files. Mutation score ≥70% (Stryker). 1 assert/test.

**SPIKE escape hatch** (only legit TDD bypass):
```typescript
// SPIKE: validating Stripe Connect for split payments — expires 2026-05-12
// SPIKE-ISSUE: #234
```
Reason ≥15 chars, ≤7 days, issue required. After expires → blocked.

---

## 4. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, formatting
- Don't refactor things that aren't broken
- Match existing style even if you'd do it differently
- Unrelated dead code → mention it, don't delete

When your changes create orphans:
- Remove imports/vars/functions YOUR changes made unused
- Don't remove pre-existing dead code unless asked

**Test:** every changed line traces to user request.

---

## 5. Goal-Driven Execution

**Verifiable success criteria. Loop until verified.**

Transform vague tasks:
- "Add validation" → "Write tests for invalid inputs, make them pass"
- "Fix bug" → "Write test reproducing bug, make it pass"
- "Refactor X" → "Tests pass before AND after"

For multi-step tasks, state plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
```

Strong criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

## 6. Output Discipline (Caveman)

**Compress all output. Code AND markdown.**

Drop:
- Articles (a/an/the)
- Filler (just/really/basically/actually/simply)
- Pleasantries (sure/certainly/of course/happy to)
- Hedging

Use:
- Fragments
- Tables > prose
- Short synonyms (big not extensive, fix not "implement a solution for")

**Limits:**
| Output type | Max |
|---|---|
| Direct response | ≤300 chars ideally |
| Technical plan | ≤500 lines |
| Architecture doc | ≤300 lines |
| Commit subject | ≤50 chars |
| PR description | ≤200 lines |
| Inline comment | ≤2 lines |

Code blocks unchanged. Error messages literal in quotes.

---

## 7. Anti-LLM-Laziness Patterns

**LLMs are trained to iterate. Resist.**

Forbidden in 1st response:
- ❌ "Here's a generic example, adapt"
- ❌ Pseudocode when real code possible
- ❌ "You can do A, or B, or C..." (decide)
- ❌ `function doX() { /* TODO */ }` (implement)
- ❌ `try {...} catch(e) { throw e }` (real handling or remove)
- ❌ Boolean flag param (split into 2 functions)
- ❌ Event Sourcing/CQRS for simple CRUD
- ❌ `IRepository` with 1 implementation

**Test:** AI response should compile + pass lint + have test on 1st attempt. Failing 1+ → rewrite.

---

## 8. Naming Rules (Hard Block)

**Forbidden class/function suffixes:**
- `Manager`, `Processor`, `Handler`, `Util`, `Helper` (no domain)
- `Service` (without clear domain context)

**Forbidden prefixes:**
- `I` on interfaces (`IRepository` → `Repository`)
- `m_`, `_private`, Hungarian Notation

**Forbidden noise suffixes:**
- `NameString`, `UserData`, `OrderInfo`

**Pattern:**
- Classes/objects = nouns (`Customer`, `Account`)
- Methods = verbs (`postPayment`, `deletePage`)
- Accessors = `get*`, `set*`, `is*`

---

## 9. Function/File Limits

| Rule | Limit |
|---|---|
| Function lines | ≤20 |
| Function params | ≤2 (3+ → object) |
| Indentation | ≤2 levels |
| File lines | ≤500 (avg ~200) |
| Line chars | ≤120 |

Boolean flag parameter → indicates 2 functions. Split.

Output args (modifying input) → use return.

---

## 10. Comments

**Default: write none.**

Add only when WHY is non-obvious:
- Hidden constraint
- Subtle invariant
- Workaround for specific bug
- Behavior that would surprise reader

NEVER:
- Explain WHAT (well-named identifiers do that)
- Reference current task ("used by X", "added for Y flow")
- Change history (git already does)
- Commented-out code (delete — git keeps history)

If removing comment wouldn't confuse future reader → don't write it.

**Exception for AI agents:** keep comments left by previous agents — they document non-obvious context for future agents.

---

## 11. Quality Gate Ratchet

**Metrics only improve. Never regress.**

Locked baseline (must not rise):
- Lint violations
- Code duplication
- Cyclomatic complexity
- File size violations

Locked baseline (must not drop):
- Test coverage
- Mutation score

Project ratchet check before commit. Fail = block.

Bypass only via `/code-craftsman:bypass <rule>` with documented reason → creates ADR.

---

## 12. Test Auto-Triggers

When implementing feature:

| Detected | Auto-add |
|---|---|
| UI component render | Snapshot test (inline ≤50 lines) |
| External HTTP call | Contract test (Pact/MSW + Zod schema) |
| Financial logic | Mutation test (Stryker target ≥70%) |
| Multi-page UI flow | Ask user → E2E Playwright (opt-in, creates ADR) |

E2E is opt-in. Skill asks. Decision recorded in `docs/adr/e2e-NNNN-<feature>.md`.

---

## 13. Architectural Decision Records (ADRs)

Non-obvious decisions → record in `docs/adr/NNNN-<title>.md`.

Triggered by:
- Bypass of any rule
- E2E decision (yes/no/deferred)
- Tech stack choice with trade-offs
- Bounded context boundary
- External dependency adoption

Format: Status, Date, Context, Decision, Consequences (positive/negative), Alternatives considered, References.

---

## When These Guidelines Are Working

- Fewer unnecessary changes in diffs
- Fewer rewrites due to overcomplication
- Clarifying questions before implementation, not after mistakes
- Tests exist before production code
- Output stays terse (caveman)
- Architecture stays flat (no preventive abstraction)
- Quality metrics ratchet up over time
- Decisions documented as ADRs

---

## Project-Specific Overrides

Add project-specific rules below this line. Project rules override defaults above when in conflict.

<!-- PROJECT_RULES_START -->

<!-- PROJECT_RULES_END -->


<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:ca08a54f -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

## Session Completion

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd dolt push
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
<!-- END BEADS INTEGRATION -->
