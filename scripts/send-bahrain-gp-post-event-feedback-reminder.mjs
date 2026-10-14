import { config } from "dotenv";
config({ path: ".env.local" });

import { Resend } from "resend";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { purchases, sportingEvents } from "../schema/database.ts";

const resend = new Resend(process.env.RESEND_API_KEY);
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SITE_URL = "https://www.experiences-curated.com";
const EVENT_SLUG = "bahrain-grand-prix";
const EVENT_NAME = "Bahrain GP 2026";

const TEST_MODE = process.argv.includes("--test");
const TEST_RECIPIENT = "deepak0408@gmail.com";

const [event] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, EVENT_SLUG));

if (!event) {
  console.error("Event not found");
  process.exit(1);
}

const EXCLUDE = ["deepak0408@gmail.com", "deepu2_2000@yahoo.com"];

let recipients;
if (TEST_MODE) {
  recipients = [{ email: TEST_RECIPIENT }];
} else {
  const buyers = await db
    .select({ email: purchases.email, status: purchases.status })
    .from(purchases)
    .where(eq(purchases.sportingEventId, event.id));
  recipients = buyers.filter(
    (b) => b.email && b.email !== "[deleted]" && b.status === "active" && !EXCLUDE.includes(b.email)
  );
}

console.log(`\n${TEST_MODE ? "[TEST] Sending" : "Sending"} to ${recipients.length} recipient(s):`);
recipients.forEach((r) => console.log(" ", r.email));
console.log();

let sent = 0;

for (const { email } of recipients) {
  const encodedEmail = encodeURIComponent(email);

  const starLinks = [1, 2, 3, 4, 5]
    .map(
      (n) =>
        `<a href="${SITE_URL}/api/pack-feedback?rating=${n}&eventId=${event.id}&email=${encodedEmail}" style="display:inline-block;width:36px;height:36px;line-height:36px;text-align:center;font-size:24px;text-decoration:none;color:#AAFF00;">★</a>`
    )
    .join("");

  const subject = `Still want to hear how Sepang went`;

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#0A0A0A">
      <p style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#AAFF00;margin-bottom:28px">Experiences | Curated</p>

      <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">Hi there,</p>

      <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">
        We sent a note last week asking how the Bahrain GP trip went — figured it might've gotten buried, so here's a quick second ask.
      </p>

      <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:8px">
        If you've got 10 seconds, a star rating on the guide helps us know what actually worked on the ground versus what we just assumed would:
      </p>
      <div style="margin-bottom:28px;">${starLinks}</div>

      <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:24px">
        And if you snapped any photos or video over the weekend — grandstand, paddock, the drive out, anything — just reply to this email with a few attached. We're building this guide for the next wave of fans making the same trip, and a real photo from someone who was actually there beats anything we could write ourselves. We'll credit you by name if we use one.
      </p>

      <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:32px">
        Either way, thanks again for trusting us with the trip.
      </p>

      <p style="font-size:14px;color:#ffffff;font-weight:900;margin-bottom:32px">— The Experiences | Curated team</p>

      <p style="font-size:11px;color:#6A6A6A">
        You're receiving this because you purchased the ${EVENT_NAME} pack from Experiences | Curated.
      </p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: "Experiences | Curated <hello@experiences-curated.com>",
      to: email,
      subject: TEST_MODE ? `[TEST] ${subject}` : subject,
      html,
    });

    console.log(`✓ Sent to ${email}`);
    sent++;
  } catch (err) {
    console.error(`✗ Failed to send to ${email}:`, err.message);
  }
}

console.log(`\nDone — sent: ${sent} / ${recipients.length}`);
await client.end();
