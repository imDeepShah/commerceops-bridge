# System architecture

## Principle
The human UI and WebMCP tools call the same validated domain services. WebMCP is an agent-facing interface to the product, not a second business-logic implementation.

## Components
```text
Merchant UI -> application services -> domain models and policies -> data adapter
WebMCP registry -> application services
Audit/event log <- UI actions and tool executions
```

## Data strategy
The hackathon build uses deterministic seeded fixtures. Adapter interfaces should allow Shopify Admin API, payment provider, carrier, and support integrations later without changing domain workflows.

## Safety boundary
Read and prepare operations may run through WebMCP. Customer-impacting or financial actions must stop at a recommendation or prepared action until the merchant explicitly approves.

