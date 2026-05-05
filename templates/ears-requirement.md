# EARS Requirement Template

> EARS = Easy Approach to Requirements Syntax
> Format estruturado que reduz ambiguidade e força LLM seguir scope.

## Forma básica

`When [trigger/condition], the [system/component] shall [response].`

## 5 padrões EARS

### 1. Ubiquitous (sempre)
`The [system] shall [function].`
> Ex: The API shall return JSON responses.

### 2. Event-driven
`When [trigger event], the [system] shall [response].`
> Ex: When user submits valid login form, the auth service shall create session.

### 3. State-driven
`While [state], the [system] shall [behavior].`
> Ex: While user is authenticated, the dashboard shall display personalized content.

### 4. Optional feature
`Where [feature included], the [system] shall [behavior].`
> Ex: Where 2FA is enabled, the login flow shall require TOTP code.

### 5. Unwanted behavior
`If [error condition], then the [system] shall [response].`
> Ex: If login attempts exceed 5 in 10min, then the system shall lock account 30min.

## Anti-padrões (não usar)

- ❌ "It would be nice if..."
- ❌ "The system should be fast"
- ❌ "Users want..."
- ❌ "Maybe we could..."

## Template completo

```markdown
# Requirement: <ID> — <Short title>

**Type:** [event-driven | state-driven | ubiquitous | optional | unwanted]
**Priority:** [must | should | could | won't]

## Statement
When <trigger>, the <component> shall <response>.

## Acceptance Criteria (Gherkin)
Given <context>
When <action>
Then <observable outcome>

## Out of scope
- <X> não está incluso
- <Y> será tratado em requisito separado

## Test approach
- [ ] Unit
- [ ] Snapshot (se UI)
- [ ] Contract (se API externa)
- [ ] E2E (decidir após implementação)
```
