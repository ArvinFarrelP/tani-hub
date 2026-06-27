import React from 'react';
import { colors } from '../../utils/theme';

const fieldBase = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 10,
  border: `1.5px solid ${colors.border}`,
  fontSize: 14,
  color: colors.text,
  background: colors.white,
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  transition: 'border-color 0.15s',
};

const labelStyle = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: colors.text,
  marginBottom: 6,
};

/**
 * Labelled text / number / password / email input.
 */
export function Input({ label, style = {}, wrapperStyle = {}, ...props }) {
  return (
    <div style={{ marginBottom: 16, ...wrapperStyle }}>
      {label && <label style={labelStyle}>{label}</label>}
      <input style={{ ...fieldBase, ...style }} {...props} />
    </div>
  );
}

/**
 * Labelled <select>.
 */
export function Select({ label, children, style = {}, wrapperStyle = {}, ...props }) {
  return (
    <div style={{ marginBottom: 16, ...wrapperStyle }}>
      {label && <label style={labelStyle}>{label}</label>}
      <select style={{ ...fieldBase, ...style }} {...props}>
        {children}
      </select>
    </div>
  );
}

/**
 * Labelled <textarea>.
 */
export function Textarea({ label, rows = 4, style = {}, wrapperStyle = {}, ...props }) {
  return (
    <div style={{ marginBottom: 16, ...wrapperStyle }}>
      {label && <label style={labelStyle}>{label}</label>}
      <textarea
        rows={rows}
        style={{ ...fieldBase, resize: 'vertical', ...style }}
        {...props}
      />
    </div>
  );
}
