// src/sections/Hero.jsx
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Timer,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../Context/ProductContext";
import ProductCard from "../components/common/ProductCard";
import { getImageUrl } from "../utils/imageUrl";
import { getProductId, isProductInList } from "../utils/productIds";

const whatsappNumber = "9746683778";

const SectionEyebrow = ({ children, icon: Icon = Sparkles, onDark = false }) => (
  <div
    className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] ${
      onDark
        ? "border border-white/25 bg-black/30 text-white backdrop-blur-md"
        : "border border-orange-200/80 bg-orange-50/90 text-orange-700"
    }`}
  >
    <Icon size={13} className="shrink-0" aria-hidden />
    <span>{children}</span>
  </div>
);

const SectionHeading = ({ title, subtitle, className = "" }) => (
  <div className={`space-y-3 ${className}`}>
    <motion.h2
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="text-[clamp(1.75rem,4vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f]"
    >
      {title}
      {subtitle && (
        <span className="mt-1 block text-[0.55em] font-medium tracking-[-0.02em] text-[#86868b]">
          {subtitle}
        </span>
      )}
    </motion.h2>
  </div>
);

// Inline WhatsApp SVG
const WhatsAppIcon = ({ size = 24, className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.884 3.088" />
  </svg>
);

// ──────────────────────────────────────────────────────────────
// Improved SpecialOffersCarousel – smooth + no visible duplication jump
// ──────────────────────────────────────────────────────────────

function SpecialOffersCarousel() {
  // All hooks must be called unconditionally at the top
  const { specialOffers } = useProducts();
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);
  const trackRef = useRef(null);
  const rafRef = useRef(null);
  const pausedRef = useRef(false);
  const posRef = useRef(0);

  // No need to fetch here, context handles loading

  // Deduplicate offers by unique key (id + title)
  const uniqueOffers = useMemo(() => {
    const seen = new Set();
    return specialOffers.filter((offer) => {
      const key = (offer._id || offer.id || "") + "-" + (offer.title || "");
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [specialOffers]);

  const activeOffers = useMemo(
    () =>
      uniqueOffers
        .filter((offer) => offer.isActive !== false)
        .sort(
          (a, b) =>
            (b.displayOrder || 0) - (a.displayOrder || 0) ||
            new Date(b.createdAt) - new Date(a.createdAt),
        ),
    [uniqueOffers],
  );

  // For seamless animation, repeat only if more than 1 offer
  const duplicatedOffers = useMemo(
    () =>
      activeOffers.length > 1
        ? [...activeOffers, ...activeOffers, ...activeOffers]
        : activeOffers,
    [activeOffers],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track || activeOffers.length === 0) return;

    let lastTime = performance.now();
    const SPEED = 32; // px/second – tune 22–45
    const MAX_DELTA = 50;

    const animate = (now) => {
      const delta = Math.min(now - lastTime, MAX_DELTA);
      lastTime = now;

      if (!pausedRef.current) {
        posRef.current += SPEED * (delta / 1000);

        const segmentWidth =
          track.scrollWidth / (activeOffers.length > 1 ? 3 : 1);
        if (posRef.current >= segmentWidth * 2) {
          posRef.current -= segmentWidth;
        }

        track.style.transform = `translateX(-${posRef.current}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [activeOffers.length]);

  const manualScroll = (direction) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    pausedRef.current = true;

    const step = wrapper.clientWidth * 0.78;
    const amount = direction === "left" ? -step : step;

    wrapper.scrollBy({ left: amount, behavior: "smooth" });

    posRef.current += amount;

    setTimeout(() => {
      pausedRef.current = false;
    }, 1400);
  };

  // Only return after all hooks
  if (loading) {
    return (
      <section className="w-full flex justify-center items-center min-h-[400px] bg-[#f5f5f7]">
        <div className="flex items-center gap-3 text-orange-600 font-medium">
          <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          Loading special offers...
        </div>
      </section>
    );
  }

  if (activeOffers.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-[#f5f5f7] py-16 sm:py-20 md:py-28">
      <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-orange-200/25 blur-[100px] md:h-96 md:w-96" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-sky-200/20 blur-[100px] md:h-96 md:w-96" />

      <div className="relative z-10 mx-auto mb-12 max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl space-y-4">
            <SectionEyebrow>Limited time</SectionEyebrow>
            <SectionHeading
              title="Special Offers."
              subtitle="Hand-picked deals you shouldn't miss."
            />
          </div>

          <div className="flex gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => manualScroll("left")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-black/[0.06] bg-white text-[#1d1d1f] shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all hover:bg-[#1d1d1f] hover:text-white active:scale-95"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => manualScroll("right")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-black/[0.06] bg-white text-[#1d1d1f] shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all hover:bg-[#1d1d1f] hover:text-white active:scale-95"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel – smooth & no visible duplication */}
      <div ref={wrapperRef} className="relative overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-6 sm:gap-8 will-change-transform"
          style={{
            transform: `translateX(-${posRef.current}px)`,
            transition: pausedRef.current ? "transform 0.45s ease-out" : "none",
          }}
        >
          {duplicatedOffers.map((offer, i) => (
            <div
              key={`${offer._id || offer.id || "offer"}-${i}`}
              className="group flex-none w-[78vw] sm:w-[52vw] md:w-[380px] lg:w-[420px]"
            >
              <div className="space-y-5">
                <motion.div
                  className="relative h-[300px] overflow-hidden rounded-[28px] border border-black/[0.04] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-shadow duration-500 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] sm:h-[360px] md:h-[400px]"
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                >
                  <img
                    src={getImageUrl(offer.image) || "/placeholder-offer.jpg"}
                    alt={offer.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder-offer.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                  <div className="absolute left-4 top-4 z-10 sm:left-5 sm:top-5">
                    <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                      {offer.category || "Exclusive"}
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 flex items-end p-5 sm:p-6">
                    <Link
                      to="/models"
                      className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#1d1d1f] shadow-lg transition-all hover:bg-[#f5f5f7] active:scale-[0.98]"
                    >
                      Shop now
                      <ArrowRight size={15} strokeWidth={2} />
                    </Link>
                  </div>
                </motion.div>

                <div className="space-y-2 px-1">
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#86868b]">
                    <Timer size={12} aria-hidden />
                    <span>Limited offer</span>
                  </div>
                  <h3 className="line-clamp-2 text-xl font-semibold leading-snug tracking-[-0.02em] text-[#1d1d1f] sm:text-2xl">
                    {offer.title || "Special Deal"}
                  </h3>
                  <p className="line-clamp-2 text-sm font-medium leading-relaxed text-[#86868b] md:text-[15px]">
                    {offer.description || "Limited time special offer"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────
// Rest of the Hero page (CarouselSection + main Hero component)
// ──────────────────────────────────────────────────────────────

const getDisplayCategory = (cat) => {
  switch (cat?.toLowerCase()) {
    case "frames":
      return "Frames";
    case "albums":
      return "Albums";
    case "books":
      return "Photo Books";
    default:
      return cat || "";
  }
};

const CarouselSection = ({
  title = "Collection",
  products = [],
  whatsappNumber = "",
  WhatsAppIcon,
  getDisplayCategory = (cat) => cat,
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
    const card = current.querySelector(".product-card-wrapper");
    const cardWidth = card ? card.offsetWidth + 24 : 350;
    current.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative overflow-hidden bg-[#f5f5f7] py-16 sm:py-20 md:py-24">
      <AnimatePresence>
        {activeNavId && (
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[300] h-0.5 origin-left bg-[#0071e3]"
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-8 md:mb-12 md:flex-row md:items-end">
          <div className="max-w-2xl space-y-4">
            <SectionEyebrow icon={Sparkles}>Curated</SectionEyebrow>
            <SectionHeading
              title={`${title}.`}
              subtitle="Engineered for excellence."
            />
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-black/[0.06] bg-white text-[#1d1d1f] shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all hover:bg-[#1d1d1f] hover:text-white active:scale-95"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-black/[0.06] bg-white text-[#1d1d1f] shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all hover:bg-[#1d1d1f] hover:text-white active:scale-95"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:gap-6 sm:pb-6"
        >
          {products.map((product, idx) => {
            const isThisCardLoading =
              activeNavId === (product._id || product.id);

            return (
              <div
                key={product._id || product.id || idx}
                className="product-card-wrapper w-[82vw] flex-none snap-start sm:w-[300px] md:w-[320px]"
              >
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  animate={
                    isThisCardLoading
                      ? { opacity: 0.75, scale: 0.98 }
                      : { opacity: 1, scale: 1 }
                  }
                  onClick={(e) => handleCardClick(e, product._id || product.id)}
                  className="group relative cursor-pointer overflow-hidden rounded-[26px] border border-black/[0.05] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(0,0,0,0.08)]"
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

                  <div className="relative aspect-[4/5] overflow-hidden bg-[#f8f8fa]">
                    <motion.img
                      src={getImageUrl(product.image || product.mainImage)}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="absolute left-4 top-4 sm:left-5 sm:top-5">
                      <span className="rounded-full border border-black/[0.06] bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6e6e73] backdrop-blur-md">
                        {getDisplayCategory(product.category)}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <h3 className="mb-3 line-clamp-2 text-lg font-semibold leading-snug tracking-[-0.02em] text-[#1d1d1f] transition-colors group-hover:text-[#0071e3] sm:text-xl">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-semibold tracking-tight text-[#1d1d1f] sm:text-2xl">
                          ₹{product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm font-medium text-[#86868b] line-through decoration-[#86868b]/40">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        {whatsappNumber && WhatsAppIcon && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(
                                `https://wa.me/${whatsappNumber}`,
                                "_blank",
                              );
                            }}
                            className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f5f7] text-[#25D366] transition-all hover:bg-[#25D366] hover:text-white"
                            aria-label="Contact on WhatsApp"
                          >
                            <WhatsAppIcon size={17} />
                          </button>
                        )}
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7ef22] text-black shadow-sm transition-all group-hover:scale-105 group-hover:bg-[#f7ef22]/90">
                          <ArrowUpRight size={17} strokeWidth={2} />
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

    </section>
  );
};

function CategoryCarousel({ categories = [] }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < maxScroll - 4);

    const card = el.querySelector(".category-carousel-card");
    if (!card) return;

    const gap = parseFloat(getComputedStyle(el).gap) || 16;
    const step = card.offsetWidth + gap;
    const index = step > 0 ? Math.round(el.scrollLeft / step) : 0;
    setActiveIndex(Math.min(Math.max(index, 0), categories.length - 1));
  }, [categories.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [categories.length, updateScrollState]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector(".category-carousel-card");
    const gap = parseFloat(getComputedStyle(el).gap) || 16;
    const step = card ? card.offsetWidth + gap : el.clientWidth * 0.88;
    el.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  const scrollToIndex = (index) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector(".category-carousel-card");
    const gap = parseFloat(getComputedStyle(el).gap) || 16;
    const step = card ? card.offsetWidth + gap : 0;
    el.scrollTo({ left: step * index, behavior: "smooth" });
  };

  if (!categories.length) return null;

  return (
    <section className="relative overflow-hidden bg-[#f5f5f7] py-12 sm:py-20 md:py-24">
      <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-orange-400/10 blur-[100px]" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-orange-500/5 blur-[90px]" />

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-6 sm:mb-10 md:mb-12 md:flex-row md:items-end">
          <div className="max-w-2xl space-y-4">
            <SectionEyebrow>Browse</SectionEyebrow>
            <SectionHeading
              title="Shop by Category."
              subtitle="Selection made simple."
            />
            <p className="max-w-lg text-sm font-medium leading-relaxed text-[#86868b] sm:text-[15px]">
              Explore frames, albums, and photo books — curated collections for every memory.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-3 sm:gap-4">
            <Link
              to="/models"
              className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-white px-4 py-2.5 text-xs font-semibold text-[#1d1d1f] shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700 active:scale-[0.98] sm:text-sm"
            >
              View all
              <ArrowRight size={14} strokeWidth={2} />
            </Link>

            <div className="flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-white p-1 shadow-[0_2px_12px_rgba(0,0,0,0.06)] sm:gap-2 sm:p-1.5">
              <button
                type="button"
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#1d1d1f] transition-all hover:bg-[#1d1d1f] hover:text-white active:scale-95 disabled:pointer-events-none disabled:opacity-30 sm:h-10 sm:w-10"
                aria-label="Previous category"
              >
                <ChevronLeft size={18} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#1d1d1f] transition-all hover:bg-[#1d1d1f] hover:text-white active:scale-95 disabled:pointer-events-none disabled:opacity-30 sm:h-10 sm:w-10"
                aria-label="Next category"
              >
                <ChevronRight size={18} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            className="category-carousel-track no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 [-webkit-overflow-scrolling:touch] sm:gap-5 sm:pb-4"
            style={{ touchAction: "pan-x pinch-zoom" }}
          >
            {categories.map((cat, index) => (
              <motion.div
                key={cat.id || cat.name || index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, margin: "-24px" }}
                className="category-carousel-card group w-[min(78vw,280px)] flex-none snap-start sm:w-[min(52vw,360px)] md:w-[min(44vw,420px)] lg:w-[min(36vw,480px)]"
              >
                <Link
                  to={`/models?category=${encodeURIComponent(cat.name)}`}
                  className="block touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded-[26px]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[26px] border border-black/[0.05] bg-[#1d1d1f] shadow-[0_4px_24px_rgba(0,0,0,0.05)] transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_20px_48px_rgba(0,0,0,0.14)] sm:aspect-[16/10] lg:aspect-[5/3]">
                    <img
                      src={getImageUrl(cat.image)}
                      alt={cat.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                    <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                    <div className="pointer-events-none absolute left-4 top-4 z-20 sm:left-5 sm:top-5">
                      <span className="inline-flex items-center rounded-full border border-white/20 bg-black/25 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur-md sm:px-3 sm:text-[11px]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-end p-4 sm:p-6 lg:p-8">
                      {cat.series && (
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-300/95 sm:text-[11px]">
                          {cat.series}
                        </p>
                      )}
                      <h3 className="line-clamp-2 text-lg font-semibold leading-snug tracking-[-0.02em] text-white drop-shadow-md sm:text-2xl sm:line-clamp-none md:text-[1.75rem] lg:text-3xl">
                        {cat.name}
                      </h3>
                      <div className="mt-3 flex items-center justify-between gap-3 sm:mt-4">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/85 transition-colors group-hover:text-white sm:text-xs">
                          Explore collection
                          <ArrowUpRight
                            size={14}
                            strokeWidth={2.5}
                            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          />
                        </span>
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#1d1d1f] shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white sm:h-11 sm:w-11">
                          <ArrowUpRight size={16} strokeWidth={2.5} className="sm:hidden" />
                          <ArrowUpRight size={18} strokeWidth={2.5} className="hidden sm:block" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            <div className="w-2 flex-none sm:w-4" aria-hidden />
          </div>
        </div>

        {categories.length > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2 sm:mt-8">
            {categories.map((cat, index) => (
              <button
                key={cat.id || cat.name || index}
                type="button"
                onClick={() => scrollToIndex(index)}
                aria-label={`Go to ${cat.name}`}
                aria-current={activeIndex === index ? "true" : undefined}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? "w-8 bg-orange-500"
                    : "w-1.5 bg-[#d2d2d7] hover:bg-[#86868b]"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function Hero() {
  const {
    products,
    heroBanners,
    shopCategories,
    trendingProductIds,
    bestSellerProductIds,
  } = useProducts();

  const [slideIndex, setSlideIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredProducts = useMemo(
    () =>
      products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase().trim()),
      ),
    [products, searchTerm],
  );

  const suggestions = filteredProducts.slice(0, 8);

  const searchContainerRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState({
    left: 0,
    top: 0,
    width: "auto",
  });

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

  const bannerCount = heroBanners.length;
  const currentBanner = heroBanners[slideIndex];

  const goToSlide = useCallback(
    (index) => {
      if (bannerCount === 0) return;
      setSlideIndex(((index % bannerCount) + bannerCount) % bannerCount);
    },
    [bannerCount],
  );

  const nextSlide = useCallback(() => {
    goToSlide(slideIndex + 1);
  }, [goToSlide, slideIndex]);

  const prevSlide = useCallback(() => {
    goToSlide(slideIndex - 1);
  }, [goToSlide, slideIndex]);

  useEffect(() => {
    if (bannerCount <= 1) return;
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % bannerCount);
    }, 6500);
    return () => clearInterval(interval);
  }, [bannerCount]);

  const trendingProducts = useMemo(() => {
    return products
      .filter((p) => isProductInList(getProductId(p), trendingProductIds))
      .slice(0, 12);
  }, [products, trendingProductIds]);

  const bestSellers = useMemo(() => {
    return products
      .filter((p) => isProductInList(getProductId(p), bestSellerProductIds))
      .slice(0, 12);
  }, [products, bestSellerProductIds]);

  return (
    <div className="bg-[#f5f5f7]">
      <div>
        {/* Hero Banner — full width, no side gaps */}
        <section className="relative w-full overflow-hidden pb-4 pt-3 sm:pb-5">
          <div className="group relative w-full">
            <div className="relative min-h-[200px] w-full overflow-hidden rounded-none bg-[#1d1d1f] shadow-[0_8px_24px_rgba(0,0,0,0.06)] sm:min-h-[220px] md:min-h-[240px] lg:min-h-[260px]">
              {bannerCount === 0 ? (
                <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-2.5 px-6 py-8 text-center sm:min-h-[220px] md:min-h-[240px]">
                  <SectionEyebrow>Welcome</SectionEyebrow>
                  <h1 className="max-w-lg text-xl font-semibold tracking-[-0.03em] text-white sm:text-2xl">
                    Discover premium frames & albums
                  </h1>
                  <p className="max-w-md text-xs font-medium text-white/70 sm:text-sm">
                    Browse our curated collection crafted for lasting memories.
                  </p>
                  <Link
                    to="/models"
                    className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#1d1d1f] transition-transform hover:scale-[1.02] active:scale-[0.98] sm:text-sm"
                  >
                    Shop collection
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={slideIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
                      className="absolute inset-0"
                    >
                      <motion.div
                        className="absolute inset-0"
                        initial={{ scale: 1.06 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 6, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <img
                          src={getImageUrl(currentBanner?.image)}
                          alt={currentBanner?.title || "Featured banner"}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/10 sm:bg-gradient-to-r sm:from-black/75 sm:via-black/45 sm:to-black/5" />
                      </motion.div>

                      <div className="relative flex h-full min-h-[200px] items-end px-4 pb-9 pt-6 sm:min-h-[220px] sm:items-center sm:px-6 sm:pb-8 md:min-h-[240px] md:px-8 lg:min-h-[260px]">
                        <motion.div
                          key={`content-${slideIndex}`}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                          className="max-w-md sm:max-w-lg"
                        >
                          <SectionEyebrow onDark>Featured</SectionEyebrow>

                          <h1 className="mt-2 text-[clamp(1.25rem,3.5vw,1.75rem)] font-semibold leading-tight tracking-[-0.03em] text-white drop-shadow-sm">
                            {currentBanner?.title || "The future of style."}
                          </h1>

                          <p className="mt-1.5 max-w-sm text-xs font-medium leading-snug text-white/90 line-clamp-2 drop-shadow-sm sm:text-sm">
                            {currentBanner?.description ||
                              "Experience next-gen premium design."}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-2.5">
                            <Link
                              to="/models"
                              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#1d1d1f] shadow-md transition-all hover:bg-[#f5f5f7] active:scale-[0.98] sm:text-sm"
                            >
                              Shop now
                              <ArrowRight size={14} strokeWidth={2} />
                            </Link>
                            <Link
                              to="/about"
                              className="inline-flex items-center gap-1 rounded-full border border-white/35 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:text-sm"
                            >
                              Learn more
                              <ChevronRight size={14} />
                            </Link>
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {bannerCount > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={prevSlide}
                        className="absolute left-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white opacity-0 backdrop-blur-md transition-all hover:bg-black/40 group-hover:opacity-100 sm:left-3 md:opacity-100"
                        aria-label="Previous slide"
                      >
                        <ChevronLeft size={16} strokeWidth={1.5} />
                      </button>
                      <button
                        type="button"
                        onClick={nextSlide}
                        className="absolute right-2 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white opacity-0 backdrop-blur-md transition-all hover:bg-black/40 group-hover:opacity-100 sm:right-3 md:opacity-100"
                        aria-label="Next slide"
                      >
                        <ChevronRight size={16} strokeWidth={1.5} />
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/20 bg-black/35 px-2 py-1.5 backdrop-blur-md">
                    {heroBanners.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => goToSlide(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        aria-current={idx === slideIndex ? "true" : undefined}
                        className={`relative h-1.5 overflow-hidden rounded-full transition-all duration-300 ${
                          idx === slideIndex
                            ? "w-8 bg-white"
                            : "w-2 bg-white/40 hover:bg-white/70"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        <CategoryCarousel categories={shopCategories} />

        {/* Content area */}
        {searchTerm ? (
          <section className="bg-[#f5f5f7] py-14 sm:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-10 text-center">
                <SectionHeading
                  title={`Search Results${filteredProducts.length > 0 ? ` (${filteredProducts.length})` : ""}`}
                  subtitle="Find exactly what you need."
                  className="mx-auto max-w-xl"
                />
              </div>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product._id || product.id}
                      product={product}
                      whatsappNumber={whatsappNumber}
                      WhatsAppIcon={WhatsAppIcon}
                      getDisplayCategory={getDisplayCategory}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-[28px] border border-black/[0.05] bg-white py-20 text-center shadow-sm">
                  <p className="mb-6 text-lg font-medium text-[#86868b]">
                    No products found.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="rounded-full bg-[#1d1d1f] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-black active:scale-[0.98]"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          </section>
        ) : (
          <>
            <CarouselSection
              title="Trending Now"
              products={trendingProducts}
              whatsappNumber={whatsappNumber}
              WhatsAppIcon={WhatsAppIcon}
              getDisplayCategory={getDisplayCategory}
            />
            <SpecialOffersCarousel />
            <CarouselSection
              title="Best Sellers"
              products={bestSellers}
              whatsappNumber={whatsappNumber}
              WhatsAppIcon={WhatsAppIcon}
              getDisplayCategory={getDisplayCategory}
            />
          </>
        )}
      </div>
    </div>
  );
}
