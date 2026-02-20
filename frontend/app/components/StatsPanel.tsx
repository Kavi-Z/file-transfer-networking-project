"use client";

interface StatsPanelProps {
  totalFiles: number;
  activeUploads: number;
  failedUploads: number;
  totalUploaded: number;
  totalDownloaded: number;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export default function StatsPanel({
  totalFiles,
  activeUploads,
  failedUploads,
  totalUploaded,
  totalDownloaded,
}: StatsPanelProps) {
  const stats = [
    {
      label: "Completed",
      value: totalFiles.toString(),
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Uploading",
      value: activeUploads.toString(),
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
      ),
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: "Uploaded",
      value: formatBytes(totalUploaded),
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      ),
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
    },
    {
      label: "Downloaded",
      value: formatBytes(totalDownloaded),
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      ),
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
  ];

  // Hide failed stat if zero
  if (failedUploads > 0) {
    stats.splice(2, 0, {
      label: "Failed",
      value: failedUploads.toString(),
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
    });
  }

  return (
    <div
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6 animate-fade-in-up"
      style={{ animationDelay: "0.1s" }}
    >
      {stats.slice(0, 4).map((stat, idx) => (
        <div
          key={stat.label}
          className={`glass-card rounded-2xl p-4 hover-lift cursor-default group border ${stat.border} transition-all duration-300`}
          style={{ animationDelay: `${idx * 0.05}s` }}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
            >
              {stat.icon}
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold text-white tabular-nums leading-tight">
                {stat.value}
              </p>
              <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}