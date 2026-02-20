"use client";

import { useState, useCallback, useMemo } from "react";
import Header from "./components/Header";
import FileUploadZone from "./components/FileUploadZone";
import FileList from "./components/FileList";
import StatsPanel from "./components/StatsPanel";
import StatusToast from "./components/StatusToast";

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  status: "uploading" | "completed" | "failed";
  progress: number;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

export type ViewMode = "grid" | "list";
export type FileFilter = "all" | "images" | "documents" | "media" | "archives";

export default function Home() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeTab, setActiveTab] = useState<"upload" | "files">("upload");
  const [totalUploaded, setTotalUploaded] = useState(0);
  const [totalDownloaded, setTotalDownloaded] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [fileFilter, setFileFilter] = useState<FileFilter>("all");

  const addToast = useCallback(
    (type: ToastMessage["type"], message: string) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleUpload = useCallback(
    async (filesToUpload: File[]) => {
      setActiveTab("files");
      for (const file of filesToUpload) {
        const fileId = crypto.randomUUID();
        const uploadedFile: UploadedFile = {
          id: fileId,
          name: file.name,
          size: file.size,
          type: file.type || "application/octet-stream",
          uploadedAt: new Date(),
          status: "uploading",
          progress: 0,
        };

        setFiles((prev) => [uploadedFile, ...prev]);

        try {
          const progressInterval = setInterval(() => {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileId && f.progress < 90
                  ? { ...f, progress: f.progress + Math.random() * 12 }
                  : f
              )
            );
          }, 200);

          const res = await fetch("/api/upload", {
            method: "POST",
            headers: { "x-filename": encodeURIComponent(file.name) },
            body: file,
          });

          clearInterval(progressInterval);
          const data = await res.json();

          if (data.success) {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileId
                  ? { ...f, status: "completed", progress: 100 }
                  : f
              )
            );
            setTotalUploaded((prev) => prev + file.size);
            addToast("success", `${file.name} uploaded`);
          } else {
            throw new Error(data.error);
          }
        } catch {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileId ? { ...f, status: "failed", progress: 0 } : f
            )
          );
          addToast("error", `Failed to upload ${file.name}`);
        }
      }
    },
    [addToast]
  );

  const handleDownload = useCallback(
    async (fileName: string) => {
      addToast("info", `Downloading ${fileName}…`);
      try {
        const res = await fetch(
          `/api/download?filename=${encodeURIComponent(fileName)}`
        );
        if (!res.ok) throw new Error("Download failed");
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
        setTotalDownloaded((prev) => prev + blob.size);
        addToast("success", `${fileName} downloaded`);
      } catch {
        addToast("error", `Failed to download ${fileName}`);
      }
    },
    [addToast]
  );

  const handleDelete = useCallback(
    (id: string) => {
      setFiles((prev) => prev.filter((f) => f.id !== id));
      addToast("info", "File removed");
    },
    [addToast]
  );

  const handleRetry = useCallback(
    (id: string) => {
      const fileRecord = files.find((f) => f.id === id);
      if (!fileRecord) return;
      addToast("info", `Retrying ${fileRecord.name}…`);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, status: "uploading", progress: 0 } : f
        )
      );
    },
    [files, addToast]
  );

  const handleClearAll = useCallback(() => {
    setFiles([]);
    addToast("info", "All files cleared");
  }, [addToast]);

  const completedFiles = useMemo(
    () => files.filter((f) => f.status === "completed"),
    [files]
  );
  const uploadingFiles = useMemo(
    () => files.filter((f) => f.status === "uploading"),
    [files]
  );
  const failedFiles = useMemo(
    () => files.filter((f) => f.status === "failed"),
    [files]
  );

  return (
    <div className="relative min-h-screen z-10">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <Header />

        <StatsPanel
          totalFiles={completedFiles.length}
          activeUploads={uploadingFiles.length}
          failedUploads={failedFiles.length}
          totalUploaded={totalUploaded}
          totalDownloaded={totalDownloaded}
        />

        {/* Tab Navigation */}
        <div
          className="flex items-center justify-between mb-6 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex gap-1 p-1 glass rounded-2xl">
            <button
              onClick={() => setActiveTab("upload")}
              className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 focus-ring ${
                activeTab === "upload"
                  ? "bg-gradient-to-r from-blue-600/90 to-violet-600/90 text-white shadow-lg shadow-blue-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-2">
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
                    d="M12 16V4m0 0L8 8m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                  />
                </svg>
                Upload
              </span>
            </button>
            <button
              onClick={() => setActiveTab("files")}
              className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 focus-ring ${
                activeTab === "files"
                  ? "bg-gradient-to-r from-blue-600/90 to-violet-600/90 text-white shadow-lg shadow-blue-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-2">
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
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
                Files
                {files.length > 0 && (
                  <span className="ml-1 bg-white/15 text-xs px-2 py-0.5 rounded-full tabular-nums">
                    {files.length}
                  </span>
                )}
              </span>
            </button>
          </div>

          {activeTab === "files" && files.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearAll}
                className="px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all focus-ring"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div
          className="animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          {activeTab === "upload" && (
            <FileUploadZone onUpload={handleUpload} />
          )}
          {activeTab === "files" && (
            <FileList
              files={files}
              onDownload={handleDownload}
              onDelete={handleDelete}
              onRetry={handleRetry}
              viewMode={viewMode}
              setViewMode={setViewMode}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              fileFilter={fileFilter}
              setFileFilter={setFileFilter}
            />
          )}
        </div>
      </div>

      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <StatusToast
              toast={toast}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}