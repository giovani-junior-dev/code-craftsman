# Test Strategy — Snapshot, Contract, E2E

## Pirâmide de testes

```
        ┌─────────────────┐
        │   E2E (opt-in)  │  ← Playwright, ask user
        ├─────────────────┤
        │  Contract Tests │  ← API/integração externa
        ├─────────────────┤
        │ Snapshot Tests  │  ← UI/output complexo
        ├─────────────────┤
        │   Unit Tests    │  ← Base, obrigatório
        └─────────────────┘
```

## Snapshot Tests

### Quando aplicar (auto-trigger)
- Componente UI (React/Vue/Svelte) com render output
- Output complexo (objeto grande, JSON gerado)
- Markdown/HTML rendering
- Config gerada dinamicamente

### Quando NÃO usar
- Lógica pura (use unit test)
- Primitivos simples
- Resultado pequeno (<5 propriedades)

### Regras
- ✅ Inline preferido (`toMatchInlineSnapshot`) — diff visível em PR
- ❌ Snapshot externo >50 linhas — refatorar
- ✅ Update precisa justificativa em commit
- ❌ Snapshot vazio/só whitespace
- ✅ Auto-detect orphan snapshots (`jest --ci`)

### Tools
- Jest `toMatchInlineSnapshot`
- Vitest `expect().toMatchSnapshot()`

## Contract Tests

### Quando aplicar (auto-trigger)
- Chamada HTTP externa (fetch/axios/got)
- Microserviço/comunicação entre serviços
- Schema OpenAPI/GraphQL existe
- Webhook receiver

### Tools
- **Pact** — consumer-driven contracts
- **MSW** — intercepta HTTP em test
- **Zod / TypeBox** — schema runtime validation
- **OpenAPI Generator** — types dos endpoints

### Padrão
1. Schema = fonte da verdade (Zod)
2. Mock server (MSW) com response realista
3. Test consumer + provider separados
4. Runtime validate (parse → throws se contract quebra)

## E2E Playwright (opt-in)

### Quando perguntar ao user

**SIM perguntar:**
- Feature tem UI flow completo
- Login/auth flow
- Pagamento/checkout
- Onboarding
- Multi-page critical journey

**NÃO perguntar (skip):**
- CLI tool / lib pura
- Worker/background job
- Refactor sem mudar comportamento
- Bug fix interno
- Endpoint API isolado (contract cobre)

### Pergunta padrão
```
Feature pronta com unit/snapshot/contract.
E2E Playwright?
- [s] Sim, flow crítico de UI
- [n] Não, contract+unit cobrem
- [d] Decidir depois (cria issue)
```

### Se SIM
- Page Object Model obrigatório
- Smoke happy path mínimo
- Cenários de erro principais
- Visual regression opcional

### Decisão registrada (ADR)
Skill auto-cria ADR documentando decisão.

## Mutation Testing (Stryker)

### Quando rodar
- Pre-commit (incremental)
- Pre-PR (full)
- CI nightly (full)

### Targets
- Score ≥70% (block)
- Score ≥80% (target)

### O que faz
Introduz bugs propositais (mutações). Testes fracos não detectam.

Exemplo:
```typescript
if (x > 5) → if (x >= 5)  // mutação
```
Se nenhum teste falha → testes não cobrem o operador.
