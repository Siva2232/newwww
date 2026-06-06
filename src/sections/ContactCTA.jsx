import React, { useState } from "react";
import { Link } from "react-router-dom";
import Container from "../components/common/Container";
import {
  Globe,
  Mail,
  Sparkles,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const WHATSAPP = "9746683778";
const EMAIL = "hello@studio.com";

function GalleryInput({ label, isFocused, id, ...props }) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className={`text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors ${
          isFocused ? "text-[#1d1d1f]" : "text-[#86868b]"
        }`}
      >
        {label}
      </label>
      <input
        id={id}
        {...props}
        className="w-full rounded-xl border border-transparent bg-white px-4 py-3.5 text-sm font-medium text-[#1d1d1f] shadow-sm outline-none transition-all placeholder:text-[#86868b]/60 focus:border-orange-200/80 focus:ring-2 focus:ring-orange-500/15"
      />
    </div>
  );
}

function ContactLink({ icon: Icon, label, sub, href, external }) {
  const className =
    "group flex items-center gap-4 rounded-2xl border border-black/[0.05] bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)]";

  const inner = (
    <>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition-colors group-hover:bg-orange-100">
        <Icon size={18} strokeWidth={2} />
      </div>
      <div className="min-w-0">
        <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#1d1d1f]">
          {label}
        </h4>
        <p className="truncate text-sm font-medium text-[#86868b]">{sub}</p>
      </div>
      <ArrowRight
        size={16}
        className="ml-auto shrink-0 text-[#86868b] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
      />
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link to={href} className={className}>
      {inner}
    </Link>
  );
}

export default function ContactCTA() {
  const [focused, setFocused] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Hook up API when ready — for now route to contact page
    window.location.href = "/contact";
  };

  return (
    <section className="relative overflow-hidden bg-[#f5f5f7] py-16 text-[#1d1d1f] sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-orange-200/20 blur-[100px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-sky-200/15 blur-[100px]" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="space-y-5 sm:space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/90 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-orange-700">
                <Sparkles size={12} aria-hidden />
                Get in touch
              </div>

              <h2 className="text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f]">
                Let&apos;s create
                <span className="block text-[#86868b]">something lasting.</span>
              </h2>

              <p className="max-w-md text-sm font-medium leading-relaxed text-[#6e6e73] sm:text-base">
                Questions about frames, albums, or a custom book? Send a message
                and our team will get back to you shortly.
              </p>

              <div className="grid gap-3 pt-4 sm:grid-cols-1">
                <ContactLink
                  icon={MessageCircle}
                  label="WhatsApp"
                  sub={`+${WHATSAPP}`}
                  href={`https://wa.me/${WHATSAPP}`}
                  external
                />
                <ContactLink
                  icon={Mail}
                  label="Email"
                  sub={EMAIL}
                  href={`mailto:${EMAIL}`}
                  external
                />
                <ContactLink
                  icon={Globe}
                  label="Visit studio"
                  sub="Full contact page"
                  href="/contact"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <div className="rounded-[28px] border border-black/[0.05] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)] sm:p-8 md:p-10">
              <div className="mb-8">
                <h3 className="text-lg font-semibold tracking-tight text-[#1d1d1f] sm:text-xl">
                  Send a message
                </h3>
                <p className="mt-1 text-sm font-medium text-[#86868b]">
                  We typically reply within one business day.
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
                  <GalleryInput
                    id="cta-name"
                    label="Name"
                    placeholder="Your name"
                    isFocused={focused === "name"}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                    required
                  />
                  <GalleryInput
                    id="cta-email"
                    label="Email"
                    type="email"
                    placeholder="you@email.com"
                    isFocused={focused === "email"}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="cta-message"
                    className={`text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                      focused === "msg" ? "text-[#1d1d1f]" : "text-[#86868b]"
                    }`}
                  >
                    Message
                  </label>
                  <textarea
                    id="cta-message"
                    rows={4}
                    onFocus={() => setFocused("msg")}
                    onBlur={() => setFocused(null)}
                    placeholder="Tell us about your project..."
                    className="w-full resize-none rounded-xl border border-transparent bg-[#f5f5f7] px-4 py-3.5 text-sm font-medium text-[#1d1d1f] shadow-sm outline-none transition-all placeholder:text-[#86868b]/60 focus:border-orange-200/80 focus:bg-white focus:ring-2 focus:ring-orange-500/15"
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.98 }}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#f7ef22] px-6 py-3.5 text-sm font-bold text-black shadow-md transition-all hover:bg-[#f7ef22]/90 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Send message
                  <ArrowRight size={16} strokeWidth={2} />
                </motion.button>

                <p className="text-center text-[10px] font-medium uppercase tracking-[0.12em] text-[#86868b]">
                  Or call{" "}
                  <a
                    href={`tel:+${WHATSAPP}`}
                    className="text-[#1d1d1f] underline-offset-2 hover:underline"
                  >
                    +{WHATSAPP}
                  </a>
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
