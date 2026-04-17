# Developer Prompt Library
**Role:** Developer  
**Tools:** GitHub Copilot in VS Code (Claude + GPT via model picker)  
**Agents:** Plan Agent · Dev Agent (Frontend / Python) · Code Review Agent

> These prompts are starting points. Always review output before committing. The agent assists — you own the code.

---

## 1. Feed Requirements to the Plan Agent

**When to use:** At the start of a Standard-tier ticket, after the BSA has finalised requirements and test cases.  
**Tool:** Plan Agent (custom GitHub Copilot agent)

```
@plan-agent

Create an implementation plan for the following Jira ticket.

Jira ticket: [JIRA-####]

Requirements:
[PASTE JIRA-####-requirements here]

BSA Test Plan:
[PASTE JIRA-####-testplan-bsa here]

[If applicable:]
Architecture reference: [PASTE relevant section of architecture.md]
Security controls: [PASTE relevant section of security-controls.md]

Output a structured plan with:
1. Summary — what is being built and why
2. Technical approach — how it will be implemented
3. Components affected — files, services, APIs, databases
4. Implementation steps — ordered, numbered, specific enough for a dev agent to act on
5. Test case mapping — for each JIRA-####-TC## in the BSA test plan, how the implementation will satisfy it
6. Risks and dependencies — what could block or complicate this
7. Definition of done — what must be true for this ticket to be complete

Be precise. Do not pad. Flag anything in the requirements that is ambiguous before proceeding.
```

**What good output looks like:** Every TC-### from the BSA testplan explicitly mapped. Risks named. Steps specific enough that a dev agent can execute them.

---

## 2. Feed Plan to the Frontend Dev Agent

**When to use:** After plan agent has produced the implementation plan and it has been human-reviewed.  
**Tool:** Dev Agent — Frontend (custom GitHub Copilot agent)

```
@dev-agent-frontend

Implement the following plan for Jira ticket [JIRA-####].

Implementation plan:
[PASTE JIRA-####-plan here]

BSA Test plan:
[PASTE JIRA-####-testplan-bsa here]

Rules:
- Follow the patterns in copilot-instructions.md for this repo
- For each JIRA-####-TC## in the BSA test plan, generate a corresponding unit or component test
- After implementation, emit a test results manifest (JIRA-####-test-results-manifest.json) with the result of each TC-## case: PASS, FAIL, MANUAL_REQUIRED, or SKIPPED with reason
- Do not add scope beyond what is in the plan without flagging it
- Flag any plan step that is ambiguous before implementing it

Output:
- Implementation code
- Unit/component tests mapped to TC-## IDs
- test-results-manifest.json
```

**What good output looks like:** Every TC-### has a test. Manifest includes status for all cases. No silent skips.

---

## 3. Feed Plan to the Python Dev Agent

**When to use:** For Python/backend work after plan agent has produced the implementation plan.  
**Tool:** Dev Agent — Python (custom GitHub Copilot agent)

```
@dev-agent-python

Implement the following plan for Jira ticket [JIRA-####].

Implementation plan:
[PASTE JIRA-####-plan here]

BSA Test plan:
[PASTE JIRA-####-testplan-bsa here]

Rules:
- Follow Python standards: ruff for linting, mypy for type checking, bandit for security
- Use Pydantic for config/data validation where applicable
- Follow YAML config patterns for any pipeline configuration
- For each JIRA-####-TC## in the BSA test plan, generate a corresponding pytest unit test
- After implementation, emit JIRA-####-test-results-manifest.json with status for each TC-## case
- Do not add scope beyond the plan without flagging it

Output:
- Python implementation
- pytest tests mapped to TC-## IDs
- test-results-manifest.json
```

**What good output looks like:** Type hints on all functions. No mypy or ruff violations. Every TC-### has a corresponding pytest test.

---

## 4. Set Repo Context for Copilot Inline

**When to use:** When starting work on a new repo or unfamiliar codebase — add this to copilot-instructions.md.  
**Tool:** GitHub Copilot (inline, all models)

```
# Copilot Instructions — [REPO NAME]

## What this repo does
[2–3 sentences describing the purpose of this repo]

## Tech stack
- Language: Python [version] / TypeScript [version]
- Framework: [e.g. FastAPI, React]
- Key libraries: [e.g. Pydantic, pandas, ADLS SDK]
- Config pattern: YAML with Pydantic validation
- Linting: ruff
- Type checking: mypy
- Security scanning: bandit

## Coding standards
- All functions must have type hints
- All config loaded via Pydantic models, not raw dicts
- No hardcoded credentials or environment-specific values
- Logging via [logging library], not print statements
- Error handling: raise specific exceptions, never bare except

## What to avoid
- No pandas for large datasets — use [preferred alternative]
- No synchronous calls in async functions
- No direct SQL string concatenation — use parameterised queries

## Test standards
- pytest for all unit tests
- Test files in /tests mirroring the source structure
- Each test function tests one thing
- Mocks for all external API calls
```

**What good output looks like:** Copilot suggestions align to your stack without having to repeat context on every prompt.

---

## 5. Trigger Code Review Agent

**When to use:** After the dev agent has completed implementation, before handing to QA.  
**Tool:** Code Review Agent (custom GitHub Copilot agent)

```
@code-review-agent

Review the following implementation for Jira ticket [JIRA-####].

Code diff / files changed:
[PASTE CODE OR FILE PATHS]

Implementation plan (for context):
[PASTE JIRA-####-plan or summary]

Review for:
1. Security — hardcoded secrets, SQL injection, unvalidated inputs, improper error handling that leaks info
2. Performance — N+1 queries, unnecessary loops, blocking calls, memory leaks
3. Type safety — missing type hints, Any types where specific types could be used
4. Error handling — bare excepts, swallowed exceptions, missing error logging
5. Test coverage — are there code paths with no corresponding test?
6. Standards — does this follow the patterns in copilot-instructions.md?
7. Risk — anything that could cause a prod incident or data issue

Output:
- Finding: [description]
- Severity: Critical / High / Medium / Low
- File and line: [location]
- Recommendation: [what to do]

Summarise: X critical, Y high, Z medium findings. Must-fix before QA: [list].
```

**What good output looks like:** Critical and High findings are specific and actionable. "Must-fix before QA" list is clear.

---

## 6. Generate PR Description with Traceability

**When to use:** After implementation is complete and code review findings are resolved.  
**Tool:** GitHub Copilot (inline)

```
Generate a pull request description for the following change.

Jira ticket: [JIRA-####]
Summary of change: [BRIEF DESCRIPTION]

Files changed:
[LIST KEY FILES]

Test cases covered (from BSA testplan):
[LIST JIRA-####-TC## IDs that this PR satisfies]

PR description format:
## Summary
[What this PR does, 2–3 sentences]

## Jira ticket
[JIRA-####] — [ticket title]

## Changes
- [Bullet list of key changes]

## Test coverage
- Unit tests: [what is covered]
- BSA test cases satisfied: [JIRA-####-TC01, TC02...]
- Manual tests required: [any MANUAL_REQUIRED cases]

## Notes for reviewer
[Anything the reviewer should pay special attention to]

## Checklist
- [ ] ruff — no linting errors
- [ ] mypy — no type errors  
- [ ] bandit — no security findings
- [ ] Code review agent run
- [ ] test-results-manifest.json generated
```

**What good output looks like:** TC-### IDs explicitly listed. Reviewer checklist complete. No vague summary.

---

## 7. Explain Complex Business Logic Before Implementing

**When to use:** When the requirements reference domain-specific logic (SA-CCR, CVA, FTP calculations, etc.) that needs unpacking before writing code.  
**Tool:** GitHub Copilot (Claude model preferred for reasoning)

```
Before I implement this requirement, help me understand the business logic.

Requirement:
[PASTE REQ-### text]

Context:
- This is for a treasury technology system at a Canadian bank
- Relevant domain: [e.g. SA-CCR, CVA, ALM, FTP, liquidity reporting]
- Related systems: [e.g. Murex, ADLS, downstream reporting]

Questions:
1. Explain the calculation or logic in plain language
2. What are the edge cases or boundary conditions I must handle?
3. What data inputs are required and what are their expected formats?
4. Are there any regulatory constraints on how this must be calculated?
5. What would a wrong implementation look like — what failure modes should I test for?

I will use this to write the implementation and unit tests. Be specific and technical.
```

**What good output looks like:** Calculation explained step by step. Edge cases listed. You could write tests directly from the output.

---

## 8. Debug with Agent Context

**When to use:** When a test is failing or behaviour is unexpected and you need help diagnosing.  
**Tool:** GitHub Copilot (Claude or GPT model)

```
I have a failing test / unexpected behaviour. Help me diagnose.

Jira ticket: [JIRA-####]
Test case: [JIRA-####-TC##]

Error / unexpected output:
[PASTE ERROR MESSAGE OR DESCRIBE BEHAVIOUR]

Relevant code:
[PASTE RELEVANT FUNCTION OR CLASS]

Test code:
[PASTE FAILING TEST]

Expected behaviour (from requirements):
[PASTE REQ-### or describe]

Questions:
1. What is causing this failure?
2. Is the bug in the implementation or the test?
3. What is the minimal fix?
4. Are there related cases I should check to avoid introducing a regression?

Do not rewrite the whole function. Diagnose first, fix second.
```

**What good output looks like:** Root cause identified before a fix is proposed. Related regression risks called out.

---

## 9. Requirements Change — Re-run Plan Agent

**When to use:** When BSA updates requirements after the plan has already been generated. Per the propagation rule — plan must be re-run before dev continues.  
**Tool:** Plan Agent (custom GitHub Copilot agent)

```
@plan-agent

Requirements have changed for Jira ticket [JIRA-####]. The existing plan needs to be updated.

Original plan:
[PASTE ORIGINAL PLAN]

Updated requirements:
[PASTE UPDATED REQUIREMENTS]

Updated BSA test plan:
[PASTE UPDATED TESTPLAN-BSA]

What changed:
[DESCRIBE WHAT CHANGED AND WHY]

Output:
- A revised implementation plan reflecting the updated requirements
- Highlight what changed from the original plan (additions, removals, modifications)
- Flag any parts of the original implementation that may need to be reworked
- Updated TC-## mapping for any new or changed test cases
```

**What good output looks like:** Diff between old and new plan is explicit. Rework risk called out clearly.

---

## 10. Lightweight Ticket — Direct Dev Agent

**When to use:** For Lightweight-tier tickets (minor change, small bug fix) where a Plan agent step is not required.  
**Tool:** Dev Agent — Frontend or Python (custom GitHub Copilot agent)

```
@dev-agent-python [or @dev-agent-frontend]

This is a lightweight change for Jira ticket [JIRA-####].

Change description:
[DESCRIBE WHAT NEEDS TO CHANGE]

File(s) to modify:
[LIST FILES]

Requirements context:
[PASTE JIRA DESCRIPTION OR REQ-### if available]

Rules:
- Minimal change — do not refactor beyond what is needed
- Add or update unit tests for the changed code
- Follow existing patterns in the file — do not introduce new patterns
- Note any risk or side effect of this change

Output:
- Modified code
- Updated tests
- Brief note on what was changed and why
```

**What good output looks like:** Minimal diff. Existing tests still pass. Risk to adjacent code noted.
