import React from 'react';

const typeStyles = {
  success: { background: '#10B981', icon: '✓' },
  error:   { background: '#EF4444', icon: '✕' },
  info:    { background: '#3B82F6', icon: 'ℹ' },
  warning: { background: '#F59E0B', icon: '⚠' },
};

/**
 * Fixed bottom-right toast notification.
 * Pair with the `useToast` hook.
 *
 * @param {boolean} visible
 * @param {string}  message
 * @param {'success'|'error'|'info'|'warning'} type
 */
export default function Toast({ visible, message, type = 'success' }) {
  if (!visible) return null;
  const { background, icon } = typeStyles[type] || typeStyles.success;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        background,
        color: '#fff',
        padding: '14px 20px',
        borderRadius: 12,
        fontSize: 14,
        fontWeight: 600,
        boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        animation: 'slideUp 0.3s ease',
        maxWidth: 360,
      }}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      {message}
    </div>
  );
}
