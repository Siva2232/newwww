import { useEffect, useRef, useState } from "react";
import Container from "../components/common/Container";
import Button from "../components/common/Button";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Camera, Users, Sparkles, ArrowRight } from "lucide-react";

const services = [
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "For Models",
    subtitle: "Build Your Brand. Expand Your Network.",
    features: [
      "Professional Portfolio Development",
      "Exclusive Workshops & Events",
      "Industry Connections",
      "Priority Job Board Access",
    ],
    images: [
      "https://media.gettyimages.com/id/493837244/photo/studio-shot-of-young-beautiful-woman.jpg?s=612x612&w=gi&k=20&c=uV2U9seF0GZoUbmc9Sr9vqx6Q0niUC1eliVGuGaKK8U=",
      "https://www.oxanaalexphotography.com/wp-content/uploads/2023/04/modeling-poses-1.jpg",
    ],
  },
  {
    icon: <Camera className="w-8 h-8" />,
    title: "For Photographers",
    subtitle: "Access Talent. Creative Spaces.",
    features: [
      "Direct Talent Booking",
      "Premium Studio Rental",
      "Professional Equipment Access",
      "Post-Production Support",
      "Collaborative Projects",
    ],
    images: [
      "https://stored-cf.slickpic.com/Mjg1ODI1MDZmMThjNTg,/20211226/MTgzMDE1MTVjOGM1/pn/400/ethereal-beauty-starry-makeup.jpg.webp",
      "https://media.gettyimages.com/id/636160600/photo/studio-shot-of-young-beautiful-woman.jpg?s=612x612&w=gi&k=20&c=mwhPYT2LXuUotou23w8N7vd7EnKJNFsrTz0cALF1RHc=",
    ],
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Brands & Creatives",
    subtitle: "Bring Your Vision to Life.",
    features: [
      "Full Production Services",
      "Custom Casting",
      "Creative Direction",
      "End-to-End Project Management",
    ],
    images: [
      "https://www.shutterstock.com/image-photo/confident-businesswoman-dressed-trendy-office-600nw-2634452557.jpg",
      "https://www.shutterstock.com/image-photo/fashion-model-black-leather-trench-260nw-2646154139.jpg",
    ],
  },
  
];

export default function Services() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.7]);

  return (
    <section className="bg-gray-50 overflow-hidden">
      {/* Hero Banner with Parallax & Layered Animation */}
      <div ref={heroRef} className="relative h-screen max-h-screen">
        {/* Background Image */}
        <motion.div
          style={{ y }}
          className="absolute inset-0"
        >
          <img
            src="https://blog.sigmaphoto.com/wp-content/uploads/2025/07/jillian-lenser-bf-01.jpg"
            alt="Behind the scenes fashion photography studio"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        <Container className="relative h-full flex items-center">
          <div className="max-w-4xl text-white">
            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-6xl md:text-8xl font-black uppercase tracking-tight leading-none"
            >
              Our Services
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="text-2xl md:text-3xl mt-6 text-gray-200 font-light"
            >
              Tailored Support for Every Creative Journey
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-12"
            >
              <a href="/services">
              <Button
                variant="secondary"
                size="lg"
                className="rounded-full px-10 py-6 text-xl font-bold border-2 border-white hover:bg-white hover:text-black transition-all duration-500 shadow-2xl hover:shadow-yellow-500/30"
              >
                DISCOVER TALENT
              </Button>
              </a>
            </motion.div>
          </div>
        </Container>
      </div>

      {/* Services Cards with Staggered Entrance & 3D Hover */}
      <Container className="-mt-32 relative z-10 pb-40">
        <div className="grid md:grid-cols-3 gap-10">
          {services.map((service, index) => {
            const ref = useRef(null);
            const isInView = useInView(ref, { once: true, margin: "-100px" });

            return (
              <motion.div
                key={index}
                ref={ref}
                initial={{ opacity: 0, y: 100 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -16 }}
                className="group"
              >
                <motion.div
                  className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-700"
                  style={{
                    rotateX: useTransform(scrollYProgress, [0, 1], [15, 0]),
                    transformPerspective: 1000,
                  }}
                  whileHover={{ rotateX: 0 }}
                >
                  {/* Header */}
                  <div className="p-10 text-center bg-gradient-to-b from-white to-gray-50">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ delay: index * 0.2 + 0.3, type: "spring", stiffness: 200 }}
                      className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white shadow-xl mb-6"
                    >
                      {service.icon}
                    </motion.div>

                    <h3 className="text-3xl font-black text-gray-900 mb-3">
                      {service.title}
                    </h3>
                    <p className="text-xl text-gray-600 font-medium">
                      {service.subtitle}
                    </p>
                  </div>

                  {/* Images */}
                  <div className="grid grid-cols-2 gap-4 p-8 bg-gray-50">
                    {service.images.map((img, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: index * 0.2 + 0.5 + i * 0.1 }}
                        className="rounded-2xl overflow-hidden shadow-lg aspect-square"
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

                  {/* Features List */}
                  <div className="px-10 pb-10">
                    <ul className="space-y-4">
                      {service.features.map((feature, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -30 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: index * 0.2 + 0.7 + i * 0.1 }}
                          className="text-gray-700 flex items-center text-lg"
                        >
                          <span className="text-yellow-500 mr-3 text-xl">▸</span>
                          {feature}
                        </motion.li>
                      ))}
                    </ul>

                    {/* CTA Button with Pulse */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: index * 0.2 + 1 }}
                      className="mt-10"
                    >
                      <Button
                        variant="primary"
                        className="w-full rounded-full py-5 text-lg font-bold bg-black text-white hover:bg-yellow-500 hover:text-black transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-yellow-500/30 flex items-center justify-center gap-3 group"
                      >
                        EXPLORE PACKAGES
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                        </motion.div>
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}