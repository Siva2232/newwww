import { useRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Sparkles,
  Gift,
  Upload,
  X,
  Trash2,
  Pencil,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Check,
  FileText,
  Image as ImageIcon,
  Tag,
} from "lucide-react";
import {
  getSpecialOffers,
  updateSpecialOffer,
  createSpecialOffer,
  deleteSpecialOffer,
  uploadImage,
  BASE_URL,
} from "../../api";
import DeleteConfirmModal from "./DeleteConfirmModal";

const STEPS = [
  { id: 1, title: "Offer details", subtitle: "Title & copy", icon: FileText },
  { id: 2, title: "Banner image", subtitle: "Visual & publish", icon: ImageIcon },
];

const CATEGORY_PRESETS = ["Exclusive", "Frames", "Albums", "Gifts", "Limited"];

const inputClass =
  "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition text-sm";

const getEmptyForm = () => ({
  title: "",
  description: "",
  category: "Exclusive",
  preview: null,
  imageFile: null,
});

const SpecialOffersAdmin = () => {
  const [specialOffers, setSpecialOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(getEmptyForm);
  const [currentStep, setCurrentStep] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const data = await getSpecialOffers();
      setSpecialOffers(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Special offers fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const resetForm = () => {
    setForm(getEmptyForm());
    setError(null);
    setEditingId(null);
    setCurrentStep(1);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const cancelEdit = () => resetForm();

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5 MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, preview: reader.result, imageFile: file }));
      setError(null);
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
        setError("Offer title is required");
        return false;
      }
      if (!form.category.trim()) {
        setError("Category is required");
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (!form.imageFile && !form.preview) {
        setError("Please upload an offer image");
        return false;
      }
      return true;
    }
    return true;
  };

  const goNext = () => {
    if (!validateStep(currentStep)) return;
    setError(null);
    setCurrentStep((s) => Math.min(s + 1, STEPS.length));
  };

  const goBack = () => {
    setError(null);
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2)) {
      if (!validateStep(1)) setCurrentStep(1);
      else setCurrentStep(2);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      let imagePath = form.preview;
      if (form.imageFile) {
        const uploadResult = await uploadImage(form.imageFile);
        imagePath = uploadResult.path;
      } else if (form.preview && !form.preview.startsWith("data:")) {
        if (form.preview.includes("/uploads/")) {
          imagePath = form.preview.slice(form.preview.indexOf("/uploads/"));
        } else {
          imagePath = form.preview.replace(BASE_URL, "");
        }
      }

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        image: imagePath,
        category: form.category.trim(),
      };

      if (editingId) {
        await updateSpecialOffer(editingId, payload);
        toast.success("Special offer updated");
      } else {
        await createSpecialOffer(payload);
        toast.success("Special offer created");
      }
      resetForm();
      await fetchOffers();
    } catch (err) {
      setError(err.message || "Failed to save offer");
      toast.error(err.message || "Failed to save offer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (offer) => {
    setForm({
      title: offer.title || "",
      description: offer.description || "",
      imageFile: null,
      preview: offer.image
        ? offer.image.startsWith("data:") || offer.image.startsWith("http")
          ? offer.image
          : `${BASE_URL}${offer.image}`
        : null,
      category: offer.category || "Exclusive",
    });
    setError(null);
    setEditingId(offer._id || offer.id);
    setCurrentStep(1);
    if (fileInputRef.current) fileInputRef.current.value = "";
    document.getElementById("special-offer-wizard")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const confirmDelete = async () => {
    if (!deleteTarget?.id) return;
    setDeleteLoading(true);
    try {
      await deleteSpecialOffer(deleteTarget.id);
      await fetchOffers();
      toast.success("Offer deleted");
      if (editingId === deleteTarget.id) cancelEdit();
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div
        id="special-offer-wizard"
        className="bg-white rounded-2xl shadow-lg border border-slate-200/80 overflow-hidden"
      >
        <div className="px-6 py-5 md:px-8 border-b border-slate-100 bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50/80">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="text-orange-600" size={24} />
                {editingId ? "Edit Special Offer" : "Add Special Offer"}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Step {currentStep} of {STEPS.length} — {STEPS[currentStep - 1].subtitle}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="text-sm font-semibold text-slate-600 hover:text-rose-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 transition"
                >
                  Cancel edit
                </button>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold">
                <Gift size={14} />
                Promotion
              </span>
            </div>
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
                      active ? "bg-white shadow-sm ring-2 ring-orange-500/30" : done ? "opacity-90" : "opacity-55"
                    }`}
                  >
                    <span
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        done
                          ? "bg-emerald-500 text-white"
                          : active
                            ? "bg-orange-500 text-white"
                            : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {done ? <Check size={16} /> : step.id}
                    </span>
                    <span className="hidden sm:block text-left min-w-0">
                      <span className={`block text-xs font-bold truncate ${active ? "text-orange-700" : "text-slate-700"}`}>
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

        <div className="p-6 md:p-8 min-h-[280px]">
          {error && (
            <div className="mb-5 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          {currentStep === 1 && (
            <div className="max-w-xl space-y-5">
              <Field label="Offer title *">
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, title: e.target.value }));
                    setError(null);
                  }}
                  placeholder="e.g. 20% Off Premium Frames"
                  className={inputClass}
                />
              </Field>

              <Field label="Category *">
                <div className="flex flex-wrap gap-2 mb-2">
                  {CATEGORY_PRESETS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, category: c }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                        form.category === c
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-white text-slate-600 border-slate-200 hover:border-orange-300"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                    placeholder="Or type custom category"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </Field>

              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Short promo text shown on the homepage carousel..."
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
              </Field>
            </div>
          )}

          {currentStep === 2 && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Offer banner *
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
                  className={`relative border-2 border-dashed rounded-2xl min-h-[220px] cursor-pointer overflow-hidden transition ${
                    isDragging
                      ? "border-orange-500 bg-orange-50 scale-[1.01]"
                      : form.preview
                        ? "border-orange-400 bg-orange-50/40"
                        : "border-slate-300 hover:border-orange-400 bg-slate-50"
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
                    <div className="relative h-[220px]">
                      <img
                        src={resolveImage(form.preview)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearImage();
                        }}
                        className="absolute top-3 right-3 z-20 bg-black/70 text-white p-2 rounded-full"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="h-[220px] flex flex-col items-center justify-center text-slate-500">
                      <Upload size={36} className="mb-2 text-orange-500" />
                      <p className="text-sm font-semibold">Drag & drop or click</p>
                      <p className="text-xs text-slate-400 mt-1">Square · max 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800 mb-3">Homepage preview</p>
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-gradient-to-br from-orange-500 to-amber-500 p-1">
                  <div className="rounded-xl overflow-hidden bg-white">
                    <div className="aspect-[16/10] bg-slate-100 relative">
                      {form.preview ? (
                        <img
                          src={resolveImage(form.preview)}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-orange-200">
                          <Gift size={40} />
                        </div>
                      )}
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-orange-600 text-white text-[10px] font-bold rounded">
                        SPECIAL
                      </span>
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wide">
                        {form.category || "Category"}
                      </p>
                      <h3 className="font-bold text-slate-900 mt-0.5 line-clamp-1">
                        {form.title.trim() || "Offer title"}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {form.description.trim() || "Description text"}
                      </p>
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
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 shadow-md transition"
              >
                Next
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold text-sm hover:from-orange-600 hover:to-amber-600 shadow-lg disabled:opacity-60 transition"
              >
                {submitting ? (
                  "Saving..."
                ) : (
                  <>
                    <Check size={18} />
                    {editingId ? "Update offer" : "Publish offer"}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
          <Gift className="text-orange-600" size={22} />
          Active offers
          <span className="text-sm font-semibold text-orange-700 bg-orange-100 px-2.5 py-0.5 rounded-full">
            {specialOffers.length}
          </span>
        </h2>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
          </div>
        ) : specialOffers.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 py-12 text-center">
            <Sparkles size={40} className="mx-auto text-orange-300 mb-3" />
            <p className="font-semibold text-slate-600">No special offers yet</p>
            <p className="text-sm text-slate-400 mt-1">Create your first promo with the wizard above</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {specialOffers.map((offer, idx) => {
              const oid = offer._id || offer.id || idx;
              const isEditing = editingId === oid;
              return (
                <div
                  key={oid}
                  className={`rounded-2xl border overflow-hidden flex flex-col transition-all ${
                    isEditing
                      ? "border-orange-500 ring-2 ring-orange-200 shadow-lg"
                      : "border-slate-200 hover:shadow-lg hover:border-orange-200"
                  }`}
                >
                  <div className="relative aspect-[16/10] bg-slate-100">
                    <img
                      src={resolveImage(offer.image) || "https://placehold.co/640x400?text=Offer"}
                      alt={offer.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/640x400?text=Offer";
                      }}
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-orange-600 text-white text-[10px] font-bold rounded">
                      {offer.category}
                    </span>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-slate-900 line-clamp-1">{offer.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 flex-1">{offer.description}</p>
                    <div className="flex gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() => handleEdit(offer)}
                        className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteTarget({ id: oid, name: offer.title })
                        }
                        className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete this special offer?"
        description="It will be removed from the homepage offers carousel."
        itemName={deleteTarget?.name}
        onConfirm={confirmDelete}
        onCancel={() => !deleteLoading && setDeleteTarget(null)}
        isLoading={deleteLoading}
      />
    </div>
  );
};

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export default SpecialOffersAdmin;
