# QA / QE Prompt Library

## Tool Access

QA/QE team members have access to:
- **GitHub Copilot Chat** (Claude, Codex, ChatGPT models) — best for test plan generation, gap analysis, automation scaffolding
- **GitHub Copilot Inline** (VS Code) — best for writing test automation code
- **M365 Copilot** (if provisioned) — useful for test documentation, reporting, communication
- **300 premium tokens/month** — Claude and Codex consume premium tokens

**Token budget strategy:**
- Use **Claude/Codex** (premium) for: test plan generation from upstream artifacts, requirements gap analysis, cross-artifact consistency checks — these are the compound chain tasks
- Use **ChatGPT** (free) for: test case refinement, explaining test concepts, reviewing individual test cases
- Use **Copilot Inline** (free) for: writing test automation code, assertions, data setup

**Important:** All AI usage is enterprise-governed. Do not use public Claude, ChatGPT, or any non-approved AI interface.

---

## Prompt: Generate Test Plan from Upstream Artifacts

**Token cost:** Premium (use Claude or Codex — this is the highest-value QA prompt)
**When to use:** requirements.md and design.md are committed. Time to generate test-plan.md.

```
Generate a test plan for Jira [PROJ-###].

CONTEXT — include ONLY these sections from upstream artifacts:

--- FROM requirements.md (acceptance criteria and edge cases only) ---
[Paste REQ-### and REQ-N## items only. Do NOT paste business context, constraints, or open questions.]
--- END ---

--- FROM design.md (test-relevant sections only) ---
[Paste ONLY these sections:]
- Requirements Traceability table
- Edge Cases & Error Handling table
- Test Guidance for QA section
[Do NOT paste the full design — approach, components, data flow are not needed for test generation.]
--- END ---

INSTRUCTIONS:
- Create a TC-### for each test case
- Map every TC-### to the REQ-### and DES-### it validates in a traceability table
- Generate at minimum:
  - One happy-path TC per REQ-###
  - One TC per edge case (DES-E##)
  - One TC per error case from the design's API/interface error cases
  - One negative TC per REQ-N##
- For each test case include: Traces-to, Priority (P1/P2/P3), Type, Preconditions, Steps, Expected Result, Test Data
- Make each test case specific enough to automate without interpretation. "Verify it works correctly" is not an expected result.
- Include a "Requirements Gap Report" section: list any REQ-### that is ambiguous, untestable, or missing edge cases. I will send these back to the BSA.
- Include a "Deployment Risks" section: anything Prod Support should know from a testing perspective.

DATA CLASSIFICATION: [Internal]. All test data must use placeholders — [CLIENT_A], [ACCT_001], etc. No real client data.

Output in markdown matching the test-plan.md template format.
```

---

## Prompt: Generate Requirements Gap Report

**Token cost:** Premium (use Claude — this is the QA → BSA feedback loop)
**When to use:** During or after test plan generation. Identifies gaps that should be resolved before testing begins.

```
Compare these upstream artifacts and identify requirements gaps.

--- ACCEPTANCE CRITERIA ---
[Paste REQ-### and REQ-N## items from requirements.md]
--- END ---

--- DESIGN EDGE CASES AND ERROR HANDLING ---
[Paste the Edge Cases & Error Handling table and the Test Guidance section from design.md]
--- END ---

For each gap found:
1. Specify which REQ-### is affected
2. Describe what's missing or ambiguous — be specific
3. Categorize the gap:
   - BLOCKS TESTING: Cannot write a test because the requirement is undefined
   - RISKS INCORRECT IMPLEMENTATION: Requirement is vague enough that dev and QA might interpret it differently
   - MINOR CLARIFICATION: Testable as-is but could be clearer
4. Suggest what the BSA should clarify

Output as a checklist I can paste directly into the Requirements Gap Report section of test-plan.md:

- [ ] **[REQ-###]** [CATEGORY]: [description of gap] — Suggested clarification: [what BSA should specify]

Do not report "no gaps found." If the requirements are genuinely complete, confirm each REQ-### was reviewed and explain why it's testable as-is. But there are almost always gaps — find them.
```

---

## Prompt: Generate Automation Scaffolding

**Token cost:** Free (use ChatGPT or Copilot Inline — the structure is straightforward)
**When to use:** Test plan is approved. You need test automation stubs.

```
Generate test automation scaffolding from this test plan.

CONTEXT:
[Paste only the Test Cases section of test-plan.md — TC-### items with their details]

INSTRUCTIONS:
- Framework: [pytest / Jest / Playwright / Selenium / Cypress / xUnit — specify yours]
- Language: [Python / TypeScript / C# — specify yours]
- Generate a test method stub for each TC-###
- Include in each test's docstring:
  - TC-### ID
  - Traces-to: REQ-### and DES-### IDs
  - Priority
  - Type (Functional / Negative / Regression / etc.)
- Generate data setup and teardown methods
- Use [arrange-act-assert / given-when-then] pattern
- Placeholder assertions with TODO comments — I'll fill in specifics
- Do NOT generate full implementation — stubs with clear structure only

Example naming convention: test_[TC_ID]_[scenario_snake_case]
```

---

## Prompt: Expand Test Cases for Complex Scenarios

**Token cost:** Free (use ChatGPT)
**When to use:** A particular test area needs more depth — e.g., data validation, boundary testing, concurrency.

```
I need to expand test coverage for this area.

Existing test cases:
[Paste the relevant TC-### items]

Requirements being tested:
[Paste the relevant REQ-### items]

I need additional test cases for:
- [ ] Boundary values (min, max, zero, negative, overflow)
- [ ] Data validation (null, empty, malformed, wrong type, too long)
- [ ] Concurrency / race conditions (if applicable)
- [ ] Performance / volume (if applicable)
- [ ] Security / authorization (if applicable)

Generate additional TC-### items (continuing the numbering from [last TC number]).
Same format as existing test cases — Traces-to, Priority, Type, Preconditions, Steps, Expected Result.
Only generate test cases that add coverage not already present in the existing set.
```

---

## Prompt: Cross-Reference Test Results with Requirements

**Token cost:** Free (use ChatGPT)
**When to use:** Test execution is complete. You need to map results back to requirements for sign-off.

```
Map these test results back to the requirements traceability.

Test results:
| TC-### | Status | Notes |
|--------|--------|-------|
[Paste your test execution results]

Requirements traceability from test plan:
[Paste the traceability table from test-plan.md]

Generate:
1. A requirements coverage summary:
   | REQ-### | Test Cases | All Passing? | Notes |
   For each REQ-###, list the TC-### items that validate it and whether all passed.

2. Untested requirements: any REQ-### with no passing TC-###

3. Failed test analysis: for each failed TC-###, which REQ-### is at risk?

4. Recommended disposition:
   - PASS: All requirements covered and validated
   - CONDITIONAL PASS: Minor gaps, acceptable risk — list what's deferred
   - FAIL: Critical requirements not validated — list blockers

This will be used for the Jira [PROJ-###] test sign-off comment.
```

---

## Prompt: Generate Regression Test Suite Recommendation

**Token cost:** Free (use ChatGPT)
**When to use:** Feature is being released and you need to identify what existing regression tests should run.

```
Based on this feature's design, recommend which regression tests should run.

Components affected:
[Paste the Components Affected section from design.md]

API / Interface changes:
[Paste the API changes section from design.md]

Data flow:
[Paste or summarize the data flow]

Our existing regression suites cover these areas:
[List your existing regression suite names and what they cover — e.g., "Trade Processing Suite — covers trade lifecycle, netting, valuation"]

Recommend:
1. Which existing regression suites should run (and why)
2. Any areas not covered by existing suites that need manual regression
3. Priority order for regression execution

Keep recommendations specific. "Run the full regression" is not useful.
```

---

## Tips for Effective QA Prompting

1. **Context compression matters most for QA.** You're consuming two upstream artifacts (requirements + design). Don't paste the full documents — extract only the sections the prompt specifies. This produces better output and conserves tokens.

2. **The Requirements Gap Report is your highest-value output.** It's not a nice-to-have — it's the QA → BSA feedback loop that catches issues before they become bugs. Invest time here.

3. **Save premium tokens for compound chain tasks.** Test plan generation and gap analysis are worth premium tokens because they consume upstream artifacts. Individual test case refinement and automation scaffolding work fine with free-tier ChatGPT and Copilot inline.

4. **Use Copilot inline for test automation.** Once you have the scaffolding from the prompt above, use Copilot inline in VS Code to fill in assertions and data setup. It's free and fast for this kind of work.

5. **Always include traceability IDs.** Every TC-### must trace to REQ-### and DES-###. This isn't bureaucracy — it's how you prove coverage at release sign-off and it's what audit will ask for.

6. **Link test Jiras to the parent feature Jira.** Whether sub-tasks or separate tickets, the Jira link is what makes the test work visible to the rest of the team.
