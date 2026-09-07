import { config } from "dotenv";
config({ path: ".env.local" });

import { Resend } from "resend";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and, gt, inArray } from "drizzle-orm";
import { purchases, sportingEvents } from "../schema/database.ts";

const resend = new Resend(process.env.RESEND_API_KEY);
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SITE_URL = "https://www.experiences-curated.com";
const EVENT_SLUG = "italian-gp-2026";
const EVENT_NAME = "Italian GP 2026";

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

// Added manually per explicit request — real Italian GP purchaser but
// price_paid = 0.00, so excluded by the standard > 0 filter below.
const MANUAL_ADDITIONS = ["cynthia.kulbago@gmail.com"];

let recipients;
if (TEST_MODE) {
  recipients = [{ email: TEST_RECIPIENT }];
} else {
  const buyers = await db
    .select({ email: purchases.email })
    .from(purchases)
    .where(and(eq(purchases.sportingEventId, event.id), gt(purchases.pricePaid, "0")));
  recipients = buyers.filter((b) => b.email && b.email !== "[deleted]");
  for (const email of MANUAL_ADDITIONS) {
    if (!recipients.some((r) => r.email === email)) recipients.push({ email });
  }
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

  const subject = `How did the Italian GP go?`;

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#0A0A0A">
      <p style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#AAFF00;margin-bottom:28px">Experiences | Curated</p>

      <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">Hi there,</p>

      <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">
        Hope Monza treated you well. Thanks again for picking up our Italian GP 2026 pack — we put a lot of work into it, and now that the race weekend's behind you, we'd genuinely like to know how it held up in real life.
      </p>

      <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:8px">
        First, a quick star rating on the guide itself — was it actually useful for planning the trip and also once you were on the ground, or did it miss something you needed? This feedback will help us improve the pack for future events.
      </p>
      <div style="margin-bottom:28px;">${starLinks}</div>

      <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:24px">
        Second — if you took any photos and videos over the weekend, we'd love to see them. The grandstand, the paddock, the drive out, whatever you caught. Just reply to this email with a few attached. We're building this guide for future fans making the same trip, and a real photo from someone who was actually there does more for them than anything we could write. If we end up using one on the site, we'll credit you by name.
      </p>

      <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:32px">
        Either way, thanks for trusting us with your trip.
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
