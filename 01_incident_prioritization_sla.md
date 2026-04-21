# Incident Prioritization & SLA
**Owner:** Treasury Technology Production Support  
**Applies To:** ALM/FTP, Liquidity Platform, Data Platform, ICL (from June 2026), QRM (from go-live)

---

## Priority Framework

Priority is assigned at triage and may be adjusted as impact becomes clearer. When in doubt, **start higher and downgrade** — never start lower and scramble to catch up.

---

### P1 — Critical

**Definition:** Complete loss of a production system or regulatory/financial reporting function with no workaround available. Active financial or regulatory exposure.

**Examples:**
- ALM/FTP system fully down during business day — FTP rates unavailable to trading desks
- EOD risk or regulatory capital batch (FRTB, VaR, SA-CCR, CVA) failed with no recovery path before reporting deadline
- Liquidity reporting data unavailable during an OSFI reporting window
- Data corruption affecting a downstream regulatory submission
- ICL platform down during a live treasury transaction window

**Response SLA:** 15 minutes to acknowledge, war room initiated within 30 minutes  
**Resolution Target:** Best effort; business and executive stakeholders notified immediately  
**Escalation:** L3 engaged immediately; business owner notified; management chain aware  
**Bridge/War Room:** Required  

---

### P2 — High

**Definition:** Material degradation of a production system, or a P1-equivalent system at risk of failing before a known deadline. Workaround may exist but is not sustainable.

**Examples:**
- ALM/FTP producing incorrect FTP rates; business can hold but not indefinitely
- Liquidity pipeline delayed; intraday reporting impacted but end-of-day deadline not yet breached
- Databricks job running significantly over SLA — deadline risk is accumulating
- AutoSys job chain broken mid-run; downstream dependent jobs queued
- Data quality issue flagged by downstream consumers with potential regulatory impact

**Response SLA:** 30 minutes to acknowledge  
**Resolution Target:** 4 hours or before next reporting window, whichever is sooner  
**Escalation:** L3 engaged within 1 hour if no clear path to resolution  
**Bridge/War Room:** As needed based on trajectory  

---

### P3 — Medium

**Definition:** Non-critical degradation, functional workaround available, no immediate deadline risk. Business is inconvenienced but not blocked.

**Examples:**
- Non-critical batch job failed; can be re-run next cycle without impact
- Monitoring alert firing but investigation shows it is a false positive — underlying system healthy
- Performance degradation (slow response) with no deadline risk
- Single user or team impacted, broader functions unaffected
- Reconciliation discrepancy that does not affect a regulatory number

**Response SLA:** 2 hours to acknowledge  
**Resolution Target:** Next business day  
**Escalation:** L3 engaged if root cause is unclear after initial investigation  
**Bridge/War Room:** Not required  

---

### P4 — Low

**Definition:** Minor issue, informational, or enhancement request surfaced through support channel. No production impact.

**Examples:**
- Runbook or documentation needs updating
- Non-urgent alert tuning request
- Cosmetic UI issue in monitoring dashboard
- Question from stakeholder that requires L3 clarification
- Feature gap that should be logged as a backlog item

**Response SLA:** Next business day  
**Resolution Target:** Scheduled via backlog  
**Escalation:** Not applicable  

---

## Priority Decision Guide

Use this when triage is ambiguous.

```
Is a regulatory reporting deadline at risk?
  YES → P1 (if no workaround) or P2 (if workaround exists)

Is a production system completely down?
  YES → P1

Is a production system degraded or at risk of failing?
  YES → P2

Is there a workaround and no deadline risk?
  YES → P3

Is there no end-user impact today?
  YES → P4
```

**Regulatory-sensitive windows always elevate priority by one level** if the incident occurs within 2 hours of an OSFI, internal risk, or capital reporting deadline.

---

## SLA Summary Table

| Priority | Acknowledge | Target Resolution | L3 Escalation | Bridge Required |
|---|---|---|---|---|
| P1 | 15 min | Best effort / before deadline | Immediately | Yes |
| P2 | 30 min | 4 hrs or before next window | Within 1 hr if no path | As needed |
| P3 | 2 hrs | Next business day | If root cause unclear | No |
| P4 | Next business day | Scheduled | N/A | No |

---

## Escalation Triggers

Regardless of priority, escalate to management and/or L3 when:

- The team has been working an incident for **30+ minutes with no clear hypothesis**
- An incident is **trending worse** after initial intervention
- A system is **approaching a hard deadline** (regulatory, EOD, liquidity)
- **Data integrity** is in question — stop the pipeline before it propagates bad data
- An incident requires a **change to production** that is outside a documented runbook
- A **repeat incident** is occurring with the same root cause as a previous PIR

---

## System-Specific Priority Considerations

| System | Special Consideration |
|---|---|
| ALM/FTP | FTP rate availability drives desk pricing; any gap during trading hours elevates to minimum P2 |
| Liquidity Platform | Intraday LCR/NSFR monitoring has regulatory sensitivity — data staleness >1hr may require reporting notification |
| Data Platform | Upstream failures propagate — check dependency chain before downgrading severity |
| FRTB/VaR/SA-CCR Batches | Hard EOD deadline; missing the window = regulatory miss. P1 if batch not completing on trajectory |
| ICL Platform | Hypercare period (June–Sept 2026): all P3+ escalated to L3 same day |
| QRM | First 90 days post go-live: default to P2 for any unexpected behavior |
