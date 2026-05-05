#!/usr/bin/env node
/* E2E prompt v2 — asks user, generates ADR using template
 * Captures: decision, reason, scope (if YES), revisit triggers
 */
const fs = require('fs')
const path = require('path')
const os = require('os')
const readline = require('readline')

const cwd = process.cwd()
const adrDir = path.join(cwd, 'docs', 'adr')
const TEMPLATE = path.join(os.homedir(), '.claude', 'skills', 'code-craftsman',
                            'templates', 'e2e-decision-adr.md')

const featureName = process.argv[2] || 'unnamed-feature'

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const ask = (q) => new Promise(r => rl.question(q, r))

async function main() {
  if (!fs.existsSync(adrDir)) fs.mkdirSync(adrDir, { recursive: true })

  console.log(`\n🔨 craftsman: feature '${featureName}' implemented with unit/snapshot/contract.`)
  console.log('E2E Playwright?')
  console.log('  [s] Yes — critical UI flow')
  console.log('  [n] No — contract+unit cover')
  console.log('  [d] Defer (creates issue)')

  const answer = (await ask('> ')).toLowerCase().trim()
  const decisionMap = {
    s: 'YES',
    n: 'NO',
    d: 'DEFERRED',
  }
  const decision = decisionMap[answer] || 'DEFERRED'

  const reason = await ask('Reason (concrete, ≥1 sentence): ')

  let scope = ''
  let issueNumber = ''
  let revisitTrigger = ''
  let riskAccepted = ''

  if (decision === 'YES') {
    scope = await ask('Scenarios to cover (smoke/error/visual): ')
  } else if (decision === 'NO') {
    revisitTrigger = await ask('When to reconsider? (e.g., "if UI changes significantly"): ')
    riskAccepted = await ask('Accepted risk (what can break without E2E?): ')
  } else {
    issueNumber = await ask('Issue # created for tracking: ')
    revisitTrigger = await ask('Trigger to resume: ')
    riskAccepted = await ask('Interim risk: ')
  }

  // Build ADR from template
  let template = ''
  try { template = fs.readFileSync(TEMPLATE, 'utf8') } catch {
    template = `# ADR: E2E — {FEATURE_NAME}\n**Decision:** {DECISION}\n## Reason\n{REASON}`
  }

  const date = new Date().toISOString().split('T')[0]
  const adrContent = template
    .replace(/{FEATURE_NAME}/g, featureName)
    .replace(/{YYYY-MM-DD}/g, date)
    .replace(/{YES \| NO \| DEFERRED}/g, decision)
    .replace(/{ISSUE_NUMBER}/g, issueNumber || 'N/A')
    + `\n\n---\n\n## Captured inputs\n\n- **Decision:** ${decision}\n- **Reason:** ${reason}\n`
    + (scope ? `- **Scope:** ${scope}\n` : '')
    + (revisitTrigger ? `- **Revisit:** ${revisitTrigger}\n` : '')
    + (riskAccepted ? `- **Risk:** ${riskAccepted}\n` : '')

  const id = String(Date.now()).slice(-4)
  const fileName = `e2e-${id}-${featureName.replace(/[^a-z0-9-]/gi, '-')}.md`
  const filePath = path.join(adrDir, fileName)
  fs.writeFileSync(filePath, adrContent)

  console.log(`\n✓ ADR registered: ${filePath}`)

  if (decision === 'YES') {
    console.log('\nNext steps:')
    console.log('  1. npm install -D @playwright/test')
    console.log('  2. npx playwright install')
    console.log('  3. Use template: ~/.claude/skills/code-craftsman/templates/e2e-playwright.template')
  } else if (decision === 'DEFERRED') {
    console.log(`\n⚠ Pending: revisit when "${revisitTrigger}"`)
    console.log(`  Issue tracking: #${issueNumber}`)
  }

  rl.close()
}

main().catch(err => {
  console.error('Error:', err.message)
  rl.close()
  process.exit(1)
})
