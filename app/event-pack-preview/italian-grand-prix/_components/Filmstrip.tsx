"use client";

import Image from "next/image";

// Slow auto-scrolling filmstrip — real atmosphere photos drifting past,
// not a static grid. Pauses on hover (so a visitor can actually look at
// one), and respects prefers-reduced-motion by falling back to a static
// grid entirely (no motion-sickness risk, no animation to disable).
export default function Filmstrip({ images }: { images: { id: string; heroImageUrl: string; title: string }[] }) {
  if (images.length === 0) return null;

  // Duplicate the set once so the marquee loop has no visible seam.
  const looped = [...images, ...images];

  return (
    <div className="bg-[#0A0A0A] border-b border-[#2A2A2A] overflow-hidden group">
      <div className="flex motion-safe:animate-[filmstrip-scroll_40s_linear_infinite] motion-safe:group-hover:[animation-play-state:paused] motion-reduce:flex-wrap">
        {looped.map((img, i) => (
          <div key={`${img.id}-${i}`} className="relative h-32 sm:h-44 w-1/2 sm:w-1/4 flex-shrink-0 overflow-hidden">
            <Image src={img.heroImageUrl} alt={img.title} fill className="object-cover" sizes="(max-width: 640px) 50vw, 25vw" />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes filmstrip-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
