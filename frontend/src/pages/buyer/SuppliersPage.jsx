import React, { useState, useEffect } from 'react';
import userService  from '../../services/userService';
import Card         from '../../components/ui/Card';
import Button       from '../../components/ui/Button';
import StarRating   from '../../components/ui/StarRating';
import PageHeader   from '../../components/common/PageHeader';
import { Badge }    from '../../components/ui/Badge';
import { colors }   from '../../utils/theme';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');

  useEffect(() => {
    userService.getFarmers()
      .then(setSuppliers)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.location || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="👨‍🌾 Daftar Supplier"
        subtitle={loading ? 'Memuat...' : `${suppliers.length} petani terdaftar di Tani Hub`}
      />

      <div style={{ marginBottom: 24 }}>
        <input
          placeholder="🔍 Cari nama supplier atau lokasi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%', maxWidth: 420,
            padding: '10px 16px', borderRadius: 10,
            border: `1.5px solid ${colors.border}`,
            fontSize: 14, fontFamily: 'inherit', outline: 'none',
          }}
        />
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: colors.textMuted }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
          <div>Memuat supplier...</div>
        </div>
      )}

      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {filtered.map((s) => (
            <Card
              key={s.id}
              style={{ padding: 22, transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(45,106,79,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: colors.primaryXLight,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, fontWeight: 800, color: colors.primary, flexShrink: 0,
                }}>
                  {s.name?.[0] || '?'}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: colors.text }}>{s.name}</span>
                    {s.is_verified && <Badge bg="#D1FAE5" color="#065F46">✓ Terverifikasi</Badge>}
                  </div>
                  {s.location && (
                    <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>📍 {s.location}</div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <StarRating rating={Number(s.avg_rating) || 0} />
                <span style={{ fontSize: 12, color: colors.textMuted }}>
                  {Number(s.avg_rating || 0).toFixed(1)} rata-rata
                  {s.total_reviews > 0 && ` (${s.total_reviews} ulasan)`}
                </span>
              </div>

              <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                <div style={{ background: colors.bg, borderRadius: 10, padding: '8px 14px', textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: colors.primary }}>
                    {s.product_count || 0}
                  </div>
                  <div style={{ fontSize: 11, color: colors.textMuted }}>Produk</div>
                </div>
                <div style={{ background: colors.bg, borderRadius: 10, padding: '8px 14px', textAlign: 'center', flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: colors.primary }}>
                    {s.total_reviews || 0}
                  </div>
                  <div style={{ fontSize: 11, color: colors.textMuted }}>Ulasan</div>
                </div>
              </div>

              {s.bio && (
                <p style={{ fontSize: 12, color: colors.textMuted, margin: '0 0 14px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {s.bio}
                </p>
              )}

              <Button variant="outline" fullWidth>Lihat Produk</Button>
            </Card>
          ))}

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: colors.textMuted, gridColumn: '1/-1' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>Supplier tidak ditemukan</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
