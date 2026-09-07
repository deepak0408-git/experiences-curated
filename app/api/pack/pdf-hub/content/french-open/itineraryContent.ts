// Extracted static prose from ItinerarySpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/french-open/ItinerarySpoke.tsx), for the Full Pack
// PDF build. Prose half only, hand-copied not paraphrased.
//
// Structural note — differs from US GP's Itinerary spoke, which has no
// isUnlocked gate at all: French Open's Itinerary spoke is status="teaser"
// with a real free/gated split. The "shape of the tournament" DayCard list
// is free; the two verdict paragraphs AND the full 6-day hour-by-hour
// itinerary tables all sit inside the same {isUnlocked && (...)} block —
// all extracted into `verdicts` (2 prose entries) + `hourByHour` (gated)
// below, matching the source's real gate placement.

export const frenchOpenItinerarySpokeContent = {
  h1: "How the tournament actually unfolds, day by day",

  intro:
    "Roland-Garros runs a single-elimination draw across two weeks, and the character of the grounds shifts sharply as the tournament narrows — the same clay, a genuinely different atmosphere depending on which day you're there.",

  // Free-tier — "The shape of the tournament" DayCard list.
  shapeOfTournament: {
    label: "The shape of the tournament",
    days: [
      { day: "Opening days", detail: "Seeded players are on Chatrier and Lenglen from day one, but the outer courts are where the draw genuinely opens up — ranked professionals in first-round matches you can walk right up to, plus the best morning practice-court access of the whole tournament." },
      { day: "First-week weekdays", detail: "Quietly the best days to be there. A Grounds Pass covers everything that matters, Court 14 turns loud whenever a French player is drawn there, and you can move between four or five matches in an afternoon without a reserved seat pinning you to one court." },
      { day: "Second week", detail: "The draw thins to 16, then 8. Outer-court matches thin out — fewer matches, bigger gaps in the schedule. What you get instead is real seats on Chatrier or Lenglen and the tournament's best remaining tennis." },
      { day: "Semifinals", detail: "The formality tightens noticeably. If a genuinely competitive match is the whole point of the trip, this is the window — top-4 players, real stakes, less crowd noise between points than the first week." },
      { day: "Finals weekend", detail: "The occasion itself — trophy presentations included. The most formal, least spontaneous version of Roland-Garros. Worth doing once, but not the same loose, wander-the-grounds energy as week one." },
    ],
  },

  // Pro-gated verdict content, matching ItinerarySpoke.tsx's own
  // {isUnlocked && (...)} block — two labeled prose paragraphs, before the
  // hour-by-hour tables.
  verdicts: [
    {
      label: "Which days we'd actually pick",
      body:
        "For a genuine first Roland-Garros trip, first-week weekdays are the sharpest window — a Grounds Pass covers real access across a wide range of matches, and morning practice-court visits are at their best before the draw thins. Reserve a single Chatrier or Lenglen day for whichever week actually has the match you most want to see, rather than defaulting to finals weekend by habit.",
    },
    {
      label: "What finals weekend actually trades off",
      body:
        "The tournament worth travelling for is the one with roaming outer courts and unexpected first-week results — that peaks well before finals weekend's trophy presentations and heightened formality. Book finals weekend for the occasion itself, not expecting the loose, wander-the-grounds energy of week one.",
    },
  ],

  hourByHourIntro: {
    label: "The full itinerary, hour by hour — a 6-day trip",
    body:
      "Built around two grounds days during the sharpest first-week window, one lighter day inside Paris, and a genuine day trip to Versailles — the shape that gets the most out of a tournament visit without needing tickets for every single day. If your own trip is shorter, drop the Versailles day first; if it's longer, add extra grounds days using the same first-week logic.",
  },

  // Gated hour-by-hour tables — all static, no DB-computed values or live
  // experience lookups inside the table rows themselves.
  hourByHour: [
    {
      day: "Day 1 — Arrival",
      rows: [
        { time: "Afternoon", location: "CDG / Orly → your base", activity: "Settle in and drop bags — the 16th arrondissement if you're staying near the grounds, or Boulogne-Billancourt for the better-value option (see the Where to Stay guide for both). No grounds visit today; save your energy for tomorrow's early start." },
        { time: "Evening", location: "A boulangerie sandwich, then an early night", activity: "A real jambon-beurre from any local boulangerie, then rest — tomorrow's practice-court morning rewards being properly awake, not a late first evening." },
      ],
    },
    {
      day: "Day 2 — First grounds day",
      rows: [
        { time: "Before 10am", location: "Practice courts", activity: "Top seeds warming up for that afternoon's matches, no ticket upgrade needed beyond your Grounds Pass. See the Ticket Guide for the full Grounds Pass vs. show-court comparison if you haven't decided your route yet." },
        { time: "Midday", location: "Outer courts (6, 7, 9, 12, 13, 14)", activity: "The best first-week tennis is here — ranked professionals in genuinely competitive matches, and Court 14's crowd turns loud fast if a French player is drawn there." },
        { time: "Afternoon", location: "Court Simonne-Mathieu", activity: "The greenhouse-wrapped court built into the Jardin des Serres d'Auteuil — worth a visit even outside your ticket tier for the setting alone." },
        { time: "Evening", location: "A neighborhood restaurant, Auteuil", activity: "Skip the tournament-adjacent tourist spots for a genuine local pick in the Village d'Auteuil — see the Day Trips guide." },
      ],
    },
    {
      day: "Day 3 — Second grounds day",
      rows: [
        { time: "Morning", location: "Stadium Backstage Tour + Tenniseum", activity: "Genuinely worth timing for an off-tournament morning if your trip allows — the guided route doesn't run during the tournament fortnight itself; check whether the museum alone is open on your dates." },
        { time: "Afternoon", location: "Court Philippe-Chatrier or Suzanne-Lenglen", activity: "Whichever show-court ticket you've secured — see the Ticket Guide for the real comparison of ticket tiers and the ballot/resale calendar." },
        { time: "Evening", location: "Le Caveau de la Huchette, Latin Quarter", activity: "Live jazz and swing dancing in a medieval cellar — arrive 30-45 minutes before the 9:30pm doors, especially on a weekend." },
      ],
    },
    {
      day: "Day 4 — Paris rest day",
      rows: [
        { time: "Morning", location: "Eiffel Tower, Seine cruise, or the Louvre", activity: "A genuine day away from the tournament — see the First-Timer's Guide for the essential Paris landmarks. Early-round weekdays are the easiest tournament days to give up." },
        { time: "Afternoon", location: "Montmartre", activity: "Sacré-Cœur, Place du Tertre's working artists, a genuinely different register of Paris than the tournament's quiet 16th arrondissement." },
        { time: "Evening", location: "Moulin Rouge — Féerie", activity: "Book the 11pm show over the 9pm slot for the same production at a lower price. A cabaret institution running since 1889, a genuine change of pace from a day of tennis." },
      ],
    },
    {
      day: "Day 5 — Versailles day trip",
      rows: [
        { time: "Morning", location: "Central Paris → Versailles", activity: "RER C from Saint-Michel–Notre-Dame, Musée d'Orsay, or Invalides, 35-45 minutes. Leave by mid-morning; this is a full day, not a half-day add-on." },
        { time: "Midday", location: "The Palace of Versailles", activity: "Book timed-entry tickets in advance via en.chateauversailles.fr — slots genuinely sell out in May-June, which overlaps directly with the tournament." },
        { time: "Afternoon", location: "The Trianon Estate & Hameau de la Reine", activity: "A genuinely different, more intimate side of Versailles than the palace's state rooms — worth the extra walk most visitors skip." },
        { time: "Evening", location: "Versailles → central Paris", activity: "No grounds session today by design — this is the one day built with zero tennis commitments." },
      ],
    },
    {
      day: "Day 6 — Departure",
      rows: [
        { time: "Morning", location: "Hotel → CDG / Orly", activity: "If your last grounds day ran into a late night session, avoid booking an early-morning flight the next day — build in real margin rather than rushing straight from Chatrier to the airport." },
      ],
    },
  ],

  eveningsHeading: "Two evenings worth building the trip around",

  sourcesFooter: "Sources: rolandgarros.com, en.chateauversailles.fr.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards (gated, "Two evenings worth
//   building the trip around" section at the end):
//   - "moulin-rouge-show" (moulinRouge)
//   - "caveau-de-la-huchette-jazz" (caveau)
