import React, { useState, useEffect } from 'react';
import adminService  from '../../services/adminService';
import Card          from '../../components/ui/Card';
import PageHeader    from '../../components/common/PageHeader';
import { StatusBadge } from '../../components/ui/Badge';
import { colors, statusConfig } from '../../utils/theme';
import { formatRupiah, formatDate } from '../../utils/formatters';
import useResponsive from '../../hooks/useResponsive';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState('all');
  const { isMobile, isTablet } = useResponsive();

  useEffect(() => {
    adminService.getAllTransactions()
      .then(setTransactions)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered    = filter === 'all' ? transactions : transactions.filter((t) => t.status === filter);
  const totalValue  = transactions.reduce((sum, t) => sum + Number(t.total_price || 0), 0);

  return (
    <div>
      <PageHeader
        title="💰 Kelola Transaksi"
        subtitle={loading ? 'Memuat...' : `${transactions.length} transaksi • Total: ${formatRupiah(totalValue)}`}
      />

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[['all', 'Semua'], ...Object.entries(statusConfig).map(([k, v]) => [k, v.label])].map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)}
            style={{
              padding: '7px 16px', borderRadius: 20,
              border: `1.5px solid ${filter === key ? colors.primary : colors.border}`,
              background: filter === key ? colors.primary : '#fff',
              color: filter === key ? '#fff' : colors.text,
              fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <Card style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: colors.textMuted }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
            <div>Memuat transaksi...</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? 800 : '100%' }}>
              <thead style={{ background: colors.bg }}>
                <tr>
                  {['#', 'Produk', 'Petani', 'Pembeli', 'Qty', 'Total', 'Status', 'Tanggal'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '13px 16px', fontSize: 12, fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: `1px solid ${colors.border}`, whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id}
                    style={{ borderBottom: `1px solid ${colors.borderLight}`, transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = colors.bg}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '13px 16px', fontSize: 13, color: colors.textMuted, whiteSpace: 'nowrap' }}>#{t.id}</td>
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {t.product_image && (
                          <img src={t.product_image} alt="" style={{ width: 38, height: 38, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                        )}
                        <span style={{ fontSize: 13, fontWeight: 600, color: colors.text, whiteSpace: 'nowrap' }}>{t.product_name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '13px 16px', fontSize: 13, color: colors.textMuted, whiteSpace: 'nowrap' }}>{t.farmer_name}</td>
                    <td style={{ padding: '13px 16px', fontSize: 13, color: colors.textMuted, whiteSpace: 'nowrap' }}>{t.buyer_name}</td>
                    <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>{t.quantity} {t.unit}</td>
                    <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 700, color: colors.primary, whiteSpace: 'nowrap' }}>{formatRupiah(t.total_price)}</td>
                    <td style={{ padding: '13px 16px' }}><StatusBadge status={t.status} /></td>
                    <td style={{ padding: '13px 16px', fontSize: 12, color: colors.textMuted, whiteSpace: 'nowrap' }}>{formatDate(t.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: colors.textMuted }}>
                Tidak ada transaksi untuk filter ini.
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}