# BSA Prompt Library

## Tool Access

BSAs have access to:
- **M365 Copilot** (with web access) — best for research, drafting from stakeholder notes, reviewing documents, working within Word/Excel/Outlook
- **GitHub Copilot Chat** (Claude, Codex, ChatGPT models) — best for structured output generation, markdown formatting, technical analysis

**Important:** All AI usage is enterprise-governed. Do not use public Claude, ChatGPT, or any non-approved AI interface. All prompts below work in both M365 Copilot and GitHub Copilot Chat.

**Token budget:** Be mindful of the 300 premium tokens/month allocation on GitHub Copilot. Use M365 Copilot for research and drafting tasks. Reserve GitHub Copilot Chat for structured generation tasks that need precise formatting (acceptance criteria, gap analysis).

---

## Prompt: Generate Acceptance Criteria

**When to use:** Starting a new feature. You have a business need, stakeholder notes, or a Jira description and need to produce structured requirements.md.

**Best tool:** GitHub Copilot Chat (Claude or Codex) for structured output. M365 Copilot if you're drafting in Word first.

```
I need to generate structured acceptance criteria for a Jira feature.

Jira: [PROJ-###]
Business context: [2–3 sentences on what this feature does and why]
Regulatory reference (if any): [OSFI guideline / Basel paragraph / internal policy]
Stakeholder notes: [paste key points from meetings, emails, or Jira comments — summarize, don't paste raw transcripts]

Generate acceptance criteria using this structure:
- Assign each criterion a unique ID: REQ-001, REQ-002, etc.
- Use GIVEN/WHEN/THEN format
- Include negative and edge case scenarios (prefix REQ-N01, REQ-N02, etc.)
- Include a Data Requirements table with columns: Field, Source System, Transformation, Validation Rule
- Flag any ambiguities as open questions with a suggested owner

DATA CLASSIFICATION RULES:
- Classification: [Internal]
- Do NOT include real client names — use [CLIENT_A], [CLIENT_B]
- Do NOT include real account numbers — use [ACCT_001], [ACCT_002]
- Do NOT include production endpoints or credentials
- Keep regulatory rule references intact — those are not sensitive

Keep the output under 60 lines. Precision over exhaustiveness.
Output in markdown format matching the requirements.md template.
```

---

## Prompt: Generate Requirements from Jira Description

**When to use:** A Jira ticket already has a description, comments, and discussion. You need to convert that into a structured requirements.md.

**Best tool:** M365 Copilot (paste Jira content) or GitHub Copilot Chat.

```
Convert this Jira ticket content into a structured requirements specification.

Jira: [PROJ-###]
Jira description:
[Paste the Jira description field]

Key comments/discussion:
[Paste or summarize the 2–3 most important comments from the Jira — not the full history]

Generate:
1. A "Business Context" section (2–3 sentences)
2. Acceptance criteria with GIVEN/WHEN/THEN format, each with a REQ-### ID
3. Negative/edge cases with REQ-N## IDs
4. A Data Requirements table if data elements are mentioned
5. A Constraints & Assumptions section
6. Open Questions extracted from unresolved Jira comments — list with owner if identifiable

DATA CLASSIFICATION: [Internal]. Redact any client names, account numbers, or PII using placeholders.

Output in markdown format.
```

---

## Prompt: Review Requirements for Completeness

**When to use:** After drafting requirements.md (whether manually or AI-assisted). This is the self-check before marking "Ready for Dev."

**Best tool:** Either M365 Copilot or GitHub Copilot Chat.

```
Review this requirements spec for completeness and downstream usability.

[Paste requirements.md — or the acceptance criteria and data requirements sections only if the full doc is long]

Check for:
1. Missing acceptance criteria — are there business scenarios not covered?
2. Missing negative/edge cases for each REQ-### criterion
3. Data requirements gaps — missing source systems, fields, or validation rules
4. Regulatory implications not captured (if regulatory reference is provided)
5. Developer test: would a developer with no prior context understand exactly what to build?
6. QA test: could a QA engineer write test cases from the acceptance criteria alone?
7. Ambiguous language — words like "appropriate," "relevant," "as needed" without specifics

For each gap found, specify which REQ-### it relates to.
Do not suggest adding information that is already present.
Be specific — "REQ-003 doesn't specify what happens when the input is null" is useful. "Consider adding more detail" is not.
```

---

## Prompt: Validate AI-Generated Requirements

**When to use:** You generated requirements with AI and need to check for hallucinations, filler, and vague criteria before sending to Dev.

**Best tool:** Either.

```
I generated the following requirements spec with AI assistance and need to validate it before sending to the development team.

[Paste requirements.md]

For each acceptance criterion (REQ-###):
1. Does it map to a specific, stated business need — or is it generic filler that could apply to any feature?
2. Is the GIVEN/WHEN/THEN specific enough that two different developers would build the same thing?
3. Is there a corresponding negative or edge case?
4. Does the data requirements table include all fields referenced in the acceptance criteria?

Also check:
- Are any acceptance criteria redundant (testing the same thing in different words)?
- Are any criteria technically impossible or contradictory?
- Did the AI introduce requirements that weren't in the original business context?

Flag anything that looks plausible but vague. I'd rather remove weak criteria than keep them.
```

---

## Prompt: Regulatory Requirement Extraction

**When to use:** Translating a regulatory guideline (OSFI, Basel, internal policy) into actionable acceptance criteria.

**Best tool:** M365 Copilot (if the guideline is in a Word doc or PDF) or GitHub Copilot Chat.

```
Extract actionable acceptance criteria from this regulatory text.

Regulatory source: [OSFI guideline / Basel paragraph / internal policy — include the reference ID]
Relevant section:
[Paste the specific section — not the entire guideline. Summarize surrounding context in 1–2 sentences if needed.]

Generate:
1. Acceptance criteria in GIVEN/WHEN/THEN format with REQ-### IDs
2. For each criterion, cite the specific regulatory paragraph or clause it addresses
3. Identify any areas where the regulatory text is ambiguous and the bank needs to make an interpretation decision
4. Flag any criteria that may conflict with existing system behaviour (if you have context on the current system)

Note: Regulatory rule references and paragraph numbers are NOT sensitive — keep them intact.
Client data and production system details ARE sensitive — use placeholders.
```

---

## Prompt: Prepare Handoff Notes for Dev

**When to use:** requirements.md is complete and you want to generate a concise summary for the developer picking up the ticket.

**Best tool:** Either.

```
Generate a developer handoff summary from this requirements spec.

[Paste requirements.md — or acceptance criteria and data requirements sections only]

Generate a concise summary (under 20 lines) covering:
1. What to build (one paragraph plain language)
2. The 3 most critical acceptance criteria to get right
3. The trickiest edge case or negative scenario
4. Key data elements and where they come from
5. Unresolved questions or assumptions the dev should validate

This will be pasted as a comment on Jira [PROJ-###] when moving to "Ready for Dev."
```

---

## Tips for Effective BSA Prompting

1. **Summarize before you paste.** Don't dump 50 Jira comments into a prompt. Extract the 3–5 key decisions and constraints. AI is better at generating from clean summaries than from noisy histories.

2. **Use M365 Copilot for research and context gathering.** It has web access and works inside Word/Outlook. Use it to research regulatory references, summarize email threads, and draft initial notes.

3. **Use GitHub Copilot Chat for structured output.** When you need precisely formatted markdown with REQ-### IDs and GIVEN/WHEN/THEN structure, the code-oriented models (Claude, Codex) are better at consistent formatting.

4. **Always run the validation prompt.** AI-generated requirements look plausible but can contain generic filler. The validation prompt catches criteria that sound right but don't actually constrain the implementation.

5. **Classify data before every prompt.** Get in the habit of including the data classification block. It takes 10 seconds and prevents a compliance incident.
