import api from './api';

const categoryService = {
  async getAll() {
    const { data } = await api.get('/categories');
    return data.data || [];
  },
};

export default categoryService;
