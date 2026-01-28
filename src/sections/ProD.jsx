import { useState } from "react";
import Container from "../components/common/Container";
import { motion } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";

const categories = ["ALL WORK", "CEREMONY", "PORTRAITS", "RECEPTION", "ENGAGEMENT", "DETAILS"];

const portfolioItems = [
  // High-end wedding images (real examples)
  { id: 1, couple: "Sophie & Tim", location: "Tuscany, Italy", category: "CEREMONY", size: "lg", src: "https://thelane.com/wp-content/uploads/2022/02/Sophie-Tim-Reedit-4-scaled.jpg" },
  { id: 2, couple: "Emma & James", location: "Oheka Castle, NY", category: "PORTRAITS", size: "lg", src: "https://susanstripling.com/wp-content/uploads/2024/01/08-oheka-castle-wedding-nighttime-sunset-wedding-photo-bride-and-groom.jpg" },
  { id: 3, couple: "Isabella & Marco", location: "Paris Engagement", category: "ENGAGEMENT", size: "md", src: "https://jaidynmichele.com/wp-content/uploads/sites/32630/2023/05/BZ7A0337-1024x719.jpg" },
  { id: 4, couple: "Rainy Day Romance", location: "Central Park, NYC", category: "CEREMONY", size: "md", src: "https://susanstripling.com/wp-content/uploads/2023/09/wedding-couple-in-the-rain-central-park-wedding-photography-scaled-e1706900815692.jpg" },
  { id: 5, couple: "Timeless Elegance", location: "Black & White Collection", category: "PORTRAITS", size: "sm", src: "https://whimsical-cdn.wedissimo.com/2025/11/Black-and-White-Wedding-Photos.jpg" },
  { id: 6, couple: "First Dance", location: "Grand Reception", category: "RECEPTION", size: "lg", src: "https://www.printique.com/wp-content/uploads/2019/06/wedding-poses-3.jpg" },
  { id: 7, couple: "Rings & Vows", location: "Intimate Details", category: "DETAILS", size: "sm", src: "https://images.unsplash.com/photo-1606819717116-9d97b2c0de74?w=1200&q=80" },
  { id: 8, couple: "Veiled Moments", location: "Bridal Portrait", category: "PORTRAITS", size: "md", src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80" },
  { id: 9, couple: "Joyful Celebration", location: "Family Moments", category: "RECEPTION", size: "lg", src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80" },
  { id: 10, couple: "Golden Hour Kiss", location: "Sunset Portraits", category: "PORTRAITS", size: "md", src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80" },
  // Add more as needed...
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("ALL WORK");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = portfolioItems.filter((item) => {
    const matchesCategory = activeCategory === "ALL WORK" || item.category === activeCategory;
    const matchesSearch = item.couple.toLowerCase().includes(searchQuery.toLowerCase()) || item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://thelane.com/wp-content/uploads/2022/02/Sophie-Tim-Reedit-4-scaled.jpg"
          alt="Timeless wedding moment"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

        <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="text-6xl md:text-8xl font-black uppercase tracking-tight mb-8"
          >
            Timeless Wedding Stories
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-xl md:text-3xl font-light text-gray-200"
          >
            Capturing love, emotion, and once-in-a-lifetime moments with artistry and heart.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-6xl font-black text-yellow-500">250+</motion.div>
            <p className="mt-4 text-xl text-gray-700">Weddings Captured</p>
          </div>
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-6xl font-black text-yellow-500">10+</motion.div>
            <p className="mt-4 text-xl text-gray-700">Years of Excellence</p>
          </div>
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-6xl font-black text-yellow-500">100%</motion.div>
            <p className="mt-4 text-xl text-gray-700">Client Satisfaction</p>
          </div>
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-6xl font-black text-yellow-500">50+</motion.div>
            <p className="mt-4 text-xl text-gray-700">Destinations Worldwide</p>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-24 md:py-32 bg-white">
        <Container className="px-6">
          <div className="text-center mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black mb-6"
            >
              OUR WEDDING PORTFOLIO
            </motion.h2>
            <p className="text-xl text-gray-600">Curated moments from love stories around the world</p>
          </div>

          {/* Filters + Search */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
            <div className="flex flex-wrap justify-center gap-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative text-lg font-medium pb-2 transition ${activeCategory === cat ? "text-black" : "text-gray-500 hover:text-black"}`}
                >
                  {cat}
                  {activeCategory === cat && (
                    <motion.div layoutId="weddingTab" className="absolute left-0 right-0 bottom-0 h-0.5 bg-yellow-500" />
                  )}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search couples or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-4 rounded-full border border-gray-300 focus:border-yellow-500 focus:outline-none transition"
              />
              {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2"><X size={20} /></button>}
            </div>
          </div>

          {/* Masonry Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[250px] md:auto-rows-[320px]">
            {filteredItems.map((item, i) => {
              const rowSpan = item.size === "lg" ? "row-span-2" : "row-span-1";
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -10 }}
                  className={`group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all ${rowSpan}`}
                >
                  <img src={item.src} alt={item.couple} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-yellow-400 text-sm tracking-wider">{item.location}</p>
                    <h3 className="text-2xl md:text-3xl font-black">{item.couple}</h3>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-20">
            <button className="bg-yellow-500 text-black px-16 py-6 rounded-full text-xl font-bold hover:bg-yellow-400 hover:scale-105 transition shadow-2xl">
              VIEW ALL GALLERIES <ArrowRight className="inline ml-2" />
            </button>
          </div>
        </Container>
      </section>
    </div>
  );
}