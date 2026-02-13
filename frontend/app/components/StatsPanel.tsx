// app/components/StatsPanel.tsx
"use client";

interface StatsPanelProps {
  totalFiles: number;
  activeUploads: number;
  totalUploaded: number;
  totalDownloaded: number;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export default function StatsPanel({
  totalFiles,
  activeUploads,
  totalUploaded,
  totalDownloaded,
}: StatsPanelProps) {
  const stats = [
    {
      label: "Files Transferred",
      value: totalFiles.toString(),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "from-violet-500 to-purple-600",
      shadowColor: "shadow-violet-600/20",
    },
    {
      label: "Active Uploads",
      value: activeUploads.toString(),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      color: "from-cyan-500 to-blue-600",
      shadowColor: "shadow-cyan-600/20",
    },
    {
      label: "Total Uploaded",
      value: formatBytes(totalUploaded),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      ),
      color: "from-emerald-500 to-teal-600",
      shadowColor: "shadow-emerald-600/20",
    },
    {
      label: "Total Downloaded",
      value: formatBytes(totalDownloaded),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      ),
      color: "from-orange-500 to-red-600",
      shadowColor: "shadow-orange-600/20",
    },
  ];

  return (
    <div
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in-up"
      style={{ animationDelay: "0.1s" }}
    >
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`glass rounded-2xl p-5 hover:bg-white/10 transition-all duration-300 group cursor-default ${stat.shadowColor} hover:shadow-lg`}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="flex items-start justify-between mb-3">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
            >
              {stat.icon}
            </div>
          </div>
          <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
          <p className="text-xs text-slate-400 uppercase tracking-wider">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}