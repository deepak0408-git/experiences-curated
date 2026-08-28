// Extracted static prose from WhereToEatSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/shanghai-masters/WhereToEatSpoke.tsx), for the Full
// Pack PDF build. Prose half only, hand-copied not paraphrased.
//
// ANOMALY FLAGGED, NOT FIXED (per skill §2 — flag, don't silently correct):
// the source spoke's locked verdict ("What to actually order") names
// "Jian Guo 328" for hong shao rou and scallion noodles, but no
// `linkedExperiences.find(...)` lookup for a Jian Guo 328 experience exists
// anywhere in this source file (only xiaolongbao and
// frenchConcessionDining are looked up). This reads like a real content
// gap in the source itself — either a missing experience card or a
// leftover reference from an earlier draft — carried through verbatim
// here rather than silently removed or matched to the wrong experience.

export const shanghaiMastersWhereToEatSpokeContent = {
  intro:
    "Xiaolongbao is Shanghai's most famous dish, but real Shanghainese cooking is a much wider cuisine — braising, red-cooking, and a genuine sweetness in savoury dishes that surprises visitors expecting sharper Sichuan or Cantonese flavours. For soup dumplings, Nanxiang Mantou Dian trades on history inside the Yuyuan Bazaar, Jia Jia Tang Bao is the no-frills locals' favourite near People's Square, and Din Tai Fung offers zero-risk consistency if you want the same result every time. In the French Concession, Fu 1015 reworks Shanghainese classics inside a converted 1920s villa, while Ultraviolet — a single nightly table, 20 courses, one seating — is the trip's genuine special-occasion splurge if that's part of your plan.",

  // Pro-gated verdict content, matching WhereToEatSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "A Shanghai food day, sequenced",
      body:
        "Start with xiaolongbao at Jia Jia Tang Bao mid-morning, before the lunch queue builds — it's the locals' pick, genuinely good, and doesn't need a booking (if you want zero risk of an off day instead, Din Tai Fung is the safer bet). Save Nanxiang Mantou Dian for a weekday afternoon specifically, when the Yuyuan Bazaar queue thins out; weekend lunches there routinely run over an hour. Book Fu 1015 specifically for one relaxed evening in the French Concession — it's the pick for a genuinely good dinner without the single-seating pressure Ultraviolet carries.",
    },
    {
      label: "Booking timing that matters",
      body:
        "Fu 1015 and Ultraviolet both require advance booking — Ultraviolet often weeks ahead given its single nightly seating. If a special-occasion dinner is part of your trip, book it before you finalize other logistics, not as an afterthought once you land.",
    },
    {
      label: "What to actually order",
      body:
        "At any xiaolongbao stop, order the classic pork basket first — it's the dish these places are actually known for, before branching into crab-roe or other variations. At Jian Guo 328, the two dishes locals keep coming back for are hong shao rou (red-braised pork, the defining flavour of Shanghainese home cooking — a genuine sweetness alongside the savoury braise) and the scallion noodles, a simpler, cheaper dish that's worth ordering specifically rather than skipping in favour of the fancier options on the menu.",
    },
  ],

  sourcesFooter: "Sources: shanghaitourism.org, tripadvisor.com, wanderinchina.com, rachelgouk.com, corner.inc.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "xiaolongbao-shanghai-guide" (xiaolongbao)
//   - "french-concession-dining-shanghai" (frenchConcessionDining)
//   - NOTE: no "Jian Guo 328" lookup exists in the source — see anomaly
//     flag above.
