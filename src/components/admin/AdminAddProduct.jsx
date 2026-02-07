// src/components/admin/AdminAddProduct.jsx
import { useState, useEffect } from "react";
import { Save, AlertCircle } from "lucide-react";
import { createCustomProduct, uploadImage } from "../../api";

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
    <div className="p-6 bg-white rounded-xl shadow border max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add New Custom Photo Book</h2>

      {error && (
        <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full px-4 py-2 border rounded-lg"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="number"
            name="originalPrice"
            value={form.originalPrice}
            onChange={handleChange}
            placeholder="Original Price (Optional)"
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <input
          name="shortDesc"
          value={form.shortDesc}
          onChange={handleChange}
          placeholder="Short description"
          className="w-full px-4 py-2 border rounded-lg"
        />

        <textarea
          name="fullDesc"
          value={form.fullDesc}
          onChange={handleChange}
          rows={4}
          placeholder="Full description"
          className="w-full px-4 py-2 border rounded-lg"
        />

        <select
          name="tag"
          value={form.tag}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="Signature">Signature</option>
          <option value="Essential">Essential</option>
          <option value="Gift">Gift</option>
          <option value="Premium">Premium</option>
        </select>

        <input type="file" accept="image/*" onChange={handleImageChange} />

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="max-h-48 mx-auto rounded border"
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg disabled:opacity-60"
        >
          {loading ? "Adding..." : "Add Custom Product"}
        </button>
      </form>
    </div>
  );
}
