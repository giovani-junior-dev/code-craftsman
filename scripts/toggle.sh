#!/usr/bin/env bash
# Toggle code-craftsman skill on/off
set -euo pipefail

SKILL_DIR="$HOME/.claude/skills/code-craftsman"
STATE_DIR="$SKILL_DIR/state"
FLAG="$STATE_DIR/enabled.flag"
SESSION="$STATE_DIR/session.json"

ACTION="${1:-toggle}"

case "$ACTION" in
  on)
    echo "1" > "$FLAG"
    node -e "
      const fs = require('fs');
      const s = JSON.parse(fs.readFileSync('$SESSION'));
      s.enabled = true;
      s.paused_until = null;
      s.session_started = new Date().toISOString();
      fs.writeFileSync('$SESSION', JSON.stringify(s, null, 2));
    "
    echo "🔨 craftsman ON — quality enforcement active"
    ;;
  off)
    rm -f "$FLAG"
    node -e "
      const fs = require('fs');
      const s = JSON.parse(fs.readFileSync('$SESSION'));
      s.enabled = false;
      fs.writeFileSync('$SESSION', JSON.stringify(s, null, 2));
    "
    echo "🔨 craftsman OFF — hooks paused this session"
    ;;
  toggle)
    if [ -f "$FLAG" ]; then
      "$0" off
    else
      "$0" on
    fi
    ;;
  status)
    if [ -f "$FLAG" ]; then
      echo "🔨 craftsman ON"
    else
      echo "🔨 craftsman OFF"
    fi
    cat "$SESSION" 2>/dev/null
    ;;
  *)
    echo "Usage: $0 {on|off|toggle|status}"
    exit 1
    ;;
esac
