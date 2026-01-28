// import { useState, useEffect, useRef } from "react";
// import Container from "../components/common/Container";
// import Button from "../components/common/Button";
// import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
// import { ChevronLeft, ChevronRight,Heart,Camera,Sparkles,Clock,Users,Star, } from "lucide-react";

// const portfolioImages = [
//   { src: "https://thelane.com/wp-content/uploads/2022/02/Sophie-Tim-Reedit-4-scaled.jpg", title: "Eternal Vows", subtitle: "Italy · 2024" },
//   { src: "https://www.printique.com/wp-content/uploads/2019/06/wedding-poses-3.jpg", title: "Golden Hour", subtitle: "California · 2023" },
//   { src: "https://jaidynmichele.com/wp-content/uploads/sites/32630/2023/05/BZ7A0337-1024x719.jpg", title: "Timeless Romance", subtitle: "Paris · 2024" },
//   { src: "https://whimsical-cdn.wedissimo.com/2025/11/Black-and-White-Wedding-Photos.jpg", title: "Classic Elegance", subtitle: "B&W Collection" },
//   { src: "https://susanstripling.com/wp-content/uploads/2024/01/08-oheka-castle-wedding-nighttime-sunset-wedding-photo-bride-and-groom.jpg", title: "Sunset Dreams", subtitle: "Oheka Castle" },
//   { src: "https://susanstripling.com/wp-content/uploads/2023/09/wedding-couple-in-the-rain-central-park-wedding-photography-scaled-e1706900815692.jpg", title: "Rain & Romance", subtitle: "Central Park" },
// ];

// // Duplicate for seamless infinite loop
// const duplicatedImages = [...portfolioImages, ...portfolioImages, ...portfolioImages];

// export default function HomeAboutSection() {
//   const constraintsRef = useRef(null);
//   const x = useMotionValue(0);
//   const controls = useAnimation();
//   const [isHovered, setIsHovered] = useState(false);

//   // Auto-scroll speed (positive = right to left)
//   const baseVelocity = isHovered ? 15 : 40; // Slower when hovered
//   const velocity = useTransform(x, (latest) => baseVelocity);

//   useEffect(() => {
//     const animateScroll = async () => {
//       await controls.start({
//         x: -portfolioImages.length * (100 / 3) + "%", // Move exactly one set
//         transition: {
//           x: {
//             duration: 60, // Smooth long scroll
//             repeat: Infinity,
//             ease: "linear",
//             repeatType: "loop",
//           },
//         },
//       });
//     };

//     if (!isHovered) {
//       animateScroll();
//     } else {
//       controls.stop();
//     }
//   }, [controls, isHovered]);

//   // Reset position seamlessly when reaching end
//   const handleDragEnd = () => {
//     const currentX = x.get();
//     const threshold = -portfolioImages.length * (100 / 3);

//     if (currentX <= threshold) {
//       x.set(currentX + portfolioImages.length * (100 / 3));
//     } else if (currentX >= 0) {
//       x.set(currentX - portfolioImages.length * (100 / 3));
//     }
//   };

//   return (
//     <>
//       {/* About Section - unchanged */}
//      <section className="py-20 md:py-32 bg-gray-50">
//         <Container className="px-6">
//           <div className="max-w-6xl mx-auto text-center">
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.8 }}
//             >
//               <p className="text-sm md:text-base tracking-widest uppercase text-yellow-600 font-medium mb-4">
//                 Who We Are
//               </p>
//               <h2 className="text-4xl md:text-6xl font-black text-gray-900">
//                 About <span className="text-yellow-500">Us</span>
//               </h2>
//             </motion.div>

//             <motion.p
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.8, delay: 0.2 }}
//               className="mt-8 text-lg md:text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto"
//             >
//               We are a boutique wedding photography studio passionate about turning your most cherished day into timeless art. 
//               With an eye for authentic emotion, natural beauty, and cinematic storytelling, we craft images that don't just document your wedding — 
//               they preserve the feeling of it forever.
//             </motion.p>

//             {/* Values Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mt-20">
//               {[
//                 { icon: Heart, title: "Emotion-Driven", desc: "We capture genuine joy, quiet tears, and stolen glances — the heart of your love story." },
//                 { icon: Camera, title: "Cinematic Craft", desc: "Film-inspired aesthetics with masterful lighting and thoughtful composition in every frame." },
//                 { icon: Sparkles, title: "Timeless Elegance", desc: "A signature style that feels classic today and iconic in 50 years." },
//                 { icon: Clock, title: "Limited Bookings", desc: "Only 20 weddings per year — ensuring every couple gets our full creativity and care." },
//                 { icon: Users, title: "Personal Experience", desc: "From planning to delivery, we guide you with warmth, clarity, and attention to detail." },
//                 { icon: Star, title: "Heirloom Quality", desc: "Fine art albums and prints designed to be cherished and passed down through generations." },
//               ].map((item, index) => {
//                 const Icon = item.icon;
//                 return (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0, y: 40 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ duration: 0.8, delay: index * 0.1 }}
//                     whileHover={{ y: -10, scale: 1.02 }}
//                     className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 hover:shadow-2xl hover:border-yellow-200 transition-all duration-400"
//                   >
//                     <div className="flex justify-center mb-6">
//                       <Icon className="w-12 h-12 text-yellow-500" />
//                     </div>
//                     <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
//                     <p className="text-gray-600 leading-relaxed text-base">{item.desc}</p>
//                   </motion.div>
//                 );
//               })}
//             </div>

//             <motion.div
//               initial={{ opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               viewport={{ once: true }}
//               transition={{ delay: 0.6 }}
//               className="mt-20"
//             >
//               <a href="/about">
//               <Button className="bg-yellow-500 text-black px-12 py-5 rounded-full text-lg font-bold hover:bg-yellow-400 hover:scale-105 transition shadow-lg">
//                 Learn More About Our Approach
//               </Button>
//               </a>
//               <p className="mt-12 text-gray-500 text-sm md:text-base italic">
//                 Proudly crafting unforgettable wedding memories with heart and artistry since 2018
//               </p>
//             </motion.div>
//           </div>
//         </Container>
//       </section>

//       {/* Next-Level Infinite Auto-Scroll Carousel */}
//       <section className="py-32 bg-black text-white relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/70 pointer-events-none z-10" />

//         <Container>
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="text-center mb-20 relative z-20"
//           >
//             <h2 className="text-5xl md:text-7xl font-black mb-6">
//               Moments That <span className="text-yellow-400">Last Forever</span>
//             </h2>
//             <p className="text-xl text-white/70 max-w-3xl mx-auto">
//               Experience the emotion, artistry, and timeless beauty of our craft
//             </p>
//           </motion.div>

//           {/* Premium Parallax Carousel */}
//           <div
//             ref={constraintsRef}
//             className="relative"
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//           >
//             <motion.div
//               drag="x"
//               dragConstraints={constraintsRef}
//               dragElastic={0.1}
//               onDragEnd={handleDragEnd}
//               animate={controls}
//               style={{ x }}
//               className="flex cursor-grab active:cursor-grabbing select-none"
//             >
//               {duplicatedImages.map((image, index) => (
//                 <motion.div
//                   key={index}
//                   className="w-full md:w-1/3 flex-shrink-0 px-6"
//                   whileHover={{ scale: 1.02 }}
//                   style={{
//                     perspective: 1000,
//                   }}
//                 >
//                   <motion.div
//                     className="relative group rounded-3xl overflow-hidden shadow-2xl h-96 md:h-[560px]"
//                     whileHover={{ rotateY: 4, rotateX: 4 }}
//                     transition={{ duration: 0.6 }}
//                   >
//                     <img
//                       src={image.src}
//                       alt={image.title}
//                       className="w-full h-full object-cover"
//                       loading="lazy"
//                     />

//                     {/* Dynamic Overlay */}
//                     <motion.div
//                       className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
//                       initial={{ opacity: 0.6 }}
//                       whileHover={{ opacity: 0.9 }}
//                       transition={{ duration: 0.6 }}
//                     />

//                     {/* Text Reveal */}
//                     <motion.div
//                       className="absolute bottom-0 left-0 right-0 p-10 text-left"
//                       initial={{ y: 60, opacity: 0 }}
//                       whileInView={{ y: 0, opacity: 1 }}
//                       viewport={{ once: false }}
//                       transition={{ delay: 0.3, duration: 0.8 }}
//                     >
//                       <h3 className="text-3xl md:text-4xl font-black text-white mb-2">
//                         {image.title}
//                       </h3>
//                       <p className="text-yellow-400 text-lg tracking-wide font-medium">
//                         {image.subtitle}
//                       </p>
//                       <motion.div
//                         className="mt-4 w-20 h-1 bg-yellow-400 rounded-full"
//                         initial={{ width: 0 }}
//                         whileInView={{ width: 80 }}
//                         transition={{ delay: 0.8, duration: 0.8 }}
//                       />
//                     </motion.div>

//                     {/* Subtle Border Glow on Hover */}
//                     <motion.div
//                       className="absolute inset-0 rounded-3xl border-4 border-transparent group-hover:border-yellow-400/40 pointer-events-none"
//                       initial={{ opacity: 0 }}
//                       whileHover={{ opacity: 1 }}
//                       transition={{ duration: 0.6 }}
//                     />
//                   </motion.div>
//                 </motion.div>
//               ))}
//             </motion.div>

//             {/* Optional Manual Controls */}
//             <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-8 pointer-events-none z-20">
//               <button className="pointer-events-auto w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-yellow-500/20 hover:border-yellow-500 transition-all duration-500 group">
//                 <ChevronLeft className="w-10 h-10 text-white group-hover:text-yellow-400 transition" />
//               </button>
//               <button className="pointer-events-auto w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-yellow-500/20 hover:border-yellow-500 transition-all duration-500 group">
//                 <ChevronRight className="w-10 h-10 text-white group-hover:text-yellow-400 transition" />
//               </button>
//             </div>
//           </div>

//           <div className="text-center mt-20 relative z-20">
//             <a href="/models">
//             <Button className="bg-yellow-400 text-black px-20 py-7 rounded-full text-2xl font-black hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/40 transition-all duration-500">
//               Explore Complete Galleries
//             </Button>
//             </a>
//           </div>
//         </Container>
//       </section>
//     </>
//   );
// }


import { useState, useEffect, useRef } from "react";
import Container from "../components/common/Container";
import Button from "../components/common/Button";
import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { Heart, Camera, Sparkles, Clock, Users, Star } from "lucide-react";

const portfolioImages = [
  { src: "https://thelane.com/wp-content/uploads/2022/02/Sophie-Tim-Reedit-4-scaled.jpg", title: "Eternal Vows", subtitle: "Italy · 2024" },
  { src: "https://www.printique.com/wp-content/uploads/2019/06/wedding-poses-3.jpg", title: "Golden Hour", subtitle: "California · 2023" },
  { src: "https://jaidynmichele.com/wp-content/uploads/sites/32630/2023/05/BZ7A0337-1024x719.jpg", title: "Timeless Romance", subtitle: "Paris · 2024" },
  { src: "https://whimsical-cdn.wedissimo.com/2025/11/Black-and-White-Wedding-Photos.jpg", title: "Classic Elegance", subtitle: "B&W Collection" },
  { src: "https://susanstripling.com/wp-content/uploads/2024/01/08-oheka-castle-wedding-nighttime-sunset-wedding-photo-bride-and-groom.jpg", title: "Sunset Dreams", subtitle: "Oheka Castle" },
  { src: "https://susanstripling.com/wp-content/uploads/2023/09/wedding-couple-in-the-rain-central-park-wedding-photography-scaled-e1706900815692.jpg", title: "Rain & Romance", subtitle: "Central Park" },
];

// Triplicate for seamless infinite scrolling
const duplicatedImages = [...portfolioImages, ...portfolioImages, ...portfolioImages];
const slideCount = portfolioImages.length;
const slideWidthPercent = 100 / 3; // Each slide takes 1/3 of viewport on md+

export default function HomeAboutSection() {
  const constraintsRef = useRef(null);
  const x = useMotionValue(0);
  const controls = useAnimation();
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-scroll: pause on hover, smooth infinite loop
  useEffect(() => {
    if (isHovered) {
      controls.stop();
    } else {
      controls.start({
        x: -slideCount * slideWidthPercent + "%",
        transition: {
          duration: 60,
          ease: "linear",
          repeat: Infinity,
        },
      });
    }
  }, [isHovered, controls]);

  // Seamless reset when dragging past bounds
  const handleDragEnd = () => {
    const currentX = x.get();
    const fullSetWidth = slideCount * slideWidthPercent;

    if (currentX <= -fullSetWidth) {
      x.set(currentX + fullSetWidth);
    } else if (currentX >= 0) {
      x.set(currentX - fullSetWidth);
    }
  };

  // Track current slide index for dots (smooth & accurate)
  useEffect(() => {
    const updateIndex = () => {
      const progressed = -x.get() / slideWidthPercent;
      let index = Math.round(progressed % slideCount);
      if (index < 0) index += slideCount;
      setCurrentIndex(index);
    };

    updateIndex();
    const unsubscribe = x.on("change", updateIndex);
    return () => unsubscribe();
  }, [x]);

  // Click dot to go to specific slide
  const goToSlide = (index) => {
    const targetX = -index * slideWidthPercent;
    controls.start({
      x: targetX + "%",
      transition: { duration: 0.8, ease: "easeInOut" },
    });
  };

  return (
    <>
      {/* About Section - unchanged */}
      <section className="py-20 md:py-32 bg-gray-50">
        <Container className="px-6">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-sm md:text-base tracking-widest uppercase text-yellow-600 font-medium mb-4">
                Who We Are
              </p>
              <h2 className="text-4xl md:text-6xl font-black text-gray-900">
                About <span className="text-yellow-500">Us</span>
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-8 text-lg md:text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto"
            >
              We are a boutique wedding photography studio passionate about turning your most cherished day into timeless art. 
              With an eye for authentic emotion, natural beauty, and cinematic storytelling, we craft images that don't just document your wedding — 
              they preserve the feeling of it forever.
            </motion.p>

            {/* Values Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mt-20">
              {[
                { icon: Heart, title: "Emotion-Driven", desc: "We capture genuine joy, quiet tears, and stolen glances — the heart of your love story." },
                { icon: Camera, title: "Cinematic Craft", desc: "Film-inspired aesthetics with masterful lighting and thoughtful composition in every frame." },
                { icon: Sparkles, title: "Timeless Elegance", desc: "A signature style that feels classic today and iconic in 50 years." },
                { icon: Clock, title: "Limited Bookings", desc: "Only 20 weddings per year — ensuring every couple gets our full creativity and care." },
                { icon: Users, title: "Personal Experience", desc: "From planning to delivery, we guide you with warmth, clarity, and attention to detail." },
                { icon: Star, title: "Heirloom Quality", desc: "Fine art albums and prints designed to be cherished and passed down through generations." },
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
                    className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 hover:shadow-2xl hover:border-yellow-200 transition-all duration-400"
                  >
                    <div className="flex justify-center mb-6">
                      <Icon className="w-12 h-12 text-yellow-500" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-base">{item.desc}</p>
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
                <Button className="bg-yellow-500 text-black px-12 py-5 rounded-full text-lg font-bold hover:bg-yellow-400 hover:scale-105 transition shadow-lg">
                  Learn More About Our Approach
                </Button>
              </a>
              <p className="mt-12 text-gray-500 text-sm md:text-base italic">
                Proudly crafting unforgettable wedding memories with heart and artistry since 2018
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Carousel Section */}
    
    </>
  );
}