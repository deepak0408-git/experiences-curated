"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const SPORT_TAB_ORDER = ["formula_one", "tennis", "cricket", "golf"];

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

function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  return `${s.toLocaleDateString("en-GB", { day: "numeric", month: "long" })} – ${e.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`;
}

type CalendarEvent = {
  id: string;
  slug: string;
  name: string;
  sport: string;
  startDate: string;
  endDate: string;
  heroImageUrl: string | null;
  expCount: number;
  glimpse: { id: string; title: string }[];
  venue: string | null;
  es: { state: "upcoming" | "live" | "past"; toStart: number; toEnd: number };
};

export default function CalendarSection({ events }: { events: CalendarEvent[] }) {
  const [activeSport, setActiveSport] = useState<string>("all");

  // Tabs derived from sports actually present, ordered by SPORT_TAB_ORDER
  // (any sport not in that list falls back to first-appearance order) —
  // never hardcoded to always show every sport, so an empty sport never
  // shows a dead tab.
  const sportsPresent: string[] = [];
  for (const ev of events) {
    if (!sportsPresent.includes(ev.sport)) sportsPresent.push(ev.sport);
  }
  sportsPresent.sort((a, b) => {
    const ai = SPORT_TAB_ORDER.indexOf(a);
    const bi = SPORT_TAB_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  const filteredEvents = activeSport === "all"
    ? events
    : events.filter((ev) => ev.sport === activeSport);

  return (
    <div id="on-the-calendar" className="bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-14">
        <div className="flex flex-col-reverse sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-1">
              Available Now
            </p>
            <p className="text-sm text-[#A3A3A3]">
              Full guides, ready today — buy once, keep forever.
            </p>
          </div>
          <Link
            href="/calendar"
            className="group pb-4 border-b border-[#2A2A2A] sm:pb-0 sm:border-b-0 sm:text-right"
          >
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-1 group-hover:text-[#BBFF33] transition-colors">
              The Full Calendar
            </p>
            <p className="text-sm text-[#A3A3A3] group-hover:text-white transition-colors">
              40+ events across Formula 1, Tennis, Golf &amp; Cricket — every date we track →
            </p>
          </Link>
        </div>

        {sportsPresent.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              type="button"
              onClick={() => setActiveSport("all")}
              className={
                activeSport === "all"
                  ? "px-4 py-2 rounded-sm text-xs font-black tracking-wide bg-[#AAFF00] text-black transition-colors"
                  : "px-4 py-2 rounded-sm text-xs font-black tracking-wide border border-[#2A2A2A] text-[#A3A3A3] hover:text-white hover:border-[#AAFF00] transition-colors"
              }
            >
              All
            </button>
            {sportsPresent.map((sport) => (
              <button
                key={sport}
                type="button"
                onClick={() => setActiveSport(sport)}
                className={
                  activeSport === sport
                    ? "px-4 py-2 rounded-sm text-xs font-black tracking-wide bg-[#AAFF00] text-black transition-colors"
                    : "px-4 py-2 rounded-sm text-xs font-black tracking-wide border border-[#2A2A2A] text-[#A3A3A3] hover:text-white hover:border-[#AAFF00] transition-colors"
                }
              >
                {SPORT_LABELS[sport] ?? sport}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-6">
          {filteredEvents.map((ev) => (
            <Link
              key={ev.id}
              href={`/event-pack/${ev.slug}`}
              className="group relative flex flex-col sm:flex-row rounded-sm overflow-hidden border border-[#2A2A2A] bg-[#141414] hover:border-[#AAFF00] transition-all duration-200"
            >
              {/* Image — taller, more dominant */}
              <div className="relative h-52 sm:h-auto sm:w-80 sm:flex-shrink-0 overflow-hidden bg-[#1A1A1A]">
                {ev.heroImageUrl ? (
                  <Image
                    src={ev.heroImageUrl}
                    alt={ev.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 320px"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-200" />
                )}
                {/* Live badge over image */}
                {ev.es.state === "live" && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-sm bg-[#AAFF00] text-black text-xs font-black tracking-wide">
                    LIVE NOW
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-col justify-between px-6 py-5 flex-1 min-w-0">
                <div>
                  {/* Sport + countdown */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-black tracking-widest uppercase text-[#AAFF00]">
                      {SPORT_LABELS[ev.sport] ?? ev.sport}
                    </span>
                    {ev.es.state === "upcoming" && (
                      <span className="text-xs text-[#A3A3A3]">
                        · {ev.es.toStart} day{ev.es.toStart !== 1 ? "s" : ""} away
                      </span>
                    )}
                  </div>

                  {/* Event name */}
                  <h3 className="text-xl font-black text-white leading-snug group-hover:text-[#AAFF00] transition-colors">
                    {ev.name}
                  </h3>

                  {/* Date + venue */}
                  <p className="mt-1.5 text-sm text-[#A3A3A3]">
                    {formatDateRange(ev.startDate, ev.endDate)}
                    {ev.venue && <span className="text-[#6A6A6A]"> · {ev.venue}</span>}
                  </p>

                  {/* Experience count */}
                  {ev.expCount > 0 && (
                    <p className="mt-3 text-xs text-[#A3A3A3]">
                      <span className="text-white font-black">{ev.expCount} hand-researched experiences</span> inside this pack
                    </p>
                  )}

                </div>

                {/* CTA — no price shown on the homepage (masthead and
                    calendar cards deliberately price-free; the real
                    price/checkout lives on the event pack page itself). */}
                <div className="mt-5">
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-[#AAFF00] text-black text-sm font-black tracking-wide group-hover:bg-[#BBFF33] transition-colors whitespace-nowrap">
                    Get the pack
                  </span>
                </div>

                {/* Glimpse — text-only panel */}
                {ev.glimpse.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-[#2A2A2A] bg-[#1A1A1A] rounded-sm px-4 py-3">
                    <p className="text-xs font-black text-[#AAFF00] leading-tight">A taste of what&apos;s inside</p>
                    <ul className="mt-2 space-y-1.5">
                      {ev.glimpse.map((exp) => (
                        <li key={exp.id} className="flex items-start gap-1.5 min-w-0">
                          <span className="text-[#AAFF00] text-xs mt-0.5 flex-shrink-0">›</span>
                          <span className="text-xs leading-tight truncate text-[#A3A3A3]">
                            {exp.title}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
