import Container from "../components/common/Container";
import Button from "../components/common/Button";
import { MessageCircle, Globe, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactCTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      className="py-16 md:py-24 bg-black text-white rounded-t-[50px] md:rounded-t-[100px]"
    >
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            Get in <span className="text-[#f7ef22]">Touch</span>
          </h2>
          <p className="text-gray-300 text-base sm:text-lg md:text-xl">
            Have a project or idea? Let’s discuss how we can bring it to life.
          </p>
        </motion.div>

        {/* Grid: Contact Form + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="bg-gray-900/80 p-6 md:p-10 lg:p-12 rounded-2xl shadow-lg border border-gray-700/50 backdrop-blur-sm">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 flex items-center gap-3">
                <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-[#f7ef22]" />
                Send a Message
              </h3>
              <form className="space-y-4 md:space-y-5">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 md:px-5 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#f7ef22]/50 focus:border-transparent transition outline-none"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 md:px-5 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#f7ef22]/50 focus:border-transparent transition outline-none"
                />
                <textarea
                  rows={4}
                  placeholder="Your Message"
                  className="w-full px-4 md:px-5 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#f7ef22]/50 focus:border-transparent transition outline-none resize-none"
                />
                <Button className="w-full py-3.5 md:py-4 rounded-lg bg-[#f7ef22] text-black font-bold hover:bg-[#f7ef22]/90 transition shadow-md text-base md:text-lg hover:scale-105">
                  Send Message
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Quick Contact */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6 md:gap-8"
          >
            <div className="space-y-4 md:space-y-6">
              {[
                {
                  icon: Globe,
                  title: "Schedule a Call",
                  desc: "Book a 15-min discovery call instantly",
                },
                {
                  icon: Mail,
                  title: "Email Us",
                  desc: "hello@studio.com — replied within hours",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start gap-4 p-4 md:p-5 bg-gray-900/80 rounded-xl border border-gray-700/50 hover:shadow-lg hover:shadow-[#f7ef22]/10 transition cursor-pointer"
                >
                  <div className="p-3 rounded-lg bg-[#f7ef22] flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 md:w-6 md:h-6 text-black" />
                  </div>
                  <div>
                    <h4 className="text-base md:text-lg font-semibold">{item.title}</h4>
                    <p className="text-gray-400 text-sm md:text-base">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Fun Quote */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gray-900/50 p-5 md:p-6 rounded-xl text-center border border-gray-700/30"
            >
              <p className="italic text-gray-300 text-sm md:text-base">"The best projects start with a simple hello."</p>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </motion.section>
  );
}