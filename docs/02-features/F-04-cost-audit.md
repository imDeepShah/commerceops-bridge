# F-04 App and operating-cost audit

## Goal
Help a merchant understand recurring app, payment, and transaction costs and identify review candidates.

## Acceptance criteria
- Agent retrieves subscription and fee data.
- Every cost figure has a source record.
- Recommendations disclose assumptions.
- App cannot uninstall or change a subscription.

## Implementation note

The seeded audit combines three app subscriptions with two explicit fee records. Every line cites a source ID, and the overlapping-promotion recommendation discloses its savings assumption. The workflow is read-only: it cannot uninstall apps, change subscriptions, or alter billing.
