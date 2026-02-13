// app/components/FileCard.tsx
"use client";

import { UploadedFile } from "../page";
import ProgressBar from "./ProgressBar";

interface FileCardProps {
  file: UploadedFile;
  index: number;
  onDownload: (fileName: string) => void;
  onDelete: (id: string) => void;
  onRetry: (id: string) => void;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getFileIcon(type: string) {
  if (type.startsWith("image/"))
    return { icon: "🖼️", color: "from-pink-500 to-rose-600" };
  if (type.startsWith("video/"))
    return { icon: "🎬", color: "from-red-500 to-orange-600" };
  if (type.startsWith("audio/"))
    return { icon: "🎵", color: "from-green-500 to-emerald-600" };
  if (type === "application/pdf")
    return { icon: "📄", color: "from-orange-500 to-amber-600" };
  if (type.includes("zip") || type.includes("archive") || type.includes("rar"))
    return { icon: "📦", color: "from-yellow-500 to-orange-600" };
  if (type.includes("text") || type.includes("document"))
    return { icon: "📝", color: "from-blue-500 to-indigo-600" };
  if (type.includes("spreadsheet") || type.includes("excel"))
    return { icon: "📊", color: "from-emerald-500 to-green-600" };
  return { icon: "📎", color: "from-violet-500 to-purple-600" };
}

export default function FileCard({
  file,
  index,
  onDownload,
  onDelete,
  onRetry,
}: FileCardProps) {
  const { icon, color } = getFileIcon(file.type);

  return (
    <div
      className="glass rounded-2xl p-4 hover:bg-white/10 transition-all duration-300 group animate-fade-in"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-center gap-4">
        {/* File Icon */}
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium text-white truncate">
              {file.name}
            </p>
            {file.status === "completed" && (
              <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            {file.status === "failed" && (
              <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>{formatBytes(file.size)}</span>
            <span>•</span>
            <span>{formatTime(file.uploadedAt)}</span>
            {file.status === "uploading" && (
              <>
                <span>•</span>
                <span className="text-violet-400">
                  {Math.round(file.progress)}%
                </span>
              </>
            )}
            {file.status === "failed" && (
              <>
                <span>•</span>
                <span className="text-red-400">Failed</span>
              </>
            )}
          </div>

          {/* Progress Bar */}
          {file.status === "uploading" && (
            <div className="mt-2">
              <ProgressBar progress={file.progress} />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {file.status === "completed" && (
            <button
              onClick={() => onDownload(file.name)}
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-violet-600/20 flex items-center justify-center text-slate-400 hover:text-violet-400 transition-all"
              title="Download"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          )}
          {file.status === "failed" && (
            <button
              onClick={() => onRetry(file.id)}
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-amber-600/20 flex items-center justify-center text-slate-400 hover:text-amber-400 transition-all"
              title="Retry"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
          <button
            onClick={() => onDelete(file.id)}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-red-600/20 flex items-center justify-center text-slate-400 hover:text-red-400 transition-all"
            title="Remove"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}