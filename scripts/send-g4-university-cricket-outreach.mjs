import { config } from "dotenv";
config({ path: ".env.local" });

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const emails = [
  {
    to: "cricket.club@imperial.ac.uk",
    intro: "I run Experiences | Curated (experiences-curated.com), a small site that builds detailed travel and logistics guides for cricket fans attending real tours and Tests, where to sit, where to stay, how to actually get there. We've got guides for the India in England tour and the Australia tour of South Africa (Durban, Johannesburg, Cape Town) live now, with more in the works.",
  },
  {
    to: "Info@sydneyuniversitycricket.com.au",
    intro: "I run Experiences | Curated (experiences-curated.com), a small site that builds detailed travel and logistics guides for cricket fans attending real tours and Tests, where to sit, where to stay, how to actually get there. We've got a guide for the Australia tour of South Africa live now, covering Durban, Johannesburg, and Cape Town, with a New Zealand in Australia Test series guide featuring the Boxing Day and New Year Test matches in the works.",
  },
];

const body = (intro) => `
  <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#0A0A0A">
    <p style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#AAFF00;margin-bottom:28px">Experiences | Curated</p>
    <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">Hi there,</p>
    <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">${intro}</p>
    <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">
      If your club is ever planning a trip to watch a Test or tour as a group, we'd be happy to put together a group discount code for your members, rather than everyone buying individually. No cost or commitment to explore this, just wanted to flag it's available if useful.
    </p>
    <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:32px">
      Happy to share an example of what the guides actually look like if that helps.
    </p>
    <p style="font-size:14px;color:#ffffff;font-weight:900">The Experiences | Curated team</p>
  </div>
`;

let sent = 0;

for (const email of emails) {
  try {
    await resend.emails.send({
      from: "Experiences | Curated <hello@experiences-curated.com>",
      to: email.to,
      subject: "A group discount for your next cricket tour?",
      html: body(email.intro),
    });
    console.log(`✓ Sent to ${email.to}`);
    sent++;
  } catch (err) {
    console.error(`✗ Failed to send to ${email.to}:`, err.message);
  }
}

console.log(`\nDone — sent: ${sent} / ${emails.length}`);
