# Metrics & Reporting Framework
**Owner:** Treasury Technology Production Support  
**Review Cycle:** Monthly

---

## Purpose

Metrics drive accountability, improvement, and visibility. This framework defines what the team measures, how it is calculated, and how it is reported. Metrics are not vanity — if a number doesn't drive a decision or an improvement, it shouldn't be tracked.

---

## Metric Categories

| Category | What It Measures |
|---|---|
| **Reliability** | How available and healthy the systems are |
| **Responsiveness** | How fast the team detects and reacts |
| **Quality** | How well incidents are handled and prevented |
| **Improvement** | How fast the team is reducing toil and risk |

---

## Reliability Metrics (System Health)

### 1. System Availability
**Definition:** Percentage of time a system is operational within its defined service window.  
**Target:** 99.5% per system per month (equivalent to ~3.6 hrs downtime/month)  
**Calculation:** `(Total window minutes - Downtime minutes) / Total window minutes × 100`  
**Tracked Per:** ALM/FTP, Liquidity Platform, Data Platform, ICL (from June), QRM (from go-live)

### 2. Batch Success Rate
**Definition:** Percentage of scheduled batch runs that complete successfully without manual intervention.  
**Target:** ≥ 97% per system per month  
**Calculation:** `Successful runs / Total scheduled runs × 100`  
**Why It Matters:** High manual intervention rate = excessive toil and reliability risk.

### 3. SLA Breach Count
**Definition:** Number of incidents per month where the regulatory or business reporting deadline was missed.  
**Target:** 0  
**Tracked Per:** FRTB/EOD Risk, FTP, VaR, SA-CCR, CVA/BA-CVA, Liquidity reporting

### 4. Mean Time Between Failures (MTBF)
**Definition:** Average time between recurring incidents on the same system.  
**Target:** Increasing month-over-month  
**Calculation:** `Total operating time / Number of incidents`

---

## Responsiveness Metrics (Team Reaction)

### 5. Mean Time to Acknowledge (MTTA)
**Definition:** Average time from alert/notification to a team member claiming the incident.  
**Targets:** P1 < 15 min | P2 < 30 min | P3 < 2 hrs  
**Source:** Incident ticket timestamps

### 6. Mean Time to Detect (MTTD)
**Definition:** Time from actual impact start to team detection.  
**Target:** Trending down month-over-month; alert-detected incidents > stakeholder-detected incidents  
**Why It Matters:** If stakeholders are finding incidents before us, monitoring is failing.

### 7. Mean Time to Resolve (MTTR)
**Definition:** Average time from incident detection to confirmed resolution.  
**Targets:** P1 < 4 hrs | P2 < 8 hrs | P3 < 24 hrs  
**Tracked By:** Priority and system

### 8. Stakeholder-Detected Rate
**Definition:** Percentage of incidents first reported by a business stakeholder rather than detected by monitoring.  
**Target:** < 10% of all incidents  
**Why It Matters:** Every stakeholder-detected incident is a monitoring gap. Track and eliminate.

---

## Quality Metrics (Process Discipline)

### 9. PIR Completion Rate
**Definition:** Percentage of P1 incidents with a completed PIR within 5 business days.  
**Target:** 100%

### 10. Repeat Incident Rate
**Definition:** Percentage of incidents that share a root cause with a prior incident in the last 90 days.  
**Target:** < 15% and declining  
**Action Trigger:** > 2 repeats on the same root cause → formal L3 engagement required

### 11. Runbook Coverage Rate
**Definition:** Percentage of recurring incident types (top 10 by volume) that have an approved runbook.  
**Target:** 100% coverage of top 10 patterns within 90 days; 80% of all known patterns ongoing

### 12. Ticket Hygiene Score
**Definition:** Percentage of closed incident tickets with all required fields populated (root cause, resolution, timestamps, PIR flag).  
**Target:** ≥ 95%  
**Tracked By:** Team lead audit, monthly

---

## Improvement Metrics (Toil & Risk Reduction)

### 13. Toil Reduction Trend
**Definition:** Number of manual interventions eliminated per month through runbook creation, alerting improvements, or L3 permanent fixes.  
**Target:** Net positive each quarter  
**Tracked As:** Count of improvements shipped (runbooks added, alerts tuned, L3 fixes delivered)

### 14. Open PIR Action Items
**Definition:** Count of open action items from PIRs, by age bucket (< 30 days, 30–60 days, > 60 days).  
**Target:** Zero items > 60 days old; all P1-sourced items resolved within 30 days

### 15. Observability Gap Count
**Definition:** Number of open items in the observability backlog (missing alerts, missing dashboards, blind spots identified during incidents).  
**Target:** Decreasing month-over-month

---

## Reporting Cadence

| Report | Audience | Frequency | Owner |
|---|---|---|---|
| Daily Health Digest | L2 Team | Daily (async, written) | On-call lead |
| Weekly Operations Report | L2 Lead + L3 Leads | Weekly | L2 Lead |
| Monthly Reliability Report | Management + Stakeholders | Monthly | L2 Lead |
| Quarterly Trend Review | Management + L3 Architecture | Quarterly | L2 Lead + L3 Lead |
| Ad hoc PIR | L2 + L3 + Business owner | Within 5 days of P1 | Incident owner |

---

## Daily Health Digest Format

Sent each morning by on-call lead covering the prior 24 hours:

```
DATE: [Date]
ON-CALL: [Name]

SYSTEM STATUS:
  ALM/FTP:          [GREEN / YELLOW / RED] — [one line note]
  Liquidity:        [GREEN / YELLOW / RED] — [one line note]
  Data Platform:    [GREEN / YELLOW / RED] — [one line note]
  ICL:              [GREEN / YELLOW / RED] — [one line note if live]

INCIDENTS (last 24h):
  [Ticket] | [System] | [Priority] | [Status] | [One line summary]

OPEN ITEMS:
  [Anything requiring attention today]

BATCH/JOB STATUS (overnight runs):
  [Key batch outcomes — success, failed, late, recovered]
```

---

## Weekly Operations Report Format

```
WEEK OF: [Date range]

RELIABILITY SUMMARY:
  [Table: System | Availability % | Batch Success % | SLA Breaches]

INCIDENT SUMMARY:
  Total: [#] | P1: [#] | P2: [#] | P3: [#] | P4: [#]
  MTTA (avg): [P1] [P2]
  MTTR (avg): [P1] [P2]
  Stakeholder-detected: [# and %]

TOP ISSUES THIS WEEK:
  [3-5 bullet points on significant incidents or patterns]

IMPROVEMENT SHIPPED:
  [Runbooks added, alerts tuned, PIR actions closed]

OPEN RISKS:
  [Repeat incidents, overdue PIR actions, observability gaps]

NEXT WEEK FOCUS:
  [Planned improvements, known risk windows, new system prep]
```

---

## Monthly Reliability Report Structure

1. Executive Summary (3–5 sentences — designed to be read in 60 seconds)
2. System Availability Dashboard (chart: availability % by system by month, rolling 6 months)
3. Incident Volume and Severity Trend (chart: P1/P2/P3 by month)
4. MTTA / MTTR Trend (chart: rolling 3-month averages)
5. SLA Breach Log (if any) — what, when, why, what changed
6. Repeat Incident Analysis — top recurring issues and status of permanent fix
7. Improvement Actions Shipped
8. Upcoming Risk: new go-lives, known risk windows, resource gaps

---

## Metric Review Governance

- Metrics are reviewed by L2 Lead in the weekly operations report
- Anomalies (SLA breaches, rising MTTR, increasing stakeholder-detected rate) trigger a review call
- All metrics are baselined in Month 1 of this operating model, with targets reviewed after 90 days
- Metrics are stored in a shared location accessible to L3 and management
