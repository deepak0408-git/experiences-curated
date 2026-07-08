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
const EXCLUDE = ["deepak0408@gmail.com", "deepu2_2000@yahoo.com"];

// Mirrors app/_components/BrandHero.tsx SHORT_NAMES — keep these in sync
const SHORT_NAMES = {
  "wimbledon-2026": "Wimbledon 2026",
  "india-in-england-cricket-2026": "India in England 2026",
  "open-championship-2026": "The Open 2026",
  "belgian-gp-2026": "Belgian GP 2026",
  "us-open-2026": "US Open 2026",
};

function shortEventName(name, slug) {
  return SHORT_NAMES[slug] ?? name;
}

// Strip a leading "The " so displayName can be inserted after a fixed "the "
// in a sentence without doubling the article (e.g. "the The Open 2026").
function withoutLeadingArticle(name) {
  return name.replace(/^The\s+/, "");
}

// ─── Recipient list — edit this batch before each run ─────────────────────────
const EMAILS = [
  "markeysa@tcd.ie",
  "sarah.markey2@gmail.com",
  "sheritabernardez@gmail.com",
  "jody_graeme@yahoo.com",
  "kaaarsoo@gmail.com",
  "paula.holt@sky.com",
  "lisalowe38@live.com",
  "leander.bond@gmail.com",
];

const DRY_RUN = process.argv.includes("--dry-run");

const rows = await db
  .select({
    email: purchases.email,
    status: purchases.status,
    eventId: purchases.sportingEventId,
    eventName: sportingEvents.name,
    eventSlug: sportingEvents.slug,
  })
  .from(purchases)
  .innerJoin(sportingEvents, eq(purchases.sportingEventId, sportingEvents.id))
  .where(inArray(purchases.email, EMAILS));

const recipients = rows.filter(
  (r) => r.email && r.email !== "[deleted]" && r.status === "active" && !EXCLUDE.includes(r.email)
);

console.log(`\n${DRY_RUN ? "[DRY RUN] Would send" : "Sending"} to ${recipients.length} recipients:`);
recipients.forEach((r) => console.log(`  ${r.email} — ${shortEventName(r.eventName, r.eventSlug)}`));
console.log();

let sent = 0;

for (const { email, eventId, eventName, eventSlug } of recipients) {
  const encodedEmail = encodeURIComponent(email);
  const displayName = shortEventName(eventName, eventSlug);
  const sentenceName = withoutLeadingArticle(displayName);
  const subject = `How's the ${sentenceName} pack going so far?`;

  const starLinks = [1, 2, 3, 4, 5]
    .map(
      (n) =>
        `<a href="${SITE_URL}/api/pack-feedback?rating=${n}&eventId=${eventId}&email=${encodedEmail}" style="display:inline-block;width:40px;height:40px;line-height:40px;text-align:center;font-size:26px;text-decoration:none;color:#d4a017;">★</a>`
    )
    .join("");

  const html = `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;color:#171717">
          <p style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#a3a3a3;margin-bottom:32px">Experiences | Curated</p>
          <h1 style="font-size:20px;font-weight:700;margin-bottom:16px">${subject}</h1>
          <p style="font-size:14px;color:#525252;line-height:1.6;margin-bottom:8px">Thanks for subscribing to the ${sentenceName} pack — hope it's helping you plan. We'd love to know how it's going so far: is the guide clear, useful, missing anything you wished it covered?</p>
          <p style="font-size:14px;color:#525252;line-height:1.6;margin-bottom:24px">One tap — it takes two seconds and helps us make the pack better.</p>
          <div style="margin-bottom:32px;">${starLinks}</div>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin-bottom:24px">
          <p style="font-size:12px;color:#a3a3a3;line-height:1.6">
            Sent to ${email}.<br>
            You're receiving this because you subscribed to the ${sentenceName} pack from Experiences | Curated.
          </p>
        </div>
      `;

  if (DRY_RUN) {
    console.log(`--- ${email} (${displayName}) ---`);
    console.log(`Subject: ${subject}`);
    console.log(html);
    console.log();
    sent++;
    continue;
  }

  try {
    await resend.emails.send({
      from: "Experiences | Curated <hello@experiences-curated.com>",
      to: email,
      subject,
      html,
    });

    console.log(`✓ Sent to ${email} (${displayName})`);
    sent++;
  } catch (err) {
    console.error(`✗ Failed to send to ${email}:`, err.message);
  }
}

console.log(`\n${DRY_RUN ? "[DRY RUN] Done — would send" : "Done — sent"}: ${sent} / ${recipients.length}`);
await client.end();
