import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ChevronRight, ChevronLeft, Loader2, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { submitCustomBookOrder } from "../../api";

export default function StudioForm({
  currentStep,
  setCurrentStep,
  formData,
  setFormData,
  selectedProduct,
  setSelectedProduct,
  setIsSubmitted,
}) {
  /* -------------------- AUTO FILL PRODUCT DATA -------------------- */
  useEffect(() => {
    if (selectedProduct) {
      setFormData((prev) => ({
        ...prev,
        bookName: selectedProduct.name || prev.bookName || "",
        bookPrice: selectedProduct.price || prev.bookPrice || "",
      }));
    }
  }, [selectedProduct, setFormData]);

  const [previews, setPreviews] = useState([]);
  const [files, setFiles] = useState([]);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handlePhotoChange = (e) => {
    const selected = Array.from(e.target.files || []);
    const valid = selected.filter((f) => f.type.startsWith("image/"));
    if (valid.length === 0) {
      toast.error("Only image files are allowed");
      return;
    }
    if (files.length + valid.length > 50) {
      toast.error("Maximum 50 photos allowed");
      return;
    }
    const newPreviews = valid.map((f) => URL.createObjectURL(f));
    setFiles((prev) => [...prev, ...valid]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removePhoto = (index) => {
    URL.revokeObjectURL(previews[index]);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const removeCover = () => {
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverFile(null);
    setCoverPreview("");
  };

  const handleSubmit = async () => {
    // 1. Basic client-side validation
    if (files.length === 0) {
      toast.error("Please upload at least one photo");
      return;
    }

    // 2. Ensure bookName and bookPrice are present
    const finalBookName = (
      formData.bookName ||
      selectedProduct?.name ||
      ""
    ).trim();
    const finalBookPrice = (
      formData.bookPrice ||
      selectedProduct?.price ||
      ""
    ).trim();

    if (!finalBookName) {
      toast.error("Product name is missing. Please select a product.");
      return;
    }
    if (!finalBookPrice) {
      toast.error("Product price is missing. Please select a product.");
      return;
    }

    // Debug what will be sent (open browser console)
    console.log("Submitting order with:", {
      customerName: formData.name?.trim(),
      customerPhone: formData.phone?.trim(),
      pages: formData.pages || "20",
      bookName: finalBookName,
      bookPrice: finalBookPrice,
      productId: selectedProduct?._id,
      photosCount: files.length,
      hasCover: !!coverFile,
    });

    setSubmitting(true);

    try {
      const data = new FormData();

      data.append("customerName", formData.name?.trim() || "");
      data.append("customerPhone", formData.phone?.trim() || "");
      data.append("pages", formData.pages || "20");

      // Always send the resolved values
      data.append("bookName", finalBookName);
      data.append("bookPrice", finalBookPrice);

      data.append(
        "bookDescription",
        formData.bookDescription || selectedProduct?.shortDesc || "",
      );
      data.append("notes", formData.notes || "");

      if (selectedProduct?._id) {
        data.append("productId", selectedProduct._id);
      }

      if (coverFile) {
        data.append("coverImage", coverFile);
      }

      files.forEach((file) => {
        data.append("photos", file);
      });

      const response = await submitCustomBookOrder(data);

      toast.success("Order submitted successfully!");
      setIsSubmitted(true);
    } catch (err) {
      console.error("Submit error:", err);
      // Show better error messages based on response
      if (err.response) {
        const msg = err.response.data?.message || "Server error";
        toast.error(msg);
      } else if (err.request) {
        toast.error("No response from server. Check your internet or backend.");
      } else {
        toast.error(err.message || "Failed to submit order");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20 px-5 sm:px-6 pb-16 max-w-3xl mx-auto">
      <motion.div
        layout
        className="bg-white rounded-2xl border border-zinc-200 shadow-lg overflow-hidden"
      >
        {selectedProduct && (
          <div className="bg-zinc-50 px-5 py-4 border-b">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-zinc-100">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">{selectedProduct.name}</h3>
                <p className="text-zinc-700 font-medium">
                  {selectedProduct.price}
                </p>
              </div>
            </div>
            {selectedProduct.shortDesc && (
              <p className="mt-2 text-sm text-zinc-600">
                {selectedProduct.shortDesc}
              </p>
            )}
          </div>
        )}

        <div className="p-5 sm:p-7">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-7"
              >
                <div className="flex justify-between items-center pb-4 border-b">
                  <h2 className="text-2xl sm:text-3xl font-bold">
                    Your Details
                  </h2>
                  <span className="text-xs font-black text-zinc-400 uppercase tracking-wider">
                    Step 1/2
                  </span>
                </div>

                <div className="space-y-6">
                  <div className="border-b pb-3 focus-within:border-zinc-800 transition-colors">
                    <label className="block text-xs font-black uppercase tracking-wide text-zinc-500 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      className="w-full text-lg font-medium outline-none"
                      placeholder="Enter your full name"
                      value={formData.name || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="border-b pb-3 focus-within:border-zinc-800 transition-colors">
                    <label className="block text-xs font-black uppercase tracking-wide text-zinc-500 mb-1">
                      WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      className="w-full text-lg font-medium outline-none"
                      placeholder="+91 ..."
                      value={formData.phone || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-7"
              >
                <div className="flex justify-between items-center pb-4 border-b">
                  <h2 className="text-2xl sm:text-3xl font-bold">
                    Upload Content
                  </h2>
                  <span className="text-xs font-black text-zinc-400 uppercase tracking-wider">
                    Step 2/2
                  </span>
                </div>

                {/* Cover Image */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Cover Image (optional)
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 rounded-xl w-full sm:w-64 h-48 cursor-pointer hover:border-zinc-500 transition">
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleCoverChange}
                      />
                      <Camera size={28} className="text-zinc-500 mb-2" />
                      <p className="text-sm font-medium">Upload cover</p>
                      <p className="text-xs text-zinc-500">PNG / JPG</p>
                    </label>

                    {coverPreview && (
                      <div className="relative">
                        <img
                          src={coverPreview}
                          alt="Cover preview"
                          className="w-48 h-48 object-cover rounded-xl border"
                        />
                        <button
                          onClick={removeCover}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Photos */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Photos for inside pages *
                  </label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 rounded-xl h-48 cursor-pointer hover:border-zinc-500 transition">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      hidden
                      onChange={handlePhotoChange}
                    />
                    <Camera size={28} className="text-zinc-500 mb-3" />
                    <p className="font-medium text-base">
                      Click or drag photos here
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      Max 50 images • JPG / PNG
                    </p>
                  </label>

                  {previews.length > 0 && (
                    <div className="mt-6">
                      <p className="text-sm font-medium mb-3">
                        {previews.length} photo
                        {previews.length !== 1 ? "s" : ""} selected
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-80 overflow-y-auto p-2 bg-zinc-50 rounded-lg">
                        {previews.map((src, i) => (
                          <div key={i} className="relative group">
                            <img
                              src={src}
                              alt={`photo ${i + 1}`}
                              className="aspect-square object-cover rounded-lg border"
                            />
                            <button
                              onClick={() => removePhoto(i)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="bg-zinc-50 px-5 py-4 flex items-center justify-between border-t">
          <button
            onClick={() =>
              currentStep === 1
                ? setSelectedProduct(null)
                : setCurrentStep((s) => s - 1)
            }
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 flex items-center gap-1"
          >
            <ChevronLeft size={16} />
            {currentStep === 1 ? "Back to products" : "Back"}
          </button>

          <button
            onClick={() =>
              currentStep === 1 ? setCurrentStep(2) : handleSubmit()
            }
            disabled={
              submitting ||
              (currentStep === 1 &&
                (!formData?.name?.trim() || !formData?.phone?.trim())) ||
              (currentStep === 2 && files.length === 0)
            }
            className="px-6 py-2.5 bg-zinc-900 text-white rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Submitting...
              </>
            ) : currentStep === 2 ? (
              "Submit Order"
            ) : (
              <>
                Continue
                <ChevronRight size={16} />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
