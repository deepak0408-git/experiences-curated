import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { purchases, sportingEvents } from "@/schema/database";

const resend = new Resend(process.env.RESEND_API_KEY);

// Fires daily, 2 days before an event's startDate. Offers the async
// mini-plan concierge service ("G2") to active purchasers who haven't
// received this specific outreach yet. Distinct from
// event-reminder-to-buyer-5-days-before-trip (pre-trip brief nudge) —
// this is a sales/concierge offer, not a content reminder.
export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
  const targetDate = twoDaysFromNow.toISOString().split("T")[0];

  const events = await db
    .select({ id: sportingEvents.id, name: sportingEvents.name })
    .from(sportingEvents)
    .where(eq(sportingEvents.startDate, targetDate));

  if (events.length === 0) {
    console.log("[concierge-outreach-pre-trip] no qualifying events for", targetDate);
    return NextResponse.json({ ok: true, sent: 0 });
  }

  let sent = 0;

  for (const event of events) {
    const candidates = await db
      .select({ id: purchases.id, email: purchases.email })
      .from(purchases)
      .where(and(
        eq(purchases.sportingEventId, event.id),
        eq(purchases.status, "active"),
        isNull(purchases.conciergeOutreachPreTripSentAt),
      ));

    for (const purchase of candidates) {
      try {
        await resend.emails.send({
          from: "Experiences | Curated <hello@experiences-curated.com>",
          to: purchase.email,
          subject: `Enjoy ${event.name} this weekend — quick help if you need it`,
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#0A0A0A">
              <p style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#AAFF00;margin-bottom:28px">Experiences | Curated</p>
              <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">Hi there,</p>
              <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">
                Hope you're just about heading out, ${event.name} kicks off shortly. If anything comes up over the next few days, where to eat nearby, how to beat the exit queues, anything at all, just reply and tell me what you're stuck on.
              </p>
              <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:32px">
                I'll write back with a real, specific answer, not a form reply, usually within a few hours during the event.
              </p>
              <p style="font-size:14px;color:#ffffff;font-weight:900">The Experiences | Curated team</p>
            </div>
          `,
        });

        await db
          .update(purchases)
          .set({ conciergeOutreachPreTripSentAt: now })
          .where(eq(purchases.id, purchase.id));

        console.log(`[concierge-outreach-pre-trip] ✓ sent to ${purchase.email} — ${event.name}`);
        sent++;
      } catch (err) {
        console.error("[concierge-outreach-pre-trip] failed to send to", purchase.email, err);
      }
    }
  }

  console.log(`[concierge-outreach-pre-trip] done — sent: ${sent}`);
  return NextResponse.json({ ok: true, sent });
}
