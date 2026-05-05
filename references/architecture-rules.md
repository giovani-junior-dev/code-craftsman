# Architecture Rules — DDD Estratégico + Flat First

## Princípio supremo
> Estratégico primeiro, flat depois, abstrai por dor.

## Passo 1: Monolítico modular
- Pastas por domínio: `billing/`, `orders/`, `identity/`
- Cada módulo:
  - Próprio modelo de dados
  - Próprias entidades
  - Não importa código de outros módulos diretamente
- Comunicação entre módulos: eventos ou shared/

## Passo 2: Design flat dentro do módulo
- 3 arquivos típicos:
  1. **Entrada** — handler/controller (parse/validate)
  2. **Lógica** — pure business (regras domínio)
  3. **Persistência** — direct DB (sem repository pattern)
- Procedural com encapsulamento
- SEM cerimônia: sem use case, port, adapter, mapper

## Passo 3: Abstrai SÓ por dor real

### Perguntas para decidir:
- Trocou dependência nos últimos 2 anos? → não → não abstrai
- 2º uso real do mesmo código? → sim → extrai. Nunca antes do 2º caso
- Contrato externo ruim/instável? → Anti-Corruption Layer

## DDD Estratégico (mantém)
- **Bounded contexts** — cada módulo é um contexto
- **Ubiquitous Language** — termos consistentes (CONTEXT.md)
- **Shared Kernel** — apenas o estritamente necessário em `shared/`
- **Anti-Corruption Layer** — entre teu domínio e contratos externos ruins

## DDD Tático (descartável)
- ❌ Aggregate Root sempre
- ❌ Value Object para tudo
- ❌ Domain Service genérico
- ❌ Repository pattern para CRUD

Use só onde adiciona valor real.

## Encapsulamento ≠ Inversão de Dependência

### Encapsulamento (sempre faz)
- Esconder detalhes implementação
- Cliente chama método, não sabe interna
- `userRepo.find(id)` — não sabe que usa Prisma

### Inversão de Dependência (raro)
- Domain depende de interface, infra implementa
- Justifica APENAS se múltiplas implementações reais
- Não confundir com "facilita teste" — frameworks mockam qualquer coisa

## Limites baratos para IA não bagunçar

Em vez de Clean Architecture pesada:
- Tipos fortes entre módulos (Zod/TypeBox)
- Testes de comportamento (não implementação)
- Lint proibindo import cruzado entre domínios (`dependency-cruiser`)
- Pastas delimitadas com naming convention
- ADRs para decisões não-óbvias

## Quando reconsiderar abstração

Sinais que justificam abstrair:
- Mesmo código em 3+ lugares (DRY)
- Contrato instável de 3rd-party (ACL)
- Equipe grande precisa boundary clara
- Performance específica exige
- Compliance/security exige isolamento

## Regra de ouro

> Código simples = fácil refatorar
> Abstração que adivinha futuro = atrapalha quando futuro chega diferente

YAGNI > antecipar tudo.
