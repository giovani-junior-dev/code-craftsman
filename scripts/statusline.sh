#!/usr/bin/env bash
# Statusline output for code-craftsman
# Reads state + metrics → outputs formatted status line
# Must be FAST (<100ms)

SKILL_DIR="$HOME/.claude/skills/code-craftsman"
STATE_DIR="$SKILL_DIR/state"
FLAG="$STATE_DIR/enabled.flag"
SESSION="$STATE_DIR/session.json"
STATS="$STATE_DIR/stats.json"

# ANSI colors
GREEN='\033[32m'
YELLOW='\033[33m'
RED='\033[31m'
BLUE='\033[34m'
GRAY='\033[90m'
BOLD='\033[1m'
RESET='\033[0m'

# Disabled state
if [ ! -f "$FLAG" ]; then
  PAUSED_UNTIL=$(node -e "
    try {
      const s = JSON.parse(require('fs').readFileSync('$SESSION'));
      if (s.paused_until && new Date(s.paused_until) > new Date()) {
        const mins = Math.ceil((new Date(s.paused_until) - new Date()) / 60000);
        console.log(mins + 'm');
      } else { console.log(''); }
    } catch(e) { console.log(''); }
  " 2>/dev/null)

  if [ -n "$PAUSED_UNTIL" ]; then
    printf "${GRAY}🔨 craftsman ⏸ paused ${PAUSED_UNTIL}${RESET}"
  else
    printf "${GRAY}🔨 craftsman OFF${RESET}"
  fi
  exit 0
fi

# Bypassed rules?
BYPASSED=$(node -e "
  try {
    const s = JSON.parse(require('fs').readFileSync('$SESSION'));
    console.log((s.bypassed_rules || []).length);
  } catch(e) { console.log(0); }
" 2>/dev/null)

# Read project metrics if exist
PROJECT_BASELINE="${PWD}/.code-craftsman/baseline.json"
PROJECT_METRICS="${PWD}/.code-craftsman/metrics.json"

METRICS=""
if [ -f "$PROJECT_METRICS" ]; then
  METRICS=$(node -e "
    try {
      const m = JSON.parse(require('fs').readFileSync('$PROJECT_METRICS'));
      const cov = m.coverage || 0;
      const mut = m.mutationScore || 0;
      const lint = m.lintViolations || 0;
      const ratchet = m.ratchetPass ? '✓' : '✗';
      console.log(JSON.stringify({cov, mut, lint, ratchet}));
    } catch(e) { console.log('{}'); }
  " 2>/dev/null)
fi

# Tokens saved estimate
TOKENS_SAVED=$(node -e "
  try {
    const s = JSON.parse(require('fs').readFileSync('$STATS'));
    const k = (s.tokens_saved_estimate || 0) / 1000;
    console.log(k > 0 ? k.toFixed(1) + 'k' : '');
  } catch(e) { console.log(''); }
" 2>/dev/null)

# Build statusline
printf "${BOLD}${BLUE}🔨 craftsman${RESET} ${GREEN}ON${RESET}"

if [ -n "$METRICS" ] && [ "$METRICS" != "{}" ]; then
  RATCHET=$(echo "$METRICS" | node -e "console.log(JSON.parse(require('fs').readFileSync(0)).ratchet || '?')")
  COV=$(echo "$METRICS" | node -e "console.log(JSON.parse(require('fs').readFileSync(0)).cov || 0)")
  MUT=$(echo "$METRICS" | node -e "console.log(JSON.parse(require('fs').readFileSync(0)).mut || 0)")
  LINT=$(echo "$METRICS" | node -e "console.log(JSON.parse(require('fs').readFileSync(0)).lint || 0)")

  # Ratchet color
  if [ "$RATCHET" = "✓" ]; then
    printf " │ ${GREEN}ratchet ✓${RESET}"
  else
    printf " │ ${RED}ratchet ✗${RESET}"
  fi

  # Coverage color
  if [ "$COV" -ge 80 ] 2>/dev/null; then
    printf " │ ${GREEN}cov ${COV}%%${RESET}"
  elif [ "$COV" -ge 60 ] 2>/dev/null; then
    printf " │ ${YELLOW}cov ${COV}%%${RESET}"
  else
    printf " │ ${RED}cov ${COV}%%${RESET}"
  fi

  # Mutation score
  if [ "$MUT" -ge 70 ] 2>/dev/null; then
    printf " │ ${GREEN}mut ${MUT}%%${RESET}"
  elif [ "$MUT" -gt 0 ] 2>/dev/null; then
    printf " │ ${YELLOW}mut ${MUT}%%${RESET}"
  fi

  # Lint
  if [ "$LINT" -eq 0 ] 2>/dev/null; then
    printf " │ ${GREEN}lint 0${RESET}"
  else
    printf " │ ${RED}lint ${LINT}${RESET}"
  fi
fi

# Tokens saved
if [ -n "$TOKENS_SAVED" ]; then
  printf " │ ${GRAY}⚡ -${TOKENS_SAVED}${RESET}"
fi

# Bypass warning
if [ "$BYPASSED" -gt 0 ] 2>/dev/null; then
  printf " │ ${YELLOW}⚠ ${BYPASSED} bypass${RESET}"
fi
