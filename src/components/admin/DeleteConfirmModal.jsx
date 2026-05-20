import { AlertTriangle, Loader2, X } from "lucide-react";

export default function DeleteConfirmModal({
  isOpen,
  title = "Delete this item?",
  description = "This action cannot be undone.",
  itemName,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
  isLoading = false,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onCancel}
        disabled={isLoading}
        aria-label="Close"
      />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="text-rose-600" size={24} />
            </div>
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>
          <h3 id="delete-modal-title" className="mt-4 text-lg font-bold text-slate-900">
            {title}
          </h3>
          {itemName && (
            <p className="mt-2 text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 line-clamp-2">
              {itemName}
            </p>
          )}
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">{description}</p>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-white disabled:opacity-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-md disabled:opacity-60 transition"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Deleting...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
