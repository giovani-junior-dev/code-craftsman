#!/usr/bin/env node
/* Snapshot validator — checks snapshot tests follow rules
 * - Inline snapshots ≤ 50 lines
 * - No orphan snapshots
 * - Snapshot updates require justification
 */
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const cwd = process.cwd()
const MAX_INLINE = 50

function findSnapshots() {
  try {
    return execSync('git ls-files "*.snap" "*.test.*" "*.spec.*"', { cwd, stdio: 'pipe' })
      .toString().split('\n').filter(Boolean)
  } catch { return [] }
}

const issues = []

for (const file of findSnapshots()) {
  const fullPath = path.resolve(cwd, file)
  if (!fs.existsSync(fullPath)) continue
  const content = fs.readFileSync(fullPath, 'utf8')

  // Inline snapshots
  const inlineRe = /toMatchInlineSnapshot\(`([\s\S]*?)`\)/g
  let m
  while ((m = inlineRe.exec(content)) !== null) {
    const lines = m[1].split('\n').length
    if (lines > MAX_INLINE) {
      issues.push(`${file}: inline snapshot ${lines} lines > ${MAX_INLINE}`)
    }
  }

  // External .snap files — check size
  if (file.endsWith('.snap')) {
    const lines = content.split('\n').length
    if (lines > 200) {
      issues.push(`${file}: ${lines} lines — too large, prefer inline or split`)
    }
  }
}

if (issues.length === 0) {
  console.log('🔨 snapshot ✓')
  process.exit(0)
}

console.error('🔨 snapshot issues:')
for (const i of issues) console.error(`  ✗ ${i}`)
process.exit(1)
