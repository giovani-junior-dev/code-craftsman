#!/usr/bin/env node
/* PreToolUse hook for Write|Edit
 * Reads tool call from stdin, validates against rules
 * Output: JSON with permissionDecision (allow/deny/ask)
 */
const fs = require('fs')
const path = require('path')
const os = require('os')

const SKILL = path.join(os.homedir(), '.claude', 'skills', 'code-craftsman')
const FLAG = path.join(SKILL, 'state', 'enabled.flag')
const SESSION = path.join(SKILL, 'state', 'session.json')
const THRESHOLDS = path.join(SKILL, 'config', 'thresholds.json')

function exitAllow() {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'allow' },
  }))
  process.exit(0)
}

function exitDeny(reason) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: `🔨 craftsman: ${reason}`,
    },
  }))
  process.exit(0)
}

function isEnabled() {
  if (!fs.existsSync(FLAG)) return false
  try {
    const s = JSON.parse(fs.readFileSync(SESSION, 'utf8'))
    if (s.paused_until && new Date(s.paused_until) > new Date()) return false
    return true
  } catch { return false }
}

function getBypassed() {
  try {
    const s = JSON.parse(fs.readFileSync(SESSION, 'utf8'))
    return s.bypassed_rules || []
  } catch { return [] }
}

async function main() {
  if (!isEnabled()) return exitAllow()

  let input = ''
  for await (const chunk of process.stdin) input += chunk
  let tool
  try { tool = JSON.parse(input) } catch { return exitAllow() }

  const name = tool.tool_name
  if (name !== 'Write' && name !== 'Edit') return exitAllow()

  const filePath = tool.tool_input?.file_path || ''
  const content = tool.tool_input?.content || tool.tool_input?.new_string || ''
  const bypassed = getBypassed()

  // Skip non-code files
  if (!/\.(js|jsx|ts|tsx|mjs|cjs|py|rb|go|rs|java|cs)$/.test(filePath)) return exitAllow()

  const violations = []

  // Naming check
  if (!bypassed.includes('naming')) {
    const blocked = ['Manager', 'Processor', 'Handler', 'Util', 'Helper']
    for (const b of blocked) {
      const re = new RegExp(`(class|function|const|let|var)\\s+\\w*${b}\\b`, 'g')
      if (re.test(content)) {
        violations.push(`naming: avoid generic '${b}' suffix — use domain-specific name`)
        break
      }
    }
    // Interface prefix I
    if (/(?:interface|type)\\s+I[A-Z]\\w+/.test(content)) {
      violations.push('naming: drop "I" prefix on interfaces (e.g. IRepository → Repository)')
    }
  }

  // File size estimate
  if (!bypassed.includes('file-size')) {
    const lines = content.split('\n').length
    if (lines > 500) {
      violations.push(`file-size: ${lines} lines exceeds 500. Split into smaller modules.`)
    }
  }

  // Line length
  if (!bypassed.includes('line-length')) {
    const longLines = content.split('\n').filter(l => l.length > 120).length
    if (longLines > 0) {
      violations.push(`line-length: ${longLines} lines >120 chars`)
    }
  }

  // Boolean flag parameter
  if (!bypassed.includes('flag-param')) {
    if (/function\s+\w+\s*\([^)]*\b(?:isFlag|flag|enable\w+|use\w+)\s*:\s*boolean/.test(content)) {
      violations.push('flag-param: boolean flag parameter detected — split into 2 functions')
    }
  }

  // Code commented (more than 3 lines of // followed by code)
  if (!bypassed.includes('commented-code')) {
    const lines = content.split('\n')
    let commentBlock = 0
    for (const line of lines) {
      if (/^\s*\/\/\s*[a-z_$][\w$]*\s*[(=]/.test(line)) commentBlock++
      else commentBlock = 0
      if (commentBlock >= 3) {
        violations.push('commented-code: large block of commented code — delete it (git keeps history)')
        break
      }
    }
  }

  // Cross-domain import
  if (!bypassed.includes('cross-domain')) {
    const fileMatch = filePath.match(/[\\\/]src[\\\/](billing|orders|identity|payments|users|auth|catalog)[\\\/]/)
    if (fileMatch) {
      const ownDomain = fileMatch[1]
      const importRe = /(?:import|require)\s*\(?\s*['"]([^'"]+)['"]/g
      let m
      while ((m = importRe.exec(content)) !== null) {
        const imp = m[1]
        const domainImport = imp.match(/(?:^|[\\\/])(billing|orders|identity|payments|users|auth|catalog)(?:[\\\/]|$)/)
        if (domainImport && domainImport[1] !== ownDomain) {
          violations.push(`cross-domain: ${ownDomain}/ importing from ${domainImport[1]}/ — use shared/ or events`)
          break
        }
      }
    }
  }

  // .only / .skip in test files
  if (!bypassed.includes('test-only')) {
    if (/\.(test|spec)\./i.test(filePath)) {
      if (/\b(?:it|describe|test)\.(?:only|skip)\(/.test(content)) {
        violations.push('test-only: .only/.skip detected — remove before commit')
      }
    }
  }

  if (violations.length > 0) {
    return exitDeny(violations.join('\n  • '))
  }

  exitAllow()
}

main().catch(() => exitAllow())
