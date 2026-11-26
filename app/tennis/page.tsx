import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HomepageNav from "@/app/_components/HomepageNav";
import PostHogPageContext from "@/app/_components/PostHogPageContext";
import { getAuthUser } from "@/lib/supabase/server";
import { getCockpitTennisEvents, getNextFourTennisEvents } from "./_lib/getCockpitEvents";
import CockpitMasthead from "./_components/CockpitMasthead";
import HowItWorks from "./_components/HowItWorks";
import TennisCockpit from "./_components/TennisCockpit";

export const metadata: Metadata = {
  title: "Tennis Travel Planning Cockpit — Experiences | Curated",
  description:
    "One place to discover, compare and plan your complete tennis trip — Trip Intelligence, Trip Planner, Ticket Intelligence, Event Guides, Trip Board and Custom Itineraries, together.",
  alternates: {
    canonical: "/tennis",
  },
};

// Behind a feature flag — SHOW_TENNIS_COCKPIT=true in Vercel. Live in
// production as of 26 Nov 2026 (confirmed via direct HTTP check + sitemap
// inclusion). Same pattern as the existing SHOW_F1_COCKPIT flag
// (app/formula-1/page.tsx).
export default async function TennisCockpitPage() {
  if (process.env.SHOW_TENNIS_COCKPIT !== "true") {
    notFound();
  }

  const { user } = await getAuthUser();
  const allEvents = await getCockpitTennisEvents();
  const nextFour = getNextFourTennisEvents(allEvents);

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <PostHogPageContext sport="tennis" />
      <HomepageNav email={user?.email ?? null} hideSecondaryLink hideMyTravels />
      {/* Rendered directly here (not inside TennisCockpit's client tree)
          so this page's h1/intro copy ships in the server HTML — see
          TennisCockpit.tsx's header comment, 18 Nov 2026. */}
      <CockpitMasthead />
      <HowItWorks />
      <TennisCockpit allEvents={allEvents} nextFour={nextFour} userEmail={user?.email ?? null} />
    </main>
  );
}
