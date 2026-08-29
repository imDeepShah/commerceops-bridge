# F-03 Merchant approval and audit

## Goal
Keep the merchant in control of customer-impacting decisions and make the workflow traceable.

## Acceptance criteria
- Approve, reject, and request-changes actions are distinct.
- Approval changes state and creates an audit event.
- Rejection leaves the case unresolved.
- Audit events show actor, action, timestamp, and case ID.
- Reset clears demo events.
- Read-only tools cannot trigger hidden state changes.

## Implementation note

F-03 records merchant decisions with actor, action, timestamp, case ID, note, and an explicit `externalActionExecuted: false` boundary. Approval changes the case to `Approved`, while rejection and change requests remain non-resolved. The demo reset restores the empty audit state.
