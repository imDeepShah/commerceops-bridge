# Workflow state machine

```text
Open -> Investigating -> Recommendation ready -> Awaiting merchant approval -> Approved -> Action prepared -> Resolved
Recommendation ready -> Changes requested -> Awaiting merchant approval
Awaiting merchant approval -> Rejected
```

## Forbidden transitions
- Open directly to Resolved.
- Recommendation ready directly to Resolved.
- Drafted customer message directly to Sent.
- Prepared refund directly to Executed in the prototype.

