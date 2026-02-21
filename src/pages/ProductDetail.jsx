// src/pages/ProductDetail.jsx
import { useParams, Link } from "react-router-dom";
import { useProducts } from "../Context/ProductContext";
import { getImageUrl } from "../utils/imageUrl";
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  Share2,
  Star,
  Clock,
  CreditCard,
  Sparkles,
  ChevronRight,
  Zap,
  Info,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

const WhatsAppIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.884 3.088" />
  </svg>
);

export default function ProductDetail() {
  const { id } = useParams();
  const { products } = useProducts();

  const contextProduct = products.find((p) => p._id === id || p.id === id);

  const [product, setProduct] = useState(contextProduct || null);
  const [loading, setLoading] = useState(!contextProduct?.description);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);

  useEffect(() => {
    const handleMenuChange = (e) => {
      setIsNavMenuOpen(e.detail.isOpen);
    };

    window.addEventListener('nav-mobile-menu-change', handleMenuChange);
    return () => window.removeEventListener('nav-mobile-menu-change', handleMenuChange);
  }, []);

  useEffect(() => {
    if (contextProduct && !contextProduct.description) {
      setLoading(true);
      import("../api").then((api) => {
        api
          .getProductById(id)
          .then((data) => {
            setProduct(data);
            setLoading(false);
          })
          .catch((err) => {
            console.error("Failed to fetch product details", err);
            setLoading(false);
          });
      });
    } else if (contextProduct) {
      setProduct(contextProduct);
      setLoading(false);
    } else {
      setLoading(true);
      import("../api").then((api) => {
        api
          .getProductById(id)
          .then((data) => {
            setProduct(data);
            setLoading(false);
          })
          .catch((err) => {
            console.error("Failed to fetch product details", err);
            setLoading(false);
          });
      });
    }
  }, [id, contextProduct]);

  const [currentImg, setCurrentImg] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [activeTab, setActiveTab] = useState("specifications");
  const topRef = useRef(null);

  useEffect(() => setPreviewImage(null), [id]);

  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    setMousePos({ x, y });
  };

  useEffect(() => {
    setCurrentImg(0);
    setIsHovering(false);
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-500">
        Loading details...
      </div>
    );
  }

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-500">
        Product not found
      </div>
    );

  const allImages = product.image
    ? [product.image, ...(product.images || [])]
    : product.images?.length > 0
      ? product.images
      : [];

  const suggestedProducts = products
    .filter((p) => (p._id || p.id) !== (product._id || product.id))
    .slice(0, 4);

  return (
    <LayoutGroup>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[100vh] bg-[#fcfcfc] text-[#1d1d1f] font-sans overflow-x-hidden"
      >
        <nav className="top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-black/[0.03] px-5 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link
              to="/models"
              className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest"
            >
              <div className="p-2 rounded-full group-hover:bg-black group-hover:text-white transition-all">
                <ArrowLeft size={16} />
              </div>
              Back
            </Link>
            <div className="hidden md:block text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">
              Premium Collection / {product.category || "Masterpiece"}{product.subcategory ? ` / ${product.subcategory}` : ""}
            </div>
            <button className="p-2.5 bg-gray-50 rounded-full hover:bg-black hover:text-white transition-all">
              <Share2 size={18} />
            </button>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-4 sm:px-5 lg:px-6 py-6 lg:py-8">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-10">

            {/* LEFT: EVEN SMALLER IMAGE AREA */}
            <div className="lg:col-span-5">
              <div className="sticky top-[72px] space-y-3">
                <div
                  className="relative aspect-[5/6] lg:aspect-[5/6] xl:aspect-[6/7] max-h-[480px] lg:max-h-[520px] mx-auto w-full max-w-[380px] lg:max-w-[420px] rounded-xl overflow-hidden bg-[#f5f5f7] shadow-md group"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  onMouseMove={handleMouseMove}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImg + "-preview-" + (previewImage ? 1 : 0)}
                      src={getImageUrl(previewImage || allImages[currentImg])}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{
                        opacity: 1,
                        scale: isHovering ? 2.4 : 1,
                        originX: isHovering ? mousePos.x : 0.5,
                        originY: isHovering ? mousePos.y : 0.5
                      }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        opacity: { duration: 0.5 },
                        scale: { duration: 0.35, ease: "easeOut" },
                        originX: { duration: 0.1, ease: "linear" },
                        originY: { duration: 0.1, ease: "linear" }
                      }}
                      className="w-full h-full object-cover will-change-transform"
                    />
                  </AnimatePresence>

                  <motion.div
                    animate={{ opacity: isHovering ? 0 : 1 }}
                    className="absolute top-4 left-4 pointer-events-none"
                  >
                    <span className="flex items-center gap-1 bg-black/80 text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest backdrop-blur-sm">
                      <Zap size={8} fill="currentColor" />
                    </span>
                  </motion.div>
                </div>

                {/* Much smaller thumbnails */}
                <div className="flex gap-2 justify-center px-1 overflow-x-auto no-scrollbar">
                  {allImages.map((img, i) => {
                    const isActive = !previewImage ? i === currentImg : previewImage === img;
                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentImg(i)}
                        onMouseEnter={() => setPreviewImage(img)}
                        onMouseLeave={() => setPreviewImage(null)}
                        onFocus={() => setPreviewImage(img)}
                        onBlur={() => setPreviewImage(null)}
                        className={`relative flex-shrink-0 w-10 h-14 lg:w-11 lg:h-15 rounded-md overflow-hidden transition-all duration-300 ${
                          isActive
                            ? "ring-2 ring-black ring-offset-2 scale-110"
                            : "opacity-60 grayscale hover:opacity-90 hover:grayscale-0"
                        }`}
                        aria-label={`View image ${i + 1}`}
                      >
                        <img
                          src={getImageUrl(img)}
                          className="w-full h-full object-cover"
                          alt={`Thumbnail ${i + 1}`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT: PRODUCT INFO */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <header className="space-y-2">
                  <div className="flex items-center gap-2 text-orange-600 font-black text-[9px] uppercase tracking-[0.25em]">
                    <Sparkles size={12} fill="currentColor" /> Exclusive Edition
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-4xl font-semibold tracking-tight leading-tight text-[#1d1d1f]">
                    {product.name}
                  </h1>
                  <div className="flex items-baseline gap-3 pt-2">
                    <span className="text-2xl sm:text-2.5xl lg:text-3xl font-medium tracking-tight">
                      ₹{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg text-gray-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                </header>

                <div className="pt-4 border-t border-black/[0.05]">
                  <div className="flex gap-6 mb-4 overflow-x-auto no-scrollbar">
                    {["specifications", "details", "shipping"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-[10px] font-black uppercase tracking-[0.22em] relative pb-1.5 transition-colors whitespace-nowrap ${
                          activeTab === tab ? "text-black" : "text-gray-500"
                        }`}
                      >
                        {tab}
                        {activeTab === tab && (
                          <motion.div
                            layoutId="underline"
                            className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-orange-600"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[15px] text-gray-600 leading-relaxed max-w-lg min-h-[90px]"
                    >
                      {activeTab === "details" && (
                        <p>
                          {product.description ||
                            "Handcrafted with premium materials for lasting quality and precision fit."}
                        </p>
                      )}

                      {activeTab === "specifications" && (
                        <ul className="space-y-2.5 mt-1">
                          {(product.specifications && product.specifications.length > 0
                            ? product.specifications
                            : [
                                { label: "Paper Quality", value: "300gsm Premium Matte" },
                                { label: "Binding", value: "Layflat / Perfect Bind" },
                                { label: "Cover", value: "Hardcover / Softcover with Foil Stamping" },
                                { label: "Production Time", value: "3-5 Business Days" },
                                { label: "Origin", value: "Made in India" },
                              ]
                          ).map((spec, i) => (
                            <li
                              key={i}
                              className="flex justify-between items-center text-sm border-b border-gray-100 pb-1.5"
                            >
                              <span className="font-semibold text-gray-900">{spec.label}</span>
                              <span className="text-gray-500">{spec.value}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {activeTab === "shipping" && (
                        <p>
                          Free shipping on orders over ₹1,999. Delivered in eco-friendly packaging within 5-7 days.
                        </p>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="grid grid-cols-3 gap-2.5 bg-[#f5f5f7] p-4 rounded-xl">
                  {[
                    { icon: Truck, text: "Fast Ship" },
                    { icon: CreditCard, text: "COD" },
                    { icon: ShieldCheck, text: "Verified" },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <div className="p-2 bg-white rounded-lg shadow-sm text-gray-700">
                        <item.icon size={18} />
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <motion.a
                    href={`https://wa.me/9746683778?text=I want to order ${product.name}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-3 w-full bg-[#1d1d1f] text-white py-3.5 rounded-full font-bold text-xs tracking-wide uppercase hover:bg-orange-600 transition-colors shadow-xl shadow-black/10"
                  >
                    <WhatsAppIcon size={18} /> Enquire Now
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </div>
        </main>

        <section className="bg-white py-16 px-5 border-t border-black/[0.03]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div className="space-y-3">
                <span className="text-orange-600 font-black text-[10px] uppercase tracking-[0.3em]">
                  Complementary
                </span>
                <h3 className="text-4xl md:text-5xl font-semibold tracking-tighter">
                  You might also love.
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
              {suggestedProducts.map((p) => (
                <Link
                  to={`/product/${p._id || p.id}`}
                  key={p._id}
                  className="group"
                >
                  <div className="relative aspect-[3/4] rounded-[28px] overflow-hidden mb-4 bg-[#f5f5f7]">
                    <img
                      src={getImageUrl(p.image)}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[9px] font-black uppercase">
                      {p.category}
                    </div>
                  </div>
                  <h4 className="text-lg font-bold tracking-tight mb-1 truncate">
                    {p.name}
                  </h4>
                  <p className="text-gray-500 font-medium">₹{p.price}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <AnimatePresence>
          {!isNavMenuOpen && (
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-black/[0.05] p-5 z-[200] flex items-center gap-5"
            >
              <div className="flex-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Price
                </span>
                <p className="text-xl font-bold">₹{product.price}</p>
              </div>
              <a
                href={`https://wa.me/9746683778?text=Order:${product.name}`}
                className="flex-[2] flex items-center justify-center gap-3 bg-black text-white py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-xl"
              >
                <WhatsAppIcon size={18} /> ORDER
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}