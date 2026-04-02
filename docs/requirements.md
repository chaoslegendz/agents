# Feature: [Title]
# Jira: [PROJ-###]

<!-- chain-meta
classification: [Public | Internal | Restricted]
jira: [PROJ-###]
upstream: N/A
last_synced: YYYY-MM-DD
author: [Name]
ai_tools_used: [M365 Copilot | GitHub Copilot Chat | None]
-->

## Business Context

[2–3 sentences on why this matters. No client names, no PII, no production data.]

## Regulatory Reference

[If applicable: OSFI guideline, Basel paragraph, internal policy ID. Leave blank if not regulatory.]

## Acceptance Criteria

### REQ-001: [Short title]
- **GIVEN** [precondition]
  **WHEN** [action]
  **THEN** [expected outcome]

### REQ-002: [Short title]
- **GIVEN** [precondition]
  **WHEN** [action]
  **THEN** [expected outcome]

## Negative / Edge Cases

### REQ-N01: [What should NOT happen or boundary condition]
- **GIVEN** [precondition]
  **WHEN** [action]
  **THEN** [expected outcome — typically a rejection, error, or no-op]

## Data Requirements

| Field | Source System | Transformation | Validation Rule |
|-------|-------------|----------------|-----------------|
| [field — use placeholder if sensitive] | [system] | [logic] | [rule] |

## Constraints & Assumptions

- **Regulatory:**
- **Technical:**
- **Dependencies:** [Other Jira tickets this depends on]
- **Assumptions:** [Explicitly state what you're assuming — don't leave it implicit]

## Open Questions

- [ ] [Question] — Owner: [Name] — Due: [Date] — Jira: [PROJ-### if tracked separately]

---

## Validation Checklist

Before moving Jira to "Ready for Dev":

- [ ] Every acceptance criterion maps to a stated business need
- [ ] Negative and edge cases exist for each criterion
- [ ] A developer with no context could build from this alone
- [ ] No PII, client names, or restricted data present
- [ ] REQ-### IDs assigned to every criterion
- [ ] Data classification tag is set in chain-meta
- [ ] Open questions are resolved or have owners and due dates
