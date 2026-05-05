# EARS Requirement Template

> EARS = Easy Approach to Requirements Syntax
> Structured format that reduces ambiguity and forces LLM to follow scope.

## Basic form

`When [trigger/condition], the [system/component] shall [response].`

## 5 EARS patterns

### 1. Ubiquitous (always)
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

## Anti-patterns (don't use)

- ❌ "It would be nice if..."
- ❌ "The system should be fast"
- ❌ "Users want..."
- ❌ "Maybe we could..."

## Complete template

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
- <X> not included
- <Y> handled in separate requirement

## Test approach
- [ ] Unit
- [ ] Snapshot (if UI)
- [ ] Contract (if external API)
- [ ] E2E (decide after implementation)
```
