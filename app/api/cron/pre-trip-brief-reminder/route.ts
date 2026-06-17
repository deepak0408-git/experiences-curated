import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { and, eq, gte, isNull, lte } from "drizzle-orm";
import { db } from "@/lib/db";
import { sportingEvents } from "@/schema/database";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);
// Always use production URL — this email is sent to an external inbox
const SITE_URL = "https://www.experiences-curated.com";
const REPORT_TO = "experiencescurated@gmail.com";

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const tenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Find events starting within 7 days that don't have a brief live yet
  // and haven't already had an approval token sent today
  const candidates = await db
    .select({
      id: sportingEvents.id,
      name: sportingEvents.name,
      slug: sportingEvents.slug,
      startDate: sportingEvents.startDate,
      preTripBriefLiveAt: sportingEvents.preTripBriefLiveAt,
    })
    .from(sportingEvents)
    .where(and(
      lte(sportingEvents.startDate, tenDaysFromNow.toISOString().split("T")[0]),
      gte(sportingEvents.startDate, now.toISOString().split("T")[0]),
      isNull(sportingEvents.preTripBriefLiveAt),
    ));

  if (candidates.length === 0) {
    console.log("[pre-trip-brief-reminder] no events need activation");
    return NextResponse.json({ ok: true, reminded: 0 });
  }

  let reminded = 0;

  for (const event of candidates) {
    // Generate a fresh one-time token
    const token = crypto.randomBytes(32).toString("hex");

    // Store token on the event row
    await db
      .update(sportingEvents)
      .set({ preTripBriefApprovalToken: token, updatedAt: now })
      .where(eq(sportingEvents.id, event.id));

    const approveUrl = `${SITE_URL}/api/pre-trip-brief/activate?token=${token}&slug=${event.slug}`;
    const daysUntil = Math.ceil((new Date(event.startDate).getTime() - now.getTime()) / (24 * 60 * 60 * 1000));

    try {
      await resend.emails.send({
        from: "Experiences | Curated <hello@experiences-curated.com>",
        to: REPORT_TO,
        subject: `Action needed: Activate pre-trip brief for ${event.name} (${daysUntil} days away)`,
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;color:#171717">
            <p style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#a3a3a3;margin-bottom:32px">Experiences | Curated — Operations</p>
            <h1 style="font-size:20px;font-weight:700;margin-bottom:16px">Pre-trip brief ready to activate</h1>
            <p style="font-size:14px;color:#525252;line-height:1.6;margin-bottom:8px">
              <strong>${event.name}</strong> starts in <strong>${daysUntil} day${daysUntil === 1 ? "" : "s"}</strong> (${new Date(event.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}).
            </p>
            <p style="font-size:14px;color:#525252;line-height:1.6;margin-bottom:32px">
              Click below to activate the pre-trip brief for all pack holders. Make sure the brief content in PackView.tsx is finalised before approving.
            </p>
            <a href="${approveUrl}"
               style="display:inline-block;background:#171717;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-size:14px;font-weight:600;margin-bottom:16px">
              ✅ Activate brief now
            </a>
            <p style="font-size:12px;color:#a3a3a3;line-height:1.6;margin-top:16px">
              If the brief content isn't ready yet, ignore this email — you'll receive another reminder tomorrow.
              This link expires when you click it or when a new reminder is sent.
            </p>
            <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0">
            <p style="font-size:12px;color:#a3a3a3">
              Event: ${event.name} · Slug: ${event.slug}
            </p>
          </div>
        `,
      });

      console.log(`[pre-trip-brief-reminder] ✓ reminder sent for ${event.name} (${daysUntil} days)`);
      reminded++;
    } catch (err) {
      console.error("[pre-trip-brief-reminder] failed to send reminder for", event.name, err);
    }
  }

  return NextResponse.json({ ok: true, reminded });
}
