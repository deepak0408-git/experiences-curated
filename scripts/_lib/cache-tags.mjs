// Canonical unstable_cache tag names — kept in one place so scripts and
// in-app curator actions never hand-type a string that drifts from what
// the cache call sites actually declared. Mirrors the tags set directly in
// each _lib file's `unstable_cache(..., { tags: [...] })` call — update
// both together if a tag name ever changes.
export const CACHE_TAGS = {
  // app/ticket-intelligence/tennis/[slug]/_lib/getTennisOptionsData.ts
  TENNIS_TICKET_INTELLIGENCE: "tennis-ticket-intelligence",
  // app/trip-intelligence/tennis/_lib/getGrandSlamData.ts
  TRIP_INTELLIGENCE_TENNIS: "trip-intelligence-tennis",
  // app/trip-intelligence/formula-1/_lib/getGrandPrixData.ts
  TRIP_INTELLIGENCE_F1: "trip-intelligence-f1",
  // app/ticket-intelligence/[slug]/_lib/getSeatingData.ts
  TICKET_INTELLIGENCE_F1: "ticket-intelligence-f1",
  // app/event-pack/[slug]/_hub-and-spoke/_lib/getSpokeData.ts — one shared
  // tag for all event packs (unstable_cache can't tag per-slug, see that
  // file's comment), so busting it re-reads every live pack once.
  HUB_AND_SPOKE_SPOKE_DATA: "hub-and-spoke-spoke-data",
  // app/experience/[slug]/page.tsx
  EXPERIENCE_PAGE: "experience-page",
};
