import { useState, useCallback } from 'react';

/**
 * Provides show/hide logic for a single toast notification.
 *
 * Usage:
 *   const { toast, showToast } = useToast();
 *   showToast('Berhasil disimpan!');
 *   showToast('Ada kesalahan', 'error');
 *   // then render: <Toast {...toast} />
 */
export function useToast(duration = 3000) {
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const showToast = useCallback(
    (message, type = 'success') => {
      setToast({ visible: true, message, type });
      setTimeout(() => setToast((t) => ({ ...t, visible: false })), duration);
    },
    [duration]
  );

  return { toast, showToast };
}
