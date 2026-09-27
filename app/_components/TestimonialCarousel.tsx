"use client";

import { useState } from "react";

type Testimonial = {
  id: string;
  displayName: string;
  rating: number;
  comment: string;
  eventName: string;
};

// Continuous CSS-driven marquee — smoother than a JS setInterval + scrollTo
// tick, which visibly jerks each time it fires. Speed is px/sec; duration
// is derived from content width so it stays constant regardless of card
// count. The list is rendered twice back-to-back and the animation moves
// exactly one set's width, so the loop point is seamless.
const PX_PER_SECOND = 40;

export default function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [paused, setPaused] = useState(false);

  if (!testimonials.length) return null;

  const loop = [...testimonials, ...testimonials];
  // Card width (260px) + gap (20px), matches the card class below.
  const singleSetWidth = testimonials.length * (260 + 20);
  const durationSeconds = singleSetWidth / PX_PER_SECOND;

  return (
    <div
      className="overflow-hidden"
      onPointerEnter={(e) => { if (e.pointerType === "mouse") setPaused(true); }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse") setPaused(false); }}
    >
      <div
        className="flex gap-5 w-max"
        style={{
          animation: `testimonial-marquee ${durationSeconds}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
          ["--marquee-distance" as string]: `-${singleSetWidth}px`,
        }}
      >
        {loop.map((t, i) => (
          <div
            key={`${t.id}-${i}`}
            className="rounded-sm bg-[#1A1A1A] border border-[#2A2A2A] p-6 flex flex-col flex-shrink-0 w-[240px] sm:w-[260px]"
          >
            <div className="flex gap-0.5 mb-3" aria-label={`${t.rating} out of 5 stars`}>
              {Array.from({ length: 5 }).map((_, j) => (
                <span key={j} className={j < t.rating ? "text-[#AAFF00]" : "text-[#2A2A2A]"}>
                  ★
                </span>
              ))}
            </div>
            <p className="text-sm text-[#A3A3A3] leading-6 flex-1">
              &ldquo;{t.comment}&rdquo;
            </p>
            <div className="mt-4 pt-4 border-t border-[#2A2A2A]">
              <p className="text-sm font-black text-white">{t.displayName}</p>
              <p className="text-xs text-[#6A6A6A] mt-0.5">{t.eventName}</p>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes testimonial-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(var(--marquee-distance)); }
        }
      `}</style>
    </div>
  );
}
