"use client";

import { useState } from "react";
import GetStartedCards from "./GetStartedCards";
import NextOnCalendar from "./NextOnCalendar";
import PlanDeeperTiles from "./PlanDeeperTiles";
import GpSelectorModal from "./GpSelectorModal";
import type { CockpitEvent } from "../_lib/getCockpitEvents";

// Client wrapper so Next on the Calendar and Get Started Card 3 can share
// one GP selector modal instance — a calendar card click opens the SAME
// modal preselected to that event, not a second modal, per spec.
//
// CockpitMasthead and HowItWorks were removed from here 18 Nov 2026 (SEO
// investigation) — neither has any hooks or interactivity, but both were
// being forced into client-side rendering anyway just by sitting inside
// this "use client" tree, pushing the page's only real static h1/intro
// copy out of the server HTML and into the client JS bundle. They now
// render directly from app/formula-1/page.tsx instead; this component
// only wraps the pieces that genuinely need shared client state.
export default function FormulaOneCockpit({
  allEvents,
  nextFour,
  userEmail,
}: {
  allEvents: CockpitEvent[];
  nextFour: CockpitEvent[];
  userEmail: string | null;
}) {
  const [calendarPreselect, setCalendarPreselect] = useState<CockpitEvent | null>(null);

  return (
    <>
      <GetStartedCards events={allEvents} userEmail={userEmail} />
      <NextOnCalendar events={nextFour} onSelectEvent={setCalendarPreselect} />
      <PlanDeeperTiles />

      <GpSelectorModal
        open={calendarPreselect !== null}
        onClose={() => setCalendarPreselect(null)}
        events={allEvents}
        userEmail={userEmail}
        preselectedEventId={calendarPreselect?.id}
      />
    </>
  );
}
