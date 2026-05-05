---
description: Force E2E Playwright decision for current feature (creates ADR)
argument-hint: [feature-name]
---

Run `node ~/.claude/skills/code-craftsman/scripts/e2e-prompt.js "$1"`.

Asks: YES (generates Playwright suite) / NO (covered by unit+contract) / DEFERRED (creates issue).

Decision recorded in `docs/adr/`.
