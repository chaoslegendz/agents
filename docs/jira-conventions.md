# Jira Conventions for Compound Engineering

## Overview

This guide maps the compound engineering artifact chain to your existing Jira workflow. The goal is lightweight integration — not a process overhaul. The artifact chain enhances Jira, it doesn't replace it.

---

## Current Jira Workflow (As-Is)

Your current pattern:
- **PROJ-123** is the feature/story Jira with requirements in the description
- Dev picks up PROJ-123 and builds against it
- Testing may happen as a **sub-task** under PROJ-123 or as a **separate Jira** (e.g., PROJ-456 linked to PROJ-123)
- Jira statuses track progress through the workflow

## Enhanced Workflow (With Compound Chain)

The artifact chain adds structured artifacts that live in the repo alongside the Jira ticket. Jira remains the source of truth for status and workflow. The repo is the source of truth for artifact content.

### Status-to-Artifact Gates

| Jira Status | Artifact Gate | Who Checks | What to Verify |
|-------------|---------------|------------|----------------|
| **Ready for Dev** | requirements.md committed to feature folder | Scrum master or BSA | Validation checklist completed, REQ-### IDs assigned |
| **In Dev** | design.md committed to feature folder | Dev (self-check) | DES-### mapped to REQ-###, test guidance and operability notes filled in |
| **Ready for QA** | test-plan.md committed + Requirements Gap Report resolved | Scrum master | TC-### mapped to REQ/DES, gap report reviewed by BSA |
| **In QA** | Test execution underway | QA | Test Jira sub-task(s) or linked Jiras created |
| **Ready for Release** | runbook.md committed + Operability Review resolved | Release manager or scrum master | Operability blockers resolved, rollback tested or risk-accepted |

> These gates don't need to be automated on day one. Even a convention where the scrum master glances at the feature folder before approving the Jira transition creates accountability.

### Linking Artifacts to Jira

Every artifact includes the Jira ticket ID in both its header and its `chain-meta` block:

```markdown
# Feature: Trade Reconciliation Enhancement
# Jira: PROJ-123
```

This makes the connection explicit and searchable.

---

## Jira Labels

Add these labels to your Jira project. They power the measurement framework.

| Label | When to Apply | Who Applies |
|-------|---------------|-------------|
| `ai-assisted` | Any story where Copilot or Claude contributed meaningfully | Story owner |
| `ai-generated-code` | PR is majority AI-generated code | Dev |
| `ai-generated-test` | Test cases or test automation generated with AI | QA |
| `ai-generated-doc` | Documentation (requirements, design, runbook) drafted with AI | Artifact owner |
| `chain-full` | Full-tier compound chain applied | Scrum master at sprint planning |
| `chain-light` | Light-tier compound chain applied | Scrum master at sprint planning |

> Apply the tier label at sprint planning when the team classifies each story. Apply the `ai-*` labels during or after the work.

---

## Sub-Task Patterns for Testing

Your team uses two patterns for testing — both work with the compound chain:

### Pattern A: Test as Sub-Task

```
PROJ-123 (Story)
  ├── PROJ-123-1 (Sub-task: Test Execution)
  └── PROJ-123-2 (Sub-task: Automation — if applicable)
```

- test-plan.md references `PROJ-123` as the parent Jira
- Sub-tasks are listed in the test-plan.md `chain-meta` under `test_jiras`
- Each TC-### can optionally reference a sub-task if you want that level of granularity

### Pattern B: Separate Test Jira

```
PROJ-123 (Story) ──linked to──► PROJ-456 (Test Story)
```

- test-plan.md references both `PROJ-123` (parent) and `PROJ-456` (test Jira) in `chain-meta`
- Use Jira's "is tested by" / "tests" link type to connect them
- The test-plan.md artifact bridges both tickets

### Which Pattern to Use

| Situation | Recommended Pattern |
|-----------|-------------------|
| Simple feature, single QA person | Sub-task (Pattern A) |
| Complex feature, dedicated test effort | Separate Jira (Pattern B) |
| Multiple QA team members on one feature | Separate Jira (Pattern B) with sub-tasks for each test area |
| Bug fix with targeted regression | Sub-task (Pattern A) |

---

## Jira Comments for Chain Handoffs

Use structured Jira comments to signal chain handoffs. These are lightweight — a few lines, not a full artifact dump.

### BSA → Dev Handoff Comment (when moving to "Ready for Dev")

```
**Artifact Chain Update**
- requirements.md committed to /features/[feature-name]/
- REQ-### items: [count]
- Classification: [Internal]
- Open questions: [count — resolved / pending]
- Key risks: [one sentence]

Dev handoff summary: [paste output from "Prepare Handoff Notes for Dev" prompt, or write 3–5 lines summarizing what to build]
```

### QA → BSA Feedback Comment (Requirements Gap Report)

```
**Requirements Gap Report — [PROJ-###]**
During test plan generation, the following gaps were identified:

- [ ] REQ-003: [description of gap] — [BLOCKS TESTING / RISKS INCORRECT IMPLEMENTATION / MINOR]
- [ ] REQ-005: [description of gap] — [category]

Please resolve before [PROJ-###] moves to "In Test."
```

### Prod Support → Dev Feedback Comment (Operability Review)

```
**Operability Review — [PROJ-###]**
During runbook generation, the following items were identified:

- [ ] [BLOCKER] [issue description]
- [ ] [RISK-ACCEPTED] [issue description] — Accepted by: [name]
- [ ] [FOLLOW-UP] [issue description] — Target: Sprint [X]

Blockers must be resolved before release.
```

### Release Sign-Off Comment

```
**Release Sign-Off — [PROJ-###]**
- requirements.md: ✅ Committed, validated
- design.md: ✅ Committed, validated
- test-plan.md: ✅ Committed, all TC-### executed
- runbook.md: ✅ Committed, validated
- Requirements Gap Report: ✅ All items resolved
- Operability Review: ✅ No outstanding blockers
- Traceability: [X] / [Y] REQ-### fully traced (___%)
- Chain tier: [Full / Light]
```

---

## Sprint Planning Integration

Add these steps to your sprint planning ceremony:

1. **Tier classification** — For each story entering the sprint, classify as Full / Light / Skip chain. Apply the `chain-full` or `chain-light` label.

2. **Artifact ownership** — For Full-tier stories, confirm who owns each artifact:
   - requirements.md → [BSA name]
   - design.md → [Dev name]
   - test-plan.md → [QA name]
   - runbook.md → [Prod Support name]

3. **Test pattern** — Decide Pattern A (sub-task) or Pattern B (separate Jira) for each story.

4. **Capacity consideration** — AI-assisted artifact generation is faster than manual, but reviewing and validating AI output still takes time. Don't over-commit based on AI speed.

---

## Sprint Retro Addition

Add this to your retro agenda (5 minutes):

- Did any Jira gates get bypassed? Why?
- Were the tier classifications accurate, or did any Light chains need to be Full?
- Were the feedback loops (Gap Report, Operability Review) actually used?
- Did AI tools save time this sprint? Where?

Capture answers in the Chain Retro artifact for the sprint's key features.
