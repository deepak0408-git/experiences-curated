// Extracted static prose from DayTripsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/bahrain-grand-prix/DayTripsSpoke.tsx), for the Full
// Pack PDF build. Prose half only, hand-copied not paraphrased.
//
// Real GetYourGuide affiliate links already provided by the founder (not
// constructed here) — carried through verbatim since they're static URLs,
// not DB-computed values.

export const bahrainGpDayTripsSpokeContent = {
  gentingHighlands: {
    label: "Genting Highlands",
    experienceSlug: "genting-highlands", // genting card, from dayTrips array
    body:
      "A cable-car resort at altitude — around 22°C by day, around 12°C at night. Casino access rules vary by nationality/religion. Genting Express bus runs RM11-15.",
    affiliateLink:
      "https://www.getyourguide.com/kuala-lumpur-l171/kuala-lumpur-genting-highlands-tour-with-awana-cable-car-t987863/?partner_id=HCNITTS&utm_medium=online_publisher",
  },

  putrajaya: {
    label: "Putrajaya",
    experienceSlug: "putrajaya", // putrajaya card, from dayTrips array
    body:
      "The Pink Mosque, built 1997-99. Non-Muslim visiting windows: Sat-Thu 9am-12:30pm / 2-4pm / 5:30-6pm; Friday is more restricted, 3-4pm / 5:30-6pm. Cruise Tasik Putrajaya has run since 2003.",
    affiliateLink:
      "https://www.getyourguide.com/kuala-lumpur-l171/kuala-lumpur-putrajaya-tour-with-traditional-boat-cruise-t209247/?partner_id=HCNITTS&utm_medium=online_publisher",
  },

  batuCaves: {
    label: "Batu Caves",
    experienceSlug: "batu-caves", // batuCaves card, from linkedExperiences
    body:
      "272 steps up to a 42.7m gold Lord Murugan statue. Temple Cave was dedicated in 1890. Main cave entry is free; the Dark Cave tour runs roughly RM35. Watch for macaques.",
    affiliateLink:
      "https://www.getyourguide.com/kuala-lumpur-l171/kuala-lumpur-suburbs-batu-caves-half-day-tour-with-pick-up-t236817/?partner_id=HCNITTS&utm_medium=online_publisher",
  },

  // Pro-gated verdict content, matching DayTripsSpoke.tsx's own
  // {isUnlocked && (...)} block.
  verdicts: [
    {
      label: "Which day trip we'd pick",
      body:
        "Batu Caves for a half-day. Putrajaya is the next-best half-day option. Genting Highlands is the pick for a full day and genuine heat relief.",
    },
    {
      label: "Timing around race sessions",
      body:
        "Work around the mosque's visiting windows at Putrajaya, get to Batu Caves before 9am to beat the heat and crowds, and save Genting for a weekday if possible.",
    },
  ],
};
