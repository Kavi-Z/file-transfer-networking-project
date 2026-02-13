"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    setStatus("Uploading...");

    try {
      const res = await fetch("/api/socket", {
        method: "POST",
        headers: {
          "x-filename": file.name,
        },
        body: file,
      });

      const data = await res.json();
      if (data.success) {
        setStatus("File uploaded successfully ✅");
      } else {
        setStatus("Upload failed ❌");
      }
    } catch (err) {
      console.error(err);
      setStatus("Upload failed ❌");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">File Upload to Java Socket Server</h1>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        disabled={!file}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        Upload
      </button>

      <p className="mt-4">{status}</p>
    </div>
  );
}
