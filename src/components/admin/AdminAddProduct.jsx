// src/components/admin/AdminAddProduct.jsx
import { useState, useEffect, useRef } from "react";
import { Save, AlertCircle, Image as ImageIcon, Upload, X } from "lucide-react";
import { createCustomProduct, uploadImage, BACKEND_URL } from "../../api";

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

  const fileInputRef = useRef(null);

  /* -------------------- CLEAN PREVIEW URL -------------------- */
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
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

      /* -------------------- IMAGE UPLOAD -------------------- */
      if (imageFile) {
        const uploadRes = await uploadImage(imageFile);
        imagePath = uploadRes.path;
      }

      /* -------------------- CREATE PRODUCT -------------------- */
      const productData = {
        name: form.name.trim(),
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : 0,
        shortDesc: form.shortDesc.trim(),
        fullDesc: form.fullDesc.trim(),
        tag: form.tag,
        image: imagePath,
      };

      await createCustomProduct(productData);

      setSuccess("Custom product added successfully 🎉");

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
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-12">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200/70 p-7 md:p-9 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-7 flex items-center gap-3">
          <ImageIcon className="text-indigo-600" size={26} strokeWidth={2.4} />
          Add New Custom Photo Book
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save size={22} />
            {loading ? "Adding..." : "Add Custom Photo Book"}
          </button>
        </form>
      </div>
    </div>
  );
}