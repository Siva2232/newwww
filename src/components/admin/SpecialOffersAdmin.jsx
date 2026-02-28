// src/components/admin/SpecialOffersAdmin.jsx
import { useRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Sparkles, Gift, Upload, X, Plus, Trash2, Edit2, Loader2 } from "lucide-react";

import {
  getSpecialOffers,
  updateSpecialOffer,
  createSpecialOffer,
  deleteSpecialOffer,
  uploadImage,
  BASE_URL,
} from "../../api";

const SpecialOffersAdmin = () => {
  const scrollRef = useRef(null);
  const animationRef = useRef(null);
  const pausedRef = useRef(false);

  const [specialOffers, setSpecialOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    imageBase64: null,
    preview: null,
    category: "Exclusive",
  });
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch offers from backend on mount and after CRUD
  const fetchOffers = async () => {
    setLoading(true);
    try {
      const data = await getSpecialOffers();
      setSpecialOffers(data || []);
    } catch (err) {
      setError(err.message);
      console.error("Special offers fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOffers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setForm({ title: "", description: "", preview: null, category: "Exclusive", imageFile: null });
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5 MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, preview: reader.result, imageFile: file }));
      setError(null);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    if (!form.title.trim()) {
      setError("Title is required");
      setSubmitting(false);
      return;
    }
    if (!form.imageFile && !form.preview) {
      setError("Please upload an offer image");
      setSubmitting(false);
      return;
    }
    try {
      let imagePath = form.preview;
      
      if (form.imageFile) {
        const uploadResult = await uploadImage(form.imageFile);
        imagePath = uploadResult.path;
      }
      
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        image: imagePath,
        category: form.category,
      };
      if (editingId) {
        await updateSpecialOffer(editingId, payload);
      } else {
        await createSpecialOffer(payload);
      }
      resetForm();
      setEditingId(null);
      await fetchOffers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (offer) => {
    setForm({
      title: offer.title || "",
      description: offer.description || "",
      imageFile: null,
      preview: offer.image && (offer.image.startsWith("data:") || offer.image.startsWith("http"))
                 ? offer.image
                 : `${BASE_URL}${offer.image}`,
      category: offer.category || "Exclusive",
    });
    setError(null);
    setEditingId(offer._id || offer.id);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (id) => {
    // Remove browser confirm, show toast after delete
    // For custom confirmation, use modal. Here, auto-confirm.
    setSubmitting(true);
    try {
      await deleteSpecialOffer(id);
      fetchOffers();
      toast.success("Offer deleted successfully");
    } catch (err) {
      toast.error(err.message || "Failed to delete offer");
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const manualScroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    pausedRef.current = true;
    const approximateCardWidth = container.offsetWidth * 0.75;
    const scrollAmount = direction === "left" ? -approximateCardWidth : approximateCardWidth;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    setTimeout(() => (pausedRef.current = false), 900);
  };

  return (
    <div className="space-y-10 pb-12">
      {/* FORM CARD */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200/70 p-7 md:p-9 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-7 flex items-center gap-3">
          <Sparkles className="text-orange-600" size={26} strokeWidth={2.4} />
          {editingId ? "Edit Special Offer" : "Add Special Offer"}
        </h2>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
            <X size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Offer Title *"
              className="w-full px-5 py-3.5 bg-gray-50/60 border border-gray-300 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-200/50 outline-none transition-all text-base"
            />

            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Category (e.g. Frames, Albums)"
              className="w-full px-5 py-3.5 bg-gray-50/60 border border-gray-300 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-200/50 outline-none transition-all text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Short description of the special offer..."
              rows={3}
              className="w-full px-5 py-3.5 bg-gray-50/60 border border-gray-300 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-200/50 outline-none transition-all resize-none text-base"
            />
          </div>

          {/* Image Upload – matched style */}
          <div>
            <label className="block text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Upload size={20} className="text-orange-600" />
              Offer Image *
            </label>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-all duration-200 cursor-pointer min-h-[16rem]
                ${isDragging 
                  ? "border-orange-500 bg-orange-50 scale-[1.01]" 
                  : form.preview 
                  ? "border-orange-400 bg-orange-50/30" 
                  : "border-gray-300 hover:border-orange-400 bg-gray-50/40"}`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />

              {form.preview ? (
                <div className="relative group">
                  <img
                    src={form.preview}
                    alt="Offer preview"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow transition-colors"
                    >
                      Remove
                    </button>
                    <span className="text-white text-sm font-medium">Click to replace</span>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-gray-500">
                  <Upload size={40} className="mb-4 text-orange-400" />
                  <p className="text-base font-medium">
                    {isDragging ? "Drop image here" : "Click or drag & drop offer image"}
                  </p>
                  <p className="text-sm mt-2 opacity-70">
                    Recommended square • max 5 MB • JPG / PNG
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className={`flex-1 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 
                text-white font-semibold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl 
                transition-all duration-300 flex items-center justify-center gap-2.5 active:scale-[0.98]
                disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              <Plus size={22} />
              {editingId ? "Update Offer" : "Add Offer"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-lg transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* OFFERS LIST */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200/70 p-7 md:p-9 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Gift className="text-orange-600" size={26} strokeWidth={2.4} />
          Current Special Offers ({specialOffers.length})
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-12 h-12 animate-spin text-orange-600" />
          </div>
        ) : specialOffers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No special offers added yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Image</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {specialOffers.map((offer, idx) => (
                  <tr key={offer._id || offer.id || idx} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={
                          offer.image && (offer.image.startsWith("data:") || offer.image.startsWith("http"))
                            ? offer.image
                            : `${BASE_URL}${offer.image}`
                        }
                        alt={offer.title}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                        onError={e => { e.target.src = "/placeholder-image.jpg"; }}
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{offer.title}</td>
                    <td className="px-6 py-4 text-gray-700">{offer.category}</td>
                    <td className="px-6 py-4 text-gray-600 max-w-md truncate">{offer.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(offer)}
                          className="bg-amber-50 hover:bg-amber-100 text-amber-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
                        >
                          <Edit2 size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(offer._id || offer.id)}
                          disabled={submitting}
                          className="bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecialOffersAdmin;