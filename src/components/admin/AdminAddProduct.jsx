// src/components/admin/AdminAddProduct.jsx
import { useState, useEffect, useRef } from "react";
import { Save, AlertCircle, Image as ImageIcon, Upload, X, Trash2, Pencil } from "lucide-react";
import {
  createCustomProduct,
  updateCustomProduct,
  deleteCustomProduct,
  getCustomProducts,
  uploadImage,
  BASE_URL,
} from "../../api";

export default function AdminAddProduct() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    originalPrice: "",
    shortDesc: "",
    fullDesc: "",
    tag: "Signature",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // New state for listing/editing
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fileInputRef = useRef(null);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getCustomProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  /* -------------------- CLEAN PREVIEW URL -------------------- */
  useEffect(() => {
    return () => {
      // Only revoke if it's a local object URL
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!form.name || !form.price || !form.shortDesc) {
      setError("Name, price and short description are required");
      setLoading(false);
      return;
    }

    try {
      let imagePath = "";
      
      // If editing and we have a previous image (preview is string path), keep it
      if (editingId && !imageFile && imagePreview && !imagePreview.startsWith("blob:")) {
        imagePath = imagePreview; // Use existing path
      }

      /* -------------------- IMAGE UPLOAD -------------------- */
      if (imageFile) {
        const uploadRes = await uploadImage(imageFile);
        imagePath = uploadRes.path;
      }
      
      // If creating and no image
      if (!editingId && !imagePath) {
         // It's technically allowed in schema? User prompts imply "Cover Image *". 
         // Let's enforce it visually but maybe backend allows optional.
         // But let's proceed.
      }

      /* -------------------- PREPARE DATA -------------------- */
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
        setSuccess("Custom product updated successfully 🎉");
      } else {
        await createCustomProduct(productData);
        setSuccess("Custom product added successfully 🎉");
      }

      // Refresh list
      fetchProducts();

      // Reset form
      cancelEdit();
      
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (product) => {
    setEditingId(product._id || product.id);
    setForm({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || "",
      shortDesc: product.shortDesc || "",
      fullDesc: product.fullDesc || "",
      tag: product.tag || "Signature",
    });
    
    // Set preview to existing image URL (or path)
    const imgUrl = product.image ? (product.image.startsWith("http") ? product.image : `${BASE_URL}${product.image}`) : "";
    setImagePreview(imgUrl);
    setImageFile(null); // Clear any pending file
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({
      name: "",
      price: "",
      originalPrice: "",
      shortDesc: "",
      fullDesc: "",
      tag: "Signature",
    });
    setImageFile(null);
    setImagePreview("");
    setError("");
    setSuccess("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteCustomProduct(id);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  return (
    <div className="space-y-10 pb-12">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200/70 p-7 md:p-9 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-7 flex items-center gap-3">
          <ImageIcon className="text-indigo-600" size={26} strokeWidth={2.4} />
          {editingId ? "Edit Custom Photo Book" : "Add New Custom Photo Book"}
        </h2>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Photo Book Name *"
              className="w-full px-5 py-3.5 bg-gray-50/60 border border-gray-300 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all text-base"
            />

            <select
              name="tag"
              value={form.tag}
              onChange={handleChange}
              className="w-full px-5 py-3.5 bg-gray-50/60 border border-gray-300 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all text-base"
            >
              <option value="Signature">Signature</option>
              <option value="Essential">Essential</option>
              <option value="Gift">Gift</option>
              <option value="Premium">Premium</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price (₹) *"
              className="w-full px-5 py-3.5 bg-gray-50/60 border border-gray-300 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all text-base"
            />

            <input
              type="number"
              name="originalPrice"
              value={form.originalPrice}
              onChange={handleChange}
              placeholder="Original Price (optional)"
              className="w-full px-5 py-3.5 bg-gray-50/60 border border-gray-300 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description *
            </label>
            <textarea
              name="shortDesc"
              value={form.shortDesc}
              onChange={handleChange}
              rows={3}
              placeholder="Brief description visible in listings..."
              className="w-full px-5 py-3.5 bg-gray-50/60 border border-gray-300 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all resize-none text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Description
            </label>
            <textarea
              name="fullDesc"
              value={form.fullDesc}
              onChange={handleChange}
              rows={5}
              placeholder="Detailed info, features, paper type, size options..."
              className="w-full px-5 py-3.5 bg-gray-50/60 border border-gray-300 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200/50 outline-none transition-all text-base"
            />
          </div>

          {/* ──────────────────────────────────────────────── */}
          {/*               Image Upload – same style           */}
          {/* ──────────────────────────────────────────────── */}
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <ImageIcon size={20} className="text-indigo-600" />
              Cover Image *
            </label>

            <div
              className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-all duration-200 cursor-pointer min-h-[16rem]
                ${imagePreview ? "border-indigo-400 bg-indigo-50/30" : "border-gray-300 hover:border-indigo-300 bg-gray-50/40"}`}
              onClick={() => !imagePreview && fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />

              {imagePreview ? (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageFile(null);
                        setImagePreview("");
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="bg-red-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow hover:bg-red-700 transition-colors"
                    >
                      Remove
                    </button>
                    <span className="text-white text-sm font-medium">
                      Click area to replace
                    </span>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-gray-500">
                  <Upload size={36} className="mb-3 text-gray-400" />
                  <p className="text-sm font-medium">Click to upload cover image</p>
                  <p className="text-xs mt-1.5 opacity-70">
                    Recommended 4:5 or 1:1 • JPG / PNG
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Save size={22} />
              {loading ? (editingId ? "Updating..." : "Adding...") : (editingId ? "Update Product" : "Add Custom Photo Book")}
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl text-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ──────────────────────────────────────────────── */}
      {/*               EXISTING PRODUCTS LIST             */}
      {/* ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow border border-gray-200/60 p-7">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Current Custom Products ({products.length})</h2>

        {products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No custom products added yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const pid = product._id || product.id;
              return (
                <div
                  key={pid}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow group flex flex-col"
                >
                  <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
                    <img
                      src={product.image ? (product.image.startsWith("http") ? product.image : `${BASE_URL}${product.image}`) : "https://placehold.co/400x500?text=No+Image"}
                      alt={product.name}
                      onError={(e) => {
                         e.target.onerror = null; 
                         e.target.src = "https://placehold.co/400x500?text=No+Image";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-md shadow-sm">
                       {product.tag || "Custom"}
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1 h-10">
                      {product.shortDesc}
                    </p>
                    
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-lg font-bold text-indigo-700">
                        ₹{Number(product.price).toLocaleString()}
                      </span>
                      {product.originalPrice > 0 && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{Number(product.originalPrice).toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => startEdit(product)}
                        className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-700 text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(pid)}
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
      </div>
    </div>
  );
}