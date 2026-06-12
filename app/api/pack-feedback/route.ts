import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { db } from "@/lib/db";
import { eventPackFeedback, sportingEvents } from "@/schema/database";
import { eq, and } from "drizzle-orm";

const resend = new Resend(process.env.RESEND_API_KEY);
const SITE_URL = "https://www.experiences-curated.com";
const NOTIFY_TO = "experiencescurated@gmail.com";

const STAR_LABELS: Record<number, string> = {
  1: "Poor", 2: "Below average", 3: "Average", 4: "Good", 5: "Excellent",
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ratingStr = searchParams.get("rating");
  const eventId = searchParams.get("eventId");
  const email = searchParams.get("email");

  if (!ratingStr || !eventId || !email) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const rating = parseInt(ratingStr, 10);
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
  }

  const [event] = await db
    .select({ name: sportingEvents.name })
    .from(sportingEvents)
    .where(eq(sportingEvents.id, eventId))
    .limit(1);

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  // Upsert feedback row
  await db
    .insert(eventPackFeedback)
    .values({ email, sportingEventId: eventId, rating })
    .onConflictDoUpdate({
      target: [eventPackFeedback.email, eventPackFeedback.sportingEventId],
      set: { rating, comment: null, displayConsent: false, updatedAt: new Date() },
    });

  const thanksUrl = `${SITE_URL}/pack-feedback/thanks?eventId=${eventId}&rating=${rating}&email=${encodeURIComponent(email)}`;
  return NextResponse.redirect(thanksUrl);
}
