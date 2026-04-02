# Dev Prompt Library

## Tool Access

Devs have access to:
- **GitHub Copilot Inline** (VS Code / Visual Studio) — autocomplete, code suggestions, inline chat
- **GitHub Copilot Chat** (Claude, Codex, ChatGPT models) — conversational, multi-file context, structured generation
- **300 premium tokens/month** — Claude and Codex consume premium tokens. ChatGPT and Copilot inline do not.

**Token budget strategy:**
- Use **Copilot Inline** (free) for: autocomplete, small edits, unit test stubs, boilerplate
- Use **Copilot Chat with ChatGPT** (free) for: simple questions, syntax help, quick explanations
- Use **Copilot Chat with Claude/Codex** (premium) for: design doc generation, complex logic with upstream context, cross-artifact analysis, PR descriptions from the compound chain
- The highest-ROI use of premium tokens is **consuming upstream artifacts to generate structured output** — that's where the compound effect lives

**Important:** All AI usage is enterprise-governed. Do not use public Claude, ChatGPT, or any non-approved AI interface.

---

## Prompt: Generate Design Artifact from Requirements

**Token cost:** Premium (use Claude or Codex)
**When to use:** Requirements.md is committed and you're starting design work.

```
Generate a design artifact for this feature.

Jira: [PROJ-###]

CONTEXT — include ONLY these sections from requirements.md:
--- START ACCEPTANCE CRITERIA ---
[Paste acceptance criteria section only — REQ-### items and REQ-N## items]
--- END ACCEPTANCE CRITERIA ---

--- START DATA REQUIREMENTS ---
[Paste data requirements table only]
--- END DATA REQUIREMENTS ---

INSTRUCTIONS:
- Create a DES-### ID for each design element
- Map every REQ-### to at least one DES-### in a traceability table
- For each component affected, specify what changes and the scope (new/modified/refactored)
- Explicitly describe error handling for each API or interface change — include specific HTTP status codes or error codes, not "handle gracefully"
- Include a "Test Guidance for QA" section: what's risky, new, or fragile. Be specific enough that QA can generate test cases without scheduling a meeting.
- Include an "Operability Notes" section: how to monitor this in production, likely failure modes, rollback approach, new config keys
- If any REQ-### is ambiguous or unimplementable as written, flag it as an issue rather than assuming what the BSA meant

DATA CLASSIFICATION: [Internal]. Use placeholder names for any data elements. Reference config keys by name, never include actual values.

Do not repeat the requirements — reference them by REQ-### ID only.
Output in markdown matching the design.md template format.
```

---

## Prompt: Implement with Upstream Context

**Token cost:** Premium (use Claude or Codex for complex logic; Copilot inline for straightforward implementation)
**When to use:** Implementing a specific component. You have both requirements and design artifacts.

```
I'm implementing [specific component/module] for Jira [PROJ-###].

CONTEXT — include ONLY the relevant items:
--- RELEVANT ACCEPTANCE CRITERIA ---
[Paste only the REQ-### items this component addresses — not the full requirements.md]
--- END ---

--- RELEVANT DESIGN ELEMENT ---
[Paste only the DES-### section for this component — not the full design.md]
--- END ---

EXISTING CODE CONTEXT:
[Paste relevant existing code, interface definitions, or class signatures that this component interacts with — keep it focused]

INSTRUCTIONS:
- Implement [component] following these patterns: [your team's coding standards — e.g., "repository pattern," "service layer with dependency injection," "Pydantic models for validation"]
- Error handling: [approach — e.g., "raise custom exceptions with error codes matching DES-E## IDs," "return Result objects"]
- Logging: [requirements — e.g., "structured logging with correlation ID," "log at INFO for business events, WARN for recoverable errors, ERROR for failures"]
- Add comments referencing DES-### and REQ-### for traceability — e.g., `# Implements REQ-001 / DES-001`
- Flag any design gaps or ambiguities you encounter — don't guess silently

Do not generate boilerplate or placeholder code. If a section of the design is unclear, say so rather than producing something that looks right but isn't.
```

---

## Prompt: Generate PR Description

**Token cost:** Premium (Claude or Codex produce better structured output)
**When to use:** PR is ready. You want a description that links back to the artifact chain.

```
Generate a PR description for Jira [PROJ-###].

Requirements addressed: [List REQ-### IDs — e.g., REQ-001, REQ-002, REQ-N01]
Design elements implemented: [List DES-### IDs — e.g., DES-001, DES-002]
Files changed:
[Paste file list or diff summary — not the full diff]

Key implementation decisions:
[1–2 sentences on any notable choices made during implementation]

Generate a PR description with these sections:
1. **Summary** — what changed and why (one paragraph, reference Jira ticket)
2. **Changes** — bullet list mapped to REQ/DES IDs
3. **How to Test** — specific steps for the reviewer, reference TC-### from test plan if available
4. **Deployment Notes** — any migration, config, or sequencing considerations
5. **Rollback** — can this be rolled back independently? Any dependencies?
6. **Known Limitations** — anything deferred or out of scope

Keep it under 30 lines. Link to Jira [PROJ-###].
```

---

## Prompt: Generate Unit Tests from Implementation

**Token cost:** Free (use Copilot Inline or Chat with ChatGPT)
**When to use:** Code is written, you need unit test coverage.

```
Generate unit tests for the following code.

[Paste the function/class/module to test]

Requirements traced: [REQ-### IDs this code implements]

Generate tests covering:
1. Happy path for each REQ-### this code addresses
2. Edge cases from the design doc: [list DES-E## IDs if applicable]
3. Error/exception handling paths
4. Boundary values for input parameters

Framework: [pytest / Jest / xUnit / NUnit — specify yours]
Naming convention: test_[scenario]_[expected_result]
Include REQ-### and DES-### in test docstrings for traceability.
Use arrange-act-assert pattern.
Mock external dependencies — [list what should be mocked].
```

---

## Prompt: Code Review Assist

**Token cost:** Free (use ChatGPT) or Premium (use Claude for deeper analysis)
**When to use:** Reviewing someone else's PR against the artifact chain.

```
Review this code change against the upstream artifacts.

PR diff or key changes:
[Paste the diff or describe the changes]

Requirements this PR should address:
[Paste relevant REQ-### items from requirements.md]

Design this PR should follow:
[Paste relevant DES-### items from design.md]

Check for:
1. Does the implementation satisfy each REQ-### listed? Flag any gaps.
2. Does the error handling match what's specified in the design (DES-E## items)?
3. Are there code paths not covered by any requirement (scope creep or gold-plating)?
4. Are REQ/DES references in code comments accurate?
5. Are there testability concerns — anything that would make QA's job harder?

Be specific. "Looks good" is not useful. "REQ-003 is partially implemented — the validation for [field] is missing" is useful.
```

---

## Prompt: Diagnose Bug with Artifact Context

**Token cost:** Premium if complex; Free for simple bugs
**When to use:** Bug reported in Jira with reference to the original feature artifacts.

```
Help me diagnose this bug.

Bug Jira: [PROJ-###]
Parent feature Jira: [PROJ-###]

Bug description:
[Paste Jira bug description]

Relevant requirements:
[Paste the REQ-### items related to the area where the bug occurs]

Relevant design:
[Paste the DES-### items, especially edge cases and error handling]

Relevant code:
[Paste the function or module where the bug likely lives]

Questions:
1. Based on the requirements and design, is this a requirements gap (missing scenario), a design gap (unhandled edge case), or an implementation bug?
2. What's the most likely root cause?
3. Suggest a fix approach
4. What test case (TC-###) should have caught this? If none exists, what TC should be added?
```

---

## Copilot Inline Tips (VS Code / Visual Studio)

These don't consume premium tokens and are your highest-volume AI interaction.

1. **Keep the feature folder open in your workspace.** VS Code's Copilot uses open files for context. If `/features/[feature-name]/requirements.md` and `design.md` are open tabs, Copilot's suggestions will be more aligned.

2. **Use comment-driven development.** Write a comment referencing the REQ/DES ID before writing the function:
   ```python
   # Implements REQ-001 / DES-001: Calculate netting set exposure
   # GIVEN a list of trades in the same netting set
   # WHEN the SA-CCR calculation is triggered
   # THEN return the aggregate replacement cost
   def calculate_netting_set_exposure(trades: list[Trade]) -> Decimal:
   ```
   Copilot will use this as a strong context signal for its suggestions.

3. **Use Copilot inline for repetitive patterns.** Once you've written one implementation that follows your team's patterns, Copilot will replicate the pattern for similar cases. Write the first one manually with care, then let Copilot accelerate the rest.

4. **Use `/explain` and `/fix` commands in Copilot Chat** (free tier) for quick questions about existing code. Save premium tokens for structured generation tasks.
