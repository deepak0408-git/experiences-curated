import { config } from "dotenv";
config({ path: ".env.local" });

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// One-off apology send — approved by founder 20 Jul 2026, exact recipient
// list and copy reviewed before sending. Corrects the "TEST EVENT — DO NOT
// PUBLISH" email mistakenly sent to 20 real newsletter subscribers on
// 19 Jul 2026 via a testing incident (see feedback_no_adhoc_writes_against_prod.md).

const RECIPIENTS = [
  "namitaashetty@yahoo.co.in",
  "anup.fernandes@yahoo.co.in",
  "kshitijshetty9900@gmail.com",
  "sach25tp@gmail.com",
  "riosaz@ymail.com",
  "ale.bardazzi91@gmail.com",
  "leander.bond@gmail.com",
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
  "paaskesen@outlook.dk",
];

const html = `
  <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#0A0A0A">
    <div>
      <p style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#AAFF00;margin-bottom:28px">Experiences | Curated</p>
      <h1 style="font-size:20px;font-weight:900;color:#ffffff;margin:0 0 16px">We goofed up. A test email reached your inbox by mistake</h1>
      <p style="font-size:13px;color:#A3A3A3;line-height:1.6;margin:0 0 16px">
        You received an email yesterday about "TEST EVENT — DO NOT PUBLISH" —
        that was our error, not a real event pack. It was internal testing
        data that should never have gone out, and we're sorry it landed in
        your inbox.
      </p>
      <p style="font-size:13px;color:#A3A3A3;line-height:1.6;margin:0 0 16px">
        There's nothing to act on. The link in that email won't work, and you
        can ignore and delete it.
      </p>
      <p style="font-size:13px;color:#A3A3A3;line-height:1.6;margin:0 0 24px">
        We've identified exactly what caused this and fixed it so it can't
        happen again.
      </p>
      <p style="font-size:13px;color:#A3A3A3;line-height:1.6;margin:0 0 24px">
        Thanks for your patience — and for being part of Experiences | Curated.
      </p>
      <hr style="border:none;border-top:1px solid #2A2A2A;margin:32px 0 16px">
      <p style="font-size:11px;color:#6A6A6A">This email was sent to you as a subscriber who received the mistaken send.</p>
    </div>
  </div>
`;

const subject = "We goofed up. A test email reached your inbox by mistake";

const BATCH_SIZE = 8;
const BATCH_DELAY_MS = 1200;

const sent = [];
const failed = [];

for (let i = 0; i < RECIPIENTS.length; i += BATCH_SIZE) {
  const batch = RECIPIENTS.slice(i, i + BATCH_SIZE);
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
      sent.push(email);
    } else {
      const reason =
        result.status === "rejected"
          ? String(result.reason?.message ?? result.reason)
          : String(result.value?.error?.message ?? "unknown Resend error");
      failed.push({ email, reason });
    }
  });
  if (i + BATCH_SIZE < RECIPIENTS.length) {
    await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS));
  }
}

console.log(`\n✓ Sent: ${sent.length}/${RECIPIENTS.length}`);
if (sent.length > 0) console.log(sent.join(", "));
if (failed.length > 0) {
  console.log(`\n✗ Failed: ${failed.length}`);
  console.log(JSON.stringify(failed, null, 2));
}
