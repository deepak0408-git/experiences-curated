import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { and, eq, gt, isNotNull, isNull, lte } from "drizzle-orm";
import { db } from "@/lib/db";
import { sportingEvents, newsletterSubscribers, proSubscriptions } from "@/schema/database";

const resend = new Resend(process.env.RESEND_API_KEY);
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://experiences-curated.com";
const ALERT_TO = "experiencescurated@gmail.com";

// Fires daily. Announces a newly-activated event pack to newsletter subscribers
// 2 days after Pro subscribers were already notified (via notifyProNewPack in
// app/curator/events/actions.ts) — keeps the "Pro sees it first" promise true
// in substance, not just technically. Active Pro subscribers are excluded from
// this send (email match, case-insensitive) so a subscriber who is also on the
// newsletter list doesn't get the "new pack" announcement twice.
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

  const allSubscribers = await db
    .select({ email: newsletterSubscribers.email })
    .from(newsletterSubscribers);

  // Active Pro subscribers already get a "new pack" email via notifyProNewPack
  // at activation time — exclude them here so they don't get a second email
  // 2 days later for the same pack.
  const activeProEmails = await db
    .select({ email: proSubscriptions.email })
    .from(proSubscriptions)
    .where(gt(proSubscriptions.currentPeriodEnd, now));
  const proEmailSet = new Set(activeProEmails.map((p) => p.email.toLowerCase()));

  const subscribers = allSubscribers.filter((sub) => !proEmailSet.has(sub.email.toLowerCase()));

  // Resend's plan caps at 10 requests/second. Batches of 8 with a 1.2s pause
  // between batches keeps real margin under that limit — a prior version that
  // fired subscribers.length requests at once (up to 50) silently 429'd most
  // of them without throwing, and the code still marked the event as announced
  // (12/13 Jul 2026 incident: 10/20 Hungarian GP sends and 0/20 US Open sends
  // were rate-limited, never delivered, and never retried).
  const BATCH_SIZE = 8;
  const BATCH_DELAY_MS = 1200;
  const EVENT_GAP_MS = 3000; // pause between events, not just between batches within one

  async function sendThrottled(
    recipients: { email: string }[],
    subject: string,
    html: string
  ): Promise<{ sent: string[]; failed: { email: string; reason: string }[] }> {
    const sent: string[] = [];
    const failed: { email: string; reason: string }[] = [];
    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const batch = recipients.slice(i, i + BATCH_SIZE);
      const settled = await Promise.allSettled(
        batch.map((sub) =>
          resend.emails.send({
            from: "Experiences | Curated <hello@experiences-curated.com>",
            to: sub.email,
            subject,
            html,
          })
        )
      );
      settled.forEach((result, idx) => {
        const email = batch[idx].email;
        if (result.status === "fulfilled" && !result.value.error) {
          sent.push(email);
        } else {
          const reason =
            result.status === "rejected"
              ? String(result.reason?.message ?? result.reason)
              : String(result.value?.error?.message ?? "unknown Resend error");
          failed.push({ email, reason });
        }
      });
      if (i + BATCH_SIZE < recipients.length) {
        await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS));
      }
    }
    return { sent, failed };
  }

  let announced = 0;
  const allFailures: { eventName: string; email: string; reason: string }[] = [];

  for (const [eventIndex, event] of events.entries()) {
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

      if (eventIndex > 0) {
        await new Promise((resolve) => setTimeout(resolve, EVENT_GAP_MS));
      }

      try {
        const { sent, failed } = await sendThrottled(subscribers, subject, html);
        console.log(
          `[newsletter-new-pack-announcement] ${event.name}: ${sent.length}/${subscribers.length} delivered (${allSubscribers.length - subscribers.length} active Pro emails excluded)`
        );
        if (failed.length > 0) {
          // Per standing decision (15 Jul 2026): still mark the event as announced
          // once attempted, but log every failed recipient clearly so a human can
          // find and manually repair the gap — see scripts/resend-missed-newsletter-emails.mjs
          // for the repair pattern used on the 12/13 Jul incident.
          console.error(
            `[newsletter-new-pack-announcement] ✗ ${failed.length} failed sends for ${event.name}:`,
            JSON.stringify(failed)
          );
          allFailures.push(...failed.map((f) => ({ eventName: event.name, email: f.email, reason: f.reason })));
        }
      } catch (err) {
        console.error(`[newsletter-new-pack-announcement] unexpected failure for ${event.name}`, err);
        continue; // don't mark as announced if the whole send attempt crashed outright
      }
    }

    await db
      .update(sportingEvents)
      .set({ newsletterAnnouncedAt: now })
      .where(eq(sportingEvents.id, event.id));

    announced++;
  }

  if (allFailures.length > 0) {
    const rows = allFailures
      .map((f) => `<tr><td style="padding:6px 12px;border-bottom:1px solid #2A2A2A">${f.eventName}</td><td style="padding:6px 12px;border-bottom:1px solid #2A2A2A">${f.email}</td><td style="padding:6px 12px;border-bottom:1px solid #2A2A2A;color:#A3A3A3">${f.reason}</td></tr>`)
      .join("");
    const alertHtml = `
      <div style="font-family:sans-serif;max-width:640px;margin:0 auto;padding:32px 24px;background:#0A0A0A">
        <h1 style="font-size:18px;font-weight:900;color:#ffffff;margin:0 0 8px">Newsletter announcement — ${allFailures.length} send(s) failed</h1>
        <p style="font-size:13px;color:#A3A3A3;margin:0 0 20px">The event(s) below were still marked as announced, but these recipients did not receive their email. Use scripts/resend-missed-newsletter-emails.mjs (or a similar throttled repair) to resend to just these addresses.</p>
        <table style="width:100%;border-collapse:collapse;font-size:12px;color:#ffffff">
          <thead><tr><th style="text-align:left;padding:6px 12px;border-bottom:1px solid #2A2A2A">Event</th><th style="text-align:left;padding:6px 12px;border-bottom:1px solid #2A2A2A">Email</th><th style="text-align:left;padding:6px 12px;border-bottom:1px solid #2A2A2A">Reason</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
    try {
      await resend.emails.send({
        from: "Experiences | Curated <hello@experiences-curated.com>",
        to: ALERT_TO,
        subject: `⚠ Newsletter announcement: ${allFailures.length} email(s) failed to send`,
        html: alertHtml,
      });
      console.log(`[newsletter-new-pack-announcement] alert sent to ${ALERT_TO} for ${allFailures.length} failures`);
    } catch (err) {
      console.error("[newsletter-new-pack-announcement] failed to send failure alert email", err);
    }
  }

  console.log(`[newsletter-new-pack-announcement] done — announced: ${announced}`);
  return NextResponse.json({ ok: true, announced });
}
