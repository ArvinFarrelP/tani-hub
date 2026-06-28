import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { colors } from '../../utils/theme';
import useResponsive from '../../hooks/useResponsive';

const ROLE_HOME = {
  farmer: '/farmer/dashboard',
  buyer:  '/buyer/marketplace',
  admin:  '/admin/dashboard',
};

export default function LoginPage() {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const from       = location.state?.from?.pathname;
  const { isMobile } = useResponsive();

  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { user, token } = await authService.login(form.email, form.password);
      login(user, token);
      navigate(from || ROLE_HOME[user.role] || '/', { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || 'Email atau password salah. Silakan coba lagi.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Branding */}
      <div style={{ textAlign: 'center', marginBottom: isMobile ? 20 : 28 }}>
        <div style={{ fontSize: isMobile ? 40 : 52, marginBottom: 8 }}>🌾</div>
        <h1
          style={{
            color: '#fff',
            fontSize: isMobile ? 24 : 30,
            fontWeight: 900,
            margin: '0 0 4px',
            letterSpacing: -1,
          }}
        >
          Tani Hub
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: isMobile ? 13 : 14 }}>
          Platform Agritech — Petani ke Pembeli
        </p>
      </div>

      <div
        style={{
          background: 'rgba(255,255,255,0.97)',
          borderRadius: 24,
          padding: isMobile ? '24px 20px 24px' : '32px 32px 28px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
        }}
      >
        {/* Masuk / Daftar toggle */}
        <div
          style={{
            display: 'flex',
            background: colors.bg,
            borderRadius: 12,
            padding: 4,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              flex: 1,
              padding: '8px 0',
              borderRadius: 10,
              background: colors.white,
              textAlign: 'center',
              fontSize: 14,
              fontWeight: 600,
              color: colors.primary,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            Masuk
          </div>
          <Link
            to="/register"
            style={{
              flex: 1,
              padding: '8px 0',
              textAlign: 'center',
              fontSize: 14,
              fontWeight: 600,
              color: colors.textMuted,
              textDecoration: 'none',
            }}
          >
            Daftar
          </Link>
        </div>

        {/* Error banner */}
        {error && (
          <div
            style={{
              background: '#FEE2E2',
              color: '#DC2626',
              padding: '10px 14px',
              borderRadius: 10,
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            placeholder="email@contoh.com"
            value={form.email}
            onChange={set('email')}
            autoComplete="email"
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Password Anda"
            value={form.password}
            onChange={set('password')}
            autoComplete="current-password"
            required
          />
          <Button
            type="submit"
            fullWidth
            disabled={loading}
            style={{ marginTop: 4, fontSize: 15, padding: '12px 0' }}
          >
            {loading ? '⏳ Memproses...' : 'Masuk'}
          </Button>
        </form>
      </div>
    </>
  );
}