// src/pages/Hero.jsx
import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Search, ArrowRight, ArrowUpRight, ShoppingCart, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../Context/ProductContext";

// WhatsApp business number
const whatsappNumber = "9746683778";

// Inline WhatsApp SVG
const WhatsAppIcon = ({ size = 24, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.884 3.088" />
  </svg>
);

// Special Offers Carousel (unchanged - your original data)
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

const ProductCard = ({ 
  product, 
  whatsappNumber, 
  getDisplayCategory = (cat) => cat, 
  WhatsAppIcon,
  trendingProductIds = [],
  bestSellerProductIds = [],
}) => {
  const displayCategory = typeof getDisplayCategory === 'function' 
    ? getDisplayCategory(product.category) 
    : product.category;
    
  // Use both _id and id for compatibility
  const productId = product._id || product.id;
  const isTrending = trendingProductIds.includes(product._id) || trendingProductIds.includes(product.id);
  const isBestSeller = bestSellerProductIds.includes(product._id) || bestSellerProductIds.includes(product.id);
  const formatPrice = (num) => new Intl.NumberFormat('en-IN').format(num);

  const message = encodeURIComponent(
    `Hi! I'm interested in the ${product.name} priced at ₹${product.price}.\nCategory: ${displayCategory}\nCan you confirm availability?`
  );

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : null;

  return (
    <div className="group relative h-full max-w-[280px] mx-auto">
      <div className="relative h-full flex flex-col bg-white rounded-[1.5rem] overflow-hidden border border-slate-100 transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
        
        {/* COMPACT IMAGE SECTION */}
        <div className="relative aspect-square overflow-hidden bg-slate-50">
          {/* Minimalist Badges */}
          <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
            {discountPercentage > 0 && (
              <span className="bg-amber-400 text-black text-[8px] font-black px-2 py-0.5 rounded-md uppercase">
                {discountPercentage}% OFF
              </span>
            )}
            {isBestSeller && (
              <span className="bg-slate-900 text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                Best
              </span>
            )}
            {isTrending && (
              <span className="bg-amber-600 text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                Trending
              </span>
            )}
          </div>

          {/* LINK TO DETAIL PAGE - around the image */}
          {productId ? (
            <Link to={`/product/${productId}`} className="block h-full">
              <img
                src={product.image || product.mainImage || product.images?.[0] || "https://via.placeholder.com/400"}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </Link>
          ) : (
            <img
              src={product.image || product.mainImage || product.images?.[0] || "https://via.placeholder.com/400"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          )}
          
          {/* Quick Category Overlay */}
          <div className="absolute bottom-2 right-2">
            <span className="text-[8px] font-bold text-white bg-black/20 backdrop-blur-md px-2 py-1 rounded-full uppercase tracking-widest border border-white/10">
              {displayCategory}
            </span>
          </div>
        </div>

        {/* COMPACT CONTENT SECTION */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex-grow">
            {/* LINK TO DETAIL PAGE - around the name */}
            {productId ? (
              <Link to={`/product/${productId}`}>
                <h3 className="text-sm font-bold text-slate-900 leading-tight line-clamp-1 uppercase tracking-tight group-hover:text-amber-600 transition-colors">
                  {product.name}
                </h3>
              </Link>
            ) : (
              <h3 className="text-sm font-bold text-slate-900 leading-tight line-clamp-1 uppercase tracking-tight">
                {product.name}
              </h3>
            )}
            
            {/* Minimal Rating */}
            <div className="flex items-center gap-1.5 mt-1">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
              </div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">4.9 / 5.0</span>
            </div>
          </div>

          {/* Compact Pricing */}
          <div className="mt-3 pt-3 border-t border-slate-50">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-lg font-black text-slate-900">₹{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-[10px] line-through text-slate-300 font-bold italic">₹{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            {/* Compact WhatsApp Button */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent click from triggering the parent Link
                window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
              }}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-xl transition-all hover:bg-amber-500 hover:text-black active:scale-95 shadow-md shadow-slate-100"
            >
              {WhatsAppIcon ? (
                <WhatsAppIcon size={14} strokeWidth={2.5} />
              ) : (
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              )}
              <span className="text-[9px] font-black uppercase tracking-widest">Inquire</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────
// The rest of your file remains completely unchanged
// ────────────────────────────────────────────────

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

const CarouselSection = ({ title, products, trendingProductIds = [], bestSellerProductIds = [] }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (products.length === 0) return null;
  const titleParts = title.split(" ");

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-3"
            >
              <span className="w-10 h-[2px] bg-yellow-400" />
              <span className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">
                Featured Collection
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black leading-[0.85] tracking-tighter text-slate-900 uppercase"
            >
              {titleParts[0]}
              <br />
              <span className="text-transparent stroke-text opacity-40">
                {titleParts.slice(1).join(" ")}
              </span>
            </motion.h2>

            <p className="mt-6 max-w-md text-xs md:text-sm text-slate-500 font-medium leading-relaxed border-l-2 border-yellow-400 pl-4">
              {descriptions[title] || "Elevate your digital presence with our expertly curated selection of premium models."}
            </p>
          </div>

          <div className="flex items-center gap-4">
             <Link 
                to="/models" 
                className="group flex items-center gap-2 font-black text-xs uppercase tracking-widest text-slate-900 hover:text-yellow-500 transition-colors"
             >
                View Collection 
                <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
             </Link>
          </div>
        </div>

        {/* CAROUSEL TRACK */}
        <div className="relative group">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-6 snap-x snap-mandatory scroll-smooth no-scrollbar -mx-6 px-6 md:mx-0 md:px-0 pb-8"
          >
            {products.map((product) => {
              const isTrendingSection = /trend/i.test(title);
              const isBestSellerSection = /best/i.test(title);
              return (
                <motion.div 
                  key={product._id || product.id} 
                  whileHover={{ y: -8 }}
                  className="flex-none w-[260px] md:w-[320px] snap-start"
                >
                  <ProductCard
                    product={product}
                    whatsappNumber={whatsappNumber}
                    WhatsAppIcon={WhatsAppIcon}
                    getDisplayCategory={getDisplayCategory}
                    trendingProductIds={isTrendingSection ? trendingProductIds : []}
                    bestSellerProductIds={isBestSellerSection ? bestSellerProductIds : []}
                  />
                </motion.div>
              );
            })} 
          </div>

          {/* CUSTOM NAVIGATION CONTROLS */}
          {products.length > 3 && (
            <>
              <button
                onClick={() => scroll("left")}
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 bg-slate-900 text-white p-4 rounded-full shadow-2xl transition-all hover:bg-yellow-400 hover:text-black hover:scale-110 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center border border-white/10"
              >
                <ChevronLeft size={20} strokeWidth={3} />
              </button>

              <button
                onClick={() => scroll("right")}
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 bg-slate-900 text-white p-4 rounded-full shadow-2xl transition-all hover:bg-yellow-400 hover:text-black hover:scale-110 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center border border-white/10"
              >
                <ChevronRight size={20} strokeWidth={3} />
              </button>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .stroke-text {
          -webkit-text-stroke: 1.5px #1e293b;
          text-stroke: 1.5px #1e293b;
        }
      `}</style>
    </section>
  );
};

const SpecialOffersCarousel = () => {
  const scrollRef = useRef(null);
  const animationRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    cancelAnimationFrame(animationRef.current);

    scrollRef.current.scrollBy({
      left: direction === "left" ? -520 : 520,
      behavior: "smooth",
    });

    setTimeout(() => startAutoScroll(), 1000);
  };

  const startAutoScroll = () => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const speed = 1;
    const step = () => {
      scrollContainer.scrollLeft += speed;
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0;
      }
      animationRef.current = requestAnimationFrame(step);
    };
    animationRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    startAutoScroll();
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  const duplicatedOffers = [...specialOffers, ...specialOffers];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 py-14 md:py-20">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl" />

      <div className="relative w-full">
        <div className="max-w-7xl mx-auto px-6 mb-10 md:mb-14 text-center">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            Limited Time <span className="text-orange-500">Offers</span>
          </h2>
          <p className="mt-2 text-gray-600 text-lg md:text-xl">
            Hand-picked deals you shouldn’t miss
          </p>
        </div>

        <div className="relative group">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-28 bg-gradient-to-r from-amber-50 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-28 bg-gradient-to-l from-rose-50 to-transparent z-10" />

          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-scroll scroll-smooth no-scrollbar whitespace-nowrap"
          >
            {duplicatedOffers.map((offer, i) => (
              <div key={i} className="flex-none w-[92%] md:w-[75%] lg:w-[65%]">
                <div className="transition-transform duration-500 hover:scale-[1.02]">
                  <OfferCard offer={offer} />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur shadow-xl p-3 rounded-full hover:scale-105 transition opacity-0 group-hover:opacity-100 z-20"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur shadow-xl p-3 rounded-full hover:scale-105 transition opacity-0 group-hover:opacity-100 z-20"
          >
            <ChevronRight size={16} />
          </button>

          <button
            onClick={() => scroll("left")}
            className="flex md:hidden absolute left-4 bottom-4 bg-white/90 shadow-xl p-3 rounded-full hover:scale-105 transition z-20"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="flex md:hidden absolute right-4 bottom-4 bg-white/90 shadow-xl p-3 rounded-full hover:scale-105 transition z-20"
          >
            <ChevronRight size={20} />
          </button>
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
        <section className="relative w-full h-40 sm:h-48 md:h-[220px] lg:h-[260px] my-6">
          <div className="relative h-full w-full overflow-hidden shadow-2xl bg-[#0a0a0a] group">
            <AnimatePresence mode="wait">
              <motion.div
                key={slideIndex}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <motion.img
                  initial={{ x: 20 }}
                  animate={{ x: 0 }}
                  transition={{ duration: 10, ease: "linear" }}
                  src={heroBanners[slideIndex]?.image || "https://via.placeholder.com/1400x600"}
                  alt={heroBanners[slideIndex]?.title}
                  className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-[2000ms]"
                />

                {/* Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent flex items-center">
                  <div className="px-6 sm:px-10 md:px-16 w-full md:w-2/3">
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="h-[1px] w-6 bg-[#f7ef22]" />
                        <span className="text-[#f7ef22] text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em]">
                          Limited Drop
                        </span>
                      </div>

                      {/* <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-white mb-2 leading-none tracking-tighter uppercase italic">
                        {heroBanners[slideIndex]?.title || "New Arrivals"}
                      </h2> */}

                      <p className="text-[10px] sm:text-xs md:text-sm text-gray-400 mb-4 max-w-[280px] line-clamp-1 font-medium tracking-wide">
                        {heroBanners[slideIndex]?.description || "Experience premium quality"}
                      </p>

                      <a
                        href="/models"
                        className="inline-flex items-center gap-3 px-6 py-2 bg-[#f7ef22] text-black rounded-full text-[10px] font-black hover:bg-white transition-all shadow-xl active:scale-95 uppercase tracking-widest"
                      >
                        Explore
                        <div className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center">
                          <ChevronRight size={12} />
                        </div>
                      </a>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
              {heroBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSlideIndex(idx)}
                  className={`h-1 transition-all duration-500 rounded-full ${
                    idx === slideIndex
                      ? "w-8 bg-[#f7ef22]"
                      : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>

            {/* Side Controls */}
            <div className="absolute inset-y-0 w-full flex justify-between items-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <button
                onClick={() =>
                  setSlideIndex((prev) => (prev - 1 + heroBanners.length) % heroBanners.length)
                }
                className="pointer-events-auto p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-[#f7ef22] hover:text-black transition-all"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                onClick={() =>
                  setSlideIndex((prev) => (prev + 1) % heroBanners.length)
                }
                className="pointer-events-auto p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-[#f7ef22] hover:text-black transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* Shop By Category - Dynamic */}
        <section className="max-w-7xl mx-auto px-4 py-12 bg-[#fafafa]">
          {/* SECTION HEADER */}
          <div className="flex items-end justify-between mb-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-amber-500" />
                <span className="text-[10px] font-bold tracking-[0.3em] text-amber-600 uppercase">
                  Premium Studio
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase">
                Shop <span className="text-amber-500">Categories</span>
              </h2>
            </div>
            
            <Link 
              to="/models" 
              className="group flex items-center gap-2 text-[11px] font-black tracking-widest text-slate-400 hover:text-slate-900 transition-colors uppercase"
            >
              View Collection <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* E-COMMERCE PRODUCT GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
  {shopCategories.map((cat, index) => (
    <motion.div
      key={cat.id}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      viewport={{ once: true }}
      className="group bg-white rounded-2xl p-2 border border-slate-100 hover:border-amber-400 hover:shadow-lg transition-all duration-300"
    >
      <Link to={`/models?category=${cat.name}`} className="block">
        {/* Image Block - Smaller & Square */}
        <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-50">
          <img
            src={cat.image}
            alt={cat.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Subtle Category Tag */}
          <div className="absolute top-2 left-2">
            <span className="bg-black/80 backdrop-blur-sm text-[8px] text-white px-2 py-0.5 rounded-md font-bold uppercase tracking-tighter">
              Collection
            </span>
          </div>
        </div>

        {/* Product Info Block - Condensed */}
        <div className="mt-3 px-1">
          {/* <div className="flex items-center gap-1 mb-1">
            <Star size={8} className="fill-amber-400 text-amber-400" />
            <span className="text-[9px] text-slate-400 font-bold">4.8</span>
          </div> */}
          
          <h3 className="text-sm font-black text-slate-900 leading-tight uppercase truncate">
            {cat.name}
          </h3>
          
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
            <span className="text-[9px] font-bold text-slate-400 uppercase">Explore More</span>
            <div className="h-5 w-5 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
              <ArrowRight size={10} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  ))}
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
            <SpecialOffersCarousel />
            <CarouselSection title="Best Sellers" products={bestSellers} trendingProductIds={trendingProductIds} bestSellerProductIds={bestSellerProductIds} />
          </>
        )}
      </div>
    </div>
  );
}