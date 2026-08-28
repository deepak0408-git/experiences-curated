// Extracted static prose from HotelsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/atp-finals/HotelsSpoke.tsx), for the Full Pack PDF
// build. Prose half only, hand-copied not paraphrased.

export const atpFinalsHotelsSpokeContent = {
  intro:
    "No hotel in Turin is walking distance from Inalpi Arena — the arena sits in the Santa Rita district, reached by tram, not on foot from the city's hotel districts. That means choosing where to stay is really about which part of central Turin suits your trip, not about arena proximity.",

  tramConnectionNote: {
    label: "Every hotel needs the tram connection",
    body:
      "Regardless of which area you pick, every route to Inalpi Arena runs through Sebastopoli tram stop (lines 4 and 10) — see the Getting There guide for the full journey.",
  },

  // Pro-gated verdict content, matching HotelsSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "Where we'd actually book",
      body:
        "If you're planning a Barolo or Langhe day trip, book near Porta Nuova station specifically — Grand Hotel Sitea or Royal Palace Hotel, both a 7-8 minute walk from the platform your day-trip train leaves from, removes a whole transit leg on your earliest, most time-pressured morning of the trip. If a day trip isn't on your itinerary, Principi di Piemonte's Alpine-arch views and central-square position are worth the trade-off — you lose nothing practical by choosing it over the station-district hotels.",
    },
    {
      label: "Booking timing",
      body:
        "Turin's central hotel stock is genuinely limited compared to a larger European capital — book as early as you've confirmed your ticket dates, since ATP Finals week creates real, concentrated demand across a relatively small number of central rooms.",
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "atp-finals-luxury-hotels" (luxuryHotels)
//   - "atp-finals-porta-nuova-neighborhood" (portaNuova)
