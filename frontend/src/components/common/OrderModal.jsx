import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { colors } from '../../utils/theme';
import { formatRupiah } from '../../utils/formatters';

/**
 * Order placement form.
 *
 * @param {object|null} product    — pass null to hide the modal
 * @param {function}    onClose
 * @param {function}    onSubmit   called with { product, quantity, notes, address }
 * @param {boolean}     submitting — shows loading state while API call is in flight
 */
export default function OrderModal({ product, onClose, onSubmit, submitting = false }) {
  const [form, setForm] = useState({ quantity: '', notes: '', address: '' });

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = () => {
    if (!form.quantity || !form.address) return;
    onSubmit({ product, ...form });
    // Do NOT clear form or close here — parent controls close after API resolves
  };

  // Reset form when product changes (new order dialog)
  React.useEffect(() => {
    setForm({ quantity: '', notes: '', address: '' });
  }, [product?.id]);

  if (!product) return null;

  const canSubmit = !!form.quantity && !!form.address && !submitting;

  return (
    <Modal open={!!product} onClose={onClose} title={`Pesan ${product.name}`}>

      {/* Product summary */}
      <div style={{ background: colors.bg, borderRadius: 12, padding: '12px 14px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover' }} />
        ) : (
          <div style={{ width: 56, height: 56, borderRadius: 10, background: colors.primaryXLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🌿</div>
        )}
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: colors.text }}>{product.name}</div>
          <div style={{ fontSize: 13, color: colors.primary, fontWeight: 700 }}>
            {formatRupiah(product.price)}/{product.unit}
          </div>
          <div style={{ fontSize: 12, color: colors.textMuted }}>
            Stok: {Number(product.stock).toLocaleString()} {product.unit}
          </div>
        </div>
      </div>

      {/* Quantity */}
      <Input
        label={`Jumlah (${product.unit}) *`}
        type="number"
        min="1"
        max={product.stock}
        placeholder={`Min. ${product.min_order || 1} ${product.unit}`}
        value={form.quantity}
        onChange={set('quantity')}
      />

      {/* Estimated total */}
      {form.quantity && (
        <div style={{ background: colors.primaryXLight, borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 14 }}>
          <span style={{ color: colors.textMuted }}>Total estimasi: </span>
          <span style={{ fontWeight: 800, color: colors.primary, fontSize: 18 }}>
            {formatRupiah(Number(form.quantity) * Number(product.price))}
          </span>
        </div>
      )}

      <Input
        label="Alamat Pengiriman *"
        placeholder="Jl. Contoh No. 123, Kota, Provinsi"
        value={form.address}
        onChange={set('address')}
      />

      <Textarea
        label="Catatan (opsional)"
        rows={3}
        placeholder="Spesifikasi tambahan, jadwal pengiriman, dll."
        value={form.notes}
        onChange={set('notes')}
      />

      <Button fullWidth onClick={handleSubmit} disabled={!canSubmit}>
        {submitting ? '⏳ Mengirim pesanan...' : '✅ Konfirmasi Pesanan'}
      </Button>
    </Modal>
  );
}
