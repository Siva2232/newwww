import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { getCustomProducts } from "../../api";
import ProductCard from "./ProductCard";

export default function ProductSelection({
  setSelectedProduct,
  fadeInUp = {},
  products: propProducts,
}) {
  const [products, setProducts] = useState(propProducts || []);
  const [loading, setLoading] = useState(
    !propProducts || propProducts.length === 0,
  );
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (propProducts?.length > 0) {
      setProducts(propProducts);
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getCustomProducts({ page: 1, limit: 12 });
        const productList = Array.isArray(data)
          ? data
          : data.products || [];
        setProducts(productList);
      } catch (err) {
        console.error("Failed to load custom products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [propProducts]);

  const handleSelect = (product) => {
    setSelectedId(product._id || product.id);
    setSelectedProduct(product);
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 bg-[#f5f5f7]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <p className="text-sm font-medium text-[#86868b]">
          Loading bespoke products...
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center bg-[#f5f5f7] px-6">
        <p className="text-center text-base font-medium text-[#86868b]">
          No custom books available yet. Check back soon.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f7]">
      <section className="px-4 pb-6 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fadeInUp} className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/90 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-orange-700">
              <Sparkles size={12} aria-hidden />
              Custom books
            </div>
            <h1 className="text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f]">
              Bespoke studio.
              <span className="block text-[0.55em] font-medium text-[#86868b]">
                Turn memories into timeless prints.
              </span>
            </h1>
            <p className="max-w-lg text-sm font-medium leading-relaxed text-[#6e6e73] sm:text-base">
              Choose a template below to start your custom photo book journey.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product._id || product.id || i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <ProductCard
                product={{
                  ...product,
                  price:
                    typeof product.price === "number"
                      ? product.price
                      : parseFloat(String(product.price).replace(/[^\d.]/g, "")) ||
                        0,
                  description: product.shortDesc || product.fullDesc,
                  category: product.tag || "Custom book",
                }}
                onSelect={handleSelect}
                selected={
                  selectedId === (product._id || product.id)
                }
              />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
