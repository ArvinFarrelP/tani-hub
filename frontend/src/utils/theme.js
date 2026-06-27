export const colors = {
  primary: '#2D6A4F',
  primaryDark: '#1B4332',
  primaryLight: '#52B788',
  primaryXLight: '#D8F3DC',
  accent: '#B7E4C7',
  earth: '#8B5E3C',
  earthLight: '#F8F0E3',
  bg: '#F7FAF7',
  white: '#FFFFFF',
  text: '#1A1A2E',
  textMuted: '#6B7280',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  success: '#10B981',
  purple: '#8B5CF6',
};

export const statusConfig = {
  pending:    { label: 'Menunggu',      color: '#F59E0B', bg: '#FEF3C7' },
  confirmed:  { label: 'Dikonfirmasi', color: '#3B82F6', bg: '#DBEAFE' },
  processing: { label: 'Diproses',     color: '#8B5CF6', bg: '#EDE9FE' },
  shipped:    { label: 'Dikirim',      color: '#06B6D4', bg: '#CFFAFE' },
  delivered:  { label: 'Diterima',     color: '#10B981', bg: '#D1FAE5' },
  cancelled:  { label: 'Dibatalkan',   color: '#EF4444', bg: '#FEE2E2' },
};

export const globalStyles = `
  * { box-sizing: border-box; }
  body { margin: 0; font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif; }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  input:focus, select:focus, textarea:focus { border-color: #2D6A4F !important; outline: none; }
  button { cursor: pointer; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #f1f1f1; }
  ::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 3px; }
`;
