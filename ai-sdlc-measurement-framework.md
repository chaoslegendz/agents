# AI in SDLC — Measurement Framework

## Context

This framework is designed for teams in early-stage AI adoption using GitHub Copilot, Claude, Jira, VS Code / Visual Studio, and markdown-based documentation. It assumes a mixed team of developers, QAs, and BSAs at varying comfort levels.

---

## 1. Maturity Model — Know Where You Are

Before measuring ROI, establish where each team sits. This drives which metrics matter *now* vs. later.

| Stage | Description | Focus |
|-------|-------------|-------|
| **L0 — Aware** | Team knows tools exist, hasn't used them meaningfully | Adoption, enablement |
| **L1 — Experimenting** | Individuals using Copilot/Claude ad hoc for simple tasks | Usage volume, comfort |
| **L2 — Integrated** | AI is part of daily workflow (code, tests, docs, reviews) | Productivity, quality |
| **L3 — Optimized** | Team has refined prompts, agents, and feedback loops | ROI, business outcomes |

> **Action:** Tag each team or squad with their current level in a shared tracker. Revisit monthly.

---

## 2. Metric Tiers

### Tier 1 — Adoption (L0–L1 focus)

These are your starting metrics. If you can't show adoption, nothing else matters.

| Metric | Source | How to Capture |
|--------|--------|----------------|
| Copilot active users / total licensed seats | GitHub admin dashboard | Monthly pull from Copilot usage stats |
| Copilot acceptance rate | GitHub Copilot metrics | % of suggestions accepted vs. dismissed |
| Claude conversations per user per week | Claude usage logs / self-report | Track via AI Champions check-in or lightweight survey |
| % of team members who've used AI in the last sprint | Self-report or Jira labels | Add a Jira label (`ai-assisted`) to stories where AI was used |
| Tool usage by role | Manual tagging | Devs vs. QAs vs. BSAs — who's adopting, who's not |

> **Quick win:** Add a `ai-assisted` label in Jira. Ask team members to tag any story where Copilot or Claude contributed. Low effort, high signal.

### Tier 2 — Productivity (L1–L2 focus)

Once adoption is real, measure whether it's actually moving the needle.

| Metric | Source | How to Capture |
|--------|--------|----------------|
| Cycle time (Jira status → Done) | Jira | Compare sprints pre/post AI adoption using Jira board reports or a plugin like ActionableAgile |
| PR open-to-merge time | GitHub | GitHub Insights or a lightweight script against the API |
| PRs per developer per sprint | GitHub | Trending indicator — are devs shipping more? |
| First-time-right rate | Jira | % of stories that don't get reopened or kicked back from QA |
| Time to first commit (new repo / unfamiliar codebase) | GitHub + self-report | Track onboarding scenarios explicitly |
| Documentation turnaround | Markdown PRs in GitHub | Time from "doc needed" to "doc merged" |

> **Baseline now.** Pull 2–3 sprints of historical data from Jira and GitHub *before* expanding AI tooling. You need the "before" picture.

### Tier 3 — Quality (L2 focus)

Speed without quality is just faster failure.

| Metric | Source | How to Capture |
|--------|--------|----------------|
| Defect escape rate | Jira (bugs tagged by environment found) | Bugs found in prod vs. caught in dev/QA |
| Code review turnaround | GitHub PR reviews | Time from PR opened to first review comment |
| Test coverage delta | CI/CD pipeline (e.g., SonarQube, Jest, etc.) | Track coverage % over time per repo |
| AI-generated code defect rate | Jira + GitHub | Tag PRs that were primarily AI-generated; track bugs linked to those PRs |
| Rework ratio | Jira | Stories reopened / total stories closed per sprint |

> **Watch for:** Quality regression masked by speed. If cycle time drops but defect escape rate climbs, AI is creating tech debt, not value.

### Tier 4 — Business ROI (L2–L3 focus)

This is what you present to leadership.

| Metric | Formula / Approach | Notes |
|--------|-------------------|-------|
| Developer hours reclaimed | (Avg time saved per task × AI-assisted tasks per sprint × sprints) | Use conservative estimates — 15–20% time savings is defensible at L1–L2 |
| Cost avoidance | Hours reclaimed × blended fully-loaded rate | Frame as "equivalent headcount" not "we can cut people" |
| Time-to-market acceleration | Sprint velocity trend (story points per sprint, pre vs. post) | Normalize for team size changes |
| Regulatory delivery acceleration | Days saved on reporting cycles (SA-CCR, CVA, FRTB deliverables) | High-impact framing for your domain — regulatory deadlines don't move |
| Incident reduction | Production incidents per release, trended | Lagging indicator but powerful for ROI narrative |

---

## 3. Data Collection Plan

### What you can get automatically

- **GitHub Copilot dashboard** — acceptance rate, active users, languages used
- **GitHub API** — PR velocity, merge times, commit frequency
- **Jira API / dashboards** — cycle time, rework, defect escape (requires consistent labelling)
- **CI/CD pipeline** — test coverage, build pass rates

### What requires manual effort (for now)

- **Claude usage** — self-reported or tracked via AI Champions monthly check-in
- **Qualitative wins** — "best use case of the sprint" captured in retros or a shared markdown log
- **Role-level segmentation** — tagging usage by dev / QA / BSA

### Recommended cadence

| Activity | Frequency | Owner |
|----------|-----------|-------|
| Pull Copilot usage stats | Monthly | AI Champion or team lead |
| Update Jira `ai-assisted` label compliance | Sprint review | Scrum master |
| AI ROI scorecard update | Monthly | AI Champion |
| Qualitative win capture | Every sprint retro | Whole team |
| Leadership ROI summary | Quarterly | You / AI Champions lead |

---

## 4. Jira Label Convention

Minimal-effort tagging that powers most of the analysis above.

| Label | When to Use |
|-------|-------------|
| `ai-assisted` | Any story where Copilot or Claude contributed meaningfully |
| `ai-generated-code` | PR is majority AI-generated (enables quality tracking) |
| `ai-generated-test` | Test cases or test code generated with AI |
| `ai-generated-doc` | Documentation drafted or structured with AI |

> Keep it simple. Four labels. If the team won't use them, you won't get data.

---

## 5. Scorecard Template

Use this monthly per team or squad. Can live as a markdown file in the repo or a shared sheet.

```
## AI Usage Scorecard — [Team Name] — [Month YYYY]

### Maturity Level: L[ ]

### Adoption
- Copilot active users: ____ / ____ licensed
- Copilot acceptance rate: ____%
- Claude conversations (approx): ____ / week across team
- Stories tagged `ai-assisted`: ____ / ____ total stories (___%)

### Productivity
- Avg cycle time this month: ____ days (prev: ____ days)
- PRs merged per dev: ____ (prev: ____)
- First-time-right rate: ____% (prev: ___%)

### Quality
- Defect escape rate: ____% (prev: ___%)
- Rework ratio: ____% (prev: ___%)
- Test coverage: ____% (prev: ___%)

### Wins
- Best AI use case this sprint:
- Biggest friction or failure:

### Estimated Hours Saved: ____
```

---

## 6. Getting Started Checklist

For teams at L0–L1 (which is where "still learning" lives):

1. **Baseline your current metrics** — Pull 2–3 sprints of Jira cycle time, PR merge time, defect rates. You need the "before."
2. **Introduce the four Jira labels** — Announce at next sprint planning. Keep it voluntary at first.
3. **Assign one AI Champion per squad** — They own the monthly scorecard and qualitative win capture.
4. **Start the scorecard** — Even if half the fields are blank. The act of tracking creates accountability.
5. **Set a 90-day checkpoint** — Review adoption numbers, identify blockers, adjust.
6. **Don't chase ROI yet** — At L0–L1, the goal is adoption and habit formation. ROI math comes at L2.

---

## 7. Anti-Patterns to Avoid

- **Measuring lines of code** — Copilot inflates this metric. It tells you nothing about value.
- **Mandating AI usage** — Forced adoption creates resentment and junk data. Enable, don't mandate.
- **Skipping the baseline** — Without pre-AI metrics, your ROI story is anecdotal.
- **Over-instrumenting too early** — Four Jira labels and a monthly scorecard is enough at L1. Don't build a dashboard before you have data worth dashboarding.
- **Ignoring qualitative signal** — "Claude helped me understand the SA-CCR netting logic in 10 minutes instead of 2 hours" is a data point. Capture it.
