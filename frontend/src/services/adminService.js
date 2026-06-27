import api from './api';

const adminService = {
  async getStats() {
    const { data } = await api.get('/admin/stats');
    return data.data;
  },

  async getAllUsers() {
    const { data } = await api.get('/admin/users');
    return data.data || [];
  },

  async verifySupplier(id) {
    const { data } = await api.put(`/admin/users/${id}/verify`);
    return data.data;
  },

  async toggleUserStatus(id) {
    const { data } = await api.put(`/admin/users/${id}/toggle`);
    return data.data;
  },

  async getAllTransactions() {
    const { data } = await api.get('/admin/transactions');
    return data.data || [];
  },

  async getAllProducts() {
    const { data } = await api.get('/products');
    return data.data || [];
  },

  async deleteProduct(id) {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },
};

export default adminService;
