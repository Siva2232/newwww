// src/components/admin/BannersManagement.jsx
import { useState, useRef } from "react";
import { useProducts } from "../../Context/ProductContext";
import { Plus, Upload, Trash2, X, Image as ImageIcon } from "lucide-react";

import { uploadImage, BASE_URL } from "../../api"; // use shared helper for uploads

export default function BannersManagement() {
  const { heroBanners, addHeroBanner, deleteHeroBanner } = useProducts();

  const [form, setForm] = useState({
    title: "",
    description: "",
    preview: null,
    imageFile: null,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const resetForm = () => {
    setForm({ title: "", description: "", preview: null, imageFile: null });
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed (JPG, PNG, etc.)");
      return;
    }

    // Optional: warn if too large (~8MB for banners)
    if (file.size > 8 * 1024 * 1024) {
      setError("Image is too large. Recommended max size: 8 MB");
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

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      setError("Banner title is required");
      return;
    }
    if (!form.imageFile) {
      setError("Please upload a banner image");
      return;
    }

    const titleLower = form.title.trim().toLowerCase();
    if (heroBanners.some((b) => b.title.toLowerCase() === titleLower)) {
      setError("A banner with this title already exists");
      return;
    }

    try {
      // 1. Upload image to server
      const uploadResult = await uploadImage(form.imageFile);
      const imagePath = uploadResult.path;

      // 2. Add banner with image path
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        // Pass path instead of base64
        imageBase64: imagePath, 
        // Note: keeping the key 'imageBase64' because ProductContext/api might map it to 'image'
        // or we need to check ProductContext.jsx. 
        // Let's verify ProductContext's addHeroBanner.
      };
      
      // In ProductContext lines 525:
      // const payload = { ..., image: data.imageBase64 || null };
      // So passing imagePath as imageBase64 works fine there.

      await addHeroBanner(payload);
      resetForm();
    } catch (error) {
      setError("Error: " + (error.message || "Failed to create banner"));
      console.error("Submit error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this hero banner?\nIt will no longer appear on the homepage.")) {
      return;
    }
    try {
      await deleteHeroBanner(id);
    } catch (error) {
      alert("Error: " + (error.message || "Failed to delete banner"));
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-7 py-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Plus className="text-indigo-600" size={26} strokeWidth={2.4} />
            Add New Hero Banner
          </h2>
          <p className="mt-1.5 text-gray-600 text-sm">
            Create eye-catching banners for your homepage carousel
          </p>
        </div>

        <div className="p-6 md:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Banner Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Summer Sale – Up to 70% Off!"
                value={form.title}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, title: e.target.value }));
                  setError("");
                }}
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Description (optional)
              </label>
              <input
                type="text"
                placeholder="Limited time offer • Free shipping on orders above ₹999"
                value={form.description}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, description: e.target.value }));
                  setError("");
                }}
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none transition"
              />
            </div>
          </div>

          {/* Image Dropzone */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner Image <span className="text-red-500">*</span>
            </label>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl transition-all min-h-[240px] cursor-pointer
                ${isDragging
                  ? "border-indigo-500 bg-indigo-50 scale-[1.015]"
                  : form.preview
                  ? "border-indigo-300 bg-indigo-50/30"
                  : "border-gray-300 hover:border-indigo-400 bg-gray-50/60"}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />

              {form.preview ? (
                <div className="relative group h-full">
                  <img
                    src={form.preview}
                    alt="Banner preview"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <button
                    onClick={resetForm}
                    className="absolute top-3 right-3 bg-black/70 hover:bg-black/90 text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition shadow-md"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                  <Upload size={40} className="mb-4 text-indigo-500 opacity-70" />
                  <p className="text-lg font-semibold text-gray-700">
                    {isDragging ? "Drop image here" : "Drag & drop or click to upload"}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Recommended: 1920 × 800 px • Max 8 MB • JPG / PNG
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!form.title.trim() || !form.imageFile}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 
                     disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2.5 text-lg"
          >
            <Plus size={22} />
            Create Banner
          </button>
        </div>
      </div>

      {/* List of Banners */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <ImageIcon size={24} className="text-indigo-600" />
          Active Hero Banners ({heroBanners.length})
        </h3>

        {heroBanners.length === 0 ? (
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-12 text-center">
            <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-xl font-medium text-gray-600">No hero banners yet</p>
            <p className="text-gray-500 mt-2">Add your first banner using the form above</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {heroBanners.map((banner, index) => (
              <div
                key={banner._id || banner.id || index}
                className="group bg-white rounded-2xl shadow border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={banner.image?.startsWith('data:') || banner.image?.startsWith('http') ? banner.image : `${BASE_URL}${banner.image}`}
                    alt={banner.title}
                    className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="p-5">
                  <h4 className="font-bold text-lg text-gray-900 line-clamp-2 mb-2">
                    {banner.title}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2 min-h-[3rem] mb-4">
                    {banner.description || "No description added"}
                  </p>

                  <button
                    onClick={() => handleDelete(banner._id || banner.id)}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 font-medium py-3 rounded-xl transition-colors"
                  >
                    <Trash2 size={18} />
                    Delete Banner
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}