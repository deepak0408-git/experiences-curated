// Extracted static prose from WhereToEatSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/bahrain-grand-prix/WhereToEatSpoke.tsx), for the
// Full Pack PDF build. Prose half only, hand-copied not paraphrased.

export const bahrainGpWhereToEatSpokeContent = {
  intro:
    "Kuala Lumpur's hawker culture blends Malay, Chinese, Indian, and Peranakan food traditions — two real picks worth building a meal around.",

  jalanAlor: {
    label: "Jalan Alor",
    experienceSlug: "jalan-alor", // jalanAlor card
    body:
      "Wong Ah Wah is the 70-year BBQ wings anchor of the street. Open 5pm-4am, RM5-15, cash only.",
  },

  oldChinaCafe: {
    label: "Old China Cafe",
    experienceSlug: "old-china-cafe", // oldChinaCafe card
    body:
      "A 1920s shophouse serving Peranakan/Nyonya cuisine. Open 11am-10pm, kitchen closes 9:15pm.",
  },

  // Pro-gated verdict content, matching WhereToEatSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "What to order",
      body:
        "Order the Devil curry or Nyonya nasi lemak at Old China Cafe. Beyond the famous wings at Jalan Alor, try Uncle Lim Pan Mee, Alor Corner, and Sister Drunken Chicken Noodles.",
    },
  ],

  bookingTimingNote: {
    label: "Booking timing",
    body:
      "Old China Cafe needs a reservation — limited heritage seating. Jalan Alor never does.",
  },
};
