// Extracted static prose from DayTripsSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/abu-dhabi-grand-prix/DayTripsSpoke.tsx), for the
// Full Pack PDF build. Prose half only, hand-copied not paraphrased.

export const abuDhabiGpDayTripsSpokeContent = {
  intro:
    "Abu Dhabi's season-finale weekend genuinely supports two different kinds of day trip: staying in the city itself for real cultural landmarks, or making the roughly 90-minute run to Dubai — close enough to be a real, common choice for fans basing part of their trip around DXB's stronger flight connectivity in the first place.",

  stayingInAbuDhabi: {
    label: "Staying in Abu Dhabi — culture and thrills",
  },

  runToDubai: {
    label: "Making the run to Dubai",
  },

  honestLogisticsCallout: {
    label: "The honest logistics",
    body:
      "Burj Khalifa and Dubai Mall sit right next to each other in Downtown Dubai — a single stop covers both. Dubai by Night covers Dubai Marina and Deira specifically, which sit on opposite sides of the city from Downtown and from each other, so treat it as a separate evening choice rather than something you fold into the same Downtown stop. The Sheikh Zayed Grand Mosque and Louvre Abu Dhabi/theme parks pairing is a genuinely separate, in-city day — don't try to combine an Abu Dhabi city day with a Dubai run in the same 24 hours on a 4-day race weekend; the travel time alone makes it a poor trade against the race sessions themselves.",
  },

  // Pro-gated deep-dive cards + sequencing verdict, matching
  // DayTripsSpoke.tsx's own {isUnlocked && (...)} block.
  deepDives: [
    {
      name: "Sheikh Zayed Grand Mosque & Qasr Al Watan",
      body:
        "Both sites carry exceptional, genuine review records — the mosque at 61,000+ reviews and Qasr Al Watan at 10,000+, both averaging 4.8 — built on scale and craft, not tourist-trap hype. Entry to the mosque is free, no booking required, though guided tours can be arranged; Qasr Al Watan is a paid, moderate-tier ticket, booked directly via qasralwatan.ae or through a combined city-tour operator. Both run daily, with the mosque's hours varying by prayer schedule — confirm the current window before you go.",
    },
    {
      name: "Louvre Abu Dhabi & Yas Island's theme parks",
      body:
        "Three of the best-attested attractions in the UAE, each rated 4.5+ across tens of thousands of reviews, covering completely different registers — a world-class museum against two of Yas Island's own theme parks. The Louvre is closed Mondays; both theme parks run standard daily hours. Book tickets directly via each venue's own site, or via a combined Yas Island park pass if you're doing both parks in one visit.",
    },
    {
      name: "Burj Khalifa",
      body:
        "At the Top (Level 124/125) runs standard pricing against the SKY Level 148 premium tier — both open daily, roughly 08:30–23:00. The Dubai Fountain below is free and needs no ticket: afternoon shows run 1pm/1:30pm (2pm/2:30pm on Fridays), evening shows every 30 minutes from 6pm–11pm. If you want the SKY 148 experience specifically, sunset slots in the October-to-April window — which covers the entire Abu Dhabi GP weekend — routinely sell out 2-4 weeks ahead, so book as soon as your travel dates are fixed, not the week of your trip.",
    },
    {
      name: "The Dubai Mall",
      body:
        "288,000+ reviews at 4.7 — a review record few single venues anywhere can match. Beyond the shopping, it houses a real aquarium, an ice rink, and hundreds of dining options, with direct physical connections to both Burj Khalifa and the Fountain. General mall access needs no booking; book individual attraction tickets (aquarium, ice rink) directly via thedubaimall.com if you want those specifically, rather than queuing on the day.",
    },
    {
      name: "Dubai by Night",
      body:
        "Three genuinely different nights in three registers: the Marina's local waterfront energy (liveliest 6pm–10pm, no fixed hours), Deira's trading-city history crossed by a one-dirham water taxi across the Creek, and Downtown's postcard spectacle. No booking needed to walk either area — reserve ahead only for a Pier 7 restaurant table with a water view on the Marina side; the abra crossing at Deira runs continuously with no booking required.",
    },
  ],

  verdicts: [
    {
      label: "How we'd actually sequence it",
      body:
        "For a standard Thursday-Sunday race weekend, Thursday (before track action starts) is the natural day for the Abu Dhabi city half — mosque, Qasr Al Watan, and Louvre in the morning and early afternoon, leaving the evening free. If you're flying in via DXB anyway, build the Dubai day trip around your actual arrival or departure day rather than carving out a separate day from the race weekend itself — you're already making the drive one direction, so a few extra hours in Downtown Dubai before continuing to Abu Dhabi is a genuinely efficient use of a travel day that would otherwise be dead time.\n\nThe one combination that genuinely doesn't fit: don't try to do both the Abu Dhabi city day and a full Dubai day trip within the same 4-day window as three or four race-day sessions — something will feel rushed, and it's almost always the day trips that suffer for it. If your schedule is genuinely tight, pick one city-day theme (culture in Abu Dhabi, or Downtown Dubai) rather than trying to do a version of both.",
    },
  ],

  sourcesFooter:
    "Sources: szgmc.gov.ae and qasralwatan.ae (mosque and Qasr Al Watan hours/booking), louvreabudhabi.ae, ferrariworldabudhabi.com, and wbworldabudhabi.com (theme park hours/booking), burjkhalifa.ae and thedubaifountain.com (At the Top and Fountain show schedule), thedubaimall.com (mall hours/attraction booking), visitdubai.com and marinadubai.ae (Marina/Deira hours and abra fare).",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookups for cards:
//   - "sheikh-zayed-mosque-qasr-al-watan" (mosque) — Staying in Abu Dhabi section
//   - "louvre-abu-dhabi-yas-theme-parks" (louvreThemeParks) — Staying in Abu Dhabi section
//   - "burj-khalifa-dubai-day-trip" (burjKhalifa) — Making the run to Dubai section
//   - "dubai-mall-day-trip" (dubaiMall) — Making the run to Dubai section
//   - "dubai-by-night" (dubaiNight) — Making the run to Dubai section
