import Link from "next/link";
import type { Metadata } from "next";
import { getAuthUser } from "@/lib/supabase/server";
import HomepageNav from "@/app/_components/HomepageNav";
import { getCalendarEvents } from "@/lib/queries/calendar";
import CalendarEventList from "./_components/CalendarEventList";
import YearFilter from "./_components/YearFilter";

export const metadata: Metadata = {
  title: "2026-2027 Sports Calendar — Experiences | Curated",
  description: "Every Formula 1, Tennis, Golf, and Cricket date we cover for 2026-2027 — dates, venues, and full guides where they exist.",
  alternates: { canonical: "/calendar" },
};

const SPORTS: { key: string; label: string }[] = [
  { key: "formula_one", label: "Formula 1" },
  { key: "tennis", label: "Tennis" },
  { key: "golf", label: "Golf" },
  { key: "cricket", label: "Cricket" },
];

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ years?: string }>;
}) {
  const { years } = await searchParams;
  const yearList = years?.split(",").filter(Boolean).map(Number) ?? [];
  const { user } = await getAuthUser();
  const events = await getCalendarEvents(undefined, yearList);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <HomepageNav email={user?.email ?? null} />

      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12 flex-1 w-full">
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 text-balance">
          2026-2027 Sports Calendar — Formula 1, Tennis, Golf &amp; Cricket
        </h1>
        <p className="text-sm text-[#A3A3A3] mb-8 max-w-2xl">
          Every date on each sport&apos;s own official calendar, whether or not we&apos;ve built a guide for it yet.
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wide px-3.5 py-1.5 rounded-sm border bg-[#AAFF00] text-black border-[#AAFF00]">
              All
            </span>
            {SPORTS.map((s) => (
              <Link
                key={s.key}
                href={`/calendar/${s.key === "formula_one" ? "formula-1" : s.key}`}
                className="text-xs font-black uppercase tracking-wide px-3.5 py-1.5 rounded-sm border bg-[#141414] text-[#A3A3A3] border-[#2A2A2A] hover:border-[#AAFF00] hover:text-white transition-colors"
              >
                {s.label}
              </Link>
            ))}
          </div>
          <Link
            href="/#on-the-calendar"
            className="text-xs font-black text-[#AAFF00] hover:text-[#BBFF33] transition-colors whitespace-nowrap"
          >
            ← Available events
          </Link>
        </div>

        <div className="mb-10">
          <YearFilter />
        </div>

        <CalendarEventList events={events} jsonLdUrl="/calendar" />
      </div>
    </div>
  );
}
