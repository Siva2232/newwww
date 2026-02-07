// src/components/ProductSelection.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { getCustomProducts } from "../../api";

export default function ProductSelection({
  setSelectedProduct,
  fadeInUp,
  products: propProducts,
}) {
  const [products, setProducts] = useState(propProducts || []);
  const [loading, setLoading] = useState(
    !propProducts || propProducts.length === 0,
  );
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (propProducts && propProducts.length > 0) {
      setProducts(propProducts);
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getCustomProducts();
        // Optional: ensure image has correct path (especially useful in dev vs prod)
        const updatedProducts = data.map((product) => ({
          ...product,
          image: product.image
            ? product.image.startsWith("http")
              ? product.image
              : `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}${product.image}`
            : "/placeholder-product.jpg",
        }));
        setProducts(updatedProducts);
      } catch (err) {
        console.error("Failed to load custom products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [propProducts]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-zinc-500">Loading bespoke products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-zinc-600">No custom books available yet.</p>
      </div>
    );
  }

  return (
    <>
      <section className="px-5 sm:px-6 pt-16 pb-8">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="space-y-4">
            <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-wider">
              <Sparkles size={14} />
              <span>2026 Collection</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Bespoke Studio<span className="text-zinc-400">.</span>
            </h1>
            <p className="text-lg text-zinc-600 max-w-xl">
              Turn your memories into timeless printed books.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-5 sm:px-6 py-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => {
            const isExpanded = expandedId === product._id;

            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-zinc-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                    onError={(e) => {
                      e.target.src = "/placeholder-product.jpg";
                      e.target.onerror = null; // prevent infinite loop
                    }}
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-black uppercase tracking-wide">
                    {product.tag}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                  <p className="text-zinc-700 font-medium mb-2">
                    {product.price}
                  </p>

                  <p className="text-sm text-zinc-600 mb-3 line-clamp-2">
                    {product.shortDesc || "Premium custom photo book"}
                  </p>

                  {product.fullDesc && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedId(isExpanded ? null : product._id);
                      }}
                      className="text-xs text-orange-600 hover:text-orange-700 flex items-center gap-1 mt-1"
                    >
                      {isExpanded ? "Less" : "More"}
                      {isExpanded ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )}
                    </button>
                  )}

                  <div className="mt-4 flex justify-end">
                    <div className="h-9 w-9 rounded-full bg-zinc-900 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </div>

                {isExpanded && product.fullDesc && (
                  <div className="px-4 pb-4 pt-1 text-sm text-zinc-600 border-t">
                    {product.fullDesc}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>
    </>
  );
}
