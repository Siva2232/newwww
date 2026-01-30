import React, { useState } from "react";
import Container from "../components/common/Container";
import { MessageCircle, Globe, Mail, Sparkles, Send, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactCTA() {
  const [focused, setFocused] = useState(null);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative py-20 md:py-32 bg-white text-[#1d1d1f] overflow-hidden"
    >
      {/* SUBTLE ARCHITECTURAL ELEMENTS */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#fbfbfd] -skew-x-12 translate-x-1/2 pointer-events-none" />

      <Container>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* LEFT: MINIMALIST HEADER */}
          <div className="lg:col-span-5 pt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500">
                <Sparkles size={10} />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Open for Collaboration</span>
              </div>
              
              <h2 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.85] text-black">
                Talk is <br />
                <span className="text-slate-300 italic">Cheap.</span> <br />
                Build with us.
              </h2>
              
              <p className="text-slate-500 text-lg max-w-sm font-medium leading-relaxed">
                Have a vision? We have the craft. Reach out and let's define the next big thing together.
              </p>

              <div className="pt-10 flex flex-wrap gap-4">
                <ContactLink icon={Globe} label="Discovery Call" sub="Schedule 15m" color="bg-blue-50 text-blue-600" />
                <ContactLink icon={Mail} label="Email Us" sub="hello@studio.com" color="bg-amber-50 text-amber-600" />
              </div>
            </motion.div>
          </div>

          {/* RIGHT: THE BENTO FORM */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="bg-[#f5f5f7] p-8 md:p-12 rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] border border-white/50">
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <GalleryInput 
                    label="Identify" 
                    placeholder="Your Name" 
                    isFocused={focused === 'name'} 
                    onFocus={() => setFocused('name')} 
                    onBlur={() => setFocused(null)} 
                  />
                  <GalleryInput 
                    label="Reach" 
                    placeholder="Email Address" 
                    isFocused={focused === 'email'} 
                    onFocus={() => setFocused('email')} 
                    onBlur={() => setFocused(null)} 
                  />
                </div>

                <div className="relative group">
                   <label className={`text-[10px] font-black uppercase tracking-widest mb-3 block transition-colors ${focused === 'msg' ? 'text-black' : 'text-slate-400'}`}>The Brief</label>
                   <textarea 
                      rows={4}
                      onFocus={() => setFocused('msg')}
                      onBlur={() => setFocused(null)}
                      placeholder="Tell us everything..."
                      className="w-full bg-white border-none rounded-2xl p-6 text-sm font-medium shadow-sm focus:ring-2 focus:ring-black/5 outline-none transition-all resize-none placeholder:text-slate-300"
                   />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-between bg-black text-white px-8 py-5 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all hover:bg-slate-800 shadow-xl shadow-black/10"
                >
                  Start the Conversation
                  <div className="bg-white/10 p-2 rounded-lg">
                    <ArrowUpRight size={16} />
                  </div>
                </motion.button>

                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">
                  We usually respond within one business cycle.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </Container>
    </motion.section>
  );
}

// SUBCOMPONENTS
const GalleryInput = ({ label, isFocused, ...props }) => (
  <div className="space-y-3">
    <label className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isFocused ? 'text-black' : 'text-slate-400'}`}>
      {label}
    </label>
    <input 
      {...props}
      className="w-full bg-white border-none rounded-xl px-6 py-4 text-sm font-semibold shadow-sm focus:ring-2 focus:ring-black/5 transition-all outline-none placeholder:text-slate-300"
    />
  </div>
);

const ContactLink = ({ icon: Icon, label, sub, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="flex items-center gap-4 cursor-pointer group"
  >
    <div className={`p-3 rounded-xl transition-all ${color} group-hover:shadow-lg`}>
      <Icon size={18} />
    </div>
    <div>
      <h4 className="text-[10px] font-black uppercase tracking-tighter text-black">{label}</h4>
      <p className="text-xs text-slate-400">{sub}</p>
    </div>
  </motion.div>
);