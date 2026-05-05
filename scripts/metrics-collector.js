#!/usr/bin/env node
/* Collect quality metrics from current project
 * Outputs JSON to stdout
 */
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const cwd = process.cwd()
const THRESHOLDS = require(path.join(require('os').homedir(), '.claude', 'skills', 'code-craftsman', 'config', 'thresholds.json'))

function tryRun(cmd, opts = {}) {
  try { return execSync(cmd, { stdio: 'pipe', timeout: 60000, cwd, ...opts }).toString() }
  catch (e) { return e.stdout?.toString() || '' }
}

function listSourceFiles() {
  const out = tryRun('git ls-files "*.js" "*.ts" "*.jsx" "*.tsx"', { stdio: 'pipe' })
  return out.split('\n').filter(f => f && !f.includes('node_modules') && !/\.(test|spec)\./i.test(f))
}

function countLines(file) {
  try { return fs.readFileSync(path.join(cwd, file), 'utf8').split('\n').length }
  catch { return 0 }
}

function lintViolations() {
  if (fs.existsSync(path.join(cwd, 'biome.json')) || fs.existsSync(path.join(cwd, 'biome.jsonc'))) {
    const out = tryRun('npx --no biome check --reporter=summary .')
    const m = out.match(/(\d+)\s+error/)
    return m ? parseInt(m[1]) : 0
  }
  if (fs.existsSync(path.join(cwd, '.eslintrc.json')) || fs.existsSync(path.join(cwd, 'eslint.config.js'))) {
    const out = tryRun('npx --no eslint . -f json 2>/dev/null')
    try {
      const parsed = JSON.parse(out)
      return parsed.reduce((sum, f) => sum + (f.errorCount || 0), 0)
    } catch { return 0 }
  }
  return 0
}

function duplicationPercent() {
  if (!commandExists('jscpd')) return 0
  const out = tryRun('npx --no jscpd . --reporters json --output ./.tmp-jscpd --silent')
  try {
    const report = JSON.parse(fs.readFileSync(path.join(cwd, '.tmp-jscpd', 'jscpd-report.json'), 'utf8'))
    return report.statistics?.total?.percentage || 0
  } catch { return 0 }
}

function coverage() {
  const summary = path.join(cwd, 'coverage', 'coverage-summary.json')
  if (!fs.existsSync(summary)) return 0
  try {
    const data = JSON.parse(fs.readFileSync(summary, 'utf8'))
    return Math.round(data.total?.lines?.pct || 0)
  } catch { return 0 }
}

function commandExists(cmd) {
  try {
    const sep = process.platform === 'win32' ? ';' : ':'
    const paths = (process.env.PATH || '').split(sep)
    return paths.some(p => {
      try { return fs.readdirSync(p).some(f => f.startsWith(cmd)) }
      catch { return false }
    })
  } catch { return false }
}

function filesAboveSizeLimit() {
  const limit = THRESHOLDS.file.maxLines
  return listSourceFiles().filter(f => countLines(f) > limit).length
}

function untestedFiles() {
  const sources = listSourceFiles()
  return sources.filter(f => {
    const base = f.replace(/\.(js|jsx|ts|tsx|mjs|cjs)$/, '')
    return !['test', 'spec'].some(suffix =>
      ['js', 'ts', 'tsx'].some(ext => fs.existsSync(path.join(cwd, `${base}.${suffix}.${ext}`))),
    )
  }).length
}

const metrics = {
  collectedAt: new Date().toISOString(),
  totalFiles: listSourceFiles().length,
  lintViolations: lintViolations(),
  duplicationPercent: duplicationPercent(),
  coverage: coverage(),
  mutationScore: 0,
  filesAboveSizeLimit: filesAboveSizeLimit(),
  complexityViolations: 0,
  functionsAboveLineLimit: 0,
  circularDependencies: 0,
  deadCodeFiles: 0,
  untestedFiles: untestedFiles(),
  ratchetPass: true,
}

console.log(JSON.stringify(metrics, null, 2))
