// Extracted static prose from GettingThereSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/mexico-city-grand-prix/GettingThereSpoke.tsx), for
// the Full Pack + Travel Brief PDF build. Prose half only, hand-copied not
// paraphrased. status="public" — no verdicts array.

export const mexicoCityGpGettingThereSpokeContent = {
  h1: "Metro Line 9 is the answer — but race day closes different stations than practice days",

  intro:
    "Metro is the reliable way in for both locals and visitors, and knowing the gate-to-station matching before you leave your hotel avoids an unnecessary walk around the venue perimeter.",

  fromAirport: {
    label: "Metro Line 9 — three stations, by gate",
    body:
      "Three Line 9 stations serve the circuit, each matched to different gates: Velódromo for Gate 1, Ciudad Deportiva for Gates 4-7, and Puebla for Gates 8, 9, and 12. Check your ticket for your assigned gate before you travel — Ciudad Deportiva tends to get named as \"the\" circuit station, but it's only the right choice for about half the gates.",
    facts: [
      { label: "Velódromo", value: "Gate 1" },
      { label: "Ciudad Deportiva", value: "Gates 4, 5, 6, 7" },
      { label: "Puebla", value: "Gates 8, 9, 12" },
    ],
  },

  raceDayClosures: {
    label: "Race day closes different stations",
    body:
      "On race day specifically, several Line 9 and Metrobús stations actually close — including Ciudad Deportiva, Puebla, and Pantitlán — a genuine, planned closure to manage crowd flow, not a malfunction. If you're travelling on race day itself, Velódromo becomes the reliable fallback regardless of your gate, since it stays open. Practice and qualifying days don't carry the same closures — the direct gate-matched station works fine on those days.",
  },

  rideshareTrap: {
    label: "The rideshare trap",
    body:
      "Uber and DiDi cannot get anywhere near the actual circuit gates on race weekend — road closures block them out entirely. Expect a driver to drop you several blocks short, with the final approach a slow walk through heavy foot traffic. If you use rideshare at all, plan the drop-off point in advance and budget real extra time for the walk-in.",
  },

  appsRow: {
    label: "Essential apps for the trip",
    items: [
      { name: "Metro CDMX (official app)", body: "Real-time service alerts including the race-day closures above — check before you leave your hotel, not after you're already at the platform." },
      { name: "Uber or DiDi", body: "Both operate widely across the city and are genuinely useful for getting between neighborhoods and restaurants — just not for the final approach to the circuit itself on race weekend." },
    ],
  },

  sourcesFooter: "",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "mexico-city-gp-getting-there-" (gettingThereGuide)
