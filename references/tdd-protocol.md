# TDD Protocol — step by step

## Strict sequence

```
1. EARS requirement (When/shall)
2. ATDD acceptance test (failing)
3. Unit loop:
   a. RED — write failing test
   b. GREEN — minimal code to pass
   c. REFACTOR — improve design, tests green
4. Auto-trigger:
   - UI? → snapshot test
   - External HTTP? → contract test
5. Mutation testing (Stryker)
6. Coverage ratchet (changed files ≥80%)
7. F.I.R.S.T compliance check
8. E2E question (opt-in)
```

## Skip only in:
- Spike/exploration (`// SPIKE: <reason>` marker)
- Bootstrap new project (until 1st feature)
- One-shot migration script

## Folder structure

```
project/
├── src/
│   └── billing/
│       ├── create-invoice.ts
│       ├── create-invoice.test.ts
│       └── create-invoice.contract.test.ts (if external HTTP)
├── tests/
│   ├── snapshot/
│   ├── contract/
│   └── e2e/ (if opt-in)
└── stryker.config.json
```

## Test naming convention

`should_<expected>_when_<condition>`

Examples:
- `should_throw_when_email_invalid`
- `should_return_user_when_id_exists`
- `should_skip_when_already_processed`

## AAA Pattern

```typescript
it('should X when Y', () => {
  // Arrange
  const input = ...

  // Act
  const result = subjectUnderTest(input)

  // Assert
  expect(result).toBe(expected)
})
```

## Mocking — when

- ✅ Boundary (DB, HTTP, file system, time)
- ✅ Slow operation (network, IO)
- ❌ Internal collaborators (couples to impl)
- ❌ Every dependency (excessive mocking)

## Mutation Score
- ≥70% minimum (skill enforces)
- ≥80% ideal
- Surviving mutations = weak tests

## Coverage targets
- New code: ≥80%
- Total project: ratchet (only rises)
- Branches: ≥75%
- Functions: ≥80%
