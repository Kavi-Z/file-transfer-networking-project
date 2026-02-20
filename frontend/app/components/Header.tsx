"use client";

import { useState, useEffect } from "react";

export default function Header() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="mb-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-3.5">
          <div className="relative group">
            {/* Glow ring */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-violet-500 to-rose-500 rounded-2xl opacity-30 blur-md group-hover:opacity-50 transition-opacity duration-500" />
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-xl">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Share<span className="gradient-text-static">Vault</span>
            </h1>
            <p className="text-[11px] text-slate-500 font-medium tracking-wide uppercase">
              Secure File Transfer
            </p>
          </div>
        </div>

        {/* Right: Status Indicators */}
        <div className="flex items-center gap-3">
          {/* Live Clock */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-mono">
            {time}
          </div>

          <div className="w-px h-5 bg-white/10 hidden sm:block" />

          {/* Connection badge */}
          <div className="glass-subtle rounded-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-white/[0.04] transition-colors">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-xs font-medium text-slate-300">
              Connected
            </span>
            <span className="text-[10px] font-mono text-slate-600 bg-white/5 px-1.5 py-0.5 rounded">
              :6600
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}