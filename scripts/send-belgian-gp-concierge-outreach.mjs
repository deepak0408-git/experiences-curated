import { config } from "dotenv";
config({ path: ".env.local" });

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const recipients = ["rasmey@web.de", "paaskesen@outlook.dk"];

let sent = 0;

for (const email of recipients) {
  try {
    await resend.emails.send({
      from: "Experiences | Curated <hello@experiences-curated.com>",
      to: email,
      subject: "Enjoy Spa this weekend — quick help if you need it",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;color:#171717">
          <p style="font-size:14px;color:#525252;line-height:1.6;margin-bottom:16px">Hi there,</p>
          <p style="font-size:14px;color:#525252;line-height:1.6;margin-bottom:16px">
            Hope you're just about heading to the circuit, race weekend's kicking off shortly. If anything comes up over the next few days, where to eat nearby, how to beat the exit queue on Sunday, anything at all, just reply and tell me what you're stuck on.
          </p>
          <p style="font-size:14px;color:#525252;line-height:1.6;margin-bottom:16px">
            I'll write back with a real, specific answer, not a form reply, usually within a few hours during race weekend.
          </p>
          <p style="font-size:14px;color:#525252;line-height:1.6;margin-bottom:32px">
            Enjoy the weekend.
          </p>
          <p style="font-size:14px;color:#525252;line-height:1.6">The Experiences | Curated team</p>
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
