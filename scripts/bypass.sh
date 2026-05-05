#!/usr/bin/env bash
# Bypass specific rule (requires reason → creates ADR)
set -euo pipefail

SKILL_DIR="$HOME/.claude/skills/code-craftsman"
SESSION="$SKILL_DIR/state/session.json"

RULE="${1:?usage: bypass.sh <rule-name> <reason>}"
REASON="${2:?reason required}"

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
ADR_DIR="${PWD}/docs/adr"
mkdir -p "$ADR_DIR"
ADR_FILE="$ADR_DIR/bypass-${RULE}-${TIMESTAMP}.md"

cat > "$ADR_FILE" <<EOF
# ADR: Rule bypass '$RULE'

**Status:** Accepted
**Date:** $(date -u +"%Y-%m-%dT%H:%M:%SZ")
**Bypass session:** Active

## Context
Code-craftsman skill blocked rule: \`$RULE\`

## Decision
Bypass approved for this session.

## Reasoning
$REASON

## Revisit Trigger
Re-enable rule next session (bypass is per-session).
EOF

node -e "
  const fs = require('fs');
  const s = JSON.parse(fs.readFileSync('$SESSION'));
  if (!s.bypassed_rules.includes('$RULE')) {
    s.bypassed_rules.push('$RULE');
  }
  fs.writeFileSync('$SESSION', JSON.stringify(s, null, 2));
"

echo "⚠️  Bypass active: $RULE"
echo "ADR created: $ADR_FILE"
