// src/components/admin/FeaturedManagement.jsx
import { useState, useEffect } from "react";
import { useProducts } from "../../Context/ProductContext";
import { getImageUrl } from "../../utils/imageUrl";
import { Star, Award, Search, X, TrendingUp, DollarSign, Loader2 } from "lucide-react";

export default function FeaturedManagement() {
  const {
    products,
    trendingProductIds,
    bestSellerProductIds,
    toggleTrending,
    toggleBestSeller,
  } = useProducts();

  const [searchQuery, setSearchQuery] = useState("");
  const [loadingIds, setLoadingIds] = useState(new Set()); // id → is loading
  const [error, setError] = useState(null);

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const toggleFeatured = async (id, type) => {
    const isTrending = type === "trending";
    const currentList = isTrending ? trendingProductIds : bestSellerProductIds;
    const toggleFn = isTrending ? toggleTrending : toggleBestSeller;

    const isAdding = !currentList.includes(id);

    // Optimistic UI + loading
    setLoadingIds((prev) => new Set([...prev, id]));
    setError(null);

    try {
      // Call the context function which handles both local state and backend
      await toggleFn(id);
      console.log(`Successfully toggled ${type} for product ${id}`);
    } catch (err) {
      console.error(err);
      setError(`Failed to update ${type} status.`);
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const TrendingSection = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <TrendingUp size={26} className="text-amber-600" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Trending Now</h2>
          </div>
          <div className="px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-sm font-medium border border-amber-200">
            {trendingProductIds.length} selected
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search products to feature..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            {searchQuery ? "No products match your search" : "No products available"}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {filteredProducts.map((product) => {
              const id = product._id || product.id;
              const isFeatured = trendingProductIds.includes(id);
              const isLoading = loadingIds.has(id);

              return (
                <div
                  key={id}
                  className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 ${
                    isFeatured
                      ? "border-amber-500 shadow-xl bg-amber-50/40 scale-[1.02]"
                      : "border-gray-200 hover:border-amber-300 hover:shadow-md"
                  }`}
                >
                  <div className="aspect-square relative">
                    <img
                      src={
                        getImageUrl(product.mainImage || product.images?.[0] || product.image) ||
                        "https://placehold.co/300x300?text=No+Image"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {isFeatured && (
                      <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                        Trending
                      </div>
                    )}
                  </div>

                  <div className="p-4 text-center">
                    <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 min-h-[2.5rem] mb-3">
                      {product.name}
                    </h4>

                    <button
                      onClick={() => toggleFeatured(id, "trending")}
                      disabled={isLoading}
                      className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2
                        ${
                          isFeatured
                            ? "bg-amber-600 hover:bg-amber-700 text-white shadow-md"
                            : "bg-amber-100 hover:bg-amber-200 text-amber-800"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isLoading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : isFeatured ? (
                        "Remove from Trending"
                      ) : (
                        "Mark as Trending"
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const BestSellersSection = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Award size={26} className="text-emerald-600" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Best Sellers</h2>
          </div>
          <div className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-sm font-medium border border-emerald-200">
            {bestSellerProductIds.length} selected
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search products to feature..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            {searchQuery ? "No products match your search" : "No products available"}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {filteredProducts.map((product) => {
              const id = product._id || product.id;
              const isFeatured = bestSellerProductIds.includes(id);
              const isLoading = loadingIds.has(id);

              return (
                <div
                  key={id}
                  className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 ${
                    isFeatured
                      ? "border-emerald-500 shadow-xl bg-emerald-50/40 scale-[1.02]"
                      : "border-gray-200 hover:border-emerald-300 hover:shadow-md"
                  }`}
                >
                  <div className="aspect-square relative">
                    <img
                      src={
                        getImageUrl(product.mainImage || product.images?.[0] || product.image) ||
                        "https://placehold.co/300x300?text=No+Image"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {isFeatured && (
                      <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                        Best Seller
                      </div>
                    )}
                  </div>

                  <div className="p-4 text-center">
                    <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 min-h-[2.5rem] mb-3">
                      {product.name}
                    </h4>

                    <button
                      onClick={() => toggleFeatured(id, "best-seller")}
                      disabled={isLoading}
                      className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2
                        ${
                          isFeatured
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
                            : "bg-emerald-100 hover:bg-emerald-200 text-emerald-800"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isLoading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : isFeatured ? (
                        "Remove from Best Sellers"
                      ) : (
                        "Mark as Best Seller"
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-10 pb-12">
      <TrendingSection />
      <BestSellersSection />
    </div>
  );
}