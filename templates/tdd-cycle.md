# TDD Cycle Template

## RED → GREEN → REFACTOR

### Step 1: RED — write failing test

```typescript
// users.test.ts
import { describe, it, expect } from 'vitest'
import { createUser } from './users'

describe('createUser', () => {
  it('should reject invalid email', () => {
    expect(() => createUser({ email: 'invalid' }))
      .toThrow('Invalid email format')
  })
})
```

Run: `npm test`. **Expect FAIL.** If passes → test wrong.

### Step 2: GREEN — minimal code to pass

```typescript
// users.ts
export function createUser({ email }: { email: string }) {
  if (!email.includes('@')) throw new Error('Invalid email format')
  return { email }
}
```

Run: `npm test`. **Expect PASS.** Stop coding when green.

### Step 3: REFACTOR — improve, tests stay green

```typescript
// users.ts
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function createUser({ email }: { email: string }) {
  if (!EMAIL_REGEX.test(email)) throw new Error('Invalid email format')
  return { email }
}
```

Run: `npm test`. **Still PASS.** No new behavior — only improved design.

## Three Laws (Uncle Bob)

1. Don't write production code without failing test first
2. Don't write more test than needed to fail
3. Don't write more production code than needed to pass

## F.I.R.S.T

- **Fast** — <100ms per unit test
- **Independent** — random order passes
- **Repeatable** — offline, any environment
- **Self-validating** — boolean pass/fail
- **Timely** — before production code

## Vertical slices, not horizontal

❌ Not: write all controllers, then all services, then all repos
✅ Yes: 1 feature end-to-end (one route + one handler + one persistence)
