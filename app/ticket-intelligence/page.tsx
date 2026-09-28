import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HomepageNav from "@/app/_components/HomepageNav";
import { getAuthUser } from "@/lib/supabase/server";
import { getTicketIntelligenceEvents } from "./[slug]/_lib/getSeatingData";
import SeasonPassCheckout from "./_components/SeasonPassCheckout";
import LocalCurrencyHint from "@/app/event-pack/[slug]/_components/LocalCurrencyHint";
import { hasAnyActiveSeasonPass } from "./_lib/seasonPassAccess";

// Ticket Intelligence event picker — top-level index route, same pattern as
// /planner and /calendar. The discovery surface fans land on when they
// don't already have a direct /ticket-intelligence/[slug] link. Added 27
// Sep 2026 (founder: "currently they can do it only for 1 event at a time
// and need the exact link"). Lists every event this product is actually
// usable for — see getTicketIntelligenceEvents for the eligibility filter
// (same packStatus gate as the Season Planner, PLUS a real seeded-seating
// check on top, per founder direction the same day).

export const metadata: Metadata = {
  title: "Best F1 Grandstand Seats",
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
  const ownsSeasonPass = user?.email ? await hasAnyActiveSeasonPass(user.email) : false;

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <HomepageNav email={user?.email ?? null} />
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00] mb-4">
          Ticket Intelligence
        </p>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
          Which is the best F1 grandstand seat?
        </h1>
        <p className="text-[#A3A3A3] text-base mb-12 max-w-2xl">
          Pick your event. Answer 6 quick questions about how you actually want to watch — we&apos;ll match you
          against every real grandstand, lawn zone, and hospitality suite at that circuit. Currently F1 only —
          more races upcoming.
        </p>

        {/* Season Pass box sits alongside the event grid, not above/below
            it — the grid is the primary task (pick an event), the pass is
            an alternative/upsell path for a fan who already knows they
            want every event, so it gets the sidebar slot rather than
            competing for the same visual weight. Added 28 Sep 2026. */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-14 items-start">
          <div className="order-2 lg:order-1">
            {events.length === 0 ? (
              <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-8 text-center">
                <p className="text-sm text-[#A3A3A3]">
                  No events are ready for ticket matching yet — check back soon.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
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

          <div className="order-1 lg:order-2 rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
            <p className="text-xs font-black tracking-widest uppercase text-white mb-2">
              2026/27 Season Pass
            </p>
            {ownsSeasonPass ? (
              <>
                <p className="text-sm text-[#A3A3A3] mb-4">
                  You already have full 2026/27 Ticket Intelligence access — pick any event, your match
                  unlocks automatically, no separate payment.
                </p>
                <p className="text-sm font-black text-[#AAFF00]">✓ Season Pass active</p>
              </>
            ) : (
              <>
                <p className="text-sm text-[#A3A3A3] mb-4">
                  One payment, every 2026 and 2027 F1 event unlocked — no per-event US$10 charge.
                </p>
                <p className="text-2xl font-black text-white mb-4">
                  US$25
                  <LocalCurrencyHint baseAmount={25} baseCurrency="USD" />
                </p>
                {user?.email ? (
                  <>
                    <SeasonPassCheckout label="Get the Season Pass" />
                    <p className="text-xs text-[#6A6A6A] mt-3">
                      One-time purchase, sent to {user.email}.
                    </p>
                  </>
                ) : (
                  <>
                    <Link
                      href={`/sign-in?next=${encodeURIComponent("/ticket-intelligence")}`}
                      className="w-full inline-flex items-center justify-center px-6 py-3 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors"
                    >
                      Sign in to get the pass
                    </Link>
                    <p className="text-xs text-[#6A6A6A] mt-3">
                      We&apos;ll email you a magic link, then take you straight back here.
                    </p>
                  </>
                )}
                <p className="text-xs text-[#6A6A6A] mt-3">
                  Or click on the event tile for only that event — <span className="font-bold text-white">US$10</span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
