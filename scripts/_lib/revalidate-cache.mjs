// Shared helper for standalone scripts to bust a named unstable_cache entry
// right after writing to its underlying table, instead of leaving it to the
// cache's 1-hour time-based revalidate. Hits the app's internal
// /api/internal/revalidate-cache route (in-app curator server actions call
// revalidateTag directly instead — no HTTP needed there).
//
// Points at production by default — scripts run against prod data unless
// NEXT_PUBLIC_SITE_URL is overridden to localhost, same convention as
// resend-missed-newsletter-emails.mjs's SITE_URL fallback.
//
// Added 24 Oct 2026 — see feedback_unstable_cache_tags_and_revalidation
// memory for the incident (French Open 2027 Tennis Ticket Intelligence
// activation silently stale for up to an hour) that prompted this.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://experiences-curated.com";

export async function revalidateCacheTags(tags) {
  if (!process.env.CRON_SECRET) {
    console.warn(`[revalidate-cache] CRON_SECRET not set — skipping revalidation of: ${tags.join(", ")}`);
    return;
  }

  try {
    const res = await fetch(`${SITE_URL}/api/internal/revalidate-cache`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CRON_SECRET}`,
      },
      body: JSON.stringify({ tags }),
    });

    if (!res.ok) {
      console.warn(`[revalidate-cache] request failed (${res.status}) for: ${tags.join(", ")}`);
      return;
    }

    console.log(`[revalidate-cache] revalidated: ${tags.join(", ")}`);
  } catch (err) {
    // Never let a revalidation failure fail the whole script — the DB write
    // already succeeded; this is best-effort freshness, not correctness.
    console.warn(`[revalidate-cache] request errored for: ${tags.join(", ")}`, err);
  }
}
