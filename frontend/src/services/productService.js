import api from './api';

const productService = {
  /** GET /api/products — accepts filter params: search, category, quality, sort, page, limit */
  async getAll(params = {}) {
    const { data } = await api.get('/products', { params });
    // API returns { success, data: [...], pagination }
    return data;
  },

  /** GET /api/products/my-products — farmer's own products */
  async getMyProducts() {
    const { data } = await api.get('/products/my-products');
    return data.data || [];
  },

  /** GET /api/products/:id */
  async getById(id) {
    const { data } = await api.get(`/products/${id}`);
    return data.data;
  },

  /** POST /api/products — multipart/form-data (FormData) */
  async create(formData) {
    const { data } = await api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  /** PUT /api/products/:id — multipart/form-data (FormData) */
  async update(id, formData) {
    const { data } = await api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  /** DELETE /api/products/:id */
  async remove(id) {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },
};

export default productService;
