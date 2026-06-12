import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { db } from "@/lib/db";
import { eventPackFeedback, sportingEvents } from "@/schema/database";
import { eq, and } from "drizzle-orm";

const resend = new Resend(process.env.RESEND_API_KEY);
const NOTIFY_TO = "experiencescurated@gmail.com";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, eventId, comment, displayConsent } = body;

  if (!email || !eventId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  await db
    .update(eventPackFeedback)
    .set({
      comment: comment?.trim() || null,
      displayConsent: !!displayConsent,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(eventPackFeedback.email, email),
        eq(eventPackFeedback.sportingEventId, eventId)
      )
    );

  // Fetch the full row for notification
  const [row] = await db
    .select({
      rating: eventPackFeedback.rating,
      comment: eventPackFeedback.comment,
      displayConsent: eventPackFeedback.displayConsent,
      eventName: sportingEvents.name,
    })
    .from(eventPackFeedback)
    .innerJoin(sportingEvents, eq(eventPackFeedback.sportingEventId, sportingEvents.id))
    .where(
      and(
        eq(eventPackFeedback.email, email),
        eq(eventPackFeedback.sportingEventId, eventId)
      )
    )
    .limit(1);

  if (row) {
    try {
      await resend.emails.send({
        from: "Experiences | Curated <hello@experiences-curated.com>",
        to: NOTIFY_TO,
        subject: `Pack feedback: ${"★".repeat(row.rating)} (${row.rating}/5) — ${row.eventName}`,
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;color:#171717">
            <p style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#a3a3a3;margin-bottom:32px">Experiences | Curated — Feedback</p>
            <h1 style="font-size:20px;font-weight:700;margin-bottom:16px">New pack feedback received</h1>
            <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
              <tr><td style="padding:8px 0;font-size:13px;color:#a3a3a3;width:120px">Event</td><td style="padding:8px 0;font-size:13px;font-weight:600;color:#171717">${row.eventName}</td></tr>
              <tr><td style="padding:8px 0;font-size:13px;color:#a3a3a3">Email</td><td style="padding:8px 0;font-size:13px;color:#171717">${email}</td></tr>
              <tr><td style="padding:8px 0;font-size:13px;color:#a3a3a3">Rating</td><td style="padding:8px 0;font-size:13px;font-weight:600;color:#171717">${"★".repeat(row.rating)}${"☆".repeat(5 - row.rating)} (${row.rating}/5)</td></tr>
              ${row.comment ? `<tr><td style="padding:8px 0;font-size:13px;color:#a3a3a3;vertical-align:top">Comment</td><td style="padding:8px 0;font-size:13px;color:#171717;font-style:italic">"${row.comment}"</td></tr>` : ""}
              ${row.comment ? `<tr><td style="padding:8px 0;font-size:13px;color:#a3a3a3">Can share?</td><td style="padding:8px 0;font-size:13px;font-weight:600;color:${row.displayConsent ? "#16a34a" : "#dc2626"}">${row.displayConsent ? "Yes — approved for display" : "No"}</td></tr>` : ""}
            </table>
          </div>
        `,
      });
    } catch (err) {
      console.error("[pack-feedback/comment] failed to send notification", err);
    }
  }

  return NextResponse.json({ ok: true });
}
