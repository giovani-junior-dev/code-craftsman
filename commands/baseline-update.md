---
description: Freeze new baseline (only after intentional improvement)
---

Steps:
1. Verify ratchet currently passes — if FAIL, refuse update (would lock in regression)
2. Run `node ~/.claude/skills/code-craftsman/scripts/baseline-init.js`
3. Confirm new baseline frozen
4. Suggest commit message: "chore: update code-craftsman baseline after <improvement>"
