import Container from "../components/common/Container";
import { motion } from "framer-motion";
import { Handshake, BookOpen, Camera, ArrowUpRight, Users, Briefcase, Calendar, Award } from "lucide-react";

const steps = [
  {
    number: "1.",
    title: "JOIN THE NETWORK",
    desc: "Connect with peers, photographers, makeup artists, and clients on our exclusive platform. Build your professional circle and discover new opportunities.",
    icon: Handshake,
    img: "https://media.istockphoto.com/id/1469516080/photo/diversity-women-and-beauty-with-skincare-and-portrait-smile-and-happy-models-different-and.jpg?s=612x612&w=0&k=20&c=NtWsTxVdaQT5Uhs34N9W4XGdyAEvXnsYPHtpYOYfYGk=",
  },
  {
    number: "2.",
    title: "ACCESS RESOURCES",
    desc: "Gain access to premium tutorials, workshops, and exclusive content tailored for models and creatives. Enhance your skills with expert-led materials.",
    icon: BookOpen,
    img: "https://johnmakphotography.com/wp-content/uploads/2025/08/Photo-Editing-Photo-Studio-Equipment-1024x683.webp",
  },
  {
    number: "3.",
    title: "COLLABORATE & CREATE",
    desc: "Find projects, book studio time, and collaborate on ambitious ideas. Use our tools to plan shoots and track progress seamlessly.",
    icon: Camera,
    img: "https://cdn.shopify.com/s/files/1/2303/2711/files/10-benefits-of-using-a-professional-softbox-studio-lighting-kit-1.jpg?v=1587532790",
  },
  {
    number: "4.",
    title: "SHOWCASE & GROW",
    desc: "Share your portfolio, receive feedback, and gain recognition in our supportive community. Track your growth with analytics and milestones.",
    icon: ArrowUpRight,
    img: "https://image8.photobiz.com/8585/28_20231031123442_6900781_xlarge.jpg",
  },
];

const additionalFeatures = [
  {
    icon: Users,
    title: "Community Forums",
    desc: "Engage in discussions, share tips, and network with like-minded creatives in our vibrant forums.",
  },
  {
    icon: Briefcase,
    title: "Job Board",
    desc: "Browse and post job opportunities, from modeling gigs to photography assignments.",
  },
  {
    icon: Calendar,
    title: "Event Calendar",
    desc: "Stay updated on workshops, meetups, and industry events. RSVP and join virtual or in-person sessions.",
  },
  {
    icon: Award,
    title: "Achievement Badges",
    desc: "Earn badges for milestones like completed projects or community contributions to showcase your progress.",
  },
];

export default function CreativeJourney() {
  return (
    <section className="py-16 md:py-32 bg-gradient-to-b from-gray-50 to-white">
      <Container className="px-6 md:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-16 md:mb-24"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-black leading-tight">
            OUR CREATIVE JOURNEY
          </h2>
          <p className="mt-4 sm:mt-6 text-lg sm:text-xl md:text-2xl text-gray-600">
            Experience Collaboration, Creation, & Growth
          </p>

          {/* Responsive Timeline */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 lg:gap-8 mt-10 md:mt-12">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-yellow-500 ring-4 ring-yellow-200"
            />
            <div className="w-full md:w-auto flex-grow h-0.5 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300" />
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-yellow-500 ring-4 ring-yellow-200"
            />
          </div>
        </motion.div>

        {/* Steps Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              whileHover={{ y: -12, scale: 1.03 }}
              className="group relative bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl hover:shadow-2xl hover:shadow-yellow-500/30 transition-all duration-500 overflow-visible"
            >
              {/* Inner wrapper with padding to make room for floating icon */}
              <div className="relative pt-12 sm:pt-14 px-6 sm:px-8 pb-6 sm:pb-8">
                {/* Floating Icon Circle */}
                <div className="absolute -top-8 sm:-top-10 left-1/2 -translate-x-1/2 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 z-10">
                  <step.icon className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
                </div>

                {/* Card Content */}
                <div className="text-center mt-6"> {/* Extra margin to clear icon */}
                  <span className="text-2xl sm:text-3xl font-bold text-yellow-600">
                    {step.number}
                  </span>
                  <h3 className="mt-3 sm:mt-4 text-lg sm:text-xl md:text-2xl font-bold text-black">
                    {step.title}
                  </h3>
                  <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
                    {step.desc}
                  </p>

                  {/* Image */}
                  <div className="mt-6 sm:mt-8 rounded-2xl overflow-hidden shadow-inner">
                    <img
                      src={step.img}
                      alt={step.title}
                      className="w-full h-40 sm:h-48 md:h-52 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 md:mt-24 text-center"
        >
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-black mb-10 md:mb-16">
            MORE FEATURES TO EXPLORE
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.6, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                className="p-6 sm:p-8 bg-white/80 backdrop-blur-md rounded-3xl shadow-xl hover:shadow-yellow-500/30 transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 bg-yellow-100 rounded-full flex items-center justify-center">
                  <feature.icon className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-600" />
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-black mb-4">
                  {feature.title}
                </h4>
                <p className="text-sm sm:text-base text-gray-600">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}