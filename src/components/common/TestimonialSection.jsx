import React from "react";
import { motion } from "framer-motion";
import { Star, Quote, Heart } from "lucide-react";

// 20+ Testimonials Data
const testimonials = [
  { id: 1, name: "Arjun Mehta", role: "Photographer", content: "The print quality is beyond words. The colors are exactly as I saw them. Truly premium.", rating: 5, avatar: "https://i.pravatar.cc/150?u=1" },
  { id: 2, name: "Sarah Khan", role: "Parent", content: "Made a memory book for my daughter. The interface was so easy and delivery was fast!", rating: 5, avatar: "https://i.pravatar.cc/150?u=2" },
  { id: 3, name: "Vikram Singh", role: "Traveler", content: "Superior binding. My travel book feels like a high-end coffee table book. Worth every ₹.", rating: 5, avatar: "https://i.pravatar.cc/150?u=3" },
  { id: 4, name: "Priya Das", role: "Designer", content: "The matte finish paper is incredible. Highly recommend for professional portfolios.", rating: 5, avatar: "https://i.pravatar.cc/150?u=4" },
  { id: 5, name: "Amit Verma", role: "Gifting", content: "Gifted an anniversary book to my parents. They were in tears. Excellent quality!", rating: 5, avatar: "https://i.pravatar.cc/150?u=5" },
  { id: 6, name: "Sneha Rao", role: "Artist", content: "Finally found a place that respects color profiles. Perfect for my art prints.", rating: 5, avatar: "https://i.pravatar.cc/150?u=6" },
  { id: 7, name: "Rohan J.", role: "Influencer", content: "Best UI in the market. Ordering took less than 5 minutes. Super sleek.", rating: 5, avatar: "https://i.pravatar.cc/150?u=7" },
  { id: 8, name: "Anjali M.", role: "Student", content: "Affordable and high quality. Perfect for my graduation memories!", rating: 5, avatar: "https://i.pravatar.cc/150?u=8" },
  // Adding duplicates for loop logic
].concat(Array.from({ length: 12 }, (_, i) => ({
    id: i + 9,
    name: `User ${i + 9}`,
    role: "Happy Customer",
    content: "Absolutely wonderful experience! The book is a treasure for a lifetime. The quality is unmatched.",
    rating: 5,
    avatar: `https://i.pravatar.cc/150?u=${i + 9}`
})));

const MarqueeRow = ({ items, direction = "left", speed = 40 }) => {
  const moveX = direction === "left" ? [0, -1035] : [-1035, 0];

  return (
    <div className="flex overflow-hidden py-4 select-none">
      <motion.div
        animate={{ x: moveX }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        className="flex flex-nowrap gap-6"
      >
        {/* Render twice for seamless loop */}
        {[...items, ...items].map((t, i) => (
          <div
            key={i}
            className="w-[320px] sm:w-[380px] flex-shrink-0 bg-white p-6 rounded-[28px] border border-zinc-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex gap-0.5 mb-4">
              {[...Array(t.rating)].map((_, i) => (
                <Star key={i} size={12} className="fill-orange-400 text-orange-400" />
              ))}
            </div>
            <p className="text-zinc-600 text-sm leading-relaxed font-medium mb-6">
              "{t.content}"
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-zinc-50">
              <img src={t.avatar} className="w-10 h-10 rounded-full bg-zinc-100" alt="" />
              <div>
                <h4 className="text-xs font-bold text-zinc-900">{t.name}</h4>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default function TestimonialSection() {
  const row1 = testimonials.slice(0, 10);
  const row2 = testimonials.slice(10, 20);

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-6">
          <Heart size={12} className="text-red-500 fill-red-500" /> 2,000+ Happy Customers
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight">
          What the community <br />is saying about us
        </h2>
      </div>

      <div className="relative group">
        {/* Row 1 */}
        <MarqueeRow items={row1} direction="left" speed={30} />
        
        {/* Row 2 */}
        <MarqueeRow items={row2} direction="right" speed={35} />

        {/* Gradient Fades for Smoothness */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      </div>

      <div className="mt-16 text-center">
        <button className="px-8 py-3 bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg shadow-black/10">
          Create Your Own Story
        </button>
      </div>
    </section>
  );
}