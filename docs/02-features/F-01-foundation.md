# F-01 Foundation and demo data

## Goal
Provide the application shell, deterministic fixtures, shared state, reset behavior, and WebMCP registration foundation.

## Required demo data

The initial dataset must include synthetic records for:

- One merchant and one store.
- At least five orders.
- Normal, duplicate, failed, and pending payment events.
- Refund and return-policy rules.
- Shipment timelines with delayed and delivered cases.
- Three installed apps with recurring costs and one overlapping capability.
- Three support cases with notes and escalation history.
- Evidence references linking each recommendation to source records.

All records must be obviously synthetic, internally consistent, and resettable.

## UI design

- Store header with merchant name, demo mode, and WebMCP availability.
- Primary navigation: Overview, Exceptions, Cost audit, Support escalation.
- Exception queue with category, priority, SLA, and current state.
- Reset-demo action available from the application header.
- Empty, loading, and error states must be implemented for the queue.

## Data contract

The fixture adapter exposes read operations for merchants, stores, orders, payments, shipments, policies, apps, and support cases. It exposes controlled state operations for approvals, case status, and audit events.

## Acceptance criteria
- App loads with deterministic demo data.
- Reset returns all data to the initial state.
- UI remains usable when WebMCP is unavailable.
- No real personal or payment data is included.
- Later features can call shared domain services.
- The demo can complete all primary workflows without network access to Shopify.
- Data adapters have a seam for an optional read-only Shopify integration later.

## Engineering tasks

- [ ] Create app shell and route structure.
- [ ] Define domain types and fixture records.
- [ ] Implement demo adapter.
- [ ] Implement shared state and reset.
- [ ] Add WebMCP feature detection.
- [ ] Add tool registry abstraction.
- [ ] Add loading, empty, error, and reset states.
- [ ] Add unit tests for fixture relationships and reset.


## Tasks
- [ ] Scaffold application.
- [ ] Define fixture types and data.
- [ ] Implement state store and reset.
- [ ] Implement WebMCP feature detection and registry.
