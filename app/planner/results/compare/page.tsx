import type { Metadata } from "next";
import { getAuthUser } from "@/lib/supabase/server";
import HomepageNav from "@/app/_components/HomepageNav";
import ComparisonView from "./_components/ComparisonView";
import { getPlannerEvents } from "../../_lib/getPlannerEvents";

export const metadata: Metadata = {
  title: "Compare Events — Experiences | Curated",
};

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{
    slugs?: string;
    sports?: string;
    budgetMin?: string;
    budgetMax?: string;
    timeWindow?: string;
    tripLengthDays?: string;
    originMarket?: string;
  }>;
}) {
  const { slugs, sports, budgetMin, budgetMax, timeWindow, tripLengthDays, originMarket } = await searchParams;
  const { user } = await getAuthUser();
  const events = await getPlannerEvents(Number(tripLengthDays ?? 0), originMarket ?? "unspecified");

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <HomepageNav email={user?.email ?? null} secondaryLink={{ href: "/planning-methodology", label: "Planning Methodology", mobileLabel: "Planning Method" }} />
      <ComparisonView
        events={events}
        slugs={slugs?.split(",").filter(Boolean) ?? []}
        userEmail={user?.email ?? null}
        intake={{
          sports: sports?.split(",").filter(Boolean) ?? [],
          budgetMin: Number(budgetMin ?? 0),
          budgetMax: Number(budgetMax ?? 0),
          timeWindow: (timeWindow as "next_3mo" | "next_6mo" | "next_9mo" | "flexible") ?? "flexible",
          tripLengthDays: Number(tripLengthDays ?? 0),
          originMarket: originMarket ?? "unspecified",
        }}
      />
    </main>
  );
}
