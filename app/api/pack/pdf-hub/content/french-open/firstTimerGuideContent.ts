// Extracted static prose from FirstTimerGuideSpoke.tsx (app/event-pack/
// [slug]/_hub-and-spoke/spokes/french-open/FirstTimerGuideSpoke.tsx), for
// the Full Pack PDF build. Prose half only, hand-copied not paraphrased.
// This spoke is status="public" with no {isUnlocked && (...)} block — no
// verdicts array (unlike US GP's version, which is gated). Many Roland-
// Garros first-timers are also first-time Paris visitors, so this spoke
// orients on both the tournament's own etiquette and the city's essential
// landmarks.

export const frenchOpenFirstTimerGuideSpokeContent = {
  intro:
    "Roland-Garros is often a first Paris trip as much as a first Grand Slam, so this orientation covers both: what makes the tournament itself different from Wimbledon or the US Open, and what to do with the city on the days the tennis doesn't fill.",

  whatMakesItDifferent: {
    label: "What makes this tournament different",
    items: [
      {
        title: "There's no formal spectator dress code — but there is a real fashion culture",
        body:
          "Unlike Wimbledon, Roland-Garros doesn't publish spectator dress rules. What it has instead is a genuine reputation as the most fashion-forward Grand Slam — the crowd treats it as a style occasion as much as a sporting one, especially on the show courts. Smart-casual with real polish reads right almost everywhere; hospitality areas specifically do require smart dress (no flip-flops, ripped jeans, or sports shorts).",
      },
      {
        title: "Clay-court tennis plays differently than what you've seen on TV",
        body:
          "The ball sits up higher and bounces slower on clay than on hard courts or grass, which means longer rallies and matches that can run well past three hours in the tournament's second week. If your only reference point is Wimbledon or the US Open, expect a genuinely slower, more physical style of tennis.",
      },
      {
        title: "Silence during points is enforced, not just polite",
        body:
          "No shouting or moving around during a point on the show courts — stewards genuinely enforce this, not just convention. Phones on silent, no flash photography during play. Once the point ends, react however you like.",
      },
    ],
  },

  commonMistakes: {
    label: "Mistakes most first-timers make",
    body:
      "Missing the December ballot window and assuming tickets can be bought any time closer to the tournament — see the Ticket Guide for the real calendar. Spending the whole day at one show court and skipping the outer courts and practice sessions — genuinely some of the best value in the whole tournament. Not bringing photo ID — you'll need it regardless of ticket type. Bringing alcohol expecting to bring it in — it's been banned inside the stadium since 2024. And treating Paris as an afterthought around the tennis rather than building in at least one full non-match day.",
  },

  nonMatchDay: {
    label: "What to do on a non-match day",
    intro:
      "For anyone whose Roland-Garros trip is also a first Paris trip, these two cover the essential version of the city.",
    // DB-derived: two experience cards rendered here (parisIcons,
    // parisLandmarks) — no additional inline prose per landmark exists in
    // this spoke file.
  },

  essentialApps: {
    label: "Essential apps",
    items: [
      {
        name: "Citymapper or the RATP app",
        body: "Real-time Métro/RER journey planning with live disruption — matters most in the hour either side of gates opening.",
      },
      {
        name: "The official Roland-Garros app",
        body:
          "Live order of play, scores, and a grounds map — genuinely useful for deciding which outside court to head to next on a Grounds Pass day. It also handles on-site meal preorders, which cuts real queue time at the food stands during peak sessions.",
      },
    ],
  },

  worthKnowingCallout: {
    label: "A few things worth knowing upfront",
    body:
      "The ballot is a real long shot for a specific date — build your plan around the March sales phase and the official resale marketplace, not a ballot win. A Grounds Pass is a genuinely great first-timer day, not a consolation prize. And the city around the tournament is half the reason to make this trip, not a distraction from it.",
  },

  sourcesFooter: "Sources: rolandgarros.com (dress culture, official app features), tatlerasia.com and racquetmag.com (dress culture).",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards ("What to do on a non-match day"
//   section):
//   - "paris-icons-eiffel-tower-seine-arc-de-triomphe" (parisIcons)
//   - "paris-landmarks-louvre-notre-dame" (parisLandmarks)
