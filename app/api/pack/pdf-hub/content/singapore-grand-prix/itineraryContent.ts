// Extracted static prose from ItinerarySpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/singapore-grand-prix/ItinerarySpoke.tsx), for the
// Full Pack PDF build. Prose half only, hand-copied not paraphrased.
//
// Real, confirmed 2026 Sprint-weekend format and concert lineup — unlike
// Bahrain GP, no day/night uncertainty here. Hour-by-hour rows originally
// render inline JSX links (expLink helper) to named experiences — extracted
// here as plain text naming the linked experience, dropping the web-only
// hyperlink wrapper per the PDF-build skill's "drop cross-link sentences
// that only work on the web" guidance, but keeping the substantive content.

export const singaporeGpItinerarySpokeContent = {
  eventRhythmIntro:
    "2026 is a Sprint weekend, not the classic three-day format — there's no FP2 or FP3. Friday is Practice 1 and Sprint Qualifying, Saturday is the Sprint race and full Qualifying, Sunday is the Grand Prix itself. Singapore adds a second rhythm on top of that: every evening ends with a headline concert on the Padang Stage, so a full race day here genuinely runs from afternoon sessions through to a late-night set, all under the same floodlights. This is F1's only true night race, run entirely after dark.",

  daytimeNote:
    "The night format also means real daytime is available before each day's sessions start, worth using for Gardens by the Bay, Sentosa, or the Marina Bay waterfront walk rather than sitting in a hotel room waiting for the evening.",

  weekShape: {
    days: [
      { day: "Thursday — Arrival", summary: "Land, settle in, and do the Marina Bay Waterfront Walk — Merlion Park to the Flyer doubles as real circuit-area orientation" },
      { day: "Friday — Practice 1 & Sprint Qualifying", summary: "Gardens by the Bay in the daytime, Practice 1 (4:30-5:30pm) then Sprint Qualifying (8:30-9:14pm), JJ Lin and CORTIS on the Padang Stage after" },
      { day: "Saturday — Sprint & Qualifying", summary: "Sentosa in the daytime, the Sprint race (5-6pm) then full Qualifying (9-10pm) sets Sunday's grid, The Killers and Zara Larsson close out the night" },
      { day: "Sunday — Race", summary: "Arrival timing by grandstand, the Grand Prix itself at 8pm, Lana Del Rey's Singapore debut after the chequered flag" },
    ],
  },

  // Full hour-by-hour tables are Pro-gated in the source ({isUnlocked &&
  // ...}) and are real, confirmed content — included in full below.
  hourByHourItinerary: {
    days: [
      {
        day: "Thursday — Arrival day",
        rows: [
          { time: "Afternoon", location: "Changi Airport → hotel", activity: "Arrive and get to your base. MRT connects directly from the airport into the city — factor in your specific hotel's nearest station." },
          { time: "Evening", location: "Marina Bay Waterfront Walk", activity: "Merlion Park, the Helix Bridge, and Marina Bay Sands lit up at night — free, and it doubles as orientation for the same waterfront the circuit wraps around. Full guide: Marina Bay Waterfront Walk." },
        ],
      },
      {
        day: "Friday — Practice 1 & Sprint Qualifying",
        rows: [
          { time: "Morning", location: "Gardens by the Bay", activity: "Outdoor gardens and Supertree Grove are free and open early. Do the OCBC Skyway before the day heats up — last admission is 8-8:30pm, so a morning visit avoids any risk of missing it. Full guide: Gardens by the Bay." },
          { time: "Early afternoon", location: "Marina Bay Street Circuit", activity: "First circuit visit — find your grandstand, walk the concourse near it before race-day crowds arrive." },
          { time: "4:30-5:30pm", location: "Your booked grandstand", activity: "Practice 1 — the only practice session all weekend, since 2026 is a Sprint format with no FP2/FP3. Worth using to test your seat's sightlines." },
          { time: "8:30-9:14pm", location: "Your booked grandstand", activity: "Sprint Qualifying — sets Saturday's Sprint grid." },
          { time: "Night", location: "Padang Stage", activity: "JJ Lin and CORTIS headline Friday night — Zone 4 ticket required. Lau Pa Sat's Satay Street (open till 3am) is the realistic post-set food stop. Full concert lineup: Padang Stage." },
        ],
      },
      {
        day: "Saturday — Sprint & Qualifying",
        rows: [
          { time: "Morning", location: "Sentosa Island", activity: "10 minutes by MRT via HarbourFront. Take the cable car one direction for the harbour views, walk or Sentosa Express back. Full guide: Sentosa Island." },
          { time: "Early afternoon", location: "En route back to Marina Bay", activity: "Build in real transit buffer — don't cut it close against the Sprint." },
          { time: "5-6pm", location: "Your booked grandstand", activity: "Sprint race — a shorter, standalone race with its own points, run entirely separately from Sunday's Grand Prix." },
          { time: "9-10pm", location: "Your booked grandstand", activity: "Qualifying — this is what sets Sunday's Grand Prix grid, not Friday's Sprint Qualifying." },
          { time: "Night", location: "Padang Stage", activity: "Zara Larsson and The Killers headline Saturday. Makansutra Gluttons Bay (open till 3am Fri/Sat) is built for exactly this timing." },
        ],
      },
      {
        day: "Sunday — Race day",
        rows: [
          { time: "Late morning", location: "The Shoppes at Marina Bay Sands", activity: "The race isn't until 8pm, so there's real time for a late brunch and some shopping right by the circuit — The Shoppes opens 10am, with brunch spots like Yardbird and PS.Cafe (both open Sundays). It's a genuine, easy option given how much daytime this format leaves free." },
          { time: "Before the race", location: "Zone 1 or Zone 4 F1 Village", activity: "Arrive 60-90 minutes before the race to clear security and explore the F1 Village before the rush — exact gate-opening times not yet published for 2026." },
          { time: "8pm", location: "Your booked grandstand", activity: "The Grand Prix itself, under floodlights." },
          { time: "After the chequered flag", location: "Padang Stage", activity: "James Arthur and Lana Del Rey's first-ever Singapore show close the weekend, from 10:25pm. Full lineup: Padang Stage." },
          { time: "Late night", location: "Circuit exit routes", activity: "Expect exit crowds to take real time to clear. MRT service runs to 1am specifically for this weekend — plan your last connection." },
        ],
      },
    ],
  },

  sourcesFooter:
    "Session times confirmed via the official F1 2026 calendar (formula1.com), Singapore local time — exact gate and Fan Zone opening times not yet published, see the hub page's Quick Reference for the latest. Sunday brunch/shopping options sourced from marinabaysands.com, hungrygowhere.com, sethlui.com. Verified 3 Aug 2026.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups referenced inline in the hour-by-hour text
//   (via the expLink helper in the source):
//   - "singapore-gp-waterfront-walk" (waterfrontWalk)
//   - "singapore-gp-gardens-by-the-bay" (gardensByTheBay)
//   - "singapore-gp-sentosa" (sentosa)
//   - "singapore-gp-lau-pa-sat" (lauPaSat)
//   - "singapore-gp-bayfront-hawkers" (bayfrontHawkers)
//   - "singapore-gp-padang-stage-concerts" (padangStage)
//   - "singapore-gp-f1-village" (f1Village)
