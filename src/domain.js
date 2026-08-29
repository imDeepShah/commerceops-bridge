export function getOpenExceptions(state) {
  return state.cases.filter((item) => item.state !== 'Resolved');
}

export function getOrderContext(state, orderId) {
  const order = state.orders[orderId];
  if (!order) throw new Error(`Order ${orderId} was not found.`);
  return { order, payments: state.payments[orderId] ?? [], shipment: state.shipments[orderId] ?? [], evidence: state.evidence[orderId] ?? [`order:${orderId}`] };
}

export function getPaymentTimeline(state, orderId) {
  const context = getOrderContext(state, orderId);
  const duplicate = context.payments.some((payment) => Boolean(payment.duplicateOf));
  return { orderId, payments: context.payments, duplicateDetected: duplicate, evidence: context.payments.map((payment) => `payment:${payment.id}`) };
}

export function checkRefundPolicy(state, orderId, proposedAmount) {
  const context = getOrderContext(state, orderId);
  const duplicate = getPaymentTimeline(state, orderId).duplicateDetected;
  const eligible = duplicate && proposedAmount > 0 && proposedAmount <= context.order.total;
  return { orderId, proposedAmount, eligible, rule: state.policies.duplicatePayment, evidence: ['policy:duplicate-payment'] };
}

export function getSupportCases(state) {
  return state.supportCases;
}

export function getSupportCase(state, caseId) {
  const supportCase = state.supportCases.find((item) => item.id === caseId);
  if (!supportCase) throw new Error(`Support case ${caseId} was not found.`);
  return { supportCase, evidence: state.evidence[supportCase.orderId] ?? [] };
}

export function getCostAudit(state) {
  const subscriptions = state.apps.map((app) => ({ id: app.id, name: app.name, category: app.category, monthly: app.monthly, source: `app:${app.id}` }));
  const fees = (state.fees ?? []).map((fee) => ({ id: fee.id, name: fee.name, category: fee.category, monthly: fee.monthly, source: `fee:${fee.id}`, basis: fee.basis }));
  const lines = [...subscriptions, ...fees];
  const monthlyTotal = lines.reduce((sum, item) => sum + item.monthly, 0);
  const promotionApps = subscriptions.filter((item) => item.category.includes('Promotion'));
  const consolidationSaving = promotionApps.length > 1 ? Math.min(promotionApps[1].monthly, 79) : 0;
  return { lines, monthlyTotal, annualizedTotal: monthlyTotal * 12, recommendations: [{ action: 'Review overlapping promotion tools', estimatedMonthlySaving: consolidationSaving, rationale: 'Two seeded apps cover Promotions; confirm whether both are still needed.', assumptions: 'Estimate assumes one promotion app can be retired after merchant review; no subscription is changed automatically.', evidence: promotionApps.map((item) => item.source) }] };
}

export function prepareEscalationPacket(state, caseId) {
  const exception = state.cases.find((item) => item.id === caseId);
  if (!exception) throw new Error(`Case ${caseId} was not found.`);
  const context = getOrderContext(state, exception.orderId);
  const timeline = getPaymentTimeline(state, exception.orderId);
  const supportCase = state.supportCases.find((item) => item.orderId === exception.orderId);
  if (!supportCase) throw new Error(`No support history was found for ${caseId}.`);
  const evidence = [...new Set([...(state.evidence[exception.orderId] ?? []), ...timeline.evidence, `case:${supportCase.id}`])];
  const facts = [`Order ${context.order.id} belongs to ${context.order.customer} and totals ${context.order.total.toFixed(2)} USD.`, ...context.payments.map((payment) => `Payment ${payment.id} is ${payment.status} for ${payment.amount.toFixed(2)} USD.`), ...supportCase.notes];
  const interpretation = exception.category === 'Duplicate payment' ? 'The pending payment appears to duplicate the settled charge and needs provider reconciliation.' : `The available records indicate a ${exception.category.toLowerCase()} requiring specialist review.`;
  const draft = `Escalation request for ${exception.id} / ${exception.orderId}\n\nFacts:\n- ${facts.join('\n- ')}\n\nInterpretation:\n${interpretation}\n\nRequested next step:\nPlease review the attached references and advise on the safest resolution.`;
  return { caseId, supportCaseId: supportCase.id, sent: false, facts, interpretation, draft, evidence, copyText: draft };
}

export function proposeResolution(state, caseId) {
  const exception = state.cases.find((item) => item.id === caseId);
  if (!exception) throw new Error(`Case ${caseId} was not found.`);
  const context = getOrderContext(state, exception.orderId);
  const timeline = getPaymentTimeline(state, exception.orderId);
  const duplicate = context.payments.find((payment) => payment.duplicateOf);
  if (!timeline.duplicateDetected || !duplicate) {
    return { caseId, orderId: exception.orderId, action: 'Investigate manually', amount: 0, rationale: 'No duplicate payment was detected in the available payment events.', alternative: 'Request additional provider evidence.', risk: 'A refund is not recommended from current evidence.', evidence: [...timeline.evidence, ...context.evidence] };
  }
  return { caseId, orderId: exception.orderId, action: 'Prepare refund for duplicate charge', amount: duplicate.amount, rationale: `Payment ${duplicate.id} is marked as a duplicate of ${duplicate.duplicateOf} and is still pending reversal.`, alternative: 'Wait for the provider reversal before taking any refund action.', risk: 'Refunding before provider reconciliation could create an over-refund.', evidence: [...timeline.evidence, 'policy:duplicate-payment'] };
}

export function draftCustomerMessage(state, caseId, tone = 'clear and reassuring') {
  const exception = state.cases.find((item) => item.id === caseId);
  if (!exception) throw new Error(`Case ${caseId} was not found.`);
  const context = getOrderContext(state, exception.orderId);
  const recommendation = proposeResolution(state, caseId);
  return { caseId, tone, sent: false, draft: `Hi ${context.order.customer},\n\nWe’re reviewing an issue with order ${context.order.id}. We identified a duplicate payment event and are preparing the safest next step. We’ll update you once the payment provider confirms the reversal.\n\nNo action is needed from you right now.\n\nThank you,\nNorthstar Goods Support`, evidence: recommendation.evidence };
}

export function recordMerchantDecision(state, caseId, decision, note = '') {
  if (!['approve', 'reject', 'request_changes'].includes(decision)) throw new Error(`Decision ${decision} is not supported.`);
  const exception = state.cases.find((item) => item.id === caseId);
  if (!exception) throw new Error(`Case ${caseId} was not found.`);
  const at = new Date().toISOString();
  const nextState = decision === 'approve' ? 'Approved' : decision === 'reject' ? 'Rejected' : 'In review';
  return { ...state, cases: state.cases.map((item) => item.id === caseId ? { ...item, state: nextState } : item), audit: [...state.audit, { id: `AUD-${Date.now()}`, caseId, action: decision, actor: 'Merchant', decision, note, at, externalActionExecuted: false }] };
}
