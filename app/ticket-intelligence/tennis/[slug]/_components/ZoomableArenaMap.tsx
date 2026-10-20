"use client";

import { useState } from "react";

// Click-to-zoom seating map — same interaction pattern (click to open, a
// full-screen dark overlay, Escape/backdrop-click to close) as the
// project's existing ZoomableImage (app/event-pack/[slug]/_hub-and-spoke/
// _components/ZoomableImage.tsx), but deliberately NOT built on that
// component: ZoomableImage's thumbnail uses next/image `fill` +
// `object-cover` inside a fixed aspect ratio box, which crops the image —
// explicitly forbidden for these seating maps ("never crop the seating
// maps or cut off section numbers... avoid fixed-height containers or
// object-fit: cover... use width:100%; height:auto", spec 20 Oct 2026).
// This component uses a plain <img> at natural aspect ratio in both the
// inline and zoomed states instead.
export default function ZoomableArenaMap({ src, alt }: { src: string; alt: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative w-full rounded-sm border border-[#2A2A2A] overflow-hidden bg-white cursor-zoom-in group block"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="w-full h-auto block" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-black tracking-widest uppercase text-white bg-black/60 px-3 py-1.5 rounded-sm">
            Click to zoom
          </span>
        </div>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 sm:p-8 cursor-zoom-out overflow-auto"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="fixed top-4 right-4 text-white text-xs font-black tracking-widest uppercase bg-black/60 hover:bg-black/80 px-3 py-2 rounded-sm"
          >
            Close ✕
          </button>
          <div className="relative max-w-3xl w-full bg-white rounded-sm" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} className="w-full h-auto block" />
          </div>
        </div>
      )}
    </>
  );
}
