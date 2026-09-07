// Extracted static prose from ItinerarySpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/mexico-city-grand-prix/ItinerarySpoke.tsx), for the
// Full Pack PDF build. Prose half only, hand-copied not paraphrased.
// The hour-by-hour tables are all Pro-gated in source (inside
// {isUnlocked}) — the day-shape summary above them is free.

export const mexicoCityGpItinerarySpokeContent = {
  h1: "A race weekend that collides with Día de Muertos, hour by hour",

  intro:
    "Mexico City runs a standard 3-day Grand Prix weekend — Friday through Sunday — but 2026 carries a genuine complication most other race weekends don't: the city's Día de Muertos Grand Parade falls on Saturday 31 October, directly inside race weekend itself. That means Saturday specifically needs real planning, not just a qualifying-session-and-dinner day like it would be most other years.",

  intro2:
    "Within the three core days, each has a different job. Thursday (before track action starts) is the natural day for the one genuine out-of-city commitment — Teotihuacán — since it eats most of a day including travel. Friday is practice, light on track commitments, and a good day for the Zócalo/Cathedral/Templo Mayor loop in the city itself. Saturday is qualifying and the parade, both real commitments on the same day. Sunday is race day, with the Foro Sol podium ceremony as the closing spectacle.",

  days: [
    { label: "Thursday — Teotihuacán day trip", summary: "An early start to beat the heat and crowds, back in the city by evening with time to spare" },
    { label: "Friday — Practice, Zócalo & historic center", summary: "Circuit sessions, then the Zócalo/Cathedral/Templo Mayor loop in the afternoon or evening" },
    { label: "Saturday — Practice, qualifying & the Día de Muertos parade", summary: "Practice 3, qualifying, plus catching part of the parade — the one day this year that needs real sequencing" },
    { label: "Sunday — Race day", summary: "Arrival timing by grandstand, the race itself, the Foro Sol podium ceremony" },
    { label: "Monday (optional) — More of the city", summary: "If your trip extends a day further, Chapultepec, the Frida Kahlo Museum, or Xochimilco round out the sightseeing without competing with track sessions" },
  ],

  hourByHour: [
    {
      day: "Thursday — Teotihuacán day trip",
      rows: [
        { time: "Early morning", location: "Terminal de Autobuses del Norte or your hotel", activity: "Take the Autobuses Teotihuacán service (every 15-30 min, 6am-6pm) or a taxi/rideshare — either way, leave early to beat both the midday heat and the busiest crowds at the pyramids." },
        { time: "Late morning to early afternoon", location: "Teotihuacán archaeological site", activity: "Budget 3-4 hours to see the Pyramid of the Sun, Pyramid of the Moon, and the Avenue of the Dead properly — climbing the Pyramid of the Sun is still permitted and the single most memorable part of the visit." },
        { time: "Evening", location: "Back in the city", activity: "Return by bus or taxi — a full round trip including site time runs close to 6 hours, so expect to be back with a real evening still ahead of you." },
      ],
    },
    {
      day: "Friday — Practice day",
      rows: [
        { time: "12:30 PM – 1:30 PM", location: "Your booked grandstand", activity: "Practice 1 — the lowest-pressure viewing of the weekend, worth using to test your seat's sightlines before qualifying and race day." },
        { time: "4:00 PM – 5:00 PM", location: "Your booked grandstand", activity: "Practice 2 — the second and final practice session of the weekend." },
        { time: "Evening", location: "The Zócalo, Metropolitan Cathedral & Templo Mayor", activity: "A genuinely walkable half-day loop through the historic center — the cathedral is free, Templo Mayor's museum takes 60-90 minutes." },
      ],
    },
    {
      day: "Saturday — Practice, qualifying & the parade",
      rows: [
        { time: "11:30 AM – 12:30 PM", location: "Your booked grandstand", activity: "Practice 3 — the final tuning session before qualifying, on the same day this year." },
        { time: "3:00 PM – 4:00 PM", location: "Your booked grandstand", activity: "Qualifying — sets Sunday's starting grid." },
        { time: "Evening", location: "Along the parade route (Chapultepec to the Zócalo)", activity: "Head over after qualifying to catch part of the Día de Muertos Grand Parade — the stretch between the Angel of Independence and Alameda Central is repeatedly named as where the atmosphere peaks." },
      ],
    },
    {
      day: "Sunday — Race day",
      rows: [
        { time: "Several hours before gates", location: "Your booked grandstand or GA zone", activity: "Race day carries the heaviest Metro and foot traffic of the weekend, and several Metro stations close specifically on race day — head to Velódromo if your usual station is affected." },
        { time: "2:00 PM", location: "Your booked grandstand", activity: "Lights out — the Grand Prix itself. Foro Sol grandstands specifically get the podium ceremony at ground level after the checkered flag." },
        { time: "After the race", location: "Foro Sol / around the circuit", activity: "If you're in or near Foro Sol, stay for the podium ceremony — fans remain in their seats as the celebration happens right there, a genuine Mexico City signature no other race replicates." },
      ],
    },
    {
      day: "Monday (optional) — More of the city",
      rows: [
        { time: "Morning", location: "Chapultepec Park & the National Museum of Anthropology", activity: "A genuine half-day commitment in a green, less-touristed part of the city — worth the day if you didn't fit it in earlier in the weekend." },
        { time: "Early afternoon", location: "Frida Kahlo Museum (Casa Azul), Coyoacán", activity: "Timed-entry, online-only tickets — book well ahead given the Día de Muertos overlap, ideally a month or more out, not the usual 2-4 week window." },
        { time: "Afternoon to evening", location: "Xochimilco & the Trajinera Canals", activity: "A genuine half-to-full-day commitment on its own — better suited to an extra day than squeezed alongside a track session, since rushing it defeats the point." },
      ],
    },
  ],

  sourcesFooter: "",
};

// DB-derived data NOT extracted here — none. ItinerarySpoke.tsx does not
// render any linkedExperiences cards.
