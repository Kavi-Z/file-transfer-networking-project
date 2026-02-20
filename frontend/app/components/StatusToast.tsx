"use client";

import { ToastMessage } from "../page";

interface StatusToastProps {
  toast: ToastMessage;
  onClose: () => void;
}

export default function StatusToast({
  toast,
  onClose,
}: StatusToastProps) {
  return (
    <div className="p-4 rounded-xl bg-slate-800 text-white shadow-lg border border-white/10">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm">{toast.message}</span>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
