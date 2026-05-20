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
  Tag,
  Sparkles,
  FolderOpen,
} from "lucide-react";
import { uploadImage, BASE_URL } from "../../api";
import DeleteConfirmModal from "./DeleteConfirmModal";

const STEPS = [
  { id: 1, title: "Details", subtitle: "Name & link", icon: Tag },
  { id: 2, title: "Image", subtitle: "Upload & publish", icon: ImageIcon },
];

const inputClass =
  "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition text-sm";

const getEmptyForm = () => ({
  name: "",
  link: "",
  preview: null,
  imageFile: null,
});

export default function CategoriesManagement() {
  const { shopCategories, addCategory, deleteCategory } = useProducts();

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
    return `/category/${name
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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const validateStep = (step) => {
    if (step === 1) {
      if (!form.name.trim()) {
        setError("Category name is required");
        return false;
      }
      const nameLower = form.name.trim().toLowerCase();
      if (shopCategories.some((c) => c.name.toLowerCase() === nameLower)) {
        setError("A category with this name already exists");
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (!form.imageFile) {
        setError("Please upload a category image");
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

    const slug = form.link.trim() || generateSlug(form.name);
    setSubmitting(true);
    setError("");

    try {
      const uploadResult = await uploadImage(form.imageFile);
      await addCategory({
        name: form.name.trim(),
        link: slug,
        imageBase64: uploadResult.path,
        description: "",
      });
      toast.success("Category created successfully");
      resetForm();
    } catch (err) {
      setError(err.message || "Failed to create category");
      toast.error(err.message || "Failed to create category");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget?.id) return;
    setDeleteLoading(true);
    try {
      await deleteCategory(deleteTarget.id);
      toast.success("Category deleted successfully");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete category");
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

  return (
    <div className="space-y-8 pb-10">
      {/* Wizard */}
      <div
        id="category-form-wizard"
        className="bg-white rounded-2xl shadow-lg border border-slate-200/80 overflow-hidden"
      >
        <div className="px-6 py-5 md:px-8 border-b border-slate-100 bg-gradient-to-r from-violet-50 to-fuchsia-50/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Plus className="text-violet-600" size={24} />
                Add New Category
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Step {currentStep} of {STEPS.length} — {STEPS[currentStep - 1].subtitle}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-bold">
              <Sparkles size={14} />
              Shop navigation
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
                      active ? "bg-white shadow-sm ring-2 ring-violet-500/30" : done ? "opacity-90" : "opacity-55"
                    }`}
                  >
                    <span
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        done
                          ? "bg-emerald-500 text-white"
                          : active
                            ? "bg-violet-600 text-white"
                            : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {done ? <Check size={16} /> : step.id}
                    </span>
                    <span className="hidden sm:block text-left min-w-0">
                      <span className={`block text-xs font-bold truncate ${active ? "text-violet-700" : "text-slate-700"}`}>
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
            <div className="mb-5 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-start gap-2">
              <span className="font-semibold">!</span>
              {error}
            </div>
          )}

          {currentStep === 1 && (
            <div className="max-w-xl space-y-5">
              <Field label="Category name *">
                <input
                  type="text"
                  placeholder="e.g. Wedding Albums, Photo Frames"
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
                    placeholder="/category/wedding-albums"
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
                    Preview:{" "}
                    <span className="font-mono text-violet-600 font-medium">{slugPreview}</span>
                  </p>
                )}
              </Field>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600">
                <p className="font-semibold text-slate-800 mb-1">Tip</p>
                Categories group products on your storefront. Use a clear name and a square image in the next step.
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Category image *
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
                      ? "border-violet-500 bg-violet-50 scale-[1.01]"
                      : form.preview
                        ? "border-violet-400 bg-violet-50/40"
                        : "border-slate-300 hover:border-violet-400 bg-slate-50"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  {form.preview ? (
                    <div className="relative h-[220px]">
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
                        className="absolute top-3 right-3 z-20 bg-black/70 hover:bg-black text-white p-2 rounded-full"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="h-[220px] flex flex-col items-center justify-center text-slate-500">
                      <Upload size={36} className="mb-2 text-violet-500" />
                      <p className="text-sm font-semibold text-slate-700">
                        {isDragging ? "Drop image here" : "Drag & drop or click"}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">PNG/JPG · max 5MB · ~800×800</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Live preview card */}
              <div>
                <p className="text-sm font-semibold text-slate-800 mb-3">Store preview</p>
                <div className="rounded-2xl border border-slate-200 bg-white shadow-md overflow-hidden max-w-[240px]">
                  <div className="aspect-square bg-slate-100">
                    {form.preview ? (
                      <img
                        src={form.preview}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ImageIcon size={48} />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-slate-900 truncate">
                      {form.name.trim() || "Category name"}
                    </p>
                    <p className="text-[11px] font-mono text-slate-500 mt-1 truncate">
                      {slugPreview || "/category/..."}
                    </p>
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
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-violet-600 text-white font-semibold text-sm hover:bg-violet-700 shadow-md shadow-violet-200/50 transition"
              >
                Next
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold text-sm hover:from-violet-700 hover:to-fuchsia-700 shadow-lg disabled:opacity-60 transition"
              >
                {submitting ? (
                  "Creating..."
                ) : (
                  <>
                    <Check size={18} />
                    Create category
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FolderOpen className="text-violet-600" size={22} />
            Your categories
            <span className="text-sm font-semibold text-violet-600 bg-violet-100 px-2.5 py-0.5 rounded-full">
              {shopCategories.length}
            </span>
          </h3>
        </div>

        {shopCategories.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
            <ImageIcon size={44} className="mx-auto text-slate-300 mb-3" />
            <p className="font-semibold text-slate-600">No categories yet</p>
            <p className="text-sm text-slate-400 mt-1">Create your first category using the steps above</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {shopCategories.map((cat, idx) => (
              <div
                key={cat._id || cat.id || `cat-${idx}`}
                className="group rounded-2xl border border-slate-200 overflow-hidden bg-white hover:shadow-lg hover:border-violet-200 transition-all"
              >
                <div className="relative aspect-square bg-slate-100 overflow-hidden">
                  <img
                    src={resolveImage(cat.image)}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/400x400?text=Category";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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
        title="Delete this category?"
        description="Products in this category may need to be reassigned. This cannot be undone."
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
