import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import {
  BookOpen,
  Image as ImageIcon,
  Upload,
  X,
  Trash2,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Check,
  Sparkles,
  FileText,
  IndianRupee,
} from "lucide-react";
import {
  createCustomProduct,
  updateCustomProduct,
  deleteCustomProduct,
  getCustomProducts,
  uploadImage,
  BASE_URL,
} from "../../api";
import DeleteConfirmModal from "./DeleteConfirmModal";

const STEPS = [
  { id: 1, title: "Book info", subtitle: "Name, tag & price", icon: BookOpen },
  { id: 2, title: "Details", subtitle: "Descriptions", icon: FileText },
  { id: 3, title: "Cover", subtitle: "Image & publish", icon: ImageIcon },
];

const TAG_OPTIONS = ["Signature", "Essential", "Gift", "Premium"];

const inputClass =
  "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition text-sm";

const getEmptyForm = () => ({
  name: "",
  price: "",
  originalPrice: "",
  shortDesc: "",
  fullDesc: "",
  tag: "Signature",
});

export default function AdminAddProduct() {
  const [form, setForm] = useState(getEmptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const fetchProducts = async () => {
    try {
      const data = await getCustomProducts();
      const list = Array.isArray(data) ? data : (data?.products ?? []);
      setProducts(list);
    } catch (err) {
      console.error("Failed to fetch products", err);
      setProducts([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleImageFile = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const clearImage = () => {
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resolveImage = (src) =>
    !src ? "" : src.startsWith("http") || src.startsWith("blob:") ? src : `${BASE_URL}${src}`;

  const validateStep = (step) => {
    if (step === 1) {
      if (!form.name.trim()) {
        setError("Photo book name is required");
        return false;
      }
      if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) {
        setError("Enter a valid price");
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (!form.shortDesc.trim()) {
        setError("Short description is required");
        return false;
      }
      return true;
    }
    if (step === 3) {
      const hasImage =
        imageFile ||
        (imagePreview && !imagePreview.startsWith("blob:")) ||
        (editingId && imagePreview);
      if (!hasImage && !editingId) {
        setError("Cover image is required");
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
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      if (!validateStep(1)) setCurrentStep(1);
      else if (!validateStep(2)) setCurrentStep(2);
      else setCurrentStep(3);
      return;
    }

    setLoading(true);
    setError("");

    try {
      let imagePath = "";
      if (imageFile) {
        const uploadRes = await uploadImage(imageFile);
        imagePath = uploadRes.path;
      } else if (imagePreview && !imagePreview.startsWith("blob:")) {
        if (imagePreview.includes("/uploads/")) {
          imagePath = imagePreview.slice(imagePreview.indexOf("/uploads/"));
        } else {
          imagePath = imagePreview.replace(BASE_URL, "");
        }
      }

      const productData = {
        name: form.name.trim(),
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : 0,
        shortDesc: form.shortDesc.trim(),
        fullDesc: form.fullDesc.trim(),
        tag: form.tag,
        image: imagePath,
      };

      if (editingId) {
        await updateCustomProduct(editingId, productData);
        toast.success("Custom photo book updated");
      } else {
        await createCustomProduct(productData);
        toast.success("Custom photo book added");
      }

      await fetchProducts();
      cancelEdit();
    } catch (err) {
      setError(err.message || "Failed to save");
      toast.error(err.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (product) => {
    setEditingId(product._id || product.id);
    setForm({
      name: product.name || "",
      price: String(product.price ?? ""),
      originalPrice: product.originalPrice ? String(product.originalPrice) : "",
      shortDesc: product.shortDesc || "",
      fullDesc: product.fullDesc || "",
      tag: product.tag || "Signature",
    });
    const imgUrl = product.image
      ? product.image.startsWith("http")
        ? product.image
        : `${BASE_URL}${product.image}`
      : "";
    setImagePreview(imgUrl);
    setImageFile(null);
    setCurrentStep(1);
    setError("");
    document.getElementById("custom-book-wizard")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const cancelEdit = () => {
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setEditingId(null);
    setForm(getEmptyForm());
    setImageFile(null);
    setImagePreview("");
    setError("");
    setCurrentStep(1);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const confirmDelete = async () => {
    if (!deleteTarget?.id) return;
    setDeleteLoading(true);
    try {
      await deleteCustomProduct(deleteTarget.id);
      await fetchProducts();
      toast.success("Deleted successfully");
      if (editingId === deleteTarget.id) cancelEdit();
      setDeleteTarget(null);
    } catch (err) {
      toast.error("Failed to delete");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div
        id="custom-book-wizard"
        className="bg-white rounded-2xl shadow-lg border border-slate-200/80 overflow-hidden"
      >
        <div className="px-6 py-5 md:px-8 border-b border-slate-100 bg-gradient-to-r from-teal-50 via-cyan-50 to-indigo-50/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="text-teal-600" size={24} />
                {editingId ? "Edit Custom Photo Book" : "Add New Custom Photo Book"}
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
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
                <Sparkles size={14} />
                Custom book
              </span>
            </div>
          </div>

          <div className="mt-5 flex gap-1.5 overflow-x-auto pb-1">
            {STEPS.map((step, idx) => {
              const done = currentStep > step.id;
              const active = currentStep === step.id;
              return (
                <div key={step.id} className="flex items-center flex-shrink-0 min-w-[100px] flex-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (step.id < currentStep) setCurrentStep(step.id);
                      else if (step.id === currentStep + 1 && validateStep(currentStep))
                        setCurrentStep(step.id);
                    }}
                    className={`flex items-center gap-2 w-full rounded-xl px-2 py-2 transition ${
                      active ? "bg-white shadow-sm ring-2 ring-teal-500/30" : done ? "opacity-90" : "opacity-55"
                    }`}
                  >
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        done
                          ? "bg-emerald-500 text-white"
                          : active
                            ? "bg-teal-600 text-white"
                            : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {done ? <Check size={14} /> : step.id}
                    </span>
                    <span className="hidden md:block text-left">
                      <span className={`block text-xs font-bold ${active ? "text-teal-700" : "text-slate-700"}`}>
                        {step.title}
                      </span>
                    </span>
                  </button>
                  {idx < STEPS.length - 1 && (
                    <div className={`w-3 h-0.5 rounded ${done ? "bg-emerald-400" : "bg-slate-200"}`} />
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
              <Field label="Photo book name *">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Heritage Wedding Album"
                  className={inputClass}
                />
              </Field>

              <Field label="Collection tag">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {TAG_OPTIONS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, tag: t }))}
                      className={`py-2.5 px-3 rounded-xl text-sm font-semibold border transition ${
                        form.tag === t
                          ? "bg-teal-600 text-white border-teal-600 shadow-md"
                          : "bg-white text-slate-600 border-slate-200 hover:border-teal-300"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </Field>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Price (₹) *">
                  <div className="relative">
                    <IndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="2499"
                      className={`${inputClass} pl-9`}
                    />
                  </div>
                </Field>
                <Field label="Original price (optional)">
                  <input
                    type="number"
                    name="originalPrice"
                    value={form.originalPrice}
                    onChange={handleChange}
                    placeholder="2999"
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="max-w-2xl space-y-5">
              <Field label="Short description *">
                <textarea
                  name="shortDesc"
                  value={form.shortDesc}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Shown on the custom book picker — keep it punchy"
                  className={`${inputClass} resize-none`}
                />
                <p className="text-xs text-slate-400 mt-1">{form.shortDesc.length}/120 recommended</p>
              </Field>
              <Field label="Full description">
                <textarea
                  name="fullDesc"
                  value={form.fullDesc}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Paper type, sizes, binding, turnaround, what's included..."
                  className={`${inputClass} resize-none`}
                />
              </Field>
            </div>
          )}

          {currentStep === 3 && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Cover image *
                </label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleImageFile(file);
                  }}
                  className={`relative border-2 border-dashed rounded-2xl min-h-[240px] cursor-pointer overflow-hidden transition ${
                    isDragging
                      ? "border-teal-500 bg-teal-50"
                      : imagePreview
                        ? "border-teal-400 bg-teal-50/30"
                        : "border-slate-300 hover:border-teal-400 bg-slate-50"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFile(e.target.files?.[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  {imagePreview ? (
                    <div className="relative h-[240px]">
                      <img
                        src={resolveImage(imagePreview)}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearImage();
                        }}
                        className="absolute top-3 right-3 z-20 bg-black/70 text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="h-[240px] flex flex-col items-center justify-center text-slate-500">
                      <Upload size={36} className="mb-2 text-teal-500" />
                      <p className="text-sm font-semibold">Upload cover (4:5 recommended)</p>
                      <p className="text-xs text-slate-400 mt-1">JPG/PNG · max 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800 mb-3">Customer preview</p>
                <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden max-w-[260px]">
                  <div className="relative aspect-[4/5] bg-slate-100">
                    {imagePreview ? (
                      <img
                        src={resolveImage(imagePreview)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <BookOpen size={48} />
                      </div>
                    )}
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-teal-600 text-white text-[10px] font-bold">
                      {form.tag}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 line-clamp-1">
                      {form.name.trim() || "Book title"}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 min-h-[2rem]">
                      {form.shortDesc.trim() || "Short description appears here"}
                    </p>
                    <div className="flex items-baseline gap-2 mt-3">
                      <span className="text-lg font-bold text-teal-700">
                        ₹{Number(form.price || 0).toLocaleString()}
                      </span>
                      {form.originalPrice && Number(form.originalPrice) > 0 && (
                        <span className="text-sm text-slate-400 line-through">
                          ₹{Number(form.originalPrice).toLocaleString()}
                        </span>
                      )}
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
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 text-white font-semibold text-sm hover:bg-teal-700 shadow-md transition"
              >
                Next
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-indigo-600 text-white font-semibold text-sm hover:from-teal-700 hover:to-indigo-700 shadow-lg disabled:opacity-60 transition"
              >
                {loading ? (
                  "Saving..."
                ) : (
                  <>
                    <Check size={18} />
                    {editingId ? "Update book" : "Publish book"}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
          <BookOpen className="text-teal-600" size={22} />
          Your custom books
          <span className="text-sm font-semibold text-teal-700 bg-teal-100 px-2.5 py-0.5 rounded-full">
            {products.length}
          </span>
        </h2>

        {products.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 py-12 text-center">
            <BookOpen size={44} className="mx-auto text-slate-300 mb-3" />
            <p className="font-semibold text-slate-600">No custom photo books yet</p>
            <p className="text-sm text-slate-400 mt-1">Complete the wizard above to add your first book</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => {
              const pid = product._id || product.id;
              const isEditing = editingId === pid;
              return (
                <div
                  key={pid}
                  className={`rounded-2xl border overflow-hidden flex flex-col transition-all ${
                    isEditing
                      ? "border-teal-500 ring-2 ring-teal-200 shadow-lg"
                      : "border-slate-200 hover:shadow-lg hover:border-teal-200"
                  }`}
                >
                  <div className="relative aspect-[4/5] bg-slate-100">
                    <img
                      src={
                        product.image
                          ? resolveImage(
                              product.image.startsWith("http")
                                ? product.image
                                : `${BASE_URL}${product.image}`
                            )
                          : "https://placehold.co/400x500?text=Book"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/400x500?text=Book";
                      }}
                    />
                    <span className="absolute top-2 right-2 bg-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {product.tag || "Custom"}
                    </span>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-slate-900 line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 flex-1">{product.shortDesc}</p>
                    <div className="flex items-baseline gap-2 my-3">
                      <span className="font-bold text-teal-700">
                        ₹{Number(product.price).toLocaleString()}
                      </span>
                      {product.originalPrice > 0 && (
                        <span className="text-xs text-slate-400 line-through">
                          ₹{Number(product.originalPrice).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(product)}
                        className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteTarget({ id: pid, name: product.name })
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
        title="Delete this custom book?"
        description="This book will be removed from the catalog permanently."
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
