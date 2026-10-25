"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { notifyMe } from "@/app/planner/_lib/actions";
import { phEvent } from "@/lib/posthog-events";
import type { CockpitEvent } from "../_lib/getCockpitEvents";

function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  return `${s.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${e.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`;
}

export function NotifyRow({ event, userEmail }: { event: CockpitEvent; userEmail: string | null }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(userEmail ?? "");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  if (status === "done") {
    return <p className="text-xs text-[#AAFF00]">You&apos;re on the list.</p>;
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs font-bold text-[#A3A3A3] hover:text-[#AAFF00] transition-colors underline underline-offset-2"
      >
        Get notified when it&apos;s ready
      </button>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus("loading");
        try {
          await notifyMe(
            email,
            {
              sports: ["tennis"],
              budgetMin: 0,
              budgetMax: 100000,
              timeWindow: "flexible",
              tripLengthDays: 0,
              originMarket: "unspecified",
            },
            [],
            event.id
          );
          setStatus("done");
        } catch {
          setStatus("error");
        }
      }}
      className="flex items-center gap-2"
    >
      <input
        type="email"
        required
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        aria-label={`Get notified when the ${event.name} guide is live`}
        className="flex-1 min-w-0 rounded-sm bg-[#0A0A0A] border border-[#2A2A2A] px-2.5 py-1.5 text-xs text-white placeholder:text-[#6A6A6A] focus:outline-none focus:border-[#AAFF00] transition-colors"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="flex-shrink-0 rounded-sm bg-[#AAFF00] text-black text-xs font-black px-3 py-1.5 hover:bg-[#BBFF33] transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "..." : "Notify me"}
      </button>
    </form>
  );
}

// Searchable tournament selector shared by Card 3 ("I've chosen my
// tournament") and Card 4's "Start a New Trip" action. Mirrors
// app/formula-1/_components/GpSelector.tsx. Shows Ticket Intelligence and
// Event Guide choices concurrently per event, each actionable only when
// that product exists for that event.
export default function EventSelector({
  events,
  userEmail,
  preselectedEventId,
  onGuideSelected,
}: {
  events: CockpitEvent[];
  userEmail: string | null;
  preselectedEventId?: string | null;
  onGuideSelected?: (event: CockpitEvent | null) => void;
}) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(preselectedEventId ?? null);
  const [locked, setLocked] = useState(!!preselectedEventId);

  const filtered = useMemo(() => {
    if (locked && selectedId) return events.filter((e) => e.id === selectedId);
    const q = query.trim().toLowerCase();
    if (!q) return events;
    return events.filter((e) => e.name.toLowerCase().includes(q) || e.venueName?.toLowerCase().includes(q));
  }, [events, query, locked, selectedId]);

  function handleSelect(event: CockpitEvent) {
    if (selectedId === event.id) {
      setSelectedId(null);
      setLocked(false);
      onGuideSelected?.(null);
      return;
    }
    setSelectedId(event.id);
    phEvent.tennisCockpitEventSelected({ eventSlug: event.slug });
    onGuideSelected?.(event);
  }

  if (events.length === 0) {
    return <p className="text-sm text-[#A3A3A3]">No upcoming tournaments found right now.</p>;
  }

  return (
    <div>
      {!locked && (
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tournaments…"
          aria-label="Search tournaments"
          className="w-full rounded-sm bg-[#0A0A0A] border border-[#2A2A2A] px-3 py-2.5 text-sm text-white placeholder:text-[#6A6A6A] focus:outline-none focus:border-[#AAFF00] transition-colors mb-4"
        />
      )}

      {filtered.length === 0 ? (
        <p className="text-sm text-[#A3A3A3]">No tournaments match &quot;{query}&quot;.</p>
      ) : (
        <ul className={`space-y-2 overflow-y-auto ${onGuideSelected ? "sm:max-h-[148px]" : "max-h-[50vh] sm:max-h-80"}`}>
          {filtered.map((event) => {
            const isSelected = selectedId === event.id;
            return (
              <li
                key={event.id}
                className={`group/row rounded-sm border p-3.5 transition-colors ${isSelected ? "border-[#AAFF00] bg-[#0A0A0A]" : "border-[#2A2A2A] hover:border-[#AAFF00]"}`}
              >
                <button
                  type="button"
                  onClick={() => handleSelect(event)}
                  className="w-full flex items-center justify-between gap-2 text-left cursor-pointer"
                >
                  <span>
                    <span className="block text-sm font-black text-white group-hover/row:text-[#AAFF00] transition-colors">{event.name}</span>
                    <span className="block text-xs text-[#6A6A6A] mt-0.5">
                      {formatDateRange(event.startDate, event.endDate)}
                      {event.venueName ? ` · ${event.venueName}` : ""}
                    </span>
                  </span>
                  <span className={`flex-shrink-0 text-sm transition-colors ${isSelected ? "text-[#AAFF00]" : "text-[#6A6A6A] group-hover/row:text-[#AAFF00]"}`}>
                    {isSelected ? "✕" : "→"}
                  </span>
                </button>

                {isSelected && !onGuideSelected && (
                  <div className="mt-3 pt-3 border-t border-[#2A2A2A] grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#6A6A6A] mb-1.5">Ticket Intelligence</p>
                      {event.ticketIntelligenceAvailable ? (
                        <Link
                          href={`/ticket-intelligence/tennis/${event.slug}?from=tennis-cockpit`}
                          className="inline-flex items-center rounded-sm bg-[#AAFF00] hover:bg-[#BBFF33] transition-colors px-3 py-2 text-xs font-black text-black"
                        >
                          Find your ticket →
                        </Link>
                      ) : (
                        <p className="text-xs text-[#6A6A6A]">Currently unavailable</p>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#6A6A6A] mb-1.5">Event Guide</p>
                      {event.eventGuideAvailable ? (
                        <Link
                          href={`/event-pack/${event.slug}?from=tennis-cockpit`}
                          className="inline-flex items-center rounded-sm bg-[#AAFF00] hover:bg-[#BBFF33] transition-colors px-3 py-2 text-xs font-black text-black"
                        >
                          View guide →
                        </Link>
                      ) : (
                        <div className="space-y-1.5">
                          <p className="text-xs text-[#6A6A6A]">Currently unavailable</p>
                          <NotifyRow event={event} userEmail={userEmail} />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
