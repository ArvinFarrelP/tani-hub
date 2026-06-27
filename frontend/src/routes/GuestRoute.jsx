import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_HOME = {
  farmer: '/farmer/dashboard',
  buyer:  '/buyer/marketplace',
  admin:  '/admin/dashboard',
};

/**
 * Wraps login / register routes.
 * Already-authenticated users are redirected to their role's home page.
 * If the user object exists but has no recognisable role, treat as logged-out.
 */
export default function GuestRoute() {
  const { user } = useAuth();

  if (user && user.role && ROLE_HOME[user.role]) {
    return <Navigate to={ROLE_HOME[user.role]} replace />;
  }

  return <Outlet />;
}
