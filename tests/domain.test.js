import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState } from '../src/data.js';
import { checkRefundPolicy, draftCustomerMessage, getCostAudit, getPaymentTimeline, getOrderContext, prepareEscalationPacket, proposeResolution, recordMerchantDecision } from '../src/domain.js';

test('order context returns order and evidence', () => {
  const result = getOrderContext(initialState, 'ORD-1042');
  assert.equal(result.order.customer, 'Maya Rao');
  assert.equal(result.evidence.includes('payment:PAY-882'), true);
  assert.equal(result.shipment[0].status, 'Delivered');
});

test('payment timeline detects duplicate payment', () => {
  const result = getPaymentTimeline(initialState, 'ORD-1042');
  assert.equal(result.duplicateDetected, true);
  assert.equal(result.payments.length, 2);
});

test('refund policy approves the settled duplicate amount', () => {
  const result = checkRefundPolicy(initialState, 'ORD-1042', 248);
  assert.equal(result.eligible, true);
  assert.equal(result.evidence[0], 'policy:duplicate-payment');
});

test('unknown order produces an actionable error', () => {
  assert.throws(() => getOrderContext(initialState, 'ORD-0000'), /ORD-0000 was not found/);
});

test('fixtures cover the approved foundation scenarios', () => {
  assert.equal(Object.keys(initialState.orders).length >= 5, true);
  assert.equal(Object.values(initialState.payments).flat().some((payment) => payment.status === 'Failed'), true);
  assert.equal(Object.keys(initialState.shipments).length >= 5, true);
  assert.equal(initialState.supportCases.length >= 3, true);
  assert.equal(initialState.apps.length, 3);
});

test('resolution recommendation is evidence-backed and non-executing', () => {
  const result = proposeResolution(initialState, 'EX-1042');
  assert.equal(result.action, 'Prepare refund for duplicate charge');
  assert.equal(result.amount, 248);
  assert.equal(result.evidence.includes('payment:PAY-882'), true);
  assert.equal(result.risk.includes('over-refund'), true);
});

test('customer draft is editable in the UI and marked unsent', () => {
  const result = draftCustomerMessage(initialState, 'EX-1042', 'reassuring');
  assert.equal(result.sent, false);
  assert.equal(result.draft.includes('Maya Rao'), true);
});

test('merchant decision records audit without resolving externally', () => {
  const result = recordMerchantDecision(initialState, 'EX-1042', 'approve', 'Proceed after review.');
  assert.equal(result.cases.find((item) => item.id === 'EX-1042').state, 'Approved');
  assert.equal(result.audit[0].actor, 'Merchant');
  assert.equal(result.audit[0].action, 'approve');
  assert.equal(result.audit[0].caseId, 'EX-1042');
  assert.equal(typeof result.audit[0].at, 'string');
  assert.equal(result.audit[0].externalActionExecuted, false);
});

test('rejection and change requests remain non-resolved', () => {
  const rejected = recordMerchantDecision(initialState, 'EX-1042', 'reject');
  const changed = recordMerchantDecision(initialState, 'EX-1042', 'request_changes');
  assert.equal(rejected.cases[0].state, 'Rejected');
  assert.equal(changed.cases[0].state, 'In review');
  assert.notEqual(rejected.cases[0].state, 'Resolved');
  assert.notEqual(changed.cases[0].state, 'Resolved');
});

test('cost audit cites subscriptions and fee sources with assumptions', () => {
  const result = getCostAudit(initialState);
  assert.equal(result.lines.length, 5);
  assert.equal(result.monthlyTotal, 374.4);
  assert.equal(result.lines.every((item) => item.source), true);
  assert.equal(result.recommendations[0].assumptions.includes('no subscription is changed'), true);
});

test('escalation packet separates facts from interpretation and remains unsent', () => {
  const result = prepareEscalationPacket(initialState, 'EX-1042');
  assert.equal(result.supportCaseId, 'CASE-2207');
  assert.equal(result.sent, false);
  assert.equal(result.facts.some((fact) => fact.includes('PAY-882')), true);
  assert.equal(result.interpretation.includes('provider reconciliation'), true);
  assert.equal(result.evidence.includes('case:CASE-2207'), true);
});
