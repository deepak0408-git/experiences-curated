import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

// Lets standalone scripts (seed/migrate/activate .mjs files, which run
// outside the Next.js process and so have no way to call revalidateTag
// directly) clear a named unstable_cache entry right after writing to its
// underlying table, instead of waiting up to an hour for the cache's
// time-based revalidate to catch up. In-app curator server actions should
// call revalidateTag directly rather than hitting this over HTTP.
//
// Reuses CRON_SECRET rather than adding a second internal-auth env var —
// same Bearer-token pattern every /api/cron/* route already uses.
//
// Added 24 Oct 2026 after French Open 2027 Tennis Ticket Intelligence's
// activation script (_ratify-activate-french-open.mjs) silently left
// hasTennisTicketIntelligenceCached and getGrandSlamDisplayInfoCached
// stale for up to an hour post-activation — same root cause already found
// once on F1 Trip Intelligence (Spa rating fix, 11 Oct 2026) and present
// across all 9 unstable_cache call sites in the app (see
// feedback_unstable_cache_tags_and_revalidation memory).
export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const tags: unknown = body?.tags;
  if (!Array.isArray(tags) || tags.length === 0 || !tags.every((t) => typeof t === "string")) {
    return NextResponse.json({ error: "Body must be { tags: string[] }" }, { status: 400 });
  }

  for (const tag of tags) {
    // "max" = immediate full invalidation, the documented profile for this
    // use case (Next.js 16 made the second argument required).
    revalidateTag(tag, "max");
  }

  return NextResponse.json({ ok: true, revalidated: tags });
}
