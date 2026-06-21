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
];

const SPORT_LABELS: Record<string, string> = {
  tennis: "Tennis",
  cricket: "Cricket",
  football: "Football",
  rugby: "Rugby",
  golf: "Golf",
  formula_one: "Formula 1",
  cycling: "Cycling",
  athletics: "Athletics",
  other: "Sport",
};

const INTERVAL = 4000;
const FADE_DURATION = 1200;

function formatShortDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const startStr = s.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const endStr = e.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return `${startStr} – ${endStr}`;
}

function shortEventName(name: string, slug: string): string {
  // Derive a short display name from the slug — more reliable than string-stripping
  const SHORT_NAMES: Record<string, string> = {
    "wimbledon-2026": "Wimbledon 2026",
    "india-in-england-cricket-2026": "India in England 2026",
    "the-open-championship-2026": "The Open 2026",
    "belgian-gp-2026": "Belgian GP 2026",
    "us-open-2026": "US Open 2026",
  };
  return SHORT_NAMES[slug] ?? name;
}

type FeaturedEvent = {
  slug: string;
  name: string;
  sport: string;
  startDate: string;
  endDate: string;
  isFree: boolean;
};

export default function BrandHero({
  featuredEvents,
  hasCalendarEvents,
}: {
  featuredEvents: FeaturedEvent[];
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
      {/* Crossfading background images */}
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

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />

      {/* Content — bottom-left */}
      <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-10 pb-14 sm:pb-16">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight max-w-2xl">
            Insider travel guides for the world&apos;s greatest sporting events
          </h1>
          <p className="mt-4 text-sm sm:text-base text-white/60 leading-relaxed font-light whitespace-nowrap">
            Guides built around the event, not just the city. Save and plan what fits your trip. Show up ready.
          </p>

          <div className="mt-8">
            {/* NOW FEATURED label */}
            <p className="text-xs font-black text-[#AAFF00] mb-3">
              Now featured
            </p>

            {/* Featured event rows */}
            <div className="flex flex-col gap-2.5 mb-4">
              {featuredEvents.map((ev) => (
                <div key={ev.slug} className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-black text-[#AAFF00] flex-shrink-0">
                      {SPORT_LABELS[ev.sport] ?? ev.sport}
                    </span>
                    <span className="text-white/80 text-sm font-medium">
                      {shortEventName(ev.name, ev.slug)}
                    </span>
                    <span className="text-white/40 text-sm">
                      · {formatShortDateRange(ev.startDate, ev.endDate)}
                    </span>
                  </div>
                  <Link
                    href={`/event-pack/${ev.slug}`}
                    className="flex-shrink-0 inline-flex items-center px-4 py-1.5 rounded-sm bg-[#AAFF00] text-black text-xs font-black tracking-wide hover:bg-[#BBFF33] transition-colors"
                  >
                    {ev.isFree ? "Get the free event pack →" : "Get the event pack →"}
                  </Link>
                </div>
              ))}
            </div>

            {/* See all events */}
            <a
              href={hasCalendarEvents ? "#on-the-calendar" : "/search"}
              className="text-sm text-white/50 hover:text-[#AAFF00] transition-colors"
            >
              See all events ↓
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
