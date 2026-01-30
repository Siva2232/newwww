// src/pages/Hero.jsx
import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Search, ArrowRight, ArrowUpRight, ShoppingCart, Star, Plus, Sparkles, Timer } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../Context/ProductContext";
import ProductCard from "../components/common/ProductCard";

// WhatsApp business number
const whatsappNumber = "9746683778";

// Inline WhatsApp SVG
const WhatsAppIcon = ({ size = 24, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.884 3.088" />
  </svg>
);

// Special Offers Carousel Data
const specialOffers = [
  {
    title: "Hot Deal: Frames",
    highlight: "Starting ₹49",
    description: "Premium quality frames – limited time offer",
    image: "https://www.shutterstock.com/image-vector/sale-photo-frame-banner-square-260nw-2662612137.jpg",
  },
  {
    title: "Luxury Albums",
    highlight: "From ₹299",
    description: "Handcrafted genuine leather albums",
    image: "https://img.freepik.com/free-vector/elegant-aesthetic-luxury-jewelry-halfpage-banner-template_742173-17440.jpg",
  },
  {
    title: "Photo Books Sale",
    highlight: "Up to 30% Off",
    description: "Custom hardcover photo books",
    image: "https://cdn-image.staticsfly.com/i/landingpages/2025/SYECM1215_Dec_HP_YIR_3up_Photo-prints.jpg",
  },
  {
    title: "Bundle Offers",
    highlight: "Save Extra 20%",
    description: "Buy frames + albums together",
    image: "https://media1.pbwwcdn.net/promotion_groups/pg-banner-541289369.jpeg",
  },
  {
    title: "Limited Stock",
    highlight: "₹49 Only",
    description: "Classic wooden frames – grab now!",
    image: "https://www.shutterstock.com/image-vector/49-rupee-off-sale-discount-260nw-2142090367.jpg",
  },
];

const descriptions = {
  "Trending Now": "Explore what’s hot and trending right now.",
  "Best Sellers": "Our most loved and top-selling products.",
  "Shop By Category": "Browse products by your favorite categories.",
};

const getDisplayCategory = (cat) => {
  switch (cat) {
    case "frames": return "Frames";
    case "albums": return "Albums";
    case "books": return "Photo Books";
    default: return cat || "";
  }
};

const OfferCard = ({ offer, index }) => (
  <div className="relative group rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] h-48 md:h-60 bg-zinc-900 transition-all duration-700 border border-white/5">
    {/* Background Image with Zoom Effect */}
    <div className="absolute inset-0">
      <img
        src={offer.image}
        alt={offer.title}
        className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110 opacity-60 group-hover:opacity-80"
      />
    </div>

    {/* Cinematic Gradient Overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />

    {/* Content Layout */}
    <div className="absolute inset-0 flex items-center px-8 md:px-12">
      <div className="w-full max-w-xl">
        {/* Floating Tag */}
        <div className="flex items-center gap-3 mb-3">
          <span className="px-3 py-1 bg-[#f7ef22] text-black text-[9px] font-black uppercase tracking-widest rounded-full shadow-[0_4px_15px_rgba(247,239,34,0.3)]">
            Active Offer
          </span>
          <span className="text-white/40 text-[9px] font-bold uppercase tracking-[0.2em] animate-pulse">
            • Live Now
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end gap-1 md:gap-4 mb-4">
          <h3 className="text-4xl md:text-6xl font-black text-[#f7ef22] tracking-tighter leading-none drop-shadow-2xl">
            {offer.highlight}
          </h3>
          <p className="text-lg md:text-xl font-bold text-white uppercase italic tracking-tighter opacity-90 pb-1">
            {offer.title}
          </p>
        </div>

        <p className="hidden md:block text-sm text-zinc-300 font-medium max-w-sm mb-6 line-clamp-1 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
          {offer.description}
        </p>

        {/* Small Size Shop Button */}
        <button className="group/btn relative flex items-center gap-3 bg-white text-black px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all duration-300 hover:bg-[#f7ef22] hover:scale-105 active:scale-95">
          Shop Now
          <div className="w-5 h-5 bg-black/5 rounded-full flex items-center justify-center group-hover/btn:translate-x-1 transition-transform">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>
    </div>

    {/* Luxury Shine Effect */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute -inset-full h-full w-1/2 z-10 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:animate-shine" />
    </div>

    <style jsx global>{`
      @keyframes shine {
        0% { transform: translateX(-150%) skewX(-12deg); opacity: 0; }
        50% { opacity: 0.5; }
        100% { transform: translateX(150%) skewX(-12deg); opacity: 0; }
      }
      .group-hover\\:animate-shine {
        animation: shine 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      }
    `}</style>
  </div>
);

const CarouselSection = ({
  title = "Collection",
  products = [],
  whatsappNumber = "",
  WhatsAppIcon,
  getDisplayCategory = (cat) => cat 
}) => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [activeNavId, setActiveNavId] = useState(null);

  if (!products || products.length === 0) return null;

  const handleCardClick = (e, productId) => {
    setActiveNavId(productId);
    setTimeout(() => {
      navigate(`/product/${productId}`);
      setTimeout(() => setActiveNavId(null), 1000);
    }, 400);
  };

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const { current } = scrollRef;
    const card = current.querySelector('.product-card-wrapper');
    const cardWidth = card ? card.offsetWidth + 24 : 350; 
    current.scrollBy({ left: direction === 'left' ? -cardWidth : cardWidth, behavior: 'smooth' });
  };

  return (
    <section className="bg-[#f5f5f7] py-20 md:py-0 overflow-hidden relative">
      <AnimatePresence>
        {activeNavId && (
          <motion.div 
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 right-0 h-1 bg-[#0071e3] origin-left z-[300]"
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div className="space-y-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-semibold tracking-tight text-[#1d1d1f]"
            >
              {title}.
              <span className="text-[#86868b] block"> Engineered for excellence.</span>
            </motion.h2>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => scroll("left")} className="w-12 h-12 rounded-full bg-white border border-black/5 flex items-center justify-center text-[#1d1d1f] hover:bg-black hover:text-white transition-all active:scale-95 shadow-sm">
              <ChevronLeft size={22} strokeWidth={1.5} />
            </button>
            <button onClick={() => scroll("right")} className="w-12 h-12 rounded-full bg-white border border-black/5 flex items-center justify-center text-[#1d1d1f] hover:bg-black hover:text-white transition-all active:scale-95 shadow-sm">
              <ChevronRight size={22} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-12">
          {products.map((product, idx) => {
            const isThisCardLoading = activeNavId === (product._id || product.id);

            return (
              <div key={product._id || product.id || idx} className="product-card-wrapper flex-none w-[85vw] sm:w-[340px] md:w-[400px] snap-start">
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  animate={isThisCardLoading ? { opacity: 0.7, scale: 0.98 } : { opacity: 1, scale: 1 }}
                  onClick={(e) => handleCardClick(e, product._id || product.id)}
                  className="group cursor-pointer bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] transition-all duration-500 border border-black/[0.02] relative"
                >
                  <AnimatePresence>
                    {isThisCardLoading && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-40 bg-white/40 backdrop-blur-[2px] flex items-center justify-center"
                      >
                        <div className="w-6 h-6 border-2 border-[#0071e3] border-t-transparent rounded-full animate-spin" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="aspect-square overflow-hidden bg-[#fafafa] relative">
                    <motion.img
                      src={product.image || product.mainImage}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute top-6 left-6">
                      <span className="px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-[10px] font-bold text-[#86868b] uppercase tracking-widest border border-black/5">
                        {getDisplayCategory(product.category)}
                      </span>
                    </div>
                  </div>

                  <div className="p-8">
                    <h3 className="text-xl md:text-2xl font-semibold text-[#1d1d1f] mb-4 line-clamp-1 group-hover:text-[#0071e3] transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-semibold text-[#1d1d1f]">₹{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-[#86868b] line-through opacity-50">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {whatsappNumber && WhatsAppIcon && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`https://wa.me/${whatsappNumber}`, '_blank');
                            }}
                            className="p-3 bg-[#f5f5f7] rounded-full text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all shadow-sm z-50 relative"
                          >
                            <WhatsAppIcon size={18} />
                          </button>
                        )}
                        <div className="p-3 bg-[#1d1d1f] text-white rounded-full group-hover:bg-[#0071e3] transition-all shadow-md">
                          <ArrowUpRight size={18} />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};


const SpecialOffersCarousel = ({ specialOffers = [] }) => {
  const scrollRef = useRef(null);
  const animationRef = useRef(null);
  const pausedRef = useRef(false);

  if (!specialOffers || specialOffers.length === 0) return null;

  const duplicatedOffers = [
    ...specialOffers,
    ...specialOffers,
    ...specialOffers,
  ];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let lastTime = performance.now();
    const SPEED = 120;

    const animate = (time) => {
      const delta = time - lastTime;
      lastTime = time;

      if (!pausedRef.current) {
        container.scrollLeft += (SPEED * delta) / 1000;
        const oneSetWidth = container.scrollWidth / 3;
        if (container.scrollLeft >= oneSetWidth * 2) {
          container.scrollLeft -= oneSetWidth;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  const manualScroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    pausedRef.current = true;
    const approximateCardWidth = container.offsetWidth * 0.75;
    const scrollAmount =
      direction === "left"
        ? -approximateCardWidth
        : approximateCardWidth;

    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    setTimeout(() => (pausedRef.current = false), 900);
  };

  return (
    <section className="relative w-full bg-[#f5f5f7] py-14 sm:py-16 md:py-24 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-1/4 w-80 h-80 md:w-96 md:h-96 bg-orange-100/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 md:w-96 md:h-96 bg-blue-100/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 mb-10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-[0.2em]">
              <Sparkles size={14} fill="currentColor" />
              <span>Limited Time Release</span>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-7xl font-semibold tracking-tight text-[#1d1d1f]"
            >
              Special Offers.
              <span className="text-[#86868b] block opacity-70 font-medium">
                Hand-picked deals you shouldn't miss.
              </span>
            </motion.h2>
          </div>

          <div className="hidden sm:flex gap-3">
            <button
              onClick={() => manualScroll("left")}
              className="w-11 h-11 rounded-full bg-white border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm active:scale-90"
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => manualScroll("right")}
              className="w-11 h-11 rounded-full bg-white border border-black/5 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm active:scale-90"
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      <div
        className="relative"
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
      >
        <div
          ref={scrollRef}
          className="flex gap-6 sm:gap-8 overflow-x-auto whitespace-nowrap px-4 sm:px-6 py-5 no-scrollbar touch-pan-x"
        >
          {duplicatedOffers.map((offer, i) => (
            <div
              key={i}
              className="flex-none w-[75vw] sm:w-[50vw] md:w-[380px] lg:w-[420px] group"
            >
              <div className="space-y-5">
                <motion.div
                  className="relative h-[280px] sm:h-[350px] md:h-[400px] bg-white rounded-[32px] overflow-hidden shadow-sm border border-black/[0.03]"
                  whileHover={{ y: -5 }}
                >
                  <img
                    src={offer.image || offer.mainImage || "/placeholder-offer.jpg"}
                    alt={offer.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                  />

                  {/* Category Tag */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-xl rounded-full text-white text-[10px] font-bold uppercase tracking-widest border border-white/10">
                      {offer.category || "Exclusive"}
                    </span>
                  </div>

                  {/* Shop Now Button — BOTTOM PLACED */}
                <div className="absolute inset-0 flex items-end justify-start p-5">
                  <button className="px-6 py-3 bg-[#f7ef22] text-black rounded-full font-bold text-xs uppercase tracking-widest shadow-xl flex items-center gap-2">
                    Shop Now
                    <ArrowRight size={16} />
                  </button>
                </div>

                </motion.div>

                {/* Content Below Card */}
                <div className="px-2 space-y-2">
                  <div className="flex items-center gap-2 text-black text-[10px] font-bold uppercase tracking-widest">
                    <Timer size={12} />
                    <span>Offer</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#1d1d1f] tracking-tight leading-tight">
                    {offer.title || offer.name}
                  </h3>

                  <p className="text-sm md:text-base text-[#86868b] font-medium line-clamp-2">
                    {offer.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};




export default function Hero() {
  const { 
    products, 
    heroBanners, 
    shopCategories, 
    trendingProductIds, 
    bestSellerProductIds 
  } = useProducts();

  const navigate = useNavigate();
  const [slideIndex, setSlideIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredProducts = useMemo(
    () => products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    ),
    [products, searchTerm]
  );

  const suggestions = filteredProducts.slice(0, 8);

  const searchContainerRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState({ left: 0, top: 0, width: "auto" });

  useEffect(() => {
    if (!isDropdownOpen || !searchContainerRef.current) return;

    const updatePosition = () => {
      const el = searchContainerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setDropdownStyle({
        left: rect.left,
        top: rect.bottom + 8,
        width: rect.width,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [isDropdownOpen]);

  // Auto slide for hero banner
  useEffect(() => {
    if (heroBanners.length <= 1) return;
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % heroBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroBanners.length]);

  // Featured products from admin selection
  const trendingProducts = useMemo(() => {
    return products.filter(p => trendingProductIds.includes(p._id || p.id)).slice(0, 12);
  }, [products, trendingProductIds]);

  const bestSellers = useMemo(() => {
    return products.filter(p => bestSellerProductIds.includes(p._id || p.id)).slice(0, 12);
  }, [products, bestSellerProductIds]);

  return (
    <div className="bg-gray-50">
      {/* Search moved to Navbar — header removed */}

      {/* Added pt-24 to push content below fixed header */}
      <div className="pt-0">
        {/* Top Hero Banner - Dynamic from Admin */}
    <section className="relative w-full bg-white pt-1 pb-4 overflow-hidden">
  {/* Ultra-Compact height: Maxes at 380px for a sleek, modern look */}
  <div className="relative h-[260px] sm:h-[320px] md:h-[380px] w-full max-w-[1300px] mx-auto overflow-hidden sm:rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.06)] group">
    <AnimatePresence mode="wait">
      <motion.div
        key={slideIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        className="absolute inset-0 bg-white"
      >
        {/* Background Image */}
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 5, ease: "easeOut" }}
        >
          <img
            src={heroBanners[slideIndex]?.image}
            alt={heroBanners[slideIndex]?.title}
            className="w-full h-full object-cover"
          />
          {/* Subtle responsive gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r md:from-white/90 md:via-white/10 md:to-transparent" />
        </motion.div>

        {/* Content Area - Optimized Padding */}
        <div className="relative h-full flex items-center px-6 sm:px-12 md:px-16">
          <div className="max-w-lg">
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className="inline-block text-[9px] md:text-[11px] font-black text-white md:text-black/40 bg-black/20 md:bg-transparent px-2 py-0.5 rounded md:p-0 tracking-[0.2em] mb-3 uppercase">
                Featured
              </span>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white md:text-black leading-[1] tracking-tighter mb-4">
                {heroBanners[slideIndex]?.title || "The future of style."}
              </h2>

              <p className="text-xs md:text-base text-white/80 md:text-black/60 mb-6 max-w-xs font-medium leading-snug line-clamp-2">
                {heroBanners[slideIndex]?.description || "Experience next-gen premium design."}
              </p>

              <div className="flex items-center gap-4">
                <a
                  href="/models"
                  className="px-6 py-2.5 bg-black text-white rounded-xl text-[12px] font-bold hover:scale-105 transition-all shadow-lg active:scale-95"
                >
                  Buy Now
                </a>
                <a
                  href="/learn-more"
                  className="hidden sm:flex text-white md:text-black/60 hover:text-black text-[13px] font-bold items-center gap-1 group"
                >
                  Learn More 
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>

    {/* Compact Navigation Pill - Smaller and centered */}
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-30 bg-white/10 backdrop-blur-md p-1.5 rounded-full border border-white/20">
      {heroBanners.map((_, idx) => (
        <button
          key={idx}
          onClick={() => setSlideIndex(idx)}
          className="relative h-1 rounded-full bg-white/40 overflow-hidden transition-all duration-500"
          style={{ width: idx === slideIndex ? '24px' : '6px' }}
        >
          {idx === slideIndex && (
            <motion.div 
              className="absolute inset-0 bg-white md:bg-black"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              transition={{ duration: 8, ease: "linear" }}
            />
          )}
        </button>
      ))}
    </div>
  </div>
</section>

 <section className="bg-[#f5f5f7] py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
  <div className="max-w-[1440px] mx-auto">
    {/* Header */}
    <header className="mb-8 sm:mb-12 lg:mb-16 max-w-3xl lg:max-w-4xl">
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        viewport={{ once: true }}
        className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#1d1d1f] leading-tight"
      >
        Shop by Category.
        <span className="text-[#86868b] block sm:inline"> Selection made simple.</span>
      </motion.h2>
    </header>

    {/* Updated Grid – lg:grid-cols-4 for 4 cards on desktop */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-6">
      {shopCategories.map((cat, index) => (
        <motion.div
          key={cat.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: index * 0.1,
            duration: 0.9,
            ease: [0.21, 0.45, 0.32, 0.9],
          }}
          viewport={{ once: true }}
          className="relative group h-full"
        >
          <Link to={`/models?category=${cat.name}`} className="block h-full touch-manipulation">
            {/* Card container – rounded corners REMOVED for sharp square look */}
            <div className="
              relative overflow-hidden bg-white
              transition-all duration-700 ease-out
              group-hover:shadow-xl group-hover:shadow-black/10
              group-hover:-translate-y-1 sm:group-hover:-translate-y-2
              aspect-square
            ">
              {/* Text overlay */}
              <div className="
                absolute inset-0 z-20 flex flex-col justify-end
                pb-5 sm:pb-8
                pl-4 sm:pl-6
                pr-4 sm:pr-6
                pointer-events-none
              ">
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.6 }}
                  className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-widest mb-1 drop-shadow-md"
                >
                  {cat.series || ""}
                </motion.p>
                <h3 className="
                  text-lg sm:text-xl lg:text-2xl
                  font-semibold text-white leading-tight tracking-tight
                  drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]
                ">
                  {cat.name}
                </h3>
              </div>

              {/* Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="
                  absolute inset-0 w-full h-full object-cover object-center
                  transition-transform duration-[1.1s] ease-out
                  group-hover:scale-105 sm:group-hover:scale-110
                "
              />

              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent pointer-events-none z-10" />

              <div className="
                absolute inset-0 z-15 opacity-0 group-hover:opacity-100
                transition-opacity duration-700 pointer-events-none
                bg-gradient-to-tr from-transparent via-white/10 to-transparent
                -translate-x-full group-hover:translate-x-full
              " />

              {/* Arrow indicator */}
              <div className="
                absolute bottom-3 right-3 sm:bottom-5 sm:right-5
                z-30 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
                transition-all duration-500 ease-out
              ">
                <div className="
                  w-8 h-8 sm:w-10 sm:h-10
                  rounded-full bg-white/90 backdrop-blur-md shadow-md
                  flex items-center justify-center text-[#1d1d1f]
                ">
                  <ArrowUpRight size={18} className="sm:size-5" strokeWidth={2.5} />
                </div>
              </div>
            </div>

            {/* Below-card text */}
            <div className="mt-3 sm:mt-4 px-1">
              <div className="flex items-center justify-between text-[11px] sm:text-xs">
                <div className="flex flex-col">
                  <span className="font-semibold text-[#1d1d1f]">Explore</span>
                  <div className="
                    h-[1.5px] w-0 bg-[#1d1d1f] transition-all duration-500
                    group-hover:w-10 sm:group-hover:w-12
                  " />
                </div>
                <span className="text-[#86868b]">Learn more</span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>

    {/* Footer */}
    <footer className="
      mt-12 sm:mt-16 border-t border-[#d2d2d7] pt-8
      flex flex-col sm:flex-row items-center justify-between gap-4
    ">
      {/* <p className="text-[#86868b] text-sm sm:text-base font-medium">
        Looking for something specific?
      </p> */}
 {/* <Link
  to="/models"
  className="
    mx-auto flex items-center gap-2 w-fit
    px-6 py-2.5 rounded-full bg-[#292d31] text-white text-sm
    font-medium hover:bg-[#24292e] transition-all
    shadow-md whitespace-nowrap group
  "
>
  <span>See all collections</span>
  <ArrowRight 
    size={16} 
    className="transition-transform duration-300 group-hover:translate-x-1" 
  />
</Link> */}
    </footer>
  </div>
</section>

        {/* Search Results or Carousels */}
        {searchTerm ? (
          <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-2xl md:text-3xl font-black text-center mb-10">
                Search Results {filteredProducts.length > 0 && `(${filteredProducts.length})`}
              </h2>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product._id || product.id}
                      product={product}
                      whatsappNumber={whatsappNumber}
                      WhatsAppIcon={WhatsAppIcon}
                      getDisplayCategory={getDisplayCategory}
                      trendingProductIds={trendingProductIds}
                      bestSellerProductIds={bestSellerProductIds}
                    />
                  ))} 
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-xl text-gray-500 mb-6">No products found.</p>
                  <button onClick={() => setSearchTerm("")} className="px-8 py-4 bg-amber-600 text-black font-bold rounded-full shadow-xl">
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          </section>
        ) : (
          <>
            <CarouselSection title="Trending Now" products={trendingProducts} trendingProductIds={trendingProductIds} bestSellerProductIds={bestSellerProductIds} />
            <SpecialOffersCarousel specialOffers={specialOffers} />
            <CarouselSection title="Best Sellers" products={bestSellers} trendingProductIds={trendingProductIds} bestSellerProductIds={bestSellerProductIds} />
          </>
        )}
      </div>
    </div>
  );
}