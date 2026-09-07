"use client";

import { useState } from "react";
import Image from "next/image";

// Click-to-zoom lightbox for a spoke image whose real content (small map
// legends, dense diagrams) isn't legible at in-page card width. Self-contained
// — no external dialog library — Escape and a backdrop click both close it.
export default function ZoomableImage({
  src,
  alt,
  aspectClassName,
}: {
  src: string;
  alt: string;
  aspectClassName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`relative w-full ${aspectClassName} rounded-sm border border-[#2A2A2A] overflow-hidden bg-[#141414] cursor-zoom-in group`}
      >
        <Image src={src} alt={alt} fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-black tracking-widest uppercase text-white bg-black/60 px-3 py-1.5 rounded-sm">
            Click to zoom
          </span>
        </div>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white text-xs font-black tracking-widest uppercase bg-black/60 hover:bg-black/80 px-3 py-2 rounded-sm"
          >
            Close ✕
          </button>
          <div className="relative w-full h-full max-w-5xl overflow-auto">
            <img src={src} alt={alt} className="w-full h-auto" />
          </div>
        </div>
      )}
    </>
  );
}
