import api from './api';

/**
 * Calls that touch /api/auth.
 *
 * Backend response shape:
 *   { success: true, data: { user: { id, name, role, ... }, token: "..." } }
 *
 * Both login() and register() return { user, token } so callers can do:
 *   const { user, token } = await authService.login(email, password);
 *   login(user, token);   // AuthContext
 */
const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    // data.data === { user: {...}, token: "..." }
    const { user, token } = data.data;
    return { user, token };
  },

  async register(payload) {
    const { data } = await api.post('/auth/register', payload);
    const { user, token } = data.data;
    return { user, token };
  },

  async getMe() {
    const { data } = await api.get('/auth/me');
    return data.data;
  },
};

export default authService;
