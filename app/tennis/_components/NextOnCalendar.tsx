"use client";

import Image from "next/image";
import Link from "next/link";
import { phEvent } from "@/lib/posthog-events";
import type { CockpitEvent } from "../_lib/getCockpitEvents";

function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  return `${s.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${e.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`;
}

// Section 4 — exactly 4 upcoming tennis events, reusing the same
// eligibility data source as the homepage's own "On the Calendar" section
// (no static list). Mirrors
// app/formula-1/_components/NextOnCalendar.tsx.
export default function NextOnCalendar({
  events,
  onSelectEvent,
}: {
  events: CockpitEvent[];
  onSelectEvent: (event: CockpitEvent) => void;
}) {
  return (
    <section className="bg-[#141414]">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-14">
        <div className="flex flex-col-reverse sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-1">Upcoming Tournaments</p>
            <h2 className="text-xl sm:text-2xl font-black text-white">Next on the calendar</h2>
          </div>
          <Link href="/calendar/tennis?from=tennis-cockpit" className="text-xs font-black text-[#AAFF00] hover:text-[#BBFF33] transition-colors whitespace-nowrap">
            View tennis calendar →
          </Link>
        </div>

        {events.length === 0 ? (
          <p className="text-sm text-[#A3A3A3]">No upcoming tournaments right now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {events.map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={() => {
                  phEvent.tennisCockpitCalendarCardClicked({ eventSlug: event.slug });
                  phEvent.tennisCockpitModalOpened({ modal: "event_selector", source: "calendar" });
                  onSelectEvent(event);
                }}
                className="group relative overflow-hidden rounded-sm border border-[#2A2A2A] hover:border-[#AAFF00] transition-colors duration-300 text-left bg-[#0A0A0A] cursor-pointer block w-full"
              >
                {event.heroImageUrl && (
                  <div className="relative h-28 w-full overflow-hidden">
                    <Image
                      src={event.heroImageUrl}
                      alt=""
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                )}
                <div className="p-3.5">
                  <p className="text-sm font-black text-white leading-tight">{event.name}</p>
                  <p className="text-xs text-[#6A6A6A] mt-1">{formatDateRange(event.startDate, event.endDate)}</p>
                  {event.venueName && <p className="text-xs text-[#6A6A6A]">{event.venueName}</p>}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
