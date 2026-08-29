# Iteration 0 — product baseline gate

Status: **Approved**

## Proposed product decision

Build CommerceOps Bridge as an agent-native merchant control plane for small and mid-sized ecommerce operations teams.

## Target audience

Primary user: a merchant operations or support lead responsible for resolving orders, refunds, payment issues, app costs, and support escalations.

Secondary user: a store owner who needs operational visibility without a dedicated operations team.

## Core problem

Store operations become fragmented across order records, payment events, policies, installed apps, fees, and support history. People must manually gather context, interpret policies, prepare responses, and update systems. This causes slow investigation, inconsistent decisions, and poor auditability.

## Product promise

CommerceOps Bridge lets an agent gather evidence, explain the situation, propose safe next actions, and prepare work for explicit merchant approval through structured WebMCP tools.

## Primary demo narrative

The merchant asks the agent to investigate a duplicate payment. The agent gathers order and payment context, checks the refund policy, proposes a resolution, drafts a customer message, waits for approval, and records the decision. The same workspace then supports a cost audit and a support-escalation packet.

## Proposed decisions

1. **Name:** CommerceOps Bridge for the current build; naming can be revisited later.
2. **Visual style:** Shopify Admin-inspired information architecture, but independent branding and no claim of official Shopify affiliation.
3. **Currency:** USD.
4. **Data:** deterministic seeded data for the official demo. A read-only Shopify development-store adapter is an optional final-leg enhancement, attempted only if it can be added at no cost without threatening the tested demo.

## Scope for the first submission

- One polished end-to-end payment/refund exception workflow.
- One app-cost audit workflow.
- One support-escalation preparation workflow.
- Structured WebMCP tools for investigation, recommendation, preparation, approval, and audit.
- Explicit no-send, no-refund, and no-account-change safeguards.
- Prototype benchmark comparing conventional and WebMCP-assisted workflows.

## Non-goals

- Real money movement.
- Sending external messages.
- Real customer data.
- Full Shopify administration.
- Production-grade integrations during the first implementation pass.

## Iteration 0 acceptance criteria

- Target audience is specific.
- The problem is described independently of any negative competitor claims.
- The primary demo can be explained in one sentence.
- Scope is small enough to implement and test in one day.
- WebMCP is central to the workflow.
- Human approval boundaries are explicit.
- Success metrics are measurable in the prototype.
- External integrations are optional rather than release-blocking.

## Approval request

All four decisions are approved. Shopify integration is explicitly parked as an optional final-leg enhancement. This baseline is the source of truth for the architecture gate and F-01/F-02 specifications.
