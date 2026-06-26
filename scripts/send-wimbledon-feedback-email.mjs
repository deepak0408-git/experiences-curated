import { config } from "dotenv";
config({ path: ".env.local" });

import { Resend } from "resend";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, and, notInArray } from "drizzle-orm";
import { purchases, sportingEvents } from "../schema/database.ts";

const resend = new Resend(process.env.RESEND_API_KEY);
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SITE_URL = "https://www.experiences-curated.com";
const EXCLUDE = ["deepak0408@gmail.com", "deepu2_2000@yahoo.com"];
const EVENT_SLUG = "wimbledon-2026";
const EVENT_NAME = "The Championships, Wimbledon 2026";

const [event] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, EVENT_SLUG));

if (!event) {
  console.error("Event not found");
  process.exit(1);
}

const buyers = await db
  .select({ email: purchases.email })
  .from(purchases)
  .where(
    and(
      eq(purchases.sportingEventId, event.id),
      notInArray(purchases.email, EXCLUDE)
    )
  );

const recipients = buyers.filter(b => b.email && b.email !== "[deleted]");

console.log(`\nSending to ${recipients.length} recipients:`);
recipients.forEach(r => console.log(" ", r.email));
console.log();

let sent = 0;

for (const { email } of recipients) {
  const encodedEmail = encodeURIComponent(email);

  const starLinks = [1, 2, 3, 4, 5].map((n) =>
    `<a href="${SITE_URL}/api/pack-feedback?rating=${n}&eventId=${event.id}&email=${encodedEmail}" style="display:inline-block;width:40px;height:40px;line-height:40px;text-align:center;font-size:26px;text-decoration:none;color:#d4a017;">★</a>`
  ).join("");

  try {
    await resend.emails.send({
      from: "Experiences | Curated <hello@experiences-curated.com>",
      to: email,
      subject: `How was your experience with the Wimbledon 2026 pack?`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;color:#171717">
          <p style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#a3a3a3;margin-bottom:32px">Experiences | Curated</p>
          <p style="font-size:14px;color:#525252;line-height:1.6;margin-bottom:8px">Thank you for subscribing to the Wimbledon 2026 event pack. How was the Experiences | Curated pack overall?</p>
          <p style="font-size:14px;color:#525252;line-height:1.6;margin-bottom:24px">One tap — it helps us make the pack better.</p>
          <div style="margin-bottom:32px;">${starLinks}</div>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin-bottom:24px">
          <p style="font-size:12px;color:#a3a3a3;line-height:1.6">
            You're receiving this because you purchased the ${EVENT_NAME} pack from Experiences | Curated.
          </p>
        </div>
      `,
    });

    console.log(`✓ Sent to ${email}`);
    sent++;
  } catch (err) {
    console.error(`✗ Failed to send to ${email}:`, err.message);
  }
}

console.log(`\nDone — sent: ${sent} / ${recipients.length}`);
await client.end();
