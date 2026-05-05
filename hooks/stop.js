#!/usr/bin/env node
/* Stop hook — runs at end of session
 * Provides macro-level summary if quality-gate ran
 */
const fs = require('fs')
const path = require('path')
const os = require('os')

const SKILL = path.join(os.homedir(), '.claude', 'skills', 'code-craftsman')
const FLAG = path.join(SKILL, 'state', 'enabled.flag')
const STATS = path.join(SKILL, 'state', 'stats.json')

function isEnabled() {
  return fs.existsSync(FLAG)
}

async function main() {
  if (!isEnabled()) return process.exit(0)

  const cwd = process.cwd()
  const projectMetrics = path.join(cwd, '.code-craftsman', 'metrics.json')
  const projectBaseline = path.join(cwd, '.code-craftsman', 'baseline.json')

  if (!fs.existsSync(projectMetrics)) return process.exit(0)

  try {
    const metrics = JSON.parse(fs.readFileSync(projectMetrics, 'utf8'))
    const baseline = fs.existsSync(projectBaseline)
      ? JSON.parse(fs.readFileSync(projectBaseline, 'utf8'))
      : null

    if (!baseline) return process.exit(0)

    const issues = []
    const m = metrics
    const b = baseline.metrics

    if (m.lintViolations > b.lintViolations) issues.push(`lint: +${m.lintViolations - b.lintViolations}`)
    if (m.duplicationPercent > b.duplicationPercent) issues.push(`dup: +${(m.duplicationPercent - b.duplicationPercent).toFixed(2)}%`)
    if (m.coverage < b.coverage) issues.push(`cov: -${(b.coverage - m.coverage).toFixed(1)}%`)
    if (m.filesAboveSizeLimit > b.filesAboveSizeLimit) issues.push(`big-files: +${m.filesAboveSizeLimit - b.filesAboveSizeLimit}`)

    if (issues.length > 0) {
      const msg = `🔨 craftsman: RATCHET FAIL — regressions detected:\n  • ${issues.join('\n  • ')}\nFix before commit.`
      process.stdout.write(JSON.stringify({ systemMessage: msg }))
    }
  } catch {}

  process.exit(0)
}

main().catch(() => process.exit(0))
