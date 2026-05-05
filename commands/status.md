---
description: Show code-craftsman status, current metrics, and ratchet state
---

Steps:
1. Run `~/.claude/skills/code-craftsman/scripts/toggle.sh status`
2. If `.code-craftsman/baseline.json` exists in cwd, run `node ~/.claude/skills/code-craftsman/scripts/quality-gate.js`
3. Report: enabled state, current metrics vs baseline, any pending issues, bypassed rules.
