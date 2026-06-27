import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { colors } from '../../utils/theme';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: colors.bg, textAlign: 'center', padding: 20,
    }}>
      <div style={{ fontSize: 80, marginBottom: 16 }}>🌾</div>
      <h1 style={{ fontSize: 72, fontWeight: 900, color: colors.primary, margin: '0 0 8px', lineHeight: 1 }}>404</h1>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: colors.text, margin: '0 0 10px' }}>Halaman Tidak Ditemukan</h2>
      <p style={{ color: colors.textMuted, fontSize: 15, marginBottom: 28, maxWidth: 380 }}>
        Sepertinya halaman yang kamu cari sudah dipanen atau dipindahkan ke lahan lain.
      </p>
      <Button onClick={() => navigate(-1)}>← Kembali</Button>
    </div>
  );
}
