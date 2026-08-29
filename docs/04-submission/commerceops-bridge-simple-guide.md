# CommerceOps Bridge — Simple Guide and Test Walkthrough

## What is this app?

CommerceOps Bridge is a single workspace that helps an online-store owner deal with operational problems.

Instead of searching through several systems, the owner can review exceptions, understand what happened, prepare a safe response, and decide what should happen next.

The app currently uses realistic demo data. It does not connect to a real Shopify store, payment provider, shipping company, or customer-support system.

## What problem are we solving?

Store owners often have to investigate problems manually:

- A customer may appear to have been charged twice.
- A shipment may be late.
- An app subscription may be costing money without enough value.
- A support issue may need to be escalated with the right evidence.

CommerceOps Bridge brings the relevant information together and helps prepare the next step. It keeps the owner in control: the app can recommend and prepare actions, but it does not secretly issue refunds, send messages, uninstall apps, or change subscriptions.

## What can you test?

### 1. Review the exception queue

The left-hand queue contains five demo situations:

- Duplicate payment
- Delivery delay
- Refund review
- Return exception
- Inventory mismatch

Select any case. The right side updates with the customer, order value, payment events, and linked evidence.

### 2. Investigate a duplicate payment

The starting case is `Duplicate payment` for Maya Rao.

Click **Run investigation**. The app then displays:

- The order and payment context.
- The two payment events.
- Which payment appears to be a duplicate.
- Whether the refund policy allows the proposed amount.
- A recommended action.
- An alternative option.
- The risk of acting too early.
- The evidence references used.

This demonstrates how an agent can gather information before asking a person to make a decision.

### 3. Edit the customer message

After running the investigation, scroll to **Customer message draft**.

The message is clearly marked **UNSENT**. Edit the text and confirm that it remains a draft. No message is sent to the customer.

### 4. Approve, reject, or request changes

Use one of the three decision buttons:

- **Approve preparation** changes the case to `Approved`.
- **Request changes** changes the case to `In review`.
- **Reject** changes the case to `Rejected`.

These are merchant decisions, not external actions. The app never claims that a refund was actually issued.

### 5. Review the audit trail

After making a decision, look at **Decision audit trail**.

The record includes:

- What decision was made.
- Which case it relates to.
- Who made it.
- When it was made.
- Confirmation that no external action was executed.

### 6. Run the cost audit

Click **Run cost audit** in the lower-right panel.

The app displays:

- Monthly operating cost.
- Annualized cost.
- App subscription costs.
- Platform and payment fees.
- A source reference for every cost line.
- A possible overlapping-app review.
- The assumptions behind the estimated savings.

The recommendation is advisory only. Nothing is uninstalled or changed.

### 7. Prepare a support escalation packet

Click **Prepare support packet**.

The app prepares a packet containing:

- Order facts.
- Payment facts.
- Existing support notes.
- An interpretation of the issue.
- Evidence references.
- An editable escalation message.

The packet is marked **UNSENT**. Edit it, then click **Copy packet** if you want to copy it for manual review. The app does not send it anywhere.

### 8. Reset the demo

Click **Reset demo** at the top right.

The app returns to its original state and clears:

- Investigation results.
- Cost-audit results.
- Support packets.
- Decision audit events.
- Tool trace entries.

## Recommended test order

1. Open the app and confirm five cases are visible.
2. Select **Delivery delay** and confirm the selected case changes.
3. Click **Reset demo**.
4. Click **Run investigation** on **Duplicate payment**.
5. Review the recommendation, alternative, risk, and evidence.
6. Edit the unsent customer message.
7. Click **Approve preparation**.
8. Check the audit trail.
9. Click **Reset demo**.
10. Click **Run cost audit** and review the source references and assumptions.
11. Click **Reset demo**.
12. Click **Prepare support packet**.
13. Edit the packet and click **Copy packet**.
14. Click **Reset demo** again.

## What this demo proves

The demo shows a safer way for an AI assistant to help with store operations:

1. Gather information from structured sources.
2. Explain what the information means.
3. Show evidence and uncertainty.
4. Prepare a recommended action or message.
5. Pause for a human decision.
6. Keep a clear audit record.

## Current limitation

The current local browser does not expose WebMCP, so it may show **WebMCP browser unavailable** or **Preview**. The app still demonstrates the complete user experience and registers the WebMCP tools when opened in a compatible browser.
