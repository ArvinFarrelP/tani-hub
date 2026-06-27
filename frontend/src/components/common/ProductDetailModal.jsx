import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import StarRating from '../ui/StarRating';
import { Badge } from '../ui/Badge';
import { colors } from '../../utils/theme';
import { formatRupiah } from '../../utils/formatters';

/**
 * Full-detail overlay for a single product.
 *
 * @param {object|null} product  — pass null to hide
 * @param {function}    onClose
 * @param {function}    onOrder  called when buyer clicks "Pesan Sekarang"
 */
export default function ProductDetailModal({ product, onClose, onOrder }) {
  if (!product) return null;

  const details = [
    ['💰 Harga',      `${formatRupiah(product.price)}/${product.unit}`],
    ['📦 Stok',       `${Number(product.stock).toLocaleString()} ${product.unit}`],
    ['📍 Lokasi',     product.location],
    ['👨‍🌾 Petani',   product.farmer_name],
    ['⚡ Min. Order', `${product.min_order} ${product.unit}`],
    ['🏅 Kualitas',   product.quality],
  ];

  return (
    <Modal open={!!product} onClose={onClose} title="">
      <img
        src={product.image_url}
        alt={product.name}
        style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 14, marginBottom: 16 }}
      />

      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <Badge>{product.category_icon} {product.category_name}</Badge>
        <Badge bg="#D1FAE5" color="#065F46">{product.quality}</Badge>
        {product.farmer_verified && (
          <Badge bg="#DBEAFE" color="#1E40AF">✓ Supplier Terverifikasi</Badge>
        )}
      </div>

      <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, color: colors.text }}>
        {product.name}
      </h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <StarRating rating={product.avg_rating} />
        <span style={{ fontSize: 13, color: colors.textMuted }}>
          {Number(product.avg_rating).toFixed(1)} dari {product.total_reviews} ulasan
        </span>
      </div>

      <p style={{ color: colors.textMuted, fontSize: 14, lineHeight: 1.7, marginBottom: 16 }}>
        {product.description}
      </p>

      <div
        style={{
          background: colors.bg,
          borderRadius: 12,
          padding: '14px 16px',
          marginBottom: 20,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px 16px',
        }}
      >
        {details.map(([k, v]) => (
          <div key={k}>
            <div style={{ fontSize: 11, color: colors.textMuted }}>{k}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <Button variant="outline" onClick={onClose} style={{ flex: 1 }}>
          Tutup
        </Button>
        <Button
          onClick={() => { onOrder(product); onClose(); }}
          style={{ flex: 2 }}
        >
          🛒 Pesan Sekarang
        </Button>
      </div>
    </Modal>
  );
}
