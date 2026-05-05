# Test Strategy — Snapshot, Contract, E2E

## Test pyramid

```
        ┌─────────────────┐
        │   E2E (opt-in)  │  ← Playwright, ask user
        ├─────────────────┤
        │  Contract Tests │  ← External API/integration
        ├─────────────────┤
        │ Snapshot Tests  │  ← UI/complex output
        ├─────────────────┤
        │   Unit Tests    │  ← Base, mandatory
        └─────────────────┘
```

## Snapshot Tests

### When to apply (auto-trigger)
- UI component (React/Vue/Svelte) with render output
- Complex output (large object, generated JSON)
- Markdown/HTML rendering
- Dynamically generated config

### When NOT to use
- Pure logic (use unit test)
- Simple primitives
- Small result (<5 properties)

### Rules
- ✅ Inline preferred (`toMatchInlineSnapshot`) — diff visible in PR
- ❌ External snapshot >50 lines — refactor
- ✅ Update requires justification in commit
- ❌ Empty/whitespace-only snapshot
- ✅ Auto-detect orphan snapshots (`jest --ci`)

### Tools
- Jest `toMatchInlineSnapshot`
- Vitest `expect().toMatchSnapshot()`

## Contract Tests

### When to apply (auto-trigger)
- External HTTP call (fetch/axios/got)
- Microservice/inter-service communication
- OpenAPI/GraphQL schema exists
- Webhook receiver

### Tools
- **Pact** — consumer-driven contracts
- **MSW** — intercepts HTTP in tests
- **Zod / TypeBox** — runtime schema validation
- **OpenAPI Generator** — types from endpoints

### Pattern
1. Schema = source of truth (Zod)
2. Mock server (MSW) with realistic response
3. Test consumer + provider separately
4. Runtime validate (parse → throws if contract breaks)

## E2E Playwright (opt-in)

### When to ask user

**ASK:**
- Feature has complete UI flow
- Login/auth flow
- Payment/checkout
- Onboarding
- Multi-page critical journey

**DON'T ASK (skip):**
- CLI tool / pure lib
- Worker/background job
- Refactor without behavior change
- Internal bug fix
- Isolated API endpoint (contract covers)

### Default question
```
Feature ready with unit/snapshot/contract.
E2E Playwright?
- [s] Yes, critical UI flow
- [n] No, contract+unit cover
- [d] Decide later (creates issue)
```

### If YES
- Page Object Model mandatory
- Smoke happy path minimum
- Main error scenarios
- Visual regression optional

### Recorded decision (ADR)
Skill auto-creates ADR documenting decision.

## Mutation Testing (Stryker)

### When to run
- Pre-commit (incremental)
- Pre-PR (full)
- CI nightly (full)

### Targets
- Score ≥70% (block)
- Score ≥80% (target)

### What it does
Introduces deliberate bugs (mutations). Weak tests don't detect.

Example:
```typescript
if (x > 5) → if (x >= 5)  // mutation
```
If no test fails → tests don't cover the operator.
