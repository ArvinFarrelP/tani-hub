import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate }  from 'react-router-dom';
import productService   from '../../services/productService';
import Card             from '../../components/ui/Card';
import Button           from '../../components/ui/Button';
import Modal            from '../../components/ui/Modal';
import Toast            from '../../components/ui/Toast';
import PageHeader       from '../../components/common/PageHeader';
import { Badge }        from '../../components/ui/Badge';
import { useToast }     from '../../hooks/useToast';
import { colors }       from '../../utils/theme';
import { formatRupiah } from '../../utils/formatters';

const TABLE_HEADS = ['Produk', 'Kategori', 'Harga', 'Stok', 'Kualitas', 'Status', 'Aksi'];

export default function MyProductsPage() {
  const navigate             = useNavigate();
  const { toast, showToast } = useToast();

  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]       = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    productService.getMyProducts()
      .then(setProducts)
      .catch(() => showToast('Gagal memuat produk', 'error'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await productService.remove(deleteTarget.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      showToast('Produk berhasil dihapus');
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menghapus produk', 'error');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <Toast {...toast} />

      <PageHeader
        title="🌱 Produk Saya"
        subtitle={loading ? 'Memuat...' : `${products.length} produk terdaftar`}
        action={<Button onClick={() => navigate('/farmer/products/new')}>+ Tambah Produk</Button>}
      />

      <Card style={{ overflow: 'visible' }}>
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: colors.textMuted }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
              <div>Memuat produk...</div>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: colors.bg }}>
                <tr>
                  {TABLE_HEADS.map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '13px 16px', fontSize: 12, fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: `1px solid ${colors.border}` }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} style={{ borderBottom: `1px solid ${colors.borderLight}`, transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = colors.bg}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {p.image_url ? (
                          <img src={p.image_url} alt="" style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: 48, height: 48, borderRadius: 10, background: colors.primaryXLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🌿</div>
                        )}
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: colors.text }}>{p.name}</div>
                          <div style={{ fontSize: 12, color: colors.textMuted }}>📍 {p.location}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <Badge>{p.category_icon || '🌿'} {p.category_name}</Badge>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: colors.primary, fontSize: 14 }}>
                      {formatRupiah(p.price)}/{p.unit}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontWeight: 600, color: p.stock > 100 ? '#10B981' : p.stock > 20 ? '#F59E0B' : '#EF4444' }}>
                        {Number(p.stock).toLocaleString()} {p.unit}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <Badge
                        bg={['Organik', 'Premium'].includes(p.quality) ? '#D1FAE5' : '#DBEAFE'}
                        color={['Organik', 'Premium'].includes(p.quality) ? '#065F46' : '#1E40AF'}
                      >
                        {p.quality}
                      </Badge>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <Badge bg={p.is_available ? '#D1FAE5' : '#FEE2E2'} color={p.is_available ? '#065F46' : '#991B1B'}>
                        {p.is_available ? '● Aktif' : '○ Nonaktif'}
                      </Badge>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Button size="sm" variant="outline" onClick={() => navigate(`/farmer/products/${p.id}/edit`)}>✏️ Edit</Button>
                        <Button size="sm" variant="danger" onClick={() => setDeleteTarget(p)}>🗑️</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!loading && products.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: colors.textMuted }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🌱</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>Belum ada produk</div>
              <div style={{ fontSize: 14, marginTop: 4, marginBottom: 16 }}>Tambahkan produk pertama Anda ke marketplace</div>
              <Button onClick={() => navigate('/farmer/products/new')}>+ Tambah Produk</Button>
            </div>
          )}
        </div>
      </Card>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Hapus Produk">
        <p style={{ color: colors.textMuted, marginTop: 0 }}>
          Yakin ingin menghapus <strong>{deleteTarget?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={() => setDeleteTarget(null)} disabled={deleting}>Batal</Button>
          <Button variant="danger" onClick={confirmDelete} disabled={deleting}>
            {deleting ? '⏳ Menghapus...' : '🗑️ Hapus'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
