# Iteration 1 — architecture gate

Status: **Approved**

## Objective

Deliver the smallest complete vertical slice of CommerceOps Bridge:

```text
Open merchant workspace
-> view seeded exception
-> investigate order and payment context
-> detect duplicate payment
-> check refund policy
-> receive evidence-backed recommendation
-> wait for merchant approval
```

F-01 provides the application foundation and data. F-02 provides the first meaningful WebMCP workflow. F-03 approval/audit behavior is included only where required to prevent unsafe resolution.

## Architecture decisions

### AD-001: Deterministic demo adapter first

The first implementation uses local deterministic fixtures. It must run without Shopify credentials or network access. The adapter interface will leave a seam for the optional final-leg Shopify read-only adapter.

### AD-002: Shared application services

The human UI and WebMCP tools call the same application services. No business rule may exist only inside a UI handler or only inside a tool executor.

### AD-003: Prepare, do not execute

The prototype can investigate, recommend, draft, and record approval. It cannot execute refunds, send messages, or modify an external commerce system.

An approved recommendation is represented as `Action prepared`, not as an executed or externally resolved action.

### AD-004: Evidence is first-class

Recommendations must reference the order, payment, or policy records that support them. Unsupported conclusions are invalid output.

## Initial vertical-slice scenario

Order `ORD-1042` belongs to synthetic customer `Maya Rao`. It contains one settled charge and one duplicate pending charge. Store policy allows the settled duplicate to be refunded. The agent should recommend a refund, draft a confirmation, and stop for merchant approval.

## Architecture gate criteria

- [ ] F-01 and F-02 scope is accepted.
- [ ] Demo adapter and fixture boundaries are accepted.
- [ ] Tool contracts are accepted.
- [ ] State and approval boundaries are accepted.
- [ ] UI states and primary demo flow are accepted.
- [ ] Acceptance criteria are testable.
- [ ] Engineer task breakdown is sufficiently specific.

## Approval outcome

Upon approval, status changes to **Ready for implementation** and the engineer may begin F-01.
