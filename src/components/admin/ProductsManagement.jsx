// src/components/admin/ProductsManagement.jsx
import { useState, useRef, useEffect } from "react";
import { useProducts } from "../../Context/ProductContext";
import {
  Plus,
  Image as ImageIcon,
  Images,
  Upload,
  Trash2,
  X,
} from "lucide-react";

import { uploadImage, BASE_URL, getProducts } from "../../api"; // base URL for images
export default function ProductsManagement() {
  const {
    products: contextProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    shopCategories,
    shopSubCategories,
    setShopCategories,
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

  const [form, setForm] = useState({
    name: "",
    price: "",
    originalPrice: "",
    category: "",
    customCategory: "",
    description: "",
    detailedDescription: "",
    subcategory: "",
    customSubcategory: "",
    specifications: [
      { label: "Paper Quality", value: "300gsm Premium Matte" },
      { label: "Binding", value: "Layflat / Perfect Bind" },
      { label: "Cover", value: "Hardcover / Softcover with Foil Stamping" },
      { label: "Production Time", value: "3-5 Business Days" },
      { label: "Origin", value: "Made in India" }
    ],
    
    // We'll store files here for new uploads
    mainImageFile: null,
    carouselImageFiles: [], // array of file objects

    // Previews for UI
    mainImagePreview: null,
    carouselPreviews: [],

    // Existing paths (if editing)
    // Note: If you have existing structure, you might need to adapt. 
    // For simplicity, I'm refactoring "mainImage" to just be the path string (or null).
  });

  const mainImageInput = useRef(null);
  const carouselInput = useRef(null);

  const updateForm = (updates) => setForm((prev) => ({ ...prev, ...updates }));

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

    try {
      const newPreviews = await Promise.all(files.map(readFilePreview));
      updateForm({
        carouselImageFiles: [...form.carouselImageFiles, ...files],
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

  const handleSubmit = async () => {
    if (!form.name.trim()) return alert("Product name is required");
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      return alert("Valid positive price required");
    // Ensure we have at least one image (new file or existing preview path)
    if (!form.mainImageFile && !form.mainImagePreview) return alert("Main image is required");

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
      } else {
        await addProduct(payload);
      }
      
      // Reset
      setForm({
         name: "", price: "", originalPrice: "", category: "", customCategory: "",
         description: "", detailedDescription: "", 
         specifications: [
            { label: "Paper Quality", value: "300gsm Premium Matte" },
            { label: "Binding", value: "Layflat / Perfect Bind" },
            { label: "Cover", value: "Hardcover / Softcover with Foil Stamping" },
            { label: "Production Time", value: "3-5 Business Days" },
            { label: "Origin", value: "Made in India" }
         ],
         mainImageFile: null, carouselImageFiles: [],
         mainImagePreview: null, carouselPreviews: [],
         editingId: null
      });

      if (mainImageInput.current) mainImageInput.current.value = "";
      if (carouselInput.current) carouselInput.current.value = "";
      
    } catch (err) {
      console.error(err);
      alert("Failed to save product: " + err.message);
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const cancelEdit = () => {
    setForm({
      name: "",
      price: "",
      originalPrice: "",
      category: "",
      customCategory: "",
      description: "",
      detailedDescription: "",
      specifications: [
        { label: "Paper Quality", value: "300gsm Premium Matte" },
        { label: "Binding", value: "Layflat / Perfect Bind" },
        { label: "Cover", value: "Hardcover / Softcover with Foil Stamping" },
        { label: "Production Time", value: "3-5 Business Days" },
        { label: "Origin", value: "Made in India" }
      ],
      mainImageFile: null,
      carouselImageFiles: [],
      mainImagePreview: null,
      carouselPreviews: [],
      editingId: null,
    });
    if (mainImageInput.current) mainImageInput.current.value = "";
    if (carouselInput.current) carouselInput.current.value = "";
  };

  // Optional: warn when storage is getting large
  useEffect(() => {
    const sizeMB = (JSON.stringify(products).length / 1024 / 1024).toFixed(1);
    if (sizeMB > 4) {
      console.warn(`Products storage is using ~${sizeMB} MB — consider switching to real backend soon`);
    }
  }, [products]);

  return (
    <div className="space-y-10 pb-12">
      {/* FORM */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200/70 p-7 md:p-9">
        <h2 className="text-2xl font-bold text-gray-800 mb-7 flex items-center gap-3">
          <Plus className="text-emerald-600" size={26} strokeWidth={2.4} />
          {form.editingId ? "Edit Product" : "Add New Product"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6 mb-8">
          <input
            placeholder="Product Name *"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
            className="w-full px-5 py-3.5 bg-gray-50/60 border border-gray-300 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all text-base"
          />

          <input
            type="number"
            placeholder="Price (₹) *"
            value={form.price}
            onChange={(e) => updateForm({ price: e.target.value })}
            className="w-full px-5 py-3.5 bg-gray-50/60 border border-gray-300 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all text-base"
          />

          <input
            type="number"
            placeholder="Original price (optional)"
            value={form.originalPrice}
            onChange={(e) => updateForm({ originalPrice: e.target.value })}
            className="w-full px-5 py-3.5 bg-gray-50/60 border border-gray-300 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all text-base"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select
              value={form.category}
              onChange={(e) => updateForm({ category: e.target.value, customCategory: "", subcategory: "", customSubcategory: "" })}
              className="w-full px-5 py-3.5 bg-gray-50/60 border border-gray-300 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all text-base"
            >
              <option value="">— Select existing —</option>
              {shopCategories.map((cat, idx) => (
                <option key={cat._id || cat.id || `opt-${idx}`} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 mt-4">
            <label className="text-sm font-medium text-gray-700">Subcategory</label>
            <select
              value={form.subcategory}
              onChange={(e) => updateForm({ subcategory: e.target.value, customSubcategory: "" })}
              disabled={!form.category}
              className="w-full px-5 py-3.5 bg-gray-50/60 border border-gray-300 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all text-base disabled:opacity-50"
            >
              <option value="">— Select existing —</option>
              {shopSubCategories
                .filter((sc) => {
                  const catName = typeof sc.category === 'string' ? sc.category : sc.category?.name;
                  return catName === form.category;
                })
                .map((sc) => (
                  <option key={sc._id || sc.id} value={sc.name}>
                    {sc.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Or create new category
          </label>
          <input
            placeholder="New category name"
            value={form.customCategory}
            onChange={(e) => updateForm({ customCategory: e.target.value, category: "" })}
            className="w-full px-5 py-3.5 bg-blue-50/40 border border-blue-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-200/50 outline-none transition-all text-base"
          />
        </div>
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Or create new subcategory
          </label>
          <input
            placeholder="New subcategory name"
            value={form.customSubcategory}
            onChange={(e) => updateForm({ customSubcategory: e.target.value, subcategory: "" })}
            className="w-full px-5 py-3.5 bg-blue-50/40 border border-blue-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-200/50 outline-none transition-all text-base"
            disabled={!form.category && !form.customCategory}
          />
        </div>

        <div className="space-y-6 mb-9">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
            <textarea
              placeholder="Brief product description..."
              value={form.description}
              onChange={(e) => updateForm({ description: e.target.value })}
              rows={3}
              className="w-full px-5 py-3.5 bg-gray-50/60 border border-gray-300 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all resize-none text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description
            </label>
            <textarea
              placeholder="Full description, features, specifications..."
              value={form.detailedDescription}
              onChange={(e) => updateForm({ detailedDescription: e.target.value })}
              rows={5}
              className="w-full px-5 py-3.5 bg-gray-50/60 border border-gray-300 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all text-base"
            />
          </div>

          <div className="pt-2">
             <label className="block text-sm font-medium text-gray-700 mb-3">
               Product Specifications
             </label>
             
             <div className="space-y-3">
               {form.specifications.map((spec, index) => (
                 <div key={index} className="flex gap-3 items-start">
                   <input
                     placeholder="Label (e.g. Material)"
                     value={spec.label}
                     onChange={(e) => handleSpecificationChange(index, "label", e.target.value)}
                     className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:border-indigo-400 outline-none text-sm"
                   />
                   <input
                     placeholder="Value (e.g. 100% Cotton)"
                     value={spec.value}
                     onChange={(e) => handleSpecificationChange(index, "value", e.target.value)}
                     className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:border-indigo-400 outline-none text-sm"
                   />
                   <button
                     onClick={() => removeSpecification(index)}
                     className="p-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                     title="Remove specification"
                   >
                     <Trash2 size={18} />
                   </button>
                 </div>
               ))}
               
               <button
                 onClick={addSpecification}
                 className="mt-2 text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-indigo-50 w-fit transition-colors"
               >
                 <Plus size={16} />
                 Add Specification
               </button>
             </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-7 mb-10">
          {/* Main Image */}
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <ImageIcon size={20} className="text-indigo-600" />
              Main Image
            </label>
            <div
              className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-all duration-200 cursor-pointer min-h-[16rem]
                ${form.mainImagePreview ? "border-indigo-400 bg-indigo-50/30" : "border-gray-300 hover:border-indigo-300 bg-gray-50/40"}`}
            >
              <input
                ref={mainImageInput}
                type="file"
                accept="image/*"
                onChange={handleMainImage}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              {form.mainImagePreview ? (
                <div className="relative">
                  <img 
                    src={form.mainImagePreview.startsWith("data:") || form.mainImagePreview.startsWith("http") ? form.mainImagePreview : `${BASE_URL}${form.mainImagePreview}`} 
                    alt="preview" 
                    className="w-full h-64 object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm font-medium">Click to replace</span>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-gray-500">
                  <Upload size={36} className="mb-3 text-gray-400" />
                  <p className="text-sm font-medium">Click to upload main image</p>
                  <p className="text-xs mt-1.5 opacity-70">Recommended 4:5 or 1:1</p>
                </div>
              )}
            </div>
          </div>

          {/* Carousel */}
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Images size={20} className="text-blue-600" />
              Gallery Images
            </label>
            <div
              className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 cursor-pointer min-h-[16rem]
                ${form.carouselPreviews.length > 0 ? "border-blue-400 bg-blue-50/20" : "border-gray-300 hover:border-blue-300 bg-gray-50/40"}`}
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
                <div className="space-y-4">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {form.carouselPreviews.map((img, idx) => (
                      <div key={idx} className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <img 
                          src={img.startsWith("data:") || img.startsWith("http") ? img : `${BASE_URL}${img}`} 
                          alt="" 
                          className="w-full h-full object-cover" 
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeCarouselImage(idx);
                          }}
                          className="absolute top-1.5 right-1.5 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-blue-700 font-medium text-center">
                    {form.carouselPreviews.length} image{form.carouselPreviews.length !== 1 ? "s" : ""}
                  </p>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-gray-500">
                  <Images size={36} className="mb-3 text-gray-400" />
                  <p className="text-sm font-medium">Click to add gallery images</p>
                  <p className="text-xs mt-1.5 opacity-70">Multiple files allowed</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2.5 active:scale-[0.98]"
          >
            <Plus size={22} />
            {form.editingId ? "Update Product" : "Add Product"}
          </button>

          {form.editingId && (
            <button
              onClick={cancelEdit}
              className="w-40 bg-gray-100 text-gray-700 font-semibold py-4 px-4 rounded-xl text-lg shadow-sm hover:shadow transition-all"
            >
              Cancel
            </button>
          )}
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
              const pid = product.id || product._id;
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
                        onClick={() => {
                          if (window.confirm("Delete this product?")) {
                            deleteProduct(pid);
                          }
                        }}
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
    </div>
  );
}