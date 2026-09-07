// Extracted static prose from ArrivalSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/mexico-city-grand-prix/ArrivalSpoke.tsx), for the
// Full Pack + Travel Brief PDF build. Prose half only, hand-copied not
// paraphrased. status="public" — the "what we'd actually do" block is
// Pro-gated in source, kept as a single verdict entry.

export const mexicoCityGpArrivalSpokeContent = {
  h1: "Airport-style screening and a strict bag policy — pack light",

  intro:
    "Exact 2026 gate-opening times haven't been published yet — expect roughly 2-3 hours before each day's first session, based on the confirmed session schedule. Security here runs closer to an airport checkpoint than a typical sporting-event bag check, and knowing the rules before you pack saves a real confiscation at the gate.",

  shuttleRoutes: {
    label: "Metro to the circuit — three stations, by gate",
    body:
      "Metro Line 9 is the reliable way in, with three stations serving the circuit, each matched to different gates: Velódromo for Gate 1, Ciudad Deportiva for Gates 4-7, and Puebla for Gates 8, 9, and 12. Check your ticket for your assigned gate before you travel. On race day specifically, several Line 9 and Metrobús stations — including Ciudad Deportiva, Puebla, and Pantitlán — actually close to manage crowd flow; Velódromo stays open and becomes the reliable fallback regardless of your gate that day. Full route detail, plus the rideshare drop-off situation, is covered in the Getting There spoke.",
    facts: [
      { label: "Velódromo", value: "Gate 1 — stays open on race day" },
      { label: "Ciudad Deportiva", value: "Gates 4, 5, 6, 7 — closes race day" },
      { label: "Puebla", value: "Gates 8, 9, 12 — closes race day" },
    ],
  },

  ticketDelivery: {
    label: "Bag policy & security",
    body:
      "Bags are officially limited to roughly 10 x 15 x 30cm and should ideally be transparent. Every bag is subject to a search at the entrance, and thoroughness varies by gate and staff — budget extra time rather than assuming a quick wave-through. Chairs and seat cushions are explicitly prohibited, even for the concrete Foro Sol seating. Umbrellas are allowed only if small and non-pointed; professional camera lenses are capped at 300mm with a two-lens maximum.",
    facts: [
      { label: "Bag size", value: "~10 x 15 x 30cm, ideally transparent" },
      { label: "Chairs/cushions", value: "Prohibited, commonly confiscated" },
      { label: "Camera lenses", value: "Max 300mm, 2-lens limit" },
    ],
  },

  reEntryCallout: {
    label: "A confiscated item isn't returned",
    body:
      "This isn't security theater — a confiscated prohibited item is disposed of, not held for pickup, and repeat or serious violations can mean being denied entry entirely. Treat the list above as real rules to plan around.",
  },

  gettingToYourSeat: {
    label: "Leaving your seat mid-session",
    body:
      "In a reserved grandstand, your seat is yours for the session regardless of when you return. Foro Sol and general admission areas are different — there's no guaranteed return to the exact ground you claimed in an open zone, so treat a mid-session break as a real trade-off, especially in the hour before the race start when crowds around every entrance and food stand peak.",
  },

  // Pro-gated verdict content — matching ArrivalSpoke.tsx's {isUnlocked}
  // block exactly.
  verdicts: [
    {
      label: "What we'd actually do",
      body:
        "Arrive right as gates open on any day you genuinely care about your seat or sightline, especially at Foro Sol where good spots fill on merit rather than assigned arrival windows. On race day specifically — the single heaviest-traffic day of the weekend, with several Metro stations closing to manage crowd flow — build in real buffer time beyond what worked on practice or qualifying days.",
    },
  ],

  sourcesFooter: "",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "mexico-city-gp-arrival-queue-" (arrivalGuide)
