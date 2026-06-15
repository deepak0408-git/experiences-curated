"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

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

const TYPE_LABELS: Record<string, string> = {
  fan_experience: "Fan experience",
  accommodation: "Stay",
  dining: "Dining",
  activity: "Activity",
  cultural_site: "Cultural site",
  transit: "Getting there",
  sports_venue: "Venue",
  neighborhood: "Neighbourhood",
  day_trip: "Day trip",
  multi_day: "Multi-day",
  natural_wonder: "Nature",
  event: "Event",
};

const BUDGET_LABELS: Record<string, string> = {
  free: "Free",
  budget: "Budget",
  moderate: "Mid-range",
  splurge: "Splurge",
  luxury: "Luxury",
};

export type HeroEvent = {
  id: string;
  slug: string;
  name: string;
  sport: string;
  startDate: string;
  endDate: string;
  venueName: string | null;
  heroImageUrl: string | null;
  state: "upcoming" | "live" | "past";
  toStart: number;
  toEnd: number;
  priceDisplay: string;
  earlyBird: { show: boolean; cutoffLabel: string; standardPrice: string };
  totalCount: number;
  teasers: {
    id: string;
    title: string;
    subtitle: string | null;
    slug: string;
    heroImageUrl: string | null;
    experienceType: string;
    budgetTier: string | null;
    neighborhood: string | null;
  }[];
};

function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  return `${s.toLocaleDateString("en-GB", { day: "numeric", month: "long" })} – ${e.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`;
}

const ROTATE_INTERVAL = 6000;

export default function HeroCarousel({
  events,
  calendarHint,
}: {
  events: HeroEvent[];
  calendarHint?: string;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (index === active) return;
      setTransitioning(true);
      setTimeout(() => {
        setActive(index);
        setTransitioning(false);
      }, 200);
    },
    [active]
  );

  useEffect(() => {
    if (events.length < 2 || paused) return;
    const id = setInterval(() => {
      goTo((active + 1) % events.length);
    }, ROTATE_INTERVAL);
    return () => clearInterval(id);
  }, [active, paused, events.length, goTo]);

  if (!events.length) return null;

  const ev = events[active];

  return (
    <>
      {/* Hero */}
      <div
        className="relative h-[62vh] min-h-[420px] overflow-hidden bg-neutral-900"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Background image — swap without transition to avoid bfcache issues */}
        {ev.heroImageUrl && (
          <Image
            key={ev.slug}
            src={ev.heroImageUrl}
            alt={ev.name}
            fill
            className={`object-cover opacity-65 transition-opacity duration-300 ${transitioning ? "opacity-0" : "opacity-65"}`}
            sizes="100vw"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 px-6 sm:px-8 pb-10">
          <div className="max-w-5xl mx-auto">
            {/* State pill */}
            <div className="mb-3">
              {ev.state === "upcoming" && (
                <span className="inline-block text-xs font-semibold tracking-widest uppercase text-white bg-black/50 px-3 py-1 rounded-full">
                  {SPORT_LABELS[ev.sport] ?? ev.sport} · Starts in {ev.toStart} day{ev.toStart !== 1 ? "s" : ""}
                </span>
              )}
              {ev.state === "live" && (
                <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-400 bg-black/50 px-3 py-1 rounded-full">
                  {SPORT_LABELS[ev.sport] ?? ev.sport} · Underway · {ev.toEnd} day{ev.toEnd !== 1 ? "s" : ""} remaining
                </span>
              )}
              {ev.state === "past" && (
                <span className="inline-block text-xs font-semibold tracking-widest uppercase text-white/80 bg-black/50 px-3 py-1 rounded-full">
                  {SPORT_LABELS[ev.sport] ?? ev.sport} · The guide
                </span>
              )}
            </div>

            <h1
              className={`text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight max-w-2xl transition-opacity duration-200 ${transitioning ? "opacity-0" : "opacity-100"}`}
            >
              {ev.name}
            </h1>
            <p className={`mt-2 text-white/60 text-sm transition-opacity duration-200 ${transitioning ? "opacity-0" : "opacity-100"}`}>
              {formatDateRange(ev.startDate, ev.endDate)}
              {ev.slug === "india-in-england-cricket-2026"
                ? " · Birmingham · London · Nottingham · more"
                : ev.venueName ? ` · ${ev.venueName}` : ""}
            </p>

            <div className={`mt-7 flex items-center gap-4 flex-wrap transition-opacity duration-200 ${transitioning ? "opacity-0" : "opacity-100"}`}>
              {(ev.state === "upcoming" || ev.state === "live") && (
                <Link
                  href={`/event-pack/${ev.slug}`}
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-neutral-900 text-sm font-semibold hover:bg-neutral-100 transition-colors"
                >
                  Get the Event Pack
                  <span className="text-neutral-400 font-normal">{ev.priceDisplay}</span>
                </Link>
              )}
              {ev.state === "past" && (
                <Link
                  href={`/event-pack/${ev.slug}`}
                  className="inline-flex items-center px-6 py-3 rounded-full bg-white text-neutral-900 text-sm font-semibold hover:bg-neutral-100 transition-colors"
                >
                  Explore the guide
                </Link>
              )}
              {ev.totalCount > 0 && (
                <span className="text-white/40 text-sm">
                  {ev.totalCount} curated experiences inside
                </span>
              )}
            </div>

            {/* Early-bird nudge */}
            {ev.earlyBird.show && ev.state === "upcoming" && (
              <p className={`mt-3 text-xs text-white/50 transition-opacity duration-200 ${transitioning ? "opacity-0" : "opacity-100"}`}>
                Early-bird price — rises to {ev.earlyBird.standardPrice} after {ev.earlyBird.cutoffLabel}
              </p>
            )}

            {/* Dot indicators — only shown when 2 events */}
            {events.length > 1 && (
              <div className="mt-5 flex items-center gap-4">
                {events.map((e, i) => (
                  <button
                    key={e.slug}
                    onClick={() => { setPaused(true); goTo(i); }}
                    className="flex items-center gap-2 group"
                    aria-label={`Show ${e.name}`}
                  >
                    <span
                      className={`block rounded-full transition-all duration-300 ${
                        i === active
                          ? "w-2 h-2 bg-white"
                          : "w-1.5 h-1.5 bg-white/40 group-hover:bg-white/70"
                      }`}
                    />
                    <span
                      className={`text-xs font-semibold tracking-widest uppercase transition-colors duration-200 ${
                        i === active ? "text-white" : "text-white/40 group-hover:text-white/70"
                      }`}
                    >
                      {e.name}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Calendar hint — always shown when there are non-featured upcoming events */}
            {calendarHint && (
              <a
                href="#on-the-calendar"
                className="mt-3 inline-block text-xs font-semibold tracking-widest uppercase text-white bg-black/50 px-3 py-1 rounded-full hover:bg-black/70 transition-colors"
              >
                Also coming up · {calendarHint} ↓
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Teasers — bound to active slide */}
      {ev.teasers.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-1">
            A glimpse inside
          </p>
          <p className={`text-sm text-neutral-500 mb-8 transition-opacity duration-200 ${transitioning ? "opacity-0" : "opacity-100"}`}>
            A few of the experiences in the {ev.name} pack.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ev.teasers.map((exp) => (
              <Link
                key={exp.id}
                href={`/experience/${exp.slug}`}
                className="group rounded-xl border border-neutral-200 overflow-hidden hover:border-neutral-400 transition-colors"
              >
                <div className="relative h-44 overflow-hidden bg-neutral-100">
                  {exp.heroImageUrl ? (
                    <Image
                      src={exp.heroImageUrl}
                      alt={exp.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-200" />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold tracking-widest uppercase text-neutral-400">
                      {TYPE_LABELS[exp.experienceType] ?? exp.experienceType}
                    </span>
                    {exp.budgetTier && (
                      <span className="text-xs text-neutral-400">
                        {BUDGET_LABELS[exp.budgetTier] ?? exp.budgetTier}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900 leading-snug group-hover:text-neutral-600 transition-colors">
                    {exp.title}
                  </h3>
                  {exp.subtitle && (
                    <p className="mt-1 text-xs text-neutral-500 line-clamp-2 leading-5">
                      {exp.subtitle}
                    </p>
                  )}
                  {exp.neighborhood && (
                    <p className="mt-2 text-xs text-neutral-400">{exp.neighborhood}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
          {ev.totalCount > ev.teasers.length && (
            <div className="mt-6 text-center">
              <Link
                href={`/event-pack/${ev.slug}`}
                className="text-sm text-neutral-400 hover:text-neutral-900 transition-colors underline underline-offset-2"
              >
                +{ev.totalCount - ev.teasers.length} more experiences in the full pack
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}
