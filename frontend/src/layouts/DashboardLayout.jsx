import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import { colors } from '../utils/theme';
import useResponsive from '../hooks/useResponsive';

/**
 * Shell layout for every authenticated page.
 * Renders the fixed sidebar and a scrollable main content area.
 * Uses React Router's <Outlet /> so each child page only renders its own content.
 */
export default function DashboardLayout() {
  const { isMobile } = useResponsive();
  const [open, setOpen] = useState(false);

  return (
    <>
      {isMobile && (
        <MobileHeader
          onMenuClick={() => setOpen(true)}
        />
      )}

      <div
        style={{
          display: 'flex',
          minHeight: '100vh',
          background: colors.bg,
        }}
      >
        <Sidebar 
          isOpen={open} 
          onClose={() => setOpen(false)} 
        />
        
        <main
          style={{
            marginLeft: isMobile ? 0 : 260,
            flex: 1,
            padding: isMobile ? '84px 16px 24px' : '36px 40px',
            minHeight: '100vh',
            maxWidth: isMobile
              ? '100%'
              : 'calc(100vw - 260px)',
            overflowX: 'hidden',
            width: '100%',
          }}
        >
          <Outlet />
        </main>
      </div>
    </>
  );
}