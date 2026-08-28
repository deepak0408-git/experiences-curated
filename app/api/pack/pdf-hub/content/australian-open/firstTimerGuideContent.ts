// Extracted static prose from FirstTimerGuideSpoke.tsx (app/event-pack/
// [slug]/_hub-and-spoke/spokes/australian-open/FirstTimerGuideSpoke.tsx),
// for the Full Pack PDF build. Prose half only, hand-copied not
// paraphrased.
//
// Note: source spoke has no {isUnlocked && (...)} Pro-gated block — no
// `verdicts` field here, matches the source.

export const australianOpenFirstTimerGuideSpokeContent = {
  intro:
    "If you know nothing else about the Australian Open before you go: it markets itself as the \"Happy Slam\" for a real reason, not just a slogan. The crowds are louder and more willing to get behind an underdog than at most Grand Slams, there's a genuine live-music program running alongside the tennis, and the whole event reads more like a summer festival than a formal tournament.",

  dayVsNight: {
    label: "Day session vs. night session",
    day: "Runs late morning through early evening, across every court. More matches, more players to see, real heat exposure — pack accordingly.",
    night: "Rod Laver Arena or Margaret Court Arena, from around 7pm — cooler, and often the tournament's most atmospheric session. Real risk of a very late finish.",
  },

  gateOpeningNote: {
    label: "Gates open ahead of the first match",
    body:
      "For day sessions, gates have most recently opened at 9:45am ahead of an 11am start — worth being through security with time to walk to your first court, not just arriving as play begins. For night sessions, gates have opened at 4:45pm ahead of the roughly 7pm start, so there's a real window to grab food and find your seat before the marquee match. These are the most recently confirmed times, not a locked-in 2027 schedule.",
  },

  mistakesNote: {
    label: "Mistakes most first-timers make",
    body:
      "Buying a single reserved seat for their whole trip and never using a Ground Pass — the outside courts on a Ground Pass day are where you actually get close to players, and skipping that entirely for one arena session misses most of what makes a first visit worth it. Underestimating the heat and treating sun protection as optional. Not checking which arena a match is actually in before planning a day around it — a Rod Laver reserved seat doesn't cover Margaret Court Arena, and assuming otherwise is one of the most common ticketing mix-ups. Booking a night session expecting an early finish. And skipping the AO Live program entirely because it sounds like a distraction from the tennis — it's included with your ticket and genuinely part of what makes this tournament different from the other three majors.",
  },

  essentialApps: [
    { label: "PTV / myki", body: "The official Victorian public transport app — journey planning, and the myki top-up you'll need for anything beyond the free match-day tram." },
    { label: "The official AO app", body: "Live order of play, match scores, and grounds maps — genuinely useful for deciding which outside court to head to next on a Ground Pass day." },
  ],

  aoLiveNote:
    "The AO Live program is a real part of what makes this tournament different from the other three majors — stages across Grand Slam Oval and Garden Square run throughout the day, included with any ground pass or higher ticket, alongside separately-ticketed headline shows at John Cain Arena.",

  whatToCarryNote: {
    label: "What to bring, what to leave behind",
    body:
      "Outside food and non-alcoholic drink is generally allowed in reasonable quantities — a real difference from many stadium sports. Check ausopen.com's current prohibited items list before you go, since bag-size and specific item rules are set and updated by the tournament each year.",
  },
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "first-timers-guide-etiquette-crowd-culture" (etiquetteGuide)
//   - "grand-slam-oval-party-live-music" (aoLive)
