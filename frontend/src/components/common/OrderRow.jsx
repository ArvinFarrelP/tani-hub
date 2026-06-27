import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { StatusBadge } from '../ui/Badge';
import { colors } from '../../utils/theme';
import { formatRupiah, formatDate } from '../../utils/formatters';

/**
 * Single row in an order list.
 *
 * @param {object}   transaction
 * @param {'buyer'|'farmer'} viewAs  controls which name column to show + available actions
 * @param {function} onConfirm  (farmer) confirm pending order
 * @param {function} onRate     (buyer)  rate a delivered order
 */
export default function OrderRow({ transaction: t, viewAs, onConfirm, onRate }) {
  return (
    <Card style={{ padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <img
          src={t.product_image}
          alt={t.product_name}
          style={{ width: 70, height: 70, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }}
        />

        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: colors.text }}>
              {t.product_name}
            </h3>
            <StatusBadge status={t.status} />
          </div>
          <div style={{ fontSize: 13, color: colors.textMuted, marginBottom: 4 }}>
            {viewAs === 'buyer' ? `👨‍🌾 ${t.farmer_name}` : `🏪 ${t.buyer_name}`}
            {' • '}
            {t.quantity} {t.unit}
            {' • '}
            {formatDate(t.created_at)}
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: colors.primary }}>
            {formatRupiah(t.total_price)}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
          <Button size="sm" variant="outline">
            Detail
          </Button>
          {viewAs === 'farmer' && t.status === 'pending' && onConfirm && (
            <Button size="sm" onClick={() => onConfirm(t.id)}>
              ✓ Konfirmasi
            </Button>
          )}
          {viewAs === 'buyer' && t.status === 'delivered' && onRate && (
            <Button size="sm" variant="ghost" onClick={() => onRate(t.id)}>
              ⭐ Beri Rating
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
