# Demo data and fixture specification

## Purpose

Provide realistic enough merchant data to demonstrate the product without relying on live Shopify access, external credentials, or third-party uptime.

## Fixture rules

- Use synthetic names, addresses, emails, and IDs.
- Never use real payment credentials or personal data.
- Keep relationships internally consistent.
- Include both normal and exception cases.
- Make every scenario deterministic and resettable.
- Keep source references available for recommendations and audit events.

## Required scenarios

### Payment/refund exception

`ORD-1042` has one settled charge and one duplicate pending charge. The refund policy allows the settled duplicate to be refunded. The agent must recommend but not execute the refund.

### Delivery exception

`ORD-1039` has a delayed shipment, a missed estimated delivery date, and a previous customer contact. The agent should propose a response and escalation option.

### App-cost audit

The store has three recurring app subscriptions. Two overlap partially in functionality. The dataset includes monthly costs and an explanation of the estimated savings, with no automatic uninstall action.

### Support escalation

`CASE-2207` contains a payment-hold issue with order references, timeline events, and previous support notes. The agent prepares an editable evidence packet but does not send it.

## Adapter boundary

The demo fixture adapter implements the same domain interface that a future read-only Shopify adapter would implement. The live adapter is optional and must not be required for the official demo or QA sign-off.

