import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import HomepageNav from "@/app/_components/HomepageNav";
import ShortlistResults from "./_components/ShortlistResults";
import { getPlannerEvents } from "../_lib/getPlannerEvents";

export const metadata: Metadata = {
  title: "Your Shortlist — Experiences | Curated",
};

export default async function PlannerResultsPage({
  searchParams,
}: {
  searchParams: Promise<{
    sports?: string;
    budgetMin?: string;
    budgetMax?: string;
    timeWindow?: string;
    tripLengthDays?: string;
    originMarket?: string;
    tradeoff?: string;
  }>;
}) {
  const { sports, budgetMin, budgetMax, timeWindow, tripLengthDays, originMarket, tradeoff } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const events = await getPlannerEvents(Number(tripLengthDays ?? 0), originMarket ?? "unspecified");

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <HomepageNav email={user?.email ?? null} secondaryLink={{ href: "/planning-methodology", label: "Planning Methodology", mobileLabel: "Planning Method" }} />
      <ShortlistResults
        events={events}
        sports={sports?.split(",").filter(Boolean) ?? []}
        budgetMin={Number(budgetMin ?? 0)}
        budgetMax={Number(budgetMax ?? 0)}
        timeWindow={timeWindow ?? ""}
        tripLengthDays={Number(tripLengthDays ?? 0)}
        originMarket={originMarket ?? "unspecified"}
        userEmail={user?.email ?? null}
        initialTradeoffSlug={tradeoff ?? null}
      />
    </main>
  );
}
