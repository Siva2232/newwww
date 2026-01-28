import { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X, Facebook, Instagram, ArrowRight } from "lucide-react";
import { useProducts } from "../Context/ProductContext";
import { motion, AnimatePresence } from "framer-motion";
import hhhh from '../assets/hhhh.jpg';

const navLinks = [
  { name: "HOME", path: "/" },
  { name: "PRODUCTS", path: "/models" },
  { name: "Book Album", path: "/custom-book" },
  { name: "SERVICES", path: "/services" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Search state
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef(null);

  const getDisplayCategory = (cat) => {
    switch (cat) {
      case "frames": return "Frames";
      case "albums": return "Albums";
      case "books": return "Photo Books";
      default: return cat || "";
    }
  };

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase().trim();
    return products
      .filter(p => 
        (p.name || "").toLowerCase().includes(q) || 
        (p.description || "").toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [products, searchTerm]);

  const location = useLocation();
  const navigate = useNavigate();

  // Click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isDropdownOpen]);

  // Prevent body scroll during transition
  useEffect(() => {
    if (isTransitioning) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isTransitioning]);

  // Scroll to top after navigation/transition
  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, isTransitioning]);

  const handleNavClick = (path) => {
    if (location.pathname === path) {
      setMobileOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsTransitioning(true);
    setMobileOpen(false);

    setTimeout(() => {
      navigate(path);
    }, 400);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 900);
  };

  return (
    <>
      {/* Page Transition Loader */}
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 bg-white z-[60] flex items-center justify-center"
          >
            <motion.div
              className="flex gap-3"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-amber-500 rounded-full"
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeOut",
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
        <div className="bg-white/70 backdrop-blur-xl border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 md:h-24 flex items-center justify-between gap-4">
            
            {/* Logo */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNavClick("/")}
              className="flex-shrink-0 relative group"
            >
              <img
                src={hhhh}
                alt="Logo"
                className="h-14 w-14 md:h-18 md:w-18 lg:h-20 lg:w-20 object-contain drop-shadow-sm transition-transform duration-300 group-hover:drop-shadow-md"
              />
            </motion.button>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div ref={searchRef} className="relative w-full">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search our collection..."
                    className="w-full py-2.5 px-5 pr-12 rounded-full border border-gray-200 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all duration-300 text-sm bg-gray-50/50 hover:bg-white focus:bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsDropdownOpen(true)}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {searchTerm && (
                      <button
                        onClick={() => { setSearchTerm(""); setIsDropdownOpen(false); }}
                        className="p-1 hover:bg-gray-100 rounded-full text-gray-400 transition"
                      >
                        <X size={14} />
                      </button>
                    )}
                    <Search className="text-gray-400 group-focus-within:text-amber-500 transition-colors" size={18} />
                  </div>
                </div>

                {/* Search Dropdown */}
                <AnimatePresence>
                  {isDropdownOpen && searchTerm.trim().length >= 2 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
                    >
                      <ul className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                        {filteredProducts.length === 0 ? (
                          <li className="p-8 text-center text-gray-400 text-sm italic">No matching products</li>
                        ) : (
                          filteredProducts.map((product) => (
                            <li key={product.id} className="group">
                              <div
                                onMouseDown={() => {
                                  navigate(`/product/${product.id}`);
                                  setSearchTerm("");
                                  setIsDropdownOpen(false);
                                }}
                                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-amber-50/50 transition-colors"
                              >
                                <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-gray-100 flex-shrink-0">
                                  <img
                                    src={product.image || product.mainImage || product.images?.[0] || "https://via.placeholder.com/120"}
                                    alt={product.name}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-gray-900 truncate text-sm">{product.name}</h4>
                                  <div className="flex items-center justify-between mt-1">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                                      {getDisplayCategory(product.category)}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-900">₹{product.price}</span>
                                  </div>
                                </div>
                                <ArrowRight size={16} className="text-gray-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                              </div>
                            </li>
                          ))
                        )}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.path)}
                    className={`relative px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                      isActive ? "text-amber-600" : "text-gray-500 hover:text-black"
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-4 right-4 h-0.5 bg-amber-500 rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Mobile Actions */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileOpen((prev) => !prev)}
                className="p-2.5 rounded-xl bg-gray-50 text-gray-900 hover:bg-gray-100 transition-colors"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 bottom-0 w-[80%] max-w-sm bg-white z-50 lg:hidden shadow-2xl flex flex-col"
              >
                <div className="p-6 flex justify-end">
                   <button onClick={() => setMobileOpen(false)} className="p-2"><X size={24}/></button>
                </div>

                <nav className="flex-1 px-8 pt-4 space-y-6">
                  {navLinks.map((link, idx) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={link.name}
                        onClick={() => handleNavClick(link.path)}
                        className={`w-full text-left group flex items-center justify-between ${
                          isActive ? "text-amber-600" : "text-gray-400"
                        }`}
                      >
                        <span className="text-2xl font-light tracking-tight uppercase">
                          {link.name}
                        </span>
                        <ArrowRight size={20} className={`transition-transform ${isActive ? "translate-x-0" : "-translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"}`} />
                      </motion.button>
                    );
                  })}
                </nav>

                <div className="p-8 border-t border-gray-50 flex justify-center gap-8">
                  <a href="#" className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all">
                    <Facebook size={20} />
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all">
                    <Instagram size={20} />
                  </a>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}