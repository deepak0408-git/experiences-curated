import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { purchases, sportingEvents } from "@/schema/database";

const resend = new Resend(process.env.RESEND_API_KEY);

// Fires daily, 5 days after an event's endDate. Offers the async mini-plan
// concierge service ("G2") to active purchasers who haven't received this
// specific outreach yet, framed as "thinking about your next trip."
// Distinct from post-trip-feedback (star-rating request) — this is a
// sales/concierge offer, not a feedback ask. Runs after post-trip-feedback
// (which fires at +2 days) so it doesn't compete with that email in the
// same inbox window.
export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
  const targetDate = fiveDaysAgo.toISOString().split("T")[0];

  const candidates = await db
    .select({
      id: purchases.id,
      email: purchases.email,
      eventName: sportingEvents.name,
    })
    .from(purchases)
    .innerJoin(sportingEvents, eq(purchases.sportingEventId, sportingEvents.id))
    .where(and(
      eq(purchases.status, "active"),
      eq(sportingEvents.endDate, targetDate),
      isNull(purchases.conciergeOutreachPostTripSentAt),
    ));

  if (candidates.length === 0) {
    console.log("[concierge-outreach-post-trip] no candidates for", targetDate);
    return NextResponse.json({ ok: true, sent: 0 });
  }

  let sent = 0;

  for (const purchase of candidates) {
    try {
      await resend.emails.send({
        from: "Experiences | Curated <hello@experiences-curated.com>",
        to: purchase.email,
        subject: "Thinking about your next sports event trip? Can we help?",
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#0A0A0A">
            <p style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#AAFF00;margin-bottom:28px">Experiences | Curated</p>
            <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">Hi there,</p>
            <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">
              Hope you found our ${purchase.eventName} pack worth your time. I wanted to let you know about something new: if you're starting to think about your next sports event, wherever that might be, send me any questions that you may have — how to plan tickets, best grandstands, where to stay, how to travel — and I'll write back with a real, specific answer within 48 hours. Not a form reply, proper research, same as goes into the packs.
            </p>
            <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:32px">
              No pressure if you're not planning anything yet, just wanted you to know it's there.
            </p>
            <p style="font-size:14px;color:#ffffff;font-weight:900">The Experiences | Curated team</p>
          </div>
        `,
      });

      await db
        .update(purchases)
        .set({ conciergeOutreachPostTripSentAt: now })
        .where(eq(purchases.id, purchase.id));

      console.log(`[concierge-outreach-post-trip] ✓ sent to ${purchase.email} — ${purchase.eventName}`);
      sent++;
    } catch (err) {
      console.error("[concierge-outreach-post-trip] failed to send to", purchase.email, err);
    }
  }

  console.log(`[concierge-outreach-post-trip] done — sent: ${sent}`);
  return NextResponse.json({ ok: true, sent });
}
