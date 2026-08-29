# WebMCP tool contracts

All tools use narrow JSON schemas, validate inputs, return structured results, and disclose side effects. Read-only tools should be annotated as read-only. Outputs containing user-generated content are untrusted.

## Initial tools
- `list_open_exceptions`: read-only; returns open cases with ID, category, priority, and SLA.
- `get_order_context`: input `{ orderId: string }`; returns safe order summary and evidence references.
- `get_payment_timeline`: input `{ orderId: string }`; returns payment events and duplicate analysis.
- `check_refund_policy`: input `{ orderId: string, proposedAmount: number }`; returns eligibility and evidence.
- `propose_resolution`: input `{ caseId: string }`; returns recommendation, alternatives, risks, and evidence; never executes.
- `draft_customer_message`: input `{ caseId: string, tone: string }`; returns an editable draft; never sends.
- `record_merchant_decision`: input `{ caseId: string, decision: approve|reject|request_changes, note?: string }`; creates an audit event.
- `update_case_status`: input `{ caseId: string, status: open|in_review|resolved }`; only permitted after approval rules pass.

