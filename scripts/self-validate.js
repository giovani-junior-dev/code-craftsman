#!/usr/bin/env node
/* Self-validation runner — micro/meso/macro levels
 * Usage: node self-validate.js <level>
 *   micro — single file (lint+typecheck+related test)
 *   meso  — feature complete (full test + coverage + arch)
 *   macro — pre-PR (mutation + security + dep audit + ratchet)
 */
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const level = process.argv[2] || 'micro'
const file = process.argv[3]
const cwd = process.cwd()

function run(cmd, label) {
  console.log(`▶ ${label}`)
  try {
    execSync(cmd, { stdio: 'inherit', cwd })
    console.log(`✓ ${label}`)
    return true
  } catch {
    console.error(`✗ ${label} FAIL`)
    return false
  }
}

const checks = []

if (level === 'micro') {
  if (file) {
    if (fs.existsSync(path.join(cwd, 'biome.json'))) {
      checks.push(['npx --no biome check --apply ' + file, 'biome'])
    }
    if (fs.existsSync(path.join(cwd, 'tsconfig.json'))) {
      checks.push(['npx --no tsc --noEmit', 'typecheck'])
    }
  }
} else if (level === 'meso') {
  if (fs.existsSync(path.join(cwd, 'biome.json'))) {
    checks.push(['npx --no biome check .', 'biome lint+format'])
  }
  if (fs.existsSync(path.join(cwd, 'tsconfig.json'))) {
    checks.push(['npx --no tsc --noEmit', 'typecheck'])
  }
  checks.push(['npm test -- --coverage', 'tests + coverage'])
  checks.push(['npx --no dependency-cruiser --config dependency-cruiser.cjs --validate src', 'arch boundaries'])
} else if (level === 'macro') {
  checks.push(['npx --no biome check .', 'biome'])
  checks.push(['npx --no tsc --noEmit', 'typecheck'])
  checks.push(['npm test -- --coverage', 'tests'])
  checks.push(['npx --no stryker run', 'mutation testing'])
  checks.push(['npx --no knip --reporter compact', 'dead code'])
  checks.push(['npx --no dependency-cruiser --config dependency-cruiser.cjs --validate src', 'arch'])
  checks.push(['node ' + path.join(__dirname, 'quality-gate.js'), 'ratchet'])
}

let allPass = true
for (const [cmd, label] of checks) {
  if (!run(cmd, label)) allPass = false
}

console.log(`\n${allPass ? '✓ all passed' : '✗ failures detected'}`)
process.exit(allPass ? 0 : 1)
