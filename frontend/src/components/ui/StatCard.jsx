import React from 'react';
import Card from './Card';
import { colors } from '../../utils/theme';

/**
 * Dashboard KPI card.
 *
 * @param {string} icon   emoji or icon character
 * @param {string} label  metric label
 * @param {string} value  formatted value string
 * @param {string} [sub]  small footnote line
 * @param {string} [color] accent colour for the icon background
 */
export default function StatCard({ icon, label, value, sub, color = colors.primary }) {
  return (
    <Card style={{ padding: '20px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: `${color}18`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div>
          <div style={{ fontSize: 13, color: colors.textMuted, marginBottom: 2 }}>{label}</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: colors.text, lineHeight: 1 }}>
            {value}
          </div>
          {sub && (
            <div style={{ fontSize: 12, color: colors.primary, marginTop: 4 }}>{sub}</div>
          )}
        </div>
      </div>
    </Card>
  );
}
