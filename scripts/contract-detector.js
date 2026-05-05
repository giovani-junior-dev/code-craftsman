#!/usr/bin/env node
/* Contract detector — finds external HTTP calls without contract tests
 * Auto-trigger criteria: fetch/axios/got call detected
 */
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const cwd = process.cwd()

function listSources() {
  try {
    return execSync('git ls-files "*.js" "*.ts" "*.tsx" "*.jsx"', { cwd, stdio: 'pipe' })
      .toString().split('\n').filter(f => f && !/\.(test|spec)\./i.test(f) && !f.includes('node_modules'))
  } catch { return [] }
}

const HTTP_RE = /(?:fetch|axios\.|got\.|got\(|http\.request|got\.\w+)\s*\(/g
const findings = []

for (const file of listSources()) {
  const fullPath = path.resolve(cwd, file)
  if (!fs.existsSync(fullPath)) continue
  const content = fs.readFileSync(fullPath, 'utf8')

  if (!HTTP_RE.test(content)) continue

  // Check for related contract test
  const base = file.replace(/\.(js|jsx|ts|tsx|mjs|cjs)$/, '')
  const dir = path.dirname(base)
  const name = path.basename(base)

  const candidates = [
    path.join(dir, '__contracts__', `${name}.contract.ts`),
    path.join(dir, '__contracts__', `${name}.contract.js`),
    path.join('tests', 'contract', `${name}.contract.ts`),
    `${base}.contract.test.ts`,
    `${base}.contract.test.js`,
  ]

  const hasContract = candidates.some(c => fs.existsSync(path.resolve(cwd, c)))

  if (!hasContract) {
    findings.push({
      file,
      missing: candidates[0],
      hint: 'External HTTP call detected. Add contract test (Pact/MSW + Zod schema).',
    })
  }
}

if (findings.length === 0) {
  console.log('🔨 contract ✓')
  process.exit(0)
}

console.error('🔨 contract test gaps:')
for (const f of findings) {
  console.error(`  ✗ ${f.file}: missing ${f.missing}`)
  console.error(`    ${f.hint}`)
}
process.exit(1)
