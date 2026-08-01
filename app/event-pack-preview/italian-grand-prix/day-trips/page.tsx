import type { Metadata } from "next";
import Link from "next/link";
import { getSpokeData } from "../_lib/getSpokeData";
import SpokeShell from "../_components/SpokeShell";

export const metadata: Metadata = {
  title: "Best Day Trips from Monza — Italian Grand Prix",
};

export default async function DayTripsSpoke() {
  const { dayTrips } = await getSpokeData();

  return (
    <SpokeShell
      status="teaser"
      h1="Best day trips from Monza"
      question="What are the best day trips from Monza?"
      ctaCopy="These are the 3 real options. The Event Pack tells you which one fits your actual trip length — Lake Como is genuinely scenic but a longer, more complicated commute best suited to extending into a proper holiday, not squeezing into three tight circuit days; the other two are easier to fit around race weekend itself."
    >
      <div className="flex flex-col gap-2">
        {dayTrips.map((e) => (
          <Link key={e.id} href={`/experience/${e.slug}`} className="block rounded-sm border border-[#2A2A2A] bg-[#141414] p-4 hover:border-[#AAFF00] transition-colors">
            <p className="text-sm font-bold text-white">{e.title}</p>
            <p className="text-xs text-[#6A6A6A] mt-1">{e.neighborhood}</p>
          </Link>
        ))}
      </div>
      <p className="text-xs text-[#6A6A6A] mt-6">
        Curated pick, not a database filter — these 3 aren&apos;t yet tagged as day-trip content in our system, a small
        data cleanup still to do.
      </p>
    </SpokeShell>
  );
}
