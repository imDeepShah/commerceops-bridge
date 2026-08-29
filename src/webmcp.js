import { checkRefundPolicy, draftCustomerMessage, getCostAudit, getOpenExceptions, getOrderContext, getPaymentTimeline, prepareEscalationPacket, proposeResolution } from './domain.js';

export async function registerWebMcpTools(store, onToolCall = () => {}) {
  const modelContext = document.modelContext;
  if (typeof modelContext?.registerTool !== 'function') return { available: false, tools: [] };

  const register = async (tool) => {
    const execute = tool.execute;
    await modelContext.registerTool({ ...tool, execute: async (...args) => { onToolCall(tool.name); return execute(...args); } });
    return tool.name;
  };

  const tools = [
    { name: 'list_open_exceptions', description: 'List unresolved merchant exception cases.', inputSchema: { type: 'object', properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async () => getOpenExceptions(store.getState()) },
    { name: 'get_order_context', description: 'Read a customer-safe order summary and supporting references.', inputSchema: { type: 'object', properties: { orderId: { type: 'string' } }, required: ['orderId'], additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async ({ orderId }) => getOrderContext(store.getState(), orderId) },
    { name: 'get_payment_timeline', description: 'Read payment events and detect duplicate payment evidence.', inputSchema: { type: 'object', properties: { orderId: { type: 'string' } }, required: ['orderId'], additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async ({ orderId }) => getPaymentTimeline(store.getState(), orderId) },
    { name: 'check_refund_policy', description: 'Check whether a proposed duplicate-payment refund is eligible. This tool does not execute a refund.', inputSchema: { type: 'object', properties: { orderId: { type: 'string' }, proposedAmount: { type: 'number', minimum: 0 } }, required: ['orderId', 'proposedAmount'], additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async ({ orderId, proposedAmount }) => checkRefundPolicy(store.getState(), orderId, proposedAmount) }
    ,{ name: 'propose_resolution', description: 'Prepare an evidence-backed resolution recommendation without executing it.', inputSchema: { type: 'object', properties: { caseId: { type: 'string' } }, required: ['caseId'], additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async ({ caseId }) => proposeResolution(store.getState(), caseId) }
    ,{ name: 'draft_customer_message', description: 'Create an editable, unsent customer message draft.', inputSchema: { type: 'object', properties: { caseId: { type: 'string' }, tone: { type: 'string' } }, required: ['caseId', 'tone'], additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async ({ caseId, tone }) => draftCustomerMessage(store.getState(), caseId, tone) }
    ,{ name: 'get_cost_audit', description: 'Read subscription and fee costs with source references and advisory savings estimates.', inputSchema: { type: 'object', properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async () => getCostAudit(store.getState()) }
    ,{ name: 'prepare_escalation_packet', description: 'Prepare an editable, unsent support escalation packet from linked evidence.', inputSchema: { type: 'object', properties: { caseId: { type: 'string' } }, required: ['caseId'], additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async ({ caseId }) => prepareEscalationPacket(store.getState(), caseId) }
  ];

  const registered = [];
  for (const tool of tools) registered.push(await register(tool));
  return { available: true, tools: registered };
}
