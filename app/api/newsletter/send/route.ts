import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { db } from "@/lib/db";
import { newsletterSubscribers, proSubscriptions } from "@/schema/database";
import { gt, ilike, inArray } from "drizzle-orm";

const resend = new Resend(process.env.RESEND_API_KEY);
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.experiences-curated.com";

// Manually triggered by the build-newsletter skill, never a public or cron
// endpoint — gated on the same CRON_SECRET used by every cron route in this
// codebase, since the real caller here is a trusted backend action (a script
// run on the curator's behalf), not a browser session.
//
// mode: "test"  -> sends only to the recipients array provided (used for the
//                  single-recipient approval send to the founder's own inbox)
// mode: "live"  -> sends to every real newsletter_subscribers row, excluding
//                  active Pro subscribers (same dedup rule as
//                  newsletter-new-pack-announcement's cron) — never call this
//                  mode without the founder's explicit go-ahead on both the
//                  exact HTML and the exact recipient list, per the standing
//                  "never send without per-draft, per-recipient-list approval"
//                  rule.
export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { mode, subject, html, testRecipients } = body as {
    mode: "test" | "live";
    subject: string;
    html: string;
    testRecipients?: string[];
  };

  if (!subject || !html) {
    return NextResponse.json({ error: "Missing subject or html" }, { status: 400 });
  }

  let recipients: string[];

  if (mode === "test") {
    if (!testRecipients || testRecipients.length === 0) {
      return NextResponse.json({ error: "testRecipients required for mode=test" }, { status: 400 });
    }
    recipients = testRecipients;
  } else if (mode === "live") {
    const allSubscribers = await db.select({ email: newsletterSubscribers.email }).from(newsletterSubscribers);
    const activePro = await db.select({ email: proSubscriptions.email }).from(proSubscriptions).where(gt(proSubscriptions.currentPeriodEnd, new Date()));
    const proEmailSet = new Set(activePro.map((p) => p.email.toLowerCase()));
    recipients = allSubscribers.map((s) => s.email).filter((e) => !proEmailSet.has(e.toLowerCase()));
  } else {
    return NextResponse.json({ error: "mode must be 'test' or 'live'" }, { status: 400 });
  }

  // Real unsubscribe links are per-recipient — {{unsubscribe_url}} in the
  // template gets substituted with each subscriber's own
  // /newsletter/unsubscribe/[id] link (that page deletes the row keyed by
  // id, see app/newsletter/unsubscribe/[id]/page.tsx). A recipient not
  // found in newsletter_subscribers (e.g. a test address that was never
  // actually subscribed) falls back to the plain /newsletter signup page
  // rather than a broken/dead link.
  const subscriberRows = await db
    .select({ id: newsletterSubscribers.id, email: newsletterSubscribers.email })
    .from(newsletterSubscribers)
    .where(inArray(newsletterSubscribers.email, recipients));
  const idByEmail = new Map(subscriberRows.map((r) => [r.email.toLowerCase(), r.id]));

  function unsubscribeUrlFor(email: string) {
    const id = idByEmail.get(email.toLowerCase());
    return id ? `${SITE_URL}/newsletter/unsubscribe/${id}` : `${SITE_URL}/newsletter`;
  }

  // Same throttle discipline as newsletter-new-pack-announcement — Resend
  // caps at 10 req/sec, batches of 8 with a pause keeps real margin under
  // that limit.
  const BATCH_SIZE = 8;
  const BATCH_DELAY_MS = 1200;

  const sent: string[] = [];
  const failed: { email: string; reason: string }[] = [];

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const batch = recipients.slice(i, i + BATCH_SIZE);
    const settled = await Promise.allSettled(
      batch.map((email) => {
        const personalizedHtml = html.replaceAll("{{unsubscribe_url}}", unsubscribeUrlFor(email));
        return resend.emails.send({
          from: "Experiences | Curated <hello@experiences-curated.com>",
          to: email,
          subject,
          html: personalizedHtml,
        });
      })
    );
    settled.forEach((result, idx) => {
      const email = batch[idx];
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

  return NextResponse.json({
    ok: true,
    mode,
    totalRecipients: recipients.length,
    sent: sent.length,
    failed,
  });
}
