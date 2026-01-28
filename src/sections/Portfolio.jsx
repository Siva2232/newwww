import { useState } from "react";
import Container from "../components/common/Container";
import { motion } from "framer-motion";

const categories = ["ALL WORK", "CEREMONY", "PORTRAITS", "RECEPTION", "ENGAGEMENT", "DETAILS"];

const portfolioItems = [
  // Large hero images (wedding highlights)
  { id: 1, title: "Sophie & Tim", subtitle: "Tuscany, Italy", category: "CEREMONY", size: "lg", type: "image", src: "https://thelane.com/wp-content/uploads/2022/02/Sophie-Tim-Reedit-4-scaled.jpg" },
  { id: 2, title: "Emma & James", subtitle: "Golden Hour Vows", category: "PORTRAITS", size: "lg", type: "image", src: "https://susanstripling.com/wp-content/uploads/2024/01/08-oheka-castle-wedding-nighttime-sunset-wedding-photo-bride-and-groom.jpg" },
  
  // Video highlight reel
  { id: 3, title: "Love in Motion", subtitle: "2024 Highlight Film", category: "RECEPTION", size: "lg", type: "video", videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4" },

  // Medium & small images
  { id: 4, title: "Isabella & Marco", subtitle: "Paris Engagement", category: "ENGAGEMENT", size: "md", type: "image", src: "https://jaidynmichele.com/wp-content/uploads/sites/32630/2023/05/BZ7A0337-1024x719.jpg" },
  { id: 5, title: "Rain-Kissed Romance", subtitle: "Central Park", category: "CEREMONY", size: "md", type: "image", src: "https://susanstripling.com/wp-content/uploads/2023/09/wedding-couple-in-the-rain-central-park-wedding-photography-scaled-e1706900815692.jpg" },
  { id: 6, title: "Black & White Elegance", subtitle: "Timeless Moments", category: "PORTRAITS", size: "sm", type: "image", src: "https://whimsical-cdn.wedissimo.com/2025/11/Black-and-White-Wedding-Photos.jpg" },
  { id: 7, title: "First Dance Magic", subtitle: "Grand Ballroom", category: "RECEPTION", size: "md", type: "image", src: "https://www.printique.com/wp-content/uploads/2019/06/wedding-poses-3.jpg" },
  { id: 8, title: "Rings & Roses", subtitle: "Detail Focus", category: "DETAILS", size: "sm", type: "image", src: "https://images.unsplash.com/photo-1606819717116-9d97b2c0de74?w=800&q=80" },
  { id: 9, title: "Veiled Beauty", subtitle: "Bridal Portrait", category: "PORTRAITS", size: "md", type: "image", src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80" },
  { id: 10, title: "Joyful Tears", subtitle: "Family Moment", category: "CEREMONY", size: "sm", type: "image", src: "https://images.unsplash.com/photo-1537632858291-4d0374c1e9ac?w=800&q=80" },
  { id: 11, title: "Champagne Toast", subtitle: "Reception Celebration", category: "RECEPTION", size: "lg", type: "image", src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80" },
  { id: 12, title: "Sunset Embrace", subtitle: "Golden Hour", category: "PORTRAITS", size: "md", type: "image", src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80" },
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("ALL WORK");

  const filteredItems =
    activeCategory === "ALL WORK"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeCategory);

  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden">
      <Container className="px-6 md:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-5xl mx-auto mb-20 md:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 121, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <p className="text-sm md:text-base tracking-widest uppercase text-yellow-600 font-medium mb-4">
              Timeless Love Stories
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 leading-none">
              OUR WEDDING <span className="text-yellow-500">PORTFOLIO</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 1 }}
            className="mt-8 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light"
          >
            Every love story is beautiful. We preserve yours with artistry, emotion, and timeless elegance.
          </motion.p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-20 border-b border-gray-200 pb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className="relative text-base md:text-lg font-semibold tracking-wider text-gray-600 hover:text-black transition-all duration-500 pb-3"
            >
              {category}
              {activeCategory === category && (
                <motion.div
                  layoutId="weddingActiveTab"
                  className="absolute left-0 right-0 bottom-0 h-1 bg-yellow-500 rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Masonry Grid with Mixed Media */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[220px] md:auto-rows-[300px] lg:auto-rows-[340px]">
          {filteredItems.map((item, index) => {
            const rowSpan = item.size === "lg" ? "row-span-2" : "row-span-1";

            return (
              <motion.div
                key={`${item.id}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.8, ease: "easeOut" }}
                whileHover={{ y: -12, scale: 1.02 }}
                className={`group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-700 ${rowSpan}`}
              >
                {item.type === "video" ? (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    <iframe
                      src={item.videoUrl}
                      title={item.title}
                      className="w-full h-full object-cover"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    loading="lazy"
                  />
                )}

                {/* Elegant Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Text Reveal */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700"
                  initial={false}
                >
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-black leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-yellow-400 text-sm md:text-base tracking-wide font-medium mt-1">
                    {item.subtitle}
                  </p>
                  <motion.div
                    className="mt-4 w-16 h-0.5 bg-yellow-400 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: 64 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                  />
                </motion.div>

                {/* Subtle Glow Border */}
                <motion.div
                  className="absolute inset-0 rounded-3xl border-4 border-transparent group-hover:border-yellow-400/30 pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-24 md:mt-32"
        >
          <a href="/portfolio">
            <button className="inline-flex items-center gap-4 bg-yellow-500 text-black px-12 py-6 rounded-full text-xl font-black hover:bg-yellow-400 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/40 transition-all duration-500">
              VIEW FULL GALLERIES
              <span className="text-2xl">→</span>
            </button>
          </a>
        </motion.div>
      </Container>
    </section>
  );
}