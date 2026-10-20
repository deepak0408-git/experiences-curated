// Static, edition-specific reference content — NOT a ticket option, never
// read by scoring/eligibility/matching. Separate config constant rather
// than a DB table: this is 3 fixed assets for one evergreen event edition,
// with no per-request variability and no relationship to the 43 scored
// options, so a table/migration isn't warranted (explicitly left as a
// static presentation-layer constant, consistent with the "no new
// migration unless required" instruction, 20 Oct 2026).
export const AO2027_ARENA_MAPS = [
  {
    arena: "Rod Laver Arena",
    url: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/tennis-ticket-intelligence/australian-open/2027/arena-maps/AO2027_RLA_seating_map.png",
  },
  {
    arena: "Margaret Court Arena",
    url: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/tennis-ticket-intelligence/australian-open/2027/arena-maps/AO2027_MCA_seating_map.png",
  },
  {
    arena: "John Cain Arena",
    url: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/tennis-ticket-intelligence/australian-open/2027/arena-maps/AO2027_JCA_seating_map.png",
  },
] as const;
