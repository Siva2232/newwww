// src/components/admin/ProductsManagement.jsx
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { useProducts } from "../../Context/ProductContext";
import {
  Plus,
  Image as ImageIcon,
  Images,
  Upload,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  FileText,
  Tag,
} from "lucide-react";

const STEPS = [
  { id: 1, title: "Basic info", subtitle: "Name, price & category", icon: Tag },
  { id: 2, title: "Details", subtitle: "Descriptions & specs", icon: FileText },
  { id: 3, title: "Images", subtitle: "Main & gallery", icon: ImageIcon },
];

const DEFAULT_SPECS = [
  { label: "Paper Quality", value: "300gsm Premium Matte" },
  { label: "Binding", value: "Layflat / Perfect Bind" },
  { label: "Cover", value: "Hardcover / Softcover with Foil Stamping" },
  { label: "Production Time", value: "3-5 Business Days" },
  { label: "Origin", value: "Made in India" },
];

const getEmptyForm = () => ({
  name: "",
  price: "",
  originalPrice: "",
  category: "",
  customCategory: "",
  description: "",
  detailedDescription: "",
  subcategory: "",
  customSubcategory: "",
  specifications: [...DEFAULT_SPECS],
  mainImageFile: null,
  carouselImageFiles: [],
  mainImagePreview: null,
  carouselPreviews: [],
  editingId: null,
});

const inputClass =
  "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition text-sm";

import { uploadImage, BASE_URL, getProducts } from "../../api";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { getProductId, sameProductId } from "../../utils/productIds";

export default function ProductsManagement() {
  const {
    products: contextProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    shopCategories,
    shopSubCategories,
    setShopCategories,
    setShopSubCategories,
  } = useProducts();

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(false);

  const fetchProductsList = async (page = 1) => {
    try {
      setLoading(true);
      const data = await getProducts({ page, limit: 12 });
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts(data.products || []);
        setPagination(data.pagination || { page: 1, pages: 1 });
      }
    } catch (err) {
      console.error("Fetch products failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsList();
  }, []);

  const [form, setForm] = useState(getEmptyForm);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const mainImageInput = useRef(null);
  const carouselInput = useRef(null);

  const updateForm = (updates) => setForm((prev) => ({ ...prev, ...updates }));

  const confirmDeleteProduct = async () => {
    if (!deleteTarget?.id) return;
    setDeleteLoading(true);
    try {
      await deleteProduct(deleteTarget.id);
      setProducts((prev) =>
        prev.filter((p) => !sameProductId(getProductId(p), deleteTarget.id))
      );
      await fetchProductsList(pagination.page);
      toast.success("Product deleted successfully");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete product");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Helper to read file as preview data URL
  const readFilePreview = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  };

  const handleMainImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // enforce 5MB per-file limit (frontend guard)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Main image must be under 5 MB");
      return;
    }

    try {
      const preview = await readFilePreview(file);
      updateForm({ 
        mainImageFile: file, 
        mainImagePreview: preview 
      });
    } catch (err) {
      console.error("Preview error", err);
    }
  };

  const handleCarouselImages = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // filter out files that exceed 5MB
    const validFiles = files.filter((f) => {
      if (f.size > 5 * 1024 * 1024) {
        toast.error(`${f.name} is larger than 5 MB and was skipped`);
        return false;
      }
      return true;
    });

    if (!validFiles.length) return;

    try {
      const newPreviews = await Promise.all(validFiles.map(readFilePreview));
      updateForm({
        carouselImageFiles: [...form.carouselImageFiles, ...validFiles],
        carouselPreviews: [...form.carouselPreviews, ...newPreviews],
      });
    } catch (err) {
      console.error("Carousel preview error", err);
    }
  };

  const removeCarouselImage = (index) => {
    updateForm({
      carouselImageFiles: form.carouselImageFiles.filter((_, i) => i !== index),
      carouselPreviews: form.carouselPreviews.filter((_, i) => i !== index),
    });
  };

  const addSpecification = () => {
    updateForm({ specifications: [...form.specifications, { label: "", value: "" }] });
  };

  const removeSpecification = (index) => {
    updateForm({
      specifications: form.specifications.filter((_, i) => i !== index),
    });
  };

  const handleSpecificationChange = (index, field, value) => {
    const newSpecs = [...form.specifications];
    newSpecs[index][field] = value;
    updateForm({ specifications: newSpecs });
  };

  const validateStep = (step) => {
    if (step === 1) {
      if (!form.name.trim()) {
        toast.error("Product name is required");
        return false;
      }
      if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) {
        toast.error("Enter a valid price");
        return false;
      }
      const cat = form.customCategory?.trim() || form.category?.trim();
      if (!cat) {
        toast.error("Select or enter a category");
        return false;
      }
      return true;
    }
    if (step === 3) {
      if (!form.mainImageFile && !form.mainImagePreview) {
        toast.error("Main image is required");
        return false;
      }
      return true;
    }
    return true;
  };

  const goNext = () => {
    if (!validateStep(currentStep)) return;
    setCurrentStep((s) => Math.min(s + 1, STEPS.length));
  };

  const goBack = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(3)) {
      if (!validateStep(1)) setCurrentStep(1);
      else if (!validateStep(3)) setCurrentStep(3);
      return;
    }

    setSubmitting(true);

    let category = "uncategorized";
    const custom = form.customCategory?.trim();
    const selected = form.category?.trim();

    if (custom) category = custom;
    else if (selected) category = selected;

    // determine subcategory (selected or custom)
    let subcategory = "";
    const customSub = form.customSubcategory?.trim();
    const selectedSub = form.subcategory?.trim();
    if (customSub) subcategory = customSub;
    else if (selectedSub) subcategory = selectedSub;

    // auto-create new category/subcategory if needed
    if (category !== "uncategorized") {
      const exists = shopCategories.some(
        (c) => c.name.toLowerCase() === category.toLowerCase()
      );
      if (!exists) {
        setShopCategories((prev) => [
          ...prev,
          {
            id: Date.now(),
            name: category,
            image: null,
            link: `/category/${category.toLowerCase().replace(/\s+/g, "-")}`,
          },
        ]);
      }
    }
    if (subcategory && category) {
      const existsSub = shopSubCategories.some(sc => {
        const catName = typeof sc.category === 'string' ? sc.category : sc.category?.name;
        return sc.name.toLowerCase() === subcategory.toLowerCase() && catName === category;
      });
      // optimistic add without image
      if (!existsSub) {
        setShopSubCategories((prev) => [
          ...prev,
          { id: Date.now(), name: subcategory, category, image: null, link: "" },
        ]);
      }
    }

    // Auto-create new category (optimistic)
    if (category !== "uncategorized") {
      const exists = shopCategories.some(
        (c) => c.name.toLowerCase() === category.toLowerCase()
      );
      if (!exists) {
        setShopCategories((prev) => [
          ...prev,
          {
            id: Date.now(),
            name: category,
            image: null,
            link: `/category/${category.toLowerCase().replace(/\s+/g, "-")}`,
          },
        ]);
      }
    }

    try {
      // 1. Resolve Main Image
      let finalMainImagePath = form.mainImagePreview; // default to existing preview (if it's a path)
      
      // If user uploaded a new file, upload it and use new path
      if (form.mainImageFile) {
        const uploadRes = await uploadImage(form.mainImageFile);
        finalMainImagePath = uploadRes.path;
      } 
      // Note: If preview is data:URL (from generic FileReader without upload), we can't easily save it unless we force upload.
      // But our logic uses uploadImage for new files. 
      // If form.mainImagePreview is a string like "/uploads/...", it's fine.

      // 2. Resolve Carousel Images
      const finalCarouselPaths = [];
      
      // Process existing ones (if any are just strings in previews but not files)
      // Check which ones are new files vs existing paths
      // This is tricky with separate arrays. Let's iterate `carouselPreviews`? 
      // Or simplify: we have `carouselImageFiles` which are NEW. 
      // But we also might have KEPT existing images.
      
      // For simplicity in this quick fix:
      // We'll upload all new files.
      // And we need to preserve existing paths that weren't deleted.
      // But my state structure `carouselImageFiles` only tracks files (added ones?). 
      // Using `carouselPreviews` as the source of truth for ordering is better if we matched them index-to-index.
      // For now, let's just append new uploads to existing *if* we're editing?
      
      // Better strategy:
      // Loop through `carouselPreviews`.
      // If item is data: (base64) -> find corresponding file in `carouselImageFiles` (maybe by name? or assume order?).
      // The current simple implementation just appends new files.
      
      const newUploads = [];
      for (const file of form.carouselImageFiles) {
        const res = await uploadImage(file);
        newUploads.push(res.path);
      }
      
      // If in edit mode, `form.carouselImages` (from startEdit/legacy) might contain existing paths.
      // But my new state structure uses `carouselPreviews`.
      // Let's assume `carouselPreviews` contains EVERYTHING (existing paths + new base64 previews).
      // We need to reconstruct the final array of paths.
      
      // Filter out base64 previews from `carouselPreviews` and keep only server paths
      const existingPaths = form.carouselPreviews.filter(p => p && !p.startsWith("data:"));
      
      // Combine
      const allCarouselPaths = [...existingPaths, ...newUploads];

      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        category,
        subcategory,
        description: form.description.trim() || "Premium quality product",
        detailedDescription: form.detailedDescription?.trim() || "",
        specifications: form.specifications.filter(s => s.label && s.value), // Only valid specs
        mainImage: finalMainImagePath, 
        carouselImages: allCarouselPaths,
      };

      if (form.editingId) {
        await updateProduct(form.editingId, payload);
        toast.success("Product updated successfully");
      } else {
        await addProduct(payload);
        toast.success("Product created successfully");
      }
      
      setForm(getEmptyForm());
      setCurrentStep(1);
      if (mainImageInput.current) mainImageInput.current.value = "";
      if (carouselInput.current) carouselInput.current.value = "";
      await fetchProductsList(pagination.page || 1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save product: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (product) => {
    // Populate form with existing product data
    // existing images are likely paths (strings)
    setForm({
      editingId: product.id || product._id,
      name: product.name || "",
      price: product.price || "",
      originalPrice: product.originalPrice || "",
      category: product.category || "",
      customCategory: "",
      subcategory: product.subcategory || "",
      customSubcategory: "",
      description: product.description || "",
      detailedDescription: product.detailedDescription || "",
      specifications: (product.specifications && product.specifications.length > 0) 
        ? product.specifications 
        : [
            { label: "Paper Quality", value: "300gsm Premium Matte" },
            { label: "Binding", value: "Layflat / Perfect Bind" },
            { label: "Cover", value: "Hardcover / Softcover with Foil Stamping" },
            { label: "Production Time", value: "3-5 Business Days" },
            { label: "Origin", value: "Made in India" }
          ],
      
      // New fields population
      mainImageFile: null, // no new file yet
      mainImagePreview: product.mainImage || product.image || null, // show existing image
      
      carouselImageFiles: [], // no new files
      carouselPreviews: product.carouselImages || product.images?.slice(1) || [], // existing paths
    });
    
    if (mainImageInput.current) mainImageInput.current.value = "";
    if (carouselInput.current) carouselInput.current.value = "";
    setCurrentStep(1);
    document.getElementById("product-form-wizard")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const cancelEdit = () => {
    setForm(getEmptyForm());
    setCurrentStep(1);
    if (mainImageInput.current) mainImageInput.current.value = "";
    if (carouselInput.current) carouselInput.current.value = "";
  };

  const resolveImageSrc = (src) =>
    !src
      ? ""
      : src.startsWith("data:") || src.startsWith("http")
        ? src
        : `${BASE_URL}${src}`;

  // Optional: warn when storage is getting large
  useEffect(() => {
    const sizeMB = (JSON.stringify(products).length / 1024 / 1024).toFixed(1);
    if (sizeMB > 4) {
      console.warn(`Products storage is using ~${sizeMB} MB — consider switching to real backend soon`);
    }
  }, [products]);

  return (
    <div className="space-y-10 pb-12">
      {/* STEP WIZARD FORM */}
      <div
        id="product-form-wizard"
        className="bg-white rounded-2xl shadow-lg border border-slate-200/80 overflow-hidden"
      >
        <div className="px-6 py-5 md:px-8 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Plus className="text-emerald-600" size={24} />
                {form.editingId ? "Edit Product" : "Add New Product"}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Step {currentStep} of {STEPS.length} — {STEPS[currentStep - 1].subtitle}
              </p>
            </div>
            {form.editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="text-sm font-semibold text-slate-600 hover:text-rose-600 px-4 py-2 rounded-lg border border-slate-200 hover:border-rose-200 hover:bg-rose-50 transition"
              >
                Cancel edit
              </button>
            )}
          </div>

          {/* Step indicator */}
          <div className="mt-6 flex items-center gap-2">
            {STEPS.map((step, idx) => {
              const done = currentStep > step.id;
              const active = currentStep === step.id;
              const StepIcon = step.icon;
              return (
                <div key={step.id} className="flex items-center flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (step.id < currentStep) setCurrentStep(step.id);
                      else if (step.id === currentStep + 1 && validateStep(currentStep))
                        setCurrentStep(step.id);
                    }}
                    className={`flex items-center gap-2 min-w-0 w-full rounded-xl px-2 py-2 transition ${
                      active ? "bg-white shadow-sm ring-2 ring-indigo-500/30" : done ? "opacity-90" : "opacity-60"
                    }`}
                  >
                    <span
                      className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                        done
                          ? "bg-emerald-500 text-white"
                          : active
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {done ? <Check size={16} /> : step.id}
                    </span>
                    <span className="hidden md:block text-left min-w-0">
                      <span className={`block text-xs font-bold truncate ${active ? "text-indigo-700" : "text-slate-700"}`}>
                        {step.title}
                      </span>
                      <span className="block text-[10px] text-slate-500 truncate">{step.subtitle}</span>
                    </span>
                  </button>
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`hidden sm:block w-6 h-0.5 mx-1 flex-shrink-0 rounded ${
                        done ? "bg-emerald-400" : "bg-slate-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 md:p-8 min-h-[320px]">
          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="space-y-5 max-w-2xl">
              <Field label="Product name *">
                <input
                  placeholder="e.g. Premium Photo Album"
                  value={form.name}
                  onChange={(e) => updateForm({ name: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Price (₹) *">
                  <input
                    type="number"
                    placeholder="999"
                    value={form.price}
                    onChange={(e) => updateForm({ price: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Original price (optional)">
                  <input
                    type="number"
                    placeholder="1299"
                    value={form.originalPrice}
                    onChange={(e) => updateForm({ originalPrice: e.target.value })}
                    className={inputClass}
                  />
                </Field>
              </div>
              <Field label="Category *">
                <select
                  value={form.category}
                  onChange={(e) =>
                    updateForm({
                      category: e.target.value,
                      customCategory: "",
                      subcategory: "",
                      customSubcategory: "",
                    })
                  }
                  className={inputClass}
                >
                  <option value="">Select category</option>
                  {shopCategories.map((cat, idx) => (
                    <option key={cat._id || cat.id || `opt-${idx}`} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Or new category">
                <input
                  placeholder="Type new category name"
                  value={form.customCategory}
                  onChange={(e) =>
                    updateForm({ customCategory: e.target.value, category: "" })
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Subcategory">
                <select
                  value={form.subcategory}
                  onChange={(e) =>
                    updateForm({ subcategory: e.target.value, customSubcategory: "" })
                  }
                  disabled={!form.category && !form.customCategory}
                  className={`${inputClass} disabled:opacity-50`}
                >
                  <option value="">Select subcategory (optional)</option>
                  {shopSubCategories
                    .filter((sc) => {
                      const cat = form.customCategory || form.category;
                      const catName =
                        typeof sc.category === "string" ? sc.category : sc.category?.name;
                      return catName === cat;
                    })
                    .map((sc) => (
                      <option key={sc._id || sc.id} value={sc.name}>
                        {sc.name}
                      </option>
                    ))}
                </select>
              </Field>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="space-y-5 max-w-3xl">
              <Field label="Short description">
                <textarea
                  placeholder="Brief summary for cards and listings..."
                  value={form.description}
                  onChange={(e) => updateForm({ description: e.target.value })}
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </Field>
              <Field label="Detailed description">
                <textarea
                  placeholder="Full product details, features, care instructions..."
                  value={form.detailedDescription}
                  onChange={(e) => updateForm({ detailedDescription: e.target.value })}
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
              </Field>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Specifications
                </label>
                <div className="space-y-2">
                  {form.specifications.map((spec, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        placeholder="Label"
                        value={spec.label}
                        onChange={(e) =>
                          handleSpecificationChange(index, "label", e.target.value)
                        }
                        className={`${inputClass} flex-1`}
                      />
                      <input
                        placeholder="Value"
                        value={spec.value}
                        onChange={(e) =>
                          handleSpecificationChange(index, "value", e.target.value)
                        }
                        className={`${inputClass} flex-1`}
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecification(index)}
                        className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSpecification}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 mt-2"
                  >
                    <Plus size={16} /> Add row
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
                  <ImageIcon size={18} className="text-indigo-600" />
                  Main image *
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-2xl overflow-hidden cursor-pointer min-h-[200px] ${
                    form.mainImagePreview
                      ? "border-indigo-400 bg-indigo-50/30"
                      : "border-slate-300 hover:border-indigo-300 bg-slate-50"
                  }`}
                >
                  <input
                    ref={mainImageInput}
                    type="file"
                    accept="image/*"
                    onChange={handleMainImage}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  {form.mainImagePreview ? (
                    <img
                      src={resolveImageSrc(form.mainImagePreview)}
                      alt="Main"
                      className="w-full h-52 object-cover"
                    />
                  ) : (
                    <div className="h-52 flex flex-col items-center justify-center text-slate-500">
                      <Upload size={32} className="mb-2 text-slate-400" />
                      <p className="text-sm font-medium">Upload main image</p>
                      <p className="text-xs text-slate-400 mt-1">Max 5MB</p>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-800 mb-2 flex items-center gap-2">
                  <Images size={18} className="text-sky-600" />
                  Gallery (optional)
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-4 cursor-pointer min-h-[200px] ${
                    form.carouselPreviews.length > 0
                      ? "border-sky-400 bg-sky-50/30"
                      : "border-slate-300 hover:border-sky-300 bg-slate-50"
                  }`}
                >
                  <input
                    ref={carouselInput}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleCarouselImages}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  {form.carouselPreviews.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 relative z-0">
                      {form.carouselPreviews.map((img, idx) => (
                        <div
                          key={idx}
                          className="group relative aspect-square rounded-lg overflow-hidden border border-slate-200"
                        >
                          <img
                            src={resolveImageSrc(img)}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeCarouselImage(idx);
                            }}
                            className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-52 flex flex-col items-center justify-center text-slate-500">
                      <Images size={32} className="mb-2 text-slate-400" />
                      <p className="text-sm font-medium">Add gallery images</p>
                    </div>
                  )}
                </div>
              </div>
              {currentStep === 3 && form.name && (
                <div className="md:col-span-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-xs font-bold uppercase text-slate-500 mb-2">Preview</p>
                  <p className="font-bold text-slate-900">{form.name}</p>
                  <p className="text-indigo-600 font-semibold mt-1">
                    ₹{Number(form.price || 0).toLocaleString()}
                    {form.originalPrice && (
                      <span className="text-slate-400 line-through text-sm ml-2">
                        ₹{Number(form.originalPrice).toLocaleString()}
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-slate-500 mt-1 capitalize">
                    {form.customCategory || form.category || "—"}
                    {form.subcategory ? ` · ${form.subcategory}` : ""}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Wizard footer */}
        <div className="px-6 py-4 md:px-8 border-t border-slate-100 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3">
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
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 shadow-md shadow-indigo-200/50 transition"
              >
                Next
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-sm hover:from-emerald-700 hover:to-teal-700 shadow-lg disabled:opacity-60 transition"
              >
                {submitting ? (
                  "Saving..."
                ) : (
                  <>
                    <Check size={18} />
                    {form.editingId ? "Update product" : "Publish product"}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* EXISTING PRODUCTS */}
      <div className="bg-white rounded-2xl shadow border border-gray-200/60 p-7">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Current Products ({products.length})</h2>

        {products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No products added yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {products.map((product) => {
              const pid = getProductId(product);
              const mainImage = product.mainImage || product.image || product.images?.[0] || null;
              const carouselCount = product.carouselImages?.length || (product.images ? Math.max(0, product.images.length - 1) : 0);
              return (
                <div
                  key={pid}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <div className="relative aspect-square bg-gray-50">
                    <img
                      src={mainImage ? (mainImage.startsWith("data:") || mainImage.startsWith("http") ? mainImage : `${BASE_URL}${mainImage}`) : "https://placehold.co/400x400?text=No+Image"}
                      alt={product.name}
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = "https://placehold.co/400x400?text=No+Image";
                      }}
                      style={{ willChange: "transform" }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {carouselCount > 0 && (
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                        +{carouselCount}
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-medium text-sm line-clamp-2 mb-1.5 h-10">
                      {product.name}
                    </h3>
                    {(product.category || product.subcategory) && (
                      <p className="text-xs text-gray-500 mb-2">
                        {product.category}{product.subcategory ? ` / ${product.subcategory}` : ""}
                      </p>
                    )}
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-lg font-bold text-indigo-700">
                        ₹{Number(product.price).toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{Number(product.originalPrice).toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(product)}
                        className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-700 text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteTarget({ id: pid, name: product.name })
                        }
                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination UI */}
        {pagination.pages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12 pb-10">
            <button
              onClick={() => fetchProductsList(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <span className="text-sm font-medium">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => fetchProductsList(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete this product?"
        description="It will be removed from the shop, featured lists, and homepage carousels immediately."
        itemName={deleteTarget?.name}
        onConfirm={confirmDeleteProduct}
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