# SPIKE Protocol — bypass TDD for exploration

## When to use
Spike = **temporary exploration** to validate technical hypothesis before committing to implementation.

Legitimate cases:
- Evaluate new external API (test before adopting)
- Reproduce obscure bug
- Validate algorithm feasibility
- UI spike for quick visual feedback

NOT a spike:
- "I'll test later"
- "No time now"
- "Small feature"
- TDD bypass in disguise

## Marker syntax (mandatory)

```typescript
// SPIKE: <reason> — expires <YYYY-MM-DD>
// SPIKE-ISSUE: #<number>
```

Both lines mandatory. Top of file, before any imports.

## Strict rules

1. **Concrete reason** — not "exploring", but "validating if Stripe API v2 supports X"
2. **Expiration ≤7 days** — after date, hook blocks all editing until marker removed OR converted to real code with tests
3. **Issue mandatory** — `# SPIKE-ISSUE: #N` links tracker (GitHub/Linear/local)
4. **1 active spike per developer** — forces closing before opening another
5. **PR forbidden** — spike CANNOT merge into main. `spike/*` branch is throw-away

## Correct example

```typescript
// SPIKE: testing Stripe Connect for split payment merchants — expires 2026-05-12
// SPIKE-ISSUE: #234

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_KEY!)

// exploratory code without tests — will become trash OR become real feature
async function attemptSplit() {
  const transfer = await stripe.transfers.create({...})
  console.log(transfer)  // ← OK in spike, forbidden in production
}
```

## Incorrect example (will be blocked)

```typescript
// SPIKE: testing  ← generic reason
                   ← missing expiration
                   ← missing issue
```

## Spike → production conversion

When spike validates hypothesis:

1. Create real issue for feature
2. Delete spike file
3. Write failing test (RED) in correct folder
4. Implement with normal TDD
5. Close SPIKE-ISSUE referencing feature issue

## Automatic block (pre-edit hook)

Hook checks:
- File has `// SPIKE:` marker?
  - Yes → bypasses TDD enforcer
  - Yes + expired → BLOCKS editing with message
  - Yes + no ISSUE → BLOCKS with message
- No marker + no test → BLOCKS standard TDD
