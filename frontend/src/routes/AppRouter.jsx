import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AuthLayout      from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Guards
import ProtectedRoute from './ProtectedRoute';
import GuestRoute     from './GuestRoute';

// Auth pages
import LoginPage    from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Farmer pages
import FarmerDashboardPage from '../pages/farmer/FarmerDashboardPage';
import MyProductsPage      from '../pages/farmer/MyProductsPage';
import ProductFormPage     from '../pages/farmer/ProductFormPage';
import FarmerOrdersPage    from '../pages/farmer/FarmerOrdersPage';

// Buyer pages
import MarketplacePage from '../pages/buyer/MarketplacePage';
import BuyerOrdersPage from '../pages/buyer/BuyerOrdersPage';
import SuppliersPage   from '../pages/buyer/SuppliersPage';

// Admin pages
import AdminDashboardPage    from '../pages/admin/AdminDashboardPage';
import AdminUsersPage        from '../pages/admin/AdminUsersPage';
import AdminProductsPage     from '../pages/admin/AdminProductsPage';
import AdminTransactionsPage from '../pages/admin/AdminTransactionsPage';

// Shared pages
import ProfilePage  from '../pages/shared/ProfilePage';
import FeaturesPage from '../pages/shared/FeaturesPage';
import NotFoundPage from '../pages/shared/NotFoundPage';

/**
 * Route architecture
 * ─────────────────────────────────────────────────────────────────
 * /                       → redirect to /login
 * /login                  → GuestRoute > AuthLayout > LoginPage
 * /register               → GuestRoute > AuthLayout > RegisterPage
 *
 * All authenticated routes:
 *   ProtectedRoute (any role) > DashboardLayout > page
 *   Role enforcement is done INSIDE each page group via a wrapping
 *   ProtectedRoute that renders <Outlet/> or redirects.
 *
 * Why flatten role guards inside DashboardLayout's children?
 *   Nesting ProtectedRoute > DashboardLayout > ProtectedRoute > page
 *   creates a double-Outlet chain that causes a blank screen because
 *   the inner <Outlet /> has no matched child to render.
 *   The correct pattern is:
 *     DashboardLayout > ProtectedRoute(role) > page
 *   where DashboardLayout's <Outlet /> resolves to the role guard,
 *   and the role guard's <Outlet /> resolves to the page.
 * ─────────────────────────────────────────────────────────────────
 */
export default function AppRouter() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Guest-only: unauthenticated shell */}
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      {/* Authenticated shell — DashboardLayout wraps every protected page */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>

          {/* Any authenticated role */}
          <Route path="/profile"  element={<ProfilePage />} />
          <Route path="/features" element={<FeaturesPage />} />

          {/* Farmer-only pages */}
          <Route element={<ProtectedRoute allowedRoles={['farmer']} />}>
            <Route path="/farmer/dashboard"         element={<FarmerDashboardPage />} />
            <Route path="/farmer/products"          element={<MyProductsPage />} />
            <Route path="/farmer/products/new"      element={<ProductFormPage />} />
            <Route path="/farmer/products/:id/edit" element={<ProductFormPage />} />
            <Route path="/farmer/orders"            element={<FarmerOrdersPage />} />
          </Route>

          {/* Buyer-only pages */}
          <Route element={<ProtectedRoute allowedRoles={['buyer']} />}>
            <Route path="/buyer/marketplace" element={<MarketplacePage />} />
            <Route path="/buyer/orders"      element={<BuyerOrdersPage />} />
            <Route path="/buyer/suppliers"   element={<SuppliersPage />} />
          </Route>

          {/* Admin-only pages */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard"    element={<AdminDashboardPage />} />
            <Route path="/admin/users"        element={<AdminUsersPage />} />
            <Route path="/admin/products"     element={<AdminProductsPage />} />
            <Route path="/admin/transactions" element={<AdminTransactionsPage />} />
          </Route>

        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
