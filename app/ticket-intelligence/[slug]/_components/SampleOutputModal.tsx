"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// Issue 5 fix, 19 Nov 2026 — founder direction: show a REAL sample of
// what the $10 unlock contains, not an invented mockup — "a real output
// generates more trust." Image at public/ticket-intelligence/
// sample-result-us-gp.png is a genuine, unedited screenshot of the
// founder's own US GP 2026 result (real account, real purchase) — no
// content invented or altered. The live teaser's blur itself
// (TeaserResult.tsx) is untouched; this is a separate "Here's what a
// sample output looks like" link that opens this modal.
//
// Reuses CockpitModal's accessible shell pattern (focus trap, ESC, scroll
// lock, portal) rather than building a second one-off modal primitive.
//
// Rendering fix, 19 Nov 2026 — founder-flagged "blurry as hell": the
// image (782x2922, real page content with small text throughout) was
// being squeezed into a fixed 480px-wide box via next/image `fill` +
// an aspectRatio wrapper, forcing the browser to downscale real text to
// illegible sizes with no way to recover it. Fixed by widening the modal
// toward the image's native width and rendering it with a real
// <img width/height> (not `fill`) so the browser never scales it down
// below a legible size on desktop. A click-to-zoom overlay (same pattern
// as ZoomableImage.tsx) is layered on top for mobile/narrow viewports,
// where even the widened modal can't show native-resolution text.
export default function SampleOutputModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const [zoomed, setZoomed] = useState(false);
  // Read synchronously inside the keydown handler below — calling a
  // PARENT component's setState (onClose -> TeaserResult's
  // setSampleOpen) from inside this component's own setZoomed updater
  // triggered React's "Cannot update a component while rendering a
  // different component" warning (confirmed live, 19 Nov 2026). A ref
  // read avoids nesting one component's state update inside another's.
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
        // Closes the zoom overlay first if it's open, same expectation as
        // ZoomableImage.tsx's own lightbox — ESC should back out one layer
        // at a time, not skip straight past the zoomed view.
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

  const sampleAlt =
    "A real, unlocked Ticket Intelligence result for the US GP — best match, runner-up, 3rd option, circuit map, and buying guide";

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
                A real, unlocked result from a US GP 2026 purchase
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

          {/* Real <img> at (near-)native width, not next/image `fill` —
              fill+aspectRatio was forcing the browser to downscale real
              page text below legible size with no way to recover it.
              Click-to-zoom is lg+ only, 19 Nov 2026 — founder-flagged dead
              end on phone: the zoom overlay's close button scrolls out of
              view once a tall image is pinch-zoomed, and tapping the image
              (nearly the whole screen) does nothing, since the overlay's
              own stopPropagation blocks its wrapper's close-on-click.
              Below lg, native pinch-zoom already works on the plain image
              with no overlay needed, so the custom zoom trigger — and its
              dead-end risk — is removed entirely rather than patched. */}
          <button
            type="button"
            onClick={() => setZoomed(true)}
            className="hidden lg:block w-full cursor-zoom-in"
            aria-label="Zoom in on sample result"
          >
            <img
              src="/ticket-intelligence/sample-result-us-gp.png"
              alt={sampleAlt}
              width={782}
              height={2922}
              className="w-full h-auto block"
            />
          </button>
          <img
            src="/ticket-intelligence/sample-result-us-gp.png"
            alt={sampleAlt}
            width={782}
            height={2922}
            className="block lg:hidden w-full h-auto"
          />
        </div>
      </div>

      {zoomed && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-2 sm:p-8 cursor-zoom-out"
          onClick={() => setZoomed(false)}
          role="dialog"
          aria-modal="true"
          aria-label={sampleAlt}
        >
          <button
            type="button"
            onClick={() => setZoomed(false)}
            className="absolute top-4 right-4 text-white text-xs font-black tracking-widest uppercase bg-black/60 hover:bg-black/80 px-3 py-2 rounded-sm"
          >
            Close ✕
          </button>
          <div className="relative w-full h-full max-w-5xl overflow-auto" onClick={(e) => e.stopPropagation()}>
            <img src="/ticket-intelligence/sample-result-us-gp.png" alt={sampleAlt} className="w-full h-auto" />
          </div>
        </div>
      )}
    </>,
    document.body
  );
}
