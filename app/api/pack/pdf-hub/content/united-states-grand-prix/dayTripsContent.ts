// Extracted static prose from DayTripsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/united-states-grand-prix/DayTripsSpoke.tsx), for the
// Full Pack PDF build. Prose half only, hand-copied not paraphrased.
//
// Structural note (per source's own header comment): COTA sits inside
// Austin itself (~15-20 min from downtown), not a satellite venue — so this
// spoke covers both genuine out-of-town day trips (Hill Country/
// Fredericksburg, San Antonio) AND Austin's own in-city neighborhoods/
// entertainment (South Congress, Sixth/Rainey Street, Lady Bird Lake,
// Zilker/Barton Springs, live music, the Super Stage concerts). All 8
// linkedExperiences below map to this single spoke per founder agreement
// before the build — itinerary is reserved for the text-only hour-by-hour
// schedule, not standalone activity write-ups. Almost all body copy in
// this spoke lives in the linkedExperience cards themselves (no inline
// per-place prose in the free tier beyond the section intros) — flagged
// below where that applies.

export const usGpDayTripsSpokeContent = {
  h1: "A whole city to explore, plus two real out-of-town options",

  intro:
    "Circuit of the Americas sits inside Austin itself, a 15-20 minute drive from downtown — not a satellite venue that needs its own day-trip logic. That means the whole city is genuinely part of the trip, not a separate excursion, and there are two real out-of-town options worth an extra day if your schedule allows.",

  austinsOwnNeighborhoods: {
    label: "Austin's own neighborhoods",
    // FLAG: renders 4 experience cards (South Congress, Sixth/Rainey
    // Street, Lady Bird Lake, Zilker/Barton Springs) with no additional
    // inline prose in the spoke file itself.
  },

  builtInEntertainment: {
    label: "Race weekend's built-in entertainment",
    // FLAG: renders the Super Stage concerts card, no inline prose.
  },

  beyondFestivalStage: {
    label: "Beyond the festival stage",
    // FLAG: renders the Austin live music card, no inline prose.
  },

  twoOutOfTownOptions: {
    label: "Two real out-of-town options",
    intro:
      "Both sit about 80-90 minutes from Austin and offer genuinely different flavors — wine country versus colonial history — worth an extra day either before or after race weekend rather than a rushed half-day between sessions.",
    // FLAG: renders Hill Country/Fredericksburg and San Antonio cards, no
    // additional inline prose beyond the intro line above.
  },

  // Pro-gated verdict content, matching DayTripsSpoke.tsx's own
  // {isUnlocked && (...)} block. All static prose — no DB-computed values.
  verdicts: [
    {
      label: "Hill Country vs. San Antonio — which day gets which trip",
      body:
        "Both eat roughly the same 3 hours round trip, so the real decision is what kind of day you want, not which drive is shorter. Give Hill Country the day before the race weekend starts, not the day after — wine tastings and a slow Main Street walk are a genuinely better way to arrive relaxed than to decompress after three days of track noise and crowds, and William Chris Vineyards and Becker Vineyards (see the Hill Country guide) are both easy driving stops with no fixed schedule to hit. Give San Antonio the day after, if your trip allows a second extra day — the Alamo's timed Church entry ticket and the River Walk give you a defined few hours rather than an open-ended wine day, which suits a day when you're winding down rather than gearing up. If you only have one extra day total, San Antonio packs more into it: the Alamo and River Walk alone fill a real afternoon, and the four additional missions (free, no reservation) are a genuine half-day add-on if you want it, something Hill Country's wine-tasting pace doesn't offer. Don't try to squeeze either one between a morning and afternoon track session — the drive alone consumes the 3-hour round trip before you've done anything at the destination.\n\nWithin Austin itself, South Congress and Sixth/Rainey Street work well as a single evening — SoCo earlier for shopping and murals, Sixth Street later for the louder nightlife energy. Lady Bird Lake and Zilker/Barton Springs are the daytime counterpoint — genuinely active, and Barton Springs' constant 68-70°F water is worth the trip even on a scorching October afternoon.",
    },
    {
      label: "The one combination that genuinely doesn't fit in a day",
      body:
        "Don't pair a Hill Country or San Antonio day trip with a full Sixth/Rainey Street night the same evening. The math doesn't work: 90 minutes back from Fredericksburg or San Antonio, worse in Friday/Sunday race-weekend traffic on I-35 and US-290 (see the Getting There guide), lands you back in Austin around 6-7pm if you left the day trip by 4:30-5pm — which itself means cutting Hill Country's wine tastings short or skipping the fourth and fifth San Antonio missions. Arrive home that tired and a loud, standing-room Sixth Street night stops being fun fast. Give the day trip its own full day, evening included, and save Sixth/Rainey for a night when COTA itself is the only other thing on the schedule.",
    },
    {
      label: "Fitting Franklin's line around track sessions",
      body:
        "Franklin opens at 11am Tuesday-Sunday and typically sells out by 3-4pm — closed Mondays entirely, which rules it out on any Monday built into your trip. Arrival time maps directly to your place in line: 9:30am on a Saturday puts you around 40th, meaning roughly a 2-3 hour wait before you're served; serious regulars start arriving 6-7am specifically to beat that. Arrive after 1pm on a busy day and you're gambling on whether they sell out before you reach the counter at all. That means the only realistic way to do the line during race weekend is before an afternoon session, not after one — an early-morning arrival (6-7am) clears you by roughly 9-10am, well ahead of a 1-2pm session start, while a session that starts before 11am rules out Franklin that day entirely, since the restaurant isn't even open yet. If no morning on your trip has a 3+ hour gap before your session, skip the line altogether and use the 5-pound online pre-order pickup (see the Where to Eat guide) instead — it's the only way to get Franklin's food without betting against track timing.",
    },
  ],

  sourcesFooter: "Sources: visitfredericksburgtx.com, texashighways.com, thealamo.org, nps.gov, statesman.com.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "us-gp-south-congress" (southCongress) — Austin's own neighborhoods section
//   - "us-gp-sixth-rainey-street" (sixthRainey) — Austin's own neighborhoods section
//   - "us-gp-lady-bird-lake" (ladyBirdLake) — Austin's own neighborhoods section
//   - "us-gp-zilker-barton-springs" (zilker) — Austin's own neighborhoods section
//   - "us-gp-super-stage-concerts" (superStage) — Race weekend's built-in entertainment section
//   - "us-gp-austin-live-music" (liveMusic) — Beyond the festival stage section
//   - "us-gp-hill-country-fredericksburg" (hillCountry) — Two real out-of-town options section
//   - "us-gp-san-antonio-daytrip" (sanAntonio) — Two real out-of-town options section
