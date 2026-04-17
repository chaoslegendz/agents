# BSA Prompt Library
**Role:** Business Systems Analyst  
**Tools:** M365 Copilot (primary) · GitHub Copilot (available)  
**Agent:** BSA Agent (custom GitHub Copilot)

> These prompts are starting points. Always review, refine, and take accountability for the output. The agent assists — you own the artifact.

---

## 1. Convert Meeting Notes to Requirements

**When to use:** After a stakeholder meeting, discovery session, or requirements workshop.  
**Tool:** BSA Agent / GitHub Copilot

```
You are a senior business systems analyst at a financial institution.

Convert the following meeting notes into a structured requirements document.

Meeting notes:
[PASTE MEETING NOTES HERE]

Jira ticket: [JIRA-####]

Output format:
- Ticket ID: JIRA-####
- Summary: One sentence describing the feature or change
- Background: Why this is needed (2–3 sentences)
- Functional Requirements: Numbered list, REQ-001 format, each requirement on one line, written as "The system shall..."
- Assumptions: What you've assumed that wasn't explicitly stated
- Open Questions: Anything that needs clarification before work begins
- Out of Scope: What this ticket explicitly does not cover

Be specific. Avoid vague language like "the system should be flexible." If a requirement is unclear from the notes, flag it as an open question rather than inventing detail.
```

**What good output looks like:** Numbered REQ-### IDs, no ambiguous language, at least 2–3 open questions surfaced, assumptions made explicit.

---

## 2. Convert Email Thread to Requirements

**When to use:** When requirements come in via email rather than a meeting.  
**Tool:** BSA Agent / GitHub Copilot

```
You are a senior business systems analyst at a financial institution.

I have an email thread below that contains a business request. Extract the key requirements from it and produce a structured requirements document.

Email thread:
[PASTE EMAIL THREAD HERE]

Jira ticket: [JIRA-####]

Output:
- Ticket ID: JIRA-####
- Summary: One sentence
- Requester & stakeholders: Who is asking and who is affected
- Functional Requirements: REQ-001 numbered format, "The system shall..." statements
- Assumptions: What you've inferred that wasn't stated
- Open Questions: What needs clarification before work can begin
- Out of Scope: What this ticket does not cover

Flag any conflicting information in the email thread. Do not resolve conflicts — surface them as open questions.
```

**What good output looks like:** Conflicts surfaced, not resolved. All implied requirements made explicit with an assumption flag.

---

## 3. Self-Review Requirements for Completeness

**When to use:** Before handing requirements to the Plan agent. Run this after you've drafted requirements.md.  
**Tool:** BSA Agent / GitHub Copilot

```
You are a senior QA analyst reviewing a requirements document before it goes to development.

Review the following requirements document and identify gaps, ambiguities, and missing elements.

Requirements document:
[PASTE REQUIREMENTS HERE]

Check for:
1. Missing acceptance criteria — are there requirements with no clear pass/fail condition?
2. Ambiguous language — words like "fast," "easy," "flexible," "appropriate" with no measurable definition
3. Missing error/edge cases — what happens when the input is invalid, empty, or unexpected?
4. Missing negative cases — what should the system NOT do?
5. Missing non-functional requirements — performance, security, data retention, audit logging
6. Regulatory gaps — for a banking context, are there any OSFI, Basel III, or data lineage considerations not addressed?
7. Testability — can each requirement be verified by a test case? Flag any that cannot.

Output:
- Gap: [description]
- Severity: High / Medium / Low
- Suggested fix or clarifying question

Do not rewrite the requirements. Only flag issues.
```

**What good output looks like:** At least 3–5 gaps on a typical ticket. If zero gaps are returned, re-prompt with more specific context.

---

## 4. Map Regulatory Text to Functional Requirements

**When to use:** When a ticket is driven by an OSFI guideline, Basel III rule, or internal policy.  
**Tool:** BSA Agent / GitHub Copilot

```
You are a senior business systems analyst specialising in regulatory compliance at a Canadian bank.

Map the following regulatory text to functional system requirements.

Regulatory source: [e.g. OSFI B-13, Basel III BCBS 239, SA-CCR guideline section X]
Regulatory text:
[PASTE REGULATORY SECTION HERE]

Business context:
[Brief description of the system or process this applies to]

For each requirement you derive:
- REQ-###: The system shall... [functional requirement]
- Regulatory reference: [exact clause or section]
- Rationale: Why this requirement is needed to satisfy the regulation
- Audit note: What evidence would demonstrate compliance

Flag any regulatory text that is ambiguous or requires legal/compliance team interpretation before a requirement can be written.
```

**What good output looks like:** Direct traceability from each REQ-### to a specific regulatory clause. Ambiguities flagged, not guessed.

---

## 5. Generate Acceptance Criteria from Vague Business Language

**When to use:** When a stakeholder gives you a vague ask and you need to turn it into testable AC.  
**Tool:** BSA Agent / GitHub Copilot

```
A business stakeholder has given me the following request:

"[PASTE VAGUE BUSINESS REQUEST]"

Jira ticket: [JIRA-####]

Convert this into specific, testable acceptance criteria using Given-When-Then format.

For each acceptance criterion:
- AC-###: Given [context], When [action], Then [expected outcome]
- Test type: Positive / Negative / Edge case
- Notes: Any assumption made to write this AC

Also list:
- What information is still missing to write complete acceptance criteria
- What you assumed versus what was stated

Do not pad. If the request only supports 3 AC, write 3. Quality over quantity.
```

**What good output looks like:** Each AC is independently testable. Negative cases included. Missing info clearly listed.

---

## 6. Generate BSA Test Cases from Requirements

**When to use:** After requirements are finalised and self-reviewed. This produces the BSA testplan.  
**Tool:** BSA Agent / GitHub Copilot

```
You are a senior business systems analyst writing functional test cases.

Generate a test plan from the following requirements document.

Requirements:
[PASTE REQUIREMENTS HERE]

Jira ticket: [JIRA-####]

For each test case:
- ID: JIRA-####-TC01 (increment per case)
- Title: Short description of what is being tested
- Type: Functional / Negative / Edge case / Boundary
- Prerequisite: What must be true before this test can run
- Steps: Numbered test steps
- Expected result: What should happen
- Automation: automated / manual / tbd
- Notes: Any dependency or clarification

Rules:
- Every REQ-### must have at least one test case
- Include at least one negative test case per functional area
- Flag any requirement that cannot be tested as written — do not write a test case for it
- Do not invent requirements to fill gaps — flag them instead
```

**What good output looks like:** Every REQ-### covered. Negative cases present. MANUAL_REQUIRED flagged where automation isn't possible.

---

## 7. Self-Review Test Plan for Coverage Gaps

**When to use:** After generating BSA test cases, before handing to the Plan agent.  
**Tool:** BSA Agent / GitHub Copilot

```
Review the following test plan against the requirements document and identify coverage gaps.

Requirements:
[PASTE REQUIREMENTS]

Test plan:
[PASTE TEST PLAN]

Check for:
1. Requirements without any test case
2. Requirements with only positive tests (missing negative/edge cases)
3. Test cases that don't map to any requirement
4. Duplicate or redundant test cases
5. Test cases that are not independently executable
6. Cases marked "tbd" for automation that could realistically be automated

Output a coverage report:
- Requirement: [REQ-###]
- Coverage status: Covered / Partially covered / Not covered
- Gap: What is missing
- Recommendation: Add TC / Modify TC / Flag as manual

Summary line: X of Y requirements fully covered.
```

**What good output looks like:** A clear coverage matrix. Any REQ-### with "Not covered" status must be addressed before handoff.

---

## 8. Draft Stakeholder Update for Requirements Change

**When to use:** When requirements change mid-sprint and you need to communicate the impact.  
**Tool:** M365 Copilot

```
Draft a concise stakeholder update email for the following requirements change.

Jira ticket: [JIRA-####]
Original requirement: [DESCRIBE ORIGINAL]
New requirement: [DESCRIBE CHANGE]
Reason for change: [EXPLAIN WHY]
Impact: [WHAT CHANGES — scope, timeline, test cases]
Action required from stakeholders: [WHAT DO YOU NEED FROM THEM]

Tone: Professional, direct, no fluff. Audience is [business stakeholders / technology leads].
Length: Under 150 words.
```

**What good output looks like:** Clear summary of what changed and why, impact stated plainly, one clear ask.

---

## 9. Summarise Requirements for Dev Handoff

**When to use:** When handing a complex ticket to the Plan agent — a summary helps the agent produce a better plan.  
**Tool:** BSA Agent / GitHub Copilot

```
Summarise the following requirements document into a structured handoff brief for a development team.

Requirements:
[PASTE REQUIREMENTS]

Test plan:
[PASTE TEST PLAN]

Jira ticket: [JIRA-####]

Output:
- What is being built (2 sentences max)
- Key business rules the developer must not violate
- The 3 most critical test cases from the test plan
- Known constraints or dependencies (systems, data, environments)
- Open questions that dev may surface during implementation

This brief will be fed to a planning agent. Be precise. No padding.
```

**What good output looks like:** Concise enough to read in 2 minutes. Key business rules clearly stated. Dependencies explicit.

---

## 10. Check for Overlap with Existing Jira Tickets

**When to use:** Before writing new requirements, to avoid duplicating work already done or in flight.  
**Tool:** M365 Copilot / manual Jira search

```
I am about to write requirements for the following request:

[DESCRIBE THE REQUEST]

Before I start, help me draft a list of search terms and Jira JQL queries I should run to check whether similar work has already been done or is currently in progress.

Context: We work in treasury technology at a bank. Our systems include [LIST RELEVANT SYSTEMS e.g. Murex, ADLS, reporting pipelines].

Output:
- 5 search terms to use in Jira text search
- 3 JQL queries to find potentially related tickets
- Questions I should ask my team before starting
```

**What good output looks like:** Specific search terms relevant to the domain, not generic. JQL queries ready to paste.
