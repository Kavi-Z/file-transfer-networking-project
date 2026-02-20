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
            throw new Error();
          }
        } catch {
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
        
        // Check if File System Access API is supported
        if ('showSaveFilePicker' in window) {
          try {
            // Let user choose where to save the file
            const handle = await (window as any).showSaveFilePicker({
              suggestedName: fileName,
              types: [
                {
                  description: 'All Files',
                  accept: { '*/*': ['.*'] },
                },
              ],
            });

            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();

            setTotalDownloaded((prev) => prev + blob.size);
            addToast("success", `"${fileName}" downloaded successfully`);
          } catch (err: any) {
            // User cancelled the save dialog
            if (err.name === 'AbortError') {
              addToast("info", "Download cancelled");
              return;
            }
            throw err;
          }
        } else {
          // Fallback for browsers that don't support File System Access API
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);

          setTotalDownloaded((prev) => prev + blob.size);
          addToast("success", `"${fileName}" downloaded successfully`);
        }
      } catch (error) {
        console.error('Download error:', error);
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
    (id: string) => {
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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Header />

        <StatsPanel
          totalFiles={completedFiles.length}
          activeUploads={uploadingFiles.length}
          totalUploaded={totalUploaded}
          totalDownloaded={totalDownloaded}
        />

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === "upload"
                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/50"
                : "glass text-slate-400 hover:text-slate-200"
            }`}
          >
            Upload
          </button>

          <button
            onClick={() => setActiveTab("files")}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === "files"
                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/50"
                : "glass text-slate-400 hover:text-slate-200"
            }`}
          >
            Download ({completedFiles.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === "upload" && (
          <FileUploadZone onUpload={handleUpload} />
        )}

        {activeTab === "files" && (
          <div className="space-y-4">
            {completedFiles.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-slate-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-slate-300 mb-2">
                  No files uploaded yet
                </h3>
                <p className="text-slate-400">
                  Upload files to see them here for download
                </p>
              </div>
            ) : (
              <FileList
                files={completedFiles}
                onDownload={handleDownload}
                onDelete={handleDelete}
                onRetry={handleRetry}
              />
            )}
          </div>
        )}
      </div>
 
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