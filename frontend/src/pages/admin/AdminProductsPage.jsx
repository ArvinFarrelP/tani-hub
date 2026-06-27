import React, { useState, useEffect, useCallback } from 'react';
import adminService  from '../../services/adminService';
import Card          from '../../components/ui/Card';
import Button        from '../../components/ui/Button';
import Modal         from '../../components/ui/Modal';
import Toast         from '../../components/ui/Toast';
import PageHeader    from '../../components/common/PageHeader';
import { Badge }     from '../../components/ui/Badge';
import { useToast }  from '../../hooks/useToast';
import { colors }    from '../../utils/theme';
import { formatRupiah } from '../../utils/formatters';

export default function AdminProductsPage() {
  const { toast, showToast }      = useToast();
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]   = useState(false);

const load = useCallback(() => {
  setLoading(true);
  adminService
    .getAllProducts()
    .then(setProducts)
    .catch(() => showToast('Gagal memuat produk', 'error'))
    .finally(() => setLoading(false));
}, [showToast]);

  useEffect(load, [load]);

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.farmer_name?.toLowerCase().includes(search.toLowerCase())
  );

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await adminService.deleteProduct(deleteTarget.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      showToast('Produk berhasil dihapus');
    } catch {
      showToast('Gagal menghapus produk', 'error');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <Toast {...toast} />

      <PageHeader
        title="🌾 Kelola Produk"
        subtitle={loading ? 'Memuat...' : `${products.length} produk terdaftar`}
      />

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="🔍 Cari produk atau nama petani..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', maxWidth: 420, padding: '10px 16px', borderRadius: 10, border: `1.5px solid ${colors.border}`, fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: colors.textMuted }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
          <div>Memuat produk...</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map((p) => (
            <Card key={p.id} style={{ overflow: 'hidden', transition: 'box-shadow 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 24px rgba(45,106,79,0.12)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={{ position: 'relative', height: 140, overflow: 'hidden', background: colors.bg }}>
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>🌿</div>
                )}
                <div style={{ position: 'absolute', top: 8, right: 8 }}>
                  <Badge bg={p.is_available ? 'rgba(16,185,129,0.9)' : 'rgba(239,68,68,0.9)'} color="#fff">
                    {p.is_available ? '● Aktif' : '○ Nonaktif'}
                  </Badge>
                </div>
                <div style={{ position: 'absolute', top: 8, left: 8 }}>
                  <Badge bg="rgba(45,106,79,0.85)" color="#fff">
                    {p.category_icon || '🌿'} {p.category_name}
                  </Badge>
                </div>
              </div>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: colors.text, marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 10 }}>
                  👨‍🌾 {p.farmer_name} &nbsp;•&nbsp; 📍 {p.location}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontWeight: 700, color: colors.primary }}>{formatRupiah(p.price)}/{p.unit}</span>
                    <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>
                      Stok: {Number(p.stock).toLocaleString()} {p.unit}
                    </div>
                  </div>
                  <Button size="sm" variant="danger" onClick={() => setDeleteTarget(p)}>🗑️</Button>
                </div>
              </div>
            </Card>
          ))}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: colors.textMuted, gridColumn: '1/-1' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🌾</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>Tidak ada produk</div>
            </div>
          )}
        </div>
      )}

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Hapus Produk">
        <p style={{ color: colors.textMuted, marginTop: 0 }}>
          Yakin ingin menghapus <strong>{deleteTarget?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={() => setDeleteTarget(null)} disabled={deleting}>Batal</Button>
          <Button variant="danger" onClick={confirmDelete} disabled={deleting}>
            {deleting ? '⏳...' : '🗑️ Hapus'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
