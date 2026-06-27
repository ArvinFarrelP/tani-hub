import React from 'react';
import { colors } from '../../utils/theme';

/**
 * Standard page title block.
 *
 * @param {string}      title
 * @param {string}      [subtitle]
 * @param {React.Node}  [action]   right-aligned slot for buttons
 */
export default function PageHeader({ title, subtitle, action }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 28,
        gap: 16,
        flexWrap: 'wrap',
      }}
    >
      <div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: colors.text, lineHeight: 1.2 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ margin: '6px 0 0', color: colors.textMuted, fontSize: 14 }}>{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
