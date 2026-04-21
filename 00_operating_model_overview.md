# Treasury Technology Production Support — Operating Model
**Version:** 1.0  
**Owner:** Treasury Technology Production Support Lead  
**Last Updated:** April 2026

---

## Purpose

This document defines the operating model for the Treasury Technology Production Support team. It establishes how the team receives, triages, resolves, and learns from production issues — and how the team evolves from reactive incident response toward proactive production engineering aligned to Site Reliability Engineering (SRE) principles.

---

## Scope

| System | Status | Support Tier |
|---|---|---|
| ALM / FTP System | Live | Full L2 |
| Liquidity Platform | Live | Full L2 |
| Data Platform | Live | Full L2 |
| ICL Platform | Go-Live: June 2026 | Hypercare → Full L2 |
| QRM Platform | Go-Live: ~Q2 2027 | Pre-production engagement now |

---

## Operating Philosophy

The team operates as **L2 Production Engineers**, not button-pushers. This means:

- **Understand before you act.** Know what a system does, what its failure modes are, and what the downstream impact of an incident is before touching anything.
- **Escalate with context, not confusion.** When engaging L3, bring a timeline, a hypothesis, and the data — not just "it's broken."
- **Fix the pattern, not just the ticket.** Every recurring incident is a signal. Surface it, document it, and drive L3 to resolution.
- **Own the production environment.** Monitoring, alerting, runbooks, and job health are team assets — treat them as such.

---

## Team Structure and Responsibilities

### L2 Production Support (This Team)

- First responder for all production alerts and incidents
- Triage, initial diagnosis, and communication
- Execution of documented runbooks
- Escalation to L3 with full context
- Tracking and closure of incidents
- Metrics collection and trend analysis
- Participation in post-incident reviews
- Continuous improvement: runbooks, alerting, observability gaps

### L3 Application / Engineering Teams

- Root cause analysis and code-level fixes
- Permanent remediation and patch deployment
- Runbook authorship (team reviews and maintains)
- Capacity and performance engineering
- Architecture-level issue resolution

### Business / Stakeholders

- Incident impact validation
- Priority arbitration when business judgment is needed
- Approval for emergency change procedures

---

## Document Index

| Document | Purpose |
|---|---|
| `01_incident_prioritization_sla.md` | Priority definitions, SLA targets, escalation thresholds |
| `02_sop_incident_management.md` | Step-by-step incident lifecycle procedures |
| `03_sop_change_management.md` | Change control for production interventions |
| `04_metrics_and_reporting.md` | Team KPIs, reliability metrics, reporting cadence |
| `05_communications_framework.md` | Internal and stakeholder communication protocols |
| `06_sre_transformation_guide.md` | Skills, habits, and practices for production engineering maturity |

---

## Operating Hours and On-Call

| Window | Coverage Model |
|---|---|
| Core Hours (7am – 6pm ET, Mon–Fri) | Full team coverage, primary responder + backup designated |
| Extended / Off-Hours | On-call rotation (define roster separately) |
| EOD / Batch Critical Windows | Dedicated monitoring watch with checklist |
| Go-Live Hypercare (ICL June 2026) | Elevated coverage — see Hypercare SOP |

---

## Key Interfaces

| Party | Interaction |
|---|---|
| L3 ALM/FTP Team | Technical escalation, runbook updates, PIR participation |
| L3 Liquidity/Data Platform Team | Technical escalation, pipeline failure triage |
| QRM Build Team | Pre-production engagement: observability design, runbook drafting |
| ICL Platform Team | Hypercare coordination, go-live readiness |
| Enterprise Monitoring / Ops | Alert feed integration, AutoSys/Databricks job visibility |
| Risk & Finance Stakeholders | Incident impact communication, SLA reporting |
| OSFI / Regulatory Programs | Indirect — regulatory deadlines drive incident priority |
