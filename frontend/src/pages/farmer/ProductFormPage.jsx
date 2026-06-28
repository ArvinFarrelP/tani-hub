import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import productService   from '../../services/productService';
import categoryService  from '../../services/categoryService';
import Card             from '../../components/ui/Card';
import Button           from '../../components/ui/Button';
import Toast            from '../../components/ui/Toast';
import PageHeader       from '../../components/common/PageHeader';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { useToast }     from '../../hooks/useToast';
import { colors }       from '../../utils/theme';
import useResponsive from '../../hooks/useResponsive';

const UNITS     = ['kg', 'ton', 'ikat', 'buah', 'pack'];
const QUALITIES = ['Grade A', 'Grade B', 'Grade C', 'Premium', 'Organik'];

const EMPTY = {
  name: '', category_id: '', price: '', unit: 'kg',
  stock: '', min_order: '10', quality: 'Grade A',
  location: '', description: '', image_url: '',
};

export default function ProductFormPage() {
  const { id }               = useParams();
  const navigate             = useNavigate();
  const { toast, showToast } = useToast();
  const isEdit               = !!id;
  const fileRef              = useRef();
  const { isMobile, isTablet } = useResponsive();

  const [form, setForm]           = useState(EMPTY);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading]     = useState(false);
  const [fetching, setFetching]   = useState(isEdit);

  // Load categories
  useEffect(() => {
    categoryService.getAll().then(setCategories).catch(() => {});
  }, []);

  // If editing, load existing product
  useEffect(() => {
    if (!isEdit) return;
    productService.getById(id)
      .then((p) => {
        setForm({
          name:        p.name        || '',
          category_id: p.category_id || '',
          price:       p.price       || '',
          unit:        p.unit        || 'kg',
          stock:       p.stock       || '',
          min_order:   p.min_order   || '10',
          quality:     p.quality     || 'Grade A',
          location:    p.location    || '',
          description: p.description || '',
          image_url:   p.image_url   || '',
        });
        if (p.image_url) setImagePreview(p.image_url);
      })
      .catch(() => showToast('Gagal memuat data produk', 'error'))
      .finally(() => setFetching(false));
}, [id, isEdit, showToast]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setForm((f) => ({ ...f, image_url: '' })); // clear URL field when file chosen
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Build multipart/form-data
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== '') fd.append(k, v); });
      if (imageFile) fd.append('image', imageFile);

      if (isEdit) {
        await productService.update(id, fd);
        showToast('Produk berhasil diperbarui! ✓');
      } else {
        await productService.create(fd);
        showToast('Produk berhasil ditambahkan! ✓');
      }

      setTimeout(() => navigate('/farmer/products'), 1000);
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menyimpan produk', 'error');
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0', color: colors.textMuted }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
        <div>Memuat data produk...</div>
      </div>
    );
  }

  return (
    <div>
      <Toast {...toast} />

      <div style={{ marginBottom: 4 }}>
        <button
          onClick={() => navigate('/farmer/products')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textMuted, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8, fontFamily: 'inherit' }}
        >
          ← Kembali ke Produk Saya
        </button>
      </div>

      <PageHeader
        title={isEdit ? '✏️ Edit Produk' : '➕ Tambah Produk Baru'}
        subtitle={isEdit ? `Mengedit produk` : 'Isi detail produk Anda'}
      />

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile
          ? '1fr'
          : '1fr 320px', 
        gap: 24, 
        alignItems: 'start' 
      }}>

        {/* Main form */}
        <Card style={{ padding: isMobile ? 16 : 28 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile
                ? '1fr'
                : '1fr 1fr', 
              gap: isMobile ? '8px 0' : '0 16px' 
            }}>

              <div style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
                <Input label="Nama Produk *" placeholder="Contoh: Bayam Organik Segar" value={form.name} onChange={set('name')} required />
              </div>

              <Select label="Kategori *" value={form.category_id} onChange={set('category_id')} required>
                <option value="">Pilih kategori</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.icon || ''} {c.name}</option>
                ))}
              </Select>

              <Select label="Kualitas" value={form.quality} onChange={set('quality')}>
                {QUALITIES.map((q) => <option key={q} value={q}>{q}</option>)}
              </Select>

              <Input label="Harga (Rp) *" type="number" min="0" placeholder="8500" value={form.price} onChange={set('price')} required />

              <Select label="Satuan *" value={form.unit} onChange={set('unit')}>
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </Select>

              <Input label="Stok Tersedia *" type="number" min="0" placeholder="500" value={form.stock} onChange={set('stock')} required />

              <Input label="Minimum Pemesanan" type="number" min="1" placeholder="10" value={form.min_order} onChange={set('min_order')} />

              <div style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
                <Input label="Lokasi Kebun *" placeholder="Boyolali, Jawa Tengah" value={form.location} onChange={set('location')} required />
              </div>

              <div style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
                <Textarea
                  label="Deskripsi Produk"
                  placeholder="Cara tanam, keunggulan, kondisi penyimpanan, dll."
                  value={form.description}
                  onChange={set('description')}
                />
              </div>

            </div>

            <div style={{ 
              display: 'flex', 
              gap: 10, 
              marginTop: 8,
              flexDirection: isMobile ? 'column' : 'row',
            }}>
              <Button type="submit" disabled={loading} style={{ flex: 1 }}>
                {loading ? '⏳ Menyimpan...' : isEdit ? '💾 Simpan Perubahan' : '✅ Tambah Produk'}
              </Button>
              <Button variant="outline" onClick={() => navigate('/farmer/products')} type="button">
                Batal
              </Button>
            </div>
          </form>
        </Card>

        {/* Image panel */}
        {!isMobile && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card style={{ padding: 20 }}>
              <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: colors.text }}>
                📸 Foto Produk
              </h3>

              {/* Drop zone */}
              <div
                onClick={() => fileRef.current?.click()}
                style={{
                  border: `2px dashed ${colors.primary}`, borderRadius: 14,
                  padding: 24, textAlign: 'center', background: colors.primaryXLight,
                  cursor: 'pointer', marginBottom: 12,
                }}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" style={{ width: '100%', borderRadius: 10, objectFit: 'cover', maxHeight: 180 }} />
                ) : (
                  <>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
                    <div style={{ fontSize: 13, color: colors.primary, fontWeight: 600 }}>Klik untuk upload foto</div>
                    <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>JPG, PNG, WebP — Maks. 5 MB</div>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />

              <Input
                label="Atau masukkan URL gambar"
                placeholder="https://..."
                value={form.image_url}
                onChange={(e) => {
                  set('image_url')(e);
                  setImagePreview(e.target.value);
                  setImageFile(null);
                }}
                wrapperStyle={{ marginBottom: 0 }}
              />
            </Card>

            <div style={{ background: colors.earthLight, borderRadius: 12, padding: '14px 16px', fontSize: 13, color: '#6B4C2E', lineHeight: 1.6 }}>
              💡 <strong>Tips:</strong> Gunakan foto produk yang terang dan jelas untuk meningkatkan kepercayaan pembeli.
            </div>
          </div>
        )}
      </div>

      {/* Mobile image upload section */}
      {isMobile && (
        <div style={{ marginTop: 20 }}>
          <Card style={{ padding: 16 }}>
            <h3 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: colors.text }}>
              📸 Foto Produk
            </h3>

            {/* Drop zone */}
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${colors.primary}`, borderRadius: 14,
                padding: 24, textAlign: 'center', background: colors.primaryXLight,
                cursor: 'pointer', marginBottom: 12,
              }}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" style={{ width: '100%', borderRadius: 10, objectFit: 'cover', maxHeight: 200 }} />
              ) : (
                <>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
                  <div style={{ fontSize: 13, color: colors.primary, fontWeight: 600 }}>Klik untuk upload foto</div>
                  <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>JPG, PNG, WebP — Maks. 5 MB</div>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />

            <Input
              label="Atau masukkan URL gambar"
              placeholder="https://..."
              value={form.image_url}
              onChange={(e) => {
                set('image_url')(e);
                setImagePreview(e.target.value);
                setImageFile(null);
              }}
              wrapperStyle={{ marginBottom: 0 }}
            />

            <div style={{ background: colors.earthLight, borderRadius: 12, padding: '12px 14px', fontSize: 13, color: '#6B4C2E', lineHeight: 1.6, marginTop: 12 }}>
              💡 <strong>Tips:</strong> Gunakan foto produk yang terang dan jelas untuk meningkatkan kepercayaan pembeli.
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}