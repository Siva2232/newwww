// import Container from "../components/common/Container";
// import Button from "../components/common/Button";
// import { motion } from "framer-motion";
// import { ChevronRight, Sparkles, Heart, Camera, Clock, Users, Star } from "lucide-react";

// export default function About() {
//   return (
//     <>
//       {/* ===== HERO / FIRST SECTION ===== */}
//       <section className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center mt-5">
//         {/* Parallax Background Image */}
//         <motion.div
//           initial={{ scale: 1.1 }}
//           animate={{ scale: 1.05 }}
//           transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
//           className="absolute inset-0 bg-cover bg-center bg-no-repeat"
//           style={{
//             backgroundImage:
//               "url('https://images.squarespace-cdn.com/content/v1/6844a6bd36c06822eea9a174/a8cde329-df5a-4bf4-a96e-6d9affc34390/100_Paris-Destination-Wedding-Photographer+copy.jpg')",
//           }}
//         />

//         {/* Cinematic Overlays */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
//         <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/40" />
        
//         {/* Subtle film grain texture */}
//         <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('https://assets.codepen.io/605876/noise.png')] pointer-events-none" />

//         <Container className="relative z-10 px-6 text-center">
//           <div className="max-w-6xl mx-auto">
//             {/* Subtitle */}
//             <motion.p
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 1, delay: 0.2 }}
//               className="mb-8 text-sm md:text-base tracking-[0.5em] uppercase text-yellow-400/90 font-light"
//             >
//               Luxury Wedding Photography Studio
//             </motion.p>

//             {/* Main Headline */}
//             <motion.h1
//               initial={{ opacity: 0, y: 60 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 1.4, delay: 0.4, ease: "easeOut" }}
//               className="text-[clamp(4rem,10vw,9rem)] font-black leading-[0.95] text-white mb-10 tracking-tight"
//             >
//               We Capture Love
//               <br />
//               <span className="text-yellow-400 relative">
//                 As Art
//                 <motion.span
//                   initial={{ width: 0 }}
//                   animate={{ width: "100%" }}
//                   transition={{ duration: 1.5, delay: 1.2 }}
//                   className="absolute bottom-2 left-0 h-1 bg-yellow-400/50 -z-10"
//                 />
//               </span>
//             </motion.h1>

//             {/* Subheadline */}
//             <motion.p
//               initial={{ opacity: 0, y: 40 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 1.2, delay: 0.8 }}
//               className="max-w-4xl mx-auto text-xl md:text-2xl text-white/80 leading-relaxed mb-16 font-light"
//             >
//               A boutique studio crafting timeless, emotional, and cinematic wedding stories
//               <br className="hidden md:block" />
//               for couples who believe their love deserves to be preserved as fine art.
//             </motion.p>

//             {/* CTA Buttons */}
//             <motion.div
//               initial={{ opacity: 0, y: 50 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 1, delay: 1.2 }}
//               className="flex flex-col sm:flex-row gap-6 justify-center items-center"
//             >
//               <Button className="group relative overflow-hidden bg-yellow-400 text-black px-16 py-7 rounded-full text-xl font-bold hover:scale-105 transition-all duration-500 shadow-2xl">
//                 <span className="relative z-10 flex items-center gap-3">
//                   View Wedding Galleries
//                   <Sparkles size={24} className="group-hover:rotate-12 transition" />
//                 </span>
//                 <motion.div
//                   className="absolute inset-0 bg-yellow-300"
//                   initial={{ x: "-100%" }}
//                   whileHover={{ x: 0 }}
//                   transition={{ duration: 0.4 }}
//                 />
//               </Button>

//               <Button
//                 variant="outline"
//                 className="border-2 border-white/60 text-white px-16 py-7 rounded-full text-xl font-bold hover:bg-white/10 backdrop-blur-sm transition-all duration-500"
//               >
//                 Start Your Journey
//                 <ChevronRight className="ml-3 inline" size={24} />
//               </Button>
//             </motion.div>

//             {/* Trust Badge */}
//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 1.8 }}
//               className="mt-20 text-white/50 text-sm tracking-wider uppercase"
//             >
//               Limited to 18 weddings per year • Featured in Vogue, Harper's Bazaar & Junebug Weddings
//             </motion.p>
//           </div>
//         </Container>

//         {/* Scroll Indicator */}
//         <motion.div
//           animate={{ y: [0, 15, 0] }}
//           transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
//           className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60"
//         >
//           <ChevronRight className="rotate-90" size={36} />
//         </motion.div>
//       </section>

//       {/* ===== OUR PHILOSOPHY ===== */}
//       <section className="py-32 bg-black text-white">
//         <Container>
//           <div className="grid lg:grid-cols-2 gap-20 items-center">
//             <motion.div
//               initial={{ opacity: 0, x: -50 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 1 }}
//             >
//               <h2 className="text-5xl md:text-7xl font-black mb-12 leading-tight">
//                 Your Love Deserves
//                 <br />
//                 <span className="text-yellow-400">Art That Lasts Forever</span>
//               </h2>

//               <p className="text-white/70 text-lg leading-relaxed mb-8">
//                 We believe the most powerful images come from trust, connection, and creative freedom.
//                 That's why we limit our bookings each year — to give every couple the time, attention,
//                 and artistry they truly deserve.
//               </p>

//               <p className="text-white/70 text-lg leading-relaxed">
//                 From intimate elopements to grand celebrations, we blend editorial precision with documentary heart,
//                 creating galleries that feel like films you can step into — again and again.
//               </p>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, scale: 0.95 }}
//               whileInView={{ opacity: 1, scale: 1 }}
//               viewport={{ once: true }}
//               transition={{ duration: 1.2 }}
//               className="rounded-3xl overflow-hidden border-2 border-yellow-400/40 shadow-2xl"
//             >
//               <img
//                 src="https://cdn.shopify.com/s/files/1/0553/6422/3136/files/lighting-guide-wedding-photographers_sarafrance.jpg?v=1681401150"
//                 alt="Romantic couple walking in golden light"
//                 className="w-full h-full object-cover"
//               />
//             </motion.div>
//           </div>
//         </Container>
//       </section>

//       {/* ===== WHAT SETS US APART ===== */}
//       <section className="py-32 bg-black text-white">
//         <Container>
//           <motion.div
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="text-center max-w-6xl mx-auto mb-24"
//           >
//             <h2 className="text-5xl md:text-7xl font-black mb-8">
//               Why Couples Choose <span className="text-yellow-400">Us</span>
//             </h2>
//             <p className="text-xl text-white/70 max-w-3xl mx-auto">
//               We go beyond traditional photography to deliver an elevated, personalized experience from start to finish.
//             </p>
//           </motion.div>

//           <div className="grid md:grid-cols-3 gap-12">
//             {[
//               { icon: <Heart size={52} />, title: "Deeply Emotional", desc: "We capture laughter, tears, quiet glances — the real, unscripted magic that makes your day yours." },
//               { icon: <Camera size={52} />, title: "Cinematic Mastery", desc: "Film-inspired color grading, flawless lighting, and editorial composition in every single image." },
//               { icon: <Sparkles size={52} />, title: "Timeless & Elegant", desc: "A signature style that blends modern romance with classic sophistication — never trendy, always iconic." },
//               { icon: <Clock size={52} />, title: "Limited Bookings", desc: "Only 20 weddings per year. This means more planning time, creativity, and dedication to your story." },
//               { icon: <Users size={52} />, title: "Full-Day Coverage", desc: "From getting ready to the last dance — no hour limits, no rushed moments." },
//               { icon: <Star size={52} />, title: "Heirloom Products", desc: "Fine art albums, framed prints, and custom wall galleries designed to be passed down for generations." },
//             ].map((feature, i) => (
//               <motion.div
//                 key={i}
//                 initial={{ opacity: 0, y: 50 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: i * 0.15 }}
//                 whileHover={{ y: -16, scale: 1.03 }}
//                 className="text-center group bg-white/5 backdrop-blur-sm border border-yellow-400/20 rounded-3xl p-10 hover:bg-white/10 transition-all duration-500"
//               >
//                 <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-yellow-400/10 border-2 border-yellow-400/40 mb-8 group-hover:scale-110 transition">
//                   <div className="text-yellow-400">{feature.icon}</div>
//                 </div>
//                 <h3 className="text-2xl md:text-3xl font-bold mb-5">{feature.title}</h3>
//                 <p className="text-white/70 leading-relaxed">{feature.desc}</p>
//               </motion.div>
//             ))}
//           </div>
//         </Container>
//       </section>

//       {/* ===== GALLERY PREVIEW ===== */}
//       <section className="py-32 bg-black text-white">
//         <Container>
//           <motion.div
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             viewport={{ once: true }}
//             className="text-center mb-20"
//           >
//             <h2 className="text-5xl md:text-7xl font-black mb-6">
//               Moments That <span className="text-yellow-400">Last Forever</span>
//             </h2>
//             <p className="text-xl text-white/70">A glimpse into the emotion and artistry we bring to every wedding</p>
//           </motion.div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <motion.div whileHover={{ scale: 1.05 }} className="rounded-3xl overflow-hidden border border-yellow-400/30">
//               <img src="https://thelane.com/wp-content/uploads/2022/02/Sophie-Tim-Reedit-4-scaled.jpg" alt="Cinematic romantic moment" className="w-full h-96 object-cover" />
//             </motion.div>
//             <motion.div whileHover={{ scale: 1.05 }} className="rounded-3xl overflow-hidden border border-yellow-400/30">
//               <img src="https://www.printique.com/wp-content/uploads/2019/06/wedding-poses-3.jpg" alt="Modern couple pose" className="w-full h-96 object-cover" />
//             </motion.div>
//             <motion.div whileHover={{ scale: 1.05 }} className="rounded-3xl overflow-hidden border border-yellow-400/30">
//               <img src="https://jaidynmichele.com/wp-content/uploads/sites/32630/2023/05/BZ7A0337-1024x719.jpg" alt="Joyful bride and groom" className="w-full h-96 object-cover" />
//             </motion.div>
//             <motion.div whileHover={{ scale: 1.05 }} className="rounded-3xl overflow-hidden border border-yellow-400/30">
//               <img src="https://whimsical-cdn.wedissimo.com/2025/11/Black-and-White-Wedding-Photos.jpg" alt="Timeless black and white embrace" className="w-full h-96 object-cover" />
//             </motion.div>
//             <motion.div whileHover={{ scale: 1.05 }} className="rounded-3xl overflow-hidden border border-yellow-400/30">
//               <img src="https://susanstripling.com/wp-content/uploads/2024/01/08-oheka-castle-wedding-nighttime-sunset-wedding-photo-bride-and-groom.jpg" alt="Dramatic sunset portrait" className="w-full h-96 object-cover" />
//             </motion.div>
//             <motion.div whileHover={{ scale: 1.05 }} className="rounded-3xl overflow-hidden border border-yellow-400/30">
//               <img src="https://susanstripling.com/wp-content/uploads/2023/09/wedding-couple-in-the-rain-central-park-wedding-photography-scaled-e1706900815692.jpg" alt="Romantic rainy day moment" className="w-full h-96 object-cover" />
//             </motion.div>
//           </div>

//           <div className="text-center mt-16">
//             <Button className="bg-yellow-400 text-black px-16 py-6 rounded-full text-xl font-bold hover:scale-105 transition">
//               Explore Complete Galleries
//             </Button>
//           </div>
//         </Container>
//       </section>

//       {/* ===== FINAL CTA ===== */}
//       <section className="py-28 bg-gradient-to-b from-black to-yellow-950/20">
//         <Container className="text-center">
//           <motion.div
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//           >
//             <h2 className="text-5xl md:text-7xl font-black text-white mb-10">
//               Ready to Tell <span className="text-yellow-400">Your</span> Story?
//             </h2>
//             <p className="text-xl text-white/70 max-w-3xl mx-auto mb-12">
//               Limited 2026 dates remaining. Let's create something extraordinary together.
//             </p>
//             <Button className="bg-yellow-400 text-black px-16 py-7 rounded-full text-2xl font-bold hover:scale-110 transition shadow-2xl">
//               Inquire Now
//             </Button>
//           </motion.div>
//         </Container>
//       </section>
//     </>
//   );
// }


import Container from "../components/common/Container";
import Button from "../components/common/Button";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles, Heart, Camera, Clock, Users, Star } from "lucide-react";

export default function About() {
  return (
    <>
      {/* ===== HERO / FIRST SECTION ===== */}
      <section className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center mt-5">
        {/* Parallax Background Image */}
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.squarespace-cdn.com/content/v1/6844a6bd36c06822eea9a174/a8cde329-df5a-4bf4-a96e-6d9affc34390/100_Paris-Destination-Wedding-Photographer+copy.jpg')",
          }}
        />

        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/40" />
        
        {/* Subtle film grain texture */}
        <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('https://assets.codepen.io/605876/noise.png')] pointer-events-none" />

        <Container className="relative z-10 px-6 text-center">
          <div className="max-w-6xl mx-auto">
            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mb-4 md:mb-8 text-xs md:text-base tracking-[0.5em] uppercase text-[#f7ef22]/90 font-light mt-0"
            >
              Luxury Wedding Photography Studio
            </motion.p>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.4, ease: "easeOut" }}
              className="text-[clamp(3.5rem,9vw,9rem)] font-black leading-[0.95] text-white mb-6 md:mb-10 tracking-tight"
            >
              We Capture Love
              <br />
              <span className="text-[#f7ef22] relative">
                As Art
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, delay: 1.2 }}
                  className="absolute bottom-1 md:bottom-2 left-0 h-1 bg-[#f7ef22]/50 -z-10"
                />
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.8 }}
              className="max-w-4xl mx-auto text-lg md:text-2xl text-white/80 leading-relaxed mb-10 md:mb-16 font-light"
            >
              A boutique studio crafting timeless, emotional, and cinematic wedding stories
              <br className="hidden md:block" />
              for couples who believe their love deserves to be preserved as fine art.
            </motion.p>

            {/* CTA Buttons - Smaller in Hero Section */}
            <motion.div
       
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1, delay: 1.2 }}
  className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center"
>
  <a href="/models">
  <Button className="group relative overflow-hidden bg-[#f7ef22] text-black px-10 md:px-12 py-3 md:py-4 rounded-full text-base md:text-base font-bold hover:scale-105 transition-all duration-500 shadow-2xl">
    <span className="relative z-10 flex items-center gap-2 md:gap-2.5">
      View Wedding Galleries
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

  <Button
    variant="outline"
    className="border-2 border-white/60 text-white px-10 md:px-12 py-3 md:py-4 rounded-full text-base md:text-base font-bold hover:bg-white/10 backdrop-blur-sm transition-all duration-500"
  >
    Start Your Journey
    <ChevronRight className="ml-2 md:ml-2.5 inline" size={18} />
  </Button>
</motion.div>


            {/* Trust Badge */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="mt-12 md:mt-20 text-white/50 text-xs md:text-sm tracking-wider uppercase"
            >
              Limited to 18 weddings per year • Featured in Vogue, Harper's Bazaar & Junebug Weddings
            </motion.p>
          </div>
        </Container>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 text-white/60"
        >
          <ChevronRight className="rotate-90" size={28} md:size={36} />
        </motion.div>
      </section>

      {/* ===== OUR PHILOSOPHY ===== */}
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
                Your Love Deserves
                <br />
                <span className="text-[#f7ef22]">Art That Lasts Forever</span>
              </h2>

              <p className="text-white/70 text-base md:text-lg leading-relaxed mb-6 md:mb-8">
                We believe the most powerful images come from trust, connection, and creative freedom.
                That's why we limit our bookings each year — to give every couple the time, attention,
                and artistry they truly deserve.
              </p>

              <p className="text-white/70 text-base md:text-lg leading-relaxed">
                From intimate elopements to grand celebrations, we blend editorial precision with documentary heart,
                creating galleries that feel like films you can step into — again and again.
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
                src="https://cdn.shopify.com/s/files/1/0553/6422/3136/files/lighting-guide-wedding-photographers_sarafrance.jpg?v=1681401150"
                alt="Romantic couple walking in golden light"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ===== WHAT SETS US APART ===== */}
      <section className="py-20 md:py-32 bg-black text-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-6xl mx-auto mb-16 md:mb-24"
          >
            <h2 className="text-4xl md:text-7xl font-black mb-6 md:mb-8">
              Why Couples Choose <span className="text-[#f7ef22]">Us</span>
            </h2>
            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
              We go beyond traditional photography to deliver an elevated, personalized experience from start to finish.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              { icon: <Heart size={40} md:size={52} />, title: "Deeply Emotional", desc: "We capture laughter, tears, quiet glances — the real, unscripted magic that makes your day yours." },
              { icon: <Camera size={40} md:size={52} />, title: "Cinematic Mastery", desc: "Film-inspired color grading, flawless lighting, and editorial composition in every single image." },
              { icon: <Sparkles size={40} md:size={52} />, title: "Timeless & Elegant", desc: "A signature style that blends modern romance with classic sophistication — never trendy, always iconic." },
              { icon: <Clock size={40} md:size={52} />, title: "Limited Bookings", desc: "Only 20 weddings per year. This means more planning time, creativity, and dedication to your story." },
              { icon: <Users size={40} md:size={52} />, title: "Full-Day Coverage", desc: "From getting ready to the last dance — no hour limits, no rushed moments." },
              { icon: <Star size={40} md:size={52} />, title: "Heirloom Products", desc: "Fine art albums, framed prints, and custom wall galleries designed to be passed down for generations." },
            ].map((feature, i) => (
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

      {/* ===== GALLERY PREVIEW ===== */}
      {/* <section className="py-20 md:py-32 bg-black text-white">
        <Container>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-20"
          >
            <h2 className="text-4xl md:text-7xl font-black mb-4 md:mb-6">
              Moments That <span className="text-[#f7ef22]">Last Forever</span>
            </h2>
            <p className="text-lg md:text-xl text-white/70">A glimpse into the emotion and artistry we bring to every wedding</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <motion.div whileHover={{ scale: 1.05 }} className="rounded-3xl overflow-hidden border border-[#f7ef22]/30">
              <img src="https://thelane.com/wp-content/uploads/2022/02/Sophie-Tim-Reedit-4-scaled.jpg" alt="Cinematic romantic moment" className="w-full h-80 md:h-96 object-cover" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="rounded-3xl overflow-hidden border border-[#f7ef22]/30">
              <img src="https://www.printique.com/wp-content/uploads/2019/06/wedding-poses-3.jpg" alt="Modern couple pose" className="w-full h-80 md:h-96 object-cover" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="rounded-3xl overflow-hidden border border-[#f7ef22]/30">
              <img src="https://jaidynmichele.com/wp-content/uploads/sites/32630/2023/05/BZ7A0337-1024x719.jpg" alt="Joyful bride and groom" className="w-full h-80 md:h-96 object-cover" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="rounded-3xl overflow-hidden border border-[#f7ef22]/30">
              <img src="https://whimsical-cdn.wedissimo.com/2025/11/Black-and-White-Wedding-Photos.jpg" alt="Timeless black and white embrace" className="w-full h-80 md:h-96 object-cover" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="rounded-3xl overflow-hidden border border-[#f7ef22]/30">
              <img src="https://susanstripling.com/wp-content/uploads/2024/01/08-oheka-castle-wedding-nighttime-sunset-wedding-photo-bride-and-groom.jpg" alt="Dramatic sunset portrait" className="w-full h-80 md:h-96 object-cover" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="rounded-3xl overflow-hidden border border-[#f7ef22]/30">
              <img src="https://susanstripling.com/wp-content/uploads/2023/09/wedding-couple-in-the-rain-central-park-wedding-photography-scaled-e1706900815692.jpg" alt="Romantic rainy day moment" className="w-full h-80 md:h-96 object-cover" />
            </motion.div>
          </div>

          <div className="text-center mt-10 md:mt-16">
             <a href="/services">
            <Button className="bg-[#f7ef22] text-black px-12 md:px-16 py-5 md:py-6 rounded-full text-lg md:text-xl font-bold hover:scale-105 transition">
              Explore Complete Galleries
            </Button>
            </a>
          </div>
        </Container>
      </section> */}

      {/* ===== FINAL CTA ===== */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-black to-[#f7ef22]/5">
        <Container className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-7xl font-black text-white mb-6 md:mb-10">
              Ready to Tell <span className="text-[#f7ef22]">Your</span> Story?
            </h2>
            <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-8 md:mb-12">
              Limited 2026 dates remaining. Let's create something extraordinary together.
            </p>
           <a
            href="https://wa.me/1234567890?text=Hello%20I%20would%20like%20to%20inquire%20about%20your%20services"
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