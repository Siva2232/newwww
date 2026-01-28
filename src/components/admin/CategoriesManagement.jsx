// src/components/admin/CategoriesManagement.jsx
import { useState, useRef } from "react";
import { useProducts } from "../../Context/ProductContext";
import { Plus, Upload, Trash2, X, Image as ImageIcon, Link2 } from "lucide-react";

export default function CategoriesManagement() {
  const { shopCategories, addCategory, deleteCategory } = useProducts();

  const [form, setForm] = useState({
    name: "",
    link: "",
    imageBase64: null,
    preview: null,
  });

  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const resetForm = () => {
    setForm({ name: "", link: "", imageBase64: null, preview: null });
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }

    // Optional: basic size check (~5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5 MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        imageBase64: reader.result,
        preview: reader.result,
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

  const generateSlug = (name) => {
    if (!name?.trim()) return "";
    return `/category/${name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")}`;
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError("Category name is required");
      return;
    }
    if (!form.imageBase64) {
      setError("Please upload a category image");
      return;
    }

    const nameLower = form.name.trim().toLowerCase();
    if (shopCategories.some((c) => c.name.toLowerCase() === nameLower)) {
      setError("A category with this name already exists");
      return;
    }

    const slug = form.link.trim() || generateSlug(form.name);

    try {
      const payload = {
        name: form.name.trim(),
        link: slug,
        imageBase64: form.imageBase64,
        description: "",
      };

      await addCategory(payload);
      resetForm();
    } catch (error) {
      setError("Error: " + (error.message || "Failed to create category"));
      console.error("Submit error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?\n\nProducts using it will fall back to 'uncategorized'.")) {
      return;
    }
    try {
      await deleteCategory(id);
    } catch (error) {
      alert("Error: " + (error.message || "Failed to delete category"));
      console.error("Delete error:", error);
    }
  };

  // ────────────────────────────────────────────────
  // return starts here — no extra } above it
  return (
    <div className="space-y-10 pb-12">
      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="px-7 py-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Plus className="text-violet-600" size={26} strokeWidth={2.4} />
            Add New Category
          </h2>
          <p className="mt-1.5 text-gray-600 text-sm">
            Create shop categories with custom images and links
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
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Wedding Albums, Photo Frames, etc."
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
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-violet-400 focus:ring-2 focus:ring-violet-200 outline-none transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Link2 size={16} />
                Custom Link <span className="text-gray-500 text-xs">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="/category/wedding-albums"
                value={form.link}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, link: e.target.value }));
                  setError("");
                }}
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-violet-400 focus:ring-2 focus:ring-violet-200 outline-none transition font-mono text-sm"
              />
              {!form.link && form.name.trim() && (
                <p className="text-xs text-gray-500 mt-1.5">
                  Suggested: {generateSlug(form.name)}
                </p>
              )}
            </div>
          </div>

          {/* Dropzone */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Image <span className="text-red-500">*</span>
            </label>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl transition-all min-h-[240px] cursor-pointer
                ${isDragging
                  ? "border-violet-500 bg-violet-50 scale-[1.015]"
                  : form.preview
                  ? "border-violet-300 bg-violet-50/30"
                  : "border-gray-300 hover:border-violet-400 bg-gray-50/60"}`}
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
                    alt="preview"
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
                  <Upload size={40} className="mb-4 text-violet-500 opacity-70" />
                  <p className="text-lg font-semibold text-gray-700">
                    {isDragging ? "Drop image here" : "Drag & drop or click to upload"}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    PNG / JPG — recommended 800×800 px — max 5 MB
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!form.name.trim() || !form.imageBase64}
            className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 
                     disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-2.5 text-lg"
          >
            <Plus size={22} />
            Create Category
          </button>
        </div>
      </div>

      {/* List */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <ImageIcon size={24} className="text-violet-600" />
          Current Categories ({shopCategories.length})
        </h3>

        {shopCategories.length === 0 ? (
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-12 text-center">
            <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-xl font-medium text-gray-600">No categories yet</p>
            <p className="text-gray-500 mt-2">Add your first category using the form above</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 sm:gap-6">
            {shopCategories.map((cat) => (
              <div
                key={cat.id}
                className="group bg-white rounded-2xl shadow border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 line-clamp-2 mb-1.5 text-base">
                    {cat.name}
                  </h4>
                  <p className="text-xs text-gray-500 font-mono mb-3 line-clamp-1 break-all">
                    {cat.link}
                  </p>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2.5 rounded-xl text-sm transition-colors"
                  >
                    <Trash2 size={16} />
                    Delete
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