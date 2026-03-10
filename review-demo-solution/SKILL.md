---
name: review-demo-solution
description: Review the current solution for correctness, simplicity, and live-demo readiness.
argument-hint: "[backend|frontend|full solution]"
---

# Review Demo Solution

Use this skill when:
- checking whether the solution is ready to demo
- looking for missing validation or edge cases
- deciding what is must-fix versus optional polish

Workflow:
1. Compare the implementation to `context.md`
2. Check YAML and JSON assumptions
3. Check API response shape and failure behavior
4. Check frontend clarity
5. Identify over-engineering
6. Separate must-fix issues from nice-to-haves

Output:
- must-fix issues
- nice-to-have improvements
- what is already acceptable for the demo
