# Cross-Role Prompt Library

## Overview

These prompts are used by any role — they operate across the artifact chain rather than within a single role's domain. They're most commonly run by the scrum master, AI Champion, or a designated reviewer.

**Token cost:** Most of these consume premium tokens because they involve multi-artifact analysis. Budget accordingly — run these at key gates, not continuously.

---

## Prompt: Cross-Artifact Consistency Check

**Token cost:** Premium (use Claude)
**When to use:** Before release. All four artifacts are committed. Run as part of Step 7 in the compound workflow.

```
Review these artifacts for consistency and contradictions.

CONTEXT — paste ONLY the traceability tables and chain-meta from each artifact:

--- requirements.md ---
chain-meta block:
[Paste chain-meta]
Acceptance Criteria IDs and titles only (not full GIVEN/WHEN/THEN):
[List: REQ-001: title, REQ-002: title, etc.]
--- END ---

--- design.md ---
chain-meta block:
[Paste chain-meta]
Requirements Traceability table:
[Paste the table]
Edge Cases table (IDs and scenarios only):
[Paste]
--- END ---

--- test-plan.md ---
chain-meta block:
[Paste chain-meta]
Requirements Traceability table:
[Paste the table]
Requirements Gap Report:
[Paste]
--- END ---

--- runbook.md ---
chain-meta block:
[Paste chain-meta]
Requirements Traceability table:
[Paste the table]
Operability Review:
[Paste]
--- END ---

CHECK FOR:
1. **Broken chains:** Every REQ-### should appear in design traceability (DES-###), test traceability (TC-###), and runbook traceability (RB-###). Flag any REQ-### that doesn't flow through all four layers.
2. **Orphaned elements:** Any DES-###, TC-###, or RB-### that doesn't trace back to a REQ-### (possible scope creep).
3. **Edge case coverage:** Every DES-E## should have a corresponding TC-###. Flag any missing.
4. **Consistency:** Do error handling descriptions in design match failure modes in runbook? Do test deployment risks align with operability review items?
5. **Sync status:** Do the chain-meta upstream hashes indicate any artifacts are out of date?
6. **Unresolved items:** Are there open items in the Requirements Gap Report or Operability Review that haven't been resolved?

Output as a numbered list of findings with specific IDs. Do not report "all looks good" — be thorough. If the chain is genuinely complete, confirm each REQ-### was traced and explain the verification.
```

---

## Prompt: Generate Traceability Matrix

**Token cost:** Premium (use Claude or Codex for clean table output)
**When to use:** At release gate or for audit purposes. Produces a single consolidated view of requirements traceability.

```
Generate a consolidated traceability matrix from these artifact traceability tables.

--- FROM requirements.md ---
[List all REQ-### and REQ-N## IDs with short titles]
--- END ---

--- FROM design.md ---
[Paste Requirements Traceability table: DES-### → REQ-### mapping]
--- END ---

--- FROM test-plan.md ---
[Paste Requirements Traceability table: TC-### → REQ-###, DES-### mapping]
--- END ---

--- FROM runbook.md ---
[Paste Requirements Traceability table: RB-### → DES-###, REQ-### mapping]
--- END ---

Generate a single consolidated matrix:

| REQ-### | Title | DES-### | TC-### | RB-### | Status |
|---------|-------|---------|--------|--------|--------|

Where Status is:
- **Complete:** Traced through all four layers (requirements → design → test → operations)
- **Partial:** Missing one or more layers — specify which are missing
- **Orphan:** Exists in one layer but not referenced upstream or downstream
- **Untested:** Has design and operations coverage but no test case

Also generate a summary:
- Total REQ-### items: ____
- Complete: ____ (___%)
- Partial: ____ (___%)
- Orphans: ____
- Untested: ____

This matrix will be attached to the Jira [PROJ-###] for release sign-off and audit purposes.
```

---

## Prompt: Chain Health Assessment

**Token cost:** Free (use ChatGPT — this is a process assessment, not a technical analysis)
**When to use:** Monthly or quarterly. Assesses how well the compound chain is working across features.

```
Assess the health of our compound engineering chain based on these recent chain retrospectives.

[Paste the summary sections from 3–5 recent chain-retro.md files — specifically:
- "What compounded well"
- "Where the chain broke"
- Requirements Gap Report effectiveness numbers
- Operability Review effectiveness numbers
- Estimated hours saved
- Traceability completeness percentages]

Generate:
1. **Trend analysis:** Is the chain getting stronger or weaker over time? Which metrics are improving, which are flat, which are declining?
2. **Recurring breakpoints:** Are the same roles, artifacts, or handoffs consistently breaking? What's the pattern?
3. **ROI summary:** Total estimated hours saved across all features. Top 3 sources of time savings.
4. **Recommendations:** Top 3 things to change in the next quarter to strengthen the chain. Be specific — "improve requirements quality" is not actionable. "Add data validation rules to the requirements template because 4 of 5 features had gaps there" is.
5. **Maturity assessment:** Based on the evidence, where is the team on the L0–L3 maturity scale? What would it take to move to the next level?

Keep the assessment under 40 lines. This will be shared with the executive sponsor.
```

---

## Prompt: Onboard New Team Member to the Chain

**Token cost:** Free (use ChatGPT)
**When to use:** New BSA, Dev, QA, or Prod Support team member joins and needs to understand the compound chain.

```
Generate an onboarding guide for a new [BSA / Dev / QA / Prod Support] joining our team.

Our team uses a compound engineering framework where structured artifacts flow through the SDLC:
- BSA creates requirements.md with REQ-### IDs
- Dev creates design.md with DES-### IDs tracing to REQ-###
- QA creates test-plan.md with TC-### IDs tracing to REQ-### and DES-###
- Prod Support creates runbook.md with RB-### IDs tracing to the full chain

Each artifact has:
- A chain-meta header with classification and upstream hash
- Traceability IDs linking to upstream and downstream artifacts
- A validation checklist that must be completed before the Jira moves to the next status
- Feedback loops: QA produces a Requirements Gap Report (back to BSA), Prod Support produces an Operability Review (back to Dev)

We use Jira [describe your Jira workflow briefly], and artifacts live in feature folders in the repo.

For the [role] specifically, generate:
1. Their responsibilities in the chain — what they produce, what they consume
2. Which AI tools to use and when (reference their tool access)
3. Their top 3 prompts to learn first
4. The validation checklist they own
5. The feedback loop they participate in
6. Common mistakes for their role and how to avoid them

Keep it practical and under 30 lines. This should take 10 minutes to read.
```
