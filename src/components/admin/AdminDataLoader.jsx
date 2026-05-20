import { Loader2 } from "lucide-react";

export default function AdminDataLoader({ label = "Loading store data..." }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-10">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
        <Loader2 className="text-indigo-600 animate-spin" size={28} />
      </div>
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      <p className="text-xs text-slate-400 mt-1">Syncing from server…</p>
    </div>
  );
}
