import { Routes, Route, useLocation, Navigate } from "react-router-dom";

/* Layout */
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";

/* Pages */
import Home from "../pages/Home";
import AboutPage from "../pages/AboutPage";
import ServicesPage from "../pages/ServicesPage";
import Model from "../pages/Model";
import PortfolioPage from "../pages/PortfolioPage";
import Detailed from "../pages/Detailed";
import ContactPage from "../pages/ContactPage";
import Cursor from "../components/ui/Cursor";
import AdminPanel from "../sections/AdminPanel"; // or ../pages/AdminPanel
import CustomBook from "../pages/CustomBook";
import ProductDetail from "../pages/ProductDetail";

// New: Login Page
import LoginPage from "../pages/LoginPage"; // Make sure this file exists!
import Debug from "../pages/Debug"; // Debug page for testing context

// Context
import { useProducts } from "../Context/ProductContext";

export default function AppRoutes() {
  const location = useLocation();
  const { isAuthenticated } = useProducts();

  // Determine if current route is an admin route
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Protected Route Component
  const ProtectedAdminRoute = ({ children }) => {
    if (!isAuthenticated) {
      // Redirect to login, preserving the intended destination
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    return children;
  };

  return (
    <>
      {/* Conditionally render Navbar + Cursor only on public routes */}
      {!isAdminRoute && (
        <>
          <Navbar />
          <Cursor />
        </>
      )}

      {/* Main Content */}
      <main className={isAdminRoute ? "pt-0" : "pt-20"}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/custom-book" element={<CustomBook />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/models" element={<Model />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/album/:id" element={<Detailed />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Admin Login Route */}
          <Route
            path="/admin/login"
            element={
              isAuthenticated ? (
                <Navigate to="/admin" replace />
              ) : (
                <LoginPage />
              )
            }
          />

          {/* Protected Admin Panel */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminPanel />
              </ProtectedAdminRoute>
            }
          />

          {/* Debug Page */}
          <Route path="/debug" element={<Debug />} />

          {/* Optional: Catch-all for unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Conditionally render Footer only on public routes */}
      {!isAdminRoute && <Footer />}
    </>
  );
}