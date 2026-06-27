import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { colors } from '../utils/theme';

/**
 * Shell layout for every authenticated page.
 * Renders the fixed sidebar and a scrollable main content area.
 * Uses React Router's <Outlet /> so each child page only renders its own content.
 */
export default function DashboardLayout() {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: colors.bg,
      }}
    >
      <Sidebar />
      <main
        style={{
          marginLeft: 260,
          flex: 1,
          padding: '36px 40px',
          minHeight: '100vh',
          maxWidth: 'calc(100vw - 260px)',
          overflowX: 'hidden',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}
