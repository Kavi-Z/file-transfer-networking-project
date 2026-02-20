"use client";

import { useMemo } from "react";
import { UploadedFile, ViewMode, FileFilter } from "../page";
import FileCard from "./FileCard";

interface FileListProps {
  files: UploadedFile[];
  onDownload: (fileName: string) => void;
  onDelete: (id: string) => void;
  onRetry: (id: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  fileFilter: FileFilter;
  setFileFilter: (f: FileFilter) => void;
}

const filters: { label: string; value: FileFilter }[] = [
  { label: "All", value: "all" },
  { label: "Images", value: "images" },
  { label: "Documents", value: "documents" },
  { label: "Media", value: "media" },
  { label: "Archives", value: "archives" },
];

function matchesFilter(type: string, filter: FileFilter): boolean {
  if (filter === "all") return true;
  if (filter === "images") return type.startsWith("image/");
  if (filter === "documents")
    return (
      type === "application/pdf" ||
      type.includes("text") ||
      type.includes("document") ||
      type.includes("spreadsheet") ||
      type.includes("presentation")
    );
  if (filter === "media")
    return type.startsWith("video/") || type.startsWith("audio/");
  if (filter === "archives")
    return type.includes("zip") || type.includes("archive") || type.includes("rar");
  return true;
}

export default function FileList({
  files,
  onDownload,
  onDelete,
  onRetry,
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  fileFilter,
  setFileFilter,
}: FileListProps) {
  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      const matchSearch = f.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchType = matchesFilter(f.type, fileFilter);
      return matchSearch && matchType;
    });
  }, [files, searchQuery, fileFilter]);

  if (files.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-16 text-center border border-white/[0.06]">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-white/[0.03] flex items-center justify-center">
          <svg
            className="w-7 h-7 text-slate-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3"
            />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-300 mb-1">
          No files yet
        </h3>
        <p className="text-sm text-slate-600">
          Upload files to see them here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search files…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-white/[0.15] focus:bg-white/[0.04] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filters + View toggle */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Filter pills */}
          <div className="flex gap-1 overflow-x-auto flex-1 sm:flex-initial">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFileFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  fileFilter === f.value
                    ? "bg-white/[0.08] text-white"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-white/[0.06] hidden sm:block" />

          {/* View mode toggle */}
          <div className="flex gap-0.5 glass-subtle rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === "list"
                  ? "bg-white/[0.08] text-white"
                  : "text-slate-600 hover:text-slate-400"
              }`}
              title="List view"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === "grid"
                  ? "bg-white/[0.08] text-white"
                  : "text-slate-600 hover:text-slate-400"
              }`}
              title="Grid view"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Results count */}
      {searchQuery && (
        <p className="text-xs text-slate-600">
          {filteredFiles.length} result{filteredFiles.length !== 1 && "s"} for
          &ldquo;{searchQuery}&rdquo;
        </p>
      )}

      {/* File cards */}
      {filteredFiles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-slate-600">
            No files match your search
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredFiles.map((file, idx) => (
            <FileCard
              key={file.id}
              file={file}
              index={idx}
              viewMode={viewMode}
              onDownload={onDownload}
              onDelete={onDelete}
              onRetry={onRetry}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredFiles.map((file, idx) => (
            <FileCard
              key={file.id}
              file={file}
              index={idx}
              viewMode={viewMode}
              onDownload={onDownload}
              onDelete={onDelete}
              onRetry={onRetry}
            />
          ))}
        </div>
      )}
    </div>
  );
}