import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { WhatsAppButton } from './components/layout/WhatsAppButton';
import { HomePage } from './pages/HomePage';

/**
 * Every route except the landing page is split into its own chunk.
 *
 * The whole site used to ship as one bundle, so the first visit paid for pages
 * the visitor might never open, and navigation had to wait on it. The home page
 * stays in the main chunk because it is the common entry point; the rest load on
 * demand and are then cached by the browser.
 */
const ProductsPage = lazy(() => import('./pages/ProductsPage').then((m) => ({ default: m.ProductsPage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })));
const CategoryPage = lazy(() => import('./pages/CategoryPage').then((m) => ({ default: m.CategoryPage })));
const QualityPage = lazy(() => import('./pages/QualityPage').then((m) => ({ default: m.QualityPage })));
const RecipesPage = lazy(() => import('./pages/RecipesPage').then((m) => ({ default: m.RecipesPage })));
const DealersPage = lazy(() => import('./pages/DealersPage').then((m) => ({ default: m.DealersPage })));
const WholesalePage = lazy(() => import('./pages/WholesalePage').then((m) => ({ default: m.WholesalePage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const CareersPage = lazy(() => import('./pages/CareersPage').then((m) => ({ default: m.CareersPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then((m) => ({ default: m.RegisterPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage })));

const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })));
const AdminProductsPage = lazy(() => import('./pages/admin/AdminProductsPage').then((m) => ({ default: m.AdminProductsPage })));
const AdminBatchesPage = lazy(() => import('./pages/admin/AdminBatchesPage').then((m) => ({ default: m.AdminBatchesPage })));
const AdminAuditLogsPage = lazy(() => import('./pages/admin/AdminAuditLogsPage').then((m) => ({ default: m.AdminAuditLogsPage })));
const AdminRecipeSubmissionsPage = lazy(() => import('./pages/admin/AdminRecipeSubmissionsPage').then((m) => ({ default: m.AdminRecipeSubmissionsPage })));

/** Holds the page area's height while a chunk arrives, so the layout never jumps. */
const RouteFallback: React.FC = () => (
  <div className="bg-spice-cream min-h-screen py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="h-10 w-2/3 max-w-md bg-white/70 rounded-xl animate-pulse" />
      <div className="h-4 w-1/2 max-w-sm bg-white/60 rounded-lg animate-pulse" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="h-72 bg-white/60 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  </div>
);

export const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/quality" element={<QualityPage />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/dealers" element={<DealersPage />} />
            <Route path="/wholesale" element={<WholesalePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Admin Portal Routes */}
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/batches" element={<AdminBatchesPage />} />
            <Route path="/admin/recipe-submissions" element={<AdminRecipeSubmissionsPage />} />
            <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};
