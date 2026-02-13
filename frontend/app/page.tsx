// app/page.tsx
"use client";

import { useState, useCallback } from "react";
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

export default function Home() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeTab, setActiveTab] = useState<"upload" | "files">("upload");
  const [totalUploaded, setTotalUploaded] = useState(0);
  const [totalDownloaded, setTotalDownloaded] = useState(0);

  const addToast = useCallback((type: ToastMessage["type"], message: string) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleUpload = useCallback(
    async (filesToUpload: File[]) => {
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
          // Simulate progress for better UX
          const progressInterval = setInterval(() => {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileId && f.progress < 90
                  ? { ...f, progress: f.progress + Math.random() * 15 }
                  : f
              )
            );
          }, 200);

          const res = await fetch("/api/upload", {
            method: "POST",
            headers: {
              "x-filename": encodeURIComponent(file.name),
            },
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
            addToast("success", `"${file.name}" uploaded successfully`);
          } else {
            throw new Error(data.error || "Upload failed");
          }
        } catch (err) {
          console.error(err);
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileId ? { ...f, status: "failed", progress: 0 } : f
            )
          );
          addToast("error", `Failed to upload "${file.name}"`);
        }
      }
    },
    [addToast]
  );

  const handleDownload = useCallback(
    async (fileName: string) => {
      addToast("info", `Downloading "${fileName}"...`);
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
        addToast("success", `"${fileName}" downloaded successfully`);
      } catch (err) {
        console.error(err);
        addToast("error", `Failed to download "${fileName}"`);
      }
    },
    [addToast]
  );

  const handleDelete = useCallback(
    (id: string) => {
      setFiles((prev) => prev.filter((f) => f.id !== id));
      addToast("info", "File removed from list");
    },
    [addToast]
  );

  const handleRetry = useCallback(
    async (id: string) => {
      const fileRecord = files.find((f) => f.id === id);
      if (!fileRecord) return;
      addToast("info", `Retrying upload of "${fileRecord.name}"...`);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, status: "uploading", progress: 0 } : f
        )
      );
    },
    [files, addToast]
  );

  const completedFiles = files.filter((f) => f.status === "completed");
  const uploadingFiles = files.filter((f) => f.status === "uploading");

  return (
    <div className="relative min-h-screen z-10">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-600/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-cyan-600/15 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-fuchsia-600/15 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Header />

        <StatsPanel
          totalFiles={completedFiles.length}
          activeUploads={uploadingFiles.length}
          totalUploaded={totalUploaded}
          totalDownloaded={totalDownloaded}
        />

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === "upload"
                ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                : "glass text-slate-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload
            </span>
          </button>
          <button
            onClick={() => setActiveTab("files")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === "files"
                ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                : "glass text-slate-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              Files
              {completedFiles.length > 0 && (
                <span className="bg-violet-500/30 text-violet-200 text-xs px-2 py-0.5 rounded-full">
                  {completedFiles.length}
                </span>
              )}
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          {activeTab === "upload" && (
            <FileUploadZone onUpload={handleUpload} />
          )}
          {activeTab === "files" && (
            <FileList
              files={files}
              onDownload={handleDownload}
              onDelete={handleDelete}
              onRetry={handleRetry}
            />
          )}
        </div>
      </div>

      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {toasts.map((toast) => (
          <StatusToast
            key={toast.id}
            toast={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}