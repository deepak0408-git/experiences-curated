import { config } from "dotenv";
config({ path: ".env.local" });

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const SITE_URL = "https://www.experiences-curated.com";
const EVENT_ID = "b93770c0-3d96-4e81-b3d0-c1e3a788fd8e"; // Italian GP 2026
const EVENT_NAME = "Italian GP 2026";

const TEST_MODE = process.argv.includes("--test");
const TEST_RECIPIENT = "deepak0408@gmail.com";

// Reminder to the 5 non-responders from the 7 Sep 2026 post-event feedback
// send (6 real purchasers emailed; Cynthia Vallen / cynthia.kulbago@gmail.com
// replied same day and is excluded here).
const RECIPIENTS = [
  "melody1@me.com",
  "luanakerekes@yahoo.ro",
  "tony.p.paredes@gmail.com",
  "gdanon2002@yahoo.com",
  "hirlekarnandan@gmail.com",
];

const recipients = TEST_MODE ? [TEST_RECIPIENT] : RECIPIENTS;

console.log(`\n${TEST_MODE ? "[TEST] Sending" : "Sending"} to ${recipients.length} recipient(s):`);
recipients.forEach((r) => console.log(" ", r));
console.log();

let sent = 0;

for (const email of recipients) {
  const encodedEmail = encodeURIComponent(email);

  const starLinks = [1, 2, 3, 4, 5]
    .map(
      (n) =>
        `<a href="${SITE_URL}/api/pack-feedback?rating=${n}&eventId=${EVENT_ID}&email=${encodedEmail}" style="display:inline-block;width:36px;height:36px;line-height:36px;text-align:center;font-size:24px;text-decoration:none;color:#AAFF00;">★</a>`
    )
    .join("");

  const subject = `Quick one — how did the Italian GP go?`;

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#0A0A0A">
      <p style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#AAFF00;margin-bottom:28px">Experiences | Curated</p>

      <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">Hi there,</p>

      <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">
        We reached out last week to ask how the Italian GP pack held up now that Monza's behind you — just circling back in case it slipped past in a busy inbox.
      </p>

      <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:8px">
        A quick star rating would genuinely help us improve the guide for future fans — did it actually work for planning the trip and once you were on the ground, or did it miss something?
      </p>
      <div style="margin-bottom:28px;">${starLinks}</div>

      <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:24px">
        And if you snapped any photos or videos over the weekend — grandstand, paddock, the drive out — we'd love to see them. Just reply to this email with a few attached. We're building this guide for future fans making the same trip, and a real photo from someone who was actually there does more than anything we could write. If we use one on the site, we'll credit you by name.
      </p>

      <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:32px">
        No worries either way — thanks again for trusting us with your trip.
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
