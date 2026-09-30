"use client";

import { useState } from "react";
import Image from "next/image";

// Click-to-zoom lightbox for a spoke image whose real content (small map
// legends, dense diagrams) isn't legible at in-page card width. Self-contained
// — no external dialog library — Escape and a backdrop click both close it.
//
// lightFrame (default false) — some circuit map source images are black
// line art on a transparent/white background (not a dark-theme-matched
// asset), which nearly disappears against the default bg-[#141414] frame.
// Mexico City GP's map (Wikimedia Commons, WL2392) is the first case of
// this — founder-flagged 28 Sep 2026. Rather than changing the frame
// globally (most events' maps are fine on dark), this is opt-in per image
// via CIRCUIT_MAP_BY_EVENT in FullResult.tsx.
export default function ZoomableImage({
  src,
  alt,
  aspectClassName,
  lightFrame = false,
  fitByHeight = false,
}: {
  src: string;
  alt: string;
  aspectClassName: string;
  lightFrame?: boolean;
  // Default lightbox sizing (w-full h-auto) fills the available width, so a
  // tall/near-square image renders taller than the viewport and the
  // container scrolls to show it — Monaco's circuit map (2560x2173, far
  // more square than most events' wide circuit maps) hits this. Opt-in per
  // image, same mechanism as lightFrame, rather than changing the shared
  // default — most events' maps are wide/short and look better filling the
  // full width than they would constrained by height. Founder-flagged 30
  // Sep 2026 ("id prefer the zoomed image to not scroll"), scoped to Monaco
  // only per explicit founder direction (other events keep today's sizing).
  fitByHeight?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`relative w-full ${aspectClassName} rounded-sm border border-[#2A2A2A] overflow-hidden ${lightFrame ? "bg-[#F5F5F0]" : "bg-[#141414]"} cursor-zoom-in group`}
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
          <div
            className={`relative w-full h-full max-w-5xl overflow-auto flex items-center justify-center ${lightFrame ? "bg-[#F5F5F0] p-4" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              className={fitByHeight ? "max-h-full w-auto object-contain" : "w-full h-auto"}
            />
          </div>
        </div>
      )}
    </>
  );
}
