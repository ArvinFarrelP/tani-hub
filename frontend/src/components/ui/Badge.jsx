import React from 'react';
import { colors, statusConfig } from '../../utils/theme';

/**
 * Pill-shaped label.
 */
export function Badge({
  children,
  color = colors.primary,
  bg = colors.primaryXLight,
  style = {},
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        background: bg,
        color,
        fontSize: 11,
        fontWeight: 600,
        padding: '3px 9px',
        borderRadius: 20,
        letterSpacing: 0.3,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/**
 * Pre-configured badge for transaction statuses.
 * @param {'pending'|'confirmed'|'processing'|'shipped'|'delivered'|'cancelled'} status
 */
export function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.pending;
  return (
    <Badge color={cfg.color} bg={cfg.bg}>
      {cfg.label}
    </Badge>
  );
}
