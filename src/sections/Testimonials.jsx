import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Star, Sparkles, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Container from "../components/common/Container";
import testimonialsData from "../data/testimonials";

const testimonials = testimonialsData.map((t, i) => ({
  ...t,
  id: t.id ?? i + 1,
  content: t.feedback || t.content,
  rating: t.rating ?? 5,
  avatar: t.avatar || `https://i.pravatar.cc/150?u=${i + 20}`,
}));

function StarRating({ rating = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < rating ? "fill-orange-400 text-orange-400" : "text-[#d2d2d7]"
          }
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScroll();
    el.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);
    return () => {
      el.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, [updateScroll]);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector(".testimonial-card");
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.85;
    el.scrollBy({
      left: dir === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  return (
    <section className="overflow-hidden bg-[#f5f5f7] py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="mb-10 flex flex-col gap-6 sm:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/90 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-orange-700">
              <Sparkles size={12} aria-hidden />
              Community voices
            </div>
            <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f]">
              Hear what our members
              <span className="block text-[#86868b]">have to say</span>
            </h2>
          </div>

          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-black/[0.06] bg-white text-[#1d1d1f] shadow-sm transition-all hover:bg-[#1d1d1f] hover:text-white active:scale-95 disabled:opacity-35"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-black/[0.06] bg-white text-[#1d1d1f] shadow-sm transition-all hover:bg-[#1d1d1f] hover:text-white active:scale-95 disabled:opacity-35"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </Container>

      <div
        ref={scrollRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-2 [-webkit-overflow-scrolling:touch] sm:gap-6 sm:px-6 lg:px-8"
        style={{ touchAction: "pan-x pinch-zoom" }}
      >
        {testimonials.map((t, index) => (
          <motion.article
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
            className="testimonial-card w-[min(88vw,380px)] flex-none snap-start sm:w-[360px] md:w-[400px]"
          >
            <div className="flex h-full flex-col rounded-[24px] border border-black/[0.05] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)] sm:p-8">
              <div className="mb-5 flex items-start justify-between">
                <StarRating rating={t.rating} />
                <Quote
                  size={32}
                  className="text-orange-200"
                  strokeWidth={1.25}
                  aria-hidden
                />
              </div>

              <p className="mb-8 flex-1 text-base font-medium leading-relaxed text-[#6e6e73] sm:text-lg">
                &ldquo;{t.content}&rdquo;
              </p>

              <div className="flex items-center gap-4 border-t border-black/[0.04] pt-5">
                <img
                  src={t.avatar}
                  alt=""
                  className="h-12 w-12 rounded-full bg-[#f5f5f7] object-cover ring-2 ring-[#f5f5f7]"
                  loading="lazy"
                />
                <div>
                  <p className="font-semibold text-[#1d1d1f]">{t.name}</p>
                  <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#86868b]">
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
        <div className="w-4 flex-none sm:w-6" aria-hidden />
      </div>
    </section>
  );
}
