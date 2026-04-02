# Data Classification Guide

## Purpose

All AI usage at the bank is enterprise-governed. This guide defines what data can and cannot be used with approved AI tools (GitHub Copilot, M365 Copilot) and the redaction conventions for the compound engineering artifact chain.

## Classification Levels

| Classification | Definition | AI Tool Rules |
|---------------|------------|---------------|
| **Public** | Non-sensitive. Open-source references, public documentation, general technology concepts | Can be used with any approved AI tool without redaction |
| **Internal** | Bank-internal but non-restricted. Architecture, process, feature requirements, most SDLC artifacts | Can be used with approved AI tools. Redact all client identifiers, account numbers, and PII using placeholder conventions below |
| **Restricted** | Regulatory submissions, production credentials, client-identifiable data, production database contents, SOC/security audit findings | Do NOT feed to any AI tool. Work with this data in approved bank systems only. Artifacts should reference restricted data by variable name or placeholder — never include it |

## Redaction Conventions

Use these placeholders consistently across all artifacts and prompts:

| Data Type | Placeholder Convention | Example |
|-----------|----------------------|---------|
| Client names | `[CLIENT_A]`, `[CLIENT_B]`, `[CLIENT_C]` | "Process trades for [CLIENT_A]" |
| Account numbers | `[ACCT_001]`, `[ACCT_002]` | "Query account [ACCT_001]" |
| Trade IDs | `[TRADE_001]`, `[TRADE_002]` | "Validate [TRADE_001] against netting set" |
| Dollar amounts | Use realistic but fictional values | "$1,250,000" instead of actual exposure |
| Production endpoints | `[PROD_ENDPOINT_X]`, `[PROD_API_Y]` | "Call [PROD_ENDPOINT_PRICING]" |
| Credentials / tokens | Never included — reference by config key | "Use config key `PRICING_API_KEY`" |
| Internal IP addresses | `[INT_IP_001]`, `[INT_IP_002]` | "Connect to [INT_IP_DB_PRIMARY]" |
| Employee names (in data context) | `[EMPLOYEE_A]`, `[EMPLOYEE_B]` | Use real names only in artifact ownership fields |
| Regulatory submission values | Fictional equivalents | Use representative but non-real numbers |

## Rule of Thumb

**If you wouldn't write it on a whiteboard in a shared meeting room, redact it before feeding to an AI tool.**

## What's Always Safe

These categories are always safe to use with approved AI tools:

- Regulatory rule text (OSFI guidelines, Basel paragraphs, BCBS standards)
- General architecture patterns and technology concepts
- Coding patterns, frameworks, and library usage
- Process descriptions and workflow definitions
- Template structures and formatting conventions
- Open-source code and public documentation references
- REQ/DES/TC/RB IDs and traceability tables (the IDs themselves are not sensitive)

## What Requires Redaction (Internal)

These can be used with AI tools after applying placeholder conventions:

- Feature requirements that reference client types or business scenarios
- Design documents describing system components and data flows
- Test plans and test data specifications
- Runbooks describing operational procedures
- Code that processes business data (redact hardcoded values, connection strings)

## What Must Never Be Used with AI Tools (Restricted)

- Production database queries with real data results
- Client-identifiable information (names, account numbers, SSNs, addresses)
- Production credentials, API keys, certificates, or connection strings
- Regulatory submission files with real reporting data
- SOC audit findings or penetration test results
- Compliance investigation details
- Production log files containing client data

## Artifact Chain-Meta Classification

Every artifact in the compound chain includes a classification tag in its `chain-meta` header:

```markdown
<!-- chain-meta
classification: Internal
-->
```

Set this tag when creating the artifact. If any section contains restricted data that couldn't be redacted, escalate the classification to Restricted and do not process that artifact with AI tools.

## Incident Response

If restricted data is accidentally included in an AI prompt:
1. Do not repeat the prompt or share the output
2. Notify your team lead and the AI governance team
3. Document the incident
4. The enterprise AI governance team will handle remediation

This is not a career-ending event — it's a process improvement opportunity. Report it promptly.
