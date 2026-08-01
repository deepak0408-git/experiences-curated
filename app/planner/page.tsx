import type { Metadata } from "next";
import { getAuthUser } from "@/lib/supabase/server";
import HomepageNav from "@/app/_components/HomepageNav";
import PlannerIntakeForm from "./_components/PlannerIntakeForm";
import { getOriginMarkets } from "./_lib/getOriginMarkets";

export const metadata: Metadata = {
  title: "Plan Your Trip — Experiences | Curated",
  description: "Wimbledon, Monza, The Ashes, Ryder Cup and more — tell us your sport, budget, and timing, and we'll help you plan your next bucket-list sports trip within budget.",
};

export default async function PlannerPage() {
  const { user } = await getAuthUser();
  const originMarkets = await getOriginMarkets();

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <HomepageNav email={user?.email ?? null} secondaryLink={{ href: "/planning-methodology", label: "Planning Methodology", mobileLabel: "Planning Method" }} />
      <PlannerIntakeForm originMarkets={originMarkets} />
    </main>
  );
}
