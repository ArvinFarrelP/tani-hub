import React, { useState, useEffect } from 'react';
import { useNavigate }      from 'react-router-dom';
import { useAuth }          from '../../context/AuthContext';
import productService       from '../../services/productService';
import transactionService   from '../../services/transactionService';
import StatCard             from '../../components/ui/StatCard';
import Card                 from '../../components/ui/Card';
import PageHeader           from '../../components/common/PageHeader';
import Button               from '../../components/ui/Button';
import { StatusBadge }      from '../../components/ui/Badge';
import { colors }           from '../../utils/theme';
import { formatRupiah }     from '../../utils/formatters';
import useResponsive from '../../hooks/useResponsive';

export default function FarmerDashboardPage() {
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const { isMobile, isTablet } = useResponsive();

  const [myProducts,    setMyProducts]    = useState([]);
  const [recentOrders,  setRecentOrders]  = useState([]);
  const [stats,         setStats]         = useState({ totalProducts: 0, pendingOrders: 0, revenue: 0, avgRating: 0 });
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([
      productService.getMyProducts(),
      transactionService.getMyTransactions(),
    ])
      .then(([products, transactions]) => {
        setMyProducts(products.slice(0, 4));

        const pending   = transactions.filter(t => t.status === 'pending').length;
        const revenue   = transactions
          .filter(t => t.status === 'delivered')
          .reduce((sum, t) => sum + Number(t.total_price), 0);

        setRecentOrders(transactions.slice(0, 3));
        setStats({
          totalProducts: products.length,
          pendingOrders: pending,
          revenue,
          avgRating: 0, // extend with ratings endpoint if available
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const kpiCards = [
    { icon: '🌱', label: 'Total Produk',     value: loading ? '...' : String(stats.totalProducts), sub: 'produk aktif',              color: '#2D6A4F' },
    { icon: '📦', label: 'Pesanan Masuk',    value: loading ? '...' : String(stats.pendingOrders),  sub: 'menunggu konfirmasi',        color: '#F59E0B' },
    { icon: '💰', label: 'Total Pendapatan', value: loading ? '...' : formatRupiah(stats.revenue),  sub: 'dari pesanan selesai',       color: '#10B981' },
    { icon: '📋', label: 'Total Transaksi',  value: loading ? '...' : String(recentOrders.length),  sub: 'semua transaksi',            color: '#8B5CF6' },
  ];

  return (
    <div>
      <PageHeader
        title={`Selamat datang, ${user.name}! 👋`}
        subtitle="Pantau performa kebun dan kelola pesanan Anda"
      />

      {!user.is_verified && (
        <div style={{ background: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: 14, padding: '14px 18px', marginBottom: 24, display: 'flex', gap: 12, alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row' }}>
          <span style={{ fontSize: 24 }}>⚠️</span>
          <div>
            <div style={{ fontWeight: 700, color: '#92400E', fontSize: 14 }}>Akun belum terverifikasi</div>
            <div style={{ fontSize: 13, color: '#B45309' }}>Produk Anda belum tampil di marketplace. Tunggu verifikasi dari admin.</div>
          </div>
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile
          ? '1fr'
          : isTablet
          ? 'repeat(2, 1fr)'
          : 'repeat(4, 1fr)',
        gap: 16, 
        marginBottom: 28 
      }}>
        {kpiCards.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile
          ? '1fr'
          : '1fr 1fr',
        gap: 20 
      }}>

        {/* Recent orders */}
        <Card style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: colors.text }}>📋 Pesanan Terbaru</h3>
            <Button size="sm" variant="ghost" onClick={() => navigate('/farmer/orders')}>Lihat semua →</Button>
          </div>
          {loading && <div style={{ color: colors.textMuted, fontSize: 13 }}>Memuat...</div>}
          {!loading && recentOrders.length === 0 && (
            <div style={{ color: colors.textMuted, fontSize: 13 }}>Belum ada pesanan masuk.</div>
          )}
          {recentOrders.map((t, i) => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < recentOrders.length - 1 ? `1px solid ${colors.borderLight}` : 'none' }}>
              {t.product_image ? (
                <img src={t.product_image} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 44, height: 44, borderRadius: 10, background: colors.primaryXLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🌿</div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.product_name}</div>
                <div style={{ fontSize: 12, color: colors.textMuted }}>{t.buyer_name} • {t.quantity} {t.unit}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <StatusBadge status={t.status} />
                <div style={{ fontSize: 12, fontWeight: 700, color: colors.primary, marginTop: 4 }}>{formatRupiah(t.total_price)}</div>
              </div>
            </div>
          ))}
        </Card>

        {/* Top products */}
        <Card style={{ padding: '20px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: colors.text }}>📈 Produk Saya</h3>
            <Button size="sm" variant="ghost" onClick={() => navigate('/farmer/products')}>Kelola →</Button>
          </div>
          {loading && <div style={{ color: colors.textMuted, fontSize: 13 }}>Memuat...</div>}
          {!loading && myProducts.length === 0 && (
            <div style={{ color: colors.textMuted, fontSize: 13 }}>Belum ada produk. <button onClick={() => navigate('/farmer/products/new')} style={{ background: 'none', border: 'none', color: colors.primary, cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' }}>Tambah sekarang →</button></div>
          )}
          {myProducts.map((p, i) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < myProducts.length - 1 ? `1px solid ${colors.borderLight}` : 'none' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, background: i === 0 ? '#FEF3C7' : colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: i === 0 ? '#D97706' : colors.textMuted }}>
                {i + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: colors.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                <div style={{ fontSize: 12, color: colors.textMuted }}>Stok: {Number(p.stock).toLocaleString()} {p.unit}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: colors.primary, flexShrink: 0 }}>{formatRupiah(p.price)}/{p.unit}</div>
            </div>
          ))}
        </Card>

      </div>
    </div>
  );
}