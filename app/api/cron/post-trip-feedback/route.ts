import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { purchases, sportingEvents } from "@/schema/database";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const SITE_URL = "https://www.experiences-curated.com";

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  // Target events that ended exactly 2 days ago
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const targetDate = twoDaysAgo.toISOString().split("T")[0];

  // Find all active purchases for events that ended 2 days ago, not yet emailed
  const candidates = await db
    .select({
      id: purchases.id,
      email: purchases.email,
      sportingEventId: purchases.sportingEventId,
      eventName: sportingEvents.name,
      eventSlug: sportingEvents.slug,
    })
    .from(purchases)
    .innerJoin(sportingEvents, eq(purchases.sportingEventId, sportingEvents.id))
    .where(and(
      eq(purchases.status, "active"),
      eq(sportingEvents.endDate, targetDate),
      isNull(purchases.postTripEmailSentAt),
    ));

  if (candidates.length === 0) {
    console.log("[post-trip-feedback] no candidates for", targetDate);
    return NextResponse.json({ ok: true, sent: 0 });
  }

  let sent = 0;

  for (const purchase of candidates) {
    // Generate magic link into My Travels with event context
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: purchase.email,
      options: {
        redirectTo: `${SITE_URL}/auth/confirm?next=/my-travels?event=${purchase.sportingEventId}`,
      },
    });

    if (linkError || !linkData?.properties?.action_link) {
      console.error("[post-trip-feedback] failed to generate link for", purchase.email, linkError);
      continue;
    }

    const magicLink = linkData.properties.action_link;
    const eventName = purchase.eventName;

    try {
      await resend.emails.send({
        from: "Experiences | Curated <hello@experiences-curated.com>",
        to: purchase.email,
        subject: `How was ${eventName}?`,
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;color:#171717">
            <p style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#a3a3a3;margin-bottom:32px">Experiences | Curated</p>
            <h1 style="font-size:22px;font-weight:700;margin-bottom:16px">How was ${eventName}?</h1>
            <p style="font-size:14px;color:#525252;line-height:1.6;margin-bottom:8px">
              Hope it was a great trip. We'd love to know which experiences were the highlights.
            </p>
            <p style="font-size:14px;color:#525252;line-height:1.6;margin-bottom:32px">
              It takes two minutes — tap a star rating on the experiences you did, add a mood tag if you like, and you're done.
            </p>
            <a href="${magicLink}"
               style="display:inline-block;background:#171717;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-size:14px;font-weight:600;margin-bottom:32px">
              Rate your experiences
            </a>
            <p style="font-size:13px;color:#a3a3a3;line-height:1.6;margin-bottom:32px">
              This link signs you straight in — no password needed. Valid for 24 hours.
            </p>
            <hr style="border:none;border-top:1px solid #e5e5e5;margin-bottom:24px">
            <p style="font-size:12px;color:#a3a3a3;line-height:1.6">
              Sent to ${purchase.email}.<br>
              You're receiving this because you purchased the ${eventName} pack from Experiences | Curated.
            </p>
          </div>
        `,
      });

      await db
        .update(purchases)
        .set({ postTripEmailSentAt: now })
        .where(eq(purchases.id, purchase.id));

      console.log(`[post-trip-feedback] ✓ sent to ${purchase.email} — ${eventName}`);
      sent++;
    } catch (err) {
      console.error("[post-trip-feedback] failed to send to", purchase.email, err);
    }
  }

  console.log(`[post-trip-feedback] done — sent: ${sent}`);
  return NextResponse.json({ ok: true, sent });
}
