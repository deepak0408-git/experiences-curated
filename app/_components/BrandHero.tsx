"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const SLIDES = [
  {
    url: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sports/cricket.jpg",
    alt: "Cricket fans at the ground",
    position: "object-center",
  },
  {
    url: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sports/tennis.jpg",
    alt: "Night tennis at the US Open",
    position: "object-center",
  },
  {
    url: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/experiences/hero/Practice-Day-at-Royal-Birkdale.jpg",
    alt: "Golf at Royal Birkdale",
    position: "object-center",
  },
  {
    url: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/experiences/hero/Circuit%20de%20Spa-Francorchamps%20Track%20Experiences%20and%20Driving%20Days.jpg",
    alt: "Formula 1 at Circuit de Spa",
    position: "object-center",
  },
  {
    url: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sports/cycling.jpg",
    alt: "Tour de France cycling",
    position: "object-center",
  },
];

const INTERVAL = 4000;
const FADE_DURATION = 1200;

export default function BrandHero({
  primaryEventSlug,
  primaryEventName,
  primaryEventFree,
  hasCalendarEvents,
}: {
  primaryEventSlug: string;
  primaryEventName: string;
  primaryEventFree: boolean;
  hasCalendarEvents: boolean;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full h-[100svh] min-h-[560px] max-h-[900px] overflow-hidden bg-neutral-900">
      {/* Crossfading background images — all stacked, opacity toggles */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.url}
          className="absolute inset-0 transition-opacity"
          style={{
            opacity: i === active ? 1 : 0,
            transitionDuration: `${FADE_DURATION}ms`,
            transitionTimingFunction: "ease-in-out",
          }}
        >
          <Image
            src={slide.url}
            alt={slide.alt}
            fill
            className={`object-cover ${slide.position}`}
            sizes="100vw"
            priority={i === 0}
            style={{ filter: "saturate(1.4) brightness(1.05)" }}
          />
        </div>
      ))}

      {/* Dark overlay — heavier at bottom-left for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

      {/* Content — bottom-left, exactly like Headout */}
      <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-10 pb-14 sm:pb-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight tracking-tight max-w-2xl">
            Insider travel guides for the world&apos;s greatest sporting events
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white/70 max-w-xl leading-relaxed">
            Guides built around the event, not just the city. Save and plan what fits your trip. Show up ready.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={`/event-pack/${primaryEventSlug}`}
              className="inline-flex items-center px-7 py-3.5 rounded-full bg-white text-neutral-900 text-sm font-semibold hover:bg-neutral-100 transition-colors"
            >
              {primaryEventFree ? `Get free access — ${primaryEventName} pack` : `Explore — ${primaryEventName}`} →
            </Link>
            <a
              href={hasCalendarEvents ? "#on-the-calendar" : "/search"}
              className="text-sm text-white/70 hover:text-white transition-colors underline underline-offset-4"
            >
              See all events ↓
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
