import api from './api';

const transactionService = {
  /** GET /api/transactions — returns caller's transactions (farmer or buyer, determined by JWT) */
  async getMyTransactions() {
    const { data } = await api.get('/transactions');
    return data.data || [];
  },

  /** POST /api/transactions */
  async create(payload) {
    const { data } = await api.post('/transactions', payload);
    return data.data;
  },

  /** PUT /api/transactions/:id/status */
  async updateStatus(id, status) {
    const { data } = await api.put(`/transactions/${id}/status`, { status });
    return data.data;
  },
};

export default transactionService;
