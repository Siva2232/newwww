// src/pages/ProductsShop.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from "react-router-dom";
import { Search, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "../Context/ProductContext";
import ProductCard from "../components/common/ProductCard";

// WhatsApp config
const whatsappNumber = "9746683778";

export const WhatsAppIcon = ({ size = 24, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.884 3.088" />
  </svg>
);

export default function ProductsShop() {
  const { products, shopCategories, trendingProductIds, bestSellerProductIds } = useProducts();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFilter, setSelectedFilter] = useState('All');

  // Sync category from URL ?category=...
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && shopCategories.some(c => c.name === cat)) {
      setSelectedCategory(cat);
    }
  }, [searchParams, shopCategories]);

  // All available category buttons (dynamic + All)
  const categoryButtons = useMemo(() => {
    const names = shopCategories.map(c => c.name);
    return ['All', ...names];
  }, [shopCategories]);

  // Filtered & searched products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' ||
        p.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        shopCategories.some(cat => cat.name === selectedCategory && p.category?.toLowerCase().includes(cat.name.toLowerCase()));

      const matchesFeatured =
        selectedFilter === 'All' ||
        (selectedFilter === 'Trending' && trendingProductIds?.includes(p._id || p.id)) ||
        (selectedFilter === 'Best Sellers' && bestSellerProductIds?.includes(p._id || p.id));

      return matchesSearch && matchesCategory && matchesFeatured;
    });
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedFilter,
    trendingProductIds,
    bestSellerProductIds,
    shopCategories
  ]);

  const hasProducts = products.length > 0;
  const hasResults = filteredProducts.length > 0;

  return (
    <div className="min-h-screen bg-gray-50/40">
      {/* Hero Banner */}
      <section className="px-4 pt-20 pb-8 md:pt-28">
        <div className="max-w-7xl mx-auto relative rounded-3xl overflow-hidden shadow-2xl h-64 md:h-80 bg-zinc-900 group">
          <img
            src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=2070"
            alt="Shop banner - Premium photo products"
            className="absolute inset-0 w-full h-full object-cover opacity-75 transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

          <div className="absolute inset-0 flex items-center px-8 md:px-16">
            <div className="max-w-lg text-white">
              <span className="inline-block px-4 py-1.5 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                New Season
              </span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none mb-3">
                <span className="text-yellow-400">20%</span> OFF
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-6">
                Premium frames, albums & photo books
              </p>
              <button className="bg-yellow-400 text-black font-bold px-8 py-3.5 rounded-2xl hover:bg-yellow-300 transition transform hover:scale-105 active:scale-100">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-gray-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full sm:w-80 lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100/80 border border-gray-200 rounded-2xl py-3 pl-12 pr-5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all"
              aria-label="Search products"
            />
          </div>

          {/* Category filters */}
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide w-full sm:w-auto">
            {categoryButtons.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide whitespace-nowrap transition-all border
                  ${selectedCategory === cat
                    ? 'bg-black text-white border-black shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900'
                  }`}
                aria-pressed={selectedCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 py-10 md:py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {selectedCategory === 'All' ? 'All Products' : selectedCategory}
            <span className="text-gray-500 text-xl ml-3">({filteredProducts.length})</span>
          </h2>

          {/* Optional featured filter dropdown - can expand later */}
          {/* <select ... /> */}
        </div>

        {!hasProducts ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl font-medium">No products available yet.</p>
            <p className="mt-2">Check back soon or contact us on WhatsApp!</p>
          </div>
        ) : !hasResults ? (
          <div className="text-center py-16 text-gray-600">
            <p className="text-lg">No products match your search or filter.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-4 text-yellow-600 hover:text-yellow-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            <AnimatePresence>
              {filteredProducts.map(product => {
                const discount = product.originalPrice
                  ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                  : 0;

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    key={product._id || product.id}
                  >
                    <ProductCard
                      product={product}
                      whatsappNumber={whatsappNumber}
                      WhatsAppIcon={WhatsAppIcon}
                      showDiscountBadge={discount > 0}
                      discountPercentage={discount}
                      // Add these if your ProductCard supports them:
                      // isTrending={trendingProductIds?.includes(product.id)}
                      // isBestSeller={bestSellerProductIds?.includes(product.id)}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* Hide scrollbar for horizontal scroll */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}