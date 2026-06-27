import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import StarRating from '../ui/StarRating';
import { Badge } from '../ui/Badge';
import { colors } from '../../utils/theme';
import { formatRupiah } from '../../utils/formatters';

/**
 * Marketplace product card shown in the buyer product grid.
 *
 * @param {object}   product
 * @param {function} onView   called with product when "Detail" is clicked
 * @param {function} onOrder  called with product when "Pesan" is clicked
 */
export default function ProductCard({ product, onView, onOrder }) {
  return (
    <Card
      style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(45,106,79,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
        <img
          src={product.image_url}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', top: 10, left: 10 }}>
          <Badge bg="rgba(45,106,79,0.85)" color="#fff">
            {product.category_icon} {product.category_name}
          </Badge>
        </div>
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          <Badge
            bg={['Organik', 'Premium'].includes(product.quality) ? '#D1FAE5' : '#DBEAFE'}
            color={['Organik', 'Premium'].includes(product.quality) ? '#065F46' : '#1E40AF'}
          >
            {product.quality}
          </Badge>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px' }}>
        <h3
          style={{
            margin: '0 0 4px',
            fontSize: 15,
            fontWeight: 700,
            color: colors.text,
            lineHeight: 1.3,
          }}
        >
          {product.name}
        </h3>
        <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 8 }}>
          📍 {product.location}
        </div>

        {/* Rating row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <StarRating rating={product.avg_rating} />
          <span style={{ fontSize: 12, color: colors.textMuted }}>
            {Number(product.avg_rating).toFixed(1)} ({product.total_reviews})
          </span>
          {product.farmer_verified && (
            <Badge bg="#D1FAE5" color="#065F46" style={{ marginLeft: 'auto' }}>
              ✓ Terverifikasi
            </Badge>
          )}
        </div>

        {/* Price row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}
        >
          <div>
            <span style={{ fontSize: 20, fontWeight: 800, color: colors.primary }}>
              {formatRupiah(product.price)}
            </span>
            <span style={{ fontSize: 12, color: colors.textMuted }}>/{product.unit}</span>
          </div>
          <div style={{ fontSize: 12, color: colors.textMuted }}>
            Stok: {Number(product.stock).toLocaleString()} {product.unit}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <Button onClick={() => onView(product)} variant="outline" size="sm" style={{ flex: 1 }}>
            Detail
          </Button>
          <Button onClick={() => onOrder(product)} size="sm" style={{ flex: 1 }}>
            Pesan
          </Button>
        </div>
      </div>
    </Card>
  );
}
