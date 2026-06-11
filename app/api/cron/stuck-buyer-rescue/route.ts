import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { and, eq, gte, isNull, lt } from "drizzle-orm";
import { db } from "@/lib/db";
import { purchases, sportingEvents } from "@/schema/database";

const resend = new Resend(process.env.RESEND_API_KEY);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://experiences-curated.com";

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Find purchases that are active, old enough for link to have expired,
  // recent enough to still be worth rescuing, and not yet rescued
  const candidates = await db
    .select({
      id: purchases.id,
      email: purchases.email,
      purchasedAt: purchases.purchasedAt,
      eventName: sportingEvents.name,
      eventSlug: sportingEvents.slug,
    })
    .from(purchases)
    .leftJoin(sportingEvents, eq(purchases.sportingEventId, sportingEvents.id))
    .where(and(
      eq(purchases.status, "active"),
      lt(purchases.purchasedAt, twoHoursAgo),
      gte(purchases.purchasedAt, sevenDaysAgo),
      isNull(purchases.rescueSentAt),
    ));

  if (candidates.length === 0) {
    console.log("[stuck-buyer-rescue] no candidates found");
    return NextResponse.json({ ok: true, rescued: 0 });
  }

  let rescued = 0;
  let skipped = 0;

  for (const purchase of candidates) {
    // Check if buyer has ever signed in via Supabase Auth
    const { data: { users: authUsers } } = await supabaseAdmin.auth.admin.listUsers();
    const authUser = authUsers.find(u => u.email === purchase.email);

    // Skip if they've already signed in
    if (authUser?.last_sign_in_at) {
      skipped++;
      continue;
    }

    const packUrl = `${SITE_URL}/event-pack/${purchase.eventSlug}`;
    const eventName = purchase.eventName ?? "your event";

    // Generate a fresh magic link (24hr expiry)
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: purchase.email,
      options: {
        redirectTo: `${SITE_URL}/auth/confirm?next=/event-pack/${purchase.eventSlug}`,
      },
    });

    if (linkError || !linkData?.properties?.action_link) {
      console.error("[stuck-buyer-rescue] failed to generate link for", purchase.email, linkError);
      continue;
    }

    const magicLink = linkData.properties.action_link;

    // Send rescue email
    try {
      await resend.emails.send({
        from: "Experiences | Curated <hello@experiences-curated.com>",
        to: purchase.email,
        subject: `Your ${eventName} pack is ready and waiting`,
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;color:#171717">
            <p style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#a3a3a3;margin-bottom:32px">Experiences | Curated</p>
            <h1 style="font-size:22px;font-weight:700;margin-bottom:16px">Your pack is ready and waiting</h1>
            <p style="font-size:14px;color:#525252;line-height:1.6;margin-bottom:32px">
              Your <strong>${eventName}</strong> pack is ready and waiting — here's a fresh link to access it.
            </p>
            <a href="${magicLink}"
               style="display:inline-block;background:#171717;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-size:14px;font-weight:600;margin-bottom:32px">
              Open your pack
            </a>
            <p style="font-size:13px;color:#a3a3a3;line-height:1.6;margin-bottom:32px">
              Your purchase is safe. This link is valid for 24 hours — if you need any help, just reply to this email.
            </p>
            <hr style="border:none;border-top:1px solid #e5e5e5;margin-bottom:24px">
            <p style="font-size:12px;color:#a3a3a3;line-height:1.6">
              Sent to ${purchase.email}.<br>
              You're receiving this because you purchased the ${eventName} pack.
            </p>
          </div>
        `,
      });

      // Stamp rescueSentAt so we never email this purchase again
      await db
        .update(purchases)
        .set({ rescueSentAt: now })
        .where(eq(purchases.id, purchase.id));

      console.log(`[stuck-buyer-rescue] ✓ rescued ${purchase.email} — ${eventName}`);
      rescued++;
    } catch (err) {
      console.error("[stuck-buyer-rescue] failed to send rescue email to", purchase.email, err);
    }
  }

  console.log(`[stuck-buyer-rescue] done — rescued: ${rescued}, skipped (already signed in): ${skipped}`);
  return NextResponse.json({ ok: true, rescued, skipped });
}
