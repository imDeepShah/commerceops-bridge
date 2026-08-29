# CommerceOps Bridge

CommerceOps Bridge is a spec-driven WebMCP prototype for ecommerce merchant operations. It helps merchants investigate post-purchase exceptions, understand operational costs, and prepare support escalations while keeping consequential decisions under human approval.

## Current status

Iterations 1–5 are implemented locally. The app has deterministic demo data, WebMCP tool registration, exception investigation, merchant approval/audit, cost audit, and support-escalation preparation. Public hosting and repository packaging remain before submission.

## SDD workflow

1. Architect writes or updates the product, architecture, feature, and acceptance specifications.
2. Engineer implements only against an approved feature specification.
3. QA tests the implementation against acceptance criteria and records defects.
4. Product acceptance closes the feature or sends it back for correction.

## Initial assumptions

- Primary audience: small and mid-sized ecommerce merchants and operations teams.
- Demo data: deterministic seeded data; no live payment execution.
- Primary workflow: duplicate-payment/refund exception resolution.
- Secondary workflows: app-cost audit and support-escalation preparation.
- External systems: replaceable adapters, deferred until the core demo is stable.

Open decisions are tracked in `docs/00-product/product-brief.md`.

See `docs/04-submission/deployment-readiness.md` for the release gate and `docs/04-submission/commerceops-bridge-simple-guide.md` for the non-technical walkthrough.
