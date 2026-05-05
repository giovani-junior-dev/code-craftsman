---
description: Full quality report — metrics, baseline diff, recommendations
---

Steps:
1. Read `.code-craftsman/baseline.json` and `.code-craftsman/metrics.json` (run quality-gate.js if metrics.json missing).
2. Read `~/.claude/skills/code-craftsman/state/stats.json` for session stats.
3. Generate markdown report with:
   - Current metrics vs baseline (ratchet status)
   - Top 5 violations to fix
   - Test coverage breakdown
   - Files above thresholds
   - Recommendations (sorted by impact)
4. Output as markdown table — caveman style.
