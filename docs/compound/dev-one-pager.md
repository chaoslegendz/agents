# What Changes for Me: Dev

## One-Sentence Summary
You'll get a structured Jira description with requirement IDs and a data spec instead of free-form Confluence, use a standardized prompt to generate plan.md, and post a Dev Complete comment when you're done.

---

## Your Workflow: Before vs. After

| Step | Before | After | More Work? |
|------|--------|-------|------------|
| **Understand requirements** | Read Confluence page, interpret free-form text | Read **structured Jira description** with REQ IDs, data spec table, and "Similar Existing Pipeline" reference | Less ambiguity. The structured format is easier to consume. |
| **Create plan.md** | Copy text from Confluence, write your own prompt, variable quality | Use a **standardized prompt** with the Jira description + pattern file + closest pipeline reference | Same effort, better output. The prompt does the structuring for you. |
| **Generate code** | Developer Agent consumes plan.md → iterate | Same — Developer Agent consumes plan.md → iterate | No change. |
| **Complete and hand off** | Move Jira to Dev Complete | Post a **Dev Complete comment** (~5 min) listing what was implemented, then move to Dev Complete | ~5 min extra. Gives the BSA clear testing guidance. |

**Net effect:** Better input, more consistent plan.md, one structured comment at the end.

---

## The Three Things You'll Do Differently

### 1. Read the Structured Jira Instead of Confluence

The BSA will fill in a Jira description template with:
- **Pattern:** Which pipeline pattern this follows
- **What's Different from the Standard Pattern:** Only the deviations
- **Jira-Specific Requirements:** With IDs (REQ-PROJ-###-###)
- **Data Specification:** Table of fields, sources, types, transformations, validations
- **Similar Existing Pipeline:** The closest pipeline from the catalog — go look at its code

The full requirements still live on Confluence, but for plan.md generation, the structured Jira description is your starting point. It's designed to be pasted directly into the plan.md prompt.

### 2. Use the Standardized plan.md Prompt

Instead of writing your own prompt from scratch, use the one in `/docs/prompts/dev-prompts-revised.md`. The key inputs:

1. **Jira description** (paste the structured sections)
2. **Pattern file** (paste or reference `/docs/patterns/ingestion-pattern.md` — the AI agent should know the standard steps)
3. **Closest existing pipeline** (from the Jira description — open that pipeline's code as reference context)
4. **Relevant known issues** (check `/known-issues.md` for the source system)

The prompt generates a plan.md that:
- Only specifies deviations from the standard pattern (not the whole thing from scratch)
- References REQ-PROJ-###-### IDs (so there's traceability)
- Includes testing notes for the BSA (so they know what to focus on)

**Token cost:** This is a premium token prompt (Claude or Codex). It's your highest-value use of the 300 monthly premium tokens.

**Tip:** The plan.md is ephemeral — use it with the developer agent, then discard. Don't commit it to the repo unless the Jira requires audit traceability.

### 3. Post a Dev Complete Comment

When you're done coding and ready for testing, post a structured comment on the Jira:

```
## Dev Complete — PROJ-###

### What Was Built
[2–3 sentences]

### Requirements Implemented
| REQ | Title | Status | Notes |
|-----|-------|--------|-------|
| STD-ING-001 through 008 | Standard ingestion | ✅ | No deviations |
| REQ-PROJ-###-001 | [specific req] | ✅ | |
| REQ-PROJ-###-N01 | [edge case] | ✅ | [any notes] |

### Testing Focus Areas
[What the BSA should pay attention to — risky areas, edge cases, things
you're not 100% sure about]

### Known Limitations
[Anything not implemented or deferred]

### Configuration / Setup
[New config files, environment variables, setup steps for testing]
```

Use the prompt in `/docs/prompts/dev-prompts-revised.md` to generate this. It takes ~5 minutes and gives the BSA a clear starting point for testing.

---

## What Stays Exactly the Same

- Developer Agent workflow doesn't change (plan.md → agent → code → iterate)
- Copilot Inline in VS Code doesn't change
- How you write code, review code, and submit PRs doesn't change
- Your iteration loop with the developer agent doesn't change

---

## Token Budget Tip

You have 300 premium tokens/month. Recommended usage for this workflow:

| Task | Model | Cost |
|------|-------|------|
| Generate plan.md from Jira + pattern | Claude or Codex | Premium ← highest ROI |
| Review agent output against requirements | Claude (complex) or ChatGPT (simple) | Premium or Free |
| Generate Dev Complete comment | ChatGPT | Free |
| Inline code completion | Copilot Inline | Free |
| Unit tests | Copilot Inline or ChatGPT | Free |
| Syntax questions, explanations | ChatGPT | Free |

**Rule of thumb:** Spend premium tokens on plan.md generation and complex code review. Everything else works fine on free tier.

---

## Quick Reference: What Goes in Your plan.md

| Section | What It Is | Where It Comes From |
|---------|-----------|-------------------|
| Overview | 2–3 sentences on what this pipeline does | Jira description |
| Requirements Addressed | List of STD-### and REQ-PROJ-###-### | Jira description |
| Implementation Steps | Only deviations from pattern. Standard steps: "Follow STD-ING for [phase]" | Pattern file + Jira deviations |
| Data Handling | Source-specific data flow | Jira data spec table |
| Edge Cases | How each REQ-N## is handled | Jira specific requirements |
| Testing Notes for BSA | What's risky, what to focus on | Your judgment from implementation |

---

## Data Classification Reminder

Before every AI prompt:
- Replace client names → `[CLIENT_A]`
- Replace account numbers → `[ACCT_001]`
- Never include credentials, connection strings, or production endpoints
- Reference config keys by name: `RISKCALC_API_TOKEN` (not the actual token)
- Keep regulatory references intact
