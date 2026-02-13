"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    setStatus("📤 Requesting upload permission from server...");

    try {
      const res = await fetch("/api/socket", {
        method: "POST",
        headers: {
          "x-filename": file.name,
        },
        body: file,
      });

      const data = await res.json();
      
      if (res.status === 403) {
        setStatus("❌ Upload denied by server: " + data.message);
      } else if (data.success) {
        setStatus("✅ File uploaded successfully: " + data.message);
      } else {
        setStatus("❌ Upload failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Connection error - make sure the server is running");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">📁 File Transfer with Permission System</h1>
      
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-md text-center">
        <h2 className="text-lg font-semibold mb-2">📋 How it works:</h2>
        <p className="text-sm text-gray-700">
          1. Select a file and click upload<br/>
          2. Server will ask for permission<br/>
          3. Server admin can allow or deny<br/>
          4. Upload proceeds only if allowed
        </p>
      </div>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
        className="mb-4 p-2 border border-gray-300 rounded"
      />

      <button
        onClick={handleUpload}
        disabled={!file}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        📤 Upload File
      </button>

      {status && (
        <div className="mt-4 p-3 border rounded-lg max-w-md text-center">
          <p className="text-sm">{status}</p>
        </div>
      )}
      
      <div className="mt-8 text-xs text-gray-500">
        Make sure the Java server is running on port 6600
      </div>
    </div>
  );
}
