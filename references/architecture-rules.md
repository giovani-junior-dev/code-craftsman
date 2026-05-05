# Architecture Rules — Strategic DDD + Flat First

## Supreme principle
> Strategic first, flat next, abstract by pain.

## Step 1: Modular monolith
- Folders by domain: `billing/`, `orders/`, `identity/`
- Each module has:
  - Own data model
  - Own entities
  - Doesn't import code from other modules directly
- Inter-module communication: events or shared/

## Step 2: Flat design within module
- 3 typical files:
  1. **Input** — handler/controller (parse/validate)
  2. **Logic** — pure business (domain rules)
  3. **Persistence** — direct DB (no repository pattern)
- Procedural with encapsulation
- NO ceremony: no use case, port, adapter, mapper

## Step 3: Abstract ONLY by real pain

### Questions to decide:
- Have you swapped this dependency in the last 2 years? → no → don't abstract
- 2nd real use of same code? → yes → extract. Never before 2nd case
- Bad/unstable external contract? → Anti-Corruption Layer

## Strategic DDD (keep)
- **Bounded contexts** — each module is a context
- **Ubiquitous Language** — consistent terms (CONTEXT.md)
- **Shared Kernel** — only the strictly necessary in `shared/`
- **Anti-Corruption Layer** — between your domain and bad external contracts

## Tactical DDD (disposable)
- ❌ Aggregate Root always
- ❌ Value Object for everything
- ❌ Generic Domain Service
- ❌ Repository pattern for CRUD

Use only where it adds real value.

## Encapsulation ≠ Dependency Inversion

### Encapsulation (always do)
- Hide implementation details
- Client calls method, doesn't know internals
- `userRepo.find(id)` — doesn't know it uses Prisma

### Dependency Inversion (rare)
- Domain depends on interface, infra implements
- Justifies ONLY if multiple real implementations
- Don't confuse with "easier to test" — frameworks mock anything

## Cheap limits to prevent AI mess

Instead of heavy Clean Architecture:
- Strong types between modules (Zod/TypeBox)
- Behavior tests (not implementation)
- Lint forbidding cross-imports between domains (`dependency-cruiser`)
- Bounded folders with naming convention
- ADRs for non-obvious decisions

## When to reconsider abstraction

Signs that justify abstracting:
- Same code in 3+ places (DRY)
- Unstable 3rd-party contract (ACL)
- Large team needs clear boundary
- Specific performance requires
- Compliance/security requires isolation

## Golden rule

> Simple code = easy to refactor
> Abstraction that guesses the future = gets in the way when future arrives different

YAGNI > anticipating everything.
