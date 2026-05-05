#!/usr/bin/env node
/* PostToolUse hook for Write|Edit
 * Runs lightweight micro-validation after edit
 * Updates stats
 */
const fs = require('fs')
const path = require('path')
const os = require('os')
const { execSync } = require('child_process')

const SKILL = path.join(os.homedir(), '.claude', 'skills', 'code-craftsman')
const FLAG = path.join(SKILL, 'state', 'enabled.flag')
const SESSION = path.join(SKILL, 'state', 'session.json')
const STATS = path.join(SKILL, 'state', 'stats.json')

function isEnabled() {
  if (!fs.existsSync(FLAG)) return false
  try {
    const s = JSON.parse(fs.readFileSync(SESSION, 'utf8'))
    if (s.paused_until && new Date(s.paused_until) > new Date()) return false
    return true
  } catch { return false }
}

function updateStats(updates) {
  try {
    const s = JSON.parse(fs.readFileSync(STATS, 'utf8'))
    Object.assign(s, updates)
    fs.writeFileSync(STATS, JSON.stringify(s, null, 2))
  } catch {}
}

function tryRun(cmd, opts = {}) {
  try { return execSync(cmd, { stdio: 'pipe', timeout: 10000, ...opts }).toString() }
  catch (e) { return e.stdout?.toString() || '' }
}

async function main() {
  if (!isEnabled()) return process.exit(0)

  let input = ''
  for await (const chunk of process.stdin) input += chunk
  let tool
  try { tool = JSON.parse(input) } catch { return process.exit(0) }

  const name = tool.tool_name
  if (name !== 'Write' && name !== 'Edit') return process.exit(0)

  const filePath = tool.tool_input?.file_path || tool.tool_response?.filePath || ''
  if (!fs.existsSync(filePath)) return process.exit(0)

  // Skip non-code files
  if (!/\.(js|jsx|ts|tsx|mjs|cjs)$/.test(filePath)) return process.exit(0)

  const findings = []
  const cwd = process.cwd()

  // Try biome (if installed)
  if (fs.existsSync(path.join(cwd, 'node_modules', '.bin', 'biome')) ||
      fs.existsSync(path.join(cwd, 'biome.json'))) {
    const out = tryRun(`npx --no biome check --reporter=summary "${filePath}"`)
    const errMatch = out.match(/(\d+)\s+error/)
    if (errMatch && parseInt(errMatch[1]) > 0) {
      findings.push(`biome: ${errMatch[1]} errors`)
    }
  }

  // TDD check — production code without test?
  if (!/\.(test|spec)\./i.test(filePath) && /\.(js|ts|tsx|jsx)$/.test(filePath)) {
    const base = filePath.replace(/\.(js|jsx|ts|tsx|mjs|cjs)$/, '')
    const testCandidates = [
      `${base}.test.js`, `${base}.test.ts`, `${base}.test.tsx`,
      `${base}.spec.js`, `${base}.spec.ts`, `${base}.spec.tsx`,
    ]
    const hasTest = testCandidates.some(p => fs.existsSync(p))
    if (!hasTest) {
      findings.push(`tdd: no test file found for ${path.basename(filePath)} — write test first (red-green-refactor)`)
    }
  }

  if (findings.length > 0) {
    const msg = `🔨 craftsman post-check:\n  • ${findings.join('\n  • ')}`
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: msg },
      systemMessage: msg,
    }))
  }

  // Update stats
  updateStats({ last_check: new Date().toISOString() })

  process.exit(0)
}

main().catch(() => process.exit(0))
