#!/usr/bin/env bash
# Pause skill for given duration
set -euo pipefail

SKILL_DIR="$HOME/.claude/skills/code-craftsman"
SESSION="$SKILL_DIR/state/session.json"
FLAG="$SKILL_DIR/state/enabled.flag"

DURATION="${1:-30m}"

# Parse duration: 30m, 1h, 2h
parse_duration() {
  local d="$1"
  case "$d" in
    *m) echo "${d%m}";;
    *h) echo $(( ${d%h} * 60 ));;
    *)  echo "30";;
  esac
}

MINUTES=$(parse_duration "$DURATION")
UNTIL=$(node -e "console.log(new Date(Date.now() + $MINUTES * 60000).toISOString())")

rm -f "$FLAG"
node -e "
  const fs = require('fs');
  const s = JSON.parse(fs.readFileSync('$SESSION'));
  s.paused_until = '$UNTIL';
  s.enabled = false;
  fs.writeFileSync('$SESSION', JSON.stringify(s, null, 2));
"

echo "🔨 craftsman ⏸ paused $DURATION (until $UNTIL)"
