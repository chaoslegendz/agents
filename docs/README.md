# Compound Engineering Kit

## What Is This?

A ready-to-use framework for compound engineering — chaining AI-assisted outputs across BSAs, Devs, QA/QE, and Prod Support so that each step in the SDLC builds on the last. Instead of each person using AI in isolation, structured artifacts flow through the lifecycle, with each role's AI-assisted output becoming the input for the next.

## Who Is This For?

Teams using:
- **Jira** for feature and change tracking
- **GitHub Copilot** (Chat + Inline) with Claude, Codex, and ChatGPT models
- **M365 Copilot** (with web access) for BSAs and knowledge workers
- **VS Code or Visual Studio** as IDE
- **Enterprise-governed AI** (no public Claude or ChatGPT interfaces)

## File Map

```
compound-engineering-kit/
│
├── README.md                          ← You are here
│
├── templates/                         ← Artifact templates for the chain
│   ├── requirements.md                ← BSA: acceptance criteria, data requirements
│   ├── design.md                      ← Dev: implementation approach, traceability
│   ├── test-plan.md                   ← QA: test cases, gap report, traceability
│   ├── runbook.md                     ← Prod Support: operations, monitoring, rollback
│   ├── chain-retro.md                 ← All: post-release retrospective
│   └── decisions.md                   ← All: key decisions and rationale log
│
├── prompts/                           ← Role-specific prompt libraries
│   ├── bsa-prompts.md                 ← Requirements generation, validation, regulatory extraction
│   ├── dev-prompts.md                 ← Design generation, implementation, PR descriptions
│   ├── qa-prompts.md                  ← Test plan generation, gap analysis, automation
│   ├── prod-support-prompts.md        ← Runbook generation, incident analysis, alert playbooks
│   └── cross-role-prompts.md          ← Consistency checks, traceability matrix, chain health
│
└── guides/                            ← Reference guides
    ├── data-classification.md         ← What data can/cannot be used with AI tools
    ├── tool-guide.md                  ← Which AI tool to use when + token budget management
    └── jira-conventions.md            ← Jira statuses, labels, sub-task patterns, handoff comments
```

## How It Works

```
       ┌──── Requirements Gap Report ◄────┐
       │                                   │
       ▼                                   │
      BSA                Dev              QA/QE          Prod Support
       │                  │                │                │
       ▼                  ▼                ▼                ▼
  requirements.md ───► design.md ──────► test-plan.md ──► runbook.md
       (REQ-###)        (DES-###)        (TC-###)         (RB-###)
                          ▲                                │
                          │                                │
                          └──── Operability Review ◄───────┘
```

Each artifact:
- Uses **traceability IDs** (REQ → DES → TC → RB) that link across the chain
- Has a **chain-meta header** with classification and upstream version tracking
- Includes a **validation checklist** that gates the Jira status transition
- Is committed to a **feature folder** in the repo: `/features/[feature-name]/`

## Chain Tiering

Not every change needs the full chain.

| Tier | When | Artifacts |
|------|------|-----------|
| **Full** | New feature, regulatory change, data pipeline change | All four + feature folder |
| **Light** | Significant bug fix, enhancement | requirements.md (brief) + test-plan.md |
| **Skip** | Config change, one-liner, dependency bump | PR description only |

Classify at sprint planning. When in doubt, go Light.

## Getting Started

### Week 1 — Foundation
1. Copy this kit's `templates/`, `prompts/`, and `guides/` folders into your repo under `/docs/`
2. Review the [Data Classification Guide](guides/data-classification.md) with your team
3. Review the [Tool Guide](guides/tool-guide.md) — especially the token budget strategy
4. Define tier classifications for current sprint stories
5. Identify one pilot feature and one executive sponsor

### Week 2 — Pilot (Start from the Middle)
1. Dev + QA run the first chain on the pilot feature (design.md → test-plan.md)
2. BSA validates and back-fills requirements.md (review, don't author from scratch)
3. Create the feature folder in the repo
4. QA produces the first Requirements Gap Report

### Week 3 — Extend the Chain
1. Prod Support generates runbook.md from upstream artifacts
2. Prod Support produces the first Operability Review
3. Run the cross-artifact consistency check
4. Generate the first traceability matrix

### Week 4 — Retro and Iterate
1. Run the Chain Retrospective (15 min in sprint retro)
2. Update templates and prompts based on findings
3. Select 2–3 features for next sprint, assign tiers
4. Brief the executive sponsor on results

## Key Principles

1. **Artifacts are the baton.** The compound effect comes from structured handoffs, not from individual AI usage.
2. **Start from the middle.** Don't wait for BSA to author first. Dev + QA chain first, BSA validates.
3. **Feedback loops matter more than forward flow.** The Requirements Gap Report (QA → BSA) and Operability Review (Prod Support → Dev) are where quality compounds.
4. **Classify data before every prompt.** Enterprise governance is non-negotiable.
5. **Spend premium tokens on compound tasks.** Use free-tier tools for everything that doesn't consume upstream artifacts.
6. **Templates evolve.** Update them based on what you learn. Commit changes back.
