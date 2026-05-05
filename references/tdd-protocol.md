# TDD Protocol — passo a passo

## Sequência rígida

```
1. EARS requirement (When/shall)
2. ATDD acceptance test (failing)
3. Loop unidade:
   a. RED — escreve teste falhando
   b. GREEN — código mínimo passa
   c. REFACTOR — melhora design, testes verdes
4. Auto-trigger:
   - UI? → snapshot test
   - HTTP externo? → contract test
5. Mutation testing (Stryker)
6. Coverage ratchet (changed files ≥80%)
7. F.I.R.S.T compliance check
8. Pergunta E2E (opt-in)
```

## Skip apenas em:
- Spike/exploration (marcador `// SPIKE: <reason>`)
- Bootstrap projeto novo (até 1ª feature)
- Migration script one-shot

## Estrutura de pastas

```
project/
├── src/
│   └── billing/
│       ├── create-invoice.ts
│       ├── create-invoice.test.ts
│       └── create-invoice.contract.test.ts (se HTTP externo)
├── tests/
│   ├── snapshot/
│   ├── contract/
│   └── e2e/ (se opt-in)
└── stryker.config.json
```

## Naming convention testes

`should_<expected>_when_<condition>`

Exemplos:
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

## Mocking — quando

- ✅ Boundary (DB, HTTP, file system, time)
- ✅ Slow operation (network, IO)
- ❌ Internal collaborators (acopla a impl)
- ❌ Toda dependência (mock excessivo)

## Mutation Score
- ≥70% mínimo (skill enforce)
- ≥80% ideal
- Mutações sobreviventes = testes fracos

## Coverage targets
- Novo código: ≥80%
- Total projeto: ratchet (só sobe)
- Branches: ≥75%
- Functions: ≥80%
