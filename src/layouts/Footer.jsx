import Container from "../components/common/Container";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import hhhh from '../assets/hhhh.jpg';

export default function Footer() {
  const [isLinksOpen, setIsLinksOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const socials = [
    { icon: Facebook, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Linkedin, href: "#" },
  ];

  const links = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Products", href: "/models" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <footer className="relative bg-[#0A0A0A] text-white overflow-hidden">
      <Container className="py-12">
        <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-3 md:gap-12 lg:gap-16">
          {/* Brand Column - Always visible */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <div className="w-32 h-32 mx-auto md:mx-0 bg-yellow-500/10 backdrop-blur-lg rounded-3xl border-2 border-yellow-500/30 flex items-center justify-center shadow-xl overflow-hidden">
              <img
                src={hhhh}
                alt="Perfect Digital Press Logo"
                className="w-[80%] h-[80%] object-contain"
              />
            </div>

            <p className="mt-6 text-sm text-gray-300 leading-relaxed max-w-xs mx-auto md:mx-0">
              A high-fashion creative collective shaping bold narratives in fashion, beauty, and visual culture.
            </p>

            <div className="mt-8 flex justify-center md:justify-start gap-5">
              {socials.map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.15, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="group w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:border-yellow-500 hover:bg-yellow-500/10 transition-all duration-300"
                >
                  <social.icon className="w-5 h-5 text-gray-200 group-hover:text-yellow-400 transition-colors duration-300" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links Column - Dropdown on mobile */}
          <div>
            <button
              onClick={() => setIsLinksOpen(!isLinksOpen)}
              className="md:hidden flex items-center justify-between w-full py-2"
            >
              <h3 className="text-sm tracking-widest text-yellow-500 uppercase font-semibold">
                Company
              </h3>
              <ChevronDown
                className={`w-5 h-5 text-yellow-500 transition-transform duration-300 ${
                  isLinksOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <h3 className="hidden md:block text-sm tracking-widest text-yellow-500 uppercase font-semibold mb-5">
                Company
            </h3>

            <div
              className={`grid transition-all duration-500 ease-in-out ${
                isLinksOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              } md:grid-rows-[1fr]`}
            >
              <ul className="overflow-hidden space-y-4">
                {links.map((link, i) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <a
                      href={link.href}
                      className="group flex items-center text-base text-gray-300 hover:text-yellow-400 transition-all duration-300"
                    >
                      {link.label}
                      <ArrowUpRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 text-yellow-400 transition-all duration-300" />
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Column - Dropdown on mobile */}
          <div>
            <button
              onClick={() => setIsContactOpen(!isContactOpen)}
              className="md:hidden flex items-center justify-between w-full py-2"
            >
              <h3 className="text-sm tracking-widest text-yellow-500 uppercase font-semibold">
                Get in Touch
              </h3>
              <ChevronDown
                className={`w-5 h-5 text-yellow-500 transition-transform duration-300 ${
                  isContactOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <h3 className="hidden md:block text-sm tracking-widest text-yellow-500 uppercase font-semibold mb-5">
              Get in Touch
            </h3>

            <div
              className={`grid transition-all duration-500 ease-in-out ${
                isContactOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              } md:grid-rows-[1fr]`}
            >
              <div className="overflow-hidden space-y-5 text-gray-300">
                <a
                  href="mailto:hello@perfectdigitalpress.com"
                  className="flex items-center gap-3 hover:text-yellow-400 transition duration-300 text-base"
                >
                  <Mail className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  hello@perfectdigitalpress.com
                </a>

                <a
                  href="tel:+15559876543"
                  className="flex items-center gap-3 hover:text-yellow-400 transition duration-300 text-base"
                >
                  <Phone className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  +1 (555) 987-6543
                </a>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <p className="leading-relaxed text-base">
                    123 Creative District<br />
                    Los Angeles, CA 90013
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright & Legal */}
        <div className="mt-10 pt-8 border-t border-white/10 text-center text-sm text-gray-400">
          <p className="mb-4">
            © {new Date().getFullYear()} Perfect Digital Press. All Rights Reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#" className="hover:text-yellow-400 transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-yellow-400 transition">
              Terms of Service
            </a>
            <a href="#" className="hover:text-yellow-400 transition">
              Cookie Policy
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}