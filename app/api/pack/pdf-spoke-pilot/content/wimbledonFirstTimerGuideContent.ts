// Extracted static prose from FirstTimerGuideSpoke.tsx (app/event-pack/
// [slug]/_hub-and-spoke/spokes/wimbledon/FirstTimerGuideSpoke.tsx), for the
// Full Pack PDF port. This is the prose half only — hand-copied out of the
// JSX, not paraphrased. Nothing DB-computed is duplicated here; see the
// "DB-derived data" comment block at the bottom for what the PDF route
// needs to wire up itself via getSpokeData().
//
// Note: FirstTimerGuideSpoke.tsx has NO {isUnlocked && (...)} Pro-gated
// block — status="public", the whole spoke is free. No `verdicts` field in
// this file for that reason (matches the source; not an omission).

export const wimbledonFirstTimerGuideSpokeContent = {
  intro:
    "Wimbledon carries more tradition and unwritten etiquette than any other Grand Slam, and almost all of it is genuinely manageable once you know it going in. Here's the orientation that makes the rest of the pack make sense.",

  traditions: {
    label: "Traditions worth knowing before you go",
    items: [
      {
        label: "All-white is a players-only rule — not a dress code for you",
        body:
          "Wimbledon's famously strict all-white clothing rule applies to competitors on court, not spectators — a genuinely common first-timer confusion. There's no official spectator dress code beyond a short banned list (no torn jeans, running vests, dirty trainers, or sports shorts). Centre Court and No. 1 Court skew smarter as the tournament goes on, especially finals weekend — smart-casual (a lightweight shirt or dress, chinos, clean trainers) reads right everywhere on the grounds.",
      },
      {
        label: "The Royal Box is invite-only, and the bowing tradition is mostly retired",
        body:
          "The Royal Box on Centre Court has hosted guests since 1922 — royals, heads of government, and other invited figures — and there's no public route to a seat in it. Players bowing or curtsying toward the box was standard until 2003; today it only happens if the monarch or the Prince of Wales is actually present, so don't expect to see it on a typical day.",
      },
      {
        label: "Henman Hill has had three other names in the last decade",
        body:
          "The grassy bank by the big screen changes nickname with whichever British player is deep in the draw — Murray Mound, Draper's Drop, Raducanu Ridge have all stuck at different points. Officially it's just the Aorangi Terrace; the crowd renames it, not the AELTC.",
      },
      {
        label: "The grounds run quiet during points, not between them",
        body:
          "No shouting or moving around during a point — genuinely enforced by stewards on the show courts, not just polite convention. Once the point ends, react however you like. Phones go on silent near any court, flash photography is never allowed during play.",
      },
    ],
  },

  mistakesBox: {
    label: "Mistakes most first-timers make",
    body:
      "Under-planning the Queue's real start time — 4-5am arrivals aren't rare for a good position, and the first Tube and rail services of the day don't run that early, so factor in how you'll actually get there. Not downloading the Wimbledon App before travelling — tickets are managed digitally and you'll want it working before you're relying on grounds wifi. Skipping outer-court tennis entirely to camp near Centre Court all day — some of the tightest, most competitive matches of the whole Fortnight happen on Courts 3, 12, and 18 in the first week, and you'll miss them. Not bringing photo ID — you'll need it on the day regardless of ticket type. And treating the whole day as one long sit at a single court: build in time to just walk the grounds and take in the atmosphere, which is genuinely part of what people come back for.",
  },

  gateRules: {
    label: "What's not allowed through the gates",
    body:
      "One bag per person, max 40cm × 30cm × 30cm — hard-sided cases, cool-boxes, and picnic hampers aren't allowed regardless of size. Cameras with a standard lens are fine; anything over 300mm, plus tripods, monopods, and selfie sticks, are not. Alcohol is allowed within real limits (see the Weather guide for the exact figures) — you don't need to leave it behind entirely.",
    crossLink: "See the full Weather guide.",
  },

  gatesOpen: {
    label: "Gates open at 10:30am daily",
    body:
      "Queue cards are issued from mid-afternoon the day before — one per person present, so the whole party needs to be there to be counted. Day tickets are released to queuers at 9:30am, ahead of the 10:30am gate opening.",
  },

  worthKnowingBox: {
    label: "A few things worth knowing upfront",
    body:
      "Centre Court tickets are harder than the ballot suggests — accept it early and you'll have a better trip. Queue camping is worth doing once. SW19 is a better base than central London. Read this pack as briefing notes from someone who's been going for years, not a category list.",
  },

  sourcesFooter: "Sources: wimbledon.com (dress code, Queue guidance, gate times), ESPN and Keith Prowse (traditions, dress code history).",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug), same as CostSpoke's pattern:
// - linkedExperiences lookups for cards rendered via generic
//   <SpokeExperienceCard>, no inline description text in the spoke file:
//   - "preparing-for-your-wimbledon-visit" ("Preparing for Your Wimbledon
//     Visit") — needs live experience data, not extracted here.
//   - "the-wimbledon-queue" ("The Wimbledon Queue") — needs live
//     experience data, not extracted here.
