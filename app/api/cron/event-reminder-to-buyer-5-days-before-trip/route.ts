import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { and, eq, isNull, isNotNull, gt } from "drizzle-orm";
import { db } from "@/lib/db";
import { purchases, proSubscriptions, sportingEvents, eventRemindersSent } from "@/schema/database";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const SITE_URL = "https://www.experiences-curated.com";

function buildEmailHtml(eventName: string, venueName: string | null, magicLink: string) {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;color:#171717">
      <p style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#a3a3a3;margin-bottom:32px">Experiences | Curated</p>
      <h1 style="font-size:22px;font-weight:700;margin-bottom:16px">5 days to ${eventName}.</h1>
      <p style="font-size:14px;color:#525252;line-height:1.6;margin-bottom:8px">
        Your pre-trip brief just went live — weather for the week, the transport situation on the ground,
        and anything new this year that changes how you should plan.
      </p>
      <p style="font-size:14px;color:#525252;line-height:1.6;margin-bottom:32px">
        If you haven't been back to your pack in a while, now's the time — grandstands, hotels,
        where to eat, how to actually get there, all still there waiting.
      </p>
      <a href="${magicLink}"
         style="display:inline-block;background:#171717;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-size:14px;font-weight:600;margin-bottom:16px">
        Read your pre-trip brief
      </a>
      <p style="font-size:12px;color:#a3a3a3;line-height:1.6;margin-top:16px">
        This link signs you straight in — no password needed.
      </p>
      ${venueName ? `<p style="font-size:14px;color:#171717;margin-top:32px">See you at ${venueName}.</p>` : ""}
    </div>
  `;
}

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const fiveDaysFromNow = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
  const targetDate = fiveDaysFromNow.toISOString().split("T")[0];

  // Only events starting exactly 5 days from now, with the pre-trip brief already live
  const events = await db
    .select({
      id: sportingEvents.id,
      name: sportingEvents.name,
      slug: sportingEvents.slug,
      venueName: sportingEvents.venueName,
    })
    .from(sportingEvents)
    .where(and(
      eq(sportingEvents.startDate, targetDate),
      isNotNull(sportingEvents.preTripBriefLiveAt),
    ));

  if (events.length === 0) {
    console.log("[event-reminder-5-days] no qualifying events for", targetDate);
    return NextResponse.json({ ok: true, sent: 0 });
  }

  let sent = 0;

  for (const event of events) {
    // Direct purchasers who haven't had this reminder yet
    const buyers = await db
      .select({ id: purchases.id, email: purchases.email })
      .from(purchases)
      .where(and(
        eq(purchases.sportingEventId, event.id),
        eq(purchases.status, "active"),
        isNull(purchases.preTripReminderSentAt),
      ));

    // Annual Pro members with an active subscription — free access, no purchases row
    const annualProMembers = await db
      .select({ email: proSubscriptions.email })
      .from(proSubscriptions)
      .where(and(
        eq(proSubscriptions.status, "active"),
        eq(proSubscriptions.billingCycle, "annual"),
        isNotNull(proSubscriptions.currentPeriodEnd),
        gt(proSubscriptions.currentPeriodEnd, now),
      ));

    const alreadyRemindedPro = await db
      .select({ email: eventRemindersSent.email })
      .from(eventRemindersSent)
      .where(eq(eventRemindersSent.sportingEventId, event.id));
    const alreadyRemindedEmails = new Set(alreadyRemindedPro.map((r) => r.email));

    const proRecipients = annualProMembers.filter((m) => !alreadyRemindedEmails.has(m.email));

    for (const buyer of buyers) {
      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email: buyer.email,
        options: { redirectTo: `${SITE_URL}/auth/confirm?next=/event-pack/${event.slug}` },
      });

      if (linkError || !linkData?.properties?.action_link) {
        console.error("[event-reminder-5-days] failed to generate link for", buyer.email, linkError);
        continue;
      }

      try {
        await resend.emails.send({
          from: "Experiences | Curated <hello@experiences-curated.com>",
          to: buyer.email,
          subject: `5 days to ${event.name} — your pre-trip brief is ready`,
          html: buildEmailHtml(event.name, event.venueName, linkData.properties.action_link),
        });

        await db
          .update(purchases)
          .set({ preTripReminderSentAt: now })
          .where(eq(purchases.id, buyer.id));

        console.log(`[event-reminder-5-days] ✓ sent to ${buyer.email} — ${event.name}`);
        sent++;
      } catch (err) {
        console.error("[event-reminder-5-days] failed to send to", buyer.email, err);
      }
    }

    for (const pro of proRecipients) {
      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email: pro.email,
        options: { redirectTo: `${SITE_URL}/auth/confirm?next=/event-pack/${event.slug}` },
      });

      if (linkError || !linkData?.properties?.action_link) {
        console.error("[event-reminder-5-days] failed to generate link for", pro.email, linkError);
        continue;
      }

      try {
        await resend.emails.send({
          from: "Experiences | Curated <hello@experiences-curated.com>",
          to: pro.email,
          subject: `5 days to ${event.name} — your pre-trip brief is ready`,
          html: buildEmailHtml(event.name, event.venueName, linkData.properties.action_link),
        });

        await db
          .insert(eventRemindersSent)
          .values({ email: pro.email, sportingEventId: event.id })
          .onConflictDoNothing();

        console.log(`[event-reminder-5-days] ✓ sent to ${pro.email} (Annual Pro) — ${event.name}`);
        sent++;
      } catch (err) {
        console.error("[event-reminder-5-days] failed to send to", pro.email, err);
      }
    }
  }

  console.log(`[event-reminder-5-days] done — sent: ${sent}`);
  return NextResponse.json({ ok: true, sent });
}
