const res = {
  id: 13,
  date: '2026-05-20T00:00:00.000Z',
  totalClients: 2,
  successfulCount: 1,
  failedCount: 1,
  totalAmount: 5,
  disabledPeers: [
    {
      peerId: 6,
      reason: 'Negative balance',
      clientId: 13,
      newBalance: -1,
    },
  ],
  failedDetails: [
    {
      step: 'disable_peer',
      error: 'connect ECONNREFUSED 87.58.216.13:3010',
      clientId: 21,
    },
  ],
  status: 'COMPLETED',
  error: null,
  createdAt: '2026-05-20T13:55:23.479Z',
  updatedAt: '2026-05-20T13:55:23.479Z',
};
