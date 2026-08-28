// Extracted static prose from ItinerarySpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/shanghai-masters/ItinerarySpoke.tsx), for the Full
// Pack PDF build. Prose half only, hand-copied not paraphrased.
//
// Real, confirmed 2026 schedule (5-18 Oct, standard Masters 1000
// single-elimination draw) — unlike Bahrain GP, no day/night uncertainty
// here; this is a genuinely confirmed structure.

export const shanghaiMastersItinerarySpokeContent = {
  eventRhythmIntro:
    "Unlike the Finals in November, this is a standard Masters 1000 single-elimination draw — 96 players, one loss and you're out. That shapes the week very differently: qualifying and the first two rounds (5-10 October) run the most matches across the most courts, including the outer showcourts and Court 17's practice sessions, so this is genuinely the best window for close-up access to a wide range of players. Third and fourth rounds (11-14 October) narrow things further, then quarterfinals (15-16 October) through the semifinals (17 October) and final (18 October) concentrate onto Center Court and Grandstand 2 — fewer matches, but each one carries more weight.",

  federerNote:
    "This year, Roger Federer continues his \"Roger & Friends\" exhibition tradition, returning to Shanghai for a celebrity doubles match on 16 October — inside this window, but not part of the tournament draw. A Grounds Pass doesn't automatically cover it, but there's also no separate Federer ticket to buy: whichever day-session ticket you hold for that date is what gets you in, so book 16 October specifically rather than any other day if seeing him is the priority. A multi-day trip has real flexibility to build a Suzhou or Hangzhou day trip into the early-rounds stretch, since missing one first-week match day doesn't cost you the way missing a quarterfinal or semifinal would later in the week.",

  tentativeWeek: {
    label: "A tentative week, built around that rhythm",
    days: [
      { day: "Arrival (before 5 Oct)", detail: "Settle in, install Amap and Didi, and get oriented — an evening at the Bund is a good first night, well before Qizhong crowds build." },
      { day: "Qualifying & early rounds (5-10 Oct)", detail: "The most matches on the most courts, including Court 17 practice sessions — the best window for close-up access. Build in a city day or the Suzhou/Hangzhou day trip on whichever day suits your session tickets least." },
      { day: "Third/fourth rounds (11-14 Oct)", detail: "The draw has narrowed — a good stretch to prioritize specific players you want to see before the field thins further." },
      { day: "Federer exhibition (16 Oct)", detail: "No separate ticket exists — a normal day-session ticket for 16 October is what gets you in. Book that specific date early, since exhibition-day sessions sell through faster than an average day." },
      { day: "Quarterfinals through the final (15-18 Oct)", detail: "Matches concentrate onto Center Court and Grandstand 2 — protect these days if you have tickets, since the draw has narrowed to fewer, higher-stakes matches." },
    ],
  },

  sessionTimesNote: {
    label: "Session times can still shift",
    body:
      "The round-by-round dates above are the real, confirmed 2026 schedule — but exact daily session start times and any weather-driven adjustments aren't set until closer to the tournament. Check the official day-by-day order of play once it's published.",
  },

  crowdsIntro:
    "Recent editions have drawn over 220,000 spectators across the tournament, more than 70% of them traveling in from outside Shanghai — a genuine national draw, not a local event with a big venue. That scale is exactly why booking early matters here, and it collides directly with China's National Day Golden Week (1-7 October), which runs right before the tournament starts and puts real pressure on hotel and transport availability in the same window.",

  liNaZhengIntro:
    "Shanghai's crowds skew both younger and older at once, and two careers explain why: Li Na's 2011 French Open win made her the first Chinese Grand Slam singles champion and the reason an older generation started following tennis at all, while Zheng Qinwen's 2024 Olympic gold is doing the same for a much younger generation discovering the sport now. Federer's exhibition partner this year is Li Na herself — a real link between the tournament's past and its present.",

  // Full hour-by-hour tables for a 6-day trip are Pro-gated in the source
  // (ItineraryTable components, Day 1-6, real sequenced content — not
  // uncertain like Bahrain GP's). Included in full below since this is
  // real, confirmed content, not a placeholder.
  hourByHourItinerary: {
    label: "The full itinerary, hour by hour — a 6-day trip",
    intro:
      "Built for a short trip timed around the tournament's early-week access and the Federer exhibition — arrive with a day to spare, use the middle days for early-round matches and one day trip, let the Federer session run late, and give yourself a genuine next-morning departure rather than rushing straight from Center Court to the airport. If your own trip is longer, drop the extra nights into more early-round days using the same city/food picks below.",
    days: [
      {
        day: "Day 1 — Arrival",
        rows: [
          { time: "Afternoon", location: "Pudong (PVG) or Hongqiao (SHA) → hotel", activity: "Take the Maglev + Metro Line 2 combination from PVG (fastest, roughly 45-50 min to central Shanghai) or Metro Line 10/2 directly from SHA. Install Amap (Google Maps is blocked in China) and Didi (China's dominant ride-hailing app, works with a foreign card) before you land." },
          { time: "Evening", location: "The Bund", activity: "An evening walk along the Bund at dusk — the classic first-night move, with the Lujiazui skyline lit up across the river. Early night ahead of tomorrow's session." },
        ],
      },
      {
        day: "Day 2 — Early-round day",
        rows: [
          { time: "Morning", location: "Yu Garden and the Old City", activity: "A genuine half-morning in the Ming-dynasty garden and the surrounding old-city lanes — save the afternoon for Qizhong." },
          { time: "Midday", location: "Nanxiang Mantou Dian, Yu Garden", activity: "Xiaolongbao at the original Nanxiang-style shop inside the Yuyuan Bazaar — go early to beat the queue." },
          { time: "Afternoon/evening session", location: "Qizhong Forest Sports City Arena", activity: "Early rounds spread matches across Center Court, the outer showcourts, and Court 17's practice sessions — a Grounds Pass gets genuine close-up access to a wide range of players on this kind of day. Take Metro Line 1 to Xinzhuang or Line 5 to Zhuanqiao, then the ¥2 tournament shuttle for the final leg." },
          { time: "Evening (after)", location: "French Concession", activity: "Dinner in the French Concession — book ahead if going somewhere specific, since it's a genuinely popular area after a session lets out." },
        ],
      },
      {
        day: "Day 3 — Day trip",
        rows: [
          { time: "Morning", location: "Shanghai → Suzhou or Hangzhou (high-speed rail)", activity: "Depart by mid-morning — Suzhou is the faster round trip (as little as 21 minutes each way), Hangzhou rewards a slightly longer day if you have the time. Build the day around a match session you're comfortable missing entirely, not one you're hoping to catch on return." },
          { time: "Midday–afternoon", location: "Suzhou's classical gardens or Hangzhou's West Lake", activity: "A genuine half-day to full-day out of the city — this is the one day built with no tennis commitments, so there's no clock to watch on the way back." },
          { time: "Evening", location: "Return to Shanghai", activity: "Back by early evening on the fast train — no session booked tonight by design." },
        ],
      },
      {
        day: "Day 4 — Later-round day",
        rows: [
          { time: "Morning", location: "Hotel / Lujiazui", activity: "A lighter morning — the draw has narrowed by now, so today's session is likely the trip's most important match day." },
          { time: "Before the session", location: "Qizhong — confirm your gate", activity: "By this stage of the draw, matches concentrate onto Center Court and Grandstand 2 — confirm your ticket tier's entrance before you arrive, since Qizhong's 80-hectare footprint means walking to the wrong gate genuinely costs time." },
          { time: "Session", location: "Your booked seat", activity: "Later rounds carry more weight per match — protect the whole day if you're attending a quarterfinal or later." },
          { time: "Evening", location: "Xintiandi or French Concession", activity: "A relaxed dinner — this is a good night to book something you've been saving, since tomorrow is the exhibition." },
        ],
      },
      {
        day: "Day 5 — Federer exhibition day",
        rows: [
          { time: "Morning", location: "Hotel / city", activity: "Keep the morning light — today's session is a genuine exhibition, not a tournament match, and it's the day this itinerary has been built around." },
          { time: "Before the session", location: "Qizhong Forest Sports City Arena", activity: "\"Roger & Friends\" runs on your normal 16 October day-session ticket, not a separate purchase — arrive with the same margin you would for a marquee tournament match, since demand for this specific date is genuinely higher than a standard round." },
          { time: "Evening session", location: "Center Court", activity: "Exhibitions like this typically fall in the evening/night session — the week's centerpiece. Book this session's ticket first, before anything else in your trip, given how fast exhibition-day tickets move." },
          { time: "Late night", location: "Stay another night", activity: "A prime-time exhibition means a late finish — don't plan a same-day departure. Book your flight or onward travel for the next morning instead, so you're not rushing straight from Center Court to a departure gate." },
        ],
      },
      {
        day: "Day 6 — Departure",
        rows: [
          { time: "Morning", location: "Hotel → Pudong or Hongqiao Airport", activity: "A relaxed next-morning departure gives real margin after the previous night's late finish, rather than a rushed same-day exit." },
        ],
      },
    ],
  },
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "shanghai-masters-crowds-atmosphere" (crowds)
//   - "li-na-zheng-qinwen-generations" (liNaZheng)
//   - "roger-friends-federer-exhibition" (federer)
