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

// French Open 2027 — the 4 original user-supplied court maps, uploaded to
// R2 under the event's own deterministic key prefix, added 22 Oct 2026.
// Kept as a fully separate constant/array (not appended to
// AO2027_ARENA_MAPS) so Australian Open's own map list and presentation
// are never touched by this addition.
export const RG2027_ARENA_MAPS = [
  {
    arena: "Court Philippe-Chatrier",
    url: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/tennis-ticket-intelligence/french-open/2027/arena-maps/RG2027_philippe-chatrier_seating_map.png",
  },
  {
    arena: "Court Suzanne-Lenglen",
    url: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/tennis-ticket-intelligence/french-open/2027/arena-maps/RG2027_suzanne-lenglen_seating_map.png",
  },
  {
    arena: "Court Simonne-Mathieu",
    url: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/tennis-ticket-intelligence/french-open/2027/arena-maps/RG2027_simonne-mathieu_seating_map.png",
  },
  {
    arena: "Court 14",
    url: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/tennis-ticket-intelligence/french-open/2027/arena-maps/RG2027_court-14_seating_map.png",
  },
] as const;

// Wimbledon 2027 — the 4 approved seating maps from the founder-supplied
// implementation package, added 25 Oct 2026. Per the package's
// IMPLEMENTATION_CONTRACT.md: "the No.2 and No.3 maps were cropped from
// the approved Option 1 composite; do not regenerate or redraw." Kept as
// a fully separate constant (not appended to AO2027_ARENA_MAPS/
// RG2027_ARENA_MAPS) so neither prior tournament's map list is touched by
// this addition. Credit per the approved package: the All England Lawn
// Tennis Club, Wimbledon.com (rendered by ArenaMapsSection.tsx).
export const WIM2027_ARENA_MAPS = [
  {
    arena: "Centre Court",
    url: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/tennis-ticket-intelligence/wimbledon/2027/arena-maps/WIM2027_centre-court_seating_map.png",
  },
  {
    arena: "No. 1 Court",
    url: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/tennis-ticket-intelligence/wimbledon/2027/arena-maps/WIM2027_no1-court_seating_map.png",
  },
  {
    arena: "No. 2 Court",
    url: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/tennis-ticket-intelligence/wimbledon/2027/arena-maps/WIM2027_no2-court_seating_map.png",
  },
  {
    arena: "No. 3 Court",
    url: "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/tennis-ticket-intelligence/wimbledon/2027/arena-maps/WIM2027_no3-court_seating_map.png",
  },
] as const;
