# SPIKE Protocol — bypass TDD para exploração

## Quando usar
Spike = **exploração temporária** para validar hipótese técnica antes de comprometer com implementação.

Casos legítimos:
- Avaliar API externa nova (testar antes de adotar)
- Reproduzir bug obscuro
- Validar feasibility de algoritmo
- Spike de UI para feedback visual rápido

NÃO é spike:
- "Vou testar depois"
- "Não tem tempo agora"
- "Feature pequena"
- Bypass disfarçado de TDD

## Marker syntax (obrigatório)

```typescript
// SPIKE: <reason> — expires <YYYY-MM-DD>
// SPIKE-ISSUE: #<number>
```

Ambas linhas obrigatórias. Top do arquivo, antes de qualquer import.

## Regras rígidas

1. **Razão concreta** — não "explorando", mas "validando se Stripe API v2 suporta X"
2. **Expiração ≤7 dias** — após data, hook bloqueia toda edição até remover marker OU converter em código real com testes
3. **Issue obrigatória** — `# SPIKE-ISSUE: #N` linka tracker (GitHub/Linear/local)
4. **1 spike ativo por desenvolvedor** — força fechar antes de abrir outro
5. **PR proibido** — spike NÃO pode mergear na main. Branch `spike/*` descartável

## Exemplo correto

```typescript
// SPIKE: testar Stripe Connect para split payment merchants — expires 2026-05-12
// SPIKE-ISSUE: #234

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_KEY!)

// código exploratório sem testes — vai virar lixo OU virar feature real
async function attemptSplit() {
  const transfer = await stripe.transfers.create({...})
  console.log(transfer)  // ← OK em spike, proibido em produção
}
```

## Exemplo incorreto (será bloqueado)

```typescript
// SPIKE: testando  ← razão genérica
                   ← falta expiração
                   ← falta issue
```

## Conversão spike → produção

Quando spike valida hipótese:

1. Cria issue real para feature
2. Apaga arquivo spike
3. Escreve teste failing (RED) na pasta certa
4. Implementa com TDD normal
5. Fecha SPIKE-ISSUE referenciando feature issue

## Bloqueio automático (hook pre-edit)

Hook verifica:
- Arquivo tem `// SPIKE:` marker?
  - Sim → bypassa TDD enforcer
  - Sim + expirou → BLOQUEIA edição com mensagem
  - Sim + sem ISSUE → BLOQUEIA com mensagem
- Sem marker + sem teste → BLOQUEIA padrão TDD
