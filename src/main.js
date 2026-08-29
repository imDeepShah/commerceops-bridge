import './style.css';
import { createStore } from './state.js';
import { checkRefundPolicy, draftCustomerMessage, getCostAudit, getOrderContext, getPaymentTimeline, prepareEscalationPacket, proposeResolution, recordMerchantDecision } from './domain.js';
import { registerWebMcpTools } from './webmcp.js';

const store = createStore();
let selectedCaseId = 'EX-1042';
let notice = 'Ready for investigation.';
let toolTrace = [];
let investigation = null;
let messageDraft = '';
let costAudit = null;
let supportPacket = null;
const app = document.querySelector('#app');
const money = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
const selectedCase = (state) => state.cases.find((item) => item.id === selectedCaseId) ?? state.cases[0];
const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));

function runInvestigation(state, active) {
  const context = getOrderContext(state, active.orderId);
  const timeline = getPaymentTimeline(state, active.orderId);
  const policy = checkRefundPolicy(state, active.orderId, timeline.payments.find((item) => item.duplicateOf)?.amount ?? 0);
  const recommendation = proposeResolution(state, active.id);
  const message = draftCustomerMessage(state, active.id, 'clear and reassuring');
  investigation = { context, timeline, policy, recommendation, message };
  messageDraft = message.draft;
  toolTrace = ['get_order_context', 'get_payment_timeline', 'check_refund_policy', 'propose_resolution', 'draft_customer_message'];
  notice = 'Investigation complete. Review the recommendation before deciding.';
}

function renderInvestigation(result, state, active) {
  const recommendation = result.recommendation;
  return `<div class="investigation-card"><div class="section-title">Investigation result</div><div class="recommendation"><div class="recommendation-head"><strong>${esc(recommendation.action)}</strong><span class="amount-chip">${recommendation.amount ? money(recommendation.amount) : 'No amount'}</span></div><p>${esc(recommendation.rationale)}</p><div class="recommendation-grid"><div><span class="eyebrow">Alternative</span><p>${esc(recommendation.alternative)}</p></div><div><span class="eyebrow">Risk</span><p>${esc(recommendation.risk)}</p></div></div><div class="evidence-row"><span>Evidence</span><span class="success-text">${recommendation.evidence.length} references</span></div></div><div class="policy-row"><strong>Policy check</strong><span class="${result.policy.eligible ? 'success-text' : 'warning-text'}">${result.policy.eligible ? 'Eligible' : 'Not eligible'} · ${esc(result.policy.rule)}</span></div><label class="draft-label" for="message-draft">Customer message draft <span>UNSENT · editable</span></label><textarea id="message-draft" data-action="draft">${esc(messageDraft)}</textarea><div class="decision-row"><button class="button primary" data-decision="approve">Approve preparation</button><button class="button" data-decision="request_changes">Request changes</button><button class="button danger" data-decision="reject">Reject</button></div>${state.audit.filter((item) => item.caseId === active.id).slice(-1).map((item) => `<div class="audit-note">Decision recorded: <strong>${item.decision}</strong> · external action executed: <strong>no</strong></div>`).join('')}</div>`;
}

function renderAudit(state) {
  const events = [...state.audit].reverse();
  return `<div class="audit-trail"><div class="section-title">Decision audit trail</div>${events.length ? events.map((event) => `<div class="audit-event"><div><strong>${esc(event.action.replace('_', ' '))}</strong><small>${esc(event.caseId)} · ${esc(event.actor)} · ${new Date(event.at).toLocaleString()}</small></div><span>External action: no</span></div>`).join('') : '<div class="audit-empty">No merchant decisions recorded yet.</div>'}</div>`;
}

function renderCostAudit(result) {
  return `<div class="cost-audit"><div class="section-title">Operating-cost audit</div><div class="cost-total"><div><span class="eyebrow">Monthly run rate</span><strong>${money(result.monthlyTotal)}</strong></div><div><span class="eyebrow">Annualized</span><strong>${money(result.annualizedTotal)}</strong></div></div>${result.lines.map((line) => `<div class="cost-line"><div><strong>${esc(line.name)}</strong><small>${esc(line.category)} · source ${esc(line.source)}</small></div><b>${money(line.monthly)}/mo</b></div>`).join('')}<div class="cost-recommendation"><span class="eyebrow">Review candidate</span><strong>${esc(result.recommendations[0].action)}</strong><p>${esc(result.recommendations[0].rationale)}</p><small>Estimated saving: ${money(result.recommendations[0].estimatedMonthlySaving)}/mo · ${esc(result.recommendations[0].assumptions)}</small></div></div>`;
}

function renderSupportPacket(packet) {
  return `<div class="support-packet"><div class="section-title">Support escalation packet</div><div class="packet-badge">UNSENT · COPY OR EDIT BEFORE SENDING</div><div class="packet-block"><span class="eyebrow">Facts</span>${packet.facts.map((fact) => `<p>• ${esc(fact)}</p>`).join('')}</div><div class="packet-block"><span class="eyebrow">Interpretation</span><p>${esc(packet.interpretation)}</p></div><label class="draft-label" for="escalation-draft">Editable packet <span>${esc(packet.supportCaseId)}</span></label><textarea id="escalation-draft" data-action="packet-draft">${esc(packet.draft)}</textarea><button class="button full-width" data-action="copy-packet">Copy packet</button><div class="evidence-row"><span>Evidence linked</span><span class="success-text">${packet.evidence.length} references</span></div></div>`;
}

function render() {
  const state = store.getState();
  const active = selectedCase(state);
  const context = state.orders[active.orderId] ? getOrderContext(state, active.orderId) : null;
  const currentInvestigation = investigation?.recommendation?.caseId === active.id ? investigation : null;
  app.innerHTML = `<div class="shell"><header class="topbar"><div class="brand"><div class="brand-mark">C</div><div><strong>CommerceOps Bridge</strong><span>merchant control plane</span></div></div><div class="top-actions"><span class="demo-label">Demo mode · seeded data</span><button class="button secondary" data-action="reset">Reset demo</button></div></header><div class="body"><aside class="sidebar"><div class="eyebrow">Store workspace</div><div class="store-name">${esc(state.merchant.name)}<span>Online store</span></div><nav><button class="nav-item active">Overview</button><button class="nav-item">Exceptions <b>${state.cases.filter((item) => item.state !== 'Resolved').length}</b></button><button class="nav-item">Cost audit</button><button class="nav-item">Support escalation</button></nav><div class="side-foot"><span class="status-dot ${state.webmcpAvailable ? 'live' : ''}"></span>${state.webmcpAvailable ? 'WebMCP detected' : 'WebMCP browser unavailable'}<small>Tools remain documented for the demo.</small></div></aside><main class="content"><div class="page-head"><div><div class="eyebrow">Overview</div><h1>Merchant operations</h1><p>Investigate exceptions with evidence before taking action.</p></div><div class="headline-metrics"><div><strong>${state.cases.length}</strong><span>active signals</span></div><div><strong>${money(state.apps.reduce((sum, item) => sum + item.monthly, 0))}</strong><span>monthly apps</span></div></div></div><section class="workspace-grid"><div class="panel queue-panel"><div class="panel-head"><div><div class="eyebrow">Priority queue</div><h2>Open exceptions</h2></div><span class="count-chip">${state.cases.length} cases</span></div><div class="case-list">${state.cases.map((item) => `<button class="case-row ${item.id === active.id ? 'selected' : ''}" data-case="${item.id}"><span class="priority ${item.priority.toLowerCase()}"></span><span class="case-copy"><strong>${esc(item.category)}</strong><small>${item.id} · ${esc(item.customer)}</small></span><span class="case-meta"><b>${item.sla}</b><small>${item.state}</small></span></button>`).join('')}</div></div><div class="panel detail-panel"><div class="panel-head"><div><div class="eyebrow">Selected exception</div><h2>${esc(active.category)}</h2><span class="subline">${active.id} · ${active.orderId} · SLA ${active.sla}</span></div><span class="state-chip">${active.state}</span></div>${context ? `<div class="summary-box"><div><span class="eyebrow">Customer</span><strong>${esc(context.order.customer)}</strong></div><div><span class="eyebrow">Order total</span><strong>${money(context.order.total)}</strong></div><div><span class="eyebrow">Placed</span><strong>${context.order.placedAt}</strong></div></div><div class="detail-section"><div class="section-title">Payment timeline</div>${context.payments.map((payment) => `<div class="timeline-row"><span class="timeline-dot ${payment.duplicateOf ? 'warning' : ''}"></span><div><strong>${payment.type} · ${payment.status}${payment.duplicateOf ? ' · duplicate' : ''}</strong><small>${payment.id} · ${payment.at}</small></div><b>${money(payment.amount)}</b></div>`).join('')}</div><div class="detail-section"><div class="section-title">Agent-ready context</div><p class="muted">${esc(active.summary)}</p><div class="evidence-row"><span>Evidence linked</span><span class="success-text">${context.evidence.length} source records</span></div></div><button class="button primary full-width" data-action="investigate">${currentInvestigation ? 'Re-run investigation' : 'Run investigation'}</button>${currentInvestigation ? renderInvestigation(currentInvestigation, state, active) : ''}` : '<div class="empty-state">This case will be available in the next feature slice.</div>'}</div></section><section class="lower-grid"><div class="panel agent-panel"><div class="panel-head"><div><div class="eyebrow">Agent workspace</div><h2>Structured tool trace</h2></div><span class="mcp-chip"><span class="status-dot ${state.webmcpAvailable ? 'live' : ''}"></span>${state.webmcpAvailable ? 'Connected' : 'Preview'}</span></div><p class="muted">The agent gathers evidence, prepares a recommendation, and pauses for merchant approval.</p>${toolTrace.length ? `<div class="trace-list">${toolTrace.map((name) => `<div class="trace-row"><span>✓</span><code>${name}</code><small>structured result returned</small></div>`).join('')}</div>` : '<div class="trace-empty">Run an investigation to populate the structured tool trace.</div>'}</div><div class="panel guardrail-panel"><div class="eyebrow">Safety boundary</div><h2>Prepare, then approve</h2><p class="muted">No refund, message, or account change executes from this demo.</p><div class="guardrail"><span>✓</span><div><strong>Human approval required</strong><small>Approval records intent as an audit event; it does not claim the external action completed.</small></div></div></div></section><div class="notice" role="status">${esc(notice)}</div></main></div></div>`;
  app.querySelector('.guardrail-panel').insertAdjacentHTML('beforeend', `<button class="button primary full-width" data-action="cost-audit">${costAudit ? 'Refresh cost audit' : 'Run cost audit'}</button>${costAudit ? renderCostAudit(costAudit) : ''}<button class="button full-width" data-action="support-packet">${supportPacket ? 'Refresh escalation packet' : 'Prepare support packet'}</button>${supportPacket ? renderSupportPacket(supportPacket) : ''}${renderAudit(state)}`);
  wireEvents();
}

function wireEvents() {
  app.querySelectorAll('[data-case]').forEach((button) => button.addEventListener('click', () => { selectedCaseId = button.dataset.case; investigation = null; messageDraft = ''; toolTrace = []; notice = `Loaded ${selectedCaseId}.`; render(); }));
  app.querySelector('[data-action="reset"]').addEventListener('click', () => { store.reset(); selectedCaseId = 'EX-1042'; investigation = null; messageDraft = ''; costAudit = null; supportPacket = null; toolTrace = []; notice = 'Demo reset to the seeded starting state.'; render(); });
  app.querySelector('[data-action="cost-audit"]')?.addEventListener('click', () => { costAudit = getCostAudit(store.getState()); toolTrace = [...toolTrace, 'get_cost_audit']; notice = 'Cost audit complete. Recommendations are advisory only.'; render(); });
  app.querySelector('[data-action="support-packet"]')?.addEventListener('click', () => { supportPacket = prepareEscalationPacket(store.getState(), selectedCaseId); toolTrace = [...toolTrace, 'prepare_escalation_packet']; notice = 'Support packet prepared. Nothing was sent.'; render(); });
  app.querySelector('[data-action="packet-draft"]')?.addEventListener('input', (event) => { if (supportPacket) supportPacket = { ...supportPacket, draft: event.target.value, copyText: event.target.value }; });
  app.querySelector('[data-action="copy-packet"]')?.addEventListener('click', async () => { try { await navigator.clipboard.writeText(supportPacket.copyText); notice = 'Packet copied to clipboard. Nothing was sent.'; } catch { notice = 'Packet ready to copy manually; clipboard permission was unavailable.'; } render(); });
  app.querySelector('[data-action="investigate"]')?.addEventListener('click', () => { runInvestigation(store.getState(), selectedCase(store.getState())); render(); });
  app.querySelector('[data-action="draft"]')?.addEventListener('input', (event) => { messageDraft = event.target.value; });
  app.querySelectorAll('[data-decision]').forEach((button) => button.addEventListener('click', () => { store.setState((state) => recordMerchantDecision(state, selectedCaseId, button.dataset.decision, messageDraft ? 'Reviewed evidence and editable customer draft.' : '')); notice = `Merchant decision recorded: ${button.dataset.decision}.`; render(); }));
}

store.subscribe(render);
render();
registerWebMcpTools(store, (toolName) => { toolTrace = [...toolTrace, toolName]; notice = `${toolName} registered with the page.`; render(); }).then((result) => { store.setState((state) => ({ ...state, webmcpAvailable: result.available })); });
export { money };
