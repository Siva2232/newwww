import React, { useState, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  Search,
  Menu,
  X,
  ArrowRight,
  ShoppingBag,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useProducts } from "../Context/ProductContext";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/hhhh.jpg";
import { getImageUrl } from "../utils/imageUrl";
import * as api from "../api";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [activeMoreMenu, setActiveMoreMenu] = useState(false);
  // results can include products, categories, and subcategories
  const [searchResults, setSearchResults] = useState({
    products: [],
    categories: [],
    subcategories: [],
  });
  const [searchLoading, setSearchLoading] = useState(false);

  const { products = [], shopCategories = [], shopSubCategories = [] } = useProducts();
  const productsRef = useRef(products);
  productsRef.current = products;

  // Search logic — local first for instant results, API only when term is longer
  useEffect(() => {
    const trimmed = searchTerm.trim();
    if (trimmed.length < 1) {
      setSearchResults({ products: [], categories: [], subcategories: [] });
      setSearchLoading(false);
      return;
    }

    const term = trimmed.toLowerCase();
    const matchingCats = shopCategories.filter((c) =>
      c.name.toLowerCase().includes(term),
    );
    const matchingSubcats = shopSubCategories.filter((sc) => {
      const name = typeof sc.name === "string" ? sc.name : "";
      return name.toLowerCase().includes(term);
    });
    const localProducts = productsRef.current.filter((p) =>
      (p.name || "").toLowerCase().includes(term),
    );

    setSearchResults({
      products: localProducts,
      categories: matchingCats,
      subcategories: matchingSubcats,
    });

    if (trimmed.length < 2) {
      setSearchLoading(false);
      return;
    }

    let cancelled = false;
    const handler = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const productsRes = await api.searchProducts(trimmed);
        if (cancelled) return;
        setSearchResults({
          products:
            productsRes?.length > 0 ? productsRes : localProducts,
          categories: matchingCats,
          subcategories: matchingSubcats,
        });
      } catch {
        if (!cancelled) {
          setSearchResults({
            products: localProducts,
            categories: matchingCats,
            subcategories: matchingSubcats,
          });
        }
      } finally {
        if (!cancelled) setSearchLoading(false);
      }
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(handler);
    };
  }, [searchTerm, shopCategories, shopSubCategories]);

  const filteredProducts = searchResults.products;
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

  // Expose mobileOpen to window/context if feasible, or use a custom event
  useEffect(() => {
    const event = new CustomEvent('nav-mobile-menu-change', { 
      detail: { isOpen: mobileOpen } 
    });
    window.dispatchEvent(event);
  }, [mobileOpen]);

  const handleNavClick = (path) => {
    setMobileOpen(false);
    setIsDropdownOpen(false);
    setSearchTerm("");
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // helper normalizer for category/subcategory value which may be a string or object
  const normalize = (val) => {
    if (!val) return "";
    if (typeof val === "string") return val.trim().toLowerCase();
    if (typeof val === "object" && val.name)
      return String(val.name).trim().toLowerCase();
    return "";
  };

  // products to show in the middle column; only when a subcategory is hovered
  const middleProducts = useMemo(() => {
    if (!products || products.length === 0 || !activeSubcategory) return [];
    return products
      .filter((p) => {
        const sub = normalize(p?.subcategory);
        return sub === activeSubcategory.toLowerCase();
      })
      .slice(0, 5);
  }, [products, activeSubcategory]);

  // when the middle list changes, update preview
  useEffect(() => {
    if (middleProducts.length > 0) {
      setPreviewProduct(middleProducts[0]);
    } else {
      setPreviewProduct(null);
    }
  }, [middleProducts]);

  // clear subcategory when main category closes or changes
  useEffect(() => {
    if (!activeCategory) {
      setActiveSubcategory(null);
    }
  }, [activeCategory]);


  const navLinkClass = (active) =>
    `relative px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors ${
      active
        ? "text-orange-600"
        : "text-[#6e6e73] hover:text-[#1d1d1f]"
    }`;

  return (
    <>
      <header
        className={`fixed top-0 left-0 z-50 w-full transition-[background-color,box-shadow,border-color] duration-200 ${
          scrolled
            ? "border-b border-black/[0.06] bg-white/95 shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
            : "border-b border-black/[0.04] bg-white/90"
        }`}
      >
        {/* Top bar */}
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-3 px-4 sm:gap-5 sm:px-6 lg:h-[80px] lg:px-8">
          <Link
            to="/"
            className="shrink-0"
            onClick={() => window.scrollTo(0, 0)}
          >
            <img
              src={logo}
              alt="Logo"
              className="h-14 object-contain mix-blend-multiply sm:h-16 lg:h-[4.5rem]"
            />
          </Link>

          <div
            ref={searchRef}
            className="relative hidden max-w-xl flex-1 md:block lg:max-w-2xl"
          >
            <div className="group relative">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b] transition-colors group-focus-within:text-orange-600"
                size={17}
                aria-hidden
              />
              <input
                type="search"
                placeholder="Search products, categories..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => searchTerm.trim() && setIsDropdownOpen(true)}
                className="h-10 w-full rounded-full border border-transparent bg-[#f5f5f7] pl-11 pr-10 text-sm font-medium text-[#1d1d1f] outline-none transition-all placeholder:text-[#86868b] focus:border-orange-200/80 focus:bg-white focus:ring-2 focus:ring-orange-500/15 lg:h-11"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setIsDropdownOpen(false);
                  }}
                  className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-[#e8e8ed] text-[#1d1d1f] hover:bg-[#d2d2d7]"
                  aria-label="Clear search"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <AnimatePresence>
              {isDropdownOpen && searchTerm.trim().length >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_16px_48px_rgba(0,0,0,0.12)]"
                >
                  {searchLoading ? (
                    <div className="flex items-center justify-center gap-2 p-6 text-sm font-medium text-[#86868b]">
                      <Loader2 size={20} className="animate-spin text-orange-500" />
                      Searching...
                    </div>
                  ) : (
                    <div className="max-h-[min(70vh,420px)] overflow-y-auto">
                      {searchResults.categories.length > 0 && (
                        <div className="border-b border-black/[0.04] p-2">
                          <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#86868b]">
                            Categories
                          </p>
                          {searchResults.categories.map((cat) => (
                            <button
                              key={cat._id || cat.id}
                              type="button"
                              onClick={() =>
                                handleNavClick(
                                  `/models?category=${encodeURIComponent(cat.name)}`,
                                )
                              }
                              className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#1d1d1f] transition-colors hover:bg-[#f5f5f7]"
                            >
                              {cat.name}
                            </button>
                          ))}
                        </div>
                      )}

                      {searchResults.subcategories.length > 0 && (
                        <div className="border-b border-black/[0.04] p-2">
                          <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#86868b]">
                            Subcategories
                          </p>
                          {searchResults.subcategories.map((sc) => (
                            <button
                              key={sc._id || sc.id}
                              type="button"
                              onClick={() =>
                                handleNavClick(
                                  `/models?subcategory=${encodeURIComponent(sc.name)}`,
                                )
                              }
                              className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#1d1d1f] transition-colors hover:bg-[#f5f5f7]"
                            >
                              {sc.name}
                            </button>
                          ))}
                        </div>
                      )}

                      {filteredProducts.length > 0 &&
                        filteredProducts.map((product) => (
                          <button
                            key={product._id || product.id}
                            type="button"
                            onClick={() =>
                              handleNavClick(
                                `/product/${product._id || product.id}`,
                              )
                            }
                            className="flex w-full items-center gap-3 border-b border-black/[0.03] p-3 text-left transition-colors last:border-none hover:bg-[#f5f5f7]"
                          >
                            <img
                              src={
                                getImageUrl(product.image) ||
                                "/placeholder-product.jpg"
                              }
                              alt={product.name}
                              className="h-11 w-11 shrink-0 rounded-xl bg-[#f5f5f7] object-cover"
                              onError={(e) => {
                                e.target.src = "/placeholder-product.jpg";
                              }}
                            />
                            <div className="min-w-0">
                              <p className="line-clamp-1 text-sm font-semibold text-[#1d1d1f]">
                                {product.name}
                              </p>
                              <p className="text-xs font-medium text-[#86868b]">
                                ₹{product.price}
                              </p>
                            </div>
                            <ArrowRight
                              size={14}
                              className="ml-auto shrink-0 text-[#86868b]"
                            />
                          </button>
                        ))}

                      {searchResults.categories.length === 0 &&
                        searchResults.subcategories.length === 0 &&
                        filteredProducts.length === 0 && (
                          <div className="p-6 text-center text-sm font-medium text-[#86868b]">
                            No results found
                          </div>
                        )}

                      {(filteredProducts.length > 0 ||
                        searchResults.categories.length > 0 ||
                        searchResults.subcategories.length > 0) && (
                        <div className="border-t border-black/[0.04] p-2">
                          <button
                            type="button"
                            onClick={() => handleNavClick("/models")}
                            className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-orange-600 transition-colors hover:bg-orange-50"
                          >
                            More results
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/models"
            className="hidden shrink-0 items-center gap-2 rounded-full bg-[#f7ef22] px-4 py-2.5 text-xs font-bold text-black shadow-md transition-all hover:bg-[#f7ef22]/90 hover:scale-105 active:scale-[0.98] md:flex lg:px-5 lg:text-sm"
          >
            <span className="whitespace-nowrap">Shop Now</span>
            <ArrowRight size={16} className="shrink-0" />
          </Link>

          <div className="flex items-center gap-1 md:hidden">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#1d1d1f] transition-colors hover:bg-[#f5f5f7]"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#1d1d1f] transition-colors hover:bg-[#f5f5f7]"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>

        {/* Category nav — desktop */}
        <div className="hidden border-t border-black/[0.04] bg-white/50 md:block">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-center gap-1 py-1">
              {/* <Link
                to="/"
                className={`text-xs font-bold uppercase tracking-wide whitespace-nowrap px-2 py-1 rounded-md transition-colors ${
                  location.pathname === "/"
                    ? "bg-amber-600 text-white"
                    : "text-gray-700 hover:text-amber-600"
                }`}
              >
                HOME
              </Link> */}

              {shopCategories.length > 0 ? (
                shopCategories.map((cat, index) => {
                  const isActive = location.search.includes(cat.name);
                  // Dynamic positioning to prevent overflow
                  const isLast = index === shopCategories.length - 1;
                  const isFirst = index === 0;
                  const dropdownClasses = isLast
                    ? "right-0 origin-top-right"
                    : isFirst
                    ? "left-0 origin-top-left"
                    : "left-1/2 -translate-x-1/2 origin-top";

                  return (
                    <div
                      key={cat._id || cat.id}
                      className="relative group h-full flex items-center"
                      onMouseEnter={() => {
                        setActiveCategory(cat.name);
                        setActiveSubcategory(null);
                      }}
                      onMouseLeave={() => setActiveCategory(null)}
                    >
                      <Link
                        to={`/models?category=${encodeURIComponent(cat.name)}`}
                        className={`${navLinkClass(isActive)} flex items-center gap-1`}
                      >
                        {cat.name}
                        <ChevronDown
                          size={12}
                          className={`opacity-50 transition-transform ${activeCategory === cat.name ? "rotate-180" : ""}`}
                        />
                      </Link>

                      <AnimatePresence>
                        {activeCategory === cat.name && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.2 }}
                            className={`absolute top-full z-50 mt-2 flex w-[min(92vw,680px)] overflow-hidden rounded-[20px] border border-black/[0.06] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.12)] ${dropdownClasses}`}
                            onMouseEnter={() => setActiveCategory(cat.name)}
                            onMouseLeave={() => setActiveCategory(null)}
                          >
                          <div className="w-[34%] border-r border-black/[0.04] bg-[#fafafa] p-3">
                            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#86868b]">
                              Subcollections
                            </p>
                            <div className="flex flex-col gap-1">
                              {shopSubCategories
                                .filter((sc) => {
                                  const catName =
                                    typeof sc.category === "string"
                                      ? sc.category
                                      : sc.category?.name;
                                  return catName === cat.name;
                                })
                                .map((sc) => (
                                  <button
                                    key={sc._id || sc.id}
                                    type="button"
                                    onMouseEnter={() =>
                                      setActiveSubcategory(sc.name)
                                    }
                                    onClick={() =>
                                      handleNavClick(
                                        `/models?category=${encodeURIComponent(
                                          cat.name,
                                        )}&subcategory=${encodeURIComponent(
                                          sc.name,
                                        )}`,
                                      )
                                    }
                                    className={`rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all ${
                                      activeSubcategory === sc.name
                                        ? "bg-white text-[#1d1d1f] shadow-sm ring-1 ring-black/[0.04]"
                                        : "text-[#6e6e73] hover:bg-white/80 hover:text-[#1d1d1f]"
                                    }`}
                                  >
                                    {sc.name}
                                  </button>
                                ))}
                            </div>
                          </div>

                          <div className="flex w-[33%] flex-col border-r border-black/[0.04] py-2">
                            <div className="flex flex-1 flex-col">
                              {middleProducts.length > 0 ? (
                                middleProducts.map((product) => (
                                  <Link
                                    key={product._id || product.id}
                                    to={`/product/${product._id || product.id}`}
                                    className="group/item flex items-center justify-between border-l-2 border-transparent px-4 py-3 transition-all hover:border-orange-500 hover:bg-orange-50/50"
                                    onMouseEnter={() =>
                                      setPreviewProduct(product)
                                    }
                                    onClick={() => setActiveCategory(null)}
                                  >
                                    <span className="line-clamp-1 text-sm font-medium text-[#1d1d1f] group-hover/item:text-orange-700">
                                      {product.name}
                                    </span>
                                    <ArrowRight
                                      size={14}
                                      className="shrink-0 text-orange-500 opacity-0 transition-opacity group-hover/item:opacity-100"
                                    />
                                  </Link>
                                ))
                              ) : (
                                <p className="px-4 py-10 text-center text-sm font-medium text-[#86868b]">
                                  {activeSubcategory
                                    ? "No products found"
                                    : "Hover a subcategory"}
                                </p>
                              )}
                            </div>
                            {middleProducts.length > 0 && (
                              <div className="mt-auto border-t border-black/[0.04] px-3 pt-2">
                                <Link
                                  to={`/models?category=${encodeURIComponent(cat.name)}${
                                    activeSubcategory
                                      ? `&subcategory=${encodeURIComponent(
                                          activeSubcategory,
                                        )}`
                                      : ""
                                  }`}
                                  className="block rounded-xl bg-[#1d1d1f] py-2.5 text-center text-[10px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-black"
                                  onClick={() => setActiveCategory(null)}
                                >
                                  View all
                                </Link>
                              </div>
                            )}
                          </div>

                            <div className="flex w-[33%] flex-col items-center justify-center bg-[#f5f5f7] p-5 text-center">
                                {previewProduct ? (
                                  <Link
                                    to={`/product/${previewProduct._id || previewProduct.id}`}
                                    onClick={() => setActiveCategory(null)}
                                    className="group/preview flex w-full flex-col items-center"
                                  >
                                    <div className="relative mb-4 h-40 w-40 overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow group-hover/preview:shadow-[0_12px_32px_rgba(0,0,0,0.12)]">
                                      <img
                                        src={
                                          getImageUrl(previewProduct.image) ||
                                          "/placeholder-product.jpg"
                                        }
                                        alt={previewProduct.name}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover/preview:scale-105"
                                        onError={(e) => {
                                          e.target.src =
                                            "/placeholder-product.jpg";
                                        }}
                                      />
                                    </div>
                                    <h4 className="mb-1 line-clamp-2 px-2 text-sm font-semibold text-[#1d1d1f]">
                                      {previewProduct.name}
                                    </h4>
                                    <p className="text-base font-semibold text-orange-600">
                                      ₹{previewProduct.price}
                                    </p>
                                  </Link>
                                ) : (
                                   <div className="flex flex-col items-center text-[#86868b]/60">
                                     <ShoppingBag size={40} className="mb-2" strokeWidth={1.25} />
                                     <p className="text-xs font-medium">Hover a product to preview</p>
                                   </div>
                                )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              ) : (
                <>
                  <Link to="/models" className={navLinkClass(false)}>
                    Shop
                  </Link>
                </>
              )}

              <div
                className="relative flex items-center"
                onMouseEnter={() => setActiveMoreMenu(true)}
                onMouseLeave={() => setActiveMoreMenu(false)}
              >
                <button
                  type="button"
                  className={`${navLinkClass(false)} flex items-center gap-1`}
                >
                  More
                  <ChevronDown
                    size={12}
                    className={`opacity-50 transition-transform ${activeMoreMenu ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {activeMoreMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full z-50 mt-2 min-w-[200px] overflow-hidden rounded-2xl border border-black/[0.06] bg-white py-2 shadow-[0_16px_40px_rgba(0,0,0,0.12)]"
                      onMouseEnter={() => setActiveMoreMenu(true)}
                      onMouseLeave={() => setActiveMoreMenu(false)}
                    >
                      {[
                        { label: "Shop all", path: "/models" },
                        { label: "Services", path: "/services" },
                        { label: "Portfolio", path: "/portfolio" },
                        { label: "About", path: "/about" },
                        { label: "Contact", path: "/contact" },
                      ].map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => {
                            setActiveMoreMenu(false);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="block px-4 py-2.5 text-sm font-medium text-[#1d1d1f] transition-colors hover:bg-[#f5f5f7] hover:text-orange-600"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile search */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] md:hidden"
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
              onClick={() => setIsDropdownOpen(false)}
              aria-label="Close search"
            />
            <motion.div
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              className="relative mx-3 mt-[80px] overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-2xl sm:mx-4"
            >
              <div className="flex items-center gap-2 border-b border-black/[0.04] px-4 py-3">
                <Search size={18} className="shrink-0 text-[#86868b]" />
                <input
                  type="search"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                  className="min-w-0 flex-1 bg-transparent text-base font-medium outline-none placeholder:text-[#86868b]"
                />
                <button
                  type="button"
                  onClick={() =>
                    searchTerm ? setSearchTerm("") : setIsDropdownOpen(false)
                  }
                  className="shrink-0 rounded-full bg-[#f5f5f7] px-3 py-1.5 text-xs font-semibold text-[#1d1d1f]"
                >
                  {searchTerm ? "Clear" : "Cancel"}
                </button>
              </div>

              <div className="max-h-[60vh] space-y-3 overflow-y-auto p-3">
                {searchLoading && (
                  <div className="flex items-center justify-center gap-2 py-8 text-sm text-[#86868b]">
                    <Loader2 size={18} className="animate-spin text-orange-500" />
                    Searching...
                  </div>
                )}

                {!searchLoading && searchResults.categories.length > 0 && (
                  <div>
                    <p className="mb-1 px-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#86868b]">
                      Categories
                    </p>
                    {searchResults.categories.map((cat) => (
                      <button
                        key={cat._id || cat.id}
                        type="button"
                        onClick={() =>
                          handleNavClick(
                            `/models?category=${encodeURIComponent(cat.name)}`,
                          )
                        }
                        className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium hover:bg-[#f5f5f7]"
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}

                {!searchLoading && searchResults.subcategories.length > 0 && (
                  <div>
                    <p className="mb-1 px-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#86868b]">
                      Subcategories
                    </p>
                    {searchResults.subcategories.map((sc) => (
                      <button
                        key={sc._id || sc.id}
                        type="button"
                        onClick={() =>
                          handleNavClick(
                            `/models?subcategory=${encodeURIComponent(sc.name)}`,
                          )
                        }
                        className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium hover:bg-[#f5f5f7]"
                      >
                        {sc.name}
                      </button>
                    ))}
                  </div>
                )}

                {!searchLoading &&
                  filteredProducts.map((product) => (
                    <button
                      key={product._id || product.id}
                      type="button"
                      onClick={() =>
                        handleNavClick(`/product/${product._id || product.id}`)
                      }
                      className="flex w-full gap-3 rounded-xl p-2 text-left hover:bg-[#f5f5f7]"
                    >
                      <img
                        src={
                          getImageUrl(product.image) ||
                          "/placeholder-product.jpg"
                        }
                        alt=""
                        className="h-14 w-14 shrink-0 rounded-xl bg-[#f5f5f7] object-cover"
                        onError={(e) =>
                          (e.target.src = "/placeholder-product.jpg")
                        }
                      />
                      <div className="min-w-0 py-1">
                        <p className="line-clamp-1 font-semibold text-[#1d1d1f]">
                          {product.name}
                        </p>
                        <p className="text-sm font-medium text-[#86868b]">
                          ₹{product.price}
                        </p>
                      </div>
                    </button>
                  ))}

                {!searchLoading &&
                  filteredProducts.length === 0 &&
                  searchTerm.trim().length >= 1 &&
                  searchResults.categories.length === 0 &&
                  searchResults.subcategories.length === 0 && (
                    <p className="py-10 text-center text-sm font-medium text-[#86868b]">
                      No results found
                    </p>
                  )}

                {!searchLoading &&
                  (filteredProducts.length > 0 ||
                    searchResults.categories.length > 0 ||
                    searchResults.subcategories.length > 0) && (
                    <button
                      type="button"
                      onClick={() => handleNavClick("/models")}
                      className="flex w-full items-center justify-between rounded-xl border-t border-black/[0.04] px-3 py-3 text-sm font-semibold text-orange-600"
                    >
                      More results
                      <ArrowRight size={14} />
                    </button>
                  )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[58] bg-black/40 backdrop-blur-[2px] md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-[60] flex w-[min(100%,320px)] flex-col overflow-y-auto bg-white shadow-2xl md:hidden"
            >
              <div className="flex items-center justify-between border-b border-black/[0.04] px-5 py-4">
                <img src={logo} alt="Logo" className="h-12 object-contain" />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f7]"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-1 flex-col gap-6 p-5">
                <button
                  type="button"
                  onClick={() => handleNavClick("/")}
                  className="w-full text-left text-xl font-semibold tracking-tight text-[#1d1d1f]"
                >
                  Home
                </button>

                <div>
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#86868b]">
                    Shop by category
                  </p>
                  <div className="flex flex-col gap-1">
                    {shopCategories.map((cat) => (
                      <button
                        key={cat._id || cat.id}
                        type="button"
                        onClick={() =>
                          handleNavClick(
                            `/models?category=${encodeURIComponent(cat.name)}`,
                          )
                        }
                        className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[15px] font-medium text-[#1d1d1f] transition-colors hover:bg-[#f5f5f7]"
                      >
                        {cat.name}
                        <ArrowRight size={16} className="text-[#86868b]" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 border-t border-black/[0.04] pt-5">
                  <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#86868b]">
                    More
                  </p>
                  {[
                    { label: "Shop now", path: "/models" },
                    { label: "Services", path: "/services" },
                    { label: "Portfolio", path: "/portfolio" },
                    { label: "About", path: "/about" },
                    { label: "Contact", path: "/contact" },
                  ].map((item) => (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => handleNavClick(item.path)}
                      className="w-full rounded-xl px-3 py-3 text-left text-[15px] font-medium text-[#1d1d1f] hover:bg-[#f5f5f7]"
                    >
                      {item.label}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => handleNavClick("/models")}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#f7ef22] py-3.5 text-sm font-bold text-black shadow-md transition-all hover:bg-[#f7ef22]/90 active:scale-[0.98]"
                  >
                    Shop Now
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
