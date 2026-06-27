import React, { useState, useEffect } from 'react';
import adminService     from '../../services/adminService';
import StatCard         from '../../components/ui/StatCard';
import Card             from '../../components/ui/Card';
import Button           from '../../components/ui/Button';
import PageHeader       from '../../components/common/PageHeader';
import { StatusBadge }  from '../../components/ui/Badge';
import { colors, statusConfig } from '../../utils/theme';
import { formatRupiah } from '../../utils/formatters';

export default function AdminDashboardPage() {
  const [stats, setStats]               = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    Promise.all([
      adminService.getStats(),
      adminService.getAllTransactions(),
    ])
      .then(([s, txns]) => {
        setStats(s);
        setTransactions((txns || []).slice(0, 5));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const kpiCards = stats ? [
    { icon: '👥', label: 'Total Pengguna',   value: String(Number(stats.users?.total || 0)),                                                        color: '#3B82F6' },
    { icon: '👨‍🌾', label: 'Petani Aktif',   value: String(Number(stats.users?.farmers || 0)),  sub: 'terverifikasi & aktif',                       color: '#2D6A4F' },
    { icon: '🏪', label: 'Pembeli Aktif',    value: String(Number(stats.users?.buyers  || 0)),  sub: 'Hotel, Resto, Supermarket',                    color: '#8B5E3C' },
    { icon: '🌾', label: 'Total Produk',     value: String(Number(stats.products?.total || 0)), sub: `${stats.products?.active || 0} aktif`,         color: '#10B981' },
    { icon: '📦', label: 'Total Transaksi',  value: String(Number(stats.transactions?.total || 0)), sub: `${stats.transactions?.pending || 0} pending`, color: '#8B5CF6' },
    { icon: '💰', label: 'Total Nilai',      value: formatRupiah(Number(stats.revenue?.total || 0)), sub: 'dari pesanan selesai',                     color: '#F59E0B' },
  ] : [];

  // Compute status distribution from loaded transactions
  const allTxns = transactions;
  const totalTxns = allTxns.length || 1;

  return (
    <div>
      <PageHeader
        title="⚙️ Admin Dashboard"
        subtitle="Monitor dan kelola seluruh aktivitas platform Tani Hub"
      />

      {/* KPI grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ height: 88, background: colors.bg, borderRadius: 16, border: `1px solid ${colors.border}` }} />
            ))
          : kpiCards.map((s) => <StatCard key={s.label} {...s} />)
        }
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>

        {/* Status distribution */}
        <Card style={{ padding: '20px 22px' }}>
          <h3 style={{ margin: '0 0 18px', fontSize: 16, fontWeight: 700, color: colors.text }}>
            📊 Distribusi Status Pesanan
          </h3>
          {Object.entries(statusConfig).map(([s, cfg]) => {
            const count = transactions.filter((t) => t.status === s).length;
            const pct   = Math.round((count / totalTxns) * 100);
            return (
              <div key={s} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{cfg.label}</span>
                  <span style={{ fontSize: 13, color: colors.textMuted }}>{count} pesanan</span>
                </div>
                <div style={{ height: 8, background: colors.bg, borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct || 5}%`, background: cfg.color, borderRadius: 4, transition: 'width 0.6s ease' }} />
                </div>
              </div>
            );
          })}
        </Card>

        {/* Quick actions */}
        <Card style={{ padding: '20px 22px' }}>
          <h3 style={{ margin: '0 0 18px', fontSize: 16, fontWeight: 700, color: colors.text }}>
            ⚡ Aksi Cepat
          </h3>
          {[
            { icon: '👥', text: 'Kelola pengguna & verifikasi petani',   action: 'Kelola', path: '/admin/users',        urgent: true  },
            { icon: '🌾', text: 'Monitor semua produk di marketplace',   action: 'Lihat',  path: '/admin/products',     urgent: false },
            { icon: '💰', text: 'Tinjau semua transaksi platform',       action: 'Tinjau', path: '/admin/transactions', urgent: false },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 2 ? `1px solid ${colors.borderLight}` : 'none' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: item.urgent ? '#FEE2E2' : colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                {item.icon}
              </div>
              <div style={{ flex: 1, fontSize: 13, color: colors.text }}>{item.text}</div>
              <Button size="sm" variant={item.urgent ? 'primary' : 'outline'}>{item.action}</Button>
            </div>
          ))}
        </Card>
      </div>

      {/* Recent transactions */}
      <Card style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 22px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: colors.text }}>💳 Transaksi Terbaru</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: colors.bg }}>
            <tr>
              {['#', 'Produk', 'Petani', 'Pembeli', 'Jumlah', 'Total', 'Status'].map((h) => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: colors.textMuted }}>Memuat...</td></tr>
              )
              : transactions.map((t) => (
                <tr key={t.id} style={{ borderBottom: `1px solid ${colors.borderLight}` }}>
                  <td style={{ padding: '13px 16px', fontSize: 13, color: colors.textMuted }}>#{t.id}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {t.product_image && <img src={t.product_image} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} />}
                      <span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{t.product_name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 13, color: colors.textMuted }}>{t.farmer_name}</td>
                  <td style={{ padding: '13px 16px', fontSize: 13, color: colors.textMuted }}>{t.buyer_name}</td>
                  <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 600 }}>{t.quantity} {t.unit}</td>
                  <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 700, color: colors.primary }}>{formatRupiah(t.total_price)}</td>
                  <td style={{ padding: '13px 16px' }}><StatusBadge status={t.status} /></td>
                </tr>
              ))
            }
          </tbody>
        </table>
        {!loading && transactions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '30px', color: colors.textMuted }}>Belum ada transaksi.</div>
        )}
      </Card>
    </div>
  );
}
