import { useState } from "react";
import { toast } from "react-toastify";
import {
  X,
  User,
  Phone,
  Download,
  Image as ImageIcon,
  FileArchive,
  Loader2,
  Calendar,
  CheckCircle,
  Clock,
  Save,
} from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { updateCustomBookOrder } from "../../api"; // call backend to modify orders

// Fixed: proper template literal with backticks
const getImageUrl = (path) => {
  if (!path) return "/vite.svg"; // fallback
  if (path.startsWith("http") || path.startsWith("//")) {
    return path;
  }
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://api-ppdo.ppdo.shop";
  return `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
};

export default function AdminOrderDetail({ order, onClose }) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);
  
  // Local state for editing
  const [status, setStatus] = useState(order.status || "Pending");
  const [adminNotes, setAdminNotes] = useState(order.adminNotes || "");
  const [updating, setUpdating] = useState(false);

  if (!order) return null;

  const customer = order.customer || {};
  const book = order.book || {};
  const coverImage = order.coverImage;
  const photos = order.photos || [];

  const handleUpdateOrder = async () => {
    setUpdating(true);
    try {
      await updateCustomBookOrder(order._id, { status, adminNotes });
      // Optionally notify parent to refresh list, or just show success
      toast.success("Order updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order");
    } finally {
      setUpdating(false);
    }
  };

  const handleDownloadSingle = (imagePath, fileName = "image.jpg") => {
    const url = getImageUrl(imagePath);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkDownload = async () => {
    if (photos.length === 0 && !coverImage) {
      setError("No images available to download");
      return;
    }

    setDownloading(true);
    setError(null);

    try {
      const zip = new JSZip();
      // Fixed: backticks
      const folder = zip.folder(`CustomBook_${order._id.slice(-8)}`);

      // Add cover if exists
      if (coverImage) {
        const coverUrl = getImageUrl(coverImage);
        const coverResponse = await fetch(coverUrl);
        if (!coverResponse.ok) throw new Error("Failed to fetch cover");
        const coverBlob = await coverResponse.blob();
        folder.file("cover.jpg", coverBlob);
      }

      // Add all photos
      for (let i = 0; i < photos.length; i++) {
        const photoPath = photos[i];
        const photoUrl = getImageUrl(photoPath);
        const photoResponse = await fetch(photoUrl);
        if (!photoResponse.ok) {
          // Fixed: backticks
          console.warn(`Failed to fetch photo ${i + 1}`);
          continue;
        }
        const photoBlob = await photoResponse.blob();
        // Fixed: backticks
        folder.file(`photo_${String(i + 1).padStart(2, "0")}.jpg`, photoBlob);
      }

      const zipContent = await zip.generateAsync({ type: "blob" });
      // Fixed: backticks
      saveAs(zipContent, `custom-book-order-${order._id.slice(-8)}.zip`);
    } catch (err) {
      console.error("Bulk download failed:", err);
      setError("Failed to create zip file. Try downloading images one by one.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto relative">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">
            Custom Book Order Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          )}

          {/* Quick Actions / Status */}
          <section className="bg-indigo-50/50 p-5 rounded-xl border border-indigo-100">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-indigo-900">
              <CheckCircle size={22} className="text-indigo-600" />
              Order Status & Management
            </h3>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="In Production">In Production</option>
                  <option value="Ready">Ready</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Notes (Internal)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Private notes about this order..."
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-lg h-[42px] min-h-[42px] leading-tight focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="self-end">
                <button
                  onClick={handleUpdateOrder}
                  disabled={updating}
                  className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-70 transition font-medium"
                >
                  {updating ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Save Changes
                </button>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <Clock size={16} />
              Ordered on:{" "}
              {new Date(order.createdAt).toLocaleString("en-IN", {
                dateStyle: "full",
                timeStyle: "short",
              })}
            </div>
          </section>

          {/* Book / Product Info */}
          <section>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ImageIcon size={22} className="text-indigo-600" />
              Book / Product Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-5 rounded-xl border">
              <div>
                <div className="text-sm text-gray-600">Book Name</div>
                <div className="text-lg font-medium">{book.name || "—"}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Price</div>
                <div className="text-lg font-bold text-indigo-700">
                  {book.price || "—"}
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="text-sm text-gray-600">Description</div>
                <div className="mt-1">
                  {book.description || "No description"}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Pages</div>
                <div className="text-lg font-medium">{book.pages || "20"}</div>
              </div>
              {order.productReference && (
                <div className="md:col-span-2 text-sm text-gray-500 italic">
                  Linked to product: {order.productReference.name || "Custom"}
                </div>
              )}
            </div>
          </section>

          {/* Customer Details */}
          <section>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User size={22} className="text-indigo-600" />
              Customer Details
            </h3>
            <div className="bg-gray-50 p-5 rounded-xl border grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-600">Name</div>
                <div className="text-lg font-medium">
                  {customer.name || "—"}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Phone</div>
                <div className="text-lg font-medium">
                  {customer.phone || "—"}
                </div>
              </div>
              {order.notes && (
                <div className="md:col-span-2">
                  <div className="text-sm text-gray-600">Customer Notes</div>
                  <div className="mt-1 whitespace-pre-line">{order.notes}</div>
                </div>
              )}
            </div>
          </section>

          {/* Images Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <ImageIcon size={22} className="text-indigo-600" />
                Uploaded Images ({photos.length + (coverImage ? 1 : 0)})
              </h3>

              {(coverImage || photos.length > 0) && (
                <button
                  onClick={handleBulkDownload}
                  disabled={downloading}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {downloading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Creating ZIP...
                    </>
                  ) : (
                    <>
                      <FileArchive size={18} />
                      Download All (ZIP)
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="space-y-8">
              {/* Cover Image */}
              {coverImage && (
                <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
                  <div className="bg-gray-50 px-5 py-3 font-medium border-b flex justify-between items-center">
                    <span>Cover Image</span>
                    <button
                      onClick={() =>
                        handleDownloadSingle(coverImage, "cover.jpg")
                      }
                      className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 text-sm"
                    >
                      <Download size={16} />
                      Download
                    </button>
                  </div>
                  <div className="p-4">
                    <img
                      src={getImageUrl(coverImage)}
                      alt="Cover"
                      className="max-h-[500px] mx-auto rounded object-contain shadow"
                      onError={(e) => (e.target.src = "/vite.svg")}
                    />
                  </div>
                </div>
              )}

              {/* Multiple Photos */}
              {photos.length > 0 && (
                <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
                  <div className="bg-gray-50 px-5 py-3 font-medium border-b flex justify-between items-center">
                    <span>Customer Uploaded Photos ({photos.length})</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
                    {photos.map((photo, index) => (
                      <div
                        key={index}
                        className="group relative rounded-lg overflow-hidden border bg-gray-50 hover:shadow-md transition-shadow"
                      >
                        <img
                          src={getImageUrl(photo)}
                          // Fixed: backticks for alt
                          alt={`Photo ${index + 1}`}
                          className="w-full h-48 object-cover"
                          onError={(e) => (e.target.src = "/vite.svg")}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() =>
                              // Fixed: backticks for filename
                              handleDownloadSingle(
                                photo,
                                `photo-${index + 1}.jpg`,
                              )
                            }
                            className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium shadow hover:bg-gray-100 flex items-center gap-2"
                          >
                            <Download size={18} />
                            Download
                          </button>
                        </div>
                        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                          #{index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!coverImage && photos.length === 0 && (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed">
                  No images uploaded for this order
                </div>
              )}
            </div>
          </section>

          {/* Admin Section */}
          <section className="bg-gray-50 p-5 rounded-xl border">
            <h3 className="text-lg font-semibold mb-3">Admin Section</h3>
            <div className="text-sm text-gray-700">
              Status: <strong>{order.status || "Pending"}</strong>
            </div>
            {order.adminNotes && (
              <div className="mt-3">
                <div className="text-sm text-gray-600">Admin Notes:</div>
                <div className="mt-1 whitespace-pre-line">
                  {order.adminNotes}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
