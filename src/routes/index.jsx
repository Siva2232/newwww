import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

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
import AdminPanel from "../sections/AdminPanel";
import CustomBook from "../pages/CustomBook";
import ProductDetail from "../pages/ProductDetail";
import LoginPage from "../pages/LoginPage";
import Debug from "../pages/Debug";

// NEW: Import the scroll component
import ScrollToTop from "../components/common/ScrollToTop"; // adjust path if needed
import PageTransition from "../components/common/PageTransition";

// Context
import { useProducts } from "../Context/ProductContext";

export default function AppRoutes() {
  const location = useLocation();
  const { isAuthenticated } = useProducts();

  const isAdminRoute = location.pathname.startsWith("/admin");

  const ProtectedAdminRoute = ({ children }) => {
    if (!isAuthenticated) {
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
      <main className={isAdminRoute ? "pt-0" : "pt-36"}>
        {/* ScrollToTop logic handled inside PageTransition now */}
        
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
            <Route path="/custom-book" element={<PageTransition><CustomBook /></PageTransition>} />
            <Route path="/services" element={<PageTransition><ServicesPage /></PageTransition>} />
            <Route path="/portfolio" element={<PageTransition><PortfolioPage /></PageTransition>} />
            <Route path="/models" element={<PageTransition><Model /></PageTransition>} />
            <Route path="/product/:id" element={<PageTransition><ProductDetail /></PageTransition>} />
            <Route path="/album/:id" element={<PageTransition><Detailed /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />

            {/* Admin Login Route */}
            <Route
              path="/admin/login"
              element={
                isAuthenticated ? <Navigate to="/admin" replace /> : <PageTransition><LoginPage /></PageTransition>
              }
            />

            {/* Protected Admin Panel */}
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <PageTransition><AdminPanel /></PageTransition>
                </ProtectedAdminRoute>
              }
            />

            {/* Debug Page */}
            <Route path="/debug" element={<Debug />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      {!isAdminRoute && <Footer />}
    </>
  );
}
