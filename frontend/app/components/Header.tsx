// app/components/Header.tsx
"use client";

export default function Header() {
  return (
    <header className="mb-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-600/30">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#302b63] animate-pulse" />
          </div>

          <div>
            <h1 className="text-2xl font-bold gradient-text">FileVault</h1>
            <p className="text-sm text-slate-400">
              Secure Socket File Transfer
            </p>
          </div>
        </div>

        {/* Connection Status */}
        <div className="glass rounded-full px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-sm text-slate-300">Connected to Server</span>
          <span className="text-xs text-slate-500 font-mono">:6600</span>
        </div>
      </div>
    </header>
  );
}