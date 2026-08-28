// Extracted static prose from LuxurySpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/shanghai-masters/LuxurySpoke.tsx), for the Full
// Pack PDF build. Prose half only, hand-copied not paraphrased.

export const shanghaiMastersLuxurySpokeContent = {
  intro:
    "Luxury at the Shanghai Masters is a stack of decisions, not one purchase — the hospitality ticket is only one part of it. Here's what actually goes into a genuinely upscale week in Shanghai, before we get to the seating tier itself.",

  premiumTransit: {
    label: "Premium transit",
    body:
      "Transfeero publishes real fixed fares from Pudong (PVG) to central Shanghai: a Standard Sedan (Mercedes E-Class, BMW 5 Series or similar) starts from US$48, a First Class transfer (Mercedes S-Class, BMW 7 Series or similar) starts from US$96 — both include tolls, a 60-minute free wait for flight delays, and meet-and-greet at the baggage-hall exit. Journey time runs 45-70 minutes normally, 80-90 minutes during peak hours (weekday 7-10am or 4-8pm). Worth booking specifically for your arrival day or a hospitality-day transfer to Qizhong, since it removes any Metro-plus-shuttle planning entirely.",
  },

  offVenueLuxury: {
    label: "Off-venue luxury",
    name: "Flair, The Ritz-Carlton Shanghai, Pudong",
    rating: { value: "4.0", reviewCount: "208 Google reviews" },
    body:
      "The 58th floor of the Ritz-Carlton in the IFC Tower — China's tallest rooftop bar, with a split-level outdoor terrace giving a genuine dual view: the historic Bund on one side, the Pudong skyline (including the Pearl Tower close-up) on the other. Pan-Asian tapas-style dining across Japanese, Vietnamese, Indian, and Thai menus, plus a sushi and raw seafood bar. A real, distinctive Shanghai story, not a generic hotel rooftop.",
  },

  peninsulaBulgariNote:
    "The Peninsula and Bulgari carry that same skyline-and-history duality — one a faithful architectural return after a 75-year absence, the other a restoration project disguised as a hotel opening.",

  // Pro-gated content, matching LuxurySpoke.tsx's own {isUnlocked && (...)}
  // block.
  hospitalityPackage: {
    label: "ATP House Hospitality — the real numbers",
    name: "ATP House — single-day access",
    price: "US$2,367",
    detail:
      "Reserved sideline ticket, a guided behind-the-scenes tour, practice-court access, and an on-court photo experience — a genuinely different product from a Center Court ticket, not just a better seat. Booked via ATP Tour Experiences (atptourexperiences.com/shanghai-masters-2026).",
    priceNote:
      "Price confirmed directly from the official ATP Tour Experiences listing, 9 Aug 2026 — only one hospitality tier is currently published for this event, unlike some other Masters 1000 events that offer several. Reconfirm closer to the tournament, since pricing and inclusions can shift.",
  },

  verdicts: [
    {
      label: "Is it worth it over Center Court?",
      body:
        "Even at its most expensive — the semifinal and final, where Center Court climbs to its highest single-day price — a numbered Center Court seat still runs a small fraction of ATP House's price. If a great seat is genuinely all you want, Center Court is the sharper buy at any point in the tournament. ATP House earns its price on the things a seat alone can't give you: practice-court access most fans never get near, and a guided tour of parts of Qizhong that aren't otherwise open. Pick ATP House specifically if you want the behind-the-scenes access as part of the story, not just the match itself.",
    },
    {
      label: "A luxury day, sequenced",
      body:
        "Book a First Class Transfeero transfer for your hospitality-day arrival, giving yourself real margin before ATP House's guided tour. Afterward, Flair suits a celebratory dinner — its dual Bund/Pudong view and height above the city make it a genuine story to tell, not just a nice meal. It sits in Pudong, a short transfer if you're based centrally; if you've chosen a near-venue Minhang stay instead, budget real transfer time either way.",
    },
  ],

  sourcesFooter:
    "Sources: transfeero.com (private transfer pricing), therooftopguide.com and flairrooftopbarshanghai.com (Flair), atptourexperiences.com (ATP House pricing and inclusions), theluxurytravelexpert.com, hok.com, akaia.design, fashionnetwork.com, bulgarihotels.com. Google Places ratings verified 9-10 Aug 2026: Peninsula Shanghai (4.6, 213 reviews), Bulgari Hotel Shanghai (4.6, 214 reviews), Flair (4.0, 208 reviews). Verified 10 Aug 2026 — reconfirm hospitality pricing closer to the event.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "luxury-shanghai-peninsula-bulgari" (luxuryGuide)
