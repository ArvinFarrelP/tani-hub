import React, { useState, useEffect, useCallback } from 'react';
import transactionService from '../../services/transactionService';
import Toast      from '../../components/ui/Toast';
import OrderRow   from '../../components/common/OrderRow';
import PageHeader from '../../components/common/PageHeader';
import { useToast }     from '../../hooks/useToast';
import { statusConfig } from '../../utils/theme';
import useResponsive from '../../hooks/useResponsive';

const FILTERS = [['all', 'Semua'], ...Object.entries(statusConfig).map(([k, v]) => [k, v.label])];

export default function FarmerOrdersPage() {
  const { toast, showToast } = useToast();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');
  const { isMobile, isTablet } = useResponsive();

  const load = useCallback(() => {
    setLoading(true);
    transactionService.getMyTransactions()
      .then(setOrders)
      .catch(() => showToast('Gagal memuat pesanan', 'error'))
      .finally(() => setLoading(false));
 }, [showToast]);

  useEffect(load, [load]);

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const handleConfirm = async (id) => {
    try {
      await transactionService.updateStatus(id, 'confirmed');
      showToast('Pesanan dikonfirmasi! ✓');
      load();
    } catch {
      showToast('Gagal mengkonfirmasi pesanan', 'error');
    }
  };

  return (
    <div>
      <Toast {...toast} />

      <PageHeader
        title="📦 Pesanan Masuk"
        subtitle={loading ? 'Memuat...' : `${orders.length} total pesanan`}
      />

      <div style={{ 
        display: 'flex', 
        gap: 8, 
        marginBottom: 20, 
        flexWrap: 'wrap',
        justifyContent: isMobile ? 'center' : 'flex-start',
      }}>
        {FILTERS.map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)}
            style={{
              padding: isMobile ? '6px 14px' : '7px 16px', 
              borderRadius: 20,
              border: `1.5px solid ${filter === key ? '#2D6A4F' : '#E5E7EB'}`,
              background: filter === key ? '#2D6A4F' : '#fff',
              color: filter === key ? '#fff' : '#1A1A2E',
              fontSize: isMobile ? 12 : 13, 
              fontWeight: 600, 
              cursor: 'pointer', 
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
              flex: isMobile ? '1' : 'auto',
              textAlign: 'center',
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
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 12,
          padding: isMobile ? '0 4px' : '0',
        }}>
          {filtered.map((t) => (
            <OrderRow key={t.id} transaction={t} viewAs="farmer" onConfirm={handleConfirm} />
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