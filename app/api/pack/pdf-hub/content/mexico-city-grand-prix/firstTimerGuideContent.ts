// Extracted static prose from FirstTimerGuideSpoke.tsx (app/event-pack/
// [slug]/_hub-and-spoke/spokes/mexico-city-grand-prix/FirstTimerGuideSpoke.tsx),
// for the Full Pack PDF build. Prose half only, hand-copied not paraphrased.

export const mexicoCityGpFirstTimerGuideSpokeContent = {
  h1: "5 mistakes first-time visitors make at Mexico City",

  intro:
    "Mexico City carries a genuinely different weight than most races on the calendar — a circuit named after two drivers who died racing, threaded through a converted baseball stadium, sitting higher above sea level than anywhere else F1 visits, in a city hosting one of its biggest cultural weekends of the year at the exact same time. Here's what genuinely trips up a first-time visitor, drawn from the real detail in this pack rather than generic advice.",

  mistakes: [
    { number: 1, label: "not knowing race day closes different Metro stations", body: "Ciudad Deportiva, Puebla, and Pantitlán stations actually close on race day itself to manage crowd flow — a genuine, planned closure, not a malfunction. Showing up expecting your usual gate-matched station to be open on Sunday, when it worked fine on Friday and Saturday, is a real and common way to get caught out. Velódromo stays open regardless of gate and is the reliable fallback." },
    { number: 2, label: "booking a hotel without accounting for Día de Muertos", body: "2026 race weekend lands directly on the city's Día de Muertos Grand Parade weekend — one of the biggest tourism draws in Mexico City's entire calendar, entirely independent of the race. Booking a hotel on a normal race-weekend timeline, rather than the earlier window this specific overlap demands, is a real risk of ending up with worse availability or a higher rate than expected." },
    { number: 3, label: "packing for one temperature", body: "Daytime highs run a pleasant 18-22°C, but nights and early grandstand queues drop to 8-12°C — a real cold, not a mild cooling. Packing only for the daytime warmth means an uncomfortable early morning arrival; packing only for the evening chill means carrying dead weight through the warmest part of the day. Layer for both." },
    { number: 4, label: "underestimating the altitude", body: "At over 2,200 meters, this is the highest-altitude circuit on the F1 calendar. Some visitors feel genuinely short of breath or more tired than expected in their first day or two — normal adjustment, not a medical concern, but worth pacing your first day's walking around rather than pushing through at your usual pace. The altitude also means UV exposure is stronger than the temperature suggests — sunscreen matters even on a mild-feeling day." },
    { number: 5, label: "trying to bring a seat cushion or full backpack", body: "Chairs and seat cushions are explicitly prohibited — genuinely enforced, and commonly confiscated at the gate. Bags face a real size limit too, with security screening that runs closer to an airport checkpoint than a typical sporting-event bag check. Pack light and expect a genuine search, not a quick wave-through." },
  ],

  howToUseThreeDays: {
    label: "How to use the three days",
    rows: [
      { label: "Friday — Practice, Zócalo & historic center", value: "The lightest day on track — a good window to fit in the Zócalo/Cathedral/Templo Mayor loop in the city before race weekend gets busier." },
      { label: "Saturday — Qualifying & the Día de Muertos parade", value: "Two real commitments on the same day this year — qualifying and the parade both need sequencing, not a casual approach." },
      { label: "Sunday — Race day", value: "The busiest day by far, with several Metro stations closing to manage crowd flow. Arrive early and budget real buffer time." },
    ],
  },

  practicalEssentials: {
    label: "Practical essentials",
    items: [
      { name: "The official F1 Race Guide app", body: "Covers every circuit on the calendar, including Mexico City — interactive circuit maps, real-time schedule alerts, and geotagged points for grandstands, food, and Fan Zone activities. Worth downloading before you land." },
      { name: "The Metro CDMX app", body: "Worth downloading before you arrive — it's the fastest way to check real-time service alerts, including the race-day station closures above, before you leave your hotel rather than after you're already at the platform." },
      { name: "Uber or DiDi", body: "Both operate widely across the city and are genuinely useful for getting between neighborhoods and restaurants — just not for the final approach to the circuit itself on race weekend, when road closures keep them well short of the gates." },
      { name: "A reusable water bottle", body: "The altitude dehydrates faster than sea-level habits account for — treat hydration as a real part of managing the adjustment, not an afterthought." },
      { name: "Comfortable shoes, genuinely", body: "The circuit sits inside a large public sports complex, not a purpose-built venue — expect real distance on foot between gates, grandstands, and the Fan Zone over a full day." },
      { name: "Sunscreen, even on a mild-feeling day", body: "Altitude means real UV exposure regardless of how warm the air actually feels — easy to underestimate on a day that doesn't feel hot." },
    ],
  },

  atmosphereCallout: {
    label: "The genuine first-timer trap",
    body:
      "Don't treat this as a generic race weekend layered on top of a generic city trip — the circuit's own history (named for two drivers who died racing), the stadium-through-track feature at Foro Sol, and the Día de Muertos overlap all make this a genuinely different kind of weekend than most other stops on the calendar. Build real time into your schedule for the city itself, not just the track.",
  },

  // Pro-gated verdict content — matching FirstTimerGuideSpoke.tsx's
  // {isUnlocked} block exactly.
  verdicts: [
    {
      label: "What actually matters most, first time",
      body:
        "Book your hotel and tickets earlier than you would for a typical Grand Prix — both the Día de Muertos overlap and this race's own history of selling out within a single day compound into a genuinely higher-stakes planning window than most other stops on the calendar. Everything else — the altitude adjustment, the packing layers, the Metro station logistics — is manageable with the detail already in this pack; the one irreversible mistake is waiting too long on the two things that can actually sell out entirely.",
    },
  ],

  sourcesFooter: "",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "autodromo-hermanos-rodriguez-venue-" (venueGuide)
