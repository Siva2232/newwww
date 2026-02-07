import { useState, useEffect, useRef } from "react";
import Container from "../components/common/Container";
import Button from "../components/common/Button";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
} from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Camera,
  Sparkles,
  Clock,
  Users,
  Star,
} from "lucide-react";

const portfolioImages = [
  {
    src: "https://thelane.com/wp-content/uploads/2022/02/Sophie-Tim-Reedit-4-scaled.jpg",
    title: "Eternal Vows",
    subtitle: "Italy · 2024",
  },
  {
    src: "https://www.printique.com/wp-content/uploads/2019/06/wedding-poses-3.jpg",
    title: "Golden Hour",
    subtitle: "California · 2023",
  },
  {
    src: "https://jaidynmichele.com/wp-content/uploads/sites/32630/2023/05/BZ7A0337-1024x719.jpg",
    title: "Timeless Romance",
    subtitle: "Paris · 2024",
  },
  {
    src: "https://whimsical-cdn.wedissimo.com/2025/11/Black-and-White-Wedding-Photos.jpg",
    title: "Classic Elegance",
    subtitle: "B&W Collection",
  },
  {
    src: "https://susanstripling.com/wp-content/uploads/2024/01/08-oheka-castle-wedding-nighttime-sunset-wedding-photo-bride-and-groom.jpg",
    title: "Sunset Dreams",
    subtitle: "Oheka Castle",
  },
  {
    src: "https://susanstripling.com/wp-content/uploads/2023/09/wedding-couple-in-the-rain-central-park-wedding-photography-scaled-e1706900815692.jpg",
    title: "Rain & Romance",
    subtitle: "Central Park",
  },
];

const duplicatedImages = [
  ...portfolioImages,
  ...portfolioImages,
  ...portfolioImages,
];

export default function HomeAboutSection() {
  const constraintsRef = useRef(null);
  const x = useMotionValue(0);
  const controls = useAnimation();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) {
      controls.stop();
    } else {
      controls.start({
        x: -100 * portfolioImages.length + "%",
        transition: {
          duration: 60,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        },
      });
    }
  }, [isHovered, controls]);

  return (
    <>
      <section className="py-20 md:py-32 bg-zinc-50">
        <Container className="px-6">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-sm md:text-base tracking-widest uppercase text-orange-600 font-bold mb-4">
                Who We Are
              </p>
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight">
                About <span className="text-zinc-900">Us</span>
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-8 text-lg md:text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto"
            >
              We are a boutique wedding photography studio passionate about
              turning your most cherished day into timeless art. With an eye for
              authentic emotion, natural beauty, and cinematic storytelling, we
              craft images that don't just document your wedding — they preserve
              the feeling of it forever.
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mt-20">
              {[
                {
                  icon: Heart,
                  title: "Emotion-Driven",
                  desc: "We capture genuine joy, quiet tears, and stolen glances — the heart of your love story.",
                },
                {
                  icon: Camera,
                  title: "Cinematic Craft",
                  desc: "Film-inspired aesthetics with masterful lighting and thoughtful composition in every frame.",
                },
                {
                  icon: Sparkles,
                  title: "Timeless Elegance",
                  desc: "A signature style that feels classic today and iconic in 50 years.",
                },
                {
                  icon: Clock,
                  title: "Limited Bookings",
                  desc: "Only 20 weddings per year — ensuring every couple gets our full creativity and care.",
                },
                {
                  icon: Users,
                  title: "Personal Experience",
                  desc: "From planning to delivery, we guide you with warmth, clarity, and attention to detail.",
                },
                {
                  icon: Star,
                  title: "Heirloom Quality",
                  desc: "Fine art albums and prints designed to be cherished and passed down through generations.",
                },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="bg-white rounded-3xl p-8 shadow-md border border-zinc-100 hover:shadow-2xl hover:border-orange-100 transition-all duration-400 group"
                  >
                    <div className="flex justify-center mb-6">
                      <div className="p-4 rounded-full bg-zinc-50 group-hover:bg-orange-50 transition-colors">
                        <Icon className="w-8 h-8 text-zinc-900 group-hover:text-orange-600 transition-colors" />
                      </div>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-base">
                      {item.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-20"
            >
              <a href="/about">
                <Button className="bg-zinc-900 text-white px-12 py-5 rounded-full text-lg font-bold hover:bg-orange-600 hover:scale-105 transition shadow-lg">
                  Learn More About Our Approach
                </Button>
              </a>
              <p className="mt-12 text-gray-500 text-sm md:text-base italic">
                Proudly crafting unforgettable wedding memories with heart and
                artistry since 2018
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      <section className="py-32 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/70 pointer-events-none z-10" />

        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20 relative z-20"
          >
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
              Moments That <span className="text-gray-500">Last Forever</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto font-light">
              Experience the emotion, artistry, and timeless beauty of our craft
            </p>
          </motion.div>

          {/* Premium Parallax Carousel */}
          <div
            ref={constraintsRef}
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.div
              drag="x"
              dragConstraints={constraintsRef}
              dragElastic={0.1}
              animate={controls}
              style={{ x }}
              className="flex cursor-grab active:cursor-grabbing select-none"
            >
              {duplicatedImages.map((image, index) => (
                <motion.div
                  key={index}
                  className="w-full md:w-1/3 flex-shrink-0 px-6"
                  whileHover={{ scale: 1.02 }}
                  style={{
                    perspective: 1000,
                  }}
                >
                  <motion.div
                    className="relative group rounded-3xl overflow-hidden shadow-2xl h-96 md:h-[560px]"
                    whileHover={{ rotateY: 4, rotateX: 4 }}
                    transition={{ duration: 0.6 }}
                  >
                    <img
                      src={image.src}
                      alt={image.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      loading="lazy"
                    />

                    {/* Dynamic Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                      initial={{ opacity: 0.6 }}
                      whileHover={{ opacity: 0.9 }}
                      transition={{ duration: 0.6 }}
                    />

                    {/* Text Reveal */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 p-10 text-left"
                      initial={{ y: 60, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: false }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                    >
                      <h3 className="text-3xl md:text-4xl font-black text-white mb-2">
                        {image.title}
                      </h3>
                      <p className="text-orange-500 text-lg tracking-wide font-medium">
                        {image.subtitle}
                      </p>
                      <motion.div
                        className="mt-4 w-20 h-1 bg-orange-600 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: 80 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="text-center mt-20 relative z-20">
            <a href="/models">
              <Button className="bg-white text-black px-20 py-7 rounded-full text-2xl font-black hover:scale-105 hover:bg-orange-600 hover:text-white transition-all duration-500 shadow-2xl">
                Explore Complete Galleries
              </Button>
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
