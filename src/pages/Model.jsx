import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  LayoutGrid,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "../Context/ProductContext";
import ProductCard from "../components/common/ProductCard";
import { getImageUrl } from "../utils/imageUrl";
import { getProductId, isProductInList } from "../utils/productIds";

const whatsappNumber = "9746683778";

export const WhatsAppIcon = ({ size = 20, className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.884 3.088" />
  </svg>
);

const SectionEyebrow = ({ children }) => (
  <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-orange-700">
    <Sparkles size={12} className="shrink-0" aria-hidden />
    <span>{children}</span>
  </div>
);

const FilterChip = ({ label, onRemove }) => (
  <button
    type="button"
    onClick={onRemove}
    className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-xs font-medium text-[#1d1d1f] shadow-sm transition-colors hover:bg-[#f5f5f7]"
  >
    {label}
    <X size={12} className="text-[#86868b]" />
  </button>
);

const sidebarItemClass = (active) =>
  `flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-[13px] font-semibold transition-all ${
    active
      ? "bg-white text-[#1d1d1f] shadow-[0_4px_20px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]"
      : "text-[#6e6e73] hover:bg-white/60 hover:text-[#1d1d1f]"
  }`;

export default function ProductsShop() {
  const {
    products,
    shopCategories,
    shopSubCategories,
    trendingProductIds,
    bestSellerProductIds,
  } = useProducts();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [isFilterVisible, setIsFilterVisible] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 1024,
  );
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 1024,
  );

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsFilterVisible(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) setIsFilterVisible(false);
  }, [isMobile]);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && shopCategories.some((c) => c.name === cat)) {
      setSelectedCategory(cat);
    } else {
      setSelectedCategory("All");
    }
    const sub = searchParams.get("subcategory");
    if (
      sub &&
      shopSubCategories.some((sc) => {
        const catName =
          typeof sc.category === "string" ? sc.category : sc.category?.name;
        return sc.name === sub && catName === cat;
      })
    ) {
      setSelectedSubcategory(sub);
    } else {
      setSelectedSubcategory("All");
    }
  }, [searchParams, shopCategories, shopSubCategories]);

  useEffect(() => {
    setSelectedSubcategory("All");
  }, [selectedCategory]);

  const categoryButtons = useMemo(
    () => ["All", ...shopCategories.map((c) => c.name)],
    [shopCategories],
  );

  const subcategoryButtons = useMemo(() => {
    if (selectedCategory === "All") return [];
    return [
      "All",
      ...shopSubCategories
        .filter((sc) => {
          const catName =
            typeof sc.category === "string" ? sc.category : sc.category?.name;
          return catName === selectedCategory;
        })
        .map((sc) => sc.name),
    ];
  }, [shopSubCategories, selectedCategory]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" ||
        p.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSubcategory =
        selectedSubcategory === "All" ||
        p.subcategory?.toLowerCase() === selectedSubcategory.toLowerCase();
      const pid = getProductId(p);
      const matchesFeatured =
        selectedFilter === "All" ||
        (selectedFilter === "Trending" &&
          isProductInList(pid, trendingProductIds)) ||
        (selectedFilter === "Best Sellers" &&
          isProductInList(pid, bestSellerProductIds));
      return (
        matchesSearch &&
        matchesCategory &&
        matchesSubcategory &&
        matchesFeatured
      );
    });
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedSubcategory,
    selectedFilter,
    trendingProductIds,
    bestSellerProductIds,
  ]);

  const hasActiveFilters =
    selectedCategory !== "All" ||
    selectedSubcategory !== "All" ||
    selectedFilter !== "All" ||
    searchQuery.trim() !== "";

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedSubcategory("All");
    setSelectedFilter("All");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f]">
      {/* Page header */}
      <section className="border-b border-black/[0.04] bg-[#f5f5f7] px-4 pb-8 pt-8 sm:px-6 sm:pt-10 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-3">
              <SectionEyebrow>Catalog</SectionEyebrow>
              <h1 className="text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f]">
                Shop Studio.
                <span className="mt-1 block text-[0.55em] font-medium tracking-[-0.02em] text-[#86868b]">
                  Museum-grade excellence.
                </span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 rounded-full border border-black/[0.06] bg-white px-4 py-2 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:px-5 sm:py-2.5">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#86868b]">
                  Showing
                </span>
                <span className="text-sm font-semibold tabular-nums">
                  {filteredProducts.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky toolbar */}
      <div className="top-0 z-[100] border-b border-black/[0.04] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-3.5 lg:px-8">
          <button
            type="button"
            onClick={() => setIsFilterVisible(!isFilterVisible)}
            className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] transition-all active:scale-[0.98] ${
              isFilterVisible
                ? "bg-[#1d1d1f] text-white shadow-md"
                : "border border-black/[0.08] bg-white text-[#1d1d1f] shadow-sm hover:bg-[#f5f5f7]"
            }`}
          >
            <SlidersHorizontal size={14} />
            {isFilterVisible ? "Hide" : "Filters"}
          </button>

          <div className="group relative min-w-0 flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b] transition-colors group-focus-within:text-orange-600"
              size={17}
              aria-hidden
            />
            <input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-transparent bg-[#f5f5f7] py-2.5 pl-11 pr-10 text-sm font-medium text-[#1d1d1f] outline-none transition-all placeholder:text-[#86868b] focus:border-orange-200/80 focus:bg-white focus:ring-2 focus:ring-orange-500/15"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-[#e8e8ed] text-[#1d1d1f] hover:bg-[#d2d2d7]"
                aria-label="Clear search"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category stories */}
      <div className="mx-auto max-w-[1440px] px-4 pt-6 sm:px-6 lg:px-8">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#86868b]">
          Categories
        </p>
        <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 snap-x sm:-mx-6 sm:gap-5 sm:px-6 lg:mx-0 lg:px-0">
          <button
            type="button"
            onClick={() => setSelectedCategory("All")}
            className="flex min-w-[68px] flex-col items-center gap-2 snap-start sm:min-w-[76px]"
          >
            <div
              className={`rounded-full p-[2px] transition-all duration-300 ${
                selectedCategory === "All"
                  ? "bg-gradient-to-tr from-orange-500 to-amber-400"
                  : "bg-transparent ring-1 ring-black/[0.08] group-hover:ring-black/15"
              }`}
            >
              <div className="flex h-[64px] w-[64px] items-center justify-center overflow-hidden rounded-full border-[2.5px] border-white bg-[#1d1d1f] text-[10px] font-bold uppercase tracking-wider text-white sm:h-[72px] sm:w-[72px]">
                All
              </div>
            </div>
            <span
              className={`text-[11px] font-semibold ${
                selectedCategory === "All"
                  ? "text-orange-600"
                  : "text-[#6e6e73]"
              }`}
            >
              View all
            </span>
          </button>

          {shopCategories.map((cat, idx) => (
            <button
              key={cat.id || idx}
              type="button"
              onClick={() => setSelectedCategory(cat.name)}
              className="group flex min-w-[68px] flex-col items-center gap-2 snap-start sm:min-w-[76px]"
            >
              <div
                className={`rounded-full p-[2px] transition-all duration-300 ${
                  selectedCategory === cat.name
                    ? "bg-gradient-to-tr from-orange-500 to-amber-400"
                    : "bg-transparent ring-1 ring-black/[0.06] group-hover:ring-black/12"
                }`}
              >
                <div className="h-[64px] w-[64px] overflow-hidden rounded-full border-[2.5px] border-white bg-white sm:h-[72px] sm:w-[72px]">
                  <img
                    src={getImageUrl(cat.image) || "/placeholder.jpg"}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
              <span
                className={`max-w-[76px] truncate text-center text-[11px] font-semibold ${
                  selectedCategory === cat.name
                    ? "text-orange-600"
                    : "text-[#6e6e73]"
                }`}
              >
                {cat.name}
              </span>
            </button>
          ))}
        </div>

        {/* Subcategory pills */}
        {subcategoryButtons.length > 1 && (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-black/[0.04] pt-4">
            {subcategoryButtons.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setSelectedSubcategory(sub)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                  selectedSubcategory === sub
                    ? "bg-[#1d1d1f] text-white shadow-sm"
                    : "bg-white text-[#6e6e73] ring-1 ring-black/[0.06] hover:text-[#1d1d1f]"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main layout */}
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:gap-8 lg:px-8 lg:py-8">
        {/* Mobile filter backdrop */}
        <AnimatePresence>
          {isMobile && isFilterVisible && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[190] bg-black/40 backdrop-blur-[2px] lg:hidden"
              onClick={() => setIsFilterVisible(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isFilterVisible && (
            <motion.aside
              initial={isMobile ? { x: "-100%" } : { opacity: 0, x: -12 }}
              animate={{ x: 0, opacity: 1 }}
              exit={isMobile ? { x: "-100%" } : { opacity: 0, x: -12 }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className={
                isMobile
                  ? "fixed inset-y-0 left-0 z-[200] w-[min(100%,320px)] overflow-y-auto bg-white p-6 shadow-2xl sm:p-8"
                  : "hidden w-60 shrink-0 lg:block xl:w-64"
              }
            >
              {isMobile && (
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-xl font-semibold tracking-tight">
                    Filters
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsFilterVisible(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f7] text-[#1d1d1f]"
                    aria-label="Close filters"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}

              <div
                className={
                  isMobile
                    ? "space-y-8"
                    : "sticky top-28 space-y-6 rounded-[22px] border border-black/[0.05] bg-white p-4 shadow-[0_4px_24px_rgba(0,0,0,0.04)] xl:top-32"
                }
              >
                <section>
                  <h3 className="mb-3 px-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#86868b]">
                    Collections
                  </h3>
                  <div className="flex flex-col gap-0.5">
                    {categoryButtons.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat);
                          if (isMobile) setIsFilterVisible(false);
                        }}
                        className={sidebarItemClass(selectedCategory === cat)}
                      >
                        {cat}
                        {selectedCategory === cat && (
                          <ChevronRight size={14} className="text-orange-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </section>

                {subcategoryButtons.length > 1 && (
                  <section>
                    <h3 className="mb-3 px-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#86868b]">
                      Subcollections
                    </h3>
                    <div className="flex flex-col gap-0.5">
                      {subcategoryButtons.map((sub) => (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => {
                            setSelectedSubcategory(sub);
                            if (isMobile) setIsFilterVisible(false);
                          }}
                          className={sidebarItemClass(
                            selectedSubcategory === sub,
                          )}
                        >
                          {sub}
                          {selectedSubcategory === sub && (
                            <ChevronRight
                              size={14}
                              className="text-orange-600"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </section>
                )}

                <section>
                  <h3 className="mb-3 px-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#86868b]">
                    Featured
                  </h3>
                  <div className="flex flex-wrap gap-2 lg:flex-col">
                    {["All", "Trending", "Best Sellers"].map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setSelectedFilter(filter)}
                        className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                          selectedFilter === filter
                            ? "bg-[#1d1d1f] text-white shadow-sm"
                            : "bg-[#f5f5f7] text-[#6e6e73] ring-1 ring-black/[0.05] hover:text-[#1d1d1f]"
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </section>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="w-full rounded-xl border border-dashed border-black/15 py-2.5 text-xs font-semibold text-[#86868b] transition-colors hover:border-black/25 hover:text-[#1d1d1f]"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <main className="min-w-0 flex-1">
          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {searchQuery && (
                <FilterChip
                  label={`"${searchQuery}"`}
                  onRemove={() => setSearchQuery("")}
                />
              )}
              {selectedCategory !== "All" && (
                <FilterChip
                  label={selectedCategory}
                  onRemove={() => setSelectedCategory("All")}
                />
              )}
              {selectedSubcategory !== "All" && (
                <FilterChip
                  label={selectedSubcategory}
                  onRemove={() => setSelectedSubcategory("All")}
                />
              )}
              {selectedFilter !== "All" && (
                <FilterChip
                  label={selectedFilter}
                  onRemove={() => setSelectedFilter("All")}
                />
              )}
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-semibold text-orange-600 hover:text-orange-700"
              >
                Clear all
              </button>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-[24px] border border-black/[0.05] bg-white px-8 py-16 text-center shadow-sm">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5f5f7]">
                <LayoutGrid size={28} className="text-[#86868b]/50" />
              </div>
              <h2 className="text-xl font-semibold tracking-tight text-[#1d1d1f]">
                No products found
              </h2>
              <p className="mt-2 max-w-xs text-sm font-medium text-[#86868b]">
                Try adjusting your search or filters to discover more items.
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-6 rounded-full bg-[#1d1d1f] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-black active:scale-[0.98]"
                >
                  Reset filters
                </button>
              )}
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4 2xl:grid-cols-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product._id || product.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="flex justify-center"
                  >
                    <ProductCard
                      product={product}
                      whatsappNumber={whatsappNumber}
                      WhatsAppIcon={WhatsAppIcon}
                      trendingProductIds={trendingProductIds}
                      bestSellerProductIds={bestSellerProductIds}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
