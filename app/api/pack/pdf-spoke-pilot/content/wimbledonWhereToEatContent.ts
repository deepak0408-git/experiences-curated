// Extracted static prose from WhereToEatSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/wimbledon/WhereToEatSpoke.tsx), for the Full Pack
// PDF port. This is the prose half only — hand-copied out of the JSX, not
// paraphrased. Nothing DB-computed is duplicated here; see the "DB-derived
// data" comment block at the bottom for what the PDF route needs to wire up
// itself via getSpokeData().
//
// Same shape as the Cost pilot (wimbledonCostContent.ts) — one module per
// event/spoke, prose keyed by section, verdicts kept as a separate
// Pro-gated array matching WhereToEatSpoke.tsx's own {isUnlocked && (...)}
// block.
//
// Flag: the intro states strawberries-and-cream is "£2.85 for a portion...
// up from £2.50 in 2024 and £2.70 in 2025" — copied verbatim from the
// source spoke, which itself notes it corrected a stale £2.50 figure on
// 15 Aug 2026. Not altered here even though the pricing history reads a
// little unusual (two rises in consecutive years) — that's the source
// file's own claim, left as-is per the verbatim-extraction instruction.

export const wimbledonWhereToEatSpokeContent = {
  intro:
    "The strawberries first: yes, get them. The Wimbledon strawberries-and-cream ritual is worth doing once for the ritual alone, queue included — £2.85 for a portion, picked before dawn (up from £2.50 in 2024 and £2.70 in 2025, so expect another small rise by the time you go). After that, the real food question is how to eat well around the tournament without overpaying or ending at a chain on the Broadway.",

  onGroundsTactics: {
    label: "Eating on the grounds — the real tactics",
    shortestQueue: {
      label: "Shortest strawberries queue",
      body:
        "The main stalls run a genuine queue through peak afternoon hours (roughly 8 minutes at busiest). Go straight after gates open, or after 5pm — by late afternoon much of the day's early crowd has either left or is heading out, and the line moves noticeably faster.",
    },
    henmanHill: {
      label: "Eating on Henman Hill",
      body:
        "You don't need to leave the Hill for either ritual — it has its own Pimm's tent, and strawberries and cream can be carried straight up. Bring your own picnic food too (no alcohol from outside, no glass) rather than queueing twice for both a match view and a meal.",
    },
  },

  pimms: {
    label: "Pimm's",
    body:
      "A Wimbledon fixture since 1971; official stalls are scattered across the grounds, not just on the Hill. No glass and no alcohol brought in from outside the grounds — check the AELTC website for the current year's rules before packing if you want to bring your own.",
  },

  villagePicksLabel: "Two real village picks",

  sourcesFooter: "Sources: wimbledon.com (on-grounds food and drink), theblacklamb-restaurant.com.",

  // Pro-gated verdict content — only included in Full Pack mode, matching
  // WhereToEatSpoke.tsx's own {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "Where we'd actually book",
      body:
        "Both are real village pubs rather than tournament-adjacent chains — pick whichever fits the night. The Black Lamb runs live jazz from 7pm on Wednesdays, worth timing a booking around if you want the fuller atmosphere; tables from 7pm onward get a genuine two-hour sitting, versus 90 minutes for anything booked before 6:45pm. If the set menu shows sold out for your date online, call the restaurant directly on 020 8947 8278 — during the Fortnight they sometimes hold back a small number of tables that never make it onto the online booking system.",
      // Flag: this phone number is copied verbatim from the source spoke.
      // Left as-is per the verbatim-extraction instruction — not verified
      // independently in this extraction pass.
    },
    {
      label: "Booking timing",
      body:
        "Village tables fill fast on the biggest match days (Middle Saturday, semi-finals, finals weekend) — book at least two weeks ahead for any evening sitting during the Fortnight, and earlier still for those specific nights, especially if the day's play has run long and the whole grounds crowd is looking for dinner at once.",
    },
  ],
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug), same as CostSpoke's pattern:
// - linkedExperiences lookups for cards rendered via generic
//   <SpokeExperienceCard>, no inline description text in the spoke file:
//   - "wimbledon-eating" ("Wimbledon Eating" — the on-grounds eating
//     experience) — needs live experience data, not extracted here.
//   - "dinner-at-the-crooked-billet" ("Dinner at the Crooked Billet") —
//     needs live experience data, not extracted here.
//   - "dinner-at-the-black-lamb" ("Dinner at the Black Lamb") — needs
//     live experience data, not extracted here.
