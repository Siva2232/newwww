import React, { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X, ArrowRight } from "lucide-react";
import { useProducts } from "../Context/ProductContext";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/hhhh.jpg"; // ← renamed + assuming correct path

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/models" },
  { name: "Book Album", path: "/custom-book" },
  // { name: "Services", path: "/services" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { products = [] } = useProducts(); // ← safe default: prevent undefined.filter crash
  const searchRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll handler + initial check
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    handleScroll(); // run once on mount
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close search dropdown when clicking outside
  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const handleNavClick = (path) => {
    // Always close menus & reset search
    setMobileOpen(false);
    setIsDropdownOpen(false);
    setSearchTerm("");

    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsTransitioning(true);

    // Small delay for exit animation feel
    setTimeout(() => {
      navigate(path);
      setTimeout(() => setIsTransitioning(false), 600);
    }, 400);
  };

  const filteredProducts = useMemo(() => {
    if (searchTerm.trim().length < 2) return [];

    const term = searchTerm.toLowerCase().trim();
    return products
      .filter((p) => p?.name?.toLowerCase()?.includes(term))
      .slice(0, 5);
  }, [products, searchTerm]);

  return (
    <>
      {/* Loading overlay during page transition */}
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[200] flex items-center justify-center"
          >
            <div className="flex gap-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-4 h-4 bg-black rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-lg border-b border-gray-200/70 shadow-sm py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-12 flex items-center justify-between gap-8">
          {/* Logo */}
          <button
            onClick={() => handleNavClick("/")}
            className="flex-shrink-0 relative z-10"
          >
            <motion.img
              src={logo}
              alt="Logo"
              className={`transition-all duration-500 object-contain ${
                scrolled ? "h-10 md:h-11" : "h-16 md:h-20"
              }`}
              whileHover={{ scale: 1.04 }}
            />
          </button>

          {/* Desktop Navigation */}
         <div className="hidden md:flex flex-1 justify-center ml-60 ">
  <nav className="flex items-center gap-10 lg:gap-14">
    {navLinks.map((link) => {
      const isActive = location.pathname === link.path;
      return (
        <button
          key={link.name}
          onClick={() => handleNavClick(link.path)}
          className={`relative text-base font-medium transition-colors duration-300 ${
            isActive
              ? "text-black font-semibold"
              : "text-gray-700 hover:text-black"
          }`}
        >
          {link.name}
          <span
            className={`absolute -bottom-1.5 left-0 h-0.5 bg-black rounded-full transition-all duration-400 ease-out ${
              isActive ? "w-full" : "w-0 group-hover:w-full"
            }`}
          />
        </button>
      );
    })}
  </nav>
</div>


          {/* Actions */}
          <div className="flex items-center gap-5 md:gap-7 flex-1 justify-end">
            {/* Desktop Search */}
            <div
              ref={searchRef}
              className="relative hidden sm:block w-full max-w-[220px] lg:max-w-[280px] focus-within:max-w-[340px] transition-all duration-500"
            >
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  className="w-full h-11 pl-12 pr-5 rounded-full bg-gray-100/70 border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-black/30 focus:bg-white transition-all placeholder:text-gray-500 shadow-sm"
                />
              </div>

              <AnimatePresence>
                {isDropdownOpen && searchTerm.trim().length >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    className="absolute right-0 top-full mt-3 w-[360px] bg-white/98 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/60 overflow-hidden z-50"
                  >
                    <div className="p-5">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                        Results
                      </p>

                      {filteredProducts.length === 0 ? (
                        <div className="py-10 text-center text-sm text-gray-500">
                          No products found
                        </div>
                      ) : (
                        filteredProducts.map((product) => (
                          <div
                            key={product._id || product.id}
                            onClick={() =>
                              handleNavClick(
                                `/product/${product._id || product.id}`
                              )
                            }
                            className="flex items-center gap-4 py-3 px-3 -mx-3 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-14 h-14 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                              onError={(e) => {
                                e.target.src = "/placeholder-product.jpg"; // fallback
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {product.name}
                              </p>
                              <p className="text-sm text-gray-600 mt-0.5">
                                ₹{product.price?.toLocaleString() || "—"}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Search Trigger */}
            <button
              className="sm:hidden text-gray-700 hover:text-black p-2 -mr-2"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-label="Search"
            >
              <Search size={22} />
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-700 hover:text-black p-2"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/96 backdrop-blur-xl z-[100] px-8 pt-24"
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-8 right-8 p-3 text-gray-600 hover:text-black"
              aria-label="Close menu"
            >
              <X size={36} />
            </button>

            <nav className="flex flex-col gap-10">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  onClick={() => handleNavClick(link.path)}
                  className={`text-5xl sm:text-6xl font-bold tracking-tight text-left ${
                    location.pathname === link.path
                      ? "text-black"
                      : "text-gray-800 hover:text-black/70"
                  } transition-colors`}
                >
                  {link.name}
                </motion.button>
              ))}
            </nav>

            <div className="mt-16 pt-10 border-t border-gray-200">
              <p className="text-gray-500 mb-4">Explore collection</p>
              <button
                onClick={() => handleNavClick("/models")}
                className="flex items-center gap-3 text-lg font-medium text-black hover:text-gray-700 transition-colors"
              >
                Shop now <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile-only full-screen search */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/98 backdrop-blur-xl z-[90] pt-20 px-5 sm:hidden"
          >
            <div className="max-w-md mx-auto">
              <div className="relative mb-6">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                  className="w-full h-12 pl-12 pr-5 rounded-full bg-gray-100 border border-gray-200 text-base outline-none focus:ring-2 focus:ring-black/30"
                />
              </div>

              {searchTerm.trim().length >= 2 && (
                <div className="space-y-2">
                  {filteredProducts.length === 0 ? (
                    <p className="text-center py-12 text-gray-500">
                      No products found
                    </p>
                  ) : (
                    filteredProducts.map((product) => (
                      <div
                        key={product._id || product.id}
                        onClick={() =>
                          handleNavClick(
                            `/product/${product._id || product.id}`
                          )
                        }
                        className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 cursor-pointer"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                        />
                        <div>
                          <p className="font-medium line-clamp-2">
                            {product.name}
                          </p>
                          <p className="text-gray-600 mt-1">
                            ₹{product.price?.toLocaleString() || "—"}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <button
              className="absolute top-6 right-6 text-gray-600 hover:text-black"
              onClick={() => setIsDropdownOpen(false)}
            >
              <X size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}