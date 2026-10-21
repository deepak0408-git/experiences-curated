"use client";

import { useState } from "react";
import CockpitMasthead from "./CockpitMasthead";
import HowItWorks from "./HowItWorks";
import GetStartedCards from "./GetStartedCards";
import NextOnCalendar from "./NextOnCalendar";
import PlanDeeperTiles from "./PlanDeeperTiles";
import EventSelectorModal from "./EventSelectorModal";
import type { CockpitEvent } from "../_lib/getCockpitEvents";

// Client wrapper so Next on the Calendar and Get Started Card 3 can share
// one event selector modal instance — a calendar card click opens the SAME
// modal preselected to that event, not a second modal. Mirrors
// app/formula-1/_components/FormulaOneCockpit.tsx.
export default function TennisCockpit({
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
      <CockpitMasthead />
      <HowItWorks />
      <GetStartedCards events={allEvents} userEmail={userEmail} />
      <NextOnCalendar events={nextFour} onSelectEvent={setCalendarPreselect} />
      <PlanDeeperTiles />

      <EventSelectorModal
        open={calendarPreselect !== null}
        onClose={() => setCalendarPreselect(null)}
        events={allEvents}
        userEmail={userEmail}
        preselectedEventId={calendarPreselect?.id}
      />
    </>
  );
}
