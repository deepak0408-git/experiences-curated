import { config } from "dotenv";
config({ path: ".env.local" });
import { Resend } from "resend";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { sportingEvents } from "../schema/database.ts";

const resend = new Resend(process.env.RESEND_API_KEY);
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://experiences-curated.com";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

// Confirmed-missing recipients per event, computed from Resend's actual delivery
// records cross-referenced against the newsletter_subscribers table (15 Jul 2026).
const HUNGARIAN_GP_MISSING = [
  "paula.holt@sky.com",
  "lisalowe38@live.com",
  "markeysa@tcd.ie",
  "sarah.markey2@gmail.com",
  "oabrefa@yahoo.co.uk",
  "louis.parini@icloud.com",
  "mathislg@aol.com",
  "melanie39@hotmail.co.uk",
  "molgrainger@yahoo.ie",
  "rasmey@web.de",
];

const US_OPEN_MISSING = [
  "namitaashetty@yahoo.co.in",
  "anup.fernandes@yahoo.co.in",
  "kshitijshetty9900@gmail.com",
  "sach25tp@gmail.com",
  "riosaz@ymail.com",
  "ale.bardazzi91@gmail.com",
  "leander.bond@gmail.com",
  "paula.holt@sky.com",
  "lisalowe38@live.com",
  "markeysa@tcd.ie",
  "sarah.markey2@gmail.com",
  "sheritabernardez@gmail.com",
  "jody_graeme@yahoo.com",
  "kaaarsoo@gmail.com",
  "oabrefa@yahoo.co.uk",
  "louis.parini@icloud.com",
  "mathislg@aol.com",
  "melanie39@hotmail.co.uk",
  "molgrainger@yahoo.ie",
  "rasmey@web.de",
];

// Same template as app/api/cron/newsletter-new-pack-announcement/route.ts
function buildHtml(eventName, packUrl) {
  return `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:40px 24px;background:#0A0A0A">
      <p style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#AAFF00;margin-bottom:28px">New Pack</p>
      <h1 style="font-size:20px;font-weight:900;color:#ffffff;margin:0 0 8px">New event pack just dropped</h1>
      <p style="font-size:16px;font-weight:900;color:#ffffff;margin:0 0 20px">${eventName}</p>
      <p style="font-size:13px;color:#A3A3A3;line-height:1.6;margin:0 0 24px">
        The full guide is live — grandstands and gates, where to stay, where to eat,
        how to actually get there. The same depth as our other packs, built the same way.
      </p>
      <a href="${packUrl}" style="display:inline-block;padding:10px 20px;background:#AAFF00;color:#000;font-size:13px;font-weight:900;text-decoration:none;border-radius:2px">Get the pack →</a>
      <hr style="border:none;border-top:1px solid #2A2A2A;margin:32px 0 16px">
      <p style="font-size:11px;color:#6A6A6A">You're getting this because you're subscribed to Experiences | Curated updates.</p>
    </div>
  `;
}

// Throttled send — Resend's plan caps at 10 requests/second.
// Batches of 8 with a 1.2s pause between batches keeps real margin under that limit.
async function sendThrottled(recipients, subject, html) {
  const results = { sent: [], failed: [] };
  for (let i = 0; i < recipients.length; i += 8) {
    const batch = recipients.slice(i, i + 8);
    const settled = await Promise.allSettled(
      batch.map((email) =>
        resend.emails.send({
          from: "Experiences | Curated <hello@experiences-curated.com>",
          to: email,
          subject,
          html,
        })
      )
    );
    settled.forEach((result, idx) => {
      const email = batch[idx];
      if (result.status === "fulfilled" && !result.value.error) {
        results.sent.push(email);
      } else {
        const reason = result.status === "rejected" ? result.reason?.message : result.value?.error?.message;
        results.failed.push({ email, reason });
      }
    });
    if (i + 8 < recipients.length) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }
  }
  return results;
}

try {
  const [hungarianEvent] = await db.select({ name: sportingEvents.name, slug: sportingEvents.slug })
    .from(sportingEvents).where(eq(sportingEvents.slug, "hungarian-gp-2026"));
  const [usOpenEvent] = await db.select({ name: sportingEvents.name, slug: sportingEvents.slug })
    .from(sportingEvents).where(eq(sportingEvents.slug, "us-open-2026"));

  console.log(`Resending Hungarian GP announcement to ${HUNGARIAN_GP_MISSING.length} recipients...`);
  const hungarianResult = await sendThrottled(
    HUNGARIAN_GP_MISSING,
    `New Event Pack: ${hungarianEvent.name} — the full guide is live`,
    buildHtml(hungarianEvent.name, `${SITE_URL}/event-pack/${hungarianEvent.slug}`)
  );
  console.log(`  ✓ Sent: ${hungarianResult.sent.length}`);
  console.log(`  ✗ Failed: ${hungarianResult.failed.length}`, hungarianResult.failed);

  console.log(`\nResending US Open announcement to ${US_OPEN_MISSING.length} recipients...`);
  const usOpenResult = await sendThrottled(
    US_OPEN_MISSING,
    `New Event Pack: ${usOpenEvent.name} — the full guide is live`,
    buildHtml(usOpenEvent.name, `${SITE_URL}/event-pack/${usOpenEvent.slug}`)
  );
  console.log(`  ✓ Sent: ${usOpenResult.sent.length}`);
  console.log(`  ✗ Failed: ${usOpenResult.failed.length}`, usOpenResult.failed);

  console.log("\n=== Summary ===");
  console.log(`Hungarian GP: ${hungarianResult.sent.length}/${HUNGARIAN_GP_MISSING.length} sent`);
  console.log(`US Open: ${usOpenResult.sent.length}/${US_OPEN_MISSING.length} sent`);
} catch (e) {
  console.error("✗ FAILED:", e.message);
} finally {
  await client.end();
}
