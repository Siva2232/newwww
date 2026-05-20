import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useProducts } from "../../Context/ProductContext";
import {
  Plus,
  Upload,
  Trash2,
  X,
  Image as ImageIcon,
  Link2,
  ChevronLeft,
  ChevronRight,
  Check,
  Layers,
  Sparkles,
  FolderTree,
  Grid3X3,
} from "lucide-react";
import { uploadImage, BASE_URL } from "../../api";
import DeleteConfirmModal from "./DeleteConfirmModal";

const STEPS = [
  { id: 1, title: "Setup", subtitle: "Parent & name", icon: Layers },
  { id: 2, title: "Finish", subtitle: "Image & publish", icon: ImageIcon },
];

const inputClass =
  "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-100 outline-none transition text-sm";

const getEmptyForm = () => ({
  name: "",
  category: "",
  link: "",
  preview: null,
  imageFile: null,
  description: "",
});

export default function SubcategoriesManagement() {
  const {
    shopCategories,
    shopSubCategories,
    addSubCategory,
    deleteSubCategory,
  } = useProducts();

  const [form, setForm] = useState(getEmptyForm);
  const [currentStep, setCurrentStep] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const fileInputRef = useRef(null);

  const generateSlug = (name) => {
    if (!name?.trim()) return "";
    return `/subcategory/${name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")}`;
  };

  const resetForm = () => {
    setForm(getEmptyForm());
    setError("");
    setCurrentStep(1);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const clearImage = () => {
    setForm((prev) => ({ ...prev, preview: null, imageFile: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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
      setForm((prev) => ({
        ...prev,
        preview: reader.result,
        imageFile: file,
      }));
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const validateStep = (step) => {
    if (step === 1) {
      if (!form.category) {
        setError("Select a parent category");
        return false;
      }
      if (!form.name.trim()) {
        setError("Subcategory name is required");
        return false;
      }
      const nameLower = form.name.trim().toLowerCase();
      const exists = shopSubCategories.some(
        (c) =>
          c.name.toLowerCase() === nameLower &&
          (c.category === form.category ||
            (typeof c.category === "object" && c.category?.name === form.category))
      );
      if (exists) {
        setError("This subcategory already exists under that category");
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
    if (!validateStep(1)) {
      setCurrentStep(1);
      return;
    }

    const slug = form.link.trim() || generateSlug(form.name);
    setSubmitting(true);
    setError("");

    try {
      const payload = {
        name: form.name.trim(),
        category: form.category,
        link: slug,
        description: form.description.trim(),
      };
      if (form.imageFile) {
        const uploadResult = await uploadImage(form.imageFile);
        payload.imageBase64 = uploadResult.path;
      }
      await addSubCategory(payload);
      toast.success("Subcategory created successfully");
      resetForm();
    } catch (err) {
      setError(err.message || "Failed to create subcategory");
      toast.error(err.message || "Failed to create subcategory");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget?.id) return;
    setDeleteLoading(true);
    try {
      await deleteSubCategory(deleteTarget.id);
      toast.success("Subcategory deleted successfully");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete subcategory");
    } finally {
      setDeleteLoading(false);
    }
  };

  const resolveImage = (src) =>
    !src
      ? ""
      : src.startsWith("http") || src.startsWith("data:")
        ? src
        : `${BASE_URL}${src}`;

  const slugPreview = form.link.trim() || generateSlug(form.name);
  const parentCategory = shopCategories.find((c) => c.name === form.category);

  return (
    <div className="space-y-8 pb-10">
      <div
        id="subcategory-form-wizard"
        className="bg-white rounded-2xl shadow-lg border border-slate-200/80 overflow-hidden"
      >
        <div className="px-6 py-5 md:px-8 border-b border-slate-100 bg-gradient-to-r from-fuchsia-50 to-purple-50/80">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Plus className="text-fuchsia-600" size={24} />
                Add New Subcategory
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Step {currentStep} of {STEPS.length} — {STEPS[currentStep - 1].subtitle}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-100 text-fuchsia-700 text-xs font-bold">
              <Sparkles size={14} />
              Nested under category
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
                      active ? "bg-white shadow-sm ring-2 ring-fuchsia-500/30" : done ? "opacity-90" : "opacity-55"
                    }`}
                  >
                    <span
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        done
                          ? "bg-emerald-500 text-white"
                          : active
                            ? "bg-fuchsia-600 text-white"
                            : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {done ? <Check size={16} /> : step.id}
                    </span>
                    <span className="hidden sm:block text-left min-w-0">
                      <span className={`block text-xs font-bold truncate ${active ? "text-fuchsia-700" : "text-slate-700"}`}>
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

          {shopCategories.length === 0 && currentStep === 1 && (
            <div className="mb-5 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
              Create a <strong>main category</strong> first before adding subcategories.
            </div>
          )}

          {currentStep === 1 && (
            <div className="max-w-xl space-y-5">
              <Field label="Parent category *">
                <div className="relative">
                  <Grid3X3
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <select
                    value={form.category}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, category: e.target.value }));
                      setError("");
                    }}
                    disabled={shopCategories.length === 0}
                    className={`${inputClass} pl-10 appearance-none`}
                  >
                    <option value="">Select parent category</option>
                    {shopCategories.map((cat) => (
                      <option key={cat._id || cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </Field>

              <Field label="Subcategory name *">
                <input
                  type="text"
                  placeholder="e.g. Premium, Pulse, Classic"
                  value={form.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      name: val,
                      link: prev.link || generateSlug(val),
                    }));
                    setError("");
                  }}
                  className={inputClass}
                />
              </Field>

              <Field label="URL path (optional)">
                <div className="relative">
                  <Link2
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="/subcategory/premium"
                    value={form.link}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, link: e.target.value }));
                      setError("");
                    }}
                    className={`${inputClass} pl-10 font-mono`}
                  />
                </div>
                {form.name.trim() && (
                  <p className="text-xs text-slate-500 mt-2">
                    Preview: <span className="font-mono text-fuchsia-600">{slugPreview}</span>
                  </p>
                )}
              </Field>

              <Field label="Description (optional)">
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Internal note or short blurb for this subcategory"
                  className={`${inputClass} resize-none`}
                />
              </Field>
            </div>
          )}

          {currentStep === 2 && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Image <span className="text-slate-400 font-normal">(optional)</span>
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
                  className={`relative border-2 border-dashed rounded-2xl min-h-[200px] cursor-pointer overflow-hidden transition ${
                    isDragging
                      ? "border-fuchsia-500 bg-fuchsia-50"
                      : form.preview
                        ? "border-fuchsia-400 bg-fuchsia-50/40"
                        : "border-slate-300 hover:border-fuchsia-400 bg-slate-50"
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
                    <div className="relative h-[200px]">
                      <img src={form.preview} alt="" className="w-full h-full object-cover" />
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
                    <div className="h-[200px] flex flex-col items-center justify-center text-slate-500">
                      <Upload size={32} className="mb-2 text-fuchsia-500" />
                      <p className="text-sm font-semibold">Skip or upload now</p>
                      <p className="text-xs text-slate-400 mt-1">You can add an image later</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800 mb-3">Preview</p>
                <div className="rounded-2xl border border-slate-200 bg-white shadow-md overflow-hidden">
                  <div className="px-4 py-2 bg-fuchsia-600 text-white text-xs font-bold flex items-center gap-2">
                    <Layers size={14} />
                    {form.category || "Parent category"}
                  </div>
                  <div className="aspect-[4/3] bg-slate-100">
                    {form.preview ? (
                      <img src={form.preview} alt="" className="w-full h-full object-cover" />
                    ) : parentCategory?.image ? (
                      <img
                        src={resolveImage(parentCategory.image)}
                        alt=""
                        className="w-full h-full object-cover opacity-60"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ImageIcon size={40} />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-[11px] text-fuchsia-600 font-semibold uppercase tracking-wide">
                      Subcategory
                    </p>
                    <p className="font-bold text-slate-900 text-lg truncate">
                      {form.name.trim() || "Name"}
                    </p>
                    {form.description && (
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">{form.description}</p>
                    )}
                    <p className="text-[10px] font-mono text-slate-400 mt-2 truncate">{slugPreview}</p>
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
                disabled={shopCategories.length === 0}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-fuchsia-600 text-white font-semibold text-sm hover:bg-fuchsia-700 shadow-md disabled:opacity-50 transition"
              >
                Next
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white font-semibold text-sm hover:from-fuchsia-700 hover:to-purple-700 shadow-lg disabled:opacity-60 transition"
              >
                {submitting ? (
                  "Creating..."
                ) : (
                  <>
                    <Check size={18} />
                    Create subcategory
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
          <FolderTree className="text-fuchsia-600" size={22} />
          Your subcategories
          <span className="text-sm font-semibold text-fuchsia-600 bg-fuchsia-100 px-2.5 py-0.5 rounded-full">
            {shopSubCategories.length}
          </span>
        </h3>

        {shopSubCategories.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
            <Layers size={44} className="mx-auto text-slate-300 mb-3" />
            <p className="font-semibold text-slate-600">No subcategories yet</p>
            <p className="text-sm text-slate-400 mt-1">Use the wizard above to add your first one</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {shopSubCategories.map((cat, idx) => (
              <div
                key={cat._id || cat.id || `sub-${idx}`}
                className="group rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-fuchsia-200 transition-all"
              >
                <div className="relative aspect-square bg-slate-100">
                  <img
                    src={
                      cat.image
                        ? resolveImage(cat.image)
                        : "https://placehold.co/400x400?text=Sub"
                    }
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/400x400?text=Sub";
                    }}
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-fuchsia-600/90 text-white text-[10px] font-bold truncate max-w-[85%]">
                    {cat.category?.name || cat.category}
                  </span>
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-slate-900 text-sm line-clamp-2">{cat.name}</h4>
                  <p className="text-[10px] font-mono text-slate-400 mt-1 truncate">{cat.link}</p>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat._id || cat.id)}
                    className="mt-3 w-full flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold py-2 rounded-lg transition"
                  >
                    <Trash2 size={14} />
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
        title="Delete this subcategory?"
        description="It will be removed from shop filters. This cannot be undone."
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
