---
description: Bypass a specific rule this session (creates ADR with justification)
argument-hint: <rule-name> <reason>
---

Run `~/.claude/skills/code-craftsman/scripts/bypass.sh "$1" "$2"`.

Common rule names: `tdd`, `naming`, `cross-domain`, `file-size`, `flag-param`, `commented-code`, `test-only`.

Bypass creates ADR documenting reason. Bypass is per-session — next session restores rule.
