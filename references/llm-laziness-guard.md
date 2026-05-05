# LLM Laziness Guard — Force AI to use real knowledge

## Thesis
Advanced LLMs (Claude/GPT/Opus) **have deep knowledge** of engineering. But they're trained to iterate (more tokens = more revenue).

This skill **forces using real knowledge from 1st response** — blocks lazy simplification.

## LLM laziness patterns

### 1. Generic solution when specific solves
❌ "Here's a generic example, adapt to your case"
✅ Specific solution for the exact context

### 2. Pseudocode when real code possible
❌ `// implement validation here`
✅ Real working code

### 3. Multiple options instead of deciding
❌ "You can do it this way, or this way, or this way..."
✅ "I recommend X. Trade-off: Y"

### 4. Stub/mock that needs replacing
❌ `function doX() { /* TODO */ }`
✅ Complete implementation

### 5. Try/catch that only re-throws
❌ `try { ... } catch(e) { throw e }`
✅ Real handling or remove try/catch

### 6. Boolean flag becoming duplicated code
❌ `function process(data, isAdmin: boolean)`
✅ `processForAdmin(data)` + `processForUser(data)`

### 7. Complex pattern for simple system
❌ Event Sourcing for basic CRUD
✅ Direct table, event only if really needed

### 8. Preventive abstraction (YAGNI)
❌ `IRepository` with 1 implementation
✅ Direct function, abstract on 2nd real case

## Active resistance

When AI proposes:

### "I'll create an IUserRepository interface"
→ Question: "Is there a 2nd real or planned implementation?"
→ If no: "Use direct function, abstract later if needed"

### "I'll create UseCase + Handler + Service"
→ Question: "What real pain does this solve now?"
→ If no pain: "Use 1 flat function with 3 responsibilities"

### "I'll use Event Sourcing/CQRS"
→ Question: "How many events per minute? Required temporal audit?"
→ If simple system: "Normal table + audit log if needed"

### "I'll abstract in layers (presentation/application/domain/infrastructure)"
→ Question: "Does current codebase have 1M lines, 50 devs?"
→ If no: "Folder by domain, flat design within"

### "I'll create 18 files for this feature"
→ Refuse: "Redo with 3 files: input/logic/persistence"

### "I'll write pseudocode for you to adapt"
→ Refuse: "Write real working code"

### "I'll put TODO here"
→ Question: "Is this a spike (mark SPIKE) or implementation?"
→ If implementation: "Implement now, TODO blocks merge"

## Force correct 1st response

When asked for new code, AI must:

1. **Read this skill's rules** before proposing
2. **Apply Clean Code directly** (don't simplify)
3. **Choose minimum viable architecture** (don't over-engineer)
4. **Write test first** (TDD non-negotiable)
5. **Caveman output** (no fluff)

## Response quality benchmark

AI response must:
- ✅ Compile without error
- ✅ Pass project lint
- ✅ Have corresponding test
- ✅ Follow domain naming conventions
- ✅ Not introduce new interface/abstraction without justification
- ✅ Be concise (caveman)
- ✅ Work on 1st attempt (no need to iterate)

Failing 1+ criteria → inadequate response → rewrite.

## Akita's quote

> "AI reflects who you are."

This skill ensures **every interaction** forces quality — regardless of mood or tiredness.
