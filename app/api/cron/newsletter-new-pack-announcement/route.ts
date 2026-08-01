import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { and, arrayContains, eq, gt, isNotNull, isNull, lte } from "drizzle-orm";
import { db } from "@/lib/db";
import { sportingEvents, newsletterSubscribers, proSubscriptions, plannerSessions, plannerDripSent } from "@/schema/database";
import { getPlannerEvents } from "@/app/planner/_lib/getPlannerEvents";
import { sumLineItems } from "@/app/planner/_lib/mockEvents";

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
      eq(sportingEvents.isTestEvent, false),
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

  // Same batching/throttle discipline as sendThrottled, but each recipient
  // gets their own subject/html — needed for the planner-waitlist send,
  // where every email is personalized with that person's own saved budget
  // (never the same content for everyone, unlike the newsletter blast above).
  async function sendThrottledPersonalized(
    recipients: { email: string; subject: string; html: string }[]
  ): Promise<{ sent: string[]; failed: { email: string; reason: string }[] }> {
    const sent: string[] = [];
    const failed: { email: string; reason: string }[] = [];
    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const batch = recipients.slice(i, i + BATCH_SIZE);
      const settled = await Promise.allSettled(
        batch.map((r) =>
          resend.emails.send({
            from: "Experiences | Curated <hello@experiences-curated.com>",
            to: r.email,
            subject: r.subject,
            html: r.html,
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

  let plannerWaitlistNotified = 0;

  for (const [eventIndex, event] of events.entries()) {
    if (eventIndex > 0) {
      await new Promise((resolve) => setTimeout(resolve, EVENT_GAP_MS));
    }

    // Post-Planner Drip Sequence — "notified" (Touchpoint 5, design doc).
    // Planner waitlisters for this event get their own personalized email at
    // the same 2-day mark, reusing this cron's existing timing rather than a
    // separate one (design doc: "not a new mechanism"). Per the decided dedup
    // rule (19 Jul 2026), the planner email always wins — a waitlister who is
    // also a newsletter subscriber is excluded from the newsletter send below,
    // same pattern as the existing active-Pro exclusion.
    const waitlisters = await db
      .select()
      .from(plannerSessions)
      .where(and(
        eq(plannerSessions.gateAction, "notified"),
        arrayContains(plannerSessions.gateActionEventIds, [event.id])
      ));

    const waitlisterEmailSet = new Set(waitlisters.map((w) => w.email.toLowerCase()));
    const eventSubscribers = subscribers.filter((sub) => !waitlisterEmailSet.has(sub.email.toLowerCase()));

    if (waitlisters.length > 0) {
      const alreadyNotified = await db
        .select({ plannerSessionId: plannerDripSent.plannerSessionId })
        .from(plannerDripSent)
        .where(eq(plannerDripSent.sequenceStep, "notify_live"));
      const notifiedSessionIds = new Set(alreadyNotified.map((r) => r.plannerSessionId));

      // Dedup by email, not just session ID — plannerSessions has no unique
      // constraint on (email, gateAction, event), so the same person could
      // have clicked "Notify me" for this event more than once, creating
      // multiple rows. Group by email so every duplicate session gets marked
      // notify_live once we send — otherwise an unmarked duplicate row would
      // still qualify on the NEXT cron run and re-send to the same address.
      const notYetNotified = waitlisters.filter((w) => !notifiedSessionIds.has(w.id));
      const sessionIdsByEmail = new Map<string, string[]>();
      for (const w of notYetNotified) {
        const emailKey = w.email.toLowerCase();
        sessionIdsByEmail.set(emailKey, [...(sessionIdsByEmail.get(emailKey) ?? []), w.id]);
      }
      const pending = notYetNotified.filter((w, idx, arr) => arr.findIndex((x) => x.email.toLowerCase() === w.email.toLowerCase()) === idx);

      const personalizedRecipients: { email: string; subject: string; html: string; sessionIds: string[] }[] = [];

      for (const session of pending) {
        const plannerEvents = await getPlannerEvents(session.tripLengthDays, session.originMarket);
        const matchedEvent = plannerEvents.find((e) => e.id === event.id);
        if (!matchedEvent) continue;

        const totalLow = sumLineItems(matchedEvent.lineItems, "low");
        const totalHigh = sumLineItems(matchedEvent.lineItems, "high");
        const totalMid = (totalLow + totalHigh) / 2;
        const budgetMax = Number(session.budgetMax);
        const budgetMin = Number(session.budgetMin);
        const fitsBudget = totalMid <= budgetMax;

        const packUrl = `${SITE_URL}/event-pack/${event.slug}`;
        const breakdownRows = matchedEvent.lineItems
          .map(
            (li) =>
              `<p style="font-size:12px;color:#A3A3A3;margin:0 0 4px">▸ ${li.label}: $${li.low.toLocaleString()}–$${li.high.toLocaleString()}</p>`
          )
          .join("");
        const fitLine = fitsBudget
          ? `<p style="font-size:13px;color:#AAFF00;font-weight:900;margin:8px 0 0">✓ Fits your $${budgetMin.toLocaleString()}–${budgetMax.toLocaleString()} budget</p>`
          : "";

        const html = `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#0A0A0A">
            <div>
              <p style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#AAFF00;margin-bottom:28px">Experiences | Curated</p>
              <h1 style="font-size:20px;font-weight:900;color:#ffffff;margin:0 0 8px">${event.name} is live</h1>
              <p style="font-size:13px;color:#A3A3A3;line-height:1.6;margin:0 0 24px">
                You asked to be notified when the guide was ready — it's here. Grandstands
                and gates, where to stay, where to eat, how to actually get there. The same
                depth as our other packs, built the same way.
              </p>
              <div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid #2A2A2A">
                <p style="font-size:14px;font-weight:900;color:#ffffff;margin:0 0 4px">${matchedEvent.name}</p>
                <p style="font-size:12px;color:#6A6A6A;margin:0 0 10px">${matchedEvent.venue} · ${matchedEvent.dateRange}</p>
                ${breakdownRows}
                <p style="font-size:13px;font-weight:900;color:#ffffff;margin:8px 0 0">Est. trip cost: $${totalLow.toLocaleString()}–$${totalHigh.toLocaleString()}</p>
                ${fitLine}
              </div>
              <a href="${packUrl}" style="display:inline-block;padding:10px 20px;background:#AAFF00;color:#000;font-size:13px;font-weight:900;text-decoration:none;border-radius:2px">Get the pack →</a>
              <hr style="border:none;border-top:1px solid #2A2A2A;margin:32px 0 16px">
              <p style="font-size:11px;color:#6A6A6A">This email was sent because you used our Trip Planner.</p>
            </div>
          </div>
        `;
        const subject = fitsBudget
          ? `${event.name} is live — and it fits your budget`
          : `${event.name} is live — and the guide is ready for you`;

        personalizedRecipients.push({
          email: session.email,
          subject,
          html,
          sessionIds: sessionIdsByEmail.get(session.email.toLowerCase()) ?? [session.id],
        });
      }

      if (personalizedRecipients.length > 0) {
        try {
          const { sent, failed } = await sendThrottledPersonalized(personalizedRecipients);
          const sentSet = new Set(sent);
          for (const r of personalizedRecipients) {
            if (sentSet.has(r.email)) {
              for (const sessionId of r.sessionIds) {
                await db.insert(plannerDripSent).values({ plannerSessionId: sessionId, sequenceStep: "notify_live" }).onConflictDoNothing();
              }
              plannerWaitlistNotified++;
            }
          }
          if (failed.length > 0) {
            console.error(
              `[newsletter-new-pack-announcement] ✗ ${failed.length} planner-waitlist send(s) failed for ${event.name}:`,
              JSON.stringify(failed)
            );
            allFailures.push(...failed.map((f) => ({ eventName: `${event.name} (planner waitlist)`, email: f.email, reason: f.reason })));
          }
        } catch (err) {
          console.error(`[newsletter-new-pack-announcement] unexpected failure sending planner-waitlist emails for ${event.name}`, err);
        }
      }
    }

    if (eventSubscribers.length > 0) {
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
        const { sent, failed } = await sendThrottled(eventSubscribers, subject, html);
        console.log(
          `[newsletter-new-pack-announcement] ${event.name}: ${sent.length}/${eventSubscribers.length} delivered (${allSubscribers.length - subscribers.length} active Pro emails excluded, ${waitlisters.length} planner waitlisters excluded/handled separately)`
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

  console.log(`[newsletter-new-pack-announcement] done — announced: ${announced}, planner waitlisters notified: ${plannerWaitlistNotified}`);
  return NextResponse.json({ ok: true, announced, plannerWaitlistNotified });
}
