import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { and, eq, isNotNull, isNull, lte } from "drizzle-orm";
import { db } from "@/lib/db";
import { sportingEvents, newsletterSubscribers } from "@/schema/database";

const resend = new Resend(process.env.RESEND_API_KEY);
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://experiences-curated.com";

// Fires daily. Announces a newly-activated event pack to newsletter subscribers
// 2 days after Pro subscribers were already notified (via notifyProNewPack in
// app/curator/events/actions.ts) — keeps the "Pro sees it first" promise true
// in substance, not just technically.
export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

  // Events activated at least 2 days ago, not yet announced to the newsletter list
  const events = await db
    .select({
      id: sportingEvents.id,
      name: sportingEvents.name,
      slug: sportingEvents.slug,
    })
    .from(sportingEvents)
    .where(and(
      isNotNull(sportingEvents.activatedAt),
      lte(sportingEvents.activatedAt, twoDaysAgo),
      isNull(sportingEvents.newsletterAnnouncedAt),
      eq(sportingEvents.isHidden, false),
    ));

  if (events.length === 0) {
    console.log("[newsletter-new-pack-announcement] no events to announce");
    return NextResponse.json({ ok: true, announced: 0 });
  }

  const subscribers = await db
    .select({ email: newsletterSubscribers.email })
    .from(newsletterSubscribers);

  let announced = 0;

  for (const event of events) {
    if (subscribers.length > 0) {
      const packUrl = `${SITE_URL}/event-pack/${event.slug}`;
      const html = `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:40px 24px;background:#0A0A0A">
          <p style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#AAFF00;margin-bottom:28px">New Pack</p>
          <h1 style="font-size:20px;font-weight:900;color:#ffffff;margin:0 0 8px">New event pack just dropped</h1>
          <p style="font-size:16px;font-weight:900;color:#ffffff;margin:0 0 20px">${event.name}</p>
          <p style="font-size:13px;color:#A3A3A3;line-height:1.6;margin:0 0 24px">
            The full guide is live — grandstands and gates, where to stay, where to eat,
            how to actually get there. The same depth as our other packs, built the same way.
          </p>
          <a href="${packUrl}" style="display:inline-block;padding:10px 20px;background:#AAFF00;color:#000;font-size:13px;font-weight:900;text-decoration:none;border-radius:2px">Get the pack →</a>
          <hr style="border:none;border-top:1px solid #2A2A2A;margin:32px 0 16px">
          <p style="font-size:11px;color:#6A6A6A">You're getting this because you're subscribed to Experiences | Curated updates.</p>
        </div>
      `;
      const subject = `New Event Pack: ${event.name} — the full guide is live`;

      try {
        for (let i = 0; i < subscribers.length; i += 50) {
          await Promise.all(
            subscribers.slice(i, i + 50).map((sub) =>
              resend.emails.send({
                from: "Experiences | Curated <hello@experiences-curated.com>",
                to: sub.email,
                subject,
                html,
              })
            )
          );
        }
        console.log(`[newsletter-new-pack-announcement] ✓ announced ${event.name} to ${subscribers.length} subscribers`);
      } catch (err) {
        console.error(`[newsletter-new-pack-announcement] failed batch for ${event.name}`, err);
        continue; // don't mark as announced if the send failed
      }
    }

    await db
      .update(sportingEvents)
      .set({ newsletterAnnouncedAt: now })
      .where(eq(sportingEvents.id, event.id));

    announced++;
  }

  console.log(`[newsletter-new-pack-announcement] done — announced: ${announced}`);
  return NextResponse.json({ ok: true, announced });
}
