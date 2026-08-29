# F-02 Payment/refund exception resolution

## Goal
Allow a merchant to investigate a duplicate-payment case and prepare a safe resolution.

## Scenario
Order `ORD-1042` contains one settled charge and one duplicate pending charge. The agent gathers evidence and proposes a refund without executing it.

## User flow

1. Merchant opens Exceptions.
2. Merchant selects `ORD-1042`.
3. Agent retrieves order context.
4. Agent retrieves the payment timeline.
5. Agent checks the refund policy.
6. Agent proposes a resolution with evidence and risk.
7. Agent drafts an editable customer message.
8. Merchant approves, rejects, or requests changes.
9. Approval moves the case to `Approved` / `Action prepared`; it does not claim the refund was executed or the case was externally resolved.

## UI design

- Case header with ID, priority, SLA, and state.
- Order summary and customer-safe information.
- Payment timeline with settled, pending, and duplicate markers.
- Policy result with source reference.
- Recommendation panel with rationale, evidence, alternative, and risk.
- Editable message draft.
- Approval controls.
- Tool trace showing the structured operations used by the agent.

## Tool sequence

```text
get_order_context(orderId)
-> get_payment_timeline(orderId)
-> check_refund_policy(orderId, proposedAmount)
-> propose_resolution(caseId)
-> draft_customer_message(caseId, tone)
-> record_merchant_decision(caseId, decision)
```

## Output requirements

- Duplicate detection must cite the relevant payment events.
- Policy result must cite the applicable policy rule.
- Recommendation must include proposed action, amount, rationale, alternative, and risk.
- Draft message must be clearly labelled as unsent.
- Approval result must include the merchant decision and timestamp.

## Acceptance criteria
- Merchant can open the case from the exception queue.
- Agent retrieves order and payment context through WebMCP.
- Duplicate payment is detected from seeded events.
- Recommendation includes evidence and an alternative.
- Draft message is editable and not sent.
- Case cannot become resolved before approval.
- Invalid IDs produce a clear error.

## Engineering tasks

- [x] Implement exception queue query.
- [x] Implement order-context service.
- [x] Implement payment timeline and duplicate detection.
- [x] Implement refund-policy evaluation.
- [x] Implement recommendation service.
- [x] Implement draft-message service.
- [x] Register F-02 WebMCP tools.
- [x] Build case investigation UI.
- [x] Add approval boundary required by F-03.
- [x] Add unit, integration, and acceptance tests.
