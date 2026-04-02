# Prod Support Prompt Library

## Tool Access

Prod Support team members have access to:
- **M365 Copilot** (with web access) — best for incident documentation, communication drafts, researching known issues
- **GitHub Copilot Chat** (Claude, Codex, ChatGPT models) — best for runbook generation from upstream artifacts, alert playbook creation, post-incident analysis
- **300 premium tokens/month** — Claude and Codex consume premium tokens

**Token budget strategy:**
- Use **Claude/Codex** (premium) for: runbook generation from the full artifact chain — this is the one prompt where the compound effect is strongest for Prod Support
- Use **ChatGPT** (free) for: alert playbook expansion, incident documentation, individual runbook section updates
- Use **M365 Copilot** (free) for: incident communication drafts, post-incident reports in Word, stakeholder updates

**Important:** All AI usage is enterprise-governed. Do not use public Claude, ChatGPT, or any non-approved AI interface.

---

## Prompt: Generate Runbook from Upstream Artifacts

**Token cost:** Premium (use Claude or Codex — this is the highest-value Prod Support prompt)
**When to use:** Upstream artifacts (requirements, design, test plan) are committed. Feature is approaching release.

```
Generate an operational runbook for Jira [PROJ-###].

CONTEXT — include ONLY these sections from upstream artifacts:

--- FROM requirements.md ---
Business Context section (2–3 sentences only)
Regulatory Reference (if applicable)
--- END ---

--- FROM design.md ---
Components Affected table
Data Flow section
Operability Notes section
--- END ---

--- FROM test-plan.md ---
Deployment Risks section only
--- END ---

INSTRUCTIONS:
- Write the Overview so a Prod Support team member with no context on this feature understands what it does, why it matters, and the basic data flow. 3–5 sentences.
- Create RB-### IDs for each runbook element
- Map monitoring items (RB-MON-###) and incident entries (RB-INC-###) back to DES-### and REQ-###
- MONITORING: Thresholds must be specific numbers or ranges — "watch for anomalies" is not acceptable. If you don't have enough context to suggest a specific threshold, flag it as an Operability Review item.
- COMMON ISSUES: Resolution steps must be specific enough to execute at 2 AM without context — specific commands, queries, or checks. Not "investigate the issue."
- ALERT PLAYBOOKS: For each monitoring item, include a playbook with: plain language meaning, severity, first-responder steps, resolution for common causes, escalation path.
- ROLLBACK: Step-by-step with a verification step at the end. Flag if rollback is complicated by data migrations or schema changes.
- OPERABILITY REVIEW: Flag anything that makes this feature hard to operate — missing monitoring hooks, unclear failure modes, no rollback path, missing dashboards. Tag each as [BLOCKER], [RISK-ACCEPTED], or [FOLLOW-UP].

DATA CLASSIFICATION: [Internal]. Reference config keys and endpoints by variable name only — NEVER include actual values, credentials, or production URLs.

Do not reproduce the full upstream artifacts — reference by ID only.
Output in markdown matching the runbook.md template format.
Keep the runbook under 100 lines.
```

---

## Prompt: Generate Alert Playbook

**Token cost:** Free (use ChatGPT — the monitoring section provides enough context)
**When to use:** Runbook monitoring section is defined. You need detailed playbooks for each alert.

```
Generate alert playbooks from this monitoring table.

[Paste only the Monitoring table from runbook.md — RB-MON-### items with metrics and thresholds]

For each alert (RB-MON-###), generate:

### RB-MON-###: [Alert name]
- **What it means:** [plain language — what is happening in the system]
- **Severity / Response SLA:** [P# / response time]
- **First-responder diagnostic steps:**
  1. [Specific command, query, dashboard check, or log grep]
  2. [Next diagnostic step]
- **Resolution for common causes:**
  - If [cause A]: [specific resolution steps]
  - If [cause B]: [specific resolution steps]
- **Escalation:** [Who to contact if unresolved after [X] minutes — team name, not individual]
- **Traces to:** DES-###, REQ-###

Keep each playbook entry under 15 lines. Optimize for fast triage — the person reading this is on-call.
```

---

## Prompt: Document Production Incident

**Token cost:** Free (use ChatGPT or M365 Copilot)
**When to use:** An incident has occurred and you need to document it for the post-incident review and artifact chain update.

```
Help me document this production incident.

Incident details:
- Jira: [PROJ-###]
- Related feature Jira: [PROJ-### — the original feature this relates to, if known]
- Date/time detected: [timestamp]
- Date/time resolved: [timestamp]
- Severity: [P1/P2/P3]
- Impact: [What was affected — number of users, transactions, reports, etc.]
- Detection method: [How was it found — alert, user report, monitoring, etc.]

What happened:
[Describe the symptoms and what was observed]

Root cause (if known):
[What caused it — or "under investigation"]

Resolution:
[What was done to fix it]

Generate an incident report covering:
1. **Timeline** — chronological sequence of events from detection to resolution
2. **Root cause analysis** — what failed and why
3. **Impact assessment** — business and operational impact
4. **Resolution steps taken** — what was done to resolve
5. **Prevention recommendations** — what should change to prevent recurrence (map to artifact chain if possible)
6. **Artifact chain update tasks** — specific updates needed to requirements, design, test plan, or runbook

Output as markdown suitable for pasting into a Jira comment or post-incident review document.
```

---

## Prompt: Post-Incident Chain Analysis

**Token cost:** Premium (use Claude — this is the compound feedback loop back through the chain)
**When to use:** After incident resolution. Traces the incident back through the artifact chain to identify where it should have been caught.

```
Analyze this production incident against the artifact chain for Jira [PROJ-###].

INCIDENT SUMMARY:
[Paste incident report or summary — what happened, root cause, resolution]

UPSTREAM ARTIFACTS — include ONLY the relevant items:

--- RELEVANT ACCEPTANCE CRITERIA ---
[Paste only the REQ-### items related to the area where the incident occurred]
--- END ---

--- RELEVANT DESIGN EDGE CASES ---
[Paste only the DES-E## items for the affected component]
--- END ---

--- RELEVANT TEST CASES ---
[Paste only the TC-### items that tested the affected area]
--- END ---

--- RELEVANT RUNBOOK ENTRIES ---
[Paste only the RB-INC-### and RB-MON-### items for the affected component]
--- END ---

For each layer of the chain, answer:
1. **Requirements:** Should this scenario have been captured as an acceptance criterion or edge case? If yes, draft a new REQ-### or REQ-N## to add.
2. **Design:** Was this failure mode covered in the design's edge cases and error handling? If not, draft a new DES-E## to add.
3. **Test Plan:** Was there a test case that should have caught this? If not, draft a new TC-### to add.
4. **Runbook:** Did the runbook have adequate detection (monitoring) and resolution steps for this scenario? If not, draft updates to RB-MON-### or RB-INC-###.

Output as a set of specific artifact update tasks with draft content, formatted so I can create Jira sub-tasks for each update.
```

---

## Prompt: Update Runbook After Incident

**Token cost:** Free (use ChatGPT)
**When to use:** Post-incident chain analysis identified runbook gaps. You need to update specific sections.

```
Update this runbook section based on a production incident.

CURRENT RUNBOOK SECTION:
[Paste the relevant section — monitoring table, incident table, or alert playbook]

INCIDENT DETAILS:
- What happened: [brief description]
- Root cause: [what caused it]
- How it was detected: [alert, manual discovery, user report]
- How it was resolved: [steps taken]
- Time to detect: [minutes/hours]
- Time to resolve: [minutes/hours]

Generate an updated version of the runbook section that includes:
1. A new or updated monitoring entry (RB-MON-###) if the incident wasn't detected by existing alerts
2. A new incident entry (RB-INC-###) with the failure mode, symptoms, and resolution steps
3. An updated alert playbook entry if an existing alert fired but the playbook didn't cover this root cause

Maintain existing RB-### numbering. Add new entries with the next available number.
Output only the updated section — not the full runbook.
```

---

## Prompt: Generate Change Communication

**Token cost:** Free (use M365 Copilot — good for email/Teams drafts)
**When to use:** A feature is being released and you need to notify stakeholders.

```
Draft a change communication for a feature release.

Feature: [Title]
Jira: [PROJ-###]
Release date: [date]
Environment: [production / UAT / etc.]

From the runbook:
- Overview: [paste the Overview section]
- Monitoring: [paste the Monitoring table]
- Rollback: [paste the Rollback section]

Generate:
1. A brief stakeholder notification (5–7 sentences) covering: what's changing, when, expected impact, and who to contact if issues arise
2. A technical notification for the on-call team covering: what to watch for, relevant alerts, and rollback trigger criteria

Keep both communications concise. No jargon in the stakeholder version.
```

---

## Tips for Effective Prod Support Prompting

1. **Your one premium-token prompt is runbook generation.** This is where the compound effect is strongest — you're consuming context from three upstream artifacts to produce operational documentation. Invest your premium tokens here and use free-tier tools for everything else.

2. **Operability Review is your leverage.** This is the Prod Support → Dev feedback loop. When you flag missing monitoring or unclear rollback procedures, you're preventing 2 AM incidents. Tag items as [BLOCKER] when they genuinely should block release.

3. **Resolution steps must be executable by someone who's never seen this feature.** The test: could a new team member on their first on-call rotation follow these steps? If not, they're not specific enough.

4. **Use post-incident chain analysis to improve the whole system.** Every incident is an opportunity to strengthen requirements, design, tests, AND operations. The compound chain means an improvement at any layer benefits all downstream layers for future features.

5. **M365 Copilot is your communication tool.** Use it for incident comms, change notifications, and post-incident reports in Word. It's fast, it has web access for researching known issues, and it doesn't consume premium tokens.
