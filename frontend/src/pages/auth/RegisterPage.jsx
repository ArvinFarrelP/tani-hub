import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import Button from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { colors } from '../../utils/theme';

const ROLE_HOME = {
  farmer: '/farmer/dashboard',
  buyer:  '/buyer/marketplace',
  admin:  '/admin/dashboard',
};

export default function RegisterPage() {
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const [form, setForm]       = useState({ name: '', email: '', password: '', role: 'buyer' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 8) {
      setError('Password minimal 8 karakter.');
      return;
    }

    setLoading(true);
    try {
      const { user, token } = await authService.register(form);
      login(user, token);
      navigate(ROLE_HOME[user.role] || '/', { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Branding */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 52, marginBottom: 10 }}>🌾</div>
        <h1
          style={{
            color: '#fff',
            fontSize: 30,
            fontWeight: 900,
            margin: '0 0 6px',
            letterSpacing: -1,
          }}
        >
          Tani Hub
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: 14 }}>
          Daftarkan akun Anda sekarang
        </p>
      </div>

      <div
        style={{
          background: 'rgba(255,255,255,0.97)',
          borderRadius: 24,
          padding: '32px 32px 28px',
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
          <Link
            to="/login"
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
            Masuk
          </Link>
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
            Daftar
          </div>
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

        {/* Register form */}
        <form onSubmit={handleSubmit}>
          <Input
            label="Nama Lengkap / Nama Bisnis *"
            placeholder="Contoh: Budi Santoso"
            value={form.name}
            onChange={set('name')}
            autoComplete="name"
            required
          />
          <Input
            label="Email *"
            type="email"
            placeholder="email@contoh.com"
            value={form.email}
            onChange={set('email')}
            autoComplete="email"
            required
          />
          <Input
            label="Password *"
            type="password"
            placeholder="Min. 8 karakter"
            value={form.password}
            onChange={set('password')}
            autoComplete="new-password"
            required
          />
          <Select label="Daftar sebagai *" value={form.role} onChange={set('role')}>
            <option value="farmer">👨‍🌾 Petani / Supplier</option>
            <option value="buyer">🏪 Pembeli (Hotel/Resto/Supermarket)</option>
          </Select>

          {form.role === 'farmer' && (
            <div
              style={{
                background: '#FEF3C7',
                border: '1px solid #F59E0B',
                borderRadius: 10,
                padding: '10px 14px',
                marginBottom: 16,
                fontSize: 13,
                color: '#92400E',
              }}
            >
              ⚠️ Akun petani memerlukan verifikasi admin sebelum produk tampil di marketplace.
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            disabled={loading}
            style={{ fontSize: 15, padding: '12px 0' }}
          >
            {loading ? '⏳ Memproses...' : '✨ Daftar Sekarang'}
          </Button>
        </form>
      </div>
    </>
  );
}
