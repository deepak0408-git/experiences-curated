// Extracted static prose from HotelsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/singapore-grand-prix/HotelsSpoke.tsx), for the
// Full Pack PDF build. Prose half only, hand-copied not paraphrased.

export const singaporeGpHotelsSpokeContent = {
  intro:
    "Marina Bay Street Circuit wraps around downtown Singapore, so unlike most Grand Prix venues, this genuinely is a three-way decision, not a default.",

  bookingWindows: {
    label: "Booking windows & contacts",
    hotels: [
      { name: "The Ritz-Carlton, Millenia", url: "https://www.booking.com/hotel/sg/the-ritz-carlton-millenia-singapore.html", note: "Request a track-facing or bay-facing room category specifically — the panoramic view is tied to specific rooms, not hotel-wide." },
      { name: "Pan Pacific Singapore", url: "https://www.booking.com/hotel/sg/panpacificsingapore.html", note: "Book early for race week — this is the relative value pick of the trackside three, and inventory sells out fast." },
      { name: "Swissotel The Stamford", url: "https://www.booking.com/hotel/sg/swissotelsingapore.html", note: "Ask about 65th-floor lounge access on higher floors — food and wine are included in the room rate at that tier." },
      { name: "Holiday Inn Express Clarke Quay", url: "https://www.booking.com/hotel/sg/holiday-inn-express-singapore-clarke-quay.html", note: "Book direct or via Booking.com — the district gets genuinely loud into the night, factor that in if an early practice session means you need real sleep." },
      { name: "Park Regis by Prince Singapore", url: "https://www.booking.com/hotel/sg/park-regis-singapore.html", note: "Newly renovated but thin-walled — request a corner or higher-floor room if noise from the corridor is a concern." },
      { name: "Aurum Royal (formerly The Scarlet)", url: "https://www.booking.com/hotel/sg/the-scarlet.html", note: "Rebranded from The Scarlet — older reviews elsewhere may still reference the old name. Check current room categories before booking." },
      { name: "Heritage Collection on Chinatown", url: "https://www.booking.com/hotel/sg/hometown-inn.html", note: "No elevator — factor that in if luggage or mobility is a concern. Request a skylight or windowed room category specifically." },
    ],
  },

  // Pro-gated verdict content, matching HotelsSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "Which base we'd pick",
      body:
        "For a first Singapore GP, Chinatown is the right call for most people — real neighbourhood character, two MRT lines to the circuit, at roughly half Marina Bay's trackside rates. Marina Bay only earns its premium if a genuine circuit view from your room matters to you specifically, ask for a track-facing room category when booking, it's not automatic. Clarke Quay is the pick if the nightlife itself is part of the draw, a short MRT ride (not a walk) from the circuit with a completely different evening on offer.",
    },
  ],

  sourcesFooter:
    "Sources: Google Maps (live ratings, linked from each hotel's own experience page), Booking.com (direct booking links). Verified 7 Aug 2026.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "singapore-gp-trackside-hotels" (trackHotels)
//   - "singapore-gp-clarke-quay-stay" (clarkeQuay)
//   - "singapore-gp-chinatown-stay" (chinatown)
