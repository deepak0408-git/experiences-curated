import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HomepageNav from "@/app/_components/HomepageNav";
import { getAuthUser } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { sportingEvents } from "@/schema/database";
import { eq } from "drizzle-orm";
import { getProDetails } from "@/lib/pro";
import { hasAnyActiveSeasonPass } from "../_lib/seasonPassAccess";
import { hasTennisTicketIntelligence } from "./[slug]/_lib/getTennisOptionsData";
import TennisSeasonPassCheckout from "./[slug]/_components/TennisSeasonPassCheckout";
import LocalCurrencyHint from "@/app/event-pack/[slug]/_components/LocalCurrencyHint";

// Tennis Ticket Intelligence event picker — top-level index route, same
// role as /ticket-intelligence (F1's picker). Added 20 Oct 2026. Lives at
// /ticket-intelligence/tennis (a static page.tsx sibling of the dynamic
// [slug] route one level below — both coexist fine in Next.js App Router).
// Originally built at /tennis-ticket-intelligence, moved here same day per
// founder correction.
//
// Deliberately NOT the same "query every eligible event" pattern F1's
// picker uses (getTicketIntelligenceEvents) — there are only ever 4 Grand
// Slams, ever, so the founder specified a fixed 2x2 grid in a fixed order
// (Australian Open, French Open, Wimbledon, US Open) with hardcoded slugs,
// rather than a DB-driven list that could reorder/grow. Each tile's
// activation state (clickable vs. "Coming Soon") is still real and
// data-driven — hasTennisTicketIntelligence(eventId, editionYear), the
// same fail-closed gate used everywhere else in this product — only the
// SET of 4 slugs and their order is fixed, never which of them is
// currently live.

const GRAND_SLAM_SLUGS = ["australian-open", "french-open", "wimbledon", "us-open"] as const;

export const metadata: Metadata = {
  title: "Which is the best Grand Slam ticket?",
  description: "Answer 7 quick questions, get matched to the arena, stage, and seating that fits you at every Grand Slam.",
};

function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  const startFmt = start.toLocaleDateString("en-GB", { day: "numeric", month: sameMonth ? undefined : "short" });
  const endFmt = end.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  return `${startFmt}–${endFmt}`;
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

interface GrandSlamTile {
  slug: string;
  name: string;
  heroImageUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
}

async function getGrandSlamTiles(): Promise<GrandSlamTile[]> {
  const tiles: GrandSlamTile[] = [];
  for (const slug of GRAND_SLAM_SLUGS) {
    const [event] = await db
      .select({
        id: sportingEvents.id,
        slug: sportingEvents.slug,
        name: sportingEvents.name,
        heroImageUrl: sportingEvents.heroImageUrl,
        startDate: sportingEvents.startDate,
        endDate: sportingEvents.endDate,
        editionYear: sportingEvents.editionYear,
      })
      .from(sportingEvents)
      .where(eq(sportingEvents.slug, slug))
      .limit(1);

    // No sporting_events row at all for this slug yet — a minimal
    // placeholder tile (name only, no image/dates), never a crash or a
    // skipped grid slot. The grid always shows exactly these 4, in this
    // order, regardless of build progress.
    if (!event) {
      tiles.push({ slug, name: slugToDisplayName(slug), heroImageUrl: null, startDate: null, endDate: null, isActive: false });
      continue;
    }

    const isActive = await hasTennisTicketIntelligence(event.id, event.editionYear);
    tiles.push({
      slug: event.slug,
      name: event.name,
      heroImageUrl: event.heroImageUrl,
      startDate: event.startDate,
      endDate: event.endDate,
      isActive,
    });
  }
  return tiles;
}

function slugToDisplayName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function TennisTicketIntelligenceHomePage() {
  const { user } = await getAuthUser();
  const tiles = await getGrandSlamTiles();
  const ownsSeasonPass = user?.email ? await hasAnyActiveSeasonPass(user.email, "tennis") : false;
  const { isAnnual, currentPeriodEnd } = user?.email
    ? await getProDetails(user.email)
    : { isAnnual: false, currentPeriodEnd: null };
  const hasAnnualPro = isAnnual && currentPeriodEnd != null && currentPeriodEnd > new Date();

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <HomepageNav email={user?.email ?? null} />
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        <p className="text-sm font-black tracking-widest uppercase text-[#AAFF00] mb-4">
          Ticket Intelligence
        </p>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
          Which is the best Grand Slam ticket?
        </h1>
        <p className="text-[#A3A3A3] text-base mb-12 max-w-2xl">
          Pick your event. Answer 7 quick questions about how you actually want to watch — we&apos;ll match you
          against the best suited ticket experience at that Grand Slam.
        </p>

        <div className="grid lg:grid-cols-[1fr_300px] gap-14 items-start">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-4">
              {tiles.map((tile) =>
                tile.isActive ? (
                  <Link
                    key={tile.slug}
                    href={`/ticket-intelligence/tennis/${tile.slug}?from=picker`}
                    className="group rounded-sm border border-[#2A2A2A] bg-[#141414] overflow-hidden hover:border-[#AAFF00]/50 transition-colors"
                  >
                    <GrandSlamTileContent tile={tile} />
                  </Link>
                ) : (
                  <div
                    key={tile.slug}
                    className="relative rounded-sm border border-[#2A2A2A] bg-[#141414] overflow-hidden"
                  >
                    <span className="absolute top-3 right-3 z-10 rounded-sm bg-[#2A2A2A] text-[#A3A3A3] text-[10px] font-black uppercase tracking-widest px-2 py-1">
                      Coming Soon
                    </span>
                    <GrandSlamTileContent tile={tile} />
                  </div>
                )
              )}
            </div>
          </div>

          <div className="order-1 lg:order-2 rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
            <p className="text-xs font-black tracking-widest uppercase text-white mb-2">
              2027 Season Pass
            </p>
            {ownsSeasonPass ? (
              <>
                <p className="text-sm text-[#A3A3A3] mb-4">
                  You already have full 2027 Ticket Intelligence access — pick any event, your match unlocks
                  automatically, no separate payment.
                </p>
                <p className="text-sm font-black text-[#AAFF00]">✓ Season Pass active</p>
              </>
            ) : hasAnnualPro ? (
              <>
                <p className="text-sm text-[#A3A3A3] mb-4">
                  Your Annual Pro subscription unlocks Ticket Intelligence for every event ending before your
                  current billing period expires — pick any eligible event, your match unlocks automatically.
                </p>
                <p className="text-sm font-black text-[#AAFF00]">
                  ✓ Included with Annual Pro until {formatDate(currentPeriodEnd!)}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-[#A3A3A3] mb-4">
                  One payment, every 2027 Grand Slam event unlocked — no per-event US$10 charge.
                </p>
                <p className="text-2xl font-black text-white mb-4">
                  US$15
                  <LocalCurrencyHint baseAmount={15} baseCurrency="USD" />
                </p>
                {user?.email ? (
                  <>
                    <TennisSeasonPassCheckout label="Get Season Pass" />
                    <p className="text-xs text-[#6A6A6A] mt-3">
                      One-time purchase, sent to {user.email}.
                    </p>
                  </>
                ) : (
                  <>
                    <Link
                      href={`/sign-in?next=${encodeURIComponent("/ticket-intelligence/tennis")}`}
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

function GrandSlamTileContent({ tile }: { tile: GrandSlamTile }) {
  return (
    <>
      <div className="relative w-full aspect-[16/9] bg-[#1A1A1A]">
        {tile.heroImageUrl && (
          <Image
            src={tile.heroImageUrl}
            alt={tile.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
          />
        )}
      </div>
      <div className="p-4">
        <p className="text-sm font-black text-white mb-1">{tile.name}</p>
        {tile.startDate && tile.endDate && (
          <p className="text-xs text-[#6A6A6A] mb-3">{formatDateRange(tile.startDate, tile.endDate)}</p>
        )}
        {tile.isActive && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#AAFF00] group-hover:text-[#BBFF33] transition-colors">
            Find which ticket suits you →
          </span>
        )}
      </div>
    </>
  );
}
