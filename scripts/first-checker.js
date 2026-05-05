#!/usr/bin/env node
/* F.I.R.S.T compliance checker for tests
 * Fast / Independent / Repeatable / Self-validating / Timely
 */
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const cwd = process.cwd()

function findTests() {
  try {
    return execSync('git ls-files "*.test.*" "*.spec.*"', { cwd, stdio: 'pipe' })
      .toString().split('\n').filter(Boolean)
  } catch { return [] }
}

function check(file) {
  const content = fs.readFileSync(path.resolve(cwd, file), 'utf8')
  const issues = []

  // F: too many awaits/sleeps suggests slow
  const sleeps = (content.match(/setTimeout|sleep\(|delay\(/g) || []).length
  if (sleeps > 2) issues.push(`Fast: ${sleeps} sleep/setTimeout calls — tests may be slow`)

  // I: shared mutable state outside it/test blocks
  if (/^let\s+\w+\s*=\s*[^;]*;?$/m.test(content)) {
    issues.push('Independent: top-level mutable state may leak between tests')
  }

  // R: depends on Date.now / new Date without mock
  if (/Date\.now\(\)|new\s+Date\(\)/.test(content) && !/(?:fakeTimer|mockDate|fake-timers)/.test(content)) {
    issues.push('Repeatable: real Date used without mock — non-deterministic')
  }

  // S: missing assertions
  const tests = (content.match(/(?:it|test)\(/g) || []).length
  const asserts = (content.match(/expect\(/g) || []).length
  if (tests > 0 && asserts < tests) {
    issues.push(`Self-validating: ${tests} tests, ${asserts} expects (some tests no assert)`)
  }

  // .only / .skip
  if (/\b(?:it|describe|test)\.only\(/.test(content)) issues.push('Test .only detected')
  if (/\b(?:it|describe|test)\.skip\(/.test(content)) issues.push('Test .skip detected')

  // Multiple asserts per test (rough check)
  const itBlocks = content.split(/(?:it|test)\s*\(/).slice(1)
  for (const block of itBlocks) {
    const closeIdx = block.indexOf('})')
    if (closeIdx === -1) continue
    const body = block.slice(0, closeIdx)
    const assertsInBlock = (body.match(/expect\(/g) || []).length
    if (assertsInBlock > 1) {
      issues.push(`Single-concept: test has ${assertsInBlock} asserts (prefer 1)`)
      break
    }
  }

  return issues
}

const files = findTests()
let total = 0
const report = {}

for (const f of files) {
  const issues = check(f)
  if (issues.length > 0) {
    report[f] = issues
    total += issues.length
  }
}

if (total === 0) {
  console.log('🔨 F.I.R.S.T ✓ — all tests compliant')
  process.exit(0)
}

console.error(`🔨 F.I.R.S.T issues: ${total} across ${Object.keys(report).length} files`)
for (const [f, issues] of Object.entries(report)) {
  console.error(`\n${f}:`)
  for (const i of issues) console.error(`  ✗ ${i}`)
}
process.exit(1)
