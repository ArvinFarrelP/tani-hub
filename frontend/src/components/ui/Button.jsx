import React from 'react';
import { colors } from '../../utils/theme';

const variantStyles = {
  primary: { background: colors.primary,   color: '#fff',            border: 'none' },
  outline: { background: 'transparent',    color: colors.primary,   border: `1.5px solid ${colors.primary}` },
  ghost:   { background: 'transparent',    color: colors.textMuted, border: 'none' },
  danger:  { background: colors.danger,    color: '#fff',            border: 'none' },
  earth:   { background: colors.earth,     color: '#fff',            border: 'none' },
  success: { background: colors.success,   color: '#fff',            border: 'none' },
};

const sizeStyles = {
  sm: { padding: '6px 14px',  fontSize: 13 },
  md: { padding: '10px 20px', fontSize: 14 },
  lg: { padding: '14px 28px', fontSize: 16 },
};

/**
 * Base button component.
 *
 * @param {'primary'|'outline'|'ghost'|'danger'|'earth'|'success'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} fullWidth
 * @param {boolean} disabled
 */
export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  style = {},
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...variantStyles[variant],
        ...sizeStyles[size],
        borderRadius: 10,
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.15s ease',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        width: fullWidth ? '100%' : 'auto',
        fontFamily: 'inherit',
        ...style,
      }}
    >
      {children}
    </button>
  );
}
