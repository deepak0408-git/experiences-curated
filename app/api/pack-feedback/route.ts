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

  // Notify curator
  try {
    await resend.emails.send({
      from: "Experiences | Curated <hello@experiences-curated.com>",
      to: NOTIFY_TO,
      subject: `Pack feedback: ${STAR_LABELS[rating]} (${rating}/5) — ${event.name}`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;color:#171717">
          <p style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#a3a3a3;margin-bottom:32px">Experiences | Curated — Feedback</p>
          <h1 style="font-size:20px;font-weight:700;margin-bottom:16px">New pack feedback received</h1>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
            <tr><td style="padding:8px 0;font-size:13px;color:#a3a3a3;width:120px">Event</td><td style="padding:8px 0;font-size:13px;font-weight:600;color:#171717">${event.name}</td></tr>
            <tr><td style="padding:8px 0;font-size:13px;color:#a3a3a3">Email</td><td style="padding:8px 0;font-size:13px;color:#171717">${email}</td></tr>
            <tr><td style="padding:8px 0;font-size:13px;color:#a3a3a3">Rating</td><td style="padding:8px 0;font-size:13px;font-weight:600;color:#171717">${"★".repeat(rating)}${"☆".repeat(5 - rating)} (${rating}/5 — ${STAR_LABELS[rating]})</td></tr>
          </table>
          <p style="font-size:12px;color:#a3a3a3">Comment and consent (if provided) will arrive in a follow-up notification.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("[pack-feedback] failed to send notification", err);
  }

  const thanksUrl = `${SITE_URL}/pack-feedback/thanks?eventId=${eventId}&rating=${rating}&email=${encodeURIComponent(email)}`;
  return NextResponse.redirect(thanksUrl);
}
