"use client";

import { useState } from "react";

export default function PackDownload({ eventSlug }: { eventSlug: string }) {
  const [downloading, setDownloading] = useState<"brief" | "full" | null>(null);

  async function download(mode: "brief" | "full") {
    if (downloading) return;
    setDownloading(mode);
    try {
      const res = await fetch(`/api/pack/pdf?slug=${eventSlug}&mode=${mode}`);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${eventSlug}-${mode === "brief" ? "travel-brief" : "full-pack"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Download failed. Try again or contact hello@experiences-curated.com.");
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => download("brief")}
        disabled={!!downloading}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm border border-[#2A2A2A] text-sm font-black text-white hover:border-[#AAFF00] hover:text-[#AAFF00] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
          <path d="M8 2v8m0 0l-3-3m3 3l3-3M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {downloading === "brief" ? "Generating…" : "Travel Brief PDF"}
      </button>
      <button
        onClick={() => download("full")}
        disabled={!!downloading}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm border border-[#2A2A2A] text-sm font-black text-white hover:border-[#AAFF00] hover:text-[#AAFF00] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
          <path d="M8 2v8m0 0l-3-3m3 3l3-3M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {downloading === "full" ? "Generating…" : "Full Pack PDF"}
      </button>
    </div>
  );
}
