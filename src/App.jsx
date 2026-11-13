import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { OwnerAuthProvider } from './context/OwnerAuthContext';
import { ToastProvider } from './context/ToastContext';
import { ComparisonProvider } from './context/ComparisonContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { FloatingAssistant } from './components/common/FloatingAssistant';
import { ComparisonFloatingBar } from './components/common/ComparisonFloatingBar';
import { OwnerRoute } from './components/owner/OwnerRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { PriceComparisonPage } from './pages/PriceComparisonPage';
import { NearbyStoresPage } from './pages/NearbyStoresPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { OwnerLoginPage } from './pages/owner/OwnerLoginPage';
import { OwnerRegisterPage } from './pages/owner/OwnerRegisterPage';
import { OwnerDashboardPage } from './pages/owner/OwnerDashboardPage';
import { OwnerPortalPage } from './pages/owner/OwnerPortalPage';

function CustomerLayout() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <FloatingAssistant />
      <ComparisonFloatingBar />
      <Footer />
    </>
  );
}

function OwnerLayout() {
  return <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter>
      <OwnerAuthProvider>
        <AuthProvider>
          <ToastProvider>
            <ComparisonProvider>
              <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans selection:bg-electric-600 selection:text-white">
                <Routes>
                  <Route element={<OwnerLayout />}>
                    <Route path="/owner/portal" element={<OwnerPortalPage />} />
                    <Route path="/owner-portal" element={<OwnerPortalPage />} />
                    <Route path="/owner/login" element={<OwnerLoginPage />} />
                    <Route path="/owner/register" element={<OwnerRegisterPage />} />
                    <Route
                      path="/owner"
                      element={
                        <OwnerRoute>
                          <OwnerDashboardPage />
                        </OwnerRoute>
                      }
                    />
                  </Route>

                  <Route element={<CustomerLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/compare-prices/:id" element={<PriceComparisonPage />} />
                    <Route path="/nearby" element={<NearbyStoresPage />} />
                    <Route path="/compare" element={<ComparisonPage />} />
                    <Route path="/ai-assistant" element={<AIAssistantPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Routes>
              </div>
            </ComparisonProvider>
          </ToastProvider>
        </AuthProvider>
      </OwnerAuthProvider>
    </BrowserRouter>
  );
}
