# Test Plan: [Feature Title]
# Jira: [PROJ-###]
# Test Jira(s): [PROJ-### sub-task or separate ticket]

<!-- chain-meta
classification: [Public | Internal | Restricted]
jira: [PROJ-###]
test_jiras: [PROJ-###, PROJ-###]
upstream: requirements.md @ [hash], design.md @ [hash]
last_synced: YYYY-MM-DD
author: [Name]
ai_tools_used: [GitHub Copilot Chat | M365 Copilot | None]
-->

## Scope

- **In scope:** [what this test plan covers]
- **Out of scope:** [what it explicitly does not cover and why]
- **Parent Jira:** [PROJ-###]
- **Test sub-tasks:** [PROJ-### — list all related test Jiras]

## Requirements Traceability

| Test Case | Validates | Source |
|-----------|-----------|--------|
| TC-001 | REQ-001 | Acceptance criterion |
| TC-002 | REQ-001, DES-E01 | Edge case from design |
| TC-003 | REQ-002 | Error case from design API section |

> Every REQ-### must have at least one TC-###. Every DES-E### should have a corresponding TC-###.

## Test Cases

### TC-001: [Scenario title]
- **Traces to:** REQ-001, DES-001
- **Priority:** P1
- **Type:** [Functional | Regression | Integration | Performance | Negative]
- **Preconditions:** [setup needed]
- **Steps:**
  1. [step]
  2. [step]
  3. [step]
- **Expected Result:** [specific, measurable outcome]
- **Test Data:** [use placeholders — [CLIENT_A], [ACCT_001], etc.]
- **Jira sub-task:** [PROJ-### if tracked separately]

### TC-002: [Scenario title]
- **Traces to:** REQ-001, DES-E01
- **Priority:** P1
- **Type:** [Negative]
- **Preconditions:**
- **Steps:**
  1. [step]
  2. [step]
- **Expected Result:**
- **Test Data:**

### TC-003: [Scenario title]
- **Traces to:** REQ-002
- **Priority:** P2
- **Type:** [Functional]
- **Preconditions:**
- **Steps:**
  1. [step]
  2. [step]
- **Expected Result:**
- **Test Data:**

## Regression Impact

- **Areas affected:** [components, services, or features that may be impacted]
- **Recommended regression suite:** [name or reference existing regression suite]
- **Automated coverage:** [% of test cases that can be automated / are already automated]

## Environment & Data Needs

- **Environment:** [DEV / SIT / UAT / pre-prod]
- **Test data requirements:** [all placeholders — no real client data]
- **Data setup steps:** [how to create the test data needed]
- **Environment dependencies:** [upstream services, stubs, mocks needed]

## Requirements Gap Report

> Gaps found during test plan generation. BSA must resolve these before Jira moves to "In Test."
> This is the QA → BSA feedback loop. Do not skip it.

- [ ] **REQ-###:** [describe the gap — missing scenario, ambiguous criterion, untestable requirement]
- [ ] **REQ-###:** [describe the gap]
- [ ] **General:** [any cross-cutting gap — e.g., "no acceptance criteria for error handling when [X] is unavailable"]

**Gap resolution status:**
| Gap | BSA Response | Date | Resolved? |
|-----|-------------|------|-----------|
| REQ-### gap description | [BSA response] | [date] | [ ] |

## Deployment Risks for Prod Support

> Observations from testing that Prod Support should factor into the runbook.

- [risk or observation]
- [risk or observation]

---

## Validation Checklist

Before beginning test execution:

- [ ] Every REQ-### has at least one TC-###
- [ ] Edge cases from design.md (DES-E###) have corresponding test cases
- [ ] Error/failure scenarios from design.md have corresponding test cases
- [ ] Test cases are specific enough to automate without interpretation
- [ ] Requirements Gap Report has been reviewed by BSA — gaps resolved or risk-accepted
- [ ] No restricted or real client data in test data fields
- [ ] chain-meta upstream hashes match current requirements.md and design.md
- [ ] Test Jira sub-tasks created and linked to parent
