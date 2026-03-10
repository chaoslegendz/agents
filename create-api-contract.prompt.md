---
description: "Create a simple API contract for a new feature or service"
agent: BSA
tools: ['codebase']
argument-hint: "[feature or domain]"
---

Create a practical API contract for the requested feature.

Return:
1. endpoint list
2. purpose of each endpoint
3. request shape
4. response shape
5. validation rules
6. error cases
7. sample payloads
8. what should be config-driven versus hardcoded

Rules:
- keep the API simple and consistent
- prefer predictable JSON responses
- avoid over-designing for future needs
- do not implement yet
