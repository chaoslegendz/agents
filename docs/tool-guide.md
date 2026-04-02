# AI Tool Guide

## Approved Tools

All AI usage is enterprise-governed. These are the only approved AI interfaces:

| Tool | Access | Token Cost | Best For |
|------|--------|------------|----------|
| **GitHub Copilot Inline** (VS Code / Visual Studio) | All Devs, QA with IDE access | Free (no premium tokens) | Code autocomplete, inline suggestions, small edits |
| **GitHub Copilot Chat — ChatGPT** | All Devs, QA, BSAs | Free (no premium tokens) | Simple questions, syntax help, explanations, formatting |
| **GitHub Copilot Chat — Claude** | All Devs, QA, BSAs | Premium (counts against 300/month) | Complex analysis, multi-document context, structured generation |
| **GitHub Copilot Chat — Codex** | All Devs, QA, BSAs | Premium (counts against 300/month) | Code generation, technical analysis, structured output |
| **M365 Copilot** | All BSAs (+ others as provisioned) | Free (separate licensing) | Research with web access, drafting in Word/Excel/Outlook, email summarization |

**Do NOT use:** Public Claude (claude.ai), public ChatGPT (chat.openai.com), or any non-approved AI interface.

---

## Token Budget: 300 Premium Tokens / Month

Each team member has 300 premium tokens per month for GitHub Copilot Chat (Claude and Codex models). This is a shared constraint — use them wisely.

### High-ROI Uses of Premium Tokens (Claude/Codex)

These are the compound chain tasks — where consuming upstream artifacts produces multiplicative value:

| Task | Role | Why It's Worth Premium Tokens |
|------|------|-------------------------------|
| Generate design.md from requirements | Dev | Consumes structured requirements to produce traceable design |
| Generate test-plan.md from requirements + design | QA | Consumes two upstream artifacts, produces gap report + test cases |
| Generate runbook.md from full chain | Prod Support | Consumes three upstream artifacts, produces operational docs |
| Requirements Gap Report | QA | Cross-artifact analysis that catches issues before they're bugs |
| Cross-artifact consistency check | Any | Multi-document analysis for release gate |
| Post-incident chain analysis | Prod Support | Traces incidents back through four artifacts |
| PR description from artifact chain | Dev | Links code changes to requirements and design traceability |

### Free-Tier Tasks (ChatGPT / Copilot Inline / M365 Copilot)

These tasks work well without premium models:

| Task | Tool | Why Free Tier Is Fine |
|------|------|----------------------|
| Code autocomplete | Copilot Inline | Single-file context, pattern matching |
| Unit test generation | Copilot Inline | Code-level context only |
| Syntax questions | Copilot Chat (ChatGPT) | No upstream artifacts needed |
| Test case expansion | Copilot Chat (ChatGPT) | Refining existing content, not generating from chain |
| Automation scaffolding | Copilot Chat (ChatGPT) | Template-based generation |
| Alert playbook expansion | Copilot Chat (ChatGPT) | Single-section enhancement |
| Runbook section updates | Copilot Chat (ChatGPT) | Incremental changes |
| Email/communication drafts | M365 Copilot | Natural language, no code |
| Research and web lookups | M365 Copilot | Web access, document summarization |
| Meeting note summarization | M365 Copilot | Works natively in Outlook/Teams |
| Bug explanation / diagnosis | Copilot Chat (ChatGPT) | Unless tracing through the artifact chain |

### Monthly Token Budget by Role (Recommended)

These are suggested allocations, not hard limits. Adjust based on sprint workload.

| Role | Recommended Premium Token Usage | Primary Premium Tasks |
|------|--------------------------------|----------------------|
| **BSA** | 30–50 tokens/month | Requirements generation is often done via M365 Copilot (free). Premium reserved for complex regulatory extraction. |
| **Dev** | 100–150 tokens/month | Design artifact generation, PR descriptions from chain, complex implementation with upstream context |
| **QA** | 80–120 tokens/month | Test plan generation from upstream artifacts, gap analysis |
| **Prod Support** | 30–50 tokens/month | Runbook generation (one big prompt per feature), post-incident chain analysis |

> If the team consistently hits the 300 token ceiling, track which tasks consumed the most tokens in the Chain Retro. This data supports the case for raising the allocation.

---

## Tool Selection Decision Tree

```
Is the task about consuming upstream artifacts to generate structured output?
├── YES → Use GitHub Copilot Chat with Claude or Codex (premium)
└── NO
    ├── Is it inline code writing or autocomplete?
    │   └── YES → Use Copilot Inline (free)
    ├── Is it a simple question, explanation, or refinement?
    │   └── YES → Use Copilot Chat with ChatGPT (free)
    ├── Is it drafting communication, email, or working in Word/Excel?
    │   └── YES → Use M365 Copilot (free)
    └── Is it research requiring web access?
        └── YES → Use M365 Copilot (free — has web access)
```

---

## Context Compression Rules

Premium tokens are consumed based on input + output size. Compress your context to get more value per token.

**Do:**
- Extract only the sections specified in each prompt (e.g., "acceptance criteria only" — not the full requirements.md)
- Summarize meeting notes and email threads into 3–5 key points before pasting
- Reference upstream items by ID when downstream artifacts exist (e.g., "REQ-001" instead of pasting the full criterion again)

**Don't:**
- Paste entire Jira ticket histories (summarize the 2–3 key comments)
- Include resolved open questions (only include current open items)
- Paste full code files when only one function is relevant
- Include business context sections when generating test cases (QA doesn't need the "why" — just the "what")

---

## Model Selection Within GitHub Copilot Chat

When GitHub Copilot Chat offers a model selector:

| Model | When to Choose |
|-------|---------------|
| **Claude** | Best for structured document generation, multi-step reasoning, cross-artifact analysis. Preferred for design docs, test plans, gap reports, and consistency checks. |
| **Codex** | Best for code-heavy tasks — implementation from specs, automation scaffolding, code review, refactoring suggestions. |
| **ChatGPT** | Use as the default free-tier option. Good for explanations, simple generation, refinement of existing content. |

> When in doubt and the task is compound chain work, use Claude. When the task is primarily code, use Codex. For everything else, start with ChatGPT.
