import React, { useState, useEffect } from 'react';
import { useProducts }          from '../../hooks/useProducts';
import categoryService          from '../../services/categoryService';
import transactionService       from '../../services/transactionService';
import ProductCard              from '../../components/common/ProductCard';
import ProductDetailModal       from '../../components/common/ProductDetailModal';
import OrderModal               from '../../components/common/OrderModal';
import Toast                    from '../../components/ui/Toast';
import PageHeader               from '../../components/common/PageHeader';
import { useToast }             from '../../hooks/useToast';
import { colors }               from '../../utils/theme';
import useResponsive from '../../hooks/useResponsive';

const QUALITIES = ['Grade A', 'Grade B', 'Grade C', 'Premium', 'Organik'];

export default function MarketplacePage() {
  const { toast, showToast } = useToast();
  const { isMobile, isTablet } = useResponsive();

  const {
    products, loading, error,
    search, setSearch,
    category, setCategory,
    quality, setQuality,
    sort, setSort,
  } = useProducts();

  const [categories, setCategories]     = useState([]);
  const [detailProduct, setDetailProduct] = useState(null);
  const [orderProduct, setOrderProduct]   = useState(null);
  const [ordering, setOrdering]           = useState(false);

  // Load categories once on mount
  useEffect(() => {
    categoryService.getAll().then(setCategories).catch(() => {});
  }, []);

  const handleOrderSubmit = async ({ product, quantity, notes, address }) => {
    setOrdering(true);
    try {
      await transactionService.create({
        product_id:       product.id,
        quantity:         Number(quantity),
        notes,
        delivery_address: address,
      });
      showToast(`Pesanan ${product.name} berhasil dikirim! 🎉`);
      setOrderProduct(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal mengirim pesanan', 'error');
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div>
      <Toast {...toast} />

      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onOrder={(p) => { setDetailProduct(null); setOrderProduct(p); }}
        style={{ width: isMobile ? '95%' : 600 }}
      />
      <OrderModal
        product={orderProduct}
        onClose={() => setOrderProduct(null)}
        onSubmit={handleOrderSubmit}
        submitting={ordering}
        style={{ width: isMobile ? '95%' : 600 }}
      />

      <PageHeader
        title="🏪 Marketplace Produk Tani"
        subtitle="Temukan produk segar langsung dari petani terverifikasi"
      />

      {/* Category pills */}
      <div style={{ 
        display: 'flex', 
        gap: 8, 
        marginBottom: 20, 
        flexWrap: 'wrap',
        justifyContent: isMobile ? 'center' : 'flex-start',
      }}>
        {[{ id: 0, name: 'Semua', icon: '🌿' }, ...categories].map((c) => {
          const val    = c.name === 'Semua' ? '' : c.name;
          const active = category === val;
          return (
            <button
              key={c.id}
              onClick={() => setCategory(val)}
              style={{
                padding: isMobile ? '6px 12px' : '8px 16px', 
                borderRadius: 20,
                border: `1.5px solid ${active ? colors.primary : colors.border}`,
                background: active ? colors.primary : colors.white,
                color: active ? '#fff' : colors.text,
                fontSize: isMobile ? 12 : 13, 
                fontWeight: 600, 
                cursor: 'pointer',
                display: 'flex', 
                alignItems: 'center', 
                gap: 4,
                fontFamily: 'inherit', 
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
                flex: isMobile ? '1' : 'auto',
                textAlign: 'center',
                justifyContent: 'center',
              }}
            >
              {c.icon} {c.name}
            </button>
          );
        })}
      </div>

      {/* Filter bar */}
      <div style={{ 
        display: 'flex', 
        gap: 12, 
        marginBottom: 24, 
        flexWrap: 'wrap', 
        alignItems: 'center',
        flexDirection: isMobile ? 'column' : 'row',
      }}>
        <input
          placeholder="🔍 Cari produk atau lokasi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1, 
            minWidth: 200, 
            padding: '10px 16px',
            borderRadius: 10, 
            border: `1.5px solid ${colors.border}`,
            fontSize: 14, 
            outline: 'none', 
            fontFamily: 'inherit',
            width: isMobile ? '100%' : 'auto',
          }}
        />
        <div style={{ 
          display: 'flex', 
          gap: 12, 
          flexWrap: 'wrap',
          width: isMobile ? '100%' : 'auto',
        }}>
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            style={{ 
              padding: '10px 14px', 
              borderRadius: 10, 
              border: `1.5px solid ${colors.border}`, 
              fontSize: 14, 
              color: colors.text, 
              background: colors.white, 
              fontFamily: 'inherit',
              flex: isMobile ? '1' : 'auto',
            }}
          >
            <option value="">Semua Kualitas</option>
            {QUALITIES.map((q) => <option key={q} value={q}>{q}</option>)}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{ 
              padding: '10px 14px', 
              borderRadius: 10, 
              border: `1.5px solid ${colors.border}`, 
              fontSize: 14, 
              color: colors.text, 
              background: colors.white, 
              fontFamily: 'inherit',
              flex: isMobile ? '1' : 'auto',
            }}
          >
            <option value="newest">Terbaru</option>
            <option value="cheapest">Termurah</option>
            <option value="expensive">Termahal</option>
            <option value="popular">Terpopuler</option>
          </select>
        </div>
        <span style={{ 
          color: colors.textMuted, 
          fontSize: 13, 
          whiteSpace: 'nowrap',
          marginLeft: isMobile ? '0' : 'auto',
        }}>
          {loading ? '...' : `${products.length} produk`}
        </span>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: colors.textMuted }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
          <div style={{ fontSize: 15 }}>Memuat produk...</div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: colors.danger }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
          <div style={{ fontSize: 15 }}>{error}</div>
        </div>
      )}

      {/* Product grid */}
      {!loading && !error && (
        <>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile
              ? '1fr'
              : isTablet
              ? 'repeat(2, 1fr)'
              : 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 20 
          }}>
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onView={setDetailProduct}
                onOrder={setOrderProduct}
              />
            ))}
          </div>

          {products.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 0', color: colors.textMuted }}>
              <div style={{ fontSize: 60, marginBottom: 16 }}>🔍</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Produk tidak ditemukan</div>
              <div>Coba ubah filter atau kata kunci pencarian</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}