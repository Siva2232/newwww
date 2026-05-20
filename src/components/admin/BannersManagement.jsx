import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useProducts } from "../../Context/ProductContext";
import {
  Plus,
  Upload,
  Trash2,
  X,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Check,
  FileText,
  Monitor,
  Sparkles,
} from "lucide-react";
import { uploadImage, BASE_URL } from "../../api";
import DeleteConfirmModal from "./DeleteConfirmModal";

const STEPS = [
  { id: 1, title: "Banner copy", subtitle: "Title & message", icon: FileText },
  { id: 2, title: "Hero image", subtitle: "Upload & publish", icon: ImageIcon },
];

const inputClass =
  "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition text-sm";

const getEmptyForm = () => ({
  title: "",
  description: "",
  preview: null,
  imageFile: null,
});

export default function BannersManagement() {
  const { heroBanners, addHeroBanner, deleteHeroBanner } = useProducts();

  const [form, setForm] = useState(getEmptyForm);
  const [currentStep, setCurrentStep] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const fileInputRef = useRef(null);

  const resetForm = () => {
    setForm(getEmptyForm());
    setError("");
    setCurrentStep(1);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed (JPG, PNG, etc.)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5 MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        preview: reader.result,
        imageFile: file,
      }));
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setForm((prev) => ({ ...prev, preview: null, imageFile: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resolveImage = (src) =>
    !src
      ? ""
      : src.startsWith("http") || src.startsWith("data:")
        ? src
        : `${BASE_URL}${src}`;

  const validateStep = (step) => {
    if (step === 1) {
      if (!form.title.trim()) {
        setError("Banner title is required");
        return false;
      }
      const titleLower = form.title.trim().toLowerCase();
      if (heroBanners.some((b) => b.title.toLowerCase() === titleLower)) {
        setError("A banner with this title already exists");
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (!form.imageFile) {
        setError("Please upload a banner image");
        return false;
      }
      return true;
    }
    return true;
  };

  const goNext = () => {
    if (!validateStep(currentStep)) return;
    setError("");
    setCurrentStep((s) => Math.min(s + 1, STEPS.length));
  };

  const goBack = () => {
    setError("");
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2)) {
      if (!validateStep(1)) setCurrentStep(1);
      else setCurrentStep(2);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const uploadResult = await uploadImage(form.imageFile);
      await addHeroBanner({
        title: form.title.trim(),
        description: form.description.trim(),
        imageBase64: uploadResult.path,
      });
      toast.success("Hero banner created");
      resetForm();
    } catch (err) {
      setError(err.message || "Failed to create banner");
      toast.error(err.message || "Failed to create banner");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget?.id) return;
    setDeleteLoading(true);
    try {
      await deleteHeroBanner(deleteTarget.id);
      toast.success("Banner deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete banner");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div
        id="hero-banner-wizard"
        className="bg-white rounded-2xl shadow-lg border border-slate-200/80 overflow-hidden"
      >
        <div className="px-6 py-5 md:px-8 border-b border-slate-100 bg-gradient-to-r from-sky-50 via-indigo-50 to-blue-50/80">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="text-sky-600" size={24} />
                Add New Hero Banner
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Step {currentStep} of {STEPS.length} — {STEPS[currentStep - 1].subtitle}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
              <Monitor size={14} />
              Homepage carousel
            </span>
          </div>

          <div className="mt-5 flex gap-2">
            {STEPS.map((step, idx) => {
              const done = currentStep > step.id;
              const active = currentStep === step.id;
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (step.id < currentStep) setCurrentStep(step.id);
                      else if (step.id === currentStep + 1 && validateStep(currentStep))
                        setCurrentStep(step.id);
                    }}
                    className={`flex items-center gap-2 w-full rounded-xl px-2 py-2 transition ${
                      active ? "bg-white shadow-sm ring-2 ring-sky-500/30" : done ? "opacity-90" : "opacity-55"
                    }`}
                  >
                    <span
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        done
                          ? "bg-emerald-500 text-white"
                          : active
                            ? "bg-sky-600 text-white"
                            : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {done ? <Check size={16} /> : step.id}
                    </span>
                    <span className="hidden sm:block text-left min-w-0">
                      <span className={`block text-xs font-bold truncate ${active ? "text-sky-700" : "text-slate-700"}`}>
                        {step.title}
                      </span>
                      <span className="block text-[10px] text-slate-500 truncate">{step.subtitle}</span>
                    </span>
                  </button>
                  {idx < STEPS.length - 1 && (
                    <div className={`w-4 h-0.5 mx-0.5 rounded ${done ? "bg-emerald-400" : "bg-slate-200"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 md:p-8 min-h-[300px]">
          {error && (
            <div className="mb-5 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          {currentStep === 1 && (
            <div className="max-w-xl space-y-5">
              <Field label="Banner headline *">
                <input
                  type="text"
                  placeholder="Summer Sale — Up to 70% Off!"
                  value={form.title}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, title: e.target.value }));
                    setError("");
                  }}
                  className={inputClass}
                />
              </Field>

              <Field label="Subtext (optional)">
                <textarea
                  value={form.description}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, description: e.target.value }));
                    setError("");
                  }}
                  placeholder="Limited time · Free shipping above ₹999 · Shop now"
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </Field>

              <div className="p-4 rounded-xl bg-sky-50 border border-sky-100 text-sm text-slate-600">
                <p className="font-semibold text-sky-900 flex items-center gap-2 mb-1">
                  <Sparkles size={16} />
                  Pro tip
                </p>
                Keep headlines short (under 8 words). Subtext appears below on the homepage hero.
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Banner image *
                  </label>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleFile(file);
                    }}
                    className={`relative border-2 border-dashed rounded-2xl min-h-[180px] cursor-pointer overflow-hidden transition ${
                      isDragging
                        ? "border-sky-500 bg-sky-50"
                        : form.preview
                          ? "border-sky-400 bg-sky-50/40"
                          : "border-slate-300 hover:border-sky-400 bg-slate-50"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFile(file);
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    {form.preview ? (
                      <div className="relative h-[180px]">
                        <img
                          src={form.preview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearImage();
                          }}
                          className="absolute top-2 right-2 z-20 bg-black/70 text-white p-2 rounded-full"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="h-[180px] flex flex-col items-center justify-center text-slate-500 p-4 text-center">
                        <Upload size={32} className="mb-2 text-sky-500" />
                        <p className="text-sm font-semibold">Upload hero image</p>
                        <p className="text-xs text-slate-400 mt-1">1920×800 recommended · max 5MB</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-3">
                  <p className="text-sm font-semibold text-slate-800 mb-3">Homepage hero preview</p>
                  <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900">
                    <div className="relative aspect-[21/9] min-h-[140px]">
                      {form.preview ? (
                        <img
                          src={form.preview}
                          alt=""
                          className="w-full h-full object-cover opacity-90"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-slate-700 to-slate-800" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-10 max-w-lg">
                        <p className="text-[10px] font-bold text-sky-300 uppercase tracking-widest mb-1">
                          Featured
                        </p>
                        <h3 className="text-xl md:text-2xl font-extrabold text-white leading-tight line-clamp-2">
                          {form.title.trim() || "Your headline here"}
                        </h3>
                        {form.description.trim() && (
                          <p className="text-sm text-slate-200 mt-2 line-clamp-2">
                            {form.description}
                          </p>
                        )}
                        <span className="inline-block mt-4 px-4 py-1.5 bg-white text-slate-900 text-xs font-bold rounded-lg w-fit">
                          Shop now
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-4 flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className={`w-2 h-2 rounded-full ${i === 0 ? "bg-white" : "bg-white/40"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 md:px-8 border-t border-slate-100 bg-slate-50/80 flex flex-wrap justify-between gap-3">
          <button
            type="button"
            onClick={goBack}
            disabled={currentStep === 1}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-white disabled:opacity-40 disabled:pointer-events-none transition"
          >
            <ChevronLeft size={18} />
            Back
          </button>
          <div className="flex gap-2">
            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 text-white font-semibold text-sm hover:bg-sky-700 shadow-md transition"
              >
                Next
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-semibold text-sm hover:from-sky-700 hover:to-indigo-700 shadow-lg disabled:opacity-60 transition"
              >
                {submitting ? (
                  "Publishing..."
                ) : (
                  <>
                    <Check size={18} />
                    Publish banner
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
          <ImageIcon className="text-sky-600" size={22} />
          Active hero banners
          <span className="text-sm font-semibold text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full">
            {heroBanners.length}
          </span>
        </h3>

        {heroBanners.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 py-12 text-center">
            <ImageIcon size={44} className="mx-auto text-slate-300 mb-3" />
            <p className="font-semibold text-slate-600">No hero banners yet</p>
            <p className="text-sm text-slate-400 mt-1">Your homepage carousel will show banners from here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {heroBanners.map((banner, index) => (
              <div
                key={banner._id || banner.id || index}
                className="group rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-sky-200 transition-all"
              >
                <div className="relative aspect-[21/9] bg-slate-100 overflow-hidden">
                  <img
                    src={resolveImage(banner.image) || "https://placehold.co/1200x400?text=Banner"}
                    alt={banner.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/1200x400?text=Banner";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-slate-900 line-clamp-2">{banner.title}</h4>
                  <p className="text-sm text-slate-500 line-clamp-2 mt-1 min-h-[2.5rem]">
                    {banner.description || "No description"}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleDelete(banner._id || banner.id)}
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold py-2.5 rounded-xl text-sm transition"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete this hero banner?"
        description="It will be removed from the homepage carousel immediately."
        itemName={deleteTarget?.name}
        onConfirm={confirmDelete}
        onCancel={() => !deleteLoading && setDeleteTarget(null)}
        isLoading={deleteLoading}
      />
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
