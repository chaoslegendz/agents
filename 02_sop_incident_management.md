# SOP: Incident Management
**Owner:** Treasury Technology Production Support  
**Review Cycle:** Quarterly

---

## Overview

This SOP defines the end-to-end lifecycle for all production incidents, from detection through closure and learning. Every incident — regardless of priority — must follow this process.

---

## Incident Lifecycle

```
DETECT → TRIAGE → DIAGNOSE → RESOLVE → COMMUNICATE → CLOSE → LEARN
```

---

## Phase 1: Detect

**Goal:** Identify that something is wrong before the business does.

**Sources:**
- Automated monitoring alerts (target: majority of incidents detected here)
- AutoSys job failure notifications
- Databricks pipeline failure alerts
- Stakeholder or business notification (failure mode — drives improvement backlog)
- Peer team notification (L3, adjacent ops teams)

**Actions:**
1. Acknowledge the alert in the monitoring tool — claim ownership
2. Record detection time (use this as Incident Start Time)
3. Open an incident ticket immediately — do not wait until you understand the issue
4. Set initial priority based on `01_incident_prioritization_sla.md`

**Team Standard:** If a stakeholder finds it before we do, document it as an observability gap and raise a follow-up improvement item.

---

## Phase 2: Triage

**Goal:** Determine impact, scope, and initial priority within the acknowledge SLA.

**Actions:**
1. Determine which system(s) are affected
2. Identify what is broken vs. what is degraded vs. what is at risk
3. Check for upstream/downstream dependencies — is this a symptom of something else?
4. Confirm or adjust priority
5. Initiate communications per `05_communications_framework.md`
6. If P1/P2: notify L3 counterpart immediately even if you don't have a full picture yet

**Triage Questions:**
- What is the user-visible impact right now?
- Is there a regulatory or EOD deadline that this affects?
- Has this happened before? (Check runbooks and incident history)
- Is this getting worse or stable?
- Is there a documented workaround?

**Output:** Incident ticket updated with: affected system, priority, impact statement, initial hypothesis, time of first notification.

---

## Phase 3: Diagnose

**Goal:** Build a clear hypothesis of root cause using available evidence.

**Do:**
- Check logs, dashboards, job output, error messages — gather evidence before acting
- Build a timeline of events (what changed, when, in what order)
- Correlate with recent changes: deployments, config changes, infrastructure events
- Use runbooks as a starting point — document deviations as you go

**Do Not:**
- Make production changes without logging them
- Restart systems or rerun jobs without understanding why they failed
- Skip diagnosis and go straight to "let's just restart it"

**Actions:**
1. Pull relevant logs and attach to the incident ticket
2. Document your working hypothesis: "We believe X failed because Y, evidenced by Z"
3. Identify the minimal intervention needed to restore service
4. If the hypothesis requires a change: follow `03_sop_change_management.md`
5. If stuck after 30 minutes: escalate to L3 with your timeline and hypothesis — never escalate empty-handed

**Escalation to L3 Package (always include):**
- Incident start time and detection method
- Affected system and user/business impact
- Timeline of observed events
- Logs or error output (screenshot or paste)
- What has already been tried
- Your working hypothesis

---

## Phase 4: Resolve

**Goal:** Restore service within SLA, with minimum production risk.

**Actions:**
1. Execute remediation per runbook or agreed L3 guidance
2. Log every action taken in the incident ticket with timestamp
3. Validate restoration — confirm with a test, a metric, or with the affected stakeholder
4. Do not close the incident until the system is confirmed healthy
5. If a workaround was used (not a permanent fix): mark as "mitigated" and raise a follow-up for permanent fix

**Runbook Standards:**
- If a runbook was used and worked: note it in the ticket
- If a runbook was missing: create a draft within 24 hours
- If a runbook was wrong or incomplete: update it and flag for L3 review
- Every recurring fix that isn't in a runbook is a runbook gap

---

## Phase 5: Communicate

See `05_communications_framework.md` for full protocols. Summary:

- **P1:** Initial notification within 30 minutes of detection, updates every 30 minutes, resolution notice on close
- **P2:** Notification within 1 hour, updates every 1–2 hours, resolution notice on close
- **P3/P4:** Ticket-based — no bridge communication required
- Never send an update that says "still investigating" without also saying what you are looking at

---

## Phase 6: Close

**Goal:** Properly document the incident so the next person has a complete picture.

**Required ticket fields at close:**
| Field | Description |
|---|---|
| Detection Time | When the alert/notification was first received |
| Acknowledge Time | When the team took ownership |
| Impact Start | Earliest confirmed time of user-facing impact |
| Impact End | When service was restored |
| Root Cause | Plain-language description — what actually failed and why |
| Resolution | What was done to fix it |
| Workaround? | Yes/No — if yes, link to follow-up ticket |
| Runbook Used | Name/link or "none — draft created" |
| Repeat Incident? | Yes/No — if yes, link to previous incident |
| PIR Required? | Yes for all P1; optional for P2; team lead decision |

**Close within:** 4 hours of resolution for P1/P2; end of business day for P3.

---

## Phase 7: Learn — Post-Incident Review (PIR)

**Required for:** All P1 incidents. Recommended for P2 and any repeat P3.

**PIR must be completed within:** 5 business days of incident closure.

### PIR Structure

**1. Incident Summary**
- What happened, when, what was the impact

**2. Timeline**
- Minute-by-minute sequence of detection, diagnosis, key decisions, resolution

**3. Root Cause Analysis**
- Use the "5 Whys" method — get past the symptom to the systemic cause

**4. What Went Well**
- Detection time, team coordination, runbook accuracy, communication

**5. What Didn't Go Well**
- Gaps in observability, unclear runbooks, slow escalation, communication breakdowns

**6. Action Items**
| Action | Owner | Due Date | Type |
|---|---|---|---|
| Fix root cause in code | L3 Team | [date] | Permanent fix |
| Update runbook | L2 Team | [date] | Documentation |
| Add missing alert | L2 + L3 | [date] | Observability |
| Add to trend tracking | L2 Lead | [date] | Metrics |

**PIR is not a blame exercise.** The question is always: what did the system (process, tooling, monitoring, runbook) fail to prevent, detect, or contain — and what do we change?

---

## Recurring Incidents

If the same incident (same root cause) occurs more than twice in a rolling 90-day period:

1. Flag as a **reliability risk** in the weekly report
2. Require a formal L3 engagement to present a permanent fix plan
3. Track as an open risk until resolved
4. Escalate to management if no fix is committed within 30 days

---

## Incident Ticket Hygiene

- Every alert gets a ticket — even if it resolves in 5 minutes
- Tickets are updated in real-time during active incidents, not reconstructed after
- No ticket should sit unresolved with no update for more than 4 hours during business hours
- Team lead reviews open ticket queue daily
