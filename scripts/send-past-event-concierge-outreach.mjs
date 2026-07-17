import { config } from "dotenv";
config({ path: ".env.local" });

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// TEST_ONLY: when true, sends only to the founder's own inbox for a visual
// check before the real send. Flip to false only after explicit approval
// of the test email.
const TEST_ONLY = false;

// All non-founder, non-deleted purchasers whose event has already ended
// (Wimbledon, Open Championship). Excludes deepak0408@gmail.com,
// deepu2_2000@yahoo.com (founder's own test accounts), [deleted] rows,
// and paula.holt@sky.com (requested unsubscribe from all emails).
const realRecipients = [
  "markeysa@tcd.ie",
  "sarah.markey2@gmail.com",
  "anup.fernandes@yahoo.co.in",
  "kshitijshetty9900@gmail.com",
  "sach25tp@gmail.com",
  "molgrainger@yahoo.ie",
  "riosaz@ymail.com",
  "ale.bardazzi91@gmail.com",
  "leander.bond@gmail.com",
  "lisalowe38@live.com",
  "sheritabernardez@gmail.com",
  "jody_graeme@yahoo.com",
  "kaaarsoo@gmail.com",
  "oabrefa@yahoo.co.uk",
  "juliet_uata@yahoo.com",
  "a.h.pollard@hotmail.co.uk",
  "shilps@mac.com",
];

const recipients = TEST_ONLY ? ["deepak0408@gmail.com"] : realRecipients;

// Resend's plan caps at 10 requests/second — batch and pause, same pattern
// as app/api/cron/newsletter-new-pack-announcement/route.ts
const BATCH_SIZE = 8;
const BATCH_DELAY_MS = 1200;

let sent = 0;
const failed = [];

for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
  const batch = recipients.slice(i, i + BATCH_SIZE);
  const settled = await Promise.allSettled(
    batch.map((email) =>
      resend.emails.send({
        from: "Experiences | Curated <hello@experiences-curated.com>",
        to: email,
        subject: "Thinking about your next sports event trip? Can we help?",
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#0A0A0A">
            <p style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#AAFF00;margin-bottom:28px">Experiences | Curated</p>
            <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">Hi there,</p>
            <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">
              Hope you found our sports event pack worth your time. I wanted to let you know about something new: if you're starting to think about your next sports event, wherever that might be, send me any questions that you may have — how to plan tickets, best grandstands, where to stay, how to travel — and I'll write back with a real, specific answer within 48 hours. Not a form reply, proper research, same as goes into the packs.
            </p>
            <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:32px">
              No pressure if you're not planning anything yet, just wanted you to know it's there.
            </p>
            <p style="font-size:14px;color:#ffffff;font-weight:900">The Experiences | Curated team</p>
          </div>
        `,
      })
    )
  );

  settled.forEach((result, idx) => {
    const email = batch[idx];
    if (result.status === "fulfilled" && !result.value.error) {
      console.log(`✓ Sent to ${email}`);
      sent++;
    } else {
      const reason = result.status === "rejected" ? result.reason?.message : result.value?.error?.message;
      console.error(`✗ Failed to send to ${email}:`, reason);
      failed.push({ email, reason });
    }
  });

  if (i + BATCH_SIZE < recipients.length) {
    await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS));
  }
}

console.log(`\nDone — sent: ${sent} / ${recipients.length}`);
if (failed.length > 0) {
  console.log("Failed:", JSON.stringify(failed, null, 2));
}
