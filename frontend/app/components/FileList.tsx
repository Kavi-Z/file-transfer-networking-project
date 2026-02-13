// app/components/FileList.tsx
"use client";

import { UploadedFile } from "../page";
import FileCard from "./FileCard";

interface FileListProps {
  files: UploadedFile[];
  onDownload: (fileName: string) => void;
  onDelete: (id: string) => void;
  onRetry: (id: string) => void;
}

export default function FileList({
  files,
  onDownload,
  onDelete,
  onRetry,
}: FileListProps) {
  if (files.length === 0) {
    return (
      <div className="glass rounded-3xl p-16 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-white/5 flex items-center justify-center animate-float">
          <svg
            className="w-10 h-10 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-300 mb-2">
          No files yet
        </h3>
        <p className="text-slate-500">
          Upload some files to see them here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {files.map((file, index) => (
        <FileCard
          key={file.id}
          file={file}
          index={index}
          onDownload={onDownload}
          onDelete={onDelete}
          onRetry={onRetry}
        />
      ))}
    </div>
  );
}