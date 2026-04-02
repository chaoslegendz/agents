# Design: [Feature Title]
# Jira: [PROJ-###]

<!-- chain-meta
classification: [Public | Internal | Restricted]
jira: [PROJ-###]
upstream: requirements.md @ [git short hash]
last_synced: YYYY-MM-DD
author: [Name]
ai_tools_used: [GitHub Copilot Chat | Copilot Inline | None]
-->

## Approach

[Brief description of implementation approach — 3–5 sentences max.]

## Requirements Traceability

| Design Element | Addresses | Notes |
|---------------|-----------|-------|
| DES-001: [component/change] | REQ-001, REQ-002 | |
| DES-002: [component/change] | REQ-003 | |

> Every REQ-### from requirements.md must appear in this table at least once.

## Components Affected

| Component | Change | Impact |
|-----------|--------|--------|
| [component name] | [what changes] | [scope of change — new/modified/refactored] |

## API / Interface Changes

### [Endpoint or method name]
- **Input:** [parameters, types]
- **Output:** [response structure, types]
- **Error cases:**
  - [condition] → [HTTP status / error code / behaviour]
  - [condition] → [HTTP status / error code / behaviour]

> Be explicit on error cases. QA will generate test cases directly from these.

## Data Flow

[Description or simple diagram of how data moves. Reference source systems from requirements.md data requirements table.]

```
[Source] → [Transform/Service] → [Target]
```

## Edge Cases & Error Handling

| ID | Scenario | Handling | Traces to |
|----|----------|----------|-----------|
| DES-E01 | [edge case] | [how it's handled] | REQ-N01 |
| DES-E02 | [edge case] | [how it's handled] | REQ-### |

## Test Guidance for QA

> This section is the primary input QA uses to generate their test plan. Make it substantive.

- **What's risky:** [new logic, unfamiliar libraries, complex branching]
- **What's new:** [new components, new integrations, new data flows]
- **What's fragile:** [areas where small changes could break things]
- **Suggested focus areas:** [specific scenarios QA should exercise heavily]
- **What NOT to test here:** [anything out of scope or covered by other tickets]

## Operability Notes for Prod Support

> This section is the primary input Prod Support uses to generate the runbook.

- **How to monitor:** [key metrics, log patterns, health checks]
- **What could fail in production:** [likely failure modes and symptoms]
- **Rollback considerations:** [can this be rolled back? dependencies on data migrations?]
- **Configuration:** [any new config values, feature flags, environment-specific settings — reference by key name, never include actual values]

---

## Validation Checklist

Before moving Jira to "In Dev" (coding phase):

- [ ] Every REQ-### has at least one DES-### mapped to it
- [ ] Error handling is explicit — no "handle gracefully" or "log and continue"
- [ ] Test Guidance section is substantive enough for QA to generate test cases without a meeting
- [ ] Operability Notes address monitoring, failure modes, and rollback
- [ ] No restricted data, credentials, or production endpoints present
- [ ] chain-meta upstream hash matches current requirements.md
