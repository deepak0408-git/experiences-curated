import { config } from "dotenv";
config({ path: ".env.local" });

import { Resend } from "resend";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { inArray, eq } from "drizzle-orm";
import { purchases, sportingEvents } from "../schema/database.ts";

const resend = new Resend(process.env.RESEND_API_KEY);
const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SITE_URL = "https://www.experiences-curated.com";

// Batch B — first-ever check-in for real purchases made Aug 8-17 2026.
// Excludes deepak0408@gmail.com (test/founder purchases). For the 2 people
// with 2 purchases in this window (dhanishshetty48, clanvn909), sending ONE
// check-in for their most recent pack rather than double-emailing.
const RECIPIENTS = [
  { email: "6ady981zr@mozmail.com", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
  { email: "samc_93@hotmail.com", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
  { email: "sumanthbestintheworld@gmail.com", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
  { email: "lolsteve528@gmail.com", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
  { email: "aditipillaiofficial@gmail.com", eventName: "US Open 2026" },
  { email: "nzkerryn@hotmail.com", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
  { email: "edwin9960@yahoo.com.tw", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
  { email: "dhanishshetty48@gmail.com", eventName: "Italian Grand Prix 2026" },
  { email: "ohvalienteian@gmail.com", eventName: "US Open 2026" },
  { email: "mireivi.castillo@gmail.com", eventName: "US Open 2026" },
  { email: "pomp-pasty.9y@icloud.com", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
  { email: "sach25aug@gmail.com", eventName: "Shanghai Masters 2026" },
  { email: "tcurq28@gmail.com", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
  { email: "clanvn909@gmail.com", eventName: "Shanghai Masters 2026" },
  { email: "prajin2mummy@gmail.com", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
];

const eventRows = await db.select({ id: sportingEvents.id, name: sportingEvents.name }).from(sportingEvents);
const eventIdByName = Object.fromEntries(eventRows.map((e) => [e.name, e.id]));

const activePurchases = await db
  .select({ email: purchases.email, sportingEventId: purchases.sportingEventId, status: purchases.status })
  .from(purchases)
  .where(inArray(purchases.email, RECIPIENTS.map((r) => r.email)));

const activeSet = new Set(
  activePurchases.filter((p) => p.status === "active").map((p) => `${p.email}::${p.sportingEventId}`)
);

const starLinks = (eventId, email) =>
  [1, 2, 3, 4, 5]
    .map(
      (n) =>
        `<a href="${SITE_URL}/api/pack-feedback?rating=${n}&eventId=${eventId}&email=${encodeURIComponent(email)}" style="display:inline-block;width:40px;height:40px;line-height:40px;text-align:center;font-size:26px;text-decoration:none;color:#AAFF00;">★</a>`
    )
    .join("");

function html(eventName, eventId, email) {
  return `
<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#0A0A0A">
  <p style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#AAFF00;margin-bottom:28px">Experiences | Curated</p>
  <h1 style="font-size:20px;font-weight:900;color:#ffffff;margin-bottom:16px">How's the ${eventName} pack going so far?</h1>
  <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:8px">Thanks for subscribing to the ${eventName} pack — hope it's helping you plan. We'd love to know how it's going so far: is the guide clear, useful, missing anything you wished it covered?</p>
  <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:24px">One tap — it takes two seconds and helps us make the pack better.</p>
  <div style="margin-bottom:32px;">${starLinks(eventId, email)}</div>
  <hr style="border:none;border-top:1px solid #2A2A2A;margin-bottom:24px">
  <p style="font-size:11px;color:#6A6A6A;line-height:1.6">
    Sent to ${email}.<br>
    You're receiving this because you subscribed to the ${eventName} pack from Experiences | Curated.
  </p>
</div>
`;
}

let sent = 0, skipped = 0;

for (const { email, eventName } of RECIPIENTS) {
  const eventId = eventIdByName[eventName];
  if (!eventId) {
    console.error(`✗ No sportingEventId found for "${eventName}" — skipping ${email}`);
    skipped++;
    continue;
  }
  if (!activeSet.has(`${email}::${eventId}`)) {
    console.log(`⏭ Skipping ${email} — no active purchase found for ${eventName}`);
    skipped++;
    continue;
  }

  try {
    await resend.emails.send({
      from: "Experiences | Curated <hello@experiences-curated.com>",
      to: email,
      subject: `How's the ${eventName} pack going so far?`,
      html: html(eventName, eventId, email),
    });
    console.log(`✓ Sent to ${email} (${eventName})`);
    sent++;
  } catch (err) {
    console.error(`✗ Failed to send to ${email}:`, err.message);
    skipped++;
  }
}

console.log(`\nDone — sent: ${sent}, skipped: ${skipped}, total attempted: ${RECIPIENTS.length}`);
await client.end();
