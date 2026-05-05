# ADR: E2E Decision — {FEATURE_NAME}

**Status:** Accepted
**Date:** {YYYY-MM-DD}
**Decision:** {YES | NO | DEFERRED}

## Context
Feature `{FEATURE_NAME}` complete. Tests in place:
- Unit: ✓
- Snapshot: {yes/no}
- Contract: {yes/no}

## Decision
{One of:}

### YES — E2E Playwright suite required
**Reason:** Critical UI flow (auth/payment/onboarding/multi-page).
**Scope:**
- Smoke happy path
- {N} error scenarios
- Visual regression (optional)

### NO — Covered by unit + contract
**Reason:** {CLI tool / pure lib / refactor / API endpoint isolated}.
**Coverage rationale:** Unit tests + contract tests give confidence X% on critical paths.

### DEFERRED — Issue created
**Issue:** #{ISSUE_NUMBER}
**Revisit trigger:** {When UI matures / when traffic > N / when bug pattern emerges}
**Risk accepted:** {What can break without E2E}

## Revisit conditions
- UI flow changes significantly
- Critical bug found in production related to flow
- Compliance/audit requires E2E proof
- User feedback indicates gap

## Consequences
- **Positive:** {time saved / focus preserved / scope reduced}
- **Negative:** {risk of regression / manual QA needed / coverage gap}

## References
- Skill rule: `references/test-strategy.md` E2E criteria
- Feature spec: {link}
