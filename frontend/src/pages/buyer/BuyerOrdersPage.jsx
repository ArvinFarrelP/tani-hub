import React, { useState, useEffect } from 'react';
import transactionService from '../../services/transactionService';
import OrderRow   from '../../components/common/OrderRow';
import PageHeader from '../../components/common/PageHeader';
import Toast      from '../../components/ui/Toast';
import { useToast } from '../../hooks/useToast';
import { statusConfig } from '../../utils/theme';

const FILTERS = [
  ['all', 'Semua'],
  ...Object.entries(statusConfig).map(([k, v]) => [k, v.label]),
];

export default function BuyerOrdersPage() {
  const { toast, showToast } = useToast();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');

useEffect(() => {
  transactionService
    .getMyTransactions()
    .then(setOrders)
    .catch(() => showToast('Gagal memuat pesanan', 'error'))
    .finally(() => setLoading(false));
}, [showToast]);

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const handleRate = (id) => showToast('Terima kasih! Rating berhasil dikirim ⭐');

  const colors = {
    pending:   '#F59E0B',
    processed: '#8B5CF6',
    delivered: '#10B981',
    primary:   '#2D6A4F',
  };

  return (
    <div>
      <Toast {...toast} />

      <PageHeader
        title="📋 Pesanan Saya"
        subtitle={loading ? 'Memuat...' : `${orders.length} total transaksi`}
      />

      {/* Summary strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Semua',    value: orders.length,                                                          color: colors.primary   },
          { label: 'Menunggu', value: orders.filter(o => o.status === 'pending').length,                      color: colors.pending   },
          { label: 'Diproses', value: orders.filter(o => ['confirmed','processing'].includes(o.status)).length, color: colors.processed },
          { label: 'Selesai',  value: orders.filter(o => o.status === 'delivered').length,                    color: colors.delivered },
        ].map((s) => (
          <div key={s.label} style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:14, padding:'16px 20px', display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:42, height:42, borderRadius:12, background:`${s.color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:800, color:s.color }}>
              {s.value}
            </div>
            <span style={{ fontSize:13, color:'#6B7280', fontWeight:500 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {FILTERS.map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)}
            style={{
              padding: '7px 16px', borderRadius: 20,
              border: `1.5px solid ${filter === key ? '#2D6A4F' : '#E5E7EB'}`,
              background: filter === key ? '#2D6A4F' : '#fff',
              color: filter === key ? '#fff' : '#1A1A2E',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#6B7280' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
          <div>Memuat pesanan...</div>
        </div>
      )}

      {!loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((t) => (
            <OrderRow key={t.id} transaction={t} viewAs="buyer" onRate={handleRate} />
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#6B7280' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>Tidak ada pesanan</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
