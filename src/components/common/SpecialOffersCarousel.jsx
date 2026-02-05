// src/components/SpecialOffersCarousel.jsx
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Timer, ArrowRight, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

const SpecialOffersCarousel = ({ specialOffers = [] }) => {
  const scrollRef = useRef(null);
  const animationRef = useRef(null);
  const pausedRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // If loading, show spinner
  if (loading) {
    return (
      <section className="relative w-full bg-[#f5f5f7] py-14 sm:py-16 md:py-24 overflow-hidden flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-12 h-12 animate-spin text-orange-600" />
      </section>
    );
  }

  // If error or no data → hide section
  if (error || !specialOffers?.length) {
    return null;
  }

  const duplicatedOffers = specialOffers.length > 1
    ? [...specialOffers, ...specialOffers, ...specialOffers]
    : [...specialOffers];

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
  }, [specialOffers]);

  const manualScroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    pausedRef.current = true;
    const approximateCardWidth = container.offsetWidth * 0.75;
    const scrollAmount = direction === "left" ? -approximateCardWidth : approximateCardWidth;
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

export default SpecialOffersCarousel;