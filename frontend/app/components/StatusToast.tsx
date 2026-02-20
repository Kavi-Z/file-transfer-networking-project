"use client";

import { ToastMessage } from "../page";
import { useEffect, useState, useCallback } from "react";

interface StatusToastProps {
  toast: ToastMessage;
  onClose: () => void;
}

export default function StatusToast({ toast, onClose }: StatusToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));

    const duration = 4000;
    const interval = 30;
    const step = (interval / duration) * 100;
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  }, [onClose]);

  const config = {
    success: {
      icon: (
        <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ),
      bar: "bg-emerald-500",
    },
    error: {
      icon: (
        <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      bar: "bg-red-500",
    },
    info: {
      icon: (
        <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bar: "bg-blue-500",
    },
  };

  const { icon, bar } = config[toast.type];


interface StatusToastProps {
  toast: ToastMessage;
  onClose: () => void;
}


export default function StatusToast({
  toast,
  onClose,
}: StatusToastProps) {
  return (
 
    <div
      className={`glass-strong rounded-xl overflow-hidden transition-all duration-300 ${
        isVisible
          ? "translate-x-0 opacity-100 scale-100"
          : "translate-x-8 opacity-0 scale-95"
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex-shrink-0">{icon}</div>
        <p className="text-sm font-medium text-slate-200 flex-1 pr-2">
          {toast.message}
        </p>
        <button
          onClick={handleClose}
          className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center text-slate-600 hover:text-slate-300 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {/* Progress bar */}
      <div className="h-0.5 bg-white/[0.03]">
        <div
          className={`h-full ${bar} transition-all duration-100 ease-linear opacity-50`}
          style={{ width: `${progress}%` }}
        />
 
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
