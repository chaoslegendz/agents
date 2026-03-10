---
name: yaml-metric-design
description: Design or refine a human-readable YAML schema for a metrics-driven demo app.
argument-hint: "[business area or metric scope]"
---

# YAML Metric Design

Use this skill when:
- creating `config/metrics.yaml`
- refining metric names, units, or categories
- deciding which metrics should be visible
- deciding whether a metric belongs in a card or a table

Workflow:
1. Read `context.md`
2. Identify the smallest useful metric set
3. Define business-friendly IDs and labels
4. Keep the YAML structure simple and explicit
5. Add only minimal UI hints when helpful
6. Avoid unnecessary nesting or abstraction

Default outputs:
- recommended metric IDs
- labels
- units
- categories
- descriptions
- minimal UI hints such as `card` or `table`
