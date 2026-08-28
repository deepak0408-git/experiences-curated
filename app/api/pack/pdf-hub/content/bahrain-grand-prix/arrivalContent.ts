// Extracted static prose from ArrivalSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/bahrain-grand-prix/ArrivalSpoke.tsx), for the Full
// Pack + Travel Brief PDF build. Prose half only, hand-copied not
// paraphrased.

export const bahrainGpArrivalSpokeContent = {
  intro:
    "No published 2026 gate times yet — this is a relocated race, so historical Sepang gate times don't automatically apply. We won't invent a specific gate time; check official channels closer to race weekend.",

  arrivalStrategy: {
    label: "Reserved seating vs. general admission",
    body:
      "Reserved seating (Main Grandstand, K1, Grandstand F) and general admission (Hill Stand / C2) call for different arrival strategies — reserved seating holders have more flexibility on arrival time; general admission holders benefit from arriving earlier to claim good viewing spots.",
  },

  facilitiesHub: {
    label: "Food and facilities",
    body:
      "The Mall, behind Main Grandstand, is the main food/facilities hub. K1 has its own kiosk and prayer room. Grandstand F is furthest from facilities — bring your own food and water.",
  },

  midSessionBreak: {
    label: "Leaving mid-session",
    body:
      "Reserved seats are safe to leave and return to. Hill Stand general admission risks losing your ground if you leave.",
  },

  honestGapNote: {
    label: "We won't invent a gate time",
    body:
      "This is a relocated, first-in-9-years race — official 2026 gate times aren't published yet. We'll update this the moment they are, rather than guess.",
  },
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "hill-stand-c2" (hillstand) — its whatToAvoid field is rendered by
//     this spoke, needs live experience data.
