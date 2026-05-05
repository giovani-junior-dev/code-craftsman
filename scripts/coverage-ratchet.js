#!/usr/bin/env node
/* Coverage ratchet — only enforce coverage on changed files
 * Files modified in current PR/branch must have ≥80% coverage
 */
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const cwd = process.cwd()
const MIN_COVERAGE = 80

function run(cmd) {
  try { return execSync(cmd, { stdio: 'pipe', cwd }).toString() }
  catch { return '' }
}

const summaryPath = path.join(cwd, 'coverage', 'coverage-summary.json')
if (!fs.existsSync(summaryPath)) {
  console.error('No coverage report. Run tests with --coverage first.')
  process.exit(1)
}

const changed = run('git diff --name-only main...HEAD')
  .split('\n')
  .filter(f => /\.(js|jsx|ts|tsx)$/.test(f) && !/\.(test|spec)\./i.test(f))

if (changed.length === 0) {
  console.log('🔨 coverage-ratchet: no source changes')
  process.exit(0)
}

const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'))
const failures = []

for (const file of changed) {
  const fullPath = path.resolve(cwd, file)
  const stat = summary[fullPath]
  if (!stat) {
    failures.push(`${file}: no coverage recorded (no test?)`)
    continue
  }
  const pct = stat.lines?.pct || 0
  if (pct < MIN_COVERAGE) {
    failures.push(`${file}: ${pct}% < ${MIN_COVERAGE}%`)
  }
}

if (failures.length > 0) {
  console.error('🔨 coverage-ratchet FAIL:')
  for (const f of failures) console.error(`  ✗ ${f}`)
  process.exit(1)
}

console.log('🔨 coverage-ratchet ✓ — all changed files ≥' + MIN_COVERAGE + '%')
