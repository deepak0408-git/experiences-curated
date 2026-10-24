// Canonical unstable_cache tag names — the TS-side counterpart of
// scripts/_lib/cache-tags.mjs. Keep both files' values identical; this one
// is for curator server actions (which call revalidateTag directly), the
// .mjs one is for standalone scripts (which call revalidateTag over HTTP
// via scripts/_lib/revalidate-cache.mjs).
export const CACHE_TAGS = {
  TENNIS_TICKET_INTELLIGENCE: "tennis-ticket-intelligence",
  TRIP_INTELLIGENCE_TENNIS: "trip-intelligence-tennis",
  TRIP_INTELLIGENCE_F1: "trip-intelligence-f1",
  TICKET_INTELLIGENCE_F1: "ticket-intelligence-f1",
  HUB_AND_SPOKE_SPOKE_DATA: "hub-and-spoke-spoke-data",
  EXPERIENCE_PAGE: "experience-page",
} as const;
