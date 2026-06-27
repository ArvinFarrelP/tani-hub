import React, { useState } from 'react';
import { useAuth }    from '../../context/AuthContext';
import userService    from '../../services/userService';
import Card           from '../../components/ui/Card';
import Button         from '../../components/ui/Button';
import Toast          from '../../components/ui/Toast';
import PageHeader     from '../../components/common/PageHeader';
import { Badge }      from '../../components/ui/Badge';
import { Input, Textarea } from '../../components/ui/Input';
import { useToast }   from '../../hooks/useToast';
import { colors }     from '../../utils/theme';
import { getInitial } from '../../utils/formatters';

const ROLE_META = {
  farmer: { label: '👨‍🌾 Petani / Supplier', bg: colors.primaryXLight, color: colors.primary },
  buyer:  { label: '🏪 Pembeli',             bg: '#EDE9FE',           color: '#7C3AED'       },
  admin:  { label: '⚙️ Administrator',        bg: '#FEF3C7',           color: '#92400E'       },
};

export default function ProfilePage() {
  const { user, updateUser }     = useAuth();
  const { toast, showToast }     = useToast();
  const [saving, setSaving]      = useState(false);

  const [form, setForm] = useState({
    name:     user.name     || '',
    phone:    user.phone    || '',
    location: user.location || '',
    bio:      user.bio      || '',
  });

  const [pwForm, setPwForm]   = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwSaving, setPwSaving] = useState(false);

  const set    = (key) => (e) => setForm((f)   => ({ ...f, [key]: e.target.value }));
  const setPw  = (key) => (e) => setPwForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await userService.updateProfile(form);
      updateUser(updated);
      showToast('Profil berhasil diperbarui! ✓');
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menyimpan profil', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) {
      showToast('Konfirmasi password tidak cocok', 'error');
      return;
    }
    if (pwForm.newPassword.length < 8) {
      showToast('Password baru minimal 8 karakter', 'error');
      return;
    }
    setPwSaving(true);
    try {
      await userService.changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword:     pwForm.newPassword,
      });
      showToast('Password berhasil diperbarui! ✓');
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal mengganti password', 'error');
    } finally {
      setPwSaving(false);
    }
  };

  const meta = ROLE_META[user?.role] || ROLE_META.buyer;

  return (
    <div>
      <Toast {...toast} />
      <PageHeader title="👤 Profil Saya" />

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24, alignItems: 'start' }}>

        {/* Avatar sidebar */}
        <Card style={{ padding: 24, textAlign: 'center' }}>
          <div style={{
            width: 96, height: 96, borderRadius: '50%',
            background: colors.primaryXLight,
            border: `3px solid ${colors.primary}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 40, fontWeight: 800, color: colors.primary,
            margin: '0 auto 14px',
          }}>
            {getInitial(user.name)}
          </div>

          <h3 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 700, color: colors.text }}>{user.name}</h3>
          <p style={{ margin: '0 0 12px', color: colors.textMuted, fontSize: 13 }}>{user.email}</p>

          <div style={{ marginBottom: 12 }}>
            <Badge bg={meta.bg} color={meta.color}>{meta.label}</Badge>
          </div>

          {user.is_verified
            ? <Badge bg="#D1FAE5" color="#065F46">✓ Akun Terverifikasi</Badge>
            : <Badge bg="#FEF3C7" color="#92400E">⏳ Belum Terverifikasi</Badge>
          }
        </Card>

        {/* Form panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Profile info */}
          <Card style={{ padding: 28 }}>
            <h3 style={{ margin: '0 0 22px', fontSize: 16, fontWeight: 700, color: colors.text }}>
              Informasi Akun
            </h3>
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                <Input label="Nama Lengkap / Nama Bisnis" value={form.name} onChange={set('name')} />
                <Input label="Email" value={user.email} disabled style={{ opacity: 0.6 }} />
                <Input label="No. Telepon" placeholder="+62 812 3456 7890" value={form.phone} onChange={set('phone')} />
                <Input label="Lokasi" placeholder="Kota, Provinsi" value={form.location} onChange={set('location')} />
              </div>

              {user.role === 'farmer' && (
                <Textarea
                  label="Bio / Deskripsi Usaha"
                  placeholder="Ceritakan tentang usaha pertanian Anda..."
                  value={form.bio}
                  onChange={set('bio')}
                />
              )}

              <Button type="submit" disabled={saving}>
                {saving ? '⏳ Menyimpan...' : '💾 Simpan Perubahan'}
              </Button>
            </form>
          </Card>

          {/* Change password */}
          <Card style={{ padding: 28 }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: colors.text }}>
              🔐 Ganti Password
            </h3>
            <form onSubmit={handleChangePassword}>
              <Input
                label="Password Saat Ini *"
                type="password"
                placeholder="Password lama Anda"
                value={pwForm.currentPassword}
                onChange={setPw('currentPassword')}
                required
              />
              <Input
                label="Password Baru *"
                type="password"
                placeholder="Min. 8 karakter"
                value={pwForm.newPassword}
                onChange={setPw('newPassword')}
                required
              />
              <Input
                label="Konfirmasi Password Baru *"
                type="password"
                placeholder="Ulangi password baru"
                value={pwForm.confirm}
                onChange={setPw('confirm')}
                required
              />
              <Button type="submit" variant="outline" disabled={pwSaving}>
                {pwSaving ? '⏳ Memproses...' : '🔒 Ganti Password'}
              </Button>
            </form>
          </Card>

        </div>
      </div>
    </div>
  );
}
