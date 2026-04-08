# Compound Engineering Pilot Plan

## Pilot Objective

Run 1–2 Jiras through the compound engineering workflow to test the framework with the team before wider adoption. The goal is not perfection — it's to learn what works, what doesn't, and what needs adjusting before scaling to the rest of the backlog.

## What Success Looks Like

After the pilot, the team can answer:
- Did the Jira description template give the dev better input than reading Confluence?
- Did JTMF with standard + Jira-specific test cases work better than a standalone Excel?
- Did the plan.md standardized prompt produce better/more consistent plans?
- Did the sign-off comment and traceability IDs add value or just overhead?
- What would we change before using this on 10 more Jiras?

---

## Pre-Pilot Setup (1–2 Days Before Kickoff)

### You Do (Before Involving the Team)

| Task | Time | Detail |
|------|------|--------|
| Pick the pilot Jiras | 15 min | See "How to Pick Pilot Jiras" below |
| Create the Jira description template | 15 min | Copy from `/templates/jira-description-template.md` into your Jira project's template or a pinned Confluence page |
| Set up one JTMF folder | 30 min | Create a folder "Standard Pipeline Tests" in JTMF. Add the 10 ingestion standard test cases (STC-ING-001 through STC-ING-010) from the ingestion pattern file. Fill in the scenario descriptions and steps. |
| Commit the pattern file | 15 min | Commit `ingestion-pattern.md` (or whichever pattern fits your pilot Jiras) to `/docs/patterns/` in the repo |
| Commit the prompt files | 10 min | Commit `bsa-prompts-revised.md` and `dev-prompts-revised.md` to `/docs/prompts/` |
| Start the pipeline catalog | 15 min | Commit `pipeline-catalog.md` to repo root. Pre-fill with 5–10 existing pipelines the team already has in production. Identify the "closest existing pipeline" for each pilot Jira. |
| Prep the worked example | 10 min | Review the worked example in this kit. Adjust the pipeline name and details to match something realistic for your team. |

### How to Pick Pilot Jiras

Choose 1–2 Jiras that:

- **Follow a known pattern.** Pick an ingestion or transformation pipeline, not something novel. You want 80% of the work covered by the pattern so the team sees the leverage.
- **Are about to start, not mid-flight.** Don't retrofit. Pick Jiras that haven't been picked up by a dev yet.
- **Are medium complexity.** Not a one-liner config change (too simple to see the framework's value). Not a monster multi-source pipeline (too complex for a first run).
- **Have a BSA and a dev who are willing to try something new.** Volunteerism beats mandates for pilots.
- **Ideally, both Jiras use the same pattern** so you can compare how two different devs experience it.

---

## Kickoff Session (30 Minutes)

### Who Attends
- The BSA(s) assigned to the pilot Jiras
- The dev(s) assigned to the pilot Jiras
- You (facilitator)
- Optional: QA/QE if they're involved in this workflow, scrum master

### Agenda

**1. Why We're Doing This (5 min)**

Frame it simply. Don't present the full framework. Say something like:

> "We have 150+ Jiras in this repo and we're going to have a lot more. Right now, every Jira is a snowflake — the BSA writes requirements differently each time, the dev interprets Confluence differently, test cases are in standalone Excels, and there's no easy way to trace 'what was tested for this ticket?' after it's closed.
>
> We're going to try something on 2 Jiras: standardize the handoffs so the AI tools produce better output and we build traceability as a byproduct — not as extra work.
>
> This is a trial. If it doesn't work, we'll adjust. I'm asking for about 15 minutes of extra effort per Jira, and in exchange we should get faster dev plans, better test cases, and a sign-off trail."

**2. What's Changing (10 min)**

Walk through the three changes each role will feel. Use the quick-reference card as a visual.

For BSA:
1. You'll use a standardized Jira description template instead of free-form
2. You'll link standard test cases from JTMF instead of generating everything from scratch in Excel
3. You'll post a sign-off comment on Jira when testing is done

For Dev:
1. You'll use the AI-Ready info from the Jira description (structured, with IDs) instead of copy-pasting from Confluence
2. You'll use a standardized prompt to generate plan.md
3. You'll post a Dev Complete comment listing what was implemented

**3. Walkthrough of the Worked Example (10 min)**

Walk through the worked example (next section of this doc). Show:
- Here's what the Jira description looks like
- Here's the plan.md the dev prompt produces
- Here's what JTMF test cases look like (standard inherited + Jira-specific)
- Here's the sign-off comment

Let people react. Answer questions.

**4. Logistics (5 min)**

- "Here's where the prompt files live in the repo: `/docs/prompts/`"
- "Here's the pattern file: `/docs/patterns/ingestion-pattern.md`"
- "Here's the pipeline catalog — find the closest pipeline to yours"
- "The JTMF standard test folder is set up — I'll show you how to link them"
- "We'll do a 15-minute retro after both Jiras are done"

---

## During the Pilot

### Week 1: BSA Starts the First Jira

**Day 1–2: BSA fills in the Jira description template**

What to do:
1. Open the Jira description template
2. Fill in each section for the first pilot Jira
3. Key fields: Pattern, What's Different, Jira-Specific Requirements (REQ-PROJ-###-###), Data Specification, Similar Existing Pipeline

How to help:
- Sit with the BSA for the first one. Not to do it for them, but to answer questions about the template ("what goes in 'What's Different' vs 'Jira-Specific Requirements'?")
- The first Jira description will take 30–45 minutes. That's fine. The second one will take 15–20.

What to watch for:
- BSA trying to put everything in "Jira-Specific Requirements" instead of referencing the pattern standards. Gently redirect: "STD-ING-001 already covers schema validation — you only need to add the custom validation rule for this specific source."
- BSA unsure how to identify the "Similar Existing Pipeline." Help them search the pipeline catalog.

**Day 2–3: BSA sets up test cases in JTMF**

What to do:
1. Link the standard pattern test cases (STC-ING-###) to this Jira in JTMF
2. Generate Jira-specific test cases using the testing agent or the JTMF prompt from the BSA prompt library
3. Enter the Jira-specific test cases in JTMF (typically 3–8 cases)

How to help:
- If the BSA hasn't used JTMF before, walk through the linking process together
- Run the gap review prompt together: "Here are my requirements, here are my test cases — what's missing?"

What to watch for:
- BSA regenerating ALL test cases from scratch instead of inheriting the standard ones. The whole point is that STC-ING-001 through 010 are already done.
- Test cases without TC-PROJ-###-### IDs or without "Traces to" references. Catch this early.

### Week 1–2: Dev Picks Up the Jira

**Day 3–5: Dev generates plan.md**

What to do:
1. Open the Jira description (structured with requirements IDs)
2. Open the pattern file (`/docs/patterns/ingestion-pattern.md`)
3. Find the "Similar Existing Pipeline" from the catalog and pull up its code
4. Use the standardized plan.md prompt from `/docs/prompts/dev-prompts-revised.md`
5. Generate plan.md in GitHub Copilot Chat (Claude or Codex)
6. Review the plan — does it make sense? Does it reference the right REQ IDs?

How to help:
- The first time, the dev may struggle with context compression — which parts of the Jira to paste vs. which to leave out. Sit with them for the first prompt.
- If the plan.md quality is poor (too generic, missing deviations), help them refine the prompt. Usually the issue is not enough codebase context or not referencing the closest existing pipeline.

What to watch for:
- Dev ignoring the pattern file and generating a plan from scratch. The pattern IS the leverage.
- Dev pasting the entire Confluence page instead of the structured Jira description. The template exists to avoid this.
- plan.md that doesn't reference any REQ IDs. This breaks traceability downstream.

**Day 5–8: Dev iterates with developer agent**

What to do:
1. Feed plan.md to the developer agent
2. Run, check, iterate as normal
3. When done, post the Dev Complete comment on Jira using the template from the prompt library

How to help:
- This step is mostly unchanged from current workflow. The difference is the plan.md is higher quality because it was generated from structured input + pattern reference.
- Watch whether the Dev Complete comment actually gets posted. If the dev skips it, the BSA loses the handoff signal.

### Week 2: BSA Tests

**Day 8–10: BSA executes tests**

What to do:
1. Execute the standard pattern test cases (STC-ING-###) in JTMF — mark pass/fail
2. Execute the Jira-specific test cases (TC-PROJ-###-###) in JTMF — mark pass/fail
3. Attach evidence to each test execution in JTMF (or SharePoint with naming convention if files are large)
4. Use M365 Copilot / GitHub Copilot for data analysis during testing as usual

How to help:
- If JTMF test execution is new, walk through the first couple of test case executions together
- The standard test cases (STC-ING-###) should be straightforward if the pattern is well-defined. If they're confusing, that's feedback on the pattern file — capture it.

**Day 10–11: BSA completes and signs off**

What to do:
1. Run the testing observations prompt (optional but valuable)
2. Generate the test sign-off comment using the prompt
3. Post the sign-off comment on Jira
4. Move Jira to Done

What to watch for:
- Sign-off comment that doesn't include the requirements coverage table. This is the whole point — traceability from requirements to test results in one Jira comment.

---

## Pilot Retro (15 Minutes)

Run this after both pilot Jiras are complete. Keep it tight.

### Who Attends
Same as kickoff — BSA(s), dev(s), you, optional QA/scrum master

### Questions to Answer

**For BSA:**
1. How long did it take to fill in the Jira description template? Is that sustainable?
2. Was linking standard test cases in JTMF easier than generating everything in Excel?
3. How many Jira-specific test cases did you need beyond the standard ones?
4. Did the gap review prompt catch anything useful?
5. Did the Dev Complete comment give you what you needed to start testing?
6. How long did the sign-off comment take? Is it worth the effort?
7. What would you change about the template, the JTMF setup, or the prompts?

**For Dev:**
1. Was the structured Jira description better input than reading Confluence? How so?
2. Did the standardized plan.md prompt produce a better plan than your usual approach?
3. Did referencing the pattern file and closest existing pipeline help?
4. How long did plan.md generation take? Worth the premium tokens?
5. What would you change about the Jira template, the prompt, or the pattern file?

**For Both:**
1. What felt like overhead vs. what felt like genuine improvement?
2. On a scale of 1–5, how confident are you that this approach would work for the next 10 Jiras?
3. What's the one thing to fix before expanding?

### Capture and Act

Document the retro findings. Key outputs:
- Template adjustments (update and re-commit)
- Pattern file adjustments (update and re-commit)
- Prompt refinements (update and re-commit)
- JTMF setup changes
- Decision: expand to more Jiras next sprint or iterate first?

---

## After the Pilot

### If It Worked (Likely Outcome)
- Expand to 5–10 Jiras next sprint
- Different devs and BSAs — test whether it works for people who weren't in the pilot
- Start building the second pattern file (transformation or reconciliation)
- Update the pipeline catalog with the two pilot pipelines

### If It Partially Worked
- Fix what broke based on the retro
- Run 1–2 more pilot Jiras with the adjustments
- Don't scale before the seams are clean

### If It Didn't Work
- Identify whether the problem is the framework or the tooling
- If it's the framework: simplify. Maybe only the Jira description template and the sign-off comment survive. That's still progress.
- If it's the tooling (JTMF is painful, prompts don't produce good output): address the tooling issue specifically before retrying.

---

## Common Objections and Responses

| Objection | Response |
|-----------|----------|
| "This is more work" | "The template takes 15 extra minutes on the Jira. The plan.md prompt takes 5 minutes instead of manually copying from Confluence. The test cases are mostly inherited. Net time should be comparable or less — and quality is higher." |
| "We don't need IDs, we just test it" | "At 150 Jiras, when someone asks 'what was tested for PROJ-123?' in 6 months, you won't remember. The IDs and sign-off comment answer that question in 30 seconds." |
| "The pattern doesn't match my Jira" | "The 'What's Different' section is exactly for that. Specify the deviations. If less than 50% matches the pattern, it might be a custom Jira — that's fine, not everything fits." |
| "I don't want to use JTMF" | "Let's try it for the pilot. If it's genuinely worse than Excel after two Jiras, we'll discuss. But the standard test case reuse doesn't work in Excel — that's the main reason to try JTMF." |
| "I already know how to write a plan.md" | "Totally. The standardized prompt is about consistency across the team, not replacing your skill. Try it for one Jira and compare. If your approach is better, we'll adopt yours as the standard." |
