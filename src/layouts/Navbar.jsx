import React, { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Search,
  Menu,
  X,
  ArrowRight,
  User,
  ShoppingBag,
  Heart,
  ChevronDown,
} from "lucide-react";
import { useProducts } from "../Context/ProductContext";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/hhhh.jpg";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { products = [], shopCategories = [] } = useProducts();
  const searchRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close search dropdown on outside click
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
    setMobileOpen(false);
    setIsDropdownOpen(false);
    setSearchTerm("");
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-md border-b-[3px] border-b-gray-100"
            : "bg-white/95 backdrop-blur-md border-b border-gray-100"
        }`}
      >
        {/* UPPER ROW: Logo - Search - Icons */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between gap-4 sm:gap-8">
          {/* 1. LOGO */}
          <Link
            to="/"
            className="flex-shrink-0"
            onClick={() => window.scrollTo(0, 0)}
          >
            <img
              src={logo}
              alt="Logo"
              className="h-16 md:h-20 object-contain mix-blend-multiply"
            />
          </Link>
          {/* 2. SEARCH BAR (Desktop) */}
          <div
            ref={searchRef}
            className="hidden md:block flex-1 max-w-2xl relative"
          >
            <div className="relative group">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsDropdownOpen(true);
                }}
                className="w-full h-11 pl-4 pr-12 rounded-sm border border-gray-300 bg-white text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-gray-400"
              />
              <button className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-amber-600 hover:text-amber-700">
                <Search size={20} />
              </button>
            </div>

            {/* Search Dropdown */}
            <AnimatePresence>
              {isDropdownOpen && searchTerm.trim().length >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute left-0 right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50"
                >
                  {filteredProducts.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No products found
                    </div>
                  ) : (
                    <div>
                      {filteredProducts.map((product) => (
                        <div
                          key={product._id || product.id}
                          onClick={() =>
                            handleNavClick(
                              `/product/${product._id || product.id}`,
                            )
                          }
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-none"
                        >
                          <img
                            src={product.image || "/placeholder-product.jpg"}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded bg-gray-100"
                            onError={(e) => {
                              e.target.src = "/placeholder-product.jpg";
                            }}
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              ₹{product.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* NEW: Custom Book Button */}
          <Link
            to="/custom-book"
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-md text-sm font-bold shadow-md hover:shadow-lg transition-all hover:scale-105 whitespace-nowrap"
          >
            <span>Create Custom Book</span>
            <ArrowRight size={16} />
          </Link>

          {/* Mobile Menu & Search Toggle */}
          <div className="flex md:hidden items-center gap-4">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-2 text-gray-700"
            >
              <Search size={22} />
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 text-gray-700"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* BOTTOM ROW: Categories (Desktop Only) */}
        <div className="hidden md:block flex justify-center border-t border-gray-100 bg-white">
          <div className="max-w-[1440px] mx-auto px-2 sm:px-4">
            <nav className="flex items-center justify-center gap-4 py-2 overflow-x-auto no-scrollbar">
              <Link
                to="/"
                className={`text-xs font-bold uppercase tracking-wide whitespace-nowrap px-2 py-1 rounded-md transition-colors ${
                  location.pathname === "/"
                    ? "bg-amber-600 text-white"
                    : "text-gray-700 hover:text-amber-600"
                }`}
              >
                HOME
              </Link>

              {shopCategories.length > 0 ? (
                shopCategories.map((cat) => {
                  const isActive = location.search.includes(cat.name);
                  return (
                    <Link
                      key={cat._id || cat.id}
                      to={`/models?category=${encodeURIComponent(cat.name)}`}
                      className={`text-xs font-bold uppercase tracking-wide whitespace-nowrap px-2 py-1 rounded-md transition-colors flex items-center gap-1 ${
                        isActive
                          ? "text-amber-600"
                          : "text-gray-700 hover:text-amber-600"
                      }`}
                    >
                      {cat.name}
                      <ChevronDown size={12} className="opacity-50" />
                    </Link>
                  );
                })
              ) : (
                <>
                  <Link
                    to="/models"
                    className="text-xs font-bold uppercase tracking-wide text-gray-700 hover:text-amber-600 px-2"
                  >
                    BODY GRAPHICS
                  </Link>
                  <Link
                    to="/models"
                    className="text-xs font-bold uppercase tracking-wide text-gray-700 hover:text-amber-600 px-2"
                  >
                    MONOGRAM
                  </Link>
                  <Link
                    to="/models"
                    className="text-xs font-bold uppercase tracking-wide text-gray-700 hover:text-amber-600 px-2"
                  >
                    FASTENERS
                  </Link>
                </>
              )}

              <Link
                to="/services"
                className="text-xs font-bold uppercase tracking-wide text-gray-700 hover:text-amber-600 whitespace-nowrap px-2 flex items-center gap-1"
              >
                MORE <ChevronDown size={12} className="opacity-50" />
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* MOBILE SEARCH OVERLAY */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[60] bg-white px-4 pt-4 md:hidden"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <button onClick={() => setIsDropdownOpen(false)}>
                <X size={24} className="text-gray-500" />
              </button>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                className="flex-1 text-lg outline-none placeholder:text-gray-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-xs font-bold uppercase bg-gray-100 px-2 py-1 rounded"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="mt-4 space-y-4">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleNavClick(`/product/${product._id}`)}
                  className="flex gap-4"
                >
                  <img
                    src={product.image || "/placeholder-product.jpg"}
                    className="w-16 h-16 bg-gray-100 rounded object-cover"
                    onError={(e) => (e.target.src = "/placeholder-product.jpg")}
                  />
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">₹{product.price}</p>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && searchTerm.length > 1 && (
                <p className="text-center text-gray-400 mt-10">
                  No results found.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE HAMBURGER MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 bg-white z-[60] overflow-y-auto"
          >
            <div className="p-5 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <img src={logo} alt="Logo" className="h-10 object-contain" />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 bg-gray-100 rounded-full"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-6">
                <button
                  onClick={() => handleNavClick("/")}
                  className="block text-2xl font-bold"
                >
                  Home
                </button>

                <div className="space-y-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Shop By Category
                  </p>
                  {shopCategories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() =>
                        handleNavClick(
                          `/models?category=${encodeURIComponent(cat.name)}`,
                        )
                      }
                      className="flex items-center justify-between w-full text-lg font-medium border-b border-gray-50 pb-3"
                    >
                      {cat.name}{" "}
                      <ArrowRight size={16} className="text-gray-300" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
