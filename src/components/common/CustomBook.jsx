// src/components/CustomBook.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, ShieldCheck, RefreshCw, Zap, Smartphone } from "lucide-react";

import ProductSelection from "./ProductSelection";
import StudioForm from "./StudioForm";

const products = [
  { id: 1, name: "Wedding Edition", price: "₹4,999", tag: "Signature", image: "https://images.unsplash.com/photo-1519741497674-2814507a8d8e?w=800" },
  { id: 2, name: "Essential Edition", price: "₹2,999", tag: "Essential", image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800" },
  { id: 3, name: "Baby Heirloom", price: "₹2,499", tag: "Gift", image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800" },
];

export default function CustomBook() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [previews, setPreviews] = useState([]);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="h-24 w-24 bg-zinc-900 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Check size={40} />
          </div>
          <h2 className="text-5xl font-bold tracking-tighter mb-4 uppercase">Order Placed</h2>
          <p className="text-zinc-400 text-lg mb-8">We'll reach out on WhatsApp shortly.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-12 py-5 bg-zinc-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em]"
          >
            Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1d1d1f]">
      {!selectedProduct ? (
        <ProductSelection
          products={products}
          setSelectedProduct={setSelectedProduct}
          fadeInUp={fadeInUp}
        />
      ) : (
        <StudioForm
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          formData={formData}
          setFormData={setFormData}
          previews={previews}
          setPreviews={setPreviews}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          setIsSubmitted={setIsSubmitted}
        />
      )}

      {/* Trust badges footer */}
      <footer className="py-20 border-t border-zinc-100 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { icon: <ShieldCheck />, title: "Certified Quality", desc: "Museum-grade paper" },
            { icon: <RefreshCw />, title: "Easy Edits", desc: "Review before print" },
            { icon: <Zap />, title: "Rapid Ship", desc: "7-day turnaround" },
            { icon: <Smartphone />, title: "Live Updates", desc: "WhatsApp Support" },
          ].map((item, i) => (
            <div key={i} className="space-y-3">
              <div className="text-zinc-400">{item.icon}</div>
              <p className="font-black text-[10px] uppercase tracking-widest">{item.title}</p>
              <p className="text-zinc-400 text-xs font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}