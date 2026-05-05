# Clean Code — Measurable Rules (Robert C. Martin)

## Naming
- Reveal intention: `elapsedTimeInDays`, not `d`
- No noise: `Name`, not `NameString`/`NameInfo`
- No `I` prefix on interfaces, no `m_`, no Hungarian Notation
- Nouns for classes/objects (`Customer`, `Account`)
- Verbs for methods (`postPayment`, `deletePage`)
- Getter/setter pattern: `get*`, `set*`, `is*`
- Long name = long scope
- Lone letters only in very short loops

## Functions
- ≤20 lines
- Indentation ≤2 levels
- 0/1/2 parameters (3+ → encapsulate in object)
- One thing only (SRP)
- No boolean flag (indicates 2 functions)
- No output args (modifying input is confusing)

## Comments
- Don't compensate for bad code — clean code first
- Good: legal, intent, warning, TODO
- Bad: redundant, history, **commented-out code** (delete)
- Agent rule: WHY > WHAT (motivation > what it does)

## Formatting
- Files ~200 lines (max 500)
- Top-down: high level → detail (newspaper)
- Lines ≤120 chars
- Local variable before use
- Instance variables at top of class
- Caller above callee

## Classes
- Size = number of responsibilities (not lines)
- Describable in ~25 words without "if/and/or/but"
- ≤7 instance variables
- High cohesion — each method uses many variables
- DIP — depends on abstraction

## Tests (TDD + F.I.R.S.T)

### 3 Laws of TDD
1. Don't write production code without failing test
2. Don't write more test than necessary to fail
3. Don't write more code than necessary to pass

### F.I.R.S.T
- **F**ast — <100ms unit
- **I**ndependent — random order passes
- **R**epeatable — any environment
- **S**elf-validating — boolean
- **T**imely — before production code

### Rules
- 1 assert/test, 1 concept/test
- Naming: `should_X_when_Y`

## Error Handling
- Exceptions > return codes
- Don't return null → empty collection or Special Case
- Don't pass null as argument

## Code Smells
- **G5 DRY:** duplication = main enemy
- **G14 Feature Envy:** method repeatedly accesses another object's data
- **G23 Switch:** >3 cases without polymorphism
- **G25 Magic Numbers:** without named constant
- **G28 Boolean:** encapsulate in method (`shouldBeDeleted(timer)`)
- **G36 Law of Demeter:** no `a.b().c().d()` (Shy Code)
