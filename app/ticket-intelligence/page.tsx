import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HomepageNav from "@/app/_components/HomepageNav";
import { getAuthUser } from "@/lib/supabase/server";
import { getTicketIntelligenceEvents } from "./[slug]/_lib/getSeatingData";

// Ticket Intelligence event picker — top-level index route, same pattern as
// /planner and /calendar. The discovery surface fans land on when they
// don't already have a direct /ticket-intelligence/[slug] link. Added 27
// Sep 2026 (founder: "currently they can do it only for 1 event at a time
// and need the exact link"). Lists every event this product is actually
// usable for — see getTicketIntelligenceEvents for the eligibility filter
// (same packStatus gate as the Season Planner, PLUS a real seeded-seating
// check on top, per founder direction the same day).

export const metadata: Metadata = {
  title: "Ticket Intelligence — Which Seat Fits You?",
  description: "Answer 6 questions, get matched to the real grandstand, lawn zone, or hospitality suite that fits you.",
};

function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  const startFmt = start.toLocaleDateString("en-GB", { day: "numeric", month: sameMonth ? undefined : "short" });
  const endFmt = end.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  return `${startFmt}–${endFmt}`;
}

export default async function TicketIntelligenceHomePage() {
  const { user } = await getAuthUser();
  const events = await getTicketIntelligenceEvents();

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <HomepageNav email={user?.email ?? null} />
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16">
        <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00] mb-4">
          Ticket Intelligence
        </p>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
          Which seat actually fits you?
        </h1>
        <p className="text-[#A3A3A3] text-base mb-12 max-w-2xl">
          Pick your event. Answer 6 quick questions about how you actually want to watch — we&apos;ll match you
          against every real grandstand, lawn zone, and hospitality suite at that circuit.
        </p>

        {events.length === 0 ? (
          <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-8 text-center">
            <p className="text-sm text-[#A3A3A3]">
              No events are ready for ticket matching yet — check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/ticket-intelligence/${event.slug}`}
                className="group rounded-sm border border-[#2A2A2A] bg-[#141414] overflow-hidden hover:border-[#AAFF00]/50 transition-colors"
              >
                <div className="relative w-full aspect-[16/9] bg-[#1A1A1A]">
                  {event.heroImageUrl && (
                    <Image
                      src={event.heroImageUrl}
                      alt={event.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
                    />
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm font-black text-white mb-1">{event.name}</p>
                  <p className="text-xs text-[#6A6A6A] mb-3">
                    {event.venueName ? `${event.venueName} — ` : ""}
                    {formatDateRange(event.startDate, event.endDate)}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#AAFF00] group-hover:text-[#BBFF33] transition-colors">
                    Find which seat suits you →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
