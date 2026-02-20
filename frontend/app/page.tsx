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
 
            throw new Error();
 
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
      addToast("info", "File removed");
    },
    [addToast]
  );

  const handleRetry = useCallback(
    (id: string) => {
      const fileRecord = files.find((f) => f.id === id);
      if (!fileRecord) return;
 
      addToast("info", `Retrying ${fileRecord.name}…`);
 

      addToast("info", `Retrying upload of "${fileRecord.name}"...`);
 
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
 
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
 
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