import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_HOME = {
  farmer: '/farmer/dashboard',
  buyer:  '/buyer/marketplace',
  admin:  '/admin/dashboard',
};

/**
 * Role-aware route guard.
 *
 * Unauthenticated      → /login  (preserving intended path in location state)
 * Wrong / unknown role → user's own home page  (never /unauthorized)
 * Authorised           → render child routes via <Outlet />
 *
 * @param {string[]} [allowedRoles]  Omit to allow any authenticated user.
 */
export default function ProtectedRoute({ allowedRoles }) {
  const { user }   = useAuth();
  const location   = useLocation();

  // No session at all → login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role guard: wrong role → silently redirect to the user's own home
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    const home = ROLE_HOME[user.role] || '/login';
    return <Navigate to={home} replace />;
  }

  return <Outlet />;
}
