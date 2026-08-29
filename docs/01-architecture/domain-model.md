# Domain model

## Entities
- `Merchant`: owner or operator.
- `Store`: ecommerce store context.
- `Order`: customer order and fulfillment state.
- `PaymentEvent`: authorization, capture, reversal, refund, or failure.
- `ShipmentEvent`: fulfillment and delivery timeline.
- `Policy`: refund, return, or escalation rule.
- `AppSubscription`: installed app, recurring cost, and category.
- `SupportCase`: issue, evidence, status, and message draft.
- `Recommendation`: agent proposal with evidence and risk.
- `Approval`: merchant decision.
- `AuditEvent`: immutable meaningful-action record.

## Invariants
- A resolved case must have an approval or recorded non-action reason.
- A recommendation must reference evidence.
- A demo action must be reversible through reset.
- Seeded data must not contain real personal information.
