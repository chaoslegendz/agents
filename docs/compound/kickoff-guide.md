# Pilot Kickoff Session — Facilitator Guide

## Logistics

- **Duration:** 30 minutes
- **Attendees:** BSA(s) on pilot Jiras, Dev(s) on pilot Jiras, you (facilitator), optional: scrum master, QA
- **Pre-read:** None. Don't send the full framework docs in advance — it's overwhelming. The session IS the education.
- **Materials:** Screen share with the worked example open, the quick reference card, and the two pilot Jiras in Jira

---

## Before the Session

- [ ] Pilot Jiras are identified (not yet started by dev)
- [ ] JTMF folder created with 10 standard ingestion test cases
- [ ] Pattern file committed to repo
- [ ] Pipeline catalog started (5–10 existing pipelines listed)
- [ ] Worked example reviewed and adjusted for your team's context if needed

---

## Minute-by-Minute Guide

### 0:00–5:00 — Why We're Doing This

**Goal:** Frame the problem, not the solution. Get heads nodding before introducing changes.

Talk track:

> "We've got 150+ Jiras in the pipeline repo and we're nowhere near done. Every Jira right now is a bit of a snowflake — the requirements look different each time, devs interpret Confluence differently, test cases start from scratch every time, and if someone asks 'what was tested for PROJ-089' six months from now, we're digging through Excel files and SharePoint.
>
> Meanwhile, 80% of our pipelines follow the same patterns. We're doing the same work over and over — writing the same ingestion requirements, the same test cases, the same error handling logic — just for different source systems.
>
> So we're going to try something on [1–2] Jiras: standardize the handoffs so the patterns do the heavy lifting and AI tools produce better output. It's not a new process — it's adding structure to what we already do."

**Don't say:** "compound engineering framework," "artifact chain," or any framework-y language. Keep it practical.

---

### 5:00–10:00 — What's Changing (The Three Slides)

**Goal:** Each role hears exactly what changes for them. No more, no less.

Share the quick reference card on screen. Walk through:

**"For BSAs — three changes:"**

> "One, you'll use a Jira description template instead of free-form. It has sections for pattern, what's different, requirements with IDs, and a data spec table. It takes about 15 minutes the first time.
>
> Two, instead of generating all test cases from scratch in Excel, you'll link the standard pattern test cases from JTMF — they're already there, I set them up — and only create new test cases for what's unique to your Jira. That's usually 3–8 test cases instead of 15+.
>
> Three, when you finish testing, you'll post a sign-off comment on the Jira. Takes 5 minutes. It creates the audit trail."

Pause. Ask: "Does that sound reasonable? Questions?"

**"For Devs — three changes:"**

> "One, the Jira description will be structured — you'll get requirement IDs, a data spec table, and a pointer to the closest existing pipeline. Better input than reading Confluence cold.
>
> Two, you'll use a standardized prompt to generate plan.md. You paste in the structured Jira description, reference the pattern file, and reference the closest existing pipeline. The prompt produces a plan that only covers what's different from the standard pattern — not the whole thing from scratch.
>
> Three, when you're done coding, you'll post a Dev Complete comment — what you built, what the BSA should focus on testing, any known limitations. Takes 5 minutes."

Pause. Ask: "Does that sound reasonable? Questions?"

---

### 10:00–20:00 — Walk Through the Worked Example

**Goal:** Make it concrete. Abstract frameworks don't stick. Worked examples do.

Open the worked example on screen. Walk through each step:

**Step 1: The Jira description**

> "Here's what the Jira description looks like for a RiskCalc positions pipeline. Notice — the BSA specifies the pattern [Ingestion], lists what's different [cursor pagination, nested JSON, volume spike], adds only the Jira-specific requirements with IDs, fills in the data spec table, and points to the closest existing pipeline.
>
> The full requirements are still on Confluence. This is the structured version that feeds into everything downstream."

Spend 2–3 minutes on this. Let people read the data spec table. It's the most tangible part.

**Step 2: JTMF test cases**

> "Here are the standard pattern tests — these 10 already exist in JTMF. The BSA just links them to the Jira. Then here are the 7 Jira-specific test cases — pagination, flattening, rate limiting, the things unique to this pipeline.
>
> Total: 17 test cases. The BSA only had to create 7. The other 10 are reused from the standard library."

This is usually the biggest "ah-ha" moment. Emphasize: "These 10 tests get linked to every ingestion pipeline Jira. Created once, used hundreds of times."

**Step 3: The plan.md**

> "Here's what the dev prompt produces. Notice it says 'Follow STD-ING steps for extract/validate/load' for the standard parts and only details the deviations — the cursor pagination, the flattening logic, the rate limit handling.
>
> It also includes testing notes for the BSA at the bottom — what to focus on, what's risky. That feeds into testing."

Don't read the whole plan. Skim. Point out the structure and the REQ ID references.

**Step 4: Dev Complete comment**

> "Quick one — here's the comment the dev posts when done. Requirements implemented, testing focus areas, known limitations. Takes 5 minutes. Gives the BSA exactly what they need to start testing."

**Step 5: Sign-off comment**

> "And here's the sign-off. Requirements coverage table: REQ to TC to result. Evidence linked. Recommendation. This is the thing that answers 'what was tested?' six months from now."

---

### 20:00–25:00 — Logistics and Where to Find Things

**Goal:** Remove friction. Tell people exactly where to go.

> "Here's where everything lives:"

| What | Where |
|------|-------|
| Jira description template | `/docs/templates/jira-description-template.md` in the repo |
| Pattern file (ingestion) | `/docs/patterns/ingestion-pattern.md` in the repo |
| BSA prompts | `/docs/prompts/bsa-prompts-revised.md` in the repo |
| Dev prompts | `/docs/prompts/dev-prompts-revised.md` in the repo |
| Pipeline catalog | `/pipeline-catalog.md` in the repo |
| JTMF standard test cases | [folder name] in JTMF |
| Data classification rules | `/docs/guides/data-classification.md` |

> "[BSA name], I'll sit with you for the first Jira description to answer questions. It should take about 25 minutes together the first time.
>
> [Dev name], the plan.md prompt is in the dev prompts file. Try it in Copilot Chat with Claude. I'm around if you want to do the first one together."

---

### 25:00–30:00 — Questions and Commitment

**Goal:** Surface objections now, not mid-sprint. Get a verbal "I'll try it."

> "A couple things before we wrap:
>
> First — this is a trial. If something doesn't work, we'll adjust after the pilot. I'm not asking you to commit to this forever. I'm asking you to try it on [1–2] Jiras and tell me what works and what doesn't.
>
> Second — the goal is not to add overhead. The template and sign-off comment add maybe 20 minutes total per Jira. The JTMF reuse and standardized plan.md should save more than that. But if it doesn't, that's valid feedback.
>
> We'll do a 15-minute retro when both Jiras are done. I'll ask three questions: what saved time, what added overhead, and what would you change.
>
> Questions?"

**Common objections you might hear:**

| If they say... | Respond with... |
|----------------|-----------------|
| "The template is too rigid for my Jira" | "The 'What's Different' section is exactly for that. Put whatever's unique there. If less than half matches the pattern, tell me — we'll skip the pattern reference for that Jira." |
| "I don't want to learn JTMF right now" | "Fair. Let's try it together on the first Jira. If it's genuinely worse than Excel after that, we'll discuss. The reuse is the reason to try it." |
| "My plan.md approach already works fine" | "I believe you. Try the standardized prompt once and compare. If yours is better, we'll adopt yours as the standard. That's an outcome I'd welcome." |
| "This is extra work" | "Let's track the time. I think the test case reuse and structured plan.md save more than the template and comments cost. If I'm wrong, that's useful data too." |

---

## After the Session

- [ ] Send the one-pagers to the BSA and dev (just their role's one-pager, not the full kit)
- [ ] Schedule 15 minutes with the BSA to co-create the first Jira description
- [ ] Let the dev know you're available for the first plan.md generation if they want support
- [ ] Block 15 minutes for the retro 1–2 weeks out (after both Jiras are done)

---

## Common Facilitator Mistakes to Avoid

1. **Don't present the full framework.** The team doesn't need to know about v1, v2, v3, pressure tests, or scaling theory. They need to know: what template to use, where the prompts are, and how JTMF works.

2. **Don't over-explain the "why."** Five minutes on the problem is enough. If you spend 15 minutes justifying the approach, you'll lose them. Show the worked example instead — it sells itself.

3. **Don't make it mandatory-sounding.** "We're going to try this on 2 Jiras" is very different from "We're rolling out a new framework." The first invites participation. The second triggers resistance.

4. **Don't skip the offer to pair.** "I'll sit with you for the first one" removes the fear of doing it wrong. Most people won't take you up on it, but the offer matters.

5. **Don't send a 20-page doc after the session.** Send only the role-specific one-pager and the quick reference card. The full framework is for you, not for them.
