#!/usr/bin/env node
/* Initialize baseline.json for current project
 * Runs metrics-collector and freezes results as baseline
 */
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const cwd = process.cwd()
const dir = path.join(cwd, '.code-craftsman')
const baselinePath = path.join(dir, 'baseline.json')

if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

console.log('🔨 collecting initial metrics...')
const collector = path.join(__dirname, 'metrics-collector.js')
const metrics = JSON.parse(execSync(`node "${collector}"`, { stdio: 'pipe' }).toString())

const baseline = {
  createdAt: new Date().toISOString(),
  lastUpdated: new Date().toISOString(),
  metrics,
  ratchetRules: {
    lintViolations: 'decrease-only',
    duplicationPercent: 'decrease-only',
    coverage: 'increase-only',
    mutationScore: 'increase-only',
    filesAboveSizeLimit: 'decrease-only',
    complexityViolations: 'decrease-only',
    functionsAboveLineLimit: 'decrease-only',
    circularDependencies: 'decrease-only',
    deadCodeFiles: 'decrease-only',
    untestedFiles: 'decrease-only',
  },
}

fs.writeFileSync(baselinePath, JSON.stringify(baseline, null, 2))
console.log(`✓ baseline frozen at ${baselinePath}`)
console.log('Initial metrics:')
console.log(JSON.stringify(metrics, null, 2))
