import { useRef } from "react";
import Container from "../components/common/Container";
import Button from "../components/common/Button";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { BookOpen, Layers, Printer, ArrowRight } from "lucide-react";

const services = [
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "Wedding Album Printing",
    subtitle: "Turn Your Big Day Into a Timeless Masterpiece.",
    features: [
      "Fujifilm Revoria 2100 LED printing",
      "Glossy & Matte premium finishes",
      "Ultra-high resolution color accuracy",
      "Fade-resistant, long-lasting prints",
      "Custom album styles for every wedding",
    ],
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
      "https://images.unsplash.com/photo-1465495976277-798e36452305?w=600&q=80",
    ],
    ctaLabel: "EXPLORE WEDDING ALBUMS",
    ctaLink: "/models",
  },
  {
    icon: <Layers className="w-8 h-8" />,
    title: "Custom Photo Books",
    subtitle: "Preserve Family Memories With Museum-Grade Quality.",
    features: [
      "Personalized layouts & album styles",
      "Silk, pearl, matte & textured papers",
      "Smooth gradients & vivid lifelike tones",
      "Fingerprint-resistant matte options",
      "Start from custom book templates",
    ],
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80",
    ],
    ctaLabel: "START YOUR CUSTOM BOOK",
    ctaLink: "/custom-book",
  },
  {
    icon: <Printer className="w-8 h-8" />,
    title: "Professional & Bulk Printing",
    subtitle: "High-Speed Production Without Compromising Quality.",
    features: [
      "Portfolio & studio album printing",
      "Bulk wedding & event album orders",
      "Consistent color across every page",
      "Multiple premium media compatibility",
      "Custom paper types, finishes & styles",
    ],
    images: [
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&q=80",
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80",
    ],
    ctaLabel: "GET A QUOTE",
    ctaLink: "/contact",
  },
];

function ServiceCard({ service, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      whileHover={{ y: -16 }}
      className="group"
    >
      <div className="bg-zinc-50 rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-700 border border-zinc-100">
        <div className="p-10 text-center bg-white border-b border-zinc-100">
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{
              delay: index * 0.2 + 0.3,
              type: "spring",
              stiffness: 200,
            }}
            className="w-20 h-20 mx-auto rounded-full bg-zinc-900 flex items-center justify-center text-white shadow-xl mb-6 group-hover:bg-orange-600 transition-colors duration-500"
          >
            {service.icon}
          </motion.div>

          <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">
            {service.title}
          </h3>
          <p className="text-xl text-gray-500 font-medium">
            {service.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 p-8 bg-zinc-50/50">
          {service.images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.2 + 0.5 + i * 0.1 }}
              className="rounded-2xl overflow-hidden shadow-sm aspect-square grayscale group-hover:grayscale-0 transition-all duration-700"
              whileHover={{ scale: 1.08 }}
            >
              <img
                src={img}
                alt={`${service.title} example ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </motion.div>
          ))}
        </div>

        <div className="px-10 pb-10 bg-zinc-50/50">
          <ul className="space-y-4">
            {service.features.map((feature, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.2 + 0.7 + i * 0.1 }}
                className="text-gray-600 flex items-center text-base font-medium"
              >
                <span className="text-orange-600 mr-3 text-xl">▸</span>
                {feature}
              </motion.li>
            ))}
          </ul>

          <div className="mt-10">
            <a href={service.ctaLink}>
              <Button
                variant="primary"
                className="w-full rounded-2xl py-5 text-lg font-bold bg-zinc-900 text-white hover:bg-orange-600 transition-all duration-500 shadow-xl flex items-center justify-center gap-3 group"
              >
                {service.ctaLabel}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <section className="bg-white overflow-hidden">
      <div ref={heroRef} className="relative h-screen max-h-screen">
        <motion.div style={{ y }} className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1600&q=80"
            alt="Premium photo album printing at Perfect Digital"
            className="w-full h-full object-cover grayscale brightness-75 contrast-125"
          />
        </motion.div>

        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        <Container className="relative h-full flex items-center">
          <div className="max-w-4xl text-white">
            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none"
            >
              Our Services
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="text-2xl md:text-3xl mt-6 text-gray-200 font-light"
            >
              Premium Photo Album Printing Powered by Revoria Technology
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-12"
            >
              <a href="/models">
                <Button
                  variant="secondary"
                  size="lg"
                  className="rounded-full px-10 py-6 text-xl font-bold border-2 border-white hover:bg-white hover:text-black transition-all duration-500 shadow-2xl"
                >
                  SHOP ALBUMS
                </Button>
              </a>
            </motion.div>
          </div>
        </Container>
      </div>

      <Container className="-mt-32 relative z-10 pb-40">
        <div className="grid md:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
