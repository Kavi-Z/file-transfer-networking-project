// app/components/FileUploadZone.tsx
"use client";

import { useState, useRef, useCallback } from "react";

interface FileUploadZoneProps {
  onUpload: (files: File[]) => void;
}

export default function FileUploadZone({ onUpload }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...droppedFiles]);
    }
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const newFiles = Array.from(e.target.files);
        setSelectedFiles((prev) => [...prev, ...newFiles]);
      }
    },
    []
  );

  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleUploadAll = useCallback(() => {
    if (selectedFiles.length === 0) return;
    onUpload(selectedFiles);
    setSelectedFiles([]);
    if (inputRef.current) inputRef.current.value = "";
  }, [selectedFiles, onUpload]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/"))
      return (
        <svg className="w-5 h-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    if (type.startsWith("video/"))
      return (
        <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    if (type === "application/pdf")
      return (
        <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    return (
      <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative rounded-3xl border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-500 group ${
          isDragging
            ? "border-violet-400 bg-violet-600/10 drop-zone-active"
            : "border-white/10 hover:border-violet-500/50 hover:bg-white/5"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Upload Icon */}
        <div className={`mx-auto mb-6 transition-transform duration-500 ${isDragging ? "scale-110" : "group-hover:scale-105"}`}>
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600/20 to-cyan-600/20 flex items-center justify-center mx-auto">
              <svg
                className={`w-10 h-10 transition-all duration-500 ${
                  isDragging ? "text-violet-300 -translate-y-2" : "text-violet-400 group-hover:-translate-y-1"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            {isDragging && (
              <div className="absolute inset-0 rounded-3xl bg-violet-400/20 animate-ping" />
            )}
          </div>
        </div>

        <h3 className="text-xl font-semibold text-white mb-2">
          {isDragging ? "Drop files here" : "Drag & drop files here"}
        </h3>
        <p className="text-slate-400 mb-4">
          or{" "}
          <span className="text-violet-400 underline underline-offset-2">
            browse from your computer
          </span>
        </p>
        <p className="text-xs text-slate-500">
          Supports all file types • Max file size: 500MB
        </p>
      </div>

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="glass rounded-2xl p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Ready to Upload ({selectedFiles.length}{" "}
              {selectedFiles.length === 1 ? "file" : "files"})
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedFiles([])}
                className="px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                Clear All
              </button>
              <button
                onClick={handleUploadAll}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-medium text-sm hover:shadow-lg hover:shadow-violet-600/25 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  Upload All
                </span>
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all group"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{file.name}</p>
                  <p className="text-xs text-slate-500">{formatSize(file.size)}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Total size */}
          <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-sm">
            <span className="text-slate-400">Total size</span>
            <span className="text-white font-medium">
              {formatSize(selectedFiles.reduce((acc, f) => acc + f.size, 0))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}