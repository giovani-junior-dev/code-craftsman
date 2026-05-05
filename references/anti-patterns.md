# Anti-patterns — What to BLOCK

## Naming
- ❌ Generic classes: `Manager`, `Processor`, `Handler`, `Util`, `Helper`, `Service` (without domain)
- ❌ Prefixes: `IRepository`, `m_var`, `_private`
- ❌ Hungarian Notation
- ❌ Redundant suffixes: `NameString`, `UserData`, `OrderInfo`
- ❌ Lone letters: `d`, `tmp`, `obj` outside short loop

## Functions
- ❌ Boolean flag parameter: `doX(flag: true)` — indicates 2 functions
- ❌ Output args: modifying input — use return
- ❌ 3+ parameters without encapsulating in object
- ❌ Function >20 lines
- ❌ Indentation >2 levels (deep nesting)

## Architecture
- ❌ Interface without 2nd real implementation
- ❌ UseCase for simple CRUD
- ❌ DTO/Mapper in 3+ layers without real pain
- ❌ Preventive dependency inversion
- ❌ Cross-domain imports (`billing/` imports `orders/`)
- ❌ Ritualistic Clean Architecture (use cases, ports, adapters without need)
- ❌ Event Sourcing/CQRS for simple CRUD

## Tests
- ❌ Production code WITHOUT prior test (verifies via git timestamp)
- ❌ Multiple unrelated asserts in a test
- ❌ `if`/`switch` inside test
- ❌ `.only`/`.skip` in commit
- ❌ Excessive mocking (>3 mocks in one test)
- ❌ External snapshot >50 lines
- ❌ Test after code (timely violation)
- ❌ Test coupled to implementation (over-mocking)

## Comments
- ❌ Commented-out code (delete — git keeps history)
- ❌ Redundant comment (explains visible WHAT)
- ❌ Change history (git already does)
- ❌ Comment without WHY (motivation)
- ❌ False/outdated comments

## General
- ❌ Magic numbers (without named constant)
- ❌ Large switch (>3 cases) without polymorphism
- ❌ Law of Demeter: `a.b().c().d()`
- ❌ Duplication (DRY)
- ❌ Dead code (Knip detects)
- ❌ Console.log in production
- ❌ TODO without issue number
- ❌ Empty catch (silent error)
- ❌ Promise without await without reason

## LLM-specific (vibe coding)
- ❌ Made-up names without domain match
- ❌ Super complex patterns (event sourcing) for simple system
- ❌ Generic solution when specific solves
- ❌ Multiple "solutions" instead of choosing 1
- ❌ Pseudocode when real code possible
- ❌ Comment like "// Add error handling here" without implementing
- ❌ Try/catch that just re-throws
