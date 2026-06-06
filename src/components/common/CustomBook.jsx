import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Check,
  ShieldCheck,
  RefreshCw,
  Zap,
  Smartphone,
  Sparkles,
  BookOpen,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";

import ProductSelection from "./ProductSelection";
import StudioForm from "./StudioForm";
import { getImageUrl } from "../../utils/imageUrl";

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: "Certified Quality",
    desc: "Museum-grade paper & Revoria printing",
  },
  {
    icon: RefreshCw,
    title: "Easy Edits",
    desc: "Review your layout before print",
  },
  {
    icon: Zap,
    title: "Rapid Turnaround",
    desc: "7-day production on most orders",
  },
  {
    icon: Smartphone,
    title: "Live Updates",
    desc: "WhatsApp support every step",
  },
];

function StepProgress({ selectedProduct, currentStep, onBackToTemplates }) {
  const steps = [
    { id: 1, label: "Choose book" },
    { id: 2, label: "Your details" },
    { id: 3, label: "Upload photos" },
  ];

  const activeStep = selectedProduct ? currentStep + 1 : 1;

  return (
    <div className="border-b border-black/[0.05] bg-white/80">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        {selectedProduct ? (
          <button
            type="button"
            onClick={onBackToTemplates}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#86868b] transition-colors hover:text-[#1d1d1f]"
          >
            <ChevronLeft size={16} />
            Back to templates
          </button>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-orange-700">
            <Sparkles size={11} aria-hidden />
            Custom book studio
          </div>
        )}

        <div className="flex items-center gap-2 sm:gap-3">
          {steps.map((step, index) => {
            const isComplete = activeStep > step.id;
            const isActive = activeStep === step.id;

            return (
              <div key={step.id} className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold transition-colors ${
                      isComplete
                        ? "bg-[#f7ef22] text-black"
                        : isActive
                          ? "bg-[#1d1d1f] text-white"
                          : "bg-[#f5f5f7] text-[#86868b]"
                    }`}
                  >
                    {isComplete ? <Check size={14} strokeWidth={2.5} /> : step.id}
                  </span>
                  <span
                    className={`hidden text-xs font-semibold sm:inline ${
                      isActive ? "text-[#1d1d1f]" : "text-[#86868b]"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <span className="h-px w-6 bg-black/[0.08] sm:w-10" aria-hidden />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedProduct && (
        <div className="mx-auto max-w-6xl px-4 pb-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 rounded-2xl border border-black/[0.05] bg-[#f5f5f7] px-4 py-3">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white shadow-sm">
              <img
                src={getImageUrl(selectedProduct.image || selectedProduct.mainImage)}
                alt={selectedProduct.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#1d1d1f]">
                {selectedProduct.name}
              </p>
              <p className="text-xs font-medium text-[#86868b]">
                {selectedProduct.price}
                {selectedProduct.shortDesc ? ` · ${selectedProduct.shortDesc}` : ""}
              </p>
            </div>
            <BookOpen size={18} className="shrink-0 text-orange-500" aria-hidden />
          </div>
        </div>
      )}
    </div>
  );
}

function SuccessScreen() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md text-center"
      >
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[#f7ef22] text-black shadow-[0_12px_40px_rgba(247,239,34,0.35)]">
          <Check size={36} strokeWidth={2.5} />
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] sm:text-4xl">
          Order placed successfully
        </h2>
        <p className="mt-3 text-sm font-medium leading-relaxed text-[#86868b] sm:text-base">
          Thank you! Our team will reach out on WhatsApp shortly to confirm your
          custom photo book.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f7ef22] px-8 py-3.5 text-sm font-bold text-black shadow-md transition-all hover:bg-[#f7ef22]/90 hover:scale-105 active:scale-[0.98]"
          >
            Back to home
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
          <Link
            to="/models"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-black/[0.08] bg-white px-8 py-3.5 text-sm font-semibold text-[#1d1d1f] transition-colors hover:bg-[#f5f5f7]"
          >
            Browse shop
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function CustomBook() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });

  const handleBackToTemplates = () => {
    setSelectedProduct(null);
    setCurrentStep(1);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f]">
        <SuccessScreen />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f5f7] text-[#1d1d1f]">
      <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-orange-400/10 blur-[100px]" />
      <div className="pointer-events-none absolute -left-24 bottom-32 h-64 w-64 rounded-full bg-[#f7ef22]/10 blur-[90px]" />

      <div className="relative z-10">
        <StepProgress
          selectedProduct={selectedProduct}
          currentStep={currentStep}
          onBackToTemplates={handleBackToTemplates}
        />

        {!selectedProduct ? (
          <ProductSelection setSelectedProduct={setSelectedProduct} />
        ) : (
          <StudioForm
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              formData={formData}
              setFormData={setFormData}
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
              setIsSubmitted={setIsSubmitted}
            />
        )}

        <footer className="border-t border-black/[0.05] bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center sm:mb-12">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-600">
                Why Perfect Digital
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-[#1d1d1f] sm:text-2xl">
                Crafted with care, delivered with speed
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
              {TRUST_ITEMS.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-[22px] border border-black/[0.05] bg-[#f5f5f7] p-5 transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] sm:p-6"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#f7ef22]/20 text-[#1d1d1f]">
                    <Icon size={20} strokeWidth={1.75} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#1d1d1f]">
                    {title}
                  </p>
                  <p className="mt-1.5 text-xs font-medium leading-relaxed text-[#86868b]">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
