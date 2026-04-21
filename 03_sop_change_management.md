# SOP: Change Management for Production Interventions
**Owner:** Treasury Technology Production Support  
**Review Cycle:** Quarterly

---

## Purpose

This SOP governs any change made to a production system by the L2 Production Support team. This includes job reruns, configuration changes, data corrections, system restarts, and parameter overrides. It does not replace the enterprise change management process — it defines how L2 operates within it and how emergency changes are handled.

---

## Change Types

| Type | Definition | Approval Required |
|---|---|---|
| **Standard (Pre-Approved)** | Change is documented in a runbook, previously reviewed and approved for L2 execution | Runbook authority — no additional approval needed |
| **Normal** | Planned, non-emergency change to production. Follows enterprise change process. | Change Advisory Board (CAB) or designated change approver |
| **Emergency** | Unplanned change required to restore service or prevent imminent P1/P2 impact | L3 lead + L2 lead verbal approval; post-facto ticket |

---

## Standard Changes (Runbook-Authorized)

These are the only changes L2 can execute without additional approval. They must:

- Be documented in an approved runbook
- Follow the runbook steps exactly
- Be logged in the incident ticket with timestamps
- Flag any deviation from runbook steps as a change event (see Emergency Change process)

**Examples:**
- Restarting a named service per documented restart runbook
- Re-triggering a failed AutoSys job per recovery runbook
- Re-running a Databricks pipeline from a known checkpoint
- Applying a pre-approved FTP rate parameter override

---

## Emergency Changes

Used when a production intervention is needed immediately and there is no pre-approved runbook, or the situation requires deviation from documented steps.

### Process

1. **Document intent before acting.** Write in the incident ticket: "Proposing to do X because Y."
2. **Get verbal approval.** L3 team lead OR L2 lead must agree. If L3 is engaged on the bridge, that confirmation counts.
3. **Make the change. Log it precisely:**
   - What was changed (be specific — file path, parameter name, job name, value before/after)
   - When the change was made (timestamp)
   - Who approved it
   - What the expected outcome was
   - What the actual outcome was
4. **Raise the formal change record** within 4 hours of resolution (P1) or by end of business day (P2).
5. **If the emergency change worked:** Add it to the runbook backlog so it becomes a standard change.

### What Requires Emergency Change Treatment

- Any restart of a production system not covered by a runbook
- Manual data correction, deletion, or re-insertion in any database
- Override of a system parameter not listed in a runbook
- Running a script not part of approved tooling
- Bypassing a job dependency or checkpoint
- Any change to a configuration file in production

### What Does Not Require Emergency Change Treatment

- Executing steps explicitly listed in an approved runbook
- Acknowledging or silencing an alert per documented procedure
- Creating or updating a monitoring dashboard (non-functional change)
- Sending a communication to stakeholders

---

## Pre-Change Checklist

Before making any non-standard production change, complete this checklist:

- [ ] Is this change covered by an existing runbook? (If yes → standard change)
- [ ] Do I understand what this change does and what it affects downstream?
- [ ] Have I identified a rollback path if this makes things worse?
- [ ] Have I documented the current state before changing it (screenshot, config dump, etc.)?
- [ ] Has this been verbally approved by L3 lead or L2 lead?
- [ ] Is the incident ticket updated with my intent?

**If any box is unchecked: stop and consult before proceeding.**

---

## Post-Change Validation

After every production change:

1. Confirm the intended outcome was achieved (don't assume — verify)
2. Check downstream systems for unexpected side effects
3. Update the incident ticket with the result
4. If the outcome was not what was expected: do not make further changes without re-engaging L3

---

## Prohibited Actions Without L3 Involvement

The following actions must never be taken by L2 without explicit L3 authorization:

- Truncating, dropping, or bulk-modifying production database tables
- Modifying application configuration files not covered by a runbook
- Deploying or rolling back application code
- Modifying AutoSys job definitions (schedule, dependencies, scripts)
- Modifying Databricks cluster configuration or job parameters not in a runbook
- Bypassing a data quality gate or validation check
- Any change to a system during a regulatory reporting window without L3 present

---

## Change Log Standards

The incident ticket is the change log for emergency changes. Every entry must include:

```
[TIMESTAMP] CHANGE: [What was changed]
  - System: [System name]
  - Component: [Specific component, file, job, table]
  - Before: [Previous state]
  - After: [New state]
  - Approval: [Who approved — name + role]
  - Outcome: [What happened]
```

---

## Runbook Development Pipeline

Every emergency change that worked should become a standard change. The pipeline:

1. Emergency change executed and logged during incident
2. L2 engineer creates runbook draft within 48 hours using the change log as source
3. L3 team reviews and approves runbook
4. Runbook added to team repository and linked from monitoring alert
5. Future executions of that change are standard — no additional approval needed
