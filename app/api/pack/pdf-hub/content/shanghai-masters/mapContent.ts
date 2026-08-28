// Extracted static prose from MapSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/shanghai-masters/MapSpoke.tsx), for the Full Pack
// PDF build. Prose half only, hand-copied not paraphrased.
//
// Note: source spoke has no {isUnlocked && (...)} Pro-gated block — no
// `verdicts` field here, matches the source.

export const shanghaiMastersMapSpokeContent = {
  intro:
    "Qizhong is a genuinely large complex — 80 hectares, three showcourts, and dozens more practice and qualifying courts, built around a real \"forest sports city\" concept: 46% of the site is deliberately kept as green, open space rather than paved-over stadium footprint. Budget real walking time between courts — this isn't a compact European stadium.",

  roofNote: {
    label: "The roof, and why it's not just decoration",
    body:
      "Center Court's retractable roof is built from eight petal-shaped panels, each weighing two tons, modeled on Shanghai's official flower — the magnolia. It takes eight minutes to fully open or close, letting the tournament run matches indoors or outdoors depending on weather. Designed by Japanese architect Mitsuru Senda's firm, the venue was completed in October 2005 specifically for this tournament's move to Shanghai.",
  },

  siteLayout: {
    label: "Site layout",
    rows: [
      { label: "Center Court", value: "13,779 seats — the venue's magnolia-roof marquee court" },
      { label: "Grandstand 2", value: "5,000 seats, own retractable canopy" },
      { label: "Grandstand 3", value: "3,000 seats" },
      { label: "Court 17", value: "1,200-seat purpose-built practice stadium, opened 2025 — included with any Grounds Pass" },
      { label: "Other practice/qualifying courts", value: "Dozens more across the wider 80-hectare complex" },
    ],
  },

  facilities: {
    label: "Facilities inside the arena",
    foodAndDrink: {
      label: "Food and drink",
      body: "Concession stands and merchandise shops operate throughout the complex. Outside food and drink generally isn't allowed into ticketed sports venues in China — see the First-Timer's Guide for the full bag and prohibited-items policy.",
    },
    accessibility: {
      label: "Accessibility and re-entry — what's actually confirmed",
      body: "We couldn't find a genuinely primary source (an official venue or tournament page) confirming specific accessibility arrangements or a re-entry policy for this venue — the sources we found read as generic template content, not verified facts, so we're not passing them off as confirmed. If you need accessible seating or re-entry details, contact the tournament directly via en.rolexshanghaimasters.com ahead of your visit. See the Arrival guide for what we could confirm on gates and entry.",
    },
  },

  circuitMapImage: "shanghai-masters-venue-map.jpg",
  mapImageCredit: "Center Court map via ztmen.jussyun.com, the official Shanghai Masters ticketing platform.",

  awardNote: {
    label: "Internationally recognized",
    body:
      "Qizhong won the IOC/IAKS Silver Award in 2009, a real international recognition for exemplary sports and leisure facility design — a signal of how the venue was regarded architecturally well before the tournament's current scale.",
  },

  sourcesFooter:
    "Sources: Wikipedia (Qizhong Forest Sports City Arena — design, roof, size, green-space figures, IOC/IAKS award), sportsmatik.com, tennistours.com seating guide, ztmen.jussyun.com (venue map). Verified 10 Aug 2026.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "qizhong-center-court" (centerCourt)
//   - "qizhong-forest-sports-city-arena" (arena)
