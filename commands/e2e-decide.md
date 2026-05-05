---
description: Force E2E Playwright decision for current feature (creates ADR)
argument-hint: [feature-name]
---

Run `node ~/.claude/skills/code-craftsman/scripts/e2e-prompt.js "$1"`.

Asks: SIM (gera Playwright suite) / NÃO (cobre por unit+contract) / DEPOIS (cria issue).

Decision recorded in `docs/adr/`.
