# Chain Retro: [Feature Title]
# Jira: [PROJ-###]
# Date: [YYYY-MM-DD]

## Chain Tier: [Full / Light]

## What Compounded Well

- [Which handoffs worked? Where did AI output quality improve because of upstream context?]
- [Which prompts produced good first drafts?]
- [Where did a downstream role catch something upstream missed?]

## Where the Chain Broke

- [Which artifacts were late, incomplete, or ignored?]
- [Where did an AI-generated artifact propagate an error downstream?]
- [Where did someone skip the template and just wing it?]
- [Did the Jira gates work or did people bypass them?]

## Requirements Gap Report Effectiveness

- Gaps found by QA: ____
- Gaps resolved before testing: ____
- Gaps that would have been production bugs if missed: ____

> This last number is your strongest ROI data point. Track it.

## Operability Review Effectiveness

- Issues found by Prod Support: ____
- Issues resolved before release: ____
- Issues found in production that the review should have caught: ____

## AI Tool Usage

| Role | Tool Used | Token/Usage Notes | Effectiveness (1–5) |
|------|-----------|-------------------|---------------------|
| BSA | M365 Copilot / GitHub Copilot Chat | | |
| Dev | GitHub Copilot Inline / Chat (Claude/Codex) | [note if premium tokens were consumed] | |
| QA | GitHub Copilot Chat / M365 Copilot | | |
| Prod Support | M365 Copilot / GitHub Copilot Chat | | |

## Prompt Improvements Discovered

- [New prompts or modifications that worked better — commit back to /docs/prompts/]
- [Prompts that produced poor output — what went wrong?]

## Template Changes Needed

- [Sections that were useless or always left blank]
- [Sections that were missing and had to be added ad hoc]

## Estimated Hours Saved

| Role | Hours Saved | How |
|------|-------------|-----|
| BSA | ____ | [e.g., "requirements generation 60% faster"] |
| Dev | ____ | [e.g., "design doc took 30 min instead of 2 hours"] |
| QA | ____ | [e.g., "test case generation saved 4 hours"] |
| Prod Support | ____ | [e.g., "runbook drafted in 20 min instead of starting from scratch"] |
| **Total** | ____ | |

## Traceability Completeness

- Total REQ-### items: ____
- Fully traced through DES → TC → RB: ____ / ____ (___%)
- Orphaned items (exist in one layer but not referenced elsewhere): ____

## Action Items

| Action | Owner | Jira | Due |
|--------|-------|------|-----|
| [action from this retro] | [name] | [PROJ-###] | [date] |
