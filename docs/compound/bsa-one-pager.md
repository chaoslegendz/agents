# What Changes for Me: BSA

## One-Sentence Summary
You'll use a structured Jira description template instead of free-form, inherit standard test cases from JTMF instead of generating everything from scratch, and post a sign-off comment when testing is done.

---

## Your Workflow: Before vs. After

| Step | Before | After | More Work? |
|------|--------|-------|------------|
| **Write requirements** | Requirements Agent → Confluence (free-form) | Requirements Agent → Confluence + **fill in Jira description template** | ~15 min extra for the structured Jira. Gets faster after the first one. |
| **Create test cases** | Testing Agent → Excel (all from scratch every time) | **Link standard tests** from JTMF (5 min) + generate only **Jira-specific tests** (10–15 min) | Less work. You're reusing standard tests, not recreating them. |
| **Hand off to dev** | Dev reads Confluence, interprets on their own | Dev reads the **structured Jira** (with requirement IDs and data spec) | No extra BSA effort. Dev gets better input. |
| **Execute tests** | Manual + M365/Copilot for analysis | Same — manual + M365/Copilot for analysis | No change. |
| **Upload evidence** | Excel status column + SharePoint (unlinked) | Attach evidence to **JTMF test execution** (or SharePoint with naming convention) | Comparable effort, but evidence is now linked to specific test cases. |
| **Close Jira** | Move to Done | Post a **sign-off comment** (~5 min), then move to Done | ~5 min extra. Creates the audit trail. |

**Net effect:** Slightly more structure upfront, significantly less test case creation, proper traceability at the end.

---

## The Three Things You'll Do Differently

### 1. Fill in the Jira Description Template

Instead of free-form Jira descriptions, you'll use a template with these sections:

- **Pattern:** Which pipeline pattern this follows (Ingestion, Transformation, etc.)
- **What's Different:** Only the deviations from the standard pattern
- **Jira-Specific Requirements:** New requirements with IDs (REQ-PROJ-###-###). Don't repeat standards — just write "Inherits: STD-ING-001 through STD-ING-008"
- **Data Specification:** Table of fields, sources, transformations, validations
- **Similar Existing Pipeline:** The closest pipeline from the catalog

The template is in `/docs/templates/jira-description-template.md`. Copy the structure into your Jira description.

**Tip:** The "Similar Existing Pipeline" field is the most important one for dev productivity. Check the pipeline catalog before filling this in.

### 2. Use JTMF Instead of Standalone Excel

For test cases:
- **Standard pattern tests** (STC-ING-001 through STC-ING-010) already exist in JTMF. You just link them to your Jira. ~5 minutes.
- **Jira-specific tests** (TC-PROJ-###-###) are generated for deviations only. Typically 3–8 test cases. Enter them in JTMF linked to the Jira.

During test execution, mark pass/fail in JTMF and attach evidence there instead of in a separate SharePoint folder.

**Why this is better:** You're not recreating the same 10 standard tests every time. Over 150 Jiras, that's ~1,500 test cases you don't have to write.

### 3. Post a Sign-Off Comment Before Closing

When testing is complete, generate a sign-off comment using the prompt in `/docs/prompts/bsa-prompts-revised.md` and post it on the Jira. It includes:
- Pass/fail summary
- Requirements coverage table (which REQ was tested by which TC)
- Evidence location
- Recommendation (Pass / Conditional Pass / Fail)

**Why this matters:** When someone asks "what was tested for PROJ-187?" in 6 months, the answer is right in the Jira comment. No digging through Excel files or SharePoint.

---

## What Stays Exactly the Same

- Requirements Agent still generates content on Confluence
- You still own the Confluence page (full requirements live there)
- Manual test execution doesn't change
- M365 Copilot and GitHub Copilot for data analysis doesn't change
- Your relationship with the dev and how you communicate doesn't change

---

## Quick Reference: Requirement IDs

| Type | Convention | Example |
|------|-----------|---------|
| Standard pattern requirement (already defined) | STD-[PATTERN]-### | STD-ING-001 |
| Your Jira-specific requirement (you create these) | REQ-[PROJ-###]-### | REQ-PROJ-187-001 |
| Your Jira-specific edge case | REQ-[PROJ-###]-N## | REQ-PROJ-187-N01 |

**Rule:** Don't repeat standard requirements. Just write "Inherits: STD-ING-001 through STD-ING-008." Only add IDs for what's new.

---

## Data Classification Reminder

Before every AI prompt:
- Replace client names → `[CLIENT_A]`
- Replace account numbers → `[ACCT_001]`
- Never include credentials or production endpoints
- Keep regulatory references intact
