import api from './api';

const userService = {
  async getFarmers() {
    const { data } = await api.get('/users/farmers');
    return data.data || [];
  },

  async updateProfile(payload) {
    const { data } = await api.put('/users/profile', payload);
    return data.data;
  },

  async changePassword(payload) {
    const { data } = await api.put('/users/change-password', payload);
    return data;
  },
};

export default userService;
