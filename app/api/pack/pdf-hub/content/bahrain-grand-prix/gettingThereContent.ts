// Extracted static prose from GettingThereSpoke.tsx (app/event-pack/[slug]/
// _hub-and-spoke/spokes/bahrain-grand-prix/GettingThereSpoke.tsx), for the
// Full Pack + Travel Brief PDF build. Prose half only, hand-copied not
// paraphrased.

export const bahrainGpGettingThereSpokeContent = {
  intro:
    "KLIA Terminal 2 is a 1-minute walk from Sepang Circuit — the circuit was built into its own airport. Terminal 1, by contrast, is roughly a 1-hour walk away — a very different proposition. Confirm which terminal you're flying into before you plan your arrival.",

  klexRow: {
    label: "KLIA Ekspres",
    detail: "RM55 one-way, 33 minutes, every 20 minutes, 05:00-00:00.",
  },

  appsRow: {
    label: "Apps to have installed",
    detail: "MyRapid Journey Planner, PULSE app, KLIA Ekspres app.",
  },

  raceDayShuttleRow: {
    label: "Race-day shuttle",
    detail:
      "Historical pattern only, not yet confirmed for 2026 — RM12/trip, 08:00-23:00.",
  },

  drivingParkingRow: {
    label: "Driving / parking",
    detail:
      "Bays 1-17. RM20 for cars, RM10 for motorbikes — a flat per-race-week fee (historical pattern, not yet confirmed for 2026).",
  },

  terminalWarning: {
    label: "Critical: confirm your terminal",
    body:
      "Terminal 1 is roughly a 1-hour walk from the circuit — very different from Terminal 2's 1-minute walk. Check your flight's arrival terminal before you plan around the shorter walk.",
  },

  sourcesFooter: "Sources: kliaekspres.com, tickets.formula1.com, myrapid.com.my.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card rendered via generic
//   <SpokeExperienceCard>:
//   - "getting-to-sepang-circuit-klia" (transit experience)
