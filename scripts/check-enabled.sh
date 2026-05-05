#!/usr/bin/env bash
# Returns 0 if skill enabled and not paused, 1 otherwise
# Used by all hooks as gatekeeper

SKILL_DIR="$HOME/.claude/skills/code-craftsman"
FLAG="$SKILL_DIR/state/enabled.flag"
SESSION="$SKILL_DIR/state/session.json"

# Not enabled
[ -f "$FLAG" ] || exit 1

# Check pause expiration
node -e "
  const fs = require('fs');
  try {
    const s = JSON.parse(fs.readFileSync('$SESSION'));
    if (s.paused_until && new Date(s.paused_until) > new Date()) {
      process.exit(1);
    }
    process.exit(0);
  } catch(e) { process.exit(1); }
"
