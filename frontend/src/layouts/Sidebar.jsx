import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { colors } from '../utils/theme';

const NAV = {
  farmer: [
    { path: '/farmer/dashboard',    icon: '📊', label: 'Dashboard' },
    { path: '/farmer/products',     icon: '🌱', label: 'Produk Saya' },
    { path: '/farmer/products/new', icon: '➕', label: 'Tambah Produk' },
    { path: '/farmer/orders',       icon: '📦', label: 'Pesanan Masuk' },
    { path: '/profile',             icon: '👤', label: 'Profil' },
  ],
  buyer: [
    { path: '/buyer/marketplace',   icon: '🏪', label: 'Marketplace' },
    { path: '/buyer/orders',        icon: '📋', label: 'Pesanan Saya' },
    { path: '/buyer/suppliers',     icon: '👨‍🌾', label: 'Supplier' },
    { path: '/profile',             icon: '👤', label: 'Profil' },
  ],
  admin: [
    { path: '/admin/dashboard',     icon: '📊', label: 'Dashboard' },
    { path: '/admin/users',         icon: '👥', label: 'Kelola User' },
    { path: '/admin/products',      icon: '🌾', label: 'Kelola Produk' },
    { path: '/admin/transactions',  icon: '💰', label: 'Transaksi' },
  ],
};

const ROLE_LABEL = {
  farmer: '👨‍🌾 Petani',
  buyer:  '🏪 Pembeli',
  admin:  '⚙️ Admin',
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const { pathname } = useLocation();

  const navItems = NAV[user?.role] || [];

  const isActive = (path) => pathname === path || pathname.startsWith(path + '/');

  return (
    <aside
      style={{
        width: 260,
        minHeight: '100vh',
        background: colors.primaryDark,
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 40, height: 40,
              background: colors.primaryLight,
              borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22,
            }}
          >
            🌾
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 18, lineHeight: 1.1 }}>
              Tani Hub
            </div>
            <div style={{ color: colors.accent, fontSize: 11, fontWeight: 500 }}>
              Agritech Platform
            </div>
          </div>
        </div>
      </div>

      {/* User chip */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 38, height: 38, borderRadius: '50%',
              background: colors.primaryLight,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 700, color: colors.primaryDark,
              flexShrink: 0,
            }}
          >
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                color: '#fff', fontSize: 13, fontWeight: 600,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}
            >
              {user?.name}
            </div>
            <div style={{ fontSize: 11, color: colors.accent }}>
              {ROLE_LABEL[user?.role]}
              {user?.is_verified && <span style={{ marginLeft: 4, color: '#60D394' }}>✓</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '12px' }}>
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                width: '100%', padding: '11px 14px', marginBottom: 2,
                borderRadius: 10, border: 'none', cursor: 'pointer',
                background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: active ? '#fff' : 'rgba(255,255,255,0.65)',
                fontSize: 14, fontWeight: active ? 600 : 400,
                textAlign: 'left', transition: 'all 0.15s ease',
                fontFamily: 'inherit',
              }}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
              {active && (
                <span
                  style={{
                    marginLeft: 'auto', width: 6, height: 6,
                    borderRadius: '50%', background: colors.primaryLight,
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Future features teaser */}
      <div
        style={{
          margin: '0 12px 12px',
          background: 'rgba(255,255,255,0.07)',
          borderRadius: 12, padding: '14px 16px',
        }}
      >
        <div style={{ color: colors.accent, fontSize: 11, fontWeight: 700, letterSpacing: 0.5, marginBottom: 8 }}>
          ✨ SEGERA HADIR
        </div>
        {['🤖 Prediksi Harga AI', '📊 Estimasi Panen', '🚚 Integrasi Logistik'].map((f) => (
          <div key={f} style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, padding: '3px 0' }}>
            {f}
          </div>
        ))}
      </div>

      {/* Logout */}
      <div style={{ padding: '12px 12px 20px' }}>
        <button
          onClick={logout}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            width: '100%', padding: '11px 14px', borderRadius: 10,
            border: 'none', cursor: 'pointer',
            background: 'rgba(239,68,68,0.15)',
            color: '#FCA5A5', fontSize: 14, fontWeight: 600,
            fontFamily: 'inherit',
          }}
        >
          🚪 Keluar
        </button>
      </div>
    </aside>
  );
}
