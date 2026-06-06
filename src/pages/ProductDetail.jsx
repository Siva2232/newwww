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
  Zap,
  X,
  Mail,
  Link2,
  Facebook,
  Send,
} from "lucide-react";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const WhatsAppIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.884 3.088" />
  </svg>
);

const TwitterIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

function ShareModal({ isOpen, onClose, product, url }) {
  const shareText = `Check out ${product.name} — ₹${product.price}`;

  const shareOptions = [
    {
      name: "WhatsApp",
      color: "bg-[#25D366] hover:bg-[#1ebe5d]",
      icon: WhatsAppIcon,
      href: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${url}`)}`,
    },
    {
      name: "Email",
      color: "bg-[#EA4335] hover:bg-[#d33426]",
      icon: Mail,
      href: `mailto:?subject=${encodeURIComponent(product.name)}&body=${encodeURIComponent(`${shareText}\n\n${url}`)}`,
    },
    {
      name: "Facebook",
      color: "bg-[#1877F2] hover:bg-[#166fe0]",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: "Twitter",
      color: "bg-black hover:bg-zinc-800",
      icon: TwitterIcon,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
    },
    {
      name: "Telegram",
      color: "bg-[#0088cc] hover:bg-[#0077b5]",
      icon: Send,
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`,
    },
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
      onClose();
    } catch {
      toast.error("Could not copy link. Please try again.");
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-0 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-modal-title"
        >
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close share menu"
          />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            <div className="px-6 pt-4 pb-2 flex items-start justify-between gap-3">
              <div>
                <h3 id="share-modal-title" className="text-lg font-bold text-[#1d1d1f]">
                  Share this product
                </h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-1">{product.name}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-5 grid grid-cols-3 gap-4">
              {shareOptions.map((option) => (
                <a
                  key={option.name}
                  href={option.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div
                    className={`w-14 h-14 rounded-full ${option.color} text-white flex items-center justify-center shadow-md transition-transform group-hover:scale-105`}
                  >
                    <option.icon size={22} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">{option.name}</span>
                </a>
              ))}

              <button
                type="button"
                onClick={handleCopyLink}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-14 h-14 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
                  <Link2 size={22} />
                </div>
                <span className="text-xs font-semibold text-gray-700">Copy Link</span>
              </button>
            </div>

            <div className="px-6 pb-6">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
                <Link2 size={16} className="text-gray-400 shrink-0" />
                <p className="text-xs text-gray-500 truncate flex-1">{url}</p>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 shrink-0"
                >
                  Copy
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const { products } = useProducts();

  const contextProduct = products.find((p) => p._id === id || p.id === id);

  const [product, setProduct] = useState(contextProduct || null);
  const [loading, setLoading] = useState(!contextProduct?.description);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    const handleMenuChange = (e) => {
      setIsNavMenuOpen(e.detail.isOpen);
    };

    window.addEventListener('nav-mobile-menu-change', handleMenuChange);
    return () => window.removeEventListener('nav-mobile-menu-change', handleMenuChange);
  }, []);

  useEffect(() => {
    // with backend removed we rely solely on contextProduct
    if (contextProduct) {
      setProduct(contextProduct);
    } else {
      console.warn("Cannot load product details – backend removed");
    }
    setLoading(false);
  }, [id, contextProduct]);

  const [currentImg, setCurrentImg] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [activeTab, setActiveTab] = useState("specifications");
  const topRef = useRef(null);

  useEffect(() => setPreviewImage(null), [id]);

  const [isHovering, setIsHovering] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({
    transform: "scale(1)",
    transformOrigin: "50% 50%",
  });
  const zoomRafRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (zoomRafRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;
    zoomRafRef.current = requestAnimationFrame(() => {
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      setZoomStyle({
        transform: "scale(2)",
        transformOrigin: `${x}% ${y}%`,
      });
      zoomRafRef.current = null;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setZoomStyle({ transform: "scale(1)", transformOrigin: "50% 50%" });
  }, []);

  useEffect(() => {
    setCurrentImg(0);
    setIsHovering(false);
    setZoomStyle({ transform: "scale(1)", transformOrigin: "50% 50%" });
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const allImages = useMemo(() => {
    if (!product) return [];
    return product.image
      ? [product.image, ...(product.images || [])]
      : product.images?.length > 0
        ? product.images
        : [];
  }, [product]);

  const suggestedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => (p._id || p.id) !== (product._id || product.id))
      .slice(0, 4);
  }, [products, product]);

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

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="min-h-[100vh] bg-[#fcfcfc] text-[#1d1d1f] font-sans overflow-x-hidden">
        <nav className="top-0 z-[100] bg-white/95 border-b border-black/[0.03] px-5 py-3">
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
            <button
              type="button"
              onClick={() => setIsShareOpen(true)}
              aria-label="Share product"
              className="p-2.5 bg-gray-50 rounded-full hover:bg-black hover:text-white transition-all"
            >
              <Share2 size={18} />
            </button>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8 py-6 lg:py-8">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">

            {/* LEFT: IMAGE GALLERY */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="sticky top-[72px] space-y-3">
                <div
                  className="relative aspect-[5/6] lg:aspect-[5/6] xl:aspect-[6/7] max-h-[480px] lg:max-h-[520px] mx-auto w-full max-w-[380px] lg:max-w-[420px] rounded-xl overflow-hidden bg-[#f5f5f7] shadow-md group"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={isHovering ? handleMouseMove : undefined}
                >
                  <img
                    key={previewImage || allImages[currentImg]}
                    src={getImageUrl(previewImage || allImages[currentImg])}
                    alt={product.name}
                    loading="eager"
                    decoding="async"
                    style={{
                      ...zoomStyle,
                      transition: isHovering
                        ? "transform 0.15s ease-out"
                        : "transform 0.25s ease-out",
                    }}
                    className="h-full w-full object-cover"
                  />

                  {!isHovering && (
                    <div className="absolute top-4 left-4 pointer-events-none">
                      <span className="flex items-center gap-1 bg-black/80 text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest">
                        <Zap size={8} fill="currentColor" />
                      </span>
                    </div>
                  )}
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
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                          alt={`Thumbnail ${i + 1}`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* CENTER: PRODUCT INFO */}
            <div className="lg:col-span-4 xl:col-span-5">
              <div className="space-y-6">
                <header className="space-y-2">
                  <div className="flex items-center gap-2 text-orange-600 font-black text-[9px] uppercase tracking-[0.25em]">
                    <Sparkles size={12} fill="currentColor" /> Exclusive Edition
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-semibold tracking-tight leading-tight text-[#1d1d1f]">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-1.5 pt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="text-orange-500 fill-orange-500" />
                    ))}
                    <span className="text-xs text-blue-600 ml-1 hover:underline cursor-pointer">
                      128 ratings
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3 pt-1 lg:hidden">
                    <span className="text-2xl font-medium tracking-tight">
                      ₹{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-base text-gray-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                </header>

                <div className="pt-2 border-t border-black/[0.05]">
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
                          <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-orange-600" />
                        )}
                      </button>
                    ))}
                  </div>
                    <div className="text-[15px] text-gray-600 leading-relaxed max-w-lg min-h-[90px]">
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
                    </div>
                </div>

                {/* Mobile / tablet CTA */}
                <div className="lg:hidden space-y-3">
                  <a
                    href={`https://wa.me/9746683778?text=I want to order ${product.name}`}
                    className="flex items-center justify-center gap-3 w-full bg-[#ffa41c] text-[#111] py-3.5 rounded-full font-bold text-sm hover:bg-[#fa8900] transition-colors shadow-md"
                  >
                    <WhatsAppIcon size={18} /> Enquire Now
                  </a>
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
                </div>
              </div>
            </div>

            {/* RIGHT: AMAZON-STYLE BUY BOX */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="sticky top-[72px]">
                <div className="border border-gray-200 rounded-xl bg-white p-5 shadow-sm space-y-4">
                  <div>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-3xl font-medium tracking-tight text-[#b12704]">
                        ₹{product.price}
                      </span>
                      {product.originalPrice && (
                        <>
                          <span className="text-sm text-gray-500 line-through">
                            ₹{product.originalPrice}
                          </span>
                          <span className="text-xs text-[#b12704] font-medium">
                            Save ₹{Number(product.originalPrice) - Number(product.price)}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
                  </div>

                  <div className="flex items-start gap-2 text-sm text-gray-700">
                    <Truck size={16} className="text-green-700 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-green-700 font-semibold">FREE delivery</span>
                      <span className="text-gray-600"> — arrives in 5-7 days</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-700 font-semibold">In Stock</span>
                    <span className="text-gray-500">· Ships from India</span>
                  </div>

                  <div className="space-y-2.5 pt-1">
                    <a
                      href={`https://wa.me/9746683778?text=I want to order ${product.name}`}
                      className="flex items-center justify-center gap-2.5 w-full bg-[#ffa41c] hover:bg-[#fa8900] text-[#111] py-3 rounded-full font-semibold text-sm transition-colors shadow-sm"
                    >
                      <WhatsAppIcon size={18} /> Enquire Now
                    </a>
                  </div>

                  <div className="pt-3 border-t border-gray-100 space-y-2.5">
                    {[
                      { icon: ShieldCheck, text: "Authentic & verified quality" },
                      { icon: CreditCard, text: "Cash on delivery available" },
                      { icon: Clock, text: "3-5 day production time" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                        <item.icon size={14} className="text-gray-400 shrink-0" />
                        {item.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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

        {!isNavMenuOpen && (
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 border-t border-black/[0.05] p-5 z-[200] flex items-center gap-5">
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
            </div>
        )}

        <ShareModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          product={product}
          url={shareUrl}
        />
    </div>
  );
}