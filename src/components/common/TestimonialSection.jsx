import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Quote, Sparkles, ArrowRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Arjun Mehta",
    role: "Photographer",
    content:
      "The print quality is beyond words. The colors are exactly as I saw them. Truly premium.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=1",
  },
  {
    id: 2,
    name: "Sarah Khan",
    role: "Parent",
    content:
      "Made a memory book for my daughter. The interface was so easy and delivery was fast!",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=2",
  },
  {
    id: 3,
    name: "Vikram Singh",
    role: "Traveler",
    content:
      "Superior binding. My travel book feels like a high-end coffee table book. Worth every ₹.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=3",
  },
  {
    id: 4,
    name: "Priya Das",
    role: "Designer",
    content:
      "The matte finish paper is incredible. Highly recommend for professional portfolios.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=4",
  },
  {
    id: 5,
    name: "Amit Verma",
    role: "Gifting",
    content:
      "Gifted an anniversary book to my parents. They were in tears. Excellent quality!",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=5",
  },
  {
    id: 6,
    name: "Sneha Rao",
    role: "Artist",
    content:
      "Finally found a place that respects color profiles. Perfect for my art prints.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=6",
  },
  {
    id: 7,
    name: "Rohan J.",
    role: "Creator",
    content:
      "Best experience in the market. Ordering took less than 5 minutes. Super sleek.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=7",
  },
  {
    id: 8,
    name: "Anjali M.",
    role: "Student",
    content:
      "Affordable and high quality. Perfect for my graduation memories!",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=8",
  },
  {
    id: 9,
    name: "David L.",
    role: "Happy Customer",
    content:
      "Absolutely wonderful experience! The book is a treasure for a lifetime.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=9",
  },
  {
    id: 10,
    name: "Meera P.",
    role: "Happy Customer",
    content:
      "The quality is unmatched. Frames and albums both look stunning in person.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=10",
  },
];

const extendedList = [
  ...testimonials,
  ...testimonials.map((t, i) => ({ ...t, id: `dup-${i}` })),
];

function StarRating({ rating = 5 }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={13}
          className={
            i < rating
              ? "fill-orange-400 text-orange-400"
              : "text-[#d2d2d7]"
          }
        />
      ))}
    </div>
  );
}

function TestimonialCard({ t }) {
  return (
    <article className="group flex w-[300px] shrink-0 flex-col rounded-[22px] border border-black/[0.05] bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] sm:w-[340px] sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <StarRating rating={t.rating} />
        <Quote
          size={28}
          className="shrink-0 text-orange-200/90"
          strokeWidth={1.25}
          aria-hidden
        />
      </div>
      <p className="mb-6 flex-1 text-sm font-medium leading-relaxed text-[#6e6e73] sm:text-[15px]">
        &ldquo;{t.content}&rdquo;
      </p>
      <div className="flex items-center gap-3 border-t border-black/[0.04] pt-4">
        <img
          src={t.avatar}
          alt=""
          className="h-11 w-11 shrink-0 rounded-full bg-[#f5f5f7] object-cover ring-2 ring-white"
          loading="lazy"
        />
        <div className="min-w-0">
          <h4 className="truncate text-sm font-semibold text-[#1d1d1f]">
            {t.name}
          </h4>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#86868b]">
            {t.role}
          </p>
        </div>
      </div>
    </article>
  );
}

function MarqueeRow({ items, direction = "left", speed = 45 }) {
  const track = [...items, ...items];

  return (
    <div className="marquee-row group/row flex overflow-hidden py-3 select-none">
      <motion.div
        className="marquee-track flex w-max gap-4 sm:gap-5"
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
      >
        {track.map((t, i) => (
          <TestimonialCard key={`${t.id}-${i}`} t={t} />
        ))}
      </motion.div>
    </div>
  );
}

export default function TestimonialSection() {
  const row1 = extendedList.slice(0, 10);
  const row2 = extendedList.slice(5, 15);

  return (
    <section className="overflow-hidden bg-[#f5f5f7] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto mb-12 max-w-3xl px-4 text-center sm:mb-14 sm:px-6 lg:px-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/90 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-orange-700">
          <Sparkles size={12} aria-hidden />
          2,000+ happy customers
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-[#1d1d1f]"
        >
          What the community
          <span className="block text-[#86868b]">is saying about us</span>
        </motion.h2>
      </div>

      <div className="relative">
        <MarqueeRow items={row1} direction="left" speed={38} />
        <MarqueeRow items={row2} direction="right" speed={42} />

        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#f5f5f7] to-transparent sm:w-24"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#f5f5f7] to-transparent sm:w-24"
          aria-hidden
        />
      </div>

      <div className="mt-12 flex justify-center px-4 sm:mt-14">
        <Link
          to="/models"
          className="inline-flex items-center gap-2 rounded-full bg-[#1d1d1f] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-black active:scale-[0.98]"
        >
          Start your story
          <ArrowRight size={16} strokeWidth={2} />
        </Link>
      </div>
    </section>
  );
}
