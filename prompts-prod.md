# Prod Support Prompt Library
**Role:** Production Support  
**Tools:** M365 Copilot (primary) · GitHub Copilot in VS Code (roadmap)

> These prompts are starting points. Prod Support owns the operational artifacts. Agent output is a draft — always validate against actual system behaviour before a runbook is used in production.

---

## 1. Generate Runbook from Artifact Chain

**When to use:** After QA sign-off, before a feature goes to production.  
**Tool:** M365 Copilot (current) · GitHub Copilot (roadmap)

```
You are a senior production support engineer writing a runbook for a new feature deployment.

Jira ticket: [JIRA-####]

Requirements:
[PASTE REQUIREMENTS]

Implementation summary (from plan or dev notes):
[PASTE JIRA-####-plan or dev summary]

BSA test cases (for understanding what was built):
[PASTE JIRA-####-testplan-bsa — key cases only]

Generate a production runbook with the following sections:

## Runbook — JIRA-####: [Feature Name]
**Version:** 1.0  
**Owner:** [Your name]  
**Last updated:** [Date]

### 1. Overview
[What this feature does and why it matters operationally — 2–3 sentences]

### 2. Systems involved
[List all systems, APIs, databases, and data flows this feature touches]

### 3. Deployment steps
[Ordered, numbered steps to deploy this feature to production]

### 4. Verification steps
[How to confirm the deployment was successful — specific checks, not generic]

### 5. Monitoring
- Key metrics to watch post-deployment
- Normal ranges or thresholds
- Dashboards or queries to use

### 6. Rollback procedure
[Exact steps to roll back if something goes wrong — assume a non-expert may execute this]

### 7. Known risks
[What could go wrong and what the early warning signs are]

### 8. Escalation path
[Who to contact and in what order if issues arise]
```

**What good output looks like:** Rollback steps are specific enough for a non-expert. Verification steps are observable checks, not "check that it works." Escalation path names roles, not individuals.

---

## 2. Generate Alert Playbook

**When to use:** After generating the runbook, to document how to respond to specific alerts.  
**Tool:** M365 Copilot (current) · GitHub Copilot (roadmap)

```
Generate an alert playbook for the following system/feature.

Jira ticket: [JIRA-####]
Feature/component: [NAME]
Systems involved: [LIST]

Alerts to cover:
[LIST KNOWN ALERTS OR DESCRIBE THE FAILURE MODES]

For each alert, generate a playbook entry:

## Alert: [ALERT NAME]
**Severity:** P1 / P2 / P3  
**System:** [which system fires this]  
**Condition:** [what triggers the alert]

### Symptoms
[What the operator will observe — logs, metrics, user impact]

### Immediate actions (first 5 minutes)
1. [Step]
2. [Step]

### Investigation steps
1. [What to check first]
2. [What to check next]
3. [Queries, commands, or dashboards to run]

### Resolution
[How to resolve the most common causes]

### Escalation
[When to escalate and to whom]

### Post-incident
[What to document and any follow-up actions]
```

**What good output looks like:** Immediate actions are specific and executable within 5 minutes. Investigation steps include actual queries or commands, not just "check the logs."

---

## 3. Operability Review

**When to use:** After reviewing the dev implementation, before QA sign-off. Surface operability gaps back to dev while changes are still cheap.  
**Tool:** M365 Copilot (current) · GitHub Copilot (roadmap)

```
You are a senior production support engineer reviewing a new feature for operability before it goes to QA.

Jira ticket: [JIRA-####]

Implementation summary:
[PASTE JIRA-####-plan or dev summary]

Requirements:
[PASTE REQUIREMENTS]

Review for the following operability concerns:

1. Observability — can we tell if this is working correctly in production?
   - Are there logs at the right level of detail?
   - Are there metrics or counters we can monitor?
   - Is there a way to query the state of the system after a run?

2. Rollback — can we reverse this if something goes wrong?
   - Is the change reversible?
   - Are there data migrations that cannot be rolled back?
   - What is the blast radius if this fails?

3. Failure modes — what happens when it breaks?
   - What happens when upstream data is missing, late, or malformed?
   - What happens when downstream systems are unavailable?
   - Does it fail loudly (error logged, alert fired) or silently?

4. Runbook readiness — can support operate this?
   - Is there a way to manually trigger, re-run, or skip this process?
   - Are configuration parameters documented?
   - Can a non-developer diagnose a failure without reading the code?

5. Regulatory / audit — can we demonstrate compliance?
   - Is there an audit trail for any regulated calculation or data movement?
   - Are data lineage requirements (BCBS 239) satisfied?

Output:
- Finding: [description]
- Category: Observability / Rollback / Failure modes / Runbook readiness / Regulatory
- Severity: Must fix before prod / Should fix before prod / Nice to have
- Recommendation: [specific action for dev]

Overall readiness: Ready for QA / Conditional — fix [X] first / Not ready
```

**What good output looks like:** At least one finding per category. Must-fix items are specific enough for dev to act on. Overall readiness decision is clear.

---

## 4. Log Analysis — Diagnose a Production Issue

**When to use:** When investigating a production incident or unexpected behaviour.  
**Tool:** GitHub Copilot (roadmap) · M365 Copilot (current, paste logs manually)

```
Help me diagnose a production issue from the following logs.

System: [NAME]
Jira ticket (if known): [JIRA-#### or "unknown"]
Time of issue: [TIMESTAMP]
What was observed: [DESCRIBE THE SYMPTOM]

Logs:
[PASTE LOG EXTRACT]

Analyse:
1. What is the root error? Find the first exception or error in the chain.
2. What caused the root error? Trace back through the log.
3. What is the sequence of events leading to the failure?
4. Is this a code defect, data issue, environment issue, or external dependency failure?
5. Which system or component is the source of the problem?
6. What is the business impact of this failure?

Output:
- Root cause: [description]
- Category: Code / Data / Environment / External dependency
- First occurrence in log: [timestamp and line]
- Recommended immediate action: [what to do right now]
- Recommended permanent fix: [what to fix so it doesn't recur]
```

**What good output looks like:** Root cause is specific — not "there was an error" but "the null value on field X caused a NullPointerException at line Y." Immediate and permanent fixes are distinct.

---

## 5. Draft Incident Report

**When to use:** After resolving a production incident.  
**Tool:** M365 Copilot

```
Draft a production incident report for the following event.

System: [NAME]
Jira ticket: [JIRA-#### or incident ticket]
Date/time of incident: [START — END]
Severity: P1 / P2 / P3
Detected by: [How was it detected — alert, user report, monitoring]

What happened:
[DESCRIBE THE INCIDENT]

Timeline:
[LIST KEY EVENTS WITH TIMESTAMPS]

Root cause:
[DESCRIBE ROOT CAUSE]

Resolution:
[DESCRIBE HOW IT WAS FIXED]

Format:
## Incident Report — [SYSTEM] — [DATE]
**Severity:** [P1/P2/P3]  
**Duration:** [X hours Y minutes]  
**Systems affected:** [list]  
**User impact:** [describe]

### Timeline
| Time | Event |
|------|-------|
[rows]

### Root cause
[Clear, non-technical description followed by technical detail]

### Resolution
[What was done to restore service]

### Prevention
- Immediate: [What was done right away to prevent recurrence]
- Long-term: [What needs to change in the code, runbook, or monitoring]

### Action items
| Action | Owner | Due date |
|--------|-------|----------|
[rows]
```

**What good output looks like:** Timeline is factual, not interpretive. Root cause clearly distinguishes immediate cause from underlying cause. Action items have owners.

---

## 6. Generate Monitoring Dashboard Spec

**When to use:** When a new feature needs a monitoring view and you need to specify what to build.  
**Tool:** M365 Copilot (current) · GitHub Copilot (roadmap)

```
Generate a monitoring dashboard specification for the following feature.

Feature: [NAME]
Jira ticket: [JIRA-####]
Systems involved: [LIST]
Key business process: [DESCRIBE WHAT THIS DOES]

For each panel/widget, specify:
- Panel name
- Metric or query (describe in plain language — engineering will implement)
- Chart type: Time series / Counter / Table / Alert status
- Normal range or threshold
- Alert condition (when should this turn red?)
- Why this matters operationally

Panels to include:
1. System health — is it running?
2. Throughput — how much data/work is being processed?
3. Error rate — are there failures?
4. Latency — is it performing within acceptable bounds?
5. Data freshness — is the data current? (especially relevant for regulatory reporting)
6. Business metric — [the specific business outcome this feature produces]

Also specify:
- Refresh rate
- Time range default (last 1 hour / 24 hours / 7 days)
- Who should be alerted and at what threshold
```

**What good output looks like:** Each panel has a clear alert condition. Business metric panel is specific to the feature. Thresholds are concrete numbers, not "when things look wrong."

---

## 7. Update Runbook After Incident

**When to use:** After a production incident reveals a gap in an existing runbook.  
**Tool:** M365 Copilot

```
A production incident revealed a gap in our runbook. Help me update it.

Existing runbook:
[PASTE CURRENT RUNBOOK]

What the incident revealed:
[DESCRIBE WHAT HAPPENED AND WHAT THE RUNBOOK MISSED]

Root cause from incident report:
[PASTE ROOT CAUSE]

Update the runbook to:
1. Add the missing scenario to the Known risks section
2. Add the diagnostic steps that resolved the incident to the Investigation steps
3. Update the Rollback procedure if it was found to be insufficient
4. Add a new alert to the monitoring section if one was identified
5. Update the Escalation path if the right people were not contacted quickly enough

Output the updated sections only — do not regenerate the entire runbook unless necessary.
Mark all changes with [UPDATED] so they are easy to review.
```

**What good output looks like:** Only changed sections are returned. Every change is marked [UPDATED]. The runbook is better after the next person reads it than before the incident.
