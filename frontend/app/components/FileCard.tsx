"use client";

import { UploadedFile } from "../page";
import ProgressBar from "./ProgressBar";
import { ViewMode } from "../page";

interface FileCardProps {
  file: UploadedFile;
  index: number;
  viewMode: ViewMode;
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
    return { color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" };
  if (type.startsWith("video/"))
    return { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" };
  if (type.startsWith("audio/"))
    return { color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" };
  if (type === "application/pdf")
    return { color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" };
  if (type.includes("zip") || type.includes("archive") || type.includes("rar"))
    return { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" };
  if (type.includes("text") || type.includes("document"))
    return { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" };
  if (type.includes("spreadsheet") || type.includes("excel"))
    return { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
  return { color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/20" };
}

function FileIcon({ type }: { type: string }) {
  const cls = "w-5 h-5";
  if (type.startsWith("image/"))
    return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
      </svg>
    );
  if (type.startsWith("video/"))
    return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
      </svg>
    );
  if (type.startsWith("audio/"))
    return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V4.846a2.25 2.25 0 00-1.632-2.163l-5.25-1.5A2.25 2.25 0 004.5 3.346v14.808" />
      </svg>
    );
  if (type === "application/pdf")
    return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    );
  if (type.includes("zip") || type.includes("archive"))
    return (
      <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    );
  return (
    <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

export default function FileCard({
  file,
  index,
  viewMode,
  onDownload,
  onDelete,
  onRetry,
}: FileCardProps) {
  const { color, bg, border } = getFileIcon(file.type);
  const isGrid = viewMode === "grid";

  if (isGrid) {
    return (
      <div
        className={`glass-card rounded-2xl p-4 hover-lift group transition-all duration-300 animate-scale-in border ${
          file.status === "failed"
            ? "border-red-500/20"
            : file.status === "uploading"
            ? "border-blue-500/20"
            : "border-white/[0.06] hover:border-white/[0.12]"
        }`}
        style={{ animationDelay: `${index * 0.03}s` }}
      >
        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-xl ${bg} ${color} border ${border} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}
        >
          <FileIcon type={file.type} />
        </div>

        {/* Name */}
        <p className="text-sm font-medium text-white truncate mb-1">
          {file.name}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-3">
          <span>{formatBytes(file.size)}</span>
          <span>•</span>
          <span>{formatTime(file.uploadedAt)}</span>
        </div>

        {/* Status */}
        {file.status === "uploading" && (
          <ProgressBar progress={file.progress} showLabel />
        )}
        {file.status === "completed" && (
          <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-medium">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Uploaded
          </div>
        )}
        {file.status === "failed" && (
          <div className="flex items-center gap-1.5 text-red-400 text-[11px] font-medium">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            Failed
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/[0.06] opacity-0 group-hover:opacity-100 transition-opacity">
          {file.status === "completed" && (
            <button
              onClick={() => onDownload(file.name)}
              className="flex-1 py-1.5 text-[11px] font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-all"
            >
              Download
            </button>
          )}
          {file.status === "failed" && (
            <button
              onClick={() => onRetry(file.id)}
              className="flex-1 py-1.5 text-[11px] font-medium text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-all"
            >
              Retry
            </button>
          )}
          <button
            onClick={() => onDelete(file.id)}
            className="flex-1 py-1.5 text-[11px] font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  // ── List View ──
  return (
    <div
      className={`glass-card rounded-xl px-4 py-3.5 group transition-all duration-300 animate-fade-in hover-lift border ${
        file.status === "failed"
          ? "border-red-500/15"
          : file.status === "uploading"
          ? "border-blue-500/15"
          : "border-white/[0.04] hover:border-white/[0.1]"
      }`}
      style={{ animationDelay: `${index * 0.03}s` }}
    >
      <div className="flex items-center gap-3.5">
        {/* Icon */}
        <div
          className={`w-10 h-10 rounded-xl ${bg} ${color} border ${border} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}
        >
          <FileIcon type={file.type} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
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
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span className="font-medium">{formatBytes(file.size)}</span>
            <span className="text-slate-700">•</span>
            <span>{formatTime(file.uploadedAt)}</span>
            {file.status === "uploading" && (
              <>
                <span className="text-slate-700">•</span>
                <span className="text-blue-400 font-semibold tabular-nums">
                  {Math.round(file.progress)}%
                </span>
              </>
            )}
          </div>

          {file.status === "uploading" && (
            <div className="mt-2">
              <ProgressBar progress={file.progress} />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          {file.status === "completed" && (
            <button
              onClick={() => onDownload(file.name)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
              title="Download"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          )}
          {file.status === "failed" && (
            <button
              onClick={() => onRetry(file.id)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-all"
              title="Retry"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}
          <button
            onClick={() => onDelete(file.id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
            title="Remove"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}