// Maps the Trip Intelligence handoff dataset's 24 sporting_event_id slugs
// (grand-prix-master.json, fan-recommendation-insights-register-v1.0.json)
// to real E|C sporting_events.slug values. Built and verified 10 Oct 2026 —
// see memory `project_trip_intelligence_build.md` for full rationale.
//
// 19 of 24 mapped to pre-existing events. 5 (austria, saudi-arabia,
// azerbaijan, turkiye, spain-madrid) had no DB row and were created as
// isHidden:true/packStatus:"planned" placeholders specifically for this
// mapping — all 5 are real, confirmed 2027 F1 races, not speculative.
export const TRIP_INTELLIGENCE_SLUG_MAP = {
  silverstone: "british-grand-prix",
  spa: "belgian-gp-2026",
  monaco: "monaco-grand-prix",
  singapore: "singapore-grand-prix",
  melbourne: "australian-grand-prix",
  suzuka: "japanese-grand-prix",
  austin: "united-states-grand-prix",
  "mexico-city": "mexico-city-grand-prix",
  "sao-paulo": "brazilian-grand-prix",
  "las-vegas": "las-vegas-grand-prix",
  qatar: "qatar-grand-prix",
  "abu-dhabi": "abu-dhabi-grand-prix",
  bahrain: "bahrain-grand-prix",
  miami: "miami-grand-prix",
  canada: "canadian-grand-prix",
  portugal: "portuguese-grand-prix",
  italy: "italian-grand-prix",
  china: "chinese-grand-prix",
  hungary: "hungarian-gp-2026",
  austria: "austrian-grand-prix",
  "saudi-arabia": "saudi-arabian-grand-prix",
  azerbaijan: "azerbaijan-grand-prix",
  turkiye: "turkish-grand-prix",
  "spain-madrid": "spanish-grand-prix",
};
