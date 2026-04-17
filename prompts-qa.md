# QA / QE Prompt Library
**Role:** QA / QE Engineer  
**Tools:** GitHub Copilot in VS Code (Claude + GPT via model picker)  
**Agent:** QA Agent (custom GitHub Copilot — in progress)

> These prompts are starting points. QA owns the sign-off. Agent output informs your judgment — it does not replace it.

---

## 1. Run Gap Analysis on BSA Test Plan

**When to use:** After BSA has finalised requirements and test cases, before writing your own QA test plan.  
**Tool:** QA Agent / GitHub Copilot

```
You are a senior QA engineer reviewing a BSA-produced test plan before writing QA test cases.

Jira ticket: [JIRA-####]

Requirements:
[PASTE REQUIREMENTS]

BSA test plan (TC01, TC02...):
[PASTE JIRA-####-testplan-bsa]

Perform a gap analysis. Identify:

1. Missing functional coverage — requirements that have no test case or only a happy-path test
2. Missing negative cases — inputs that are invalid, empty, out of range, or malformed
3. Missing edge cases — boundary values, concurrent execution, data volume extremes
4. Missing error handling tests — what happens when upstream systems fail or return unexpected data
5. Untestable requirements — requirements written in a way that cannot be verified by a test case
6. Ambiguous acceptance criteria — AC that is not specific enough to determine pass/fail

For each gap:
- Gap ID: GAP-##
- Related REQ-###: [which requirement]
- Related TC-## (if any): [existing case that is insufficient]
- Gap description: What is missing
- Suggested QA test case: What you would add as JIRA-####-QA##
- Severity: Critical / High / Medium / Low

Summary: X gaps found. Y critical/high priority. Recommend BSA update requirements before dev proceeds: Yes / No.
```

**What good output looks like:** Specific gaps with requirement traceability. Critical gaps flagged clearly. A recommendation on whether BSA needs to update before dev starts.

---

## 2. Regression Impact Analysis

**When to use:** When a new requirement comes in and you need to know which existing Xray test cases may be affected.  
**Tool:** QA Agent / GitHub Copilot

```
You are a senior QA engineer assessing the regression impact of a new change.

Jira ticket: [JIRA-####]

New requirement summary:
[DESCRIBE WHAT IS CHANGING]

Existing test cases potentially affected (paste from Xray or describe):
[PASTE EXISTING TEST CASES OR DESCRIBE THE TEST SUITE]

System context:
[DESCRIBE THE SYSTEM — e.g. treasury data pipeline, Murex integration, regulatory reporting]

Assess:
1. Which existing test cases are directly invalidated by this change?
   - TC-ID: [case] — Reason: [why it is invalidated]

2. Which existing test cases are indirectly affected (may still pass but need re-validation)?
   - TC-ID: [case] — Reason: [why it needs re-check]

3. Are there any archived/superseded test cases that should be reviewed for relevance?

4. What new regression tests should be added to the canonical suite?

Output a regression test plan:
- Tests to archive: [list]
- Tests to update: [list with what to change]
- Tests to re-run unchanged: [list]
- New tests to create: [list as JIRA-####-QA##]
```

**What good output looks like:** Clear categorisation of archive / update / re-run / create. New test IDs follow JIRA-####-QA## convention.

---

## 3. Generate QA Test Cases from Requirements

**When to use:** When writing your JIRA-####-testplan-qa after dev has completed.  
**Tool:** QA Agent / GitHub Copilot

```
You are a senior QA engineer writing integration, regression, and full journey test cases.

Jira ticket: [JIRA-####]

Requirements:
[PASTE REQUIREMENTS]

BSA test plan (for reference — do not duplicate):
[PASTE JIRA-####-testplan-bsa]

Dev implementation notes (if available):
[PASTE ANY RELEVANT NOTES FROM DEV]

Write QA test cases for:
1. Integration tests — does this feature work correctly with connected systems? [e.g. Murex, ADLS, downstream reporting]
2. Regression tests — does this change break any existing functionality?
3. Full journey tests — does the end-to-end user/system flow work correctly?
4. Non-functional tests — performance, data volume, concurrent users where relevant

For each test case:
- ID: JIRA-####-QA01 (increment per case)
- Title: Short description
- Type: Integration / Regression / Journey / Non-functional
- Prerequisite: What must be true before this test runs
- Steps: Numbered
- Expected result: Clear pass/fail condition
- Automation: automated / manual / tbd
- Systems involved: [which systems are exercised]

Do not duplicate BSA test cases. Focus on system-level behaviour, not unit-level.
```

**What good output looks like:** Cases focus on cross-system behaviour. At least one full journey test. Non-functional cases included if relevant. No duplication of BSA TC-### cases.

---

## 4. Review Test Results Manifest

**When to use:** After the dev agent has run and emitted the test-results-manifest.json. Review before you begin QA execution.  
**Tool:** GitHub Copilot

```
Review the following test results manifest from the dev agent.

Jira ticket: [JIRA-####]

Manifest:
[PASTE JIRA-####-test-results-manifest.json]

BSA test plan:
[PASTE JIRA-####-testplan-bsa for reference]

Analyse:
1. Coverage check — are all TC-## cases from the BSA test plan accounted for in the manifest?
2. MANUAL_REQUIRED cases — list all cases flagged as MANUAL_REQUIRED with their reasons. These require human QA execution.
3. SKIPPED cases — list all SKIPPED cases with reasons. Assess whether each skip is acceptable or should be investigated.
4. FAIL cases — list all failures. For each: is this a code defect, a test defect, or an environment issue?
5. Unaccounted cases — are there any TC-## cases in the BSA test plan that do not appear in the manifest?

Output:
- Coverage: X of Y BSA cases accounted for
- MANUAL_REQUIRED: [list with reasons]
- SKIPPED requiring investigation: [list]
- FAIL cases for dev to fix: [list]
- Missing from manifest: [list]
- QA sign-off readiness: Ready / Not ready — reason
```

**What good output looks like:** All gaps between testplan and manifest surfaced. Clear list of what QA must manually execute. Dev defects separated from test/environment issues.

---

## 5. Write Automation Test Scaffolding

**When to use:** When converting manual QA test cases to automated tests.  
**Tool:** GitHub Copilot (inline or chat)

```
I have a manual QA test case that I want to automate. Generate test scaffolding.

Test case:
- ID: [JIRA-####-QA##]
- Title: [title]
- Type: [Integration / Regression / Journey]
- Steps: [numbered steps]
- Expected result: [pass condition]

System under test: [describe the component or API being tested]
Test framework: [pytest / Jest / Playwright / etc.]
Existing test patterns in this repo: [describe or paste an example test]

Generate:
1. Test function scaffold with the correct naming convention
2. Setup and teardown if needed
3. Assertions that directly verify the expected result
4. Mock or stub for any external system calls
5. Comment noting this covers [JIRA-####-QA##]

Do not write the full implementation yet — provide the structure for me to complete.
```

**What good output looks like:** Test ID commented. Assertions match the expected result exactly. External calls mocked. Ready to fill in.

---

## 6. Draft Requirements Gap Report for BSA

**When to use:** After gap analysis, to formally communicate findings back to the BSA before dev proceeds.  
**Tool:** GitHub Copilot

```
Draft a Requirements Gap Report to send to the BSA for Jira ticket [JIRA-####].

Gap analysis findings:
[PASTE FINDINGS FROM PROMPT 1 OR SUMMARISE]

Tone: Collaborative, not critical. The goal is to improve the requirements before dev starts, not to assign blame.

Format:
## Requirements Gap Report — JIRA-####
**Reviewed by:** [Your name]
**Date:** [Date]
**Status:** [Gaps found — update required / Minor gaps — proceed with caution / No gaps — clear to proceed]

### Summary
[2–3 sentences on what was reviewed and overall finding]

### Gaps requiring update before dev proceeds
| Gap ID | REQ-### | Description | Suggested fix |
|--------|---------|-------------|---------------|
[table rows]

### Gaps that can be addressed in QA test plan
| Gap ID | REQ-### | Description | QA action |
|--------|---------|-------------|-----------|
[table rows]

### Recommended next step
[One clear ask of the BSA]
```

**What good output looks like:** Gaps split into "must fix now" vs "QA will handle." One clear ask. Collaborative tone throughout.

---

## 7. Post-Incident Chain Trace

**When to use:** After a production incident, to identify which part of the artifact chain failed to catch it.  
**Tool:** GitHub Copilot

```
A production incident has occurred. Help me trace it back through the artifact chain to identify where it should have been caught.

Incident description:
[DESCRIBE WHAT HAPPENED IN PROD]

Jira ticket(s) related to the change: [JIRA-####]

Artifact chain to review:
- Requirements: [PASTE or summarise]
- BSA test cases: [PASTE or list TC-## IDs]
- QA test cases: [PASTE or list QA-## IDs]
- Test results manifest: [PASTE or summarise]

Trace:
1. Should the requirements have specified the failing behaviour? Which REQ-### is missing or wrong?
2. Should the BSA test plan have caught this? Which TC-## would have caught it if it existed?
3. Should the QA test plan have caught this? Which QA-## would have caught it?
4. Did any test case exist that should have caught this? Why did it not?
5. Was this a test coverage gap, a test execution gap, or an environment gap?

Output:
- Root cause in the chain: [Requirements / BSA test plan / QA test plan / Execution / Environment]
- Specific artifact to update: [which document and what to add]
- New test case to create: [ID and description]
- Regression suite update: [what to add to the canonical suite]
```

**What good output looks like:** Specific artifact identified as the gap. New test case described specifically enough to create. Regression suite update is actionable.

---

## 8. QA Sign-off Summary

**When to use:** When all testing is complete and you are preparing the formal sign-off before release.  
**Tool:** GitHub Copilot

```
Generate a QA sign-off summary for Jira ticket [JIRA-####].

Testing completed:
- BSA test cases executed: [X of Y — pass/fail breakdown]
- MANUAL_REQUIRED cases executed: [X of Y]
- QA test cases executed: [X of Y — pass/fail breakdown]
- Open defects: [list or "none"]
- Defects resolved: [list]

Test environment: [describe]
Build / version tested: [describe]

Format:
## QA Sign-off — JIRA-####
**QA Engineer:** [Name]
**Date:** [Date]
**Decision:** ✅ Approved for release / ⚠️ Conditional approval / ❌ Not approved

### Test execution summary
[Table or bullet summary of cases run and results]

### Defects
[List open and resolved defects]

### Conditions (if conditional approval)
[Any conditions that must be met post-release]

### Sign-off statement
[One sentence confirming the feature has been tested per the agreed test plan and is/is not ready for production]
```

**What good output looks like:** Decision is unambiguous. All test case categories accounted for. Open defects listed if any.
