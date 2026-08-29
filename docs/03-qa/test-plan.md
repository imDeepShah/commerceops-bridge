# QA test plan

## Test layers
1. Unit: domain rules, policy checks, duplicate detection, state transitions.
2. Integration: UI, services, and WebMCP tools.
3. Acceptance: feature scenarios against every acceptance criterion.
4. Exploratory: browser, responsive layout, keyboard, reset, and failures.

## Release blockers
- A tool executes an unapproved consequential action.
- UI and WebMCP paths produce different outcomes.
- A primary demo workflow cannot complete from a clean reset.
- Evidence is missing from a recommendation.
- Public deployment differs materially from local behavior.

