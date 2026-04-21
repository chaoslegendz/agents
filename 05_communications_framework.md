# Communications Framework
**Owner:** Treasury Technology Production Support  
**Review Cycle:** Quarterly

---

## Purpose

Clear, timely, accurate communication is as important as technical resolution. Stakeholders can tolerate outages — they cannot tolerate silence or surprises. This framework defines who gets what information, when, and how.

---

## Communication Principles

1. **Communicate early, update often.** It is better to send an early "we are investigating" than to wait until you have all the answers.
2. **Never send an empty update.** Every update must include: current status, what the team is doing, and the next update time.
3. **Match the channel to the audience.** Executives don't need log excerpts. Engineers don't need business-speak summaries.
4. **Own the narrative.** If we don't communicate, someone else will — and it will be less accurate.
5. **Close the loop.** Every incident that triggered notifications must have a resolution notice.

---

## Stakeholder Matrix

| Audience | P1 Notification | P2 Notification | P3 | Channel | Who Notifies |
|---|---|---|---|---|---|
| L3 Technical Team | Immediate | Within 1 hr | Via ticket | Teams / Phone | On-call L2 |
| L2 Team Lead | Immediate | Within 30 min | Daily digest | Teams / Phone | On-call L2 |
| L2 Lead Manager | P1: immediate | P2: within 1 hr | Weekly report | Email / Teams | L2 Lead |
| Business Owners (ALM, Liquidity, etc.) | Within 30 min | Within 2 hrs | If asked | Email / Teams | L2 Lead |
| Risk / Finance Stakeholders | Within 30 min if regulatory impact | As needed | No | Email | L2 Lead |
| Senior Management | P1: within 1 hr | Notable P2 only | No | Email | L2 Lead Manager |
| Enterprise Ops / Monitoring | Alert-driven (auto) | Alert-driven | Auto | PagerDuty / auto | Automated |

---

## P1 Communication Protocol

### 0–30 Minutes: Initial Notification

**Audience:** L3 team lead, L2 lead, business owner  
**Channel:** Teams message + phone call for P1 (don't rely on message alone)  
**Content:**

```
[P1 INCIDENT - ACTIVE]
System: [System name]
Time Detected: [HH:MM ET]
Impact: [What is broken / who is affected]
What we know: [1-2 sentences on current hypothesis]
What we're doing: [Immediate next steps]
Next update: [Time — default 30 minutes]
Incident Ticket: [Link]
```

### Every 30 Minutes: Status Update

**Audience:** Same as initial notification  
**Content:**

```
[P1 UPDATE - HH:MM ET]
System: [System name]
Status: ACTIVE / MITIGATED / RESOLVED
Progress: [What has been done since last update]
Current hypothesis: [What we think the cause is]
Next steps: [What's happening in the next 30 minutes]
ETA to resolution: [Best estimate or "unclear — next update at HH:MM"]
```

### On Resolution: Resolution Notice

**Audience:** All P1 notification recipients  
**Content:**

```
[P1 RESOLVED - HH:MM ET]
System: [System name]
Resolution time: [HH:MM ET]
Duration: [X hours Y minutes]
Root cause (preliminary): [Plain language — 1-2 sentences]
What was done: [Summary of fix]
Next steps: [PIR date, permanent fix timeline if known]
Incident Ticket: [Link]
```

---

## P2 Communication Protocol

### Initial Notification (within 1 hour of detection)

**Audience:** L3 team lead, L2 lead  
**Channel:** Teams message  
**Content:** Same structure as P1 initial, labeled `[P2 INCIDENT - ACTIVE]`

### Hourly Updates (if unresolved after 2 hours)

**Audience:** L3 team lead, L2 lead; business owner if deadline risk materializes  
**Format:** Same as P1 update, labeled `[P2 UPDATE]`

### On Resolution

**Audience:** Initial notification recipients  
**Format:** Same as P1 resolution, labeled `[P2 RESOLVED]`

---

## P3/P4 Communication

- All communication through the incident ticket
- Stakeholders who submitted the request receive an acknowledgment and closure notification
- No bridge or proactive outreach required unless the issue escalates

---

## Bridge / War Room Standards

Initiated for: all P1 incidents, and P2 incidents trending toward deadline risk.

**Bridge Roles:**

| Role | Responsibility |
|---|---|
| **Incident Commander (IC)** | L2 lead or senior engineer. Runs the call. Owns communications. Makes escalation decisions. |
| **Technical Lead** | L3 lead. Owns diagnosis and resolution direction. |
| **Scribe** | Designated L2 team member. Documents the timeline in real-time in the ticket. |
| **Communications Lead** | L2 lead (may be the IC). Owns stakeholder updates — sends updates on time regardless of bridge activity. |

**Bridge Rules:**
- One person speaks at a time. The IC manages this.
- Every action taken on the bridge is announced and logged by the scribe.
- If progress stalls for 15+ minutes, the IC calls a "timeout" — 2-minute pause to reassess hypothesis.
- The IC controls bridge duration — if the issue is resolved, the bridge closes.
- Bridges do not turn into design reviews. Stay focused on restoration.

---

## Sensitive Incident Communications (Regulatory / Data Integrity)

When an incident involves potential regulatory reporting impact or data integrity risk:

1. Notify L2 Lead Manager immediately — they will decide on escalation to Risk / Compliance
2. Do not speculate on regulatory impact in written communications — state facts only
3. Use language like: "We are assessing whether this incident affects [reporting/submission]. We will confirm by [time]."
4. Do not close the incident without confirming regulatory impact is either ruled out or formally acknowledged

---

## Communication Templates Quick Reference

### Bridge Open Announcement
```
[BRIDGE OPEN] P[X] Incident - [System Name]
Bridge: [Teams link / dial-in]
IC: [Name]
Invited: L2 Team, L3 [Team Name], [Business Owner if needed]
Purpose: [One sentence description]
```

### Bridge Close Announcement
```
[BRIDGE CLOSED] P[X] Incident - [System Name]
Status: [RESOLVED / MITIGATED]
Summary: [2-3 sentences]
Next steps: [PIR date, follow-up actions]
Ticket: [Link]
```

### Stakeholder-Facing Regulatory Impact Holding Statement
```
We are currently investigating an incident affecting [System]. 
We are actively assessing impact on [reporting/deadline]. 
We will provide a confirmed update by [time]. 
Point of contact: [Name]
```

---

## Post-Incident Communication

After every P1 (and notable P2), send a brief post-incident summary to business owners within 24 hours of closure:

```
[POST-INCIDENT SUMMARY]
Incident: [One line description]
Date: [Date]
Duration: [Duration]
Impact: [Business-language description]
Root Cause: [Plain language — no jargon]
What We Fixed: [Plain language]
What We're Doing to Prevent Recurrence: [1-3 bullet points]
Questions: [L2 Lead contact info]
```

This is not a PIR — it's a stakeholder communication. It should be readable by someone with no technical background.

---

## Communication Failure Modes to Avoid

| Failure Mode | Why It's a Problem | What to Do Instead |
|---|---|---|
| Silent updates ("still investigating") | Stakeholders don't know if the team is making progress | Always include what the team is currently doing |
| Over-technical notifications to business | Stakeholders can't act on it; erodes trust | Translate: "Databricks job failure" → "Liquidity data pipeline delayed" |
| Waiting for a full picture before first notification | Stakeholders informed late; they find out from someone else | Send early with what you know; update as picture clears |
| Missing the resolution notice | Stakeholders don't know the incident is over | Resolution notice is mandatory for all P1/P2 notifications |
| Sending resolution without root cause | Business asks "will it happen again?" with no answer | Include preliminary root cause, even if under investigation |
