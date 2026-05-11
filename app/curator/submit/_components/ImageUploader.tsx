"use client";

import { useRef, useState } from "react";

type UploadState =
  | { status: "idle" }
  | { status: "uploading"; progress: number }
  | { status: "done"; publicUrl: string }
  | { status: "error"; message: string };

export function ImageUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [upload, setUpload] = useState<UploadState>(
    value ? { status: "done", publicUrl: value } : { status: "idle" }
  );
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setUpload({ status: "error", message: "Only image files are allowed." });
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setUpload({ status: "error", message: "File must be under 15 MB." });
      return;
    }

    setUpload({ status: "uploading", progress: 0 });

    try {
      // 1 — get pre-signed URL
      const res = await fetch(
        `/api/upload/presign?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}&size=${file.size}`
      );
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error ?? "Failed to get upload URL");
      }
      const { uploadUrl, publicUrl } = await res.json();

      // 2 — upload directly to R2 with XHR for progress tracking
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setUpload({
              status: "uploading",
              progress: Math.round((e.loaded / e.total) * 100),
            });
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`Upload failed: ${xhr.status}`));
        };
        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });

      // 3 — update form
      setUpload({ status: "done", publicUrl });
      onChange(publicUrl);
    } catch (e: any) {
      setUpload({ status: "error", message: e.message ?? "Upload failed" });
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function clear() {
    setUpload({ status: "idle" });
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  }

  // ── Uploaded: show preview ──
  if (upload.status === "done") {
    return (
      <div className="relative rounded-xl overflow-hidden border border-neutral-200 bg-neutral-50">
        <img
          src={upload.publicUrl}
          alt="Hero image preview"
          className="w-full h-56 object-cover"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur text-xs font-medium text-neutral-700 hover:bg-white transition-colors shadow-sm"
          >
            Replace
          </button>
          <button
            type="button"
            onClick={clear}
            className="px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur text-xs font-medium text-red-600 hover:bg-white transition-colors shadow-sm"
          >
            Remove
          </button>
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onInputChange} />
      </div>
    );
  }

  // ── Uploading: progress bar ──
  if (upload.status === "uploading") {
    return (
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-8 flex flex-col items-center gap-3">
        <p className="text-sm text-neutral-500">Uploading…</p>
        <div className="w-full max-w-xs bg-neutral-200 rounded-full h-1.5">
          <div
            className="bg-neutral-900 h-1.5 rounded-full transition-all duration-200"
            style={{ width: `${upload.progress}%` }}
          />
        </div>
        <p className="text-xs text-neutral-400">{upload.progress}%</p>
      </div>
    );
  }

  // ── Idle / Error: drop zone ──
  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`rounded-xl border-2 border-dashed p-10 flex flex-col items-center gap-3 cursor-pointer transition-colors ${
          isDragging
            ? "border-neutral-900 bg-neutral-50"
            : "border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50"
        }`}
      >
        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-xl">
          📷
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-neutral-700">
            Drop image here or click to browse
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            JPEG, PNG, WebP or AVIF · max 15 MB · min 1600px wide recommended
          </p>
        </div>
      </div>

      {upload.status === "error" && (
        <p className="mt-2 text-xs text-red-500">{upload.message}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={onInputChange}
      />
    </div>
  );
}
