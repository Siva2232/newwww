import { useState } from "react";
import { Link } from "react-router-dom";
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
  MessageCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import logo from "../assets/hhhh.jpg";

const WHATSAPP = "9746683778";
const EMAIL = "hello@perfectdigitalpress.com";

const socials = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "Linkedin" },
];

const companyLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Shop", to: "/models" },
  { label: "Custom Book", to: "/custom-book" },
  { label: "Services", to: "/services" },
  // { label: "Portfolio", to: "/portfolio" },
  { label: "Contact", to: "/contact" },
];

const legalLinks = [
  { label: "Privacy Policy", to: "#" },
  { label: "Terms of Service", to: "#" },
  { label: "Cookie Policy", to: "#" },
];

function FooterColumn({ title, open, onToggle, children }) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-2 md:pointer-events-none md:cursor-default"
        aria-expanded={open}
      >
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-400">
          {title}
        </h3>
        <ChevronDown
          className={`h-5 w-5 text-orange-400 transition-transform duration-300 md:hidden ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-out md:grid-rows-[1fr] ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden pt-2 md:pt-4">{children}</div>
      </div>
    </div>
  );
}

function FooterLink({ to, children, external }) {
  const className =
    "group inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition-colors hover:text-white";

  if (external || to.startsWith("http") || to.startsWith("mailto") || to.startsWith("tel")) {
    return (
      <a href={to} className={className} target={to.startsWith("http") ? "_blank" : undefined} rel={to.startsWith("http") ? "noopener noreferrer" : undefined}>
        {children}
        {to.startsWith("http") && (
          <ArrowUpRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100" />
        )}
      </a>
    );
  }

  return (
    <Link to={to} className={className}>
      {children}
      <ArrowUpRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}

export default function Footer() {
  const [linksOpen, setLinksOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-[#1d1d1f] text-white">
      <div className="pointer-events-none absolute -left-32 top-0 h-64 w-64 rounded-full bg-orange-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-64 w-64 rounded-full bg-orange-500/5 blur-[100px]" />

      <Container className="relative z-10 py-14 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10 lg:gap-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-5 lg:col-span-4"
          >
            <Link to="/" className="inline-block">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm sm:h-[72px] sm:w-[72px]">
                <img
                  src={logo}
                  alt="Perfect Digital Press"
                  className="h-[78%] w-[78%] object-contain mix-blend-screen"
                />
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-sm font-medium leading-relaxed text-white/60">
              Premium frames, albums, and photo books — crafted to preserve your
              memories with museum-grade quality.
            </p>

            <Link
              to="/models"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-[#1d1d1f] transition-all hover:bg-[#f5f5f7] active:scale-[0.98]"
            >
              Shop now
              <ArrowUpRight size={14} strokeWidth={2} />
            </Link>

            <div className="mt-8 flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:border-orange-400/40 hover:bg-orange-500/10 hover:text-orange-300"
                >
                  <Icon size={18} strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Company */}
          <div className="md:col-span-3 lg:col-span-2 md:col-start-6 lg:col-start-6">
            <FooterColumn
              title="Company"
              open={linksOpen}
              onToggle={() => setLinksOpen(!linksOpen)}
            >
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.to}>
                    <FooterLink to={link.to}>{link.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </FooterColumn>
          </div>

          {/* Contact */}
          <div className="md:col-span-4 lg:col-span-3">
            <FooterColumn
              title="Get in touch"
              open={contactOpen}
              onToggle={() => setContactOpen(!contactOpen)}
            >
              <ul className="space-y-4">
                <li>
                  <a
                    href={`https://wa.me/${WHATSAPP}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 text-sm font-medium text-white/70 transition-colors hover:text-white"
                  >
                    <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-orange-400" />
                    <span>WhatsApp · +{WHATSAPP}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="group flex items-start gap-3 text-sm font-medium text-white/70 transition-colors hover:text-white"
                  >
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-orange-400" />
                    <span className="break-all">{EMAIL}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:+${WHATSAPP}`}
                    className="group flex items-start gap-3 text-sm font-medium text-white/70 transition-colors hover:text-white"
                  >
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-orange-400" />
                    <span>+{WHATSAPP}</span>
                  </a>
                </li>
                <li className="flex items-start gap-3 text-sm font-medium leading-relaxed text-white/60">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-orange-400" />
                  <span>
                    Perfect Digital Press
                    <br />
                    Studio & showroom — visit by appointment
                  </span>
                </li>
              </ul>
            </FooterColumn>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-center text-xs font-medium text-white/45 sm:text-left">
            © {new Date().getFullYear()} Perfect Digital Press. All rights
            reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-5 sm:gap-6">
            {legalLinks.map((link) => (
              <a
                key={link.label}
                href={link.to}
                className="text-xs font-medium text-white/45 transition-colors hover:text-orange-300"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
