import React, { useState, useEffect, useCallback } from 'react';
import adminService from '../../services/adminService';
import Card         from '../../components/ui/Card';
import Button       from '../../components/ui/Button';
import Toast        from '../../components/ui/Toast';
import PageHeader   from '../../components/common/PageHeader';
import { Badge }    from '../../components/ui/Badge';
import { useToast } from '../../hooks/useToast';
import { colors }   from '../../utils/theme';
import useResponsive from '../../hooks/useResponsive';

const ROLE_LABEL = { farmer: '👨‍🌾 Petani', buyer: '🏪 Pembeli', admin: '⚙️ Admin' };

export default function AdminUsersPage() {
  const { toast, showToast } = useToast();
  const [users, setUsers]      = useState([]);
  const [loading, setLoading]  = useState(true);
  const [search, setSearch]    = useState('');
  const [roleFilter, setRole]  = useState('all');
  const { isMobile } = useResponsive();

  const load = useCallback(() => {
    setLoading(true);
    adminService.getAllUsers()
      .then(setUsers)
      .catch(() => showToast('Gagal memuat pengguna', 'error'))
      .finally(() => setLoading(false));
}, [showToast]);

  useEffect(load, [load]);

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole   = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const toggleVerify = async (id) => {
    try {
      const updated = await adminService.verifySupplier(id);
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, is_verified: updated.is_verified } : u));
      showToast('Status verifikasi diperbarui ✓');
    } catch {
      showToast('Gagal memperbarui verifikasi', 'error');
    }
  };

  const toggleActive = async (id) => {
    try {
      const updated = await adminService.toggleUserStatus(id);
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, is_active: updated.is_active } : u));
      showToast('Status akun diperbarui ✓');
    } catch {
      showToast('Gagal memperbarui status akun', 'error');
    }
  };

  return (
    <div>
      <Toast {...toast} />

      <PageHeader
        title="👥 Kelola Pengguna"
        subtitle={loading ? 'Memuat...' : `${users.length} pengguna terdaftar`}
      />

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          placeholder="🔍 Cari nama atau email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: '10px 16px', borderRadius: 10, border: `1.5px solid ${colors.border}`, fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
        />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['all', 'farmer', 'buyer'].map((r) => (
            <button key={r} onClick={() => setRole(r)}
              style={{
                padding: '9px 18px', borderRadius: 10,
                border: `1.5px solid ${roleFilter === r ? colors.primary : colors.border}`,
                background: roleFilter === r ? colors.primary : '#fff',
                color: roleFilter === r ? '#fff' : colors.text,
                fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                whiteSpace: 'nowrap',
              }}
            >
              {r === 'all' ? 'Semua' : r === 'farmer' ? '👨‍🌾 Petani' : '🏪 Pembeli'}
            </button>
          ))}
        </div>
      </div>

      <Card style={{ overflowX: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: colors.textMuted }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
            <div>Memuat pengguna...</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: isMobile ? 700 : '100%' }}>
            <thead style={{ background: colors.bg }}>
              <tr>
                {['Pengguna', 'Role', 'Lokasi', 'Produk', 'Verifikasi', 'Akun', 'Aksi'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '13px 16px', fontSize: 12, fontWeight: 700, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: `1px solid ${colors.border}` }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}
                  style={{ borderBottom: `1px solid ${colors.borderLight}`, transition: 'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = colors.bg}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, background: u.role === 'farmer' ? colors.primaryXLight : '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, color: u.role === 'farmer' ? colors.primary : '#7C3AED' }}>
                        {u.name?.[0] || '?'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: colors.text }}>{u.name}</div>
                        <div style={{ fontSize: 12, color: colors.textMuted }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <Badge bg={u.role === 'farmer' ? colors.primaryXLight : '#EDE9FE'} color={u.role === 'farmer' ? colors.primary : '#7C3AED'}>
                      {ROLE_LABEL[u.role] || u.role}
                    </Badge>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: colors.textMuted }}>📍 {u.location || '—'}</td>
                  <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: colors.text }}>{u.product_count || 0}</td>
                  <td style={{ padding: '14px 16px' }}>
                    {u.role === 'farmer' ? (
                      <Badge bg={u.is_verified ? '#D1FAE5' : '#FEF3C7'} color={u.is_verified ? '#065F46' : '#92400E'}>
                        {u.is_verified ? '✓ Terverifikasi' : '⏳ Belum Verif'}
                      </Badge>
                    ) : (
                      <span style={{ fontSize: 12, color: colors.textMuted }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <Badge bg={u.is_active ? '#D1FAE5' : '#FEE2E2'} color={u.is_active ? '#065F46' : '#991B1B'}>
                      {u.is_active ? '● Aktif' : '○ Nonaktif'}
                    </Badge>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {u.role === 'farmer' && (
                        <Button size="sm" variant={u.is_verified ? 'outline' : 'primary'} onClick={() => toggleVerify(u.id)}>
                          {u.is_verified ? '✗ Unverif' : '✓ Verifikasi'}
                        </Button>
                      )}
                      <Button size="sm" variant={u.is_active ? 'danger' : 'success'} onClick={() => toggleActive(u.id)}>
                        {u.is_active ? 'Nonaktif' : 'Aktifkan'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: colors.textMuted }}>
            Tidak ada pengguna yang cocok dengan pencarian.
          </div>
        )}
      </Card>
    </div>
  );
}