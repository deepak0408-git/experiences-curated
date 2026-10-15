import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HomepageNav from "@/app/_components/HomepageNav";
import PostHogPageContext from "@/app/_components/PostHogPageContext";
import { getAuthUser } from "@/lib/supabase/server";
import { getCockpitF1Events, getNextFourF1Events } from "./_lib/getCockpitEvents";
import FormulaOneCockpit from "./_components/FormulaOneCockpit";

export const metadata: Metadata = {
  title: "F1 Travel Planning Cockpit — Experiences | Curated",
  description:
    "One place to discover, compare and plan your complete Grand Prix trip — Trip Intelligence, Trip Planner, Ticket Intelligence, Event Guides, Trip Board and Custom Itineraries, together.",
};

// Behind a feature flag, default OFF in production — Approved Phase 2
// Decision 5. Not enabled publicly until explicit approval; set
// SHOW_F1_COCKPIT=true in a preview/staging environment to test. Same
// pattern as the existing SHOW_PLANNER_TEASER flag (app/page.tsx).
export default async function FormulaOneCockpitPage() {
  if (process.env.SHOW_F1_COCKPIT !== "true") {
    notFound();
  }

  const { user } = await getAuthUser();
  const allEvents = await getCockpitF1Events();
  const nextFour = getNextFourF1Events(allEvents);

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <PostHogPageContext sport="formula_one" />
      <HomepageNav email={user?.email ?? null} hideSecondaryLink hideMyTravels />
      <FormulaOneCockpit allEvents={allEvents} nextFour={nextFour} userEmail={user?.email ?? null} />
    </main>
  );
}
