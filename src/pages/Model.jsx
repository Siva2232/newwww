import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X, Sparkles, LayoutGrid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "../Context/ProductContext";
import ProductCard from "../components/common/ProductCard";
import { getImageUrl } from "../utils/imageUrl";

const whatsappNumber = "9746683778";

export const WhatsAppIcon = ({ size = 20, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.884 3.088" />
  </svg>
);

export default function ProductsShop() {
  const { products, shopCategories, shopSubCategories, trendingProductIds, bestSellerProductIds } = useProducts();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState('All');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // hide sidebar when switching to mobile; otherwise leave current state
    if (isMobile) {
      setIsFilterVisible(false);
    }
  }, [isMobile]);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && shopCategories.some(c => c.name === cat)) {
      setSelectedCategory(cat);
    } else {
      setSelectedCategory('All');
    }
    const sub = searchParams.get('subcategory');
    if (sub && shopSubCategories.some(sc => {
      const catName = typeof sc.category === 'string' ? sc.category : sc.category?.name;
      return sc.name === sub && catName === cat;
    })) {
      setSelectedSubcategory(sub);
    } else {
      setSelectedSubcategory('All');
    }
  }, [searchParams, shopCategories, shopSubCategories]);

  // reset subcategory whenever category changes
  useEffect(() => {
    setSelectedSubcategory('All');
  }, [selectedCategory]);

  const categoryButtons = useMemo(() => ['All', ...shopCategories.map(c => c.name)], [shopCategories]);
  const subcategoryButtons = useMemo(() => {
    if (selectedCategory === 'All') return [];
    return ['All', ...shopSubCategories
      .filter(sc => {
        const catName = typeof sc.category === 'string' ? sc.category : sc.category?.name;
        return catName === selectedCategory;
      })
      .map(sc => sc.name)
    ];
  }, [shopSubCategories, selectedCategory]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSubcategory = selectedSubcategory === 'All' || p.subcategory?.toLowerCase() === selectedSubcategory.toLowerCase();
      const matchesFeatured = selectedFilter === 'All' ||
        (selectedFilter === 'Trending' && trendingProductIds?.includes(p._id || p.id)) ||
        (selectedFilter === 'Best Sellers' && bestSellerProductIds?.includes(p._id || p.id));
      return matchesSearch && matchesCategory && matchesSubcategory && matchesFeatured;
    });
  }, [products, searchQuery, selectedCategory, selectedSubcategory, selectedFilter, trendingProductIds, bestSellerProductIds]);

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#1d1d1f]">
      
      {/* 1. MINIMALIST HERO HEADER */}
      <section className="px-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-orange-600 font-bold text-[10px] uppercase tracking-[0.2em]">
                <Sparkles size={14} fill="currentColor" />
                <span>The 2026 Collection</span>
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[0.9]">
                Shop Studio.
                <span className="text-[#86868b] block opacity-80 font-medium">Museum-grade excellence.</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="bg-white border border-black/5 rounded-full px-6 py-2 shadow-sm flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#86868b]">Showing</span>
                  <span className="text-sm font-bold">{filteredProducts.length} Results</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FLOATING UTILITY BAR (Sticky) */}
      <div className="top-0 z-[100] bg-white/70 backdrop-blur-2xl border-b border-black/[0.03] py-4">
        <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between gap-6">
          {/* Only show/hide button on mobile. On desktop, sidebar is always there. */}
          {isMobile ? (
            <button
              onClick={() => setIsFilterVisible(!isFilterVisible)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1d1d1f] text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl"
            >
              <SlidersHorizontal size={14} /> {isFilterVisible ? 'Close Sidebar' : 'Filters'}
            </button>
          ) : (
            // On desktop show a toggle button
            <button
              onClick={() => setIsFilterVisible(!isFilterVisible)}
              className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition"
            >
              <SlidersHorizontal size={14} /> {isFilterVisible ? 'Hide Filters' : 'Show Filters'}
            </button>
          )}

          <div className="relative flex-1 max-w-xl group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#86868b] group-focus-within:text-orange-600 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search our masterpiece catalog..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#f5f5f7] border-none rounded-full py-3.5 pl-14 pr-6 text-sm font-medium focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
            />
          </div>
        </div>
      </div>

      {/* 2.5 CATEGORY STORIES (Swipeable) */}
      <div className="max-w-[1440px] mx-auto px-6 pt-10 pb-4">
        <div className="flex gap-4 sm:gap-8 overflow-x-auto pb-6 -mx-6 px-6 sm:mx-0 sm:px-0 no-scrollbar snap-x">
           <button
             onClick={() => setSelectedCategory('All')}
             className="flex flex-col items-center min-w-[72px] sm:min-w-[84px] gap-3 snap-start group"
           >
             <div className={`w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] rounded-full p-[2px] transition-all duration-300 ${selectedCategory === 'All' ? 'bg-gradient-to-tr from-orange-500 to-amber-500' : 'bg-transparent group-hover:bg-gray-200'}`}>
                <div className="w-full h-full rounded-full bg-white border-[3px] border-white overflow-hidden relative">
                   <div className="absolute inset-0 bg-[#1d1d1f] flex items-center justify-center text-white font-bold text-[10px] tracking-widest uppercase">
                      All
                   </div>
                </div>
             </div>
             <span className={`text-[11px] font-bold tracking-tight ${selectedCategory === 'All' ? 'text-orange-600' : 'text-[#1d1d1f]'}`}>View All</span>
           </button>

           {shopCategories.map((cat, idx) => (
             <button
               key={cat.id || idx}
               onClick={() => setSelectedCategory(cat.name)}
               className="flex flex-col items-center min-w-[72px] sm:min-w-[84px] gap-3 snap-start group"
             >
               <div className={`w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] rounded-full p-[2px] transition-all duration-300 ${selectedCategory === cat.name ? 'bg-gradient-to-tr from-orange-500 to-amber-500' : 'bg-transparent group-hover:bg-gray-200'}`}>
                  <div className="w-full h-full rounded-full bg-white border-[3px] border-white overflow-hidden relative">
                     <img 
                        src={getImageUrl(cat.image) || "/placeholder.jpg"} 
                        alt={cat.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                     />
                  </div>
               </div>
               <span className={`text-[11px] font-bold tracking-tight max-w-[80px] text-center truncate ${selectedCategory === cat.name ? 'text-orange-600' : 'text-[#1d1d1f]'}`}>
                  {cat.name}
               </span>
             </button>
           ))}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
        
        {/* 3. SIDEBAR (Apple Editorial Style) */}
        <AnimatePresence>
          {isFilterVisible && (
            <motion.aside
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              className={`
                ${isMobile ? 'fixed inset-0 z-[200] bg-white p-8 overflow-y-auto' : 'w-64 sticky top-32 h-fit lg:-ml-8'}
              `}
            >
              {isMobile && (
                <div className="flex justify-between items-center mb-12">
                  <h2 className="text-3xl font-bold tracking-tighter">Filter By</h2>
                  <button onClick={() => setIsFilterVisible(false)} className="p-3 bg-[#f5f5f7] rounded-full"><X size={24} /></button>
                </div>
              )}

              <div className="space-y-16">
                {/* Collection Group */}
                <section>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#86868b] mb-8">Collections</h3>
                  <div className="grid grid-cols-1 gap-1">
                    {categoryButtons.map(cat => (
                      <button
                        key={cat}
                        onClick={() => { setSelectedCategory(cat); if (isMobile) setIsFilterVisible(false); }}
                        className={`text-left px-5 py-4 rounded-2xl text-[13px] font-bold transition-all flex justify-between items-center group
                          ${selectedCategory === cat ? 'bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] text-orange-600' : 'text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#f5f5f7]'}`}
                      >
                        {cat}
                        {selectedCategory === cat && <motion.div layoutId="dot" className="w-2 h-2 rounded-full bg-orange-600" />}
                      </button>
                    ))}
                  </div>
                </section>

                {subcategoryButtons.length > 1 && (
                  <section>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#86868b] mb-8">Subcollections</h3>
                    <div className="grid grid-cols-1 gap-1">
                      {subcategoryButtons.map(sub => (
                        <button
                          key={sub}
                          onClick={() => { setSelectedSubcategory(sub); if (isMobile) setIsFilterVisible(false); }}
                          className={`text-left px-5 py-4 rounded-2xl text-[13px] font-bold transition-all flex justify-between items-center group
                            ${selectedSubcategory === sub ? 'bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] text-orange-600' : 'text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#f5f5f7]'}`}
                        >
                          {sub}
                          {selectedSubcategory === sub && <motion.div layoutId="dot" className="w-2 h-2 rounded-full bg-orange-600" />}
                        </button>
                      ))}
                    </div>
                  </section>
                )}

                {/* Featured Group */}
                <section>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#86868b] mb-8">Featured</h3>
                  <div className="flex flex-wrap lg:flex-col gap-3">
                    {['All', 'Trending', 'Best Sellers'].map(filter => (
                      <button
                        key={filter}
                        onClick={() => setSelectedFilter(filter)}
                        className={`px-6 py-3 rounded-xl text-[13px] font-bold border transition-all 
                          ${selectedFilter === filter ? 'bg-[#1d1d1f] text-white border-transparent' : 'bg-transparent text-[#1d1d1f] border-black/10 hover:border-black'}`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* 4. PRODUCT GRID (Optimized Spacing) */}
        <main className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="h-[50vh] flex flex-col items-center justify-center text-center">
              <LayoutGrid size={48} className="text-[#86868b] mb-6 opacity-20" />
              <h2 className="text-2xl font-bold tracking-tight text-[#1d1d1f]">No masterpieces found</h2>
              <p className="text-[#86868b] mt-2 max-w-xs">Adjust your search or filters to explore other works.</p>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 lg:gap-8">
              <AnimatePresence>
                {filteredProducts.map(product => (
                  <motion.div
                    key={product._id || product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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