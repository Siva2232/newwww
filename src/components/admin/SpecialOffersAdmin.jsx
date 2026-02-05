// src/components/admin/SpecialOffersAdmin.jsx
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Timer, ArrowRight, Loader2, Plus, Trash2, Edit2, Gift, Upload, X } from "lucide-react";
import {
  getSpecialOffers,
  createSpecialOffer,
  updateSpecialOffer,
  deleteSpecialOffer,
  uploadImage,
  BACKEND_URL
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

  // Only fetch offers on mount
  useEffect(() => {
    fetchOffers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Drag-and-drop image upload logic
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
      
      // Upload ONLY if there's a new file (not just an existing preview string)
      if (form.imageFile) {
        const uploadResult = await uploadImage(form.imageFile);
        imagePath = uploadResult.path;
      }
      
      // If preview is still a data URI and no file provided (rare edge case), it will fail or save huge string.
      // But we prevent that via req check.

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
                 : `${BACKEND_URL}${offer.image}`,
      category: offer.category || "Exclusive",
    });
    setError(null);
    setEditingId(offer._id || offer.id); // support both _id and id
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this offer?")) return;
    setSubmitting(true);
    try {
      await deleteSpecialOffer(id);
      fetchOffers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Carousel scroll (optional - admin preview)
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
    <section className="relative w-full bg-[#f5f5f7] py-14 sm:py-16 md:py-24 overflow-hidden min-h-[600px]">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 mb-10">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Sparkles size={20} className="text-orange-500" />
          {editingId ? "Edit Special Offer" : "Add Special Offer"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
              required
              className="border rounded px-3 py-2 w-full"
            />
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Category (e.g. Frames, Albums)"
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="border rounded px-3 py-2 w-full"
            rows={2}
          />
          {/* Dropzone */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Offer Image <span className="text-red-500">*</span></label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl transition-all min-h-[180px] cursor-pointer
                ${isDragging
                  ? "border-orange-500 bg-orange-50 scale-[1.015]"
                  : form.preview
                  ? "border-orange-300 bg-orange-50/30"
                  : "border-gray-300 hover:border-orange-400 bg-gray-50/60"}`}
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
                    type="button"
                    className="absolute top-3 right-3 bg-black/70 hover:bg-black/90 text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition shadow-md"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                  <Upload size={40} className="mb-4 text-orange-500 opacity-70" />
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
          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-orange-500 text-white px-6 py-2 rounded font-bold flex items-center gap-2 disabled:opacity-60"
              disabled={submitting}
            >
              <Plus size={16} /> {editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button
                type="button"
                className="bg-gray-300 text-black px-4 py-2 rounded font-bold"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Gift className="text-orange-500" size={18} /> Special Offers List
        </h3>
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr className="bg-orange-50">
                  <th className="p-2 text-left">Image</th>
                  <th className="p-2 text-left">Title</th>
                  <th className="p-2 text-left">Category</th>
                  <th className="p-2 text-left">Description</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {specialOffers.map((offer, idx) => (
                  <tr key={offer._id || offer.id || idx} className="border-b hover:bg-orange-50/30">
                    <td className="p-2">
                      <img
                        src={
                          offer.image && (offer.image.startsWith("data:") || offer.image.startsWith("http"))
                            ? offer.image
                            : `${BACKEND_URL}${offer.image}`
                        }
                        alt={offer.title}
                        className="w-20 h-14 object-cover rounded-lg border"
                        onError={e => { e.target.onerror = null; e.target.src = "/no-image.png"; }}
                      />
                    </td>
                    <td className="p-2 font-semibold">{offer.title}</td>
                    <td className="p-2">{offer.category}</td>
                    <td className="p-2 max-w-xs truncate">{offer.description}</td>
                    <td className="p-2 flex gap-2">
                      <button
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1"
                        onClick={() => handleEdit(offer)}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="bg-red-100 text-red-700 px-2 py-1 rounded flex items-center gap-1"
                        onClick={() => handleDelete(offer._id || offer.id)}
                        title="Delete"
                        disabled={submitting}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default SpecialOffersAdmin;