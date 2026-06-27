import React from 'react';
import { colors } from '../../utils/theme';

/**
 * White surface card with a subtle border and optional padding.
 */
export default function Card({ children, style = {}, className = '', ...rest }) {
  return (
    <div
      className={className}
      style={{
        background: colors.white,
        borderRadius: 16,
        border: `1px solid ${colors.border}`,
        overflow: 'hidden',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
