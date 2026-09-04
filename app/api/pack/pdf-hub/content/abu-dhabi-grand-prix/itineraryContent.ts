// Extracted static prose from ItinerarySpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/abu-dhabi-grand-prix/ItinerarySpoke.tsx), for the
// Full Pack PDF build. Prose half only, hand-copied not paraphrased.
//
// Unlike Bahrain's Itinerary spoke, Abu Dhabi's doesn't have a separate
// session-times callout box — session times are woven directly into the
// two intro paragraphs. 5 days total (4 core race days + an optional
// Monday Dubai day trip before flying out of DXB), not Bahrain's 3+1
// shape.

export const abuDhabiGpItinerarySpokeContent = {
  intro:
    "Abu Dhabi runs a standard 4-day Grand Prix rhythm — Thursday through Sunday — but the season-finale framing changes what each day is actually for. Qualifying starts at 18:00 and the race at 17:00 local time, both building through the afternoon into the twilight-to-night transition, and every night of the weekend carries a real Yasalam concert on the same ticket. That means a full race day here genuinely runs from an afternoon session through to a late-night headline set under the same lights — plan the evening as seriously as the session itself.",

  intro2:
    "Within the four core days, each has a different job. Thursday is the lightest on track commitments and carries the first night's concert (Zara Larsson, Lewis Capaldi) — the natural day for an Abu Dhabi city day trip before the weekend gets busier. Friday and Saturday build through practice and qualifying, each with its own headline act after. Sunday is the race and the closing set — Imagine Dragons headlines Saturday night specifically, with The Chainsmokers and The Script closing out Sunday. If you're flying out via DXB anyway, staying one extra night and adding a Monday Dubai day turns what would otherwise be a rushed same-day departure into a real, unhurried day out.",

  days: [
    { label: "Thursday — Arrival, Abu Dhabi city day", summary: "Land, settle in, use the day for Sheikh Zayed Grand Mosque and Qasr Al Watan, catch the opening concerts" },
    { label: "Friday — Practice", summary: "Circuit sessions in the afternoon, first night of the marina/dining scene in the evening" },
    { label: "Saturday — Qualifying", summary: "Qualifying session, then the season's biggest concert night" },
    { label: "Sunday — Race", summary: "Arrival timing by grandstand, the race itself, the closing concerts" },
    { label: "Monday — Optional Dubai day", summary: "A full, unhurried Dubai day trip before flying out of DXB — the natural way to use a travel day that would otherwise be dead time" },
  ],

  // Pro-gated hour-by-hour tables, matching ItinerarySpoke.tsx's own
  // {isUnlocked && (...)} block. All static — no DB-computed values or
  // live experience lookups appear in this spoke's itinerary tables.
  hourByHour: [
    {
      day: "Thursday — Arrival & Abu Dhabi city day",
      rows: [
        { time: "Morning", location: "AUH or DXB → hotel", activity: "Arrive and settle in. AUH is 8km/~15 min from Yas Island if your routing allows it; if you flew into DXB for better connections, budget the ~90-minute drive via the E11 instead." },
        { time: "Late morning", location: "Sheikh Zayed Grand Mosque", activity: "Arrive close to opening to beat both the heat and the largest tour groups — budget 90 minutes to see it properly. Dress code applies at both this stop and the next." },
        { time: "Midday", location: "Qasr Al Watan", activity: "A short drive from the mosque — the Great Hall and grounds are worth real time, not a rushed pass-through." },
        { time: "Evening", location: "Yas Marina Circuit — opening concerts", activity: "Zara Larsson and Lewis Capaldi open the Yasalam concert series tonight — included on every ticket tier, GA included." },
      ],
    },
    {
      day: "Friday — Practice day",
      rows: [
        { time: "Afternoon", location: "Your booked grandstand", activity: "Practice sessions — the lowest-pressure viewing of the weekend, worth using to test your seat's sightlines before qualifying and race day." },
        { time: "Evening", location: "Yas Marina dining walk", activity: "Stars 'N' Bars, Ishtar, or Bar Du Port along the marina — casual to mid-range, and genuinely walkable between all three." },
      ],
    },
    {
      day: "Saturday — Qualifying day",
      rows: [
        { time: "18:00", location: "Your booked grandstand", activity: "Qualifying — shorter than the race, and it sets Sunday's grid." },
        { time: "Evening", location: "Yas Marina Circuit — headline concert night", activity: "Imagine Dragons headlines tonight — the biggest single concert draw of the weekend. Plan your exit route in advance; this is the highest-traffic concert night." },
      ],
    },
    {
      day: "Sunday — Race day",
      rows: [
        { time: "Several hours before gates", location: "Your booked grandstand or GA zone", activity: "Race day carries the heaviest traffic and shuttle demand of the weekend — arrive well ahead of the session, not just before it." },
        { time: "17:00", location: "Your booked grandstand", activity: "The race itself, running through sunset into the floodlit finish." },
        { time: "After the chequered flag", location: "Yas Marina Circuit — closing concerts", activity: "The Chainsmokers and The Script close out the weekend. Expect the heaviest post-event traffic of the whole trip — if you're departing tonight, build real slack into any same-day flight." },
      ],
    },
    {
      day: "Monday — Optional Dubai day",
      rows: [
        { time: "Morning", location: "Abu Dhabi → Dubai", activity: "Check out and make the ~90-minute drive via the E11 rather than treating it as a separate detour — you're already heading toward DXB, so this is dead travel time turned into a real day." },
        { time: "Late morning to afternoon", location: "Burj Khalifa & The Dubai Mall", activity: "The two sit right next to each other in Downtown Dubai — a single stop covers both. Book your At the Top time slot well ahead if you want a specific window; sunset slots in this exact travel window routinely sell out weeks in advance." },
        { time: "Evening", location: "Dubai Marina or Downtown", activity: "One last evening before the flight — the Dubai Fountain's evening shows run every 30 minutes from 6pm, timed easily around a Downtown dinner." },
        { time: "Night", location: "DXB", activity: "Fly out from Dubai rather than backtracking to AUH — since you're already in the city, this closes the loop instead of adding a second cross-emirate drive." },
      ],
    },
  ],
};

// DB-derived data NOT extracted here — none. This spoke renders no
// linkedExperiences cards and computes no DB-derived values.
