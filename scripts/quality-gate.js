#!/usr/bin/env node
/* Quality gate — heart of the ratchet
 * Compares current metrics to baseline. Fails if any regression.
 * Exit 0 = pass. Exit 1 = ratchet fail.
 */
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const cwd = process.cwd()
const dir = path.join(cwd, '.code-craftsman')
const baselinePath = path.join(dir, 'baseline.json')
const metricsPath = path.join(dir, 'metrics.json')

if (!fs.existsSync(baselinePath)) {
  console.error('🔨 craftsman: no baseline found. Run baseline-init first.')
  process.exit(0)
}

const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'))

console.log('🔨 craftsman: collecting current metrics...')
const collector = path.join(__dirname, 'metrics-collector.js')
const current = JSON.parse(execSync(`node "${collector}"`, { stdio: 'pipe' }).toString())

const failures = []
const rules = baseline.ratchetRules
const b = baseline.metrics

for (const [key, rule] of Object.entries(rules)) {
  const baseVal = b[key]
  const curVal = current[key]
  if (baseVal === undefined || curVal === undefined) continue

  if (rule === 'decrease-only' && curVal > baseVal) {
    failures.push(`${key}: ${baseVal} → ${curVal} (regression +${curVal - baseVal})`)
  }
  if (rule === 'increase-only' && curVal < baseVal) {
    failures.push(`${key}: ${baseVal}% → ${curVal}% (regression -${baseVal - curVal})`)
  }
}

current.ratchetPass = failures.length === 0
fs.writeFileSync(metricsPath, JSON.stringify(current, null, 2))

if (failures.length > 0) {
  console.error('🔨 RATCHET FAIL — regressions detected:')
  for (const f of failures) console.error(`  ✗ ${f}`)
  console.error('\nFix regressions or update baseline (only if intentional improvement).')
  process.exit(1)
}

console.log('🔨 ratchet ✓ — no regressions')
console.log(JSON.stringify(current, null, 2))
process.exit(0)
