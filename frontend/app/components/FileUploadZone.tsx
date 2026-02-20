"use client";

import { useState, useRef, useCallback } from "react";

interface FileUploadZoneProps {
  onUpload: (files: File[]) => void;
}

export default function FileUploadZone({ onUpload }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    if (dropped.length) setSelectedFiles((prev) => [...prev, ...dropped]);
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setSelectedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
        e.target.value = "";
      }
    },
    []
  );

  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearAll = useCallback(() => {
    setSelectedFiles([]);
  }, []);

  const handleUploadAll = useCallback(() => {
    if (!selectedFiles.length) return;
    onUpload(selectedFiles);
    setSelectedFiles([]);
  }, [selectedFiles, onUpload]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const totalSize = selectedFiles.reduce((s, f) => s + f.size, 0);

  return (
    <div className="space-y-5">
      {/* Drop zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative rounded-2xl transition-all duration-500 cursor-pointer group overflow-hidden ${
          isDragging
            ? "border-2 border-blue-400/60 bg-blue-500/[0.06]"
            : "border-2 border-dashed border-white/[0.08] hover:border-white/[0.15] bg-white/[0.01] hover:bg-white/[0.02]"
        }`}
      >
        {/* Animated border gradient when dragging */}
        {isDragging && (
          <div className="absolute inset-0 rounded-2xl">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-rose-500/10 animate-gradient-flow" />
          </div>
        )}

        <div className="relative px-8 py-16 sm:py-20 text-center">
          {/* Icon */}
          <div className="mb-5 flex justify-center">
            <div
              className={`relative transition-all duration-500 ${
                isDragging ? "scale-110" : "group-hover:scale-105"
              }`}
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                  isDragging
                    ? "bg-blue-500/20 shadow-xl shadow-blue-500/10"
                    : "bg-white/[0.04] group-hover:bg-white/[0.06]"
                }`}
              >
                <svg
                  className={`w-7 h-7 transition-colors duration-300 ${
                    isDragging ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16V4m0 0L8 8m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                  />
                </svg>
              </div>

              {/* Pulse ring when dragging */}
              {isDragging && (
                <div className="absolute inset-0 rounded-2xl border-2 border-blue-400/40 animate-ping" />
              )}
            </div>
          </div>

          <h3 className="text-lg font-semibold text-white mb-1.5">
            {isDragging ? "Release to add files" : "Drop files here"}
          </h3>
          <p className="text-sm text-slate-500 mb-5">
            or{" "}
            <span className="text-blue-400 hover:text-blue-300 font-medium">
              browse from device
            </span>
          </p>

          <div className="flex items-center justify-center gap-4 text-xs text-slate-600">
            <span>All types</span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span>Up to 500 MB</span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span>Multiple files</span>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Selected files */}
      {selectedFiles.length > 0 && (
        <div className="glass-card rounded-2xl overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">
                {selectedFiles.length} file{selectedFiles.length !== 1 && "s"}{" "}
                selected
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {formatSize(totalSize)} total
              </p>
            </div>
            <button
              onClick={clearAll}
              className="text-xs text-slate-500 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-500/10"
            >
              Remove all
            </button>
          </div>

          {/* File list */}
          <div className="max-h-60 overflow-y-auto divide-y divide-white/[0.04]">
            {selectedFiles.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                  <FileTypeIcon type={file.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300 truncate font-medium">
                    {file.name}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    {formatSize(file.size)}
                  </p>
                </div>
                <button
                  onClick={() => removeFile(idx)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-all"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Upload button */}
          <div className="px-5 py-4 border-t border-white/[0.06]">
            <button
              onClick={handleUploadAll}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-sm font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] focus-ring"
            >
              Upload {selectedFiles.length} file
              {selectedFiles.length !== 1 && "s"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FileTypeIcon({ type }: { type: string }) {
  const cls = "w-4 h-4";
  if (type.startsWith("image/"))
    return (
      <svg className={`${cls} text-pink-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
      </svg>
    );
  if (type.startsWith("video/"))
    return (
      <svg className={`${cls} text-red-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
      </svg>
    );
  if (type.startsWith("audio/"))
    return (
      <svg className={`${cls} text-green-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V4.846a2.25 2.25 0 00-1.632-2.163l-5.25-1.5A2.25 2.25 0 004.5 3.346v14.808" />
      </svg>
    );
  if (type === "application/pdf")
    return (
      <svg className={`${cls} text-orange-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    );
  return (
    <svg className={`${cls} text-slate-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}