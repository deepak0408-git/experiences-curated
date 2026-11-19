"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// Issue 5 fix, 19 Nov 2026 — tennis counterpart to F1's
// app/ticket-intelligence/[slug]/_components/SampleOutputModal.tsx (same
// founder direction: show a REAL sample of what the $10 unlock contains,
// "a real output generates more trust" — no invented mockup). Image at
// public/ticket-intelligence/sample-result-tennis.png is a genuine,
// unedited screenshot of the founder's own Australian Open 2027 result
// (see TeaserResult.tsx's SAMPLE_IMAGE for the exact path/alt/dimensions
// in force).
//
// Reuses CockpitModal's accessible shell pattern (focus trap, ESC, scroll
// lock, portal) rather than building a second one-off modal primitive.
//
// Rendering fix (ported from F1's version, same day): the image renders
// as a real <img width/height> (not next/image `fill`) in a modal widened
// toward the image's native width, so the browser never downscales real
// page text below legible size. Click-to-zoom is lg+ only — founder-
// flagged dead end on phone (the zoom overlay's close button scrolls out
// of view once a tall image is pinch-zoomed, and the overlay's own
// stopPropagation blocks tap-to-close on the image itself). Below lg,
// native pinch-zoom on the plain image is the only zoom mechanism — no
// overlay, no dead end.
export default function SampleOutputModal({
  open,
  onClose,
  imageSrc,
  imageAlt,
  imageWidth,
  imageHeight,
  caption,
}: {
  open: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  caption: string;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const [zoomed, setZoomed] = useState(false);
  // Read synchronously inside the keydown handler below — see F1's
  // version for why this is a ref, not a functional setZoomed updater
  // (calling the parent's onClose from inside that updater triggered
  // React's "Cannot update a component while rendering a different
  // component" warning, confirmed live on the F1 version).
  const zoomedRef = useRef(zoomed);
  useEffect(() => {
    zoomedRef.current = zoomed;
  }, [zoomed]);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    dialog?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )[0]?.focus();

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (zoomedRef.current) {
          setZoomed(false);
        } else {
          onClose();
        }
        return;
      }
      if (e.key !== "Tab") return;

      const focusable = dialog?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Sample Ticket Intelligence result"
          onClick={(e) => e.stopPropagation()}
          className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:w-[820px] sm:max-w-[94vw] sm:rounded-sm bg-[#141414] sm:border sm:border-[#2A2A2A] overflow-y-auto"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#2A2A2A] bg-[#141414]">
            <div>
              <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00]">Sample result</p>
              <p className="text-xs text-[#6A6A6A] mt-0.5">
                {caption}
                <span className="hidden lg:inline"> — click the image to zoom</span>
                <span className="lg:hidden"> — pinch to zoom</span>
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex-shrink-0 text-[#6A6A6A] hover:text-white transition-colors text-lg leading-none p-1"
            >
              ✕
            </button>
          </div>

          <button
            type="button"
            onClick={() => setZoomed(true)}
            className="hidden lg:block w-full cursor-zoom-in"
            aria-label="Zoom in on sample result"
          >
            <img src={imageSrc} alt={imageAlt} width={imageWidth} height={imageHeight} className="w-full h-auto block" />
          </button>
          <img src={imageSrc} alt={imageAlt} width={imageWidth} height={imageHeight} className="block lg:hidden w-full h-auto" />
        </div>
      </div>

      {zoomed && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-2 sm:p-8 cursor-zoom-out"
          onClick={() => setZoomed(false)}
          role="dialog"
          aria-modal="true"
          aria-label={imageAlt}
        >
          <button
            type="button"
            onClick={() => setZoomed(false)}
            className="absolute top-4 right-4 text-white text-xs font-black tracking-widest uppercase bg-black/60 hover:bg-black/80 px-3 py-2 rounded-sm"
          >
            Close ✕
          </button>
          <div className="relative w-full h-full max-w-5xl overflow-auto" onClick={(e) => e.stopPropagation()}>
            <img src={imageSrc} alt={imageAlt} className="w-full h-auto" />
          </div>
        </div>
      )}
    </>,
    document.body
  );
}
