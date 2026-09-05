// Extracted static prose from ArrivalSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/united-states-grand-prix/ArrivalSpoke.tsx), for the
// Full Pack + Travel Brief PDF build. Prose half only, hand-copied not
// paraphrased. Real shuttle pricing/schedule facts below are static, as
// hardcoded in the source JSX — extracted verbatim per the task brief.

export const usGpArrivalSpokeContent = {
  h1: "Gates open early — here's what to expect on arrival",

  intro:
    "COTA hasn't published exact 2026 gate-opening times as of this guide. Based on the pattern in recent race weekends, expect gates to open roughly 9:00-10:00am each day of the 23-25 October weekend — confirm exact times via the official COTA app closer to race week. What's already reliable is the shuttle schedule and the ticket-delivery mechanics below.",

  shuttleRoutes: {
    label: "Two official shuttle routes",
    body:
      "The Downtown shuttle picks up at Waterloo Park/Moody Amphitheater on Red River Street and drops off right outside the Grand Plaza gates on COTA Boulevard — a 3-day pass runs US$172.03, a single day US$68.31. The Northeast Austin shuttle runs from the Travis County Expo Center (enter via Gate 1 off Decker Lane, near US-290/183 and the 130 Tollway), with a free parking lot and air-conditioned buses — a 3-day pass runs US$102.88, a single day US$45.26. Both routes run continuously starting 60 minutes before gates open each day; the last inbound shuttle departs 2pm on Sunday and 6:30pm Friday/Saturday, with return service ending 60 minutes after the music ends on concert nights. Buy your pass ahead of time — these sell out, and this isn't a walk-up option on race morning.",
  },

  ticketDelivery: {
    label: "Ticket delivery — digital, not physical (mostly)",
    body:
      "Every reserved-seat grandstand ticket (Main Grandstand, Turn 1, Turn 15) is digital-only, delivered through the official app closer to race weekend — download it and load your ticket before you leave the hotel. General Admission is the one real exception: those wristbands are physically mailed 4-6 weeks ahead, not issued digitally, so confirm your shipping address is current if you're buying GA.",
  },

  gettingToYourSeat: {
    label: "Getting to your seat once you're inside",
    body:
      "COTA is a large circuit — budget real walking time between the gates and your specific grandstand, especially for Turn 1 and Turn 15, which sit well away from the main entrance. If you're on a General Admission ticket, popular spots (Turn 1 especially) fill in fast enough on race morning that arriving well before gates open matters more than for any reserved-seat tier.",
  },

  midSessionBreak: {
    label: "Leaving your seat mid-session",
    body:
      "Whether stepping out for food or the restroom costs you your spot depends entirely on your ticket type. In a reserved grandstand (Main, Turn 1, Turn 15), your seat is yours for the session regardless of when you return — a break doesn't cost you your view. General Admission is a genuine grounds pass with no assigned or reserved location, so there's no official guarantee you'll get the exact patch of hill or fence-line back once you leave it — treat a mid-session break as a real trade-off, and bring water and snacks in with you rather than planning to step out, especially at Turn 1 in the hour before the race start when the crowd is at its densest.",
  },

  reEntryCallout: {
    label: "Re-entry, if you leave the grounds entirely",
    body:
      "Re-entry is permitted the same day, but your ticket has to be scanned out at the gate before you leave — skip that step and you may not be able to scan back in. Expect a second security screening on the way back in too, so budget real time for it, not just the walk.",
  },

  // Pro-gated verdict content, matching ArrivalSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "What we'd actually do",
      body:
        "For race day specifically — the single heaviest-traffic day of the weekend — book the Downtown shuttle over driving yourself if you're staying centrally; the drop-off right at the Grand Plaza gates beats the walk from any COTA-run parking lot, and it removes the parking-sellout risk (see the First-Timer Guide) entirely. If you're on General Admission and Turn 1 is your target spot, treat gate-opening time as a hard deadline, not a suggestion — arrive at the gate itself, not just at COTA, by the time it opens, since the walk from the shuttle drop-off or parking lot to Turn 1 already eats into that early-arrival advantage.",
    },
  ],

  sourcesFooter: "Sources: help.thecircuit.com, circuitoftheamericas.com (shuttle pricing and schedule), kvue.com, kxan.com.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "us-gp-general-admission" (generalAdmission)
