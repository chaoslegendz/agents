# Worked Example: PROJ-187 — Market Risk Positions Ingestion Pipeline

> This is a fictional but realistic example showing exactly what each artifact looks like
> when a Jira goes through the compound engineering workflow. Use this as a reference
> during the pilot kickoff session.

---

## Step 1: BSA Creates the Jira Using the Description Template

### PROJ-187: Ingest Daily Market Risk Positions from RiskCalc

```
## Market Risk Positions Ingestion Pipeline

### Pattern
Ingestion

### Pipeline Path
/pipelines/market_risk_positions/

### What's Different from the Standard Pattern
- Source is a REST API (RiskCalc) with paginated responses, not a flat file or database query
- API uses cursor-based pagination, not offset — requires custom extraction logic
- Response includes nested JSON (positions contain an array of sensitivities) —
  needs flattening before raw zone write
- Volume is ~50,000 positions/day but spikes to ~200,000 on month-end dates

### Jira-Specific Requirements
Inherits: STD-ING-001 through STD-ING-008, STD-ING-NFR-001, STD-ING-NFR-002

Additional:
- REQ-PROJ-187-001: Pipeline must use cursor-based pagination to extract all pages
  from the RiskCalc /positions endpoint. Cursor value from response header X-Next-Cursor.
- REQ-PROJ-187-002: Nested sensitivity arrays must be flattened to one row per
  position-sensitivity pair before writing to curated zone.
  Raw zone retains the nested JSON structure.
- REQ-PROJ-187-003: Pipeline must handle month-end volume spike (200K positions)
  within the same NFR processing window.
- REQ-PROJ-187-N01: If RiskCalc returns HTTP 429 (rate limited), pipeline must
  back off for the duration specified in the Retry-After header, then resume
  from the last cursor position.
- REQ-PROJ-187-N02: If a position record is missing the required field
  "position_id", reject the record and continue processing. Log the rejected
  record with the page cursor for traceability.

### Data Specification
| Field | Source | Type | Transformation | Validation Rule |
|-------|--------|------|----------------|-----------------|
| position_id | RiskCalc.positions.id | string | None | Required, unique per run |
| book | RiskCalc.positions.book | string | None | Required |
| instrument_type | RiskCalc.positions.type | string | Map to internal taxonomy | Must exist in ref table |
| notional | RiskCalc.positions.notional | decimal | None | > 0 |
| currency | RiskCalc.positions.ccy | string(3) | Uppercase | ISO 4217 |
| sensitivity_type | RiskCalc.positions.sensitivities[].type | string | Flatten from array | Required |
| sensitivity_value | RiskCalc.positions.sensitivities[].value | decimal | Flatten from array | Not null |
| as_of_date | RiskCalc.positions.as_of_date | date | Convert to UTC | Must equal run date |

### Source System Details
- System: RiskCalc
- Connection: Config key RISKCALC_API_BASE_URL, auth via RISKCALC_API_TOKEN
- Format: REST API, JSON response
- Volume: ~50,000 positions/day, ~200,000 month-end
- Frequency: Daily at 05:00 UTC (after RiskCalc overnight batch completes)
- Known gotchas: API returns paginated results with inconsistent page sizes.
  Use cursor, not offset. See known-issues.md → RiskCalc section.

### Similar Existing Pipeline
client_trades (PROJ-045) — also API-based ingestion with pagination,
but uses offset pagination instead of cursor.

### Non-Functional Requirements
Inherits: STD-ING-NFR-001, STD-ING-NFR-002

Additional:
- NFR-PROJ-187-001: Must complete within 45 minutes on regular days
  and 90 minutes on month-end dates.

### Classification: Internal

### Acceptance Criteria
- [ ] Standard pattern test cases pass (STC-ING-001 through STC-ING-010 linked in JTMF)
- [ ] Jira-specific test cases pass (TC-PROJ-187-### in JTMF)
- [ ] Pipeline registered in pipeline-catalog.md
- [ ] Config YAML committed and validated
- [ ] Code reviewed and merged
```

**Time for BSA:** ~25 minutes for the first one (includes looking up the pattern, checking the catalog, finding the closest pipeline). Subsequent Jiras using the same pattern: ~15 minutes.

---

## Step 2: BSA Sets Up Test Cases in JTMF

### Standard Test Cases (Linked, Not Created)

BSA links the following existing STC-ING test cases to PROJ-187 in JTMF. These were created once and are reused across all ingestion pipeline Jiras.

| ID | Scenario | Already exists in JTMF |
|----|----------|----------------------|
| STC-ING-001 | Happy path — full pipeline runs, row counts match | ✅ Link to PROJ-187 |
| STC-ING-002 | Source unavailable — retry then fail gracefully | ✅ Link to PROJ-187 |
| STC-ING-003 | Schema validation failure — reject bad, load good | ✅ Link to PROJ-187 |
| STC-ING-004 | Empty source — completes, zero rows, no error | ✅ Link to PROJ-187 |
| STC-ING-005 | Idempotency — re-run produces same result | ✅ Link to PROJ-187 |
| STC-ING-006 | Row count reconciliation across stages | ✅ Link to PROJ-187 |
| STC-ING-007 | Config validation — bad YAML rejected | ✅ Link to PROJ-187 |
| STC-ING-008 | Volume test — within NFR threshold | ✅ Link to PROJ-187 |
| STC-ING-009 | Raw zone write before validation | ✅ Link to PROJ-187 |
| STC-ING-010 | Partial failure — mix of valid/invalid rows | ✅ Link to PROJ-187 |

**Time for BSA:** ~5 minutes (just linking existing test cases in JTMF).

### Jira-Specific Test Cases (Created New)

BSA generates these using the testing agent or the JTMF prompt from the prompt library. These cover only what's different from the standard pattern.

| ID | Traces to | Type | Scenario | Expected Result |
|----|-----------|------|----------|-----------------|
| TC-PROJ-187-001 | REQ-PROJ-187-001 | Functional | Pagination: API returns 3 pages of results via cursor. Pipeline extracts all 3 pages. | All positions from all pages present in raw zone. Row count matches sum of page sizes. |
| TC-PROJ-187-002 | REQ-PROJ-187-001 | Edge Case | Pagination: API returns single page (no next cursor). | Pipeline handles gracefully, no error. |
| TC-PROJ-187-003 | REQ-PROJ-187-002 | Functional | Flattening: Position with 3 sensitivities produces 3 rows in curated zone. | Curated zone has 3 rows, each with correct sensitivity_type and sensitivity_value. Raw zone retains nested JSON. |
| TC-PROJ-187-004 | REQ-PROJ-187-002 | Edge Case | Flattening: Position with 0 sensitivities (empty array). | Position row created with null sensitivity fields, or position excluded with logged warning. (Confirm with BSA — open question.) |
| TC-PROJ-187-005 | REQ-PROJ-187-N01 | Negative | Rate limiting: API returns 429 with Retry-After: 30. | Pipeline pauses 30 seconds, resumes from last cursor, completes successfully. |
| TC-PROJ-187-006 | REQ-PROJ-187-N02 | Negative | Missing position_id: One record in a page has null position_id. | Record rejected, remaining records processed, rejection logged with cursor position. |
| TC-PROJ-187-007 | REQ-PROJ-187-003, NFR-PROJ-187-001 | Non-Functional | Month-end volume: 200,000 positions processed. | Completes within 90-minute threshold. |

**Time for BSA:** ~15 minutes (generate with testing agent/prompt, review, enter into JTMF).

**Total test cases for PROJ-187:** 10 standard (inherited) + 7 Jira-specific = 17 test cases.
Compare to old approach: BSA would generate all 17 (or more) from scratch in Excel every time.

---

## Step 3: Dev Generates plan.md

Dev opens GitHub Copilot Chat (Claude or Codex), uses the standardized prompt:

### Input to the Prompt

```
Generate a plan.md for Jira PROJ-187.

This pipeline follows the Ingestion pattern.
Pattern reference: [pastes ingestion-pattern.md]

Closest existing pipeline: client_trades (PROJ-045) at /pipelines/client_trades/
— also API-based but uses offset pagination instead of cursor.

Deviations from pattern:
- Source is REST API with cursor-based pagination (not flat file/DB)
- Nested JSON response needs flattening
- Month-end volume spike (200K vs normal 50K)

Jira-specific requirements:
- REQ-PROJ-187-001: Cursor-based pagination from RiskCalc /positions endpoint
- REQ-PROJ-187-002: Flatten nested sensitivities array to one row per pair
- REQ-PROJ-187-003: Handle month-end 200K volume within 90-minute window
- REQ-PROJ-187-N01: HTTP 429 handling with Retry-After header
- REQ-PROJ-187-N02: Missing position_id → reject record, continue processing

Data specification:
[pastes the data spec table from Jira]

Known issues:
- RiskCalc API returns paginated results with inconsistent page sizes.
  Use cursor, not offset.

Generate a plan that specifies ONLY the deviations from the standard pattern.
For standard steps, reference: "Follow STD-ING steps for [phase]."
```

### Output: plan.md

```markdown
# Plan: Market Risk Positions Ingestion Pipeline
# Jira: PROJ-187
# Classification: Internal
# Created: 2026-04-03
# Requirements source: [Confluence page link]
# Pattern: Ingestion (deviations below)

## Overview
Build a daily ingestion pipeline that extracts market risk positions from the
RiskCalc REST API, writes raw nested JSON to ADLS raw zone, then flattens
the sensitivity arrays and validates against schema before writing to curated zone.
Key deviations from the standard ingestion pattern: cursor-based API pagination,
nested JSON flattening, and month-end volume handling.

## Requirements Addressed
- STD-ING-001 through STD-ING-008 (standard pattern — no deviations)
- STD-ING-NFR-001, STD-ING-NFR-002 (standard NFRs)
- REQ-PROJ-187-001: Cursor-based pagination
- REQ-PROJ-187-002: Sensitivity array flattening
- REQ-PROJ-187-003: Month-end volume handling
- REQ-PROJ-187-N01: HTTP 429 rate limit handling
- REQ-PROJ-187-N02: Missing position_id rejection
- NFR-PROJ-187-001: 45-min regular / 90-min month-end processing window

## Implementation Steps

### Step 1: Create Config → STD-ING-005
Follow STD-ING pattern. Create /config/market_risk_positions.yaml and
Pydantic config model.
Additional config fields beyond standard:
- riskcalc_endpoint: reference to RISKCALC_API_BASE_URL
- page_size: 1000 (initial, adjustable)
- retry_after_default: 30 (fallback if Retry-After header missing)
- month_end_dates: list or detection logic

### Step 2: Build Cursor-Based Extractor → REQ-PROJ-187-001, REQ-PROJ-187-N01
- **What:** Create /pipelines/market_risk_positions/extract.py
  Reference /pipelines/client_trades/extract.py for API extraction pattern,
  but replace offset pagination with cursor logic.
- **Where:** /pipelines/market_risk_positions/extract.py
- **Pattern:** Generator function that yields pages. Read X-Next-Cursor from
  response headers. Stop when cursor is null/empty.
- **Rate limit handling (REQ-PROJ-187-N01):** On HTTP 429, read Retry-After
  header (seconds). Sleep for that duration. Resume from last successful cursor.
  If no Retry-After header, use config retry_after_default. Max 5 retries
  before raising ExtractionError.
- **Acceptance:** Given a mock API returning 3 pages with cursors, extractor
  yields all 3 pages. Given a 429 on page 2, extractor waits and retries.

### Step 3: Build Validator with Flattening → REQ-PROJ-187-002, REQ-PROJ-187-N02
- **What:** Create /pipelines/market_risk_positions/validate.py
  Two-phase validation:
  Phase 1 (pre-flatten): Validate position-level fields against Pydantic schema.
  Reject records missing position_id (REQ-PROJ-187-N02). Log rejected records
  with page cursor for traceability.
  Phase 2 (post-flatten): Explode sensitivities array to one row per
  position-sensitivity pair. Validate sensitivity-level fields.
- **Where:** /pipelines/market_risk_positions/validate.py
- **Acceptance:** Given a position with 3 sensitivities, output has 3 rows.
  Given a position with missing position_id, record is rejected and logged.

### Step 4: Build Loader → STD-ING-004, STD-ING-006
Follow STD-ING pattern. Two writes:
1. Raw zone: write nested JSON as-is (before flattening) — per STD-ING-004
2. Curated zone: write flattened, validated data
Partition by as_of_date.
Row count logging at both stages — per STD-ING-002.

### Step 5: Build Orchestrator → STD-ING-002, STD-ING-006, STD-ING-008
Follow STD-ING pattern for orchestrator structure.
Additional: generate run manifest with page count, total positions,
flattened rows, rejected rows, duration.

### Step 6: Unit Tests
- Test cursor pagination with mock API (3 pages, 1 page, empty response)
- Test 429 handling with mock Retry-After header
- Test flattening logic (multiple sensitivities, zero sensitivities, null fields)
- Test position_id rejection logic
- Standard STD-ING unit test patterns for config, validation, loading

### Step 7: Month-End Handling → REQ-PROJ-187-003, NFR-PROJ-187-001
- Add month-end detection to config (last business day of month or config list)
- On month-end: increase extraction batch size, log as month-end run
- Verify processing completes within 90-minute window for 200K records
- No architectural change needed if extraction is streaming (generator pattern)

## Data Handling
RiskCalc /positions → extract (paginated, cursor) → raw JSON to ADLS raw zone
→ flatten sensitivities → validate position + sensitivity fields
→ curated zone (partitioned by as_of_date)

Rejected records → rejection log in ADLS raw zone /rejections/ partition

## Edge Cases & Error Handling
| Scenario | Handling | REQ |
|----------|----------|-----|
| HTTP 429 rate limit | Back off per Retry-After header, max 5 retries | REQ-PROJ-187-N01 |
| Missing position_id | Reject record, log with cursor, continue | REQ-PROJ-187-N02 |
| Empty sensitivities array | Position row with null sensitivity fields (flag for BSA confirmation) | REQ-PROJ-187-002 |
| API timeout | Standard retry per STD-ING-003 | STD-ING-003 |
| Schema drift | Standard validation per STD-ING-001 | STD-ING-001 |

## Testing Notes for BSA
- Focus on the flattening logic (TC-PROJ-187-003, 004) — the count math
  (positions × sensitivities = curated rows) is where bugs are most likely
- The 429 handling (TC-PROJ-187-005) will be hard to test against real RiskCalc —
  may need to simulate or test with a mock. Discuss approach.
- The empty sensitivities edge case (TC-PROJ-187-004) needs a decision:
  include position with nulls or exclude? Currently coded as include-with-nulls.
- Month-end volume test depends on having enough test data. May need synthetic data.

## Agent Instructions
- Follow repository patterns from /pipelines/client_trades/ for structure
- Use structured logging: pipeline_name, run_id, stage, row_count, cursor, timestamp
- Custom exceptions: ExtractionError, ValidationError, LoadError, RateLimitError
- Pydantic for all config and data models
- Type hints on all functions
```

**Time for dev:** ~10 minutes (prompt + review). Compare to current approach: read Confluence, manually interpret requirements, write plan from scratch — 30–60 minutes of variable quality.

---

## Step 4: Dev Iterates, Posts Dev Complete Comment

After the developer agent generates code and the dev iterates to completion:

### Dev Complete Comment on PROJ-187

```
## Dev Complete — PROJ-187

### What Was Built
Daily ingestion pipeline for RiskCalc market risk positions. Extracts via
cursor-based pagination, writes raw JSON to ADLS raw zone, flattens nested
sensitivity arrays, validates against Pydantic schema, writes curated data
partitioned by as_of_date.

### Requirements Implemented
| REQ | Title | Status | Notes |
|-----|-------|--------|-------|
| STD-ING-001 through 008 | Standard ingestion | ✅ Implemented | No deviations |
| REQ-PROJ-187-001 | Cursor pagination | ✅ Implemented | |
| REQ-PROJ-187-002 | Sensitivity flattening | ✅ Implemented | Empty array → row with null sensitivities |
| REQ-PROJ-187-003 | Month-end volume | ✅ Implemented | Increased batch size on month-end |
| REQ-PROJ-187-N01 | 429 rate limiting | ✅ Implemented | Max 5 retries |
| REQ-PROJ-187-N02 | Missing position_id | ✅ Implemented | Rejected + logged with cursor |
| NFR-PROJ-187-001 | Processing window | ⏳ Not yet load-tested | Need representative volume data |

### Testing Focus Areas
- Flattening math: 1 position with N sensitivities = N curated rows. Validate counts.
- The empty sensitivities case: currently creates a row with null sensitivity fields.
  BSA to confirm this is correct behaviour.
- 429 handling tested with mocks only — cannot trigger real rate limiting in test env.
- Month-end NFR needs volume data to validate.

### Known Limitations
- NFR processing window not yet validated with real volumes
- Rate limit testing is mock-only

### Configuration / Setup
- New config: /config/market_risk_positions.yaml
- Requires RISKCALC_API_BASE_URL and RISKCALC_API_TOKEN in environment
- No schema migrations. No downstream pipeline changes.
```

---

## Step 5: BSA Executes Tests and Signs Off

BSA runs through the 17 test cases in JTMF (10 standard + 7 Jira-specific), attaches evidence, and posts the sign-off.

### Test Sign-Off Comment on PROJ-187

```
## Test Sign-Off — PROJ-187

### Summary
- **Standard pattern tests (STC-ING):** 10 / 10 passed
- **Jira-specific tests (TC-PROJ-187):** 6 / 7 passed, 1 deferred
- **Execution details:** See JTMF test cycle PROJ-187-Cycle-1

### Standard Pattern Coverage
All STC-ING standard tests passed. No exclusions.

### Jira-Specific Coverage
| REQ | Test Case | Result | Notes |
|-----|-----------|--------|-------|
| REQ-PROJ-187-001 | TC-PROJ-187-001 (multi-page) | ✅ Pass | 3 pages extracted, counts match |
| REQ-PROJ-187-001 | TC-PROJ-187-002 (single page) | ✅ Pass | |
| REQ-PROJ-187-002 | TC-PROJ-187-003 (flatten) | ✅ Pass | 50 positions × avg 3 sensitivities = 148 rows (2 had 2 sensitivities) |
| REQ-PROJ-187-002 | TC-PROJ-187-004 (empty array) | ✅ Pass | Row created with null sensitivities — confirmed acceptable |
| REQ-PROJ-187-N01 | TC-PROJ-187-005 (429 handling) | ✅ Pass | Mock test only — resumed from correct cursor after backoff |
| REQ-PROJ-187-N02 | TC-PROJ-187-006 (missing ID) | ✅ Pass | Record rejected, logged with cursor position |
| NFR-PROJ-187-001 | TC-PROJ-187-007 (month-end volume) | ⏳ Deferred | Insufficient test data for 200K volume test. PROJ-201 raised to address. |

### Issues Found
- PROJ-201: Need synthetic data generator for month-end volume testing (P2, next sprint)

### Observations
- The empty sensitivities edge case (TC-PROJ-187-004) should be added as a standard
  pattern test case (new STC-ING-011) since other pipelines with nested data will hit this.
- Consider adding STC-ING for cursor-based APIs specifically if more pipelines use this pattern.

### Sign-Off
- **Tested by:** [BSA Name]
- **Date:** 2026-04-10
- **Recommendation:** Conditional Pass — month-end NFR deferred to PROJ-201
```

---

## What the Team Learned

After this one Jira, the team now has:

| Artifact | Reusable? | Benefit for Next Jira |
|----------|-----------|----------------------|
| Ingestion pattern file with standard requirements and tests | ✅ Yes | Next ingestion Jira inherits 80% of the structure |
| 10 standard test cases in JTMF | ✅ Yes | Next ingestion Jira links them in 5 minutes |
| Pipeline catalog entry for market_risk_positions | ✅ Yes | Next API-based pipeline references this as "closest existing" |
| Known issues entry for RiskCalc pagination | ✅ Yes | Next RiskCalc pipeline avoids the same gotcha |
| Observation: empty nested array should be a standard test | ✅ Yes | STC-ING-011 gets added, all future ingestion Jiras inherit it |
| Dev Complete + Sign-Off comment conventions | ✅ Yes | Pattern is now established for the team |

**That's the compound effect.** Jira #2 is already easier than Jira #1.
