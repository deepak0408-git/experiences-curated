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

// Batch A — reminder to non-responders from the original 7 Aug 2026
// check-in send. Excludes: alexapta30@gmail.com (already responded),
// ann.kingham@me.com (original send bounced), clanvn909@gmail.com
// (moved to Batch B instead — avoid double-emailing in one round).
const RECIPIENTS = [
  { email: "prdp60@gmail.com", eventName: "US Open 2026" },
  { email: "shettyashish@rediffmail.com", eventName: "US Open 2026" },
  { email: "anjana.murugan@gmail.com", eventName: "US Open 2026" },
  { email: "akashyap@gmail.com", eventName: "US Open 2026" },
  { email: "aldin.bhf@gmail.com", eventName: "Italian Grand Prix 2026" },
  { email: "maldavie@icloud.com", eventName: "Hungarian Grand Prix 2026" },
  { email: "susan.moore.63@hotmail.co.uk", eventName: "Hungarian Grand Prix 2026" },
  { email: "andrew.kingham@me.com", eventName: "Hungarian Grand Prix 2026" },
  { email: "grace.kingham03@gmail.com", eventName: "Hungarian Grand Prix 2026" },
  { email: "fluky_erosive_5k@icloud.com", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
  { email: "sanjaymanickam28@gmail.com", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
  { email: "rahul.manchesterunited@gmail.com", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
  { email: "recofanly@gmail.com", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
  { email: "sarahvanboven@yahoo.com", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
  { email: "siddhartha0610@gmail.com", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
  { email: "gaoleon8@gmail.com", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
  { email: "prasadforfacebook@gmail.com", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
  { email: "dakshabobby69@gmail.com", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
  { email: "jonkwok1996@gmail.com", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
  { email: "stevie.email@gmail.com", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
  { email: "kevin.gove007@gmail.com", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
  { email: "someurl@yopmail.com", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
  { email: "raam.barath@gmail.com", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
  { email: "veerkapadia21@gmail.com", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
  { email: "swarms_robin.0r@icloud.com", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
  { email: "me@jgoi.net", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
  { email: "sanketsingal844@gmail.com", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
  { email: "clarenceturkey@gmail.com", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
  { email: "zouknewsletters@gmail.com", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
  { email: "elhh@duck.com", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
  { email: "sanjeevanimhatre100600@gmail.com", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
  { email: "soultanobie19@gmail.com", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
  { email: "wania.afrozicty99@gmail.com", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
  { email: "teja.nh24@gmail.com", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
  { email: "ozguroncel@gmail.com", eventName: "Bahrain Grand Prix 2026 (Malaysia)" },
];

// Look up real sportingEventId for each event name, and the real
// purchase row's active status, so star links point at a genuine eventId
// and we skip anyone whose purchase is no longer active (refunded etc.)
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
  <h1 style="font-size:20px;font-weight:900;color:#ffffff;margin-bottom:16px">Quick one — how's the ${eventName} pack going?</h1>
  <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:8px">We reached out a little while ago but didn't hear back — no worries if things have been busy. Still curious: is the guide useful, is anything missing, anything you wish it covered?</p>
  <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:24px">One tap tells us everything we need.</p>
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
      subject: `Quick one — how's the ${eventName} pack going?`,
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
