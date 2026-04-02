# Compound Engineering Framework v2

## What Is Compound Engineering?

Compound engineering chains AI-assisted outputs across roles and SDLC phases so that each step builds on the last. Instead of each person using AI in isolation (additive), the output of one AI-assisted task becomes the input for the next (multiplicative).

**Additive:** Dev uses Copilot to write code faster. QA uses Claude to write test cases. These happen independently.

**Compound:** BSA uses Claude to generate structured acceptance criteria → Dev uses those criteria as context to generate implementation → QA uses both the criteria and the code to generate test cases → Prod Support uses all three to generate runbooks. Each layer compounds on the one before it.

---

## Core Principle: The Artifact Chain

Everything revolves around structured artifacts that flow downstream, with feedback loops flowing back upstream.

```
       ┌──── Requirements Gap Report ◄────┐
       │                                   │
       ▼                                   │
      BSA                Dev              QA/QE          Prod Support
       │                  │                │                │
       ▼                  ▼                ▼                ▼
  requirements.md ───► design.md ──────► test-plan.md ──► runbook.md
                          ▲                                │
                          │                                │
                          └──── Operability Review ◄───────┘
```

Each artifact is:
- **Structured** — markdown with consistent headings so AI can parse it downstream
- **Versioned** — lives in the repo, not a Confluence page that drifts
- **Classified** — tagged with data sensitivity so teams know what can be fed to AI tools
- **Traceable** — uses IDs (REQ-###, DES-###, TC-###, RB-###) that link across the chain

---

## Chain Tiering

Not every change needs the full chain. Classify at sprint planning.

| Tier | When to Use | Required Artifacts |
|------|-------------|--------------------|
| **Full** | New feature, regulatory change, data pipeline change, cross-team work | All four artifacts + feature folder |
| **Light** | Significant bug fix, enhancement, multi-component change | requirements.md (brief) + test-plan.md |
| **Skip** | Config change, typo fix, dependency bump, one-liner | Standard PR description only |

> The judgment call on which tier applies is more valuable than the artifacts themselves. When in doubt, go Light.

---

## Artifact Templates

Store in `/docs/templates/` in your repo.

### Requirements Spec — requirements.md

Owner: BSA (or Dev/QA drafts, BSA validates — see workflow)

```markdown
# Feature: [Name]

<!-- chain-meta
classification: [Public | Internal | Restricted]
upstream: N/A
last_synced: YYYY-MM-DD
-->

## Business Context
[2–3 sentences on why this matters. No client names, no PII.]

## Regulatory Reference
[If applicable: OSFI guideline, Basel paragraph, internal policy reference]

## Acceptance Criteria

### REQ-001: [Short title]
- GIVEN [precondition]
  WHEN [action]
  THEN [expected outcome]

### REQ-002: [Short title]
- GIVEN [precondition]
  WHEN [action]
  THEN [expected outcome]

[Continue for each criterion. Every criterion gets a REQ-### ID.]

## Negative / Edge Cases
- REQ-N01: [What should NOT happen, or boundary condition]

## Data Requirements
- Source system(s):
- Key fields: [Use placeholder names for sensitive data — e.g., [CLIENT_A], [ACCT_PLACEHOLDER]]
- Transformation logic:
- Validation rules:

## Constraints & Assumptions
- Regulatory:
- Technical:
- Dependencies:

## Open Questions
- [ ] [Question] — Owner: [Name] — Due: [Date]
```

**Validation checklist (BSA reviews before marking "Ready for Dev"):**
- [ ] Every acceptance criterion maps to a stated business need
- [ ] Negative and edge cases exist for each criterion
- [ ] A developer with no context could build from this alone
- [ ] No PII, client names, or restricted data present
- [ ] REQ-### IDs assigned to every criterion
- [ ] Data classification tag is set

---

### Design Artifact — design.md

Owner: Dev

```markdown
# Design: [Feature Name]

<!-- chain-meta
classification: [Public | Internal | Restricted]
upstream: requirements.md @ [git short hash]
last_synced: YYYY-MM-DD
-->

## Approach
[Brief description of implementation approach]

## Requirements Traceability
| Design Element | Addresses |
|---------------|-----------|
| DES-001: [component/change] | REQ-001, REQ-002 |
| DES-002: [component/change] | REQ-003 |

## Components Affected
- [Component] — [What changes and why]

## API / Interface Changes
- Endpoint/Method:
- Input:
- Output:
- Error cases: [Be explicit — QA will generate test cases from these]

## Data Flow
[Description or diagram of how data moves through the system]

## Edge Cases & Error Handling
| ID | Scenario | Handling | Traces to |
|----|----------|----------|-----------|
| DES-E01 | [edge case] | [how it's handled] | REQ-N01 |

## Test Guidance for QA
[What's risky, what's new, what's fragile, what should QA focus on.
This section is the primary input for QA's test plan generation.]

## Operability Notes for Prod Support
[How to monitor this, what could fail in production, rollback considerations.
This section is the primary input for the runbook.]
```

**Validation checklist (Dev reviews before marking "Ready for QA"):**
- [ ] Every REQ-### has at least one DES-### mapped to it
- [ ] Error handling is explicit, not "handle gracefully"
- [ ] Test Guidance section is substantive enough for QA to generate test cases without a meeting
- [ ] Operability Notes section addresses monitoring, failure modes, and rollback
- [ ] No restricted data or credentials present
- [ ] chain-meta upstream hash matches current requirements.md

---

### Test Plan — test-plan.md

Owner: QA/QE

```markdown
# Test Plan: [Feature Name]

<!-- chain-meta
classification: [Public | Internal | Restricted]
upstream: requirements.md @ [hash], design.md @ [hash]
last_synced: YYYY-MM-DD
-->

## Scope
- In scope:
- Out of scope:

## Requirements Traceability
| Test Case | Validates | Source |
|-----------|-----------|--------|
| TC-001 | REQ-001 | Acceptance criterion |
| TC-002 | REQ-001 | Edge case from DES-E01 |
| TC-003 | REQ-002 | Error case from design.md |

## Test Cases

### TC-001: [Scenario title]
- **Traces to:** REQ-001, DES-001
- **Priority:** P1
- **Preconditions:** [setup needed]
- **Steps:**
  1. [step]
  2. [step]
- **Expected Result:** [specific, measurable outcome]
- **Test Data:** [use placeholders for sensitive data]

### TC-002: [Scenario title]
- **Traces to:** REQ-001, DES-E01
- **Priority:** P1
- **Preconditions:**
- **Steps:**
  1. [step]
  2. [step]
- **Expected Result:**
- **Test Data:**

[Continue for each test case.]

## Regression Impact
- Areas affected:
- Recommended regression suite:

## Environment / Data Needs
- Environment:
- Test data: [All placeholders, no real client data]

## Requirements Gap Report
[Gaps found during test plan generation. BSA must resolve before testing begins.]
- [ ] REQ-003 has no negative scenario — what happens when [X]?
- [ ] REQ-001 doesn't specify behaviour when [edge case] — assumed [X], confirm.
- [ ] Data requirements missing validation rule for [field].

## Deployment Risks for Prod Support
[Observations from testing that Prod Support should know about.]
```

**Validation checklist (QA reviews before test execution):**
- [ ] Every REQ-### has at least one TC-### mapped to it
- [ ] Edge cases from design.md have corresponding test cases
- [ ] Error/failure scenarios from design.md have corresponding test cases
- [ ] Test cases are specific enough to automate without interpretation
- [ ] Requirements Gap Report has been reviewed by BSA (gaps resolved or accepted)
- [ ] No restricted or real client data in test data fields
- [ ] chain-meta upstream hashes match current requirements.md and design.md

---

### Operational Runbook — runbook.md

Owner: Prod Support

```markdown
# Runbook: [Feature Name]

<!-- chain-meta
classification: [Public | Internal | Restricted]
upstream: requirements.md @ [hash], design.md @ [hash], test-plan.md @ [hash]
last_synced: YYYY-MM-DD
-->

## Overview
[What this feature does in plain language. A team member unfamiliar with this
feature should be able to understand the business purpose from this section alone.]

## Requirements Traceability
| Runbook Section | Traces to |
|----------------|-----------|
| RB-001: [monitoring item] | DES-001, REQ-001 |
| RB-002: [failure mode] | DES-E01, TC-002 |

## Architecture & Dependencies
- Components:
- Upstream dependencies:
- Downstream consumers:
- Data flow: [Reference design.md data flow section]

## Monitoring
| ID | Metric | Threshold | Alert Severity | Dashboard |
|----|--------|-----------|----------------|-----------|
| RB-MON-001 | [metric] | [specific number] | P1/P2/P3 | [link] |

## Common Issues & Resolution
| ID | Symptom | Likely Cause | Resolution Steps | Escalation | Traces to |
|----|---------|-------------|-----------------|------------|-----------|
| RB-INC-001 | [symptom] | [cause] | [specific steps] | [who + SLA] | DES-E01 |

## Rollback Procedure
1. [Specific step — not "roll back the change"]
2. [Step]
3. [Verification step to confirm rollback succeeded]

**Rollback tested:** [ ] Yes / [ ] No — Date: ____

## Operability Review
[Issues identified during runbook generation that should be addressed before or
shortly after release.]
- [ ] [Missing monitoring for X — blocks release]
- [ ] [No automated rollback path for Y — risk accepted / to be addressed in sprint Z]
- [ ] [Failure mode Z not covered in design — fed back to Dev]
```

**Validation checklist (Prod Support reviews before release):**
- [ ] A team member unfamiliar with this feature could follow this runbook cold
- [ ] Monitoring thresholds are specific numbers, not "watch for anomalies"
- [ ] Rollback procedure has been tested or explicitly marked untested with risk acceptance
- [ ] Operability Review items are resolved or risk-accepted with a timeline
- [ ] No restricted data or credentials present
- [ ] chain-meta upstream hashes match current versions of all upstream artifacts

---

## Prompt Libraries by Role

Store in `/docs/prompts/` in your repo.

### BSA Prompts

**Generate Acceptance Criteria**
```
I need to generate structured acceptance criteria for a feature.

Business context: [2–3 sentences]
Regulatory reference (if any): [guideline/paragraph]

Generate acceptance criteria in this format:
- Assign each criterion an ID: REQ-001, REQ-002, etc.
- Use GIVEN/WHEN/THEN structure
- Include negative and edge case scenarios (prefix REQ-N01, REQ-N02)
- Flag any ambiguities as open questions with an owner

Data classification: [Internal]. Do not include any real client names, account
numbers, or PII in the output. Use placeholders like [CLIENT_A], [ACCT_PLACEHOLDER].

Keep the output under 60 lines — focus on precision, not exhaustiveness.
```

**Review Requirements for Completeness**
```
Review this requirements spec for completeness and downstream usability.

[Paste requirements.md]

Check for:
1. Missing acceptance criteria — are there business scenarios not covered?
2. Missing negative/edge cases for each criterion
3. Data requirements gaps — missing source systems, fields, or validation rules
4. Regulatory implications not captured
5. Would a developer with no prior context understand exactly what to build?
6. Would a QA engineer be able to write test cases from the acceptance criteria alone?

For each gap found, specify which REQ-### it relates to.
Do not suggest adding information that is already present. Be specific, not generic.
```

**Validate AI-Generated Requirements (Self-Check)**
```
I generated the following requirements spec with AI assistance and need to validate it.

[Paste requirements.md]

For each acceptance criterion (REQ-###):
1. Does it map to a specific, stated business need — or is it filler?
2. Is the GIVEN/WHEN/THEN specific enough that two different developers
   would build the same thing?
3. Is there a corresponding negative or edge case?

Flag anything that looks plausible but vague. I'd rather have fewer precise
criteria than many generic ones.
```

---

### Dev Prompts

**Generate Design Artifact from Requirements**
```
Generate a design artifact for this feature.

CONTEXT (include only the sections listed below):
- Acceptance Criteria section from requirements.md:
[Paste acceptance criteria only — not business context or open questions]
- Data Requirements section from requirements.md:
[Paste data requirements only]

INSTRUCTIONS:
- Create a DES-### ID for each design element
- Map every REQ-### to at least one DES-###
- Explicitly describe error handling for each component — not "handle gracefully"
- Include a "Test Guidance for QA" section: what's risky, new, or fragile
- Include an "Operability Notes" section: how to monitor, what could fail, rollback approach
- If any REQ-### is ambiguous or unimplementable, flag it rather than assuming

Data classification: [Internal]. Use placeholder names for any data elements.
Keep the output focused. Do not repeat the requirements — reference them by ID.
```

**Implement with Upstream Context (Claude)**
```
I'm implementing [specific component] for this feature.

CONTEXT:
- Relevant acceptance criteria:
[Paste only REQ-### items this component addresses]
- Design element:
[Paste only the relevant DES-### section]

INSTRUCTIONS:
- Implement [component] following these patterns: [coding standards/patterns]
- Error handling approach: [approach]
- Logging: [requirements]
- Reference the DES-### and REQ-### in code comments for traceability
- Flag any design gaps or ambiguities you encounter during implementation

Do not generate boilerplate or placeholder code. If a section is unclear,
say so rather than guessing.
```

**Copilot-Specific Guidance**
```
For inline code completion with GitHub Copilot in VS Code:

1. Keep the feature folder (/features/[feature-name]/) open in your workspace
   so Copilot's context engine can reference the artifacts.
2. Use Copilot for: inline code completion, unit test generation from
   existing code, boilerplate and repetitive patterns.
3. Use Claude for: consuming upstream artifacts to generate design docs,
   complex logic with full context, PR descriptions, cross-artifact analysis.
4. When writing a function that implements a specific REQ-###, add a comment
   above it referencing the ID — Copilot will use this as context signal.
```

**Generate PR Description**
```
Generate a PR description based on this context.

Requirements addressed: [List REQ-### IDs]
Design elements implemented: [List DES-### IDs]
Files changed: [List or paste diff summary]

Generate a PR description that includes:
- What changed (mapped to REQ/DES IDs)
- Why (one sentence of business context)
- How to test (reference specific TC-### from test plan if available)
- Deployment considerations and rollback notes
- Any known limitations or follow-up work

Keep it under 30 lines.
```

---

### QA/QE Prompts

**Generate Test Plan from Upstream Artifacts**
```
Generate a test plan for this feature.

CONTEXT (include only the sections listed below):
- Acceptance Criteria from requirements.md:
[Paste acceptance criteria and negative/edge cases only]
- From design.md, include ONLY these sections:
  - Requirements Traceability table
  - Edge Cases & Error Handling table
  - Test Guidance for QA section

INSTRUCTIONS:
- Create a TC-### for each test case
- Map every TC-### to the REQ-### and DES-### it validates
- Generate at minimum: one happy-path TC per REQ, one TC per edge case in design,
  one TC per error case in design
- Make each test case specific enough to automate without interpretation
- Include a "Requirements Gap Report" section: list any REQ-### that is ambiguous,
  untestable, or missing edge cases. I will send these back to the BSA.
- Include a "Deployment Risks" section: anything Prod Support should know

Data classification: [Internal]. Use placeholder test data, no real client data.
Do not include the full requirements or design in your output — reference by ID only.
```

**Generate Automation Scaffolding**
```
Generate test automation scaffolding from this test plan.

CONTEXT:
[Paste only the Test Cases section of test-plan.md]

INSTRUCTIONS:
- Framework: [Jest / pytest / Selenium / Playwright / other]
- Generate a test method stub for each TC-###
- Include the TC-### ID, traces-to REQ/DES IDs, and priority in the test docstring
- Generate data setup and teardown for each test
- Use placeholder assertion patterns — I'll fill in the specifics
- Do not generate full implementation — stubs with clear TODO comments only
```

**Generate Requirements Gap Report**
```
Compare these artifacts and identify gaps.

Requirements (acceptance criteria only):
[Paste acceptance criteria section]

Design (edge cases and error handling only):
[Paste edge cases table and test guidance section]

For each gap found:
- Specify which REQ-### is affected
- Describe what's missing or ambiguous
- Suggest what the BSA should clarify
- Rate severity: Blocks testing / Risks incorrect implementation / Minor clarification

Output as a checklist I can paste directly into the Requirements Gap Report
section of test-plan.md.
```

---

### Prod Support Prompts

**Generate Runbook from Upstream Artifacts**
```
Generate an operational runbook for this feature.

CONTEXT (include only the sections listed below):
- From requirements.md: Business Context + Regulatory Reference only
- From design.md: Components Affected + Data Flow + Operability Notes only
- From test-plan.md: Deployment Risks section only

INSTRUCTIONS:
- Write the Overview so someone with no context understands what this does
- Create RB-### IDs for each runbook element
- Map monitoring items and failure modes back to DES-### and REQ-###
- Monitoring thresholds must be specific numbers — not "watch for anomalies"
- Rollback procedure must be step-by-step with a verification step at the end
- Include an "Operability Review" section: issues that should block or
  be risk-accepted before release
- Flag any gaps in the upstream artifacts that make this feature hard to
  operate (missing monitoring hooks, unclear failure modes, no rollback path)

Data classification: [Internal]. No credentials, endpoints, or sensitive
config in the output — reference them by variable name only.

Do not reproduce the full upstream artifacts — reference by ID only.
Keep the runbook under 80 lines.
```

**Generate Alert Playbook**
```
Based on this runbook's monitoring section:
[Paste only the Monitoring table from runbook.md]

For each alert (RB-MON-###), generate a playbook entry:
- What the alert means in plain language
- Severity and response SLA
- First-responder diagnostic steps (specific commands or checks)
- Resolution steps for common causes
- Escalation path if resolution fails
- Traces to: [DES-### and REQ-###]

Keep each playbook entry under 15 lines. The goal is fast triage at 2 AM.
```

**Post-Incident Chain Analysis**
```
Analyze this production incident against the artifact chain.

Incident summary: [paste incident report or summary]

Upstream artifacts:
- Acceptance criteria: [paste relevant REQ-### items]
- Design edge cases: [paste relevant DES-E### items]
- Test cases: [paste relevant TC-### items]
- Runbook entries: [paste relevant RB-### items]

For each layer of the chain:
1. Should this incident have been caught by the acceptance criteria? If yes,
   what REQ-### should be updated?
2. Was this failure mode covered in the design? If not, what DES-### should
   be added?
3. Was there a test case that should have caught this? If not, what TC-###
   should be added?
4. Did the runbook have adequate resolution steps? If not, what RB-### should
   be updated?

Output as a set of specific artifact update tasks I can create in Jira.
```

---

### Cross-Role Prompts

**Cross-Artifact Consistency Check**
```
Review these artifacts for consistency and contradictions.

[Paste only the traceability tables and key sections from each artifact —
not the full documents]

Check:
1. Every REQ-### is traced through DES-### → TC-### → RB-###
   (flag any broken chains)
2. Edge cases in design.md have corresponding test cases
3. Error handling in design.md matches failure modes in runbook.md
4. Test plan's Deployment Risks align with runbook's Operability Review
5. chain-meta upstream hashes: are any artifacts out of sync?

Output as a numbered list of contradictions or gaps with specific IDs.
Do not report "all looks good" — find something or confirm chain is complete.
```

**Generate Traceability Matrix**
```
From the following artifact traceability tables, generate a consolidated matrix.

Requirements traceability: [paste from requirements.md]
Design traceability: [paste from design.md]
Test traceability: [paste from test-plan.md]
Runbook traceability: [paste from runbook.md]

Generate a single table:
| REQ-### | DES-### | TC-### | RB-### | Status |
Where Status is:
- Complete: traced through all four layers
- Partial: missing one or more layers (specify which)
- Orphan: exists in one layer but not referenced upstream or downstream
```

---

## Compound Workflow — Step by Step

### For Full-Tier Features

**Step 1: Draft requirements (BSA or Dev/QA drafts, BSA validates)**

For teams early in adoption, the most effective pattern is:
- Dev or QA drafts requirements.md from existing Jira stories, stakeholder notes, and BSA conversations using the "Generate Acceptance Criteria" prompt
- BSA reviews using the "Review Requirements for Completeness" prompt and validates
- BSA runs the "Validate AI-Generated Requirements" self-check
- BSA commits requirements.md to `/features/[feature-name]/`

Tool: Claude
Context compression: Feed Claude the business need and regulatory reference only. Do not include historical Jira comments or meeting notes — summarize them into 2–3 sentences first.

Jira gate: Story cannot move to "Ready for Dev" until requirements.md is committed and BSA has checked off the validation checklist.

---

**Step 2: Generate design artifact (Dev)**

- Dev uses the "Generate Design Artifact" prompt, feeding in only the Acceptance Criteria and Data Requirements sections of requirements.md
- Dev enriches with implementation-specific knowledge that Claude doesn't have
- Dev fills in the Test Guidance and Operability Notes sections explicitly
- Dev commits design.md to the feature folder

Tool: Claude for structure, Copilot for inline code exploration
Context compression: Do not feed Claude the full requirements.md. Extract only acceptance criteria and data requirements sections.

Jira gate: Story cannot move to "In Dev" (coding phase) until design.md is committed.

---

**Step 3: Implement (Dev)**

- Dev uses the "Implement with Upstream Context" prompt for complex components
- Dev uses Copilot for inline completion, with the feature folder open in the VS Code workspace
- Dev adds REQ-### and DES-### references in code comments for traceability
- Dev generates PR description using the "Generate PR Description" prompt

Tool: Copilot (inline), Claude (complex logic, PR descriptions)
Context compression: For each component, feed Claude only the relevant REQ and DES items — not the entire requirements and design docs.

---

**Step 4: Generate test plan (QA)**

- QA uses the "Generate Test Plan" prompt, feeding in only the acceptance criteria from requirements.md and the traceability table, edge cases, and test guidance from design.md
- QA generates the Requirements Gap Report as part of this step
- Requirements Gap Report is sent to BSA for resolution — items must be resolved or risk-accepted before testing begins
- QA commits test-plan.md to the feature folder

Tool: Claude
Context compression: Do not feed Claude the full design.md. Extract only the traceability table, edge cases table, and test guidance section.

Jira gate: Story cannot move to "Ready for QA" until test-plan.md is committed and Requirements Gap Report is resolved.

---

**Step 5: Generate automation scaffolding (QA)**

- QA uses the "Generate Automation Scaffolding" prompt, feeding in only the test cases section of test-plan.md
- QA fills in the assertion details and test data
- Test code is committed to the repo

Tool: Claude (scaffolding), Copilot (filling in assertions and data)

---

**Step 6: Generate runbook (Prod Support)**

- Prod Support uses the "Generate Runbook" prompt, feeding in only the specified sections from each upstream artifact
- Prod Support generates the Operability Review as part of this step
- Operability Review items that block release are flagged to Dev — these should be resolved before merge, not after deploy
- Prod Support commits runbook.md to the feature folder

Tool: Claude
Context compression: Feed Claude only the Business Context + Regulatory Reference from requirements, Components + Data Flow + Operability Notes from design, and Deployment Risks from test plan.

Jira gate: Story cannot move to "Ready for Release" until runbook.md is committed and Operability Review blockers are resolved.

---

**Step 7: Cross-artifact consistency check**

- Any role (or a designated reviewer) runs the "Cross-Artifact Consistency Check" prompt
- Generates the traceability matrix using the "Generate Traceability Matrix" prompt
- Contradictions and gaps are resolved before release

Tool: Claude
Context compression: Feed only the traceability tables and chain-meta from each artifact — not the full documents.

---

**Step 8: Chain retrospective (post-release)**

- Team runs a 15-minute Chain Retrospective in the sprint retro
- Fills in the Chain Retro template (below)
- Updated prompts are committed back to `/docs/prompts/`
- Exemplar chains are moved to `/docs/patterns/` for future reference

---

### For Light-Tier Features

Abbreviated chain — two artifacts only.

1. Dev or QA drafts a brief requirements.md (acceptance criteria and data requirements sections only — skip business context, regulatory reference, and constraints)
2. QA generates test-plan.md from the brief requirements
3. QA includes a lightweight Requirements Gap Report
4. No design.md or runbook.md required — but Dev includes a substantive PR description and QA includes Deployment Risks in the test plan

---

### For Skip-Tier Features

No artifact chain. Standard PR description only. If the change turns out to be more complex than expected, upgrade to Light tier mid-sprint.

---

## Jira Integration

### Status-to-Artifact Mapping

| Jira Status | Artifact Gate | Who Checks |
|-------------|---------------|------------|
| Ready for Dev | requirements.md committed + validation checklist passed | Scrum master |
| In Dev | design.md committed | Dev self-check |
| Ready for QA | test-plan.md committed + Requirements Gap Report resolved | Scrum master |
| In QA | Test execution underway | QA |
| Ready for Release | runbook.md committed + Operability Review resolved | Release manager or Scrum master |

### Jira Labels

| Label | When to Use |
|-------|-------------|
| `ai-assisted` | Any story where Copilot or Claude contributed meaningfully |
| `ai-generated-code` | PR is majority AI-generated |
| `ai-generated-test` | Test cases or test code generated with AI |
| `ai-generated-doc` | Documentation drafted or structured with AI |
| `chain-full` | Full-tier artifact chain |
| `chain-light` | Light-tier artifact chain |

---

## Data Classification Guide

Every artifact must have a classification tag in its chain-meta header.

| Classification | Definition | AI Tool Rules |
|---------------|------------|---------------|
| **Public** | No sensitivity. Open-source components, public documentation | Can be used with any AI tool without redaction |
| **Internal** | Bank-internal but non-restricted. Architecture, process, most feature work | Can be used with approved AI tools (Copilot, Claude). Redact client names, account numbers, PII. Use placeholders. |
| **Restricted** | Regulatory submissions, production credentials, client-identifiable data | Do NOT feed to AI tools. Work with this data in approved bank systems only. Artifact should reference restricted data by variable name, never include it. |

**Redaction conventions:**
- Client names → `[CLIENT_A]`, `[CLIENT_B]`
- Account numbers → `[ACCT_001]`, `[ACCT_002]`
- Production endpoints → `[PROD_ENDPOINT_X]`
- Credentials → Never included. Reference by config key name.
- Dollar amounts → Use realistic but fictional values

> **Rule of thumb:** If you wouldn't put it on a whiteboard in a shared meeting room, redact it before feeding to AI.

---

## Feature Folder Structure

```
/features/[feature-name]/
  ├── requirements.md        ← BSA owns
  ├── design.md              ← Dev owns
  ├── test-plan.md           ← QA owns
  ├── runbook.md             ← Prod Support owns
  ├── decisions.md           ← Anyone (key decisions and rationale)
  └── chain-retro.md         ← Filled post-release
```

For cross-team features, use a shared repo or designated integration repo. The templates are the contract — as long as both teams use the same structure, their AI tools can consume each other's artifacts.

---

## Chain Retrospective Template

Run as a 15-minute standing item in the sprint retro. Commit to feature folder.

```markdown
# Chain Retro: [Feature Name] — [Date]

## Chain Tier: [Full / Light]

## What compounded well
- [Which handoffs worked? Where did AI output quality improve
  because of upstream context?]

## Where the chain broke
- [Which artifacts were late, incomplete, or ignored?]
- [Where did an AI-generated artifact propagate an error downstream?]

## Requirements Gap Report effectiveness
- Gaps found by QA: [count]
- Gaps resolved before testing: [count]
- Gaps that would have been production bugs: [count — your strongest ROI data point]

## Operability Review effectiveness
- Issues found by Prod Support: [count]
- Issues resolved before release: [count]

## Prompt improvements discovered
- [New prompts or modifications — commit back to /docs/prompts/]

## Template changes needed
- [Sections that were useless, sections that were missing]

## Estimated hours saved
- BSA: ____ hours
- Dev: ____ hours
- QA: ____ hours
- Prod Support: ____ hours

## Traceability completeness
- REQ-### items: ____
- Fully traced through DES → TC → RB: ____ / ____ (___%)
```

---

## Getting Started Checklist

### Week 1 — Foundation
- [ ] Create `/docs/templates/` with the four artifact templates (with chain-meta, traceability IDs, and classification tags)
- [ ] Create `/docs/prompts/` with the role-specific prompt libraries
- [ ] Publish the data classification guide and redaction conventions
- [ ] Define the three tiers (Full / Light / Skip) and communicate at sprint planning
- [ ] Map artifact milestones to Jira status transitions
- [ ] Identify one pilot feature and one executive sponsor

### Week 2 — Pilot (Start from the Middle)
- [ ] Dev + QA run the first compound chain on the pilot (design.md → test-plan.md)
- [ ] BSA validates and back-fills requirements.md (review, don't author from scratch)
- [ ] Establish the feature folder in the repo
- [ ] QA produces the first Requirements Gap Report

### Week 3 — Extend the Chain
- [ ] Prod Support generates runbook.md from upstream artifacts
- [ ] Prod Support produces the first Operability Review
- [ ] Run the cross-artifact consistency check
- [ ] Generate the first traceability matrix

### Week 4 — Retro and Iterate
- [ ] Run the Chain Retrospective (15 min in sprint retro)
- [ ] Update templates and prompts based on findings
- [ ] Commit updated prompts back to `/docs/prompts/`
- [ ] Select 2–3 features for next sprint, assign tiers
- [ ] Brief the executive sponsor on results

### Ongoing
- [ ] Monthly: Review artifact chain completeness across features
- [ ] Monthly: Update prompt libraries with new patterns
- [ ] Monthly: AI Champion scorecard (from AI SDLC Measurement Framework)
- [ ] Quarterly: Assess maturity against Phase 1/2/3
- [ ] Quarterly: Move exemplar chains to `/docs/patterns/`
