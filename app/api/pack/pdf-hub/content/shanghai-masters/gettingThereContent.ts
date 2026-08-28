// Extracted static prose from GettingThereSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/shanghai-masters/GettingThereSpoke.tsx), for the
// Full Pack + Travel Brief PDF build. Prose half only, hand-copied not
// paraphrased.

export const shanghaiMastersGettingThereSpokeContent = {
  intro:
    "Qizhong sits roughly 27-30km southwest of central Shanghai, in Minhang District — far enough out that \"just take the metro\" isn't the whole answer the way it is at most Masters 1000 venues built inside a city core. Budget over an hour door-to-gate from most central hotels.",

  metroShuttle: {
    label: "By metro + tournament shuttle",
    body:
      "Take Metro Line 1 to Xinzhuang station, or Metro Line 5 to Zhuanqiao station. Neither is walkable from Qizhong — you need the tournament's own shuttle for the final leg, departing from Xinzhuang's South Square, stopping at Zhuanqiao, and terminating between Gates 1 and 2.",
    facts: [
      { label: "Shuttle fare", value: "¥2 per journey" },
      { label: "Journey time", value: "~45 min from Xinzhuang to the venue" },
      { label: "Outbound hours", value: "Roughly 11am-7pm Wed-Sat, 11am-4pm Sun (confirm 2026 timetable)" },
    ],
  },

  didi: {
    label: "By Didi",
    body:
      "Didi (China's dominant ride-hailing app) works with a foreign card and has an English interface. For a group of two or more, it's often comparable in total cost to the metro-plus-shuttle combination. Expect roughly ¥80-150 from central Shanghai depending on traffic — this is a genuine 45-minute-plus drive, so build real time into your schedule regardless of which option you pick.",
  },

  setupTip: {
    label: "Set up Didi before you land",
    body:
      "Download the app and link a foreign card before tournament week, not on the day — first-time card linking can take a few minutes and is easier with reliable wifi than curbside at the venue.",
  },

  sourcesFooter:
    "Sources: tennistours.com Shanghai Masters FAQ, koobit.com, thetennistribe.com, kkday.com Shanghai transport guide, chinafortravelers.com Didi guide. Shuttle schedule based on most recently reported tournament timetable — confirm exact 2026 times closer to the event.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "getting-to-qizhong-shanghai-masters" (transit)
