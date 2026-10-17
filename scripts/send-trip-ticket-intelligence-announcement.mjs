import { config } from "dotenv";
config({ path: ".env.local" });

import { Resend } from "resend";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { newsletterSubscribers } from "../schema/database.ts";

const resend = new Resend(process.env.RESEND_API_KEY);
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SITE_URL = "https://www.experiences-curated.com";

const TEST_MODE = process.argv.includes("--test");
const TEST_RECIPIENT = "deepak0408@gmail.com";

const EXCLUDE = ["deepak0408@gmail.com", "deepu2_2000@yahoo.com"];

let recipients;
if (TEST_MODE) {
  recipients = [{ email: TEST_RECIPIENT }];
} else {
  const rows = await db.select({ email: newsletterSubscribers.email }).from(newsletterSubscribers);
  recipients = rows.filter((r) => !EXCLUDE.includes(r.email));
}

console.log(`\n${TEST_MODE ? "[TEST] Sending" : "Sending"} to ${recipients.length} recipient(s):`);
recipients.forEach((r) => console.log(" ", r.email));
console.log();

const subject = `Two new F1 planning tools: find your race, find your seats`;

const html = `
  <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#0A0A0A">
    <p style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#AAFF00;margin-bottom:28px">Experiences | Curated</p>

    <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">Hi there,</p>

    <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:24px">
      Big news — we've just shipped two tools we think F1 fans, and anyone curious about going to a race for the first time, are going to love.
    </p>

    <p style="font-size:14px;color:#ffffff;font-weight:900;line-height:1.6;margin-bottom:8px">Trip Intelligence</p>
    <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">
      A free 7-question quiz that matches you to the Grand Prix that actually fits what you want from the trip — not just "which race is cheapest" or "which race is famous," but racing quality, atmosphere, destination, even budget, weighed against 24 races we've rated in detail. Answer honestly and it'll tell you your best-fit race, plus two strong alternatives and exactly why each one ranks where it does.
    </p>
    <a href="${SITE_URL}/trip-intelligence/formula-1" style="display:inline-block;padding:10px 20px;background:#AAFF00;color:#000;font-size:13px;font-weight:900;text-decoration:none;border-radius:2px;margin-bottom:32px">Find your race →</a>

    <p style="font-size:14px;color:#ffffff;font-weight:900;line-height:1.6;margin-bottom:8px">Ticket Intelligence</p>
    <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">
      Picks up right after: a seat-matching quiz for the race you intend to attend, so you're not guessing between a grandstand and a general-access pit straight ticket based on a seating map and a hope. Tell it what you care about — track action, seat style, shade, sightlines, atmosphere, budget — and it tells you which stand and tier to book.
    </p>
    <a href="${SITE_URL}/ticket-intelligence" style="display:inline-block;padding:10px 20px;background:#AAFF00;color:#000;font-size:13px;font-weight:900;text-decoration:none;border-radius:2px;margin-bottom:32px">Find your seat →</a>

    <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:32px">
      If you've been on the fence about picking a race for the next season, or already have chosen the race but don't know which seats work best for you, this is built for exactly that moment.
    </p>

    <p style="font-size:14px;color:#ffffff;font-weight:900;margin-bottom:32px">— The Experiences | Curated team</p>

    <p style="font-size:11px;color:#6A6A6A">
      You're receiving this because you signed up for updates from Experiences | Curated.
    </p>
  </div>
`;

let sent = 0;

for (const { email } of recipients) {
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
