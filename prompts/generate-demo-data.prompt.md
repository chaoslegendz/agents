---
description: "Generate starter YAML config and JSON sample data"
agent: BSA
tools: ['agent', 'codebase']
argument-hint: "[business domain or metric scope]"
---

Use the **Sample Data Designer** helper agent.

Task:
- read `context.md`
- design a small but realistic metric set
- produce a recommended `config/metrics.yaml`
- produce a matching `data/metrics.json`
- keep the demo understandable and business-friendly

Return only:
1. the full YAML
2. the full JSON
3. a short explanation of why these fields were chosen

Do not implement application code.
