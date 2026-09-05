// Extracted static prose from LuxurySpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/united-states-grand-prix/LuxurySpoke.tsx), for the
// Full Pack PDF build. Prose half only, hand-copied not paraphrased.
//
// Structural note vs. Abu Dhabi's Luxury spoke: US GP's free-tier content
// is ALL static prose (hospitality ladder, premium transit, rooftop scene,
// hotel fact) with NO linkedExperience cards in the free section — Paddock
// Club and Champions Club cards are both GATED, appearing only inside
// {isUnlocked}. This differs from Abu Dhabi, where several free-tier
// linkedExperience cards existed (skybridge, yachtCharter, afterParties)
// outside the gate. Confirmed by re-reading the source: no
// SpokeExperienceCard call exists anywhere in the free-tier JSX here.

export const usGpLuxurySpokeContent = {
  h1: "A whole trip of luxury decisions, not one hospitality product",

  intro:
    "A luxury Austin GP weekend is a stack of decisions, not one purchase. Beyond the two named hospitality tiers, a genuinely luxury weekend here spans a real premium chauffeur market built specifically around race-weekend traffic, a downtown rooftop scene with genuine skyline views, and a hotel pick that goes beyond just booking the priciest room in town.",

  hospitalityLadder: {
    label: "A real hospitality ladder, not one price point",
    body:
      "F1 Experiences sells a genuine range at COTA, not a single hospitality product. Entry-level grandstand-view packages — Tower/Turn 12 Mid and F1 Experiences Live at Turn 4 Upper, Turn 12 Mid, or Turn 15 Mid — run roughly US$1,569 to US$2,521 for the 3-day weekend. The step up, F1 Experiences Lounge 3-Days (Trackside E/W), runs US$6,169. Above all of that sit two named hospitality tiers: the 300 Club Paddock Club, sitting directly above the team garages, and Champions Club, trackside with its own signature Grid Walk and a photo with the World Championship trophy. Both named tiers sold out for 2026 well ahead of race weekend — a real signal of how fast Austin's flagship American round moves compared to most other stops on the calendar. At the very top, F1 Experiences also sells a genuinely bespoke product — a Gordon Ramsay-hosted chef's table experience at the F1 Paddock, priced at US$24,356 for one, a category apart from every other tier here.",
  },

  premiumTransit: {
    label: "Premium transit — a real, race-specific market",
    body:
      "COTA's traffic reality (see the Getting There guide) makes a private chauffeur a genuine practical upgrade during race weekend, not just a comfort choice. Real published F1-weekend rates from an Austin-based operator: ATX Private Car Service runs $295/hour, all-in, though most F1-weekend bookings require an 8-hour daily minimum across a 3-day minimum booking — a real, if steep, way to remove the McAngus-lot rideshare problem entirely for the whole weekend.",
  },

  rooftopScene: {
    label: "Off-circuit — the rooftop scene",
    body:
      "Zanzibar, seven stories up at the Austin Marriott Downtown (already covered in the Hotels guide), gives a genuine downtown skyline view without needing to book a room there — a real, confirmed venue rather than generic nightlife filler, and a natural evening stop for anyone staying downtown or on South Congress during the weekend.",
  },

  luxuryHotelFact: {
    label: "One new luxury-hotel fact",
    body:
      "Hotel Magdalena's South Congress location — already the boutique pick in the Hotels guide — is worth knowing for one more reason here: its pool and lounge area is a genuine gathering spot for the SoCo crowd during race weekend, not just a hotel amenity. The full hotel breakdown, including all three picks and booking timing, lives in the Hotels guide.",
  },

  // Pro-gated content, matching LuxurySpoke.tsx's own {isUnlocked && (...)}
  // block. Paddock Club and Champions Club cards are both GATED here (not
  // free, unlike Abu Dhabi where after-parties/marina/skybridge were free
  // and only paddockClub itself was gated).
  verdicts: [
    {
      label: "The single biggest luxury decision: Paddock Club vs. Champions Club",
      body:
        "Paddock Club sells pit-lane proximity and a daily pit-stop walk — genuine mechanical access. Champions Club sells a signature moment instead: a Grid Walk and a professional photo with the World Championship trophy, from a trackside seat rather than above the garages. Neither is a discount version of the other — they're built around different reasons to spend the money.",
      // NOTE: two SpokeExperienceCard calls render immediately above this
      // paragraph in the source — see DB-derived section below.
    },
    {
      label: "Booking a future edition",
      body:
        "Both tiers sold out for 2026 well ahead of race weekend. Call F1 Experiences directly at +1.888.326.5430 for a future edition rather than waiting on the public web listing — repeat clients are typically offered early access before general sale opens, and a tier that shows \"sold out\" online has usually been unavailable through the standard channel for some time already.",
    },
  ],

  sourcesFooter: "Sources: f1experiences.com, atxprivatecarservice.com, therooftopguide.com.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards (BOTH gated, inside isUnlocked,
//   rendered before the "single biggest luxury decision" paragraph text):
//   - "us-gp-paddock-club" (paddockClub)
//   - "us-gp-champions-club" (championsClub)
// - No free-tier linkedExperiences cards on this spoke at all.
