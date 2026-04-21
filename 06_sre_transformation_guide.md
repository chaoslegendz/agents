# SRE Transformation Guide: From Reactive Support to Production Engineering
**Owner:** Treasury Technology Production Support  
**Audience:** L2 Production Support Team  

---

## Why This Change

The team has been operating as incident responders — reacting to problems, executing steps without necessarily understanding them, and passing issues to L3 without meaningful context. That model does not scale as the portfolio grows (ICL in June, QRM in ~a year), and it creates unnecessary risk in a regulated environment where a missed deadline or data integrity issue has real consequences.

The shift is not about writing code. It's about **thinking like a production engineer** — someone who understands the systems they support, anticipates failure, drives systemic improvement, and owns production as a discipline, not a queue.

This is achievable. It requires changing habits, not roles.

---

## What Changes — And What Doesn't

| What Stays the Same | What Changes |
|---|---|
| L2 does not write application code | L2 understands what the code does and why it fails |
| L3 owns root cause and permanent fixes | L2 owns the quality of the escalation and the follow-through |
| Runbooks drive standard operations | L2 authors, maintains, and improves runbooks — not just executes them |
| Business owns priority arbitration | L2 influences priority by understanding and communicating impact clearly |

---

## The Five Habits of a Production Engineer

### 1. Understand Your Systems

You cannot diagnose what you don't understand. For each system in scope, every team member should be able to answer:

- What does this system do? What business function does it enable?
- What are its major components (jobs, pipelines, APIs, databases)?
- What does healthy look like? (Normal metrics, expected job runtimes, typical output volumes)
- What are its known failure modes?
- What are the downstream dependencies and what breaks if this system is late or wrong?

**How to build this knowledge:**
- Shadow L3 on root cause investigations — ask what and why, not just what to do
- Read architecture and design documents (even partially)
- Review the last 10 incidents on each system — what patterns do you see?
- Request a "system walkthrough" session from L3 for each platform once per quarter

**Target:** Within 60 days, each team member documents a one-page system profile for at least one assigned system.

---

### 2. Detect Problems Before the Business Does

Proactive detection is the highest-leverage thing the team can do. Every incident the business finds before we do is a failure of our monitoring.

**Practices:**
- Review dashboards at the start of every shift — don't wait for alerts
- Know the expected completion times for every batch/job in the portfolio; investigate anything running significantly over
- Build a morning checklist for the overnight batch window: which jobs should have completed, what are the acceptable outcomes
- When an alert fires, ask: "Why didn't a better alert catch this 30 minutes earlier?" — and log the gap

**Metrics to watch:**
- Stakeholder-detected incident rate (target: < 10%)
- Mean time to detect (target: trending down)

**Team Standard:** At least one monitoring improvement (new alert, tuned threshold, added dashboard panel) per sprint or two-week period per team.

---

### 3. Escalate with Precision

Escalating to L3 is not a hand-off — it is a collaboration. The quality of the escalation determines the quality of the response.

**What a good escalation looks like:**
- Timeline of observed events (with timestamps)
- Exact error messages or log snippets attached to the ticket
- Hypothesis: "We believe X is failing because Y, evidenced by Z"
- What has already been tried and what was observed
- Impact: "This affects [what] and if not resolved by [time], [consequence]"
- Question: "We need your help with [specific question or action]"

**What a poor escalation looks like:**
- "The ALM system is down"
- "Can you take a look?"
- No logs, no timeline, no hypothesis

**Rule:** Never pick up the phone to escalate without first updating the ticket. The ticket is the shared record — L3 should be able to read it and understand the situation in 2 minutes.

---

### 4. Drive Permanent Fixes

L2 owns the problem until it is permanently resolved — not just mitigated. This is the key mindset shift.

**What this means in practice:**
- Track every workaround as an open risk. A mitigated incident is not a closed incident.
- For every repeat incident: raise a formal flag, demand a root cause from L3, and track the fix to completion.
- Participate in PIRs — don't just attend, contribute observations. You were in the incident; your perspective is data.
- Every runbook you execute is a candidate for improvement. Note gaps, ambiguities, and steps that didn't work — then fix them.

**Improvement backlog items L2 should own:**
- Runbook gaps (missing, incomplete, incorrect)
- Monitoring/alerting gaps (false negatives, blind spots)
- Toil items (manual steps that could be automated or eliminated)
- Recurring issues (repeat incidents awaiting permanent L3 fix)

**Target:** The team should ship at least 2–3 improvement items per sprint that reduce toil or risk. These are tracked in the weekly report.

---

### 5. Communicate Like an Owner

Production engineers communicate clearly, proactively, and without prompting. They don't wait to be asked for a status update.

**In an incident:**
- Send the initial notification before you fully understand the issue
- Update stakeholders every 30 minutes (P1) without waiting to be asked
- Translate technical details into business impact — "Databricks pipeline failed" means nothing to a treasury manager; "Liquidity intraday report is 2 hours delayed" does

**Day-to-day:**
- Send the daily health digest every morning without being reminded
- Flag risks before they become incidents: "Job X has been running 40% longer than average this week — we're investigating with L3"
- Close the loop on everything: every stakeholder notification gets a resolution notice

---

## Transition Plan: 90-Day Milestones

### Days 1–30: Baseline and Awareness

- [ ] Every team member reads this operating model in full
- [ ] Incident priority matrix applied to all new tickets (consistently)
- [ ] Daily health digest format adopted
- [ ] Ticket hygiene standard applied: all required fields populated at close
- [ ] Team lead audits tickets weekly and provides feedback
- [ ] Each team member identifies one system to document (system profile)
- [ ] Metrics baseline established (MTTA, MTTR, stakeholder-detected rate)

### Days 31–60: Process Discipline

- [ ] All P1 communications follow the communications framework (no exceptions)
- [ ] Escalation quality improves: L3 feedback solicited monthly
- [ ] Runbook gap list created: every incident with no runbook flagged
- [ ] First runbook drafts completed by team members
- [ ] PIR completed for every P1 (on time)
- [ ] First improvement items shipped (alert tuning, runbook additions)
- [ ] System profiles completed for all live systems

### Days 61–90: Production Engineering Habits

- [ ] Stakeholder-detected incident rate tracked and trending down
- [ ] Repeat incident rate reviewed: top repeats formally flagged to L3
- [ ] Improvement backlog active: items created, tracked, closed each sprint
- [ ] ICL go-live hypercare plan prepared (see below)
- [ ] QRM pre-production engagement started: team briefed on architecture, runbook drafts begun
- [ ] Monthly reliability report delivered to management
- [ ] Team retrospective: what's working, what needs adjustment

---

## New System Onboarding Protocol

As QRM and ICL come live, L2 must be prepared before go-live, not after. For each new system:

**T-90 Days:**
- Request architecture walkthrough from L3/build team
- Identify: batch jobs, pipelines, key dependencies, expected runtimes
- Begin monitoring design conversation: what alerts are needed? what dashboards?

**T-60 Days:**
- Draft initial runbooks for known failure modes (with L3 input)
- Confirm monitoring is in place and L2 has access
- Agree on hypercare SLA with L3: elevated escalation for first 90 days post go-live

**T-30 Days:**
- Runbooks reviewed and approved by L3
- Team trained on new system — at least one walkthrough session
- Go-live readiness checklist completed
- On-call coverage plan for go-live week confirmed

**Go-Live:**
- Dedicated monitoring coverage during go-live window
- Direct line to L3 build team (not just ticket queue) for first 2 weeks
- All incidents during hypercare treated as minimum P2 (regardless of apparent severity)
- Daily hypercare check-in with L3 for first 30 days

---

## Working With L3: The Right Relationship

L2 and L3 are partners, not a hand-off chain. The right dynamic:

| L2 Brings to L3 | L3 Brings to L2 |
|---|---|
| Complete incident context before calling | Root cause analysis and permanent fix |
| A clear hypothesis, not just "it's broken" | Runbook authorship and approval |
| Follow-up on open PIR actions | System knowledge and change authority |
| Improvement ideas from operational experience | Architecture guidance for monitoring design |
| Signal on recurring patterns | Escalation path for systemic issues |

**One rule:** Never let an open PIR action item go past 30 days without a status update from L3. The team owns the follow-through even if L3 owns the fix.

---

## Measuring the Transformation

At the 90-day mark and quarterly thereafter, assess:

| Indicator | Baseline | 90-Day Target | Direction |
|---|---|---|---|
| Stakeholder-detected incident rate | [Measure month 1] | < 10% | ↓ |
| MTTA P1 | [Measure month 1] | < 15 min | ↓ |
| MTTR P1 | [Measure month 1] | < 4 hrs | ↓ |
| Runbook coverage (top 10 patterns) | [Measure month 1] | 100% | ↑ |
| Improvement items shipped per month | [Measure month 1] | ≥ 3 | ↑ |
| Repeat incident rate | [Measure month 1] | < 15% | ↓ |
| PIR completion rate (P1s) | [Measure month 1] | 100% | ↑ |
| L3 escalation quality (self-assessed) | N/A | Improving | ↑ |

These numbers tell the story of whether the team is operating as production engineers or still operating as button-pushers.
