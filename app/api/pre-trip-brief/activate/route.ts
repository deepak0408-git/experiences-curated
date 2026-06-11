import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { sportingEvents } from "@/schema/database";

// Always use production URL for pack links — this route is triggered from email
const PRODUCTION_URL = "https://experiences-curated.com";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const slug = searchParams.get("slug");

  if (!token || !slug) {
    return new NextResponse("Missing token or slug", { status: 400 });
  }

  // Find the event with matching token and slug
  const [event] = await db
    .select({ id: sportingEvents.id, name: sportingEvents.name, preTripBriefLiveAt: sportingEvents.preTripBriefLiveAt })
    .from(sportingEvents)
    .where(and(
      eq(sportingEvents.slug, slug),
      eq(sportingEvents.preTripBriefApprovalToken, token),
    ))
    .limit(1);

  if (!event) {
    // Token invalid or already used
    return new NextResponse(
      `<html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;max-width:480px;margin:80px auto;padding:0 24px">
        <h2>Link expired or already used</h2>
        <p>This activation link is no longer valid. A new reminder will be sent tomorrow if the brief hasn't been activated yet.</p>
      </body></html>`,
      { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  if (event.preTripBriefLiveAt) {
    return new NextResponse(
      `<html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;max-width:480px;margin:80px auto;padding:0 24px">
        <h2>Already activated</h2>
        <p>The pre-trip brief for <strong>${event.name}</strong> is already live.</p>
      </body></html>`,
      { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  // Activate the brief and consume the token
  await db
    .update(sportingEvents)
    .set({
      preTripBriefLiveAt: new Date(),
      preTripBriefApprovalToken: null,
      updatedAt: new Date(),
    })
    .where(eq(sportingEvents.id, event.id));

  console.log(`[pre-trip-brief] ✓ activated for ${event.name}`);

  return new NextResponse(
    `<html><head><meta charset="utf-8"></head><body style="font-family:sans-serif;max-width:480px;margin:80px auto;padding:0 24px;color:#171717">
      <p style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#a3a3a3;margin-bottom:32px">Experiences | Curated</p>
      <h2 style="font-size:22px;font-weight:700;margin-bottom:16px">Pre-Trip Brief activated &#10003;</h2>
      <p style="font-size:14px;color:#525252;line-height:1.6">
        The pre-trip brief for <strong>${event.name}</strong> is now live for all pack holders.
      </p>
      <p style="margin-top:24px"><a href="${PRODUCTION_URL}/event-pack/${slug}" style="color:#171717">View pack &#8594;</a></p>
    </body></html>`,
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
