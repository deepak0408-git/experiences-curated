import { config } from "dotenv";
config({ path: ".env.local" });

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Visual/correctness test send only — founder's own inbox, approved draft.
// Do NOT add real recipients here. Real send happens via
// scripts/send-test-event-apology.mjs only after founder confirms this test.

const RECIPIENTS = ["deepak0408@gmail.com"];

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

const settled = await Promise.allSettled(
  RECIPIENTS.map((email) =>
    resend.emails.send({
      from: "Experiences | Curated <hello@experiences-curated.com>",
      to: email,
      subject,
      html,
    })
  )
);

settled.forEach((result, idx) => {
  const email = RECIPIENTS[idx];
  if (result.status === "fulfilled" && !result.value.error) {
    console.log(`✓ sent to ${email}`);
  } else {
    const reason =
      result.status === "rejected"
        ? String(result.reason?.message ?? result.reason)
        : String(result.value?.error?.message ?? "unknown Resend error");
    console.log(`✗ failed for ${email}: ${reason}`);
  }
});
