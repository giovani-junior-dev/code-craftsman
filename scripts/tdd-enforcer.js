#!/usr/bin/env node
/* TDD enforcer v2 — verifies test exists before production code
 * SPIKE marker support with RIGID validation:
 *   - razão concreta (não palavras genéricas)
 *   - expiração ≤7 dias
 *   - issue obrigatória
 * Usage: node tdd-enforcer.js <production-file>
 */
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const file = process.argv[2]
if (!file) { console.error('Usage: tdd-enforcer.js <file>'); process.exit(2) }

const cwd = process.cwd()
const fullPath = path.resolve(cwd, file)

// Skip non-source files
if (!/\.(js|jsx|ts|tsx|mjs|cjs)$/.test(file)) process.exit(0)
if (/\.(test|spec)\./i.test(file)) process.exit(0)

let content = ''
try { content = fs.readFileSync(fullPath, 'utf8') } catch { process.exit(0) }

// SPIKE marker — rigid validation
const spikeMatch = content.match(/\/\/\s*SPIKE:\s*(.+?)\s+—\s+expires\s+(\d{4}-\d{2}-\d{2})/i)
const spikeIssueMatch = content.match(/\/\/\s*SPIKE-ISSUE:\s*#(\d+)/i)

const hasSpikeMarker = /\/\/\s*SPIKE:/i.test(content)

if (hasSpikeMarker) {
  if (!spikeMatch) {
    console.error('🔨 SPIKE INVALID: marker format wrong')
    console.error('Expected: // SPIKE: <reason> — expires YYYY-MM-DD')
    console.error('Got malformed SPIKE comment.')
    process.exit(1)
  }

  const reason = spikeMatch[1].trim()
  const expireDate = new Date(spikeMatch[2])

  // Reason must be concrete (not generic)
  const genericWords = ['testing', 'exploring', 'trying', 'wip', 'tmp', 'temp', 'todo']
  if (genericWords.some(w => reason.toLowerCase() === w || reason.toLowerCase().startsWith(w + ' '))) {
    console.error(`🔨 SPIKE INVALID: reason "${reason}" too generic`)
    console.error('Use concrete reason: "validating Stripe Connect for split payments"')
    process.exit(1)
  }

  if (reason.length < 15) {
    console.error(`🔨 SPIKE INVALID: reason "${reason}" too short (≥15 chars)`)
    process.exit(1)
  }

  // Expiration ≤7 days from creation
  const now = new Date()
  const daysAhead = (expireDate - now) / (1000 * 60 * 60 * 24)

  if (isNaN(expireDate.getTime())) {
    console.error('🔨 SPIKE INVALID: expires date malformed (use YYYY-MM-DD)')
    process.exit(1)
  }

  if (daysAhead > 7) {
    console.error(`🔨 SPIKE INVALID: expires ${spikeMatch[2]} is >7 days. Max 7 days.`)
    process.exit(1)
  }

  if (daysAhead < 0) {
    console.error(`🔨 SPIKE EXPIRED: ${spikeMatch[2]} passed. Convert to real code with TDD or delete.`)
    console.error('Bypass blocked. Either:')
    console.error('  1. Remove SPIKE marker + add tests → real code')
    console.error('  2. Delete file (spike was throw-away)')
    console.error('  3. Update marker if extension justified (max 1 extension)')
    process.exit(1)
  }

  // Issue required
  if (!spikeIssueMatch) {
    console.error('🔨 SPIKE INVALID: missing SPIKE-ISSUE marker')
    console.error('Add line: // SPIKE-ISSUE: #<number>')
    console.error('Issue tracks intent + decision (GitHub/Linear/local issues file).')
    process.exit(1)
  }

  console.log(`🔨 SPIKE valid — bypass TDD until ${spikeMatch[2]} (issue #${spikeIssueMatch[1]})`)
  console.log(`Reason: ${reason}`)
  process.exit(0)
}

// Find related test file
const base = file.replace(/\.(js|jsx|ts|tsx|mjs|cjs)$/, '')
const candidates = [
  `${base}.test.js`, `${base}.test.ts`, `${base}.test.jsx`, `${base}.test.tsx`,
  `${base}.spec.js`, `${base}.spec.ts`, `${base}.spec.jsx`, `${base}.spec.tsx`,
]

const found = candidates.find(c => fs.existsSync(path.resolve(cwd, c)))

if (!found) {
  console.error(`🔨 TDD VIOLATION: no test file for ${file}`)
  console.error(`Expected one of: ${candidates.map(c => path.basename(c)).join(', ')}`)
  console.error('Write failing test FIRST (red), then implement (green), then refactor.')
  console.error('Bypass options:')
  console.error('  - Add SPIKE marker (max 7 days, requires issue):')
  console.error('    // SPIKE: <concrete reason ≥15 chars> — expires YYYY-MM-DD')
  console.error('    // SPIKE-ISSUE: #<number>')
  process.exit(1)
}

// Compare git creation times (test must come first)
function gitFirstCommit(p) {
  try {
    return execSync(`git log --diff-filter=A --follow --format=%ct -- "${p}" 2>/dev/null | tail -1`, { cwd })
      .toString().trim()
  } catch { return null }
}

const testTime = gitFirstCommit(found)
const codeTime = gitFirstCommit(file)

if (testTime && codeTime && parseInt(codeTime) < parseInt(testTime)) {
  console.error(`🔨 TDD WARNING: ${file} was created BEFORE its test ${found}`)
  console.error('Tests should be written first (red-green-refactor).')
  process.exit(1)
}

console.log(`🔨 TDD ✓ — test exists: ${found}`)
process.exit(0)
