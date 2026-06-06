import Container from "../components/common/Container";
import Button from "../components/common/Button";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Sparkles,
  BookOpen,
  Zap,
  Palette,
  Layers,
  Star,
  Cpu,
} from "lucide-react";

const WHATSAPP = "9746683778";

const revoriaReasons = [
  "It was among the first LED-based production presses introduced in India",
  "It delivers ultra-high resolution prints",
  "It ensures consistent color accuracy across every album page",
  "It offers fast production with premium finishing",
  "It supports multiple media types for versatile album creation",
];

const revoriaFeatures = [
  {
    icon: <Zap size={40} className="md:w-[52px] md:h-[52px]" />,
    title: "LED Print Technology",
    desc: "Unlike traditional laser systems, LED technology delivers sharper images and precise light control, producing extremely detailed prints.",
  },
  {
    icon: <Cpu size={40} className="md:w-[52px] md:h-[52px]" />,
    title: "High-Resolution Output",
    desc: "Crystal-clear images ensure photographs retain their natural colors and textures on every page.",
  },
  {
    icon: <Palette size={40} className="md:w-[52px] md:h-[52px]" />,
    title: "Color Consistency",
    desc: "Every page maintains uniform color balance, ensuring the entire album looks seamless and professional.",
  },
  {
    icon: <Sparkles size={40} className="md:w-[52px] md:h-[52px]" />,
    title: "Advanced Toner Technology",
    desc: "Super fine toner particles create smooth gradients and rich tones that make photographs vivid and lifelike.",
  },
  {
    icon: <Star size={40} className="md:w-[52px] md:h-[52px]" />,
    title: "Glossy Finish",
    desc: "Brilliant shine, enhanced color depth, and high contrast — perfect for wedding albums and vibrant photography.",
  },
  {
    icon: <Layers size={40} className="md:w-[52px] md:h-[52px]" />,
    title: "Matte Finish",
    desc: "Elegant non-reflective surfaces with soft tones and fingerprint-resistant appeal — ideal for artistic presentations.",
  },
];

const mediaOptions = [
  { name: "High Gloss Photo Paper", img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&q=80" },
  { name: "Silk / Luster Photo Paper", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80" },
  { name: "Matte Art Paper", img: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&q=80" },
  { name: "Textured Fine Art Paper", img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80" },
  { name: "Heavyweight Premium Cardstock", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80" },
  { name: "Pearl Finish Paper", img: "https://images.unsplash.com/photo-1497633762303-f102a199e9bb?w=600&q=80" },
];

const faqs = [
  {
    title: "Why did Perfect Digital choose the Revoria 2100?",
    desc: "Because it was among the first LED-based production presses introduced in India, delivering unmatched image clarity, color precision, and high-speed album printing.",
  },
  {
    title: "What makes Revoria prints different?",
    desc: "Revoria technology produces sharper images, smoother gradients, and richer colors, ensuring every photograph looks vibrant and professional.",
  },
  {
    title: "What finishing options are available?",
    desc: "We provide Glossy and Matte finishing, each offering a unique visual appeal depending on the album style.",
  },
  {
    title: "How many media types are supported?",
    desc: "The machine supports multiple premium media types, including glossy, matte, textured, silk, pearl, and heavyweight cardstock.",
  },
  {
    title: "Suitable for professional wedding albums?",
    desc: "Absolutely. Revoria prints are ideal for high-end wedding albums, offering exceptional color accuracy and durability.",
  },
  {
    title: "Are the prints long-lasting?",
    desc: "Yes. Revoria toner technology ensures long-lasting, fade-resistant prints that preserve memories for years.",
  },
  {
    title: "Can you handle bulk album printing?",
    desc: "Yes. With high-speed production capabilities, we efficiently handle large volume printing without compromising quality.",
  },
  {
    title: "Is customization available?",
    desc: "Yes. We provide custom paper types, finishes, and album styles tailored to client needs.",
  },
];

export default function About() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center mt-5">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1600&q=80')",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/40" />
        <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('https://assets.codepen.io/605876/noise.png')] pointer-events-none" />

        <Container className="relative z-10 px-6 text-center">
          <div className="max-w-6xl mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mb-4 md:mb-8 text-xs md:text-base tracking-[0.5em] uppercase text-[#f7ef22]/90 font-light mt-0"
            >
              Premium Photo Album Printing Powered by Revoria Technology
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.4, ease: "easeOut" }}
              className="text-[clamp(3.5rem,9vw,9rem)] font-black leading-[0.95] text-white mb-6 md:mb-10 tracking-tight"
            >
              PERFECT DIGITAL
              <br />
              <span className="text-[#f7ef22] relative">
                Precision Printing
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, delay: 1.2 }}
                  className="absolute bottom-1 md:bottom-2 left-0 h-1 bg-[#f7ef22]/50 -z-10"
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.8 }}
              className="max-w-4xl mx-auto text-lg md:text-2xl text-white/80 leading-relaxed mb-10 md:mb-16 font-light"
            >
              Where Memories Meet Precision Printing — every photograph is a memory
              worth preserving beautifully with the revolutionary Fuji Revoria 2100.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center"
            >
              <a href="/models">
                <Button className="group relative overflow-hidden bg-[#f7ef22] text-black px-10 md:px-12 py-3 md:py-4 rounded-full text-base font-bold hover:scale-105 transition-all duration-500 shadow-2xl">
                  <span className="relative z-10 flex items-center gap-2 md:gap-2.5">
                    Shop Albums
                    <Sparkles size={18} className="group-hover:rotate-12 transition" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-[#f7ef22]/90"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                </Button>
              </a>

              <a href="/custom-book">
                <Button
                  variant="outline"
                  className="border-2 border-white/60 text-white px-10 md:px-12 py-3 md:py-4 rounded-full text-base font-bold hover:bg-white/10 backdrop-blur-sm transition-all duration-500"
                >
                  Start Your Custom Book
                  <ChevronRight className="ml-2 md:ml-2.5 inline" size={18} />
                </Button>
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="mt-12 md:mt-20 text-white/50 text-xs md:text-sm tracking-wider uppercase"
            >
              Powered by Fujifilm Revoria 2100 • First LED-based production press in India
            </motion.p>
          </div>
        </Container>

        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 text-white/60"
        >
          <ChevronRight className="rotate-90" size={28} />
        </motion.div>
      </section>

      {/* ===== MISSION ===== */}
      <section className="py-20 md:py-32 bg-black text-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-4xl md:text-7xl font-black mb-8 md:mb-12 leading-tight">
                Where Memories Meet
                <br />
                <span className="text-[#f7ef22]">Precision Printing</span>
              </h2>

              <p className="text-white/70 text-base md:text-lg leading-relaxed mb-6 md:mb-8">
                At Perfect Digital, every photograph is more than just an image — it&apos;s a
                memory worth preserving beautifully. Using the revolutionary Fuji Revoria 2100, we
                deliver stunning, high-definition photo album prints with exceptional color depth,
                durability, and finishing.
              </p>

              <p className="text-white/70 text-base md:text-lg leading-relaxed mb-6 md:mb-8">
                Our mission is simple: turn your moments into masterpieces. Whether it&apos;s wedding
                albums, family memories, portfolios, or professional photo books, Perfect Digital
                ensures every page reflects clarity, vibrancy, and perfection.
              </p>

              <p className="text-white/70 text-base md:text-lg leading-relaxed">
                With Revoria technology, we guarantee print perfection in every sheet.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="rounded-3xl overflow-hidden border-2 border-[#f7ef22]/40 shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80"
                alt="Premium photo album printing"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ===== STORY ===== */}
      <section className="py-20 md:py-32 bg-black text-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="rounded-3xl overflow-hidden border-2 border-[#f7ef22]/40 shadow-2xl order-2 lg:order-1"
            >
              <img
                src="https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&q=80"
                alt="Perfect Digital founders and printing studio"
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-4xl md:text-7xl font-black mb-8 md:mb-12 leading-tight">
                The Story Behind
                <br />
                <span className="text-[#f7ef22]">Perfect Digital</span>
              </h2>

              <p className="text-white/70 text-base md:text-lg leading-relaxed mb-6 md:mb-8">
                Perfect Digital was founded by the passionate entrepreneurial couple Nandu Rajesh
                and Anjana Ajith. Both founders completed their MBA and shared a common vision — to
                revolutionize the photo printing industry in India with cutting-edge technology.
              </p>

              <p className="text-white/70 text-base md:text-lg leading-relaxed mb-6 md:mb-8">
                Their journey began with a bold step: introducing the Fujifilm Revoria 2100,
                recognized as one of the first LED-based digital production machines introduced in
                India for premium album printing.
              </p>

              <p className="text-white/70 text-base md:text-lg leading-relaxed">
                With innovation, creativity, and a strong understanding of business and technology,
                they established Perfect Digital to provide world-class album printing services with
                unmatched print quality. Today, Perfect Digital stands as a symbol of precision,
                passion, and technological excellence.
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ===== WHY REVORIA ===== */}
      <section className="py-20 md:py-32 bg-black text-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-6xl mx-auto mb-12 md:mb-16"
          >
            <h2 className="text-4xl md:text-7xl font-black mb-6 md:mb-8">
              Why Did We Choose the <span className="text-[#f7ef22]">Revoria 2100?</span>
            </h2>
            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-8">
              The Revoria 2100 was not just a machine choice — it was a commitment to excellence.
              This advanced LED digital printing system produces sharp images, smooth gradients, and
              stunning colors that perfectly capture every detail of your photographs.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto bg-white/5 backdrop-blur-sm border border-[#f7ef22]/20 rounded-3xl p-8 md:p-10"
          >
            <p className="text-[#f7ef22] text-sm font-semibold uppercase tracking-[0.16em] mb-6">
              Perfect Digital adopted this machine because
            </p>
            <ul className="space-y-4">
              {revoriaReasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-3 text-white/70 text-base md:text-lg leading-relaxed">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#f7ef22]" />
                  {reason}
                </li>
              ))}
            </ul>
          </motion.div>
        </Container>
      </section>

      {/* ===== WHAT MAKES REVORIA SPECIAL ===== */}
      <section className="py-20 md:py-32 bg-black text-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-6xl mx-auto mb-16 md:mb-24"
          >
            <h2 className="text-4xl md:text-7xl font-black mb-6 md:mb-8">
              What Makes Revoria 2100 <span className="text-[#f7ef22]">Special</span>
            </h2>
            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
              The Revoria 2100 stands out in the printing industry due to its advanced features and
              innovative technology — from LED printing to stunning glossy and matte finishes.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {revoriaFeatures.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -12, scale: 1.03 }}
                className="text-center group bg-white/5 backdrop-blur-sm border border-[#f7ef22]/20 rounded-3xl p-6 md:p-10 hover:bg-white/10 transition-all duration-500"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 md:w-28 md:h-28 rounded-full bg-[#f7ef22]/10 border-2 border-[#f7ef22]/40 mb-6 md:mb-8 group-hover:scale-110 transition">
                  <div className="text-[#f7ef22]">{feature.icon}</div>
                </div>
                <h3 className="text-xl md:text-3xl font-bold mb-4 md:mb-5">{feature.title}</h3>
                <p className="text-white/70 text-sm md:text-base leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== MEDIA OPTIONS ===== */}
      <section className="py-20 md:py-32 bg-black text-white">
        <Container>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-20"
          >
            <h2 className="text-4xl md:text-7xl font-black mb-4 md:mb-6">
              Media Options — Print on <span className="text-[#f7ef22]">Multiple Paper Types</span>
            </h2>
            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
              One of the biggest strengths of the Revoria system is its wide media compatibility.
              These options allow us to create unique albums with personalized textures and finishes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {mediaOptions.map((media, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="rounded-3xl overflow-hidden border border-[#f7ef22]/30"
              >
                <img
                  src={media.img}
                  alt={media.name}
                  className="w-full h-80 md:h-96 object-cover"
                />
                <div className="bg-white/5 backdrop-blur-sm px-5 py-4 border-t border-[#f7ef22]/20">
                  <p className="text-sm md:text-base font-semibold text-white/90">{media.name}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-center mt-8 text-white/50 text-sm md:text-base">
            Also available: Soft Touch Media
          </p>
        </Container>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-20 md:py-32 bg-black text-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-6xl mx-auto mb-16 md:mb-24"
          >
            <h2 className="text-4xl md:text-7xl font-black mb-6 md:mb-8">
              Frequently Asked <span className="text-[#f7ef22]">Questions</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white/5 backdrop-blur-sm border border-[#f7ef22]/20 rounded-3xl p-6 md:p-8 hover:bg-white/10 transition-all duration-500"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#f7ef22]/10 border border-[#f7ef22]/40 mb-5">
                  <BookOpen size={20} className="text-[#f7ef22]" />
                </div>
                <h3 className="text-base md:text-lg font-bold mb-3 leading-snug">{faq.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{faq.desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-black to-[#f7ef22]/5">
        <Container className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-7xl font-black text-white mb-6 md:mb-10">
              Ready to Turn Your Moments Into <span className="text-[#f7ef22]">Masterpieces</span>?
            </h2>
            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-8 md:mb-12">
              Wedding albums, family memories, portfolios, or professional photo books — Perfect
              Digital delivers clarity, vibrancy, and perfection on every page.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP}?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20Perfect%20Digital%20album%20printing`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-[#f7ef22] text-black px-12 md:px-16 py-6 md:py-7 rounded-full text-xl md:text-2xl font-bold hover:scale-110 transition shadow-2xl">
                Inquire Now
              </Button>
            </a>
          </motion.div>
        </Container>
      </section>
    </>
  );
}
