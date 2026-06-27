import React from 'react';
import Card       from '../../components/ui/Card';
import PageHeader from '../../components/common/PageHeader';
import { Badge }  from '../../components/ui/Badge';
import { colors } from '../../utils/theme';

const FEATURES = [
  {
    icon: '🤖', title: 'Prediksi Harga Pasar AI',
    desc: 'Algoritma machine learning menganalisis tren historis, cuaca, dan kondisi pasar untuk memprediksi harga komoditas 2–4 minggu ke depan.',
    tag: 'AI / ML', tagColor: '#8B5CF6', tagBg: '#EDE9FE', eta: 'Q2 2025',
  },
  {
    icon: '📊', title: 'Estimasi Stok Panen',
    desc: 'Sistem prediksi berbasis data cuaca dan musim tanam untuk memperkirakan ketersediaan produk di masa mendatang.',
    tag: 'Data Analytics', tagColor: '#2563EB', tagBg: '#DBEAFE', eta: 'Q3 2025',
  },
  {
    icon: '⭐', title: 'Sistem Rating & Reputasi',
    desc: 'Rating transparan berbasis riwayat transaksi nyata. Supplier mendapat skor kualitas, ketepatan waktu, dan layanan.',
    tag: 'Trust System', tagColor: '#D97706', tagBg: '#FEF3C7', eta: 'Q1 2025',
  },
  {
    icon: '🚚', title: 'Integrasi Logistik',
    desc: 'Koneksi langsung dengan mitra ekspedisi pertanian untuk penghitungan ongkos kirim real-time dan tracking pengiriman.',
    tag: 'Logistics', tagColor: '#059669', tagBg: '#D1FAE5', eta: 'Q3 2025',
  },
  {
    icon: '💬', title: 'Chat Real-time',
    desc: 'Sistem pesan langsung antara petani dan pembeli. Negosiasi harga dan diskusi pesanan tanpa meninggalkan platform.',
    tag: 'Communication', tagColor: '#DC2626', tagBg: '#FEE2E2', eta: 'Q2 2025',
  },
  {
    icon: '📱', title: 'Mobile App',
    desc: 'Aplikasi native iOS & Android dengan fitur lengkap: notifikasi pesanan real-time dan kamera upload foto produk dari kebun.',
    tag: 'Mobile', tagColor: '#0891B2', tagBg: '#CFFAFE', eta: 'Q4 2025',
  },
];

export default function FeaturesPage() {
  return (
    <div>
      <PageHeader
        title="🔮 Fitur Mendatang"
        subtitle="Inovasi yang sedang dalam pengembangan untuk Tani Hub"
      />

      {/* Roadmap banner */}
      <div style={{
        background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primary} 100%)`,
        borderRadius: 16, padding: '24px 28px', marginBottom: 28, color: '#fff',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{ fontSize: 40 }}>🗺️</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>Product Roadmap 2025</div>
          <div style={{ opacity: 0.8, fontSize: 14 }}>
            Kami berkomitmen membangun ekosistem agritech terlengkap di Indonesia.
            Fitur-fitur berikut akan diluncurkan secara bertahap.
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {FEATURES.map((f) => (
          <Card key={f.title} style={{ padding: 24 }}>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{
                width: 60, height: 60, borderRadius: 16, flexShrink: 0,
                background: f.tagBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28,
              }}>
                {f.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 700, color: colors.text }}>
                  {f.title}
                </h3>
                <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                  <Badge bg={f.tagBg} color={f.tagColor}>{f.tag}</Badge>
                  <Badge bg={colors.bg} color={colors.textMuted}>📅 {f.eta}</Badge>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: colors.textMuted, lineHeight: 1.65 }}>
                  {f.desc}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
