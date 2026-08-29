export const initialState = {
  merchant: { id: 'merchant-demo', name: 'Northstar Goods', currency: 'USD' },
  webmcpAvailable: typeof document !== 'undefined' && typeof document.modelContext?.registerTool === 'function',
  cases: [
    { id: 'EX-1042', orderId: 'ORD-1042', category: 'Duplicate payment', priority: 'High', sla: '2h', state: 'Open', customer: 'Maya Rao', summary: 'Customer was charged twice for the same order.' },
    { id: 'EX-1039', orderId: 'ORD-1039', category: 'Delivery delay', priority: 'Medium', sla: '5h', state: 'Open', customer: 'Daniel Kim', summary: 'Shipment missed the estimated delivery date.' },
    { id: 'EX-1034', orderId: 'ORD-1034', category: 'Refund review', priority: 'Low', sla: 'Tomorrow', state: 'Open', customer: 'Priya Shah', summary: 'Refund is pending provider confirmation.' },
    { id: 'EX-1021', orderId: 'ORD-1021', category: 'Return exception', priority: 'Medium', sla: 'Tomorrow', state: 'Open', customer: 'Amelia Stone', summary: 'Return request is outside the standard policy window.' },
    { id: 'EX-1018', orderId: 'ORD-1018', category: 'Inventory mismatch', priority: 'Low', sla: '2 days', state: 'Open', customer: 'Leo Martin', summary: 'Available stock differs between two fulfillment locations.' }
  ],
  orders: {
    'ORD-1042': { id: 'ORD-1042', customer: 'Maya Rao', total: 248.0, placedAt: '2026-08-28 09:32', items: ['Everyday Carry Set', 'Canvas Pouch'], channel: 'Online store' },
    'ORD-1039': { id: 'ORD-1039', customer: 'Daniel Kim', total: 86.0, placedAt: '2026-08-27 14:10', items: ['Travel Organizer'], channel: 'Online store' },
    'ORD-1034': { id: 'ORD-1034', customer: 'Priya Shah', total: 129.0, placedAt: '2026-08-26 11:05', items: ['Canvas Weekender'], channel: 'Online store' },
    'ORD-1021': { id: 'ORD-1021', customer: 'Amelia Stone', total: 64.0, placedAt: '2026-08-24 16:42', items: ['Desk Organizer'], channel: 'Online store' },
    'ORD-1018': { id: 'ORD-1018', customer: 'Leo Martin', total: 310.0, placedAt: '2026-08-22 08:18', items: ['Travel Collection'], channel: 'Online store' }
  },
  payments: {
    'ORD-1042': [
      { id: 'PAY-881', type: 'Charge', status: 'Settled', amount: 248.0, at: 'Aug 28 · 09:32' },
      { id: 'PAY-882', type: 'Charge', status: 'Pending reversal', amount: 248.0, at: 'Aug 28 · 09:33', duplicateOf: 'PAY-881' }
    ],
    'ORD-1039': [{ id: 'PAY-861', type: 'Charge', status: 'Settled', amount: 86.0, at: 'Aug 27 · 14:10' }],
    'ORD-1034': [{ id: 'PAY-842', type: 'Charge', status: 'Failed', amount: 129.0, at: 'Aug 26 · 11:05', reason: 'Provider timeout' }],
    'ORD-1021': [{ id: 'PAY-821', type: 'Charge', status: 'Settled', amount: 64.0, at: 'Aug 24 · 16:42' }],
    'ORD-1018': [{ id: 'PAY-818', type: 'Charge', status: 'Settled', amount: 310.0, at: 'Aug 22 · 08:18' }]
  },
  shipments: {
    'ORD-1042': [{ id: 'SHP-1042', status: 'Delivered', carrier: 'ParcelPath', estimated: 'Aug 30', delivered: 'Aug 29' }],
    'ORD-1039': [{ id: 'SHP-1039', status: 'Delayed', carrier: 'ParcelPath', estimated: 'Aug 29', latestScan: 'Aug 30 · Hub delay' }],
    'ORD-1034': [{ id: 'SHP-1034', status: 'In transit', carrier: 'ParcelPath', estimated: 'Sep 1', latestScan: 'Aug 28 · Departed hub' }],
    'ORD-1021': [{ id: 'SHP-1021', status: 'Delivered', carrier: 'ParcelPath', estimated: 'Aug 27', delivered: 'Aug 26' }],
    'ORD-1018': [{ id: 'SHP-1018', status: 'Delivered', carrier: 'ParcelPath', estimated: 'Aug 25', delivered: 'Aug 24' }]
  },
  policies: { refundWindowDays: 30, duplicatePayment: 'Refund the settled duplicate charge after verification.' },
  apps: [
    { id: 'APP-01', name: 'Reviews Plus', category: 'Reviews', monthly: 49 },
    { id: 'APP-02', name: 'Smart Promotions', category: 'Promotions', monthly: 79 },
    { id: 'APP-03', name: 'Conversion Suite', category: 'Promotions + analytics', monthly: 129 }
  ],
  fees: [
    { id: 'FEE-2026-08', name: 'Payment processing fees', category: 'Transaction fees', monthly: 78.4, basis: 'Seeded August processing summary' },
    { id: 'FEE-PLATFORM-08', name: 'Platform plan', category: 'Platform', monthly: 39, basis: 'Seeded August platform invoice' }
  ],
  supportCases: [
    { id: 'CASE-2207', orderId: 'ORD-1042', category: 'Payment hold', status: 'Open', notes: ['Customer reported duplicate charge.', 'Payment provider reference PAY-882 pending reversal.'], escalationHistory: [] },
    { id: 'CASE-2199', orderId: 'ORD-1039', category: 'Delivery delay', status: 'Waiting on carrier', notes: ['Customer contacted support on Aug 30.'], escalationHistory: ['Carrier inquiry opened Aug 30.'] },
    { id: 'CASE-2188', orderId: 'ORD-1034', category: 'Payment failure', status: 'Open', notes: ['Checkout failed after provider timeout.'], escalationHistory: [] }
  ],
  evidence: {
    'ORD-1042': ['order:ORD-1042', 'payment:PAY-881', 'payment:PAY-882', 'policy:duplicate-payment'],
    'ORD-1039': ['order:ORD-1039', 'shipment:SHP-1039', 'case:CASE-2199'],
    'ORD-1034': ['order:ORD-1034', 'payment:PAY-842', 'case:CASE-2188']
  },
  audit: []
};

export function cloneInitialState() {
  return structuredClone(initialState);
}
