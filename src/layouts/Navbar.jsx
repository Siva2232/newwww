import React, { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Search, Menu, X, Instagram, ArrowRight, ShoppingBag } from "lucide-react";
import { useProducts } from "../Context/ProductContext";
import { motion, AnimatePresence } from "framer-motion";
import hhhh from '../assets/hhhh.jpg';

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/models" },
  { name: "Book Album", path: "/custom-book" },
  { name: "Services", path: "/services" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false); // Added back
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const { products } = useProducts();
  const searchRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle Navigation with Loader logic
  const handleNavClick = (path) => {
    if (location.pathname === path) {
      setMobileOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setIsTransitioning(true);
    setMobileOpen(false);
    
    // Smooth timing for Apple-style transition
    setTimeout(() => {
      navigate(path);
      // Extra delay to ensure content is ready before hiding loader
      setTimeout(() => setIsTransitioning(false), 600);
    }, 500);
  };

  const filteredProducts = useMemo(() => {
    if (searchTerm.length < 2) return [];
    return products
      .filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 5);
  }, [products, searchTerm]);

  return (
    <>
      {/* PAGE TRANSITION LOADER - Reintegrated */}
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[200] flex items-center justify-center"
          >
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-black/80 rounded-full"
                  animate={{ 
                    scale: [1, 1.5, 1], 
                    opacity: [0.3, 1, 0.3] 
                  }}
                  transition={{ 
                    duration: 0.8, 
                    repeat: Infinity, 
                    delay: i * 0.15 
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header 
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
          scrolled ? "bg-white/80 backdrop-blur-xl border-b border-black/5 py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between gap-8">
          
          {/* LOGO */}
          <button 
            onClick={() => handleNavClick("/")} 
            className="flex-shrink-0 relative z-[110]"
          >
            <motion.img
              src={hhhh}
              alt="Logo"
              className={`transition-all duration-500 object-contain ${scrolled ? "h-8" : "h-10"}`}
            />
          </button>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.path)}
                  className={`text-[13px] font-medium transition-colors duration-300 ${
                    isActive ? "text-black" : "text-black/60 hover:text-black"
                  }`}
                >
                  {link.name}
                </button>
              );
            })}
          </nav>

          {/* ACTIONS AREA */}
          <div className="flex items-center gap-5 flex-1 justify-end max-w-md">
            <div ref={searchRef} className="relative hidden sm:block w-full max-w-[180px] focus-within:max-w-[260px] transition-all duration-500">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" size={14} />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full h-8 pl-9 pr-4 rounded-full bg-black/5 border-none text-[13px] outline-none focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-black/30"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                />
              </div>

              {/* SEARCH RESULTS */}
              <AnimatePresence>
                {isDropdownOpen && searchTerm.length >= 2 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-[320px] bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-black/5 overflow-hidden"
                  >
                    <div className="px-5 py-4">
                      <p className="text-[11px] font-bold text-black/40 uppercase tracking-widest mb-3">Quick Search</p>
                      {filteredProducts.length === 0 ? (
                        <p className="py-4 text-center text-sm text-black/60">No items found</p>
                      ) : (
                        filteredProducts.map(product => (
                          <div 
                            key={product.id} 
                            onClick={() => { 
                                handleNavClick(`/product/${product.id}`); 
                                setIsDropdownOpen(false); 
                                setSearchTerm("");
                            }}
                            className="flex items-center gap-3 py-2 cursor-pointer group"
                          >
                            <img src={product.image} className="w-10 h-10 rounded-lg object-cover bg-black/5" />
                            <div className="flex-1 border-b border-black/5 pb-2 group-last:border-none">
                              <p className="text-[13px] font-medium text-black line-clamp-1">{product.name}</p>
                              <p className="text-[11px] text-black/40">₹{product.price}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button className="text-black/70 hover:text-black transition-colors">
              <ShoppingBag size={18} strokeWidth={1.5} />
            </button>
            <button onClick={() => setMobileOpen(true)} className="md:hidden text-black/70">
              <Menu size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/90 backdrop-blur-2xl z-[200] px-10 pt-24"
          >
            <button onClick={() => setMobileOpen(false)} className="absolute top-8 right-8 p-2 text-black/60">
              <X size={28} />
            </button>

            <nav className="flex flex-col gap-8">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <button 
                    onClick={() => handleNavClick(link.path)}
                    className="text-4xl font-semibold text-black tracking-tight text-left"
                  >
                    {link.name}
                  </button>
                </motion.div>
              ))}
            </nav>
            
            <div className="mt-16 pt-8 border-t border-black/10">
               <p className="text-black/40 text-sm mb-4">Discover the collection</p>
               <button onClick={() => handleNavClick("/models")} className="flex items-center gap-2 text-blue-600 font-medium">
                  Shop now <ArrowRight size={16} />
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}