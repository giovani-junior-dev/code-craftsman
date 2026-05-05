#!/usr/bin/env bash
# Install code-craftsman tooling in current project
set -euo pipefail

SKILL="$HOME/.claude/skills/code-craftsman"
PROJECT="$PWD"

echo "🔨 code-craftsman installer"
echo "Project: $PROJECT"

# 1. Detect project type
if [ ! -f "$PROJECT/package.json" ]; then
  echo "✗ No package.json found. This installer is for Node.js/TypeScript projects."
  exit 1
fi

# 2. Create skill directory in project
mkdir -p "$PROJECT/.code-craftsman"

# 3. Copy configs
echo "▶ Installing configs..."
cp -n "$SKILL/config/biome.json" "$PROJECT/biome.json" 2>/dev/null || echo "  biome.json exists, skipped"
cp -n "$SKILL/config/dependency-cruiser.cjs" "$PROJECT/dependency-cruiser.cjs" 2>/dev/null || echo "  dependency-cruiser.cjs exists, skipped"
cp -n "$SKILL/config/stryker.config.json" "$PROJECT/stryker.config.json" 2>/dev/null || echo "  stryker.config.json exists, skipped"
cp -n "$SKILL/config/knip.json" "$PROJECT/knip.json" 2>/dev/null || echo "  knip.json exists, skipped"

# 4. Install dev dependencies
echo "▶ Installing dev dependencies..."
DEPS=(
  "@biomejs/biome"
  "knip"
  "@stryker-mutator/core"
  "@stryker-mutator/jest-runner"
  "dependency-cruiser"
  "jscpd"
  "madge"
  "msw"
  "zod"
)
npm install --save-dev "${DEPS[@]}"

# 5. Add scripts to package.json
echo "▶ Adding npm scripts..."
node <<'EOF'
const fs = require('fs')
const pkg = JSON.parse(fs.readFileSync('package.json'))
pkg.scripts = pkg.scripts || {}
pkg.scripts['craftsman:check'] = 'node ~/.claude/skills/code-craftsman/scripts/quality-gate.js'
pkg.scripts['craftsman:baseline'] = 'node ~/.claude/skills/code-craftsman/scripts/baseline-init.js'
pkg.scripts['craftsman:metrics'] = 'node ~/.claude/skills/code-craftsman/scripts/metrics-collector.js'
pkg.scripts['craftsman:tdd'] = 'node ~/.claude/skills/code-craftsman/scripts/first-checker.js'
pkg.scripts['craftsman:contract'] = 'node ~/.claude/skills/code-craftsman/scripts/contract-detector.js'
pkg.scripts['craftsman:snapshot'] = 'node ~/.claude/skills/code-craftsman/scripts/snapshot-validator.js'
pkg.scripts['craftsman:coverage'] = 'node ~/.claude/skills/code-craftsman/scripts/coverage-ratchet.js'
pkg.scripts['craftsman:full'] = 'node ~/.claude/skills/code-craftsman/scripts/self-validate.js macro'
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2))
console.log('✓ scripts added')
EOF

# 6. Initialize baseline
echo "▶ Creating baseline..."
node "$SKILL/scripts/baseline-init.js"

# 7. Setup .claude/settings.json hooks (project level)
mkdir -p "$PROJECT/.claude"
node <<EOF
const fs = require('fs')
const path = require('path')
const settingsPath = '.claude/settings.json'
let settings = {}
if (fs.existsSync(settingsPath)) {
  settings = JSON.parse(fs.readFileSync(settingsPath))
}

settings.hooks = settings.hooks || {}
const skillDir = '$SKILL'

settings.hooks.PreToolUse = settings.hooks.PreToolUse || []
settings.hooks.PreToolUse.push({
  matcher: 'Write|Edit',
  hooks: [{ type: 'command', command: \`node "\${skillDir}/hooks/pre-edit.js"\` }],
})

settings.hooks.PostToolUse = settings.hooks.PostToolUse || []
settings.hooks.PostToolUse.push({
  matcher: 'Write|Edit',
  hooks: [{ type: 'command', command: \`node "\${skillDir}/hooks/post-edit.js"\` }],
})

settings.hooks.UserPromptSubmit = settings.hooks.UserPromptSubmit || []
settings.hooks.UserPromptSubmit.push({
  hooks: [{ type: 'command', command: \`node "\${skillDir}/hooks/user-prompt.js"\` }],
})

settings.hooks.Stop = settings.hooks.Stop || []
settings.hooks.Stop.push({
  hooks: [{ type: 'command', command: \`node "\${skillDir}/hooks/stop.js"\` }],
})

settings.statusLine = {
  type: 'command',
  command: \`bash "\${skillDir}/scripts/statusline.sh"\`,
  padding: 1,
  refreshInterval: 5,
}

fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2))
console.log('✓ hooks + statusline configured in .claude/settings.json')
EOF

# 8. Add .gitignore entries
if [ -f "$PROJECT/.gitignore" ]; then
  if ! grep -q ".code-craftsman/metrics.json" "$PROJECT/.gitignore"; then
    cat >> "$PROJECT/.gitignore" <<EOF

# code-craftsman
.code-craftsman/metrics.json
.stryker-tmp/
.tmp-jscpd/
EOF
  fi
fi

echo ""
echo "✓ code-craftsman installed"
echo ""
echo "Next steps:"
echo "  1. Restart Claude Code (or /reload-plugins)"
echo "  2. Verify statusline shows '🔨 craftsman ON'"
echo "  3. Run: npm run craftsman:check"
echo "  4. Toggle: /code-craftsman:on | :off | :pause | :status"
