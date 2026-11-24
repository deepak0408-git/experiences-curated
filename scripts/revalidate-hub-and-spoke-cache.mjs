import { config } from "dotenv";
config({ path: ".env.local" });

// Forces an immediate revalidation of the hub-and-spoke spoke-data cache
// (unstable_cache, 1hr TTL, lib/cacheTags.ts's HUB_AND_SPOKE_SPOKE_DATA tag)
// via app/api/internal/revalidate-cache/route.ts — built exactly for this
// gap after the French Open 2027 Ticket Intelligence incident (24 Oct 2026,
// feedback_unstable_cache_tags_and_revalidation memory), but never actually
// wired into the rollover-event-into-next-year skill until now. A direct
// sportingEvents row UPDATE (rollover's §2) doesn't call revalidateTag —
// nothing does, outside the two curator server actions that already fire
// it (app/curator/events/actions.ts, app/curator/review/actions.ts) — so a
// rolled-over event's title/content stays served from a stale cached
// snapshot for up to an hour unless this is called explicitly.
//
// Usage: node --experimental-strip-types scripts/revalidate-hub-and-spoke-cache.mjs [baseUrl]
// Defaults to http://localhost:3000 for local verification; pass the real
// prod URL as an argv when revalidating a live rollover.
const baseUrl = process.argv[2] ?? "http://localhost:3000";
const secret = process.env.CRON_SECRET;
if (!secret) throw new Error("CRON_SECRET not found in .env.local");

const tags = [
  "hub-and-spoke-spoke-data",
  "trip-intelligence-f1",
  "trip-intelligence-tennis",
  "ticket-intelligence-f1",
  "tennis-ticket-intelligence",
];

const res = await fetch(`${baseUrl}/api/internal/revalidate-cache`, {
  method: "POST",
  headers: { "Content-Type": "application/json", Authorization: `Bearer ${secret}` },
  body: JSON.stringify({ tags }),
});

const body = await res.json().catch(() => null);
console.log("Status:", res.status, body);
