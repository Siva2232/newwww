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

export default function ProductsManagement() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    shopCategories,
    setShopCategories,
  } = useProducts();

  const [form, setForm] = useState({
    name: "",
    price: "",
    originalPrice: "",
    category: "",
    customCategory: "",
    description: "",
    detailedDescription: "",
    mainImage: null,
    carouselImages: [],
    editingId: null,
  });

  const mainImageInput = useRef(null);
  const carouselInput = useRef(null);

  const updateForm = (updates) => setForm((prev) => ({ ...prev, ...updates }));

  // Image compression
  const compressImageFile = (file, maxWidth = 1200, quality = 0.75) => {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) {
          const ratio = maxWidth / width;
          width = maxWidth;
          height *= ratio;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        URL.revokeObjectURL(url);
        resolve(dataUrl);
      };
      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(err);
      };
      img.src = url;
    });
  };

  const handleMainImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file, 1200, 0.78);
      updateForm({ mainImage: dataUrl });
    } catch {
      const reader = new FileReader();
      reader.onload = () => updateForm({ mainImage: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleCarouselImages = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const promises = files.map((file) =>
      compressImageFile(file, 1000, 0.72).catch(() => {
        return new Promise((res) => {
          const r = new FileReader();
          r.onload = () => res(r.result);
          r.readAsDataURL(file);
        });
      })
    );

    const results = await Promise.all(promises);
    updateForm({
      carouselImages: [...form.carouselImages, ...results],
    });
  };

  const removeCarouselImage = (index) => {
    updateForm({
      carouselImages: form.carouselImages.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return alert("Product name is required");
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      return alert("Valid positive price required");
    if (!form.mainImage) return alert("Main image is required");

    let category = "uncategorized";
    const custom = form.customCategory?.trim();
    const selected = form.category?.trim();

    if (custom) category = custom;
    else if (selected) category = selected;

    // Auto-create new category
    if (category !== "uncategorized") {
      const exists = shopCategories.some(
        (c) => c.name.toLowerCase() === category.toLowerCase()
      );
      if (!exists) {
        const catImage =
          form.mainImage ||
          form.carouselImages[0] ||
          `https://via.placeholder.com/400x400?text=${encodeURIComponent(category)}`;

        setShopCategories((prev) => [
          ...prev,
          {
            id: Date.now(),
            name: category,
            image: catImage,
            link: `/category/${category.toLowerCase().replace(/\s+/g, "-")}`,
          },
        ]);
      }
    }

    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      category,
      description: form.description.trim() || "Premium quality product",
      detailedDescription: form.detailedDescription?.trim() || "",
      mainImage: form.mainImage,
      carouselImages: form.carouselImages,
    };

    try {
      if (form.editingId) {
        await updateProduct(form.editingId, payload);
      } else {
        await addProduct(payload);
      }

      // Reset form
      setForm({
        name: "",
        price: "",
        originalPrice: "",
        category: "",
        customCategory: "",
        description: "",
        detailedDescription: "",
        mainImage: null,
        carouselImages: [],
        editingId: null,
      });

      if (mainImageInput.current) mainImageInput.current.value = "";
      if (carouselInput.current) carouselInput.current.value = "";
    } catch (error) {
      alert("Error: " + (error.message || "Failed to save product"));
      console.error("Submit error:", error);
    }
  };

  const startEdit = (product) => {
    setForm({
      editingId: product.id,
      name: product.name || "",
      price: product.price || "",
      originalPrice: product.originalPrice || "",
      category: product.category || "",
      customCategory: "",
      description: product.description || "",
      detailedDescription: product.detailedDescription || "",
      mainImage: product.mainImage || null,
      carouselImages: product.carouselImages || [],
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
      mainImage: null,
      carouselImages: [],
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
              onChange={(e) => updateForm({ category: e.target.value, customCategory: "" })}
              className="w-full px-5 py-3.5 bg-gray-50/60 border border-gray-300 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all text-base"
            >
              <option value="">— Select existing —</option>
              {shopCategories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
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
                ${form.mainImage ? "border-indigo-400 bg-indigo-50/30" : "border-gray-300 hover:border-indigo-300 bg-gray-50/40"}`}
            >
              <input
                ref={mainImageInput}
                type="file"
                accept="image/*"
                onChange={handleMainImage}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              {form.mainImage ? (
                <div className="relative">
                  <img src={form.mainImage} alt="preview" className="w-full h-64 object-cover" />
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
                ${form.carouselImages.length > 0 ? "border-blue-400 bg-blue-50/20" : "border-gray-300 hover:border-blue-300 bg-gray-50/40"}`}
            >
              <input
                ref={carouselInput}
                type="file"
                multiple
                accept="image/*"
                onChange={handleCarouselImages}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />

              {form.carouselImages.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {form.carouselImages.map((img, idx) => (
                      <div key={idx} className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <img src={img} alt="" className="w-full h-full object-cover" />
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
                    {form.carouselImages.length} image{form.carouselImages.length !== 1 ? "s" : ""}
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
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="relative aspect-square bg-gray-50">
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.carouselImages?.length > 0 && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                      +{product.carouselImages.length}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-medium text-sm line-clamp-2 mb-1.5 h-10">
                    {product.name}
                  </h3>
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
                          deleteProduct(product.id);
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}