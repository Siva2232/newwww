// src/pages/ProductDetail.jsx
import { useParams, Link } from "react-router-dom";
import { useProducts } from "../Context/ProductContext";
import { 
  ArrowLeft, ChevronRight, ShieldCheck, Truck, RefreshCw, Share2, Star, Clock ,CreditCard
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
  const product = products.find((p) => p._id === id || p.id === id);
  
  const [currentImg, setCurrentImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [activeTab, setActiveTab] = useState("details");

  const topRef = useRef(null);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [id]);

  if (!product) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gray-50"
      >
        <p className="text-lg font-medium text-gray-600">Loading premium collection...</p>
      </motion.div>
    );
  }

  // Handle images from database (images array or single image field)
  const allImages = product.images && product.images.length > 0 
    ? product.images 
    : (product.image ? [product.image] : []);
  
  console.log('[ProductDetail] Product:', product.name, 'Images:', allImages.length, 'All Images:', allImages);
  const sizes = ["S", "M", "L", "XL"];

  const suggestedProducts = products
    .filter(p => (p._id || p.id) !== (product._id || product.id))
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied!");
  };

  return (
    <LayoutGroup>
      <motion.div
        ref={topRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="min-h-screen bg-gray-50/80 pt-12 pb-24 px-4 sm:px-6"
      >
        <div className="max-w-6xl mx-auto">

          {/* Breadcrumb + Share */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-between mb-6"
          >
            <Link to="/models" className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-black transition">
              <ArrowLeft size={16} /> <span className="hidden sm:inline">Back to Shop</span>
            </Link>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="p-2 hover:bg-white rounded-full transition border hover:border-gray-200"
            >
              <Share2 size={18} className="text-gray-600" />
            </motion.button>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">

            {/* Image Gallery - Sticky */}
            <motion.div
              layout
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-7 space-y-4 lg:sticky lg:top-20"
            >
              <div className="relative w-[260px] h-[340px] bg-white rounded-xl overflow-hidden border border-gray-200 mx-auto shadow-lg">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImg}
                    src={allImages[currentImg]}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/80 text-white px-2 py-0.5 rounded text-[9px] font-bold">
                  <Clock size={9} /> Fast Delivery
                </div>
              </div>

              {/* Thumbnails with smooth selection */}
              <div className="flex gap-3 justify-center">
                {allImages.map((img, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setCurrentImg(i)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      i === currentImg ? "border-amber-500 shadow-md" : "border-transparent opacity-60"
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt="" />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              layout
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-5 space-y-8"
            >
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-2 text-amber-500"
                >
                  {/* {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" className="drop-shadow-sm" />
                  ))} */}
                  {/* <span className="text-xs font-bold text-gray-400">(4.8 / 124)</span> */}
                </motion.div>

                <h1 className="text-3xl font-bold text-gray-900 tracking-tight leading-tight">
                  {product.name}
                </h1>

                <div className="flex items-center gap-3">
                  <span className="text-3xl font-light text-gray-900 font-mono">₹{product.price}</span>
                  {product.originalPrice && (
                    <motion.span
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="bg-green-50 text-green-600 text-[10px] font-black px-2 py-1 rounded-md uppercase"
                    >
                      Save ₹{product.originalPrice - product.price}
                    </motion.span>
                  )}
                </div>
              </div>

              {/* Size Selector */}
              {/* <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase text-gray-500">Select Size</span>
                  <button className="text-[10px] font-bold text-amber-600 underline underline-offset-4">
                    Size Guide
                  </button>
                </div>
                <div className="flex gap-2">
                  {sizes.map((size) => (
                    <motion.button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      whileTap={{ scale: 0.9 }}
                      animate={{
                        scale: selectedSize === size ? 1.08 : 1,
                      }}
                      className={`h-12 w-12 rounded-xl text-sm font-bold border-2 transition-all ${
                        selectedSize === size
                          ? "border-black bg-black text-white shadow-lg"
                          : "border-gray-200 text-gray-500 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div> */}

              {/* Tabs with Animated Underline */}
              <div className="border-t border-gray-100 pt-6">
                <div className="flex gap-8 border-b border-gray-100 mb-4 relative">
                  {['details', 'shipping'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="pb-3 text-xs font-bold uppercase tracking-widest relative"
                    >
                      {tab}
                      {activeTab === tab && (
                        <motion.div
                          layoutId="activeTabUnderline"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm text-gray-600 leading-relaxed"
                  >
                    {activeTab === 'details'
                      ? (product.description || "Premium handcrafted item with reinforced stitching and ethically sourced materials.")
                      : "Free express shipping over ₹999. Estimated delivery: 3–5 business days."}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-50 rounded-2xl p-4 grid grid-cols-3 gap-2"
              >
                {[
                  { icon: Truck, label: "Fast Delivery" },
                  { icon: CreditCard,   label: "COD Available" },     // ← most requested replacement
                  { icon: ShieldCheck, label: "Secure Deal" },
                ].map(({ icon: Icon, label }, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-1">
                    <Icon size={18} className="text-gray-700" />
                    <span className="text-[9px] font-bold text-gray-500 uppercase">{label}</span>
                  </div>
                ))}
              </motion.div>

              {/* Desktop CTA */}
          <motion.a
  href={`https://wa.me/9746683778?text=Hi, I want to order ${product.name} in size ${selectedSize}`}
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="hidden lg:flex items-center justify-center gap-3 w-full 
             bg-yellow-400 text-black 
             py-4 rounded-2xl font-bold 
             shadow-lg hover:bg-yellow-500 hover:shadow-xl 
             transition-all"
>
  <WhatsAppIcon />
  CHAT TO ORDER NOW
</motion.a>

            </motion.div>
          </div>
        </div>

        {/* Suggested Products */}
        <section className="max-w-6xl mx-auto mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mb-6 flex items-center justify-between"
          >
            <div>
              <h3 className="text-xl md:text-2xl font-black">Suggested for you</h3>
              <p className="text-sm text-gray-500">Fresh picks every time</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="text-sm font-bold text-amber-600 underline underline-offset-4"
            >
              Refresh
            </button>
          </motion.div>

          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <AnimatePresence>
              {suggestedProducts.map((p, index) => (
                <motion.div
                  key={p._id || p.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/product/${p._id || p.id}`} className="block">
                    <motion.div
                      whileHover={{ y: -6 }}
                      className="bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col h-full"
                    >
                      <div className="aspect-[4/5] relative overflow-hidden bg-gray-50">
                        <img
                          src={p.image || p.images?.[0] || 'https://via.placeholder.com/600'}
                          alt={p.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-[9px] font-black uppercase">
                          {p.category || "New"}
                        </div>
                        {p.originalPrice && (
                          <div className="absolute top-3 right-3 bg-red-600 text-white text-[9px] font-black px-2 py-1 rounded-full">
                            {Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}% OFF
                          </div>
                        )}
                      </div>
                      <div className="p-4 text-center">
                        <h4 className="font-black text-sm uppercase tracking-tight mb-2 line-clamp-2">{p.name}</h4>
                        <p className="text-xl font-black mb-1">₹{p.price}</p>
                        {p.originalPrice && <p className="text-sm line-through text-gray-400">₹{p.originalPrice}</p>}
                        <a
                          href={`https://wa.me/9746683778?text=Hi! Interested in ${p.name} (₹${p.price})`}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-black text-white py-2 rounded-2xl text-[10px] font-black uppercase hover:bg-amber-500 hover:text-black transition"
                        >
                          <WhatsAppIcon size={14} /> Order
                        </a>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Mobile Floating Bar - Slides Up */}
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
          className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 flex items-center gap-4 shadow-2xl"
        >
          <div className="flex-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Total</p>
            <p className="text-lg font-bold">₹{product.price}</p>
          </div>
          <a
            href={`https://wa.me/9746683778?text=Hi, I want to order ${product.name} in size ${selectedSize}`}
            className="flex-[2] flex items-center justify-center gap-2 bg-[#128c7e] text-white h-12 rounded-xl font-bold text-sm shadow-lg"
          >
            <WhatsAppIcon /> ORDER NOW
          </a>
        </motion.div>
      </motion.div>
    </LayoutGroup>
  );
}