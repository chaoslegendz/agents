# Runbook: [Feature Title]
# Jira: [PROJ-###]

<!-- chain-meta
classification: [Public | Internal | Restricted]
jira: [PROJ-###]
upstream: requirements.md @ [hash], design.md @ [hash], test-plan.md @ [hash]
last_synced: YYYY-MM-DD
author: [Name]
ai_tools_used: [GitHub Copilot Chat | M365 Copilot | None]
-->

## Overview

[What this feature does in plain language. A Prod Support team member unfamiliar with this feature should understand the business purpose, the basic data flow, and why it matters from this section alone. 3–5 sentences.]

## Requirements Traceability

| Runbook Section | Traces to |
|----------------|-----------|
| RB-MON-001 | DES-001, REQ-001 |
| RB-INC-001 | DES-E01, TC-002 |

## Architecture & Dependencies

- **Components:** [list components involved]
- **Upstream dependencies:** [services or systems this feature consumes from]
- **Downstream consumers:** [services or systems that depend on this feature's output]
- **Data flow:**

```
[Source] → [Service/Component] → [Target]
```

- **Configuration:** [reference config keys by name — NEVER include actual values, endpoints, or credentials]

## Monitoring

| ID | Metric | Threshold | Alert Severity | Dashboard | Traces to |
|----|--------|-----------|----------------|-----------|-----------|
| RB-MON-001 | [specific metric name] | [specific number/range] | P1 / P2 / P3 | [dashboard name or link] | DES-### |
| RB-MON-002 | [specific metric name] | [specific number/range] | P1 / P2 / P3 | [dashboard name or link] | DES-### |

> Thresholds must be specific numbers. "Watch for anomalies" is not a threshold.

## Common Issues & Resolution

| ID | Symptom | Likely Cause | Resolution Steps | Escalation | Traces to |
|----|---------|-------------|-----------------|------------|-----------|
| RB-INC-001 | [observable symptom] | [root cause] | 1. [step] 2. [step] 3. [verify] | [team + SLA] | DES-E## |
| RB-INC-002 | [observable symptom] | [root cause] | 1. [step] 2. [step] 3. [verify] | [team + SLA] | DES-E## |

> Resolution steps must be specific enough to execute at 2 AM without context.

## Alert Playbooks

### RB-MON-001: [Alert name]
- **What it means:** [plain language]
- **Severity / Response SLA:** [P# / time]
- **First-responder steps:**
  1. [diagnostic step — specific command, query, or check]
  2. [diagnostic step]
- **Resolution for common causes:**
  - If [cause A]: [steps]
  - If [cause B]: [steps]
- **Escalation:** [who to call if unresolved after X minutes]

### RB-MON-002: [Alert name]
- **What it means:**
- **Severity / Response SLA:**
- **First-responder steps:**
  1. [step]
  2. [step]
- **Resolution for common causes:**
  - If [cause A]: [steps]
- **Escalation:**

## Rollback Procedure

1. [Specific step — not "roll back the change"]
2. [Step]
3. [Step]
4. **Verify rollback:** [how to confirm rollback succeeded — specific check or query]

**Rollback tested:** [ ] Yes / [ ] No
**Rollback test date:** ____
**Rollback dependencies:** [data migrations, schema changes, or downstream impacts that complicate rollback]

## Operability Review

> Issues identified during runbook generation. Items tagged [BLOCKER] must be resolved before release.
> This is the Prod Support → Dev feedback loop.

- [ ] [BLOCKER] [issue — e.g., "No monitoring hook for the new service endpoint"]
- [ ] [RISK-ACCEPTED] [issue — e.g., "No automated rollback for schema migration — manual process documented"] — Accepted by: [Name] — Date: [Date]
- [ ] [FOLLOW-UP] [issue — to be addressed in sprint [X]] — Jira: [PROJ-###]

---

## Validation Checklist

Before Jira moves to "Ready for Release":

- [ ] A team member unfamiliar with this feature could follow this runbook cold
- [ ] Monitoring thresholds are specific numbers
- [ ] Alert playbooks exist for every RB-MON-### entry
- [ ] Rollback procedure has been tested or explicitly marked untested with risk acceptance
- [ ] Operability Review blockers are resolved
- [ ] No restricted data, credentials, or production endpoints present in document
- [ ] chain-meta upstream hashes match current versions of all upstream artifacts
