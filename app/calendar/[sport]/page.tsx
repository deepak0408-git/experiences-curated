import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAuthUser } from "@/lib/supabase/server";
import HomepageNav from "@/app/_components/HomepageNav";
import { getCalendarEvents } from "@/lib/queries/calendar";
import CalendarEventList from "../_components/CalendarEventList";
import YearFilter from "../_components/YearFilter";

// URL slugs (design doc: /calendar/formula-1, /calendar/tennis, etc.) don't
// match the sportEnum's DB values 1:1 (formula_one has an underscore) — this
// map is the single place that translates between the two.
const SPORT_SLUGS: Record<string, { enumValue: string; label: string }> = {
  "formula-1": { enumValue: "formula_one", label: "Formula 1" },
  tennis: { enumValue: "tennis", label: "Tennis" },
  golf: { enumValue: "golf", label: "Golf" },
  cricket: { enumValue: "cricket", label: "Cricket" },
};

const ALL_SPORTS = Object.entries(SPORT_SLUGS);

// Scope notes shown under the intro line for sports where this calendar
// deliberately doesn't list every fixture on that sport's full tour
// calendar — confirmed with the founder 8 Aug 2026 (golf: majors + Ryder/
// Presidents Cup + marquee Rolex Series only, not the ~37-event PGA Tour
// regular season or ~40-event DP World Tour schedule). Omitted for sports
// with no such narrowing (F1: every points-paying round is shown).
const SCOPE_NOTES: Partial<Record<string, string>> = {
  golf: "Includes: the Masters, PGA Championship, U.S. Open, The Open, the Ryder Cup or Presidents Cup (whichever falls this year), and the marquee Rolex Series events — not the full PGA Tour or DP World Tour regular-season schedule.",
  tennis: "Includes: the 4 Grand Slams, all 9 ATP Masters 1000 events, the Laver Cup, and the Nitto ATP Finals — not the full ATP Tour season of 500 and 250 events.",
  cricket: "Includes: the Ashes, ICC men's World Cups, and the major international tours we cover — not every bilateral series between every cricket-playing nation.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sport: string }>;
}): Promise<Metadata> {
  const { sport } = await params;
  const entry = SPORT_SLUGS[sport];
  if (!entry) return {};
  return {
    title: `${entry.label} 2026-2027 Calendar — Experiences | Curated`,
    description: `Every ${entry.label} event on the official 2026-2027 calendar — dates, venues, and full guides where they exist.`,
    alternates: { canonical: `/calendar/${sport}` },
  };
}

export default async function CalendarSportPage({
  params,
  searchParams,
}: {
  params: Promise<{ sport: string }>;
  searchParams: Promise<{ years?: string }>;
}) {
  const { sport } = await params;
  const entry = SPORT_SLUGS[sport];
  if (!entry) notFound();

  const { years } = await searchParams;
  const yearList = years?.split(",").filter(Boolean).map(Number) ?? [];
  const { user } = await getAuthUser();
  const events = await getCalendarEvents(entry.enumValue, yearList);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <HomepageNav email={user?.email ?? null} />

      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12 flex-1 w-full">
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 text-balance">
          {`${entry.label} 2026-2027 Calendar`}
        </h1>
        <p className={`text-sm text-[#A3A3A3] max-w-2xl ${SCOPE_NOTES[sport] ? "mb-2" : "mb-8"}`}>
          {`Every ${entry.label} event on the official 2026-2027 calendar, whether or not we've built a guide for it yet.`}
        </p>
        {SCOPE_NOTES[sport] && (
          <p className="text-xs text-[#6A6A6A] mb-8 max-w-2xl">{SCOPE_NOTES[sport]}</p>
        )}

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Link
            href="/calendar"
            className="text-xs font-black uppercase tracking-wide px-3.5 py-1.5 rounded-sm border bg-[#141414] text-[#A3A3A3] border-[#2A2A2A] hover:border-[#AAFF00] hover:text-white transition-colors"
          >
            All
          </Link>
          {ALL_SPORTS.map(([slug, s]) => (
            <Link
              key={slug}
              href={`/calendar/${slug}`}
              className={`text-xs font-black uppercase tracking-wide px-3.5 py-1.5 rounded-sm border ${
                slug === sport ? "bg-[#AAFF00] text-black border-[#AAFF00]" : "bg-[#141414] text-[#A3A3A3] border-[#2A2A2A] hover:border-[#AAFF00] hover:text-white"
              } transition-colors`}
            >
              {s.label}
            </Link>
          ))}
        </div>

        <div className="mb-10">
          <YearFilter />
        </div>

        <CalendarEventList events={events} jsonLdUrl={`/calendar/${sport}`} />
      </div>
    </div>
  );
}
