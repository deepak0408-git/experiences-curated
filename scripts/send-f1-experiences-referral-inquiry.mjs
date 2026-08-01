import { config } from "dotenv";
config({ path: ".env.local" });

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

try {
  await resend.emails.send({
    from: "Experiences | Curated <hello@experiences-curated.com>",
    to: "gsan.bookings@f1experiences.com",
    subject: "Referral partnership enquiry — Experiences | Curated",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#0A0A0A">
        <p style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#AAFF00;margin-bottom:28px">Experiences | Curated</p>
        <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">Hi there,</p>
        <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">
          I run Experiences | Curated (experiences-curated.com), a small site that builds detailed, race-specific travel guides for F1 fans, where to sit, where to stay, how to actually get to the circuit, for events including Belgian GP, Italian GP, and Hungarian GP, with more races in the works.
        </p>
        <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">
          A meaningful share of our visitors are planning their own trip rather than looking for hospitality, but some clearly want more than that, trackside access, VIP packages, the full Paddock Club experience. Rather than try to build that ourselves, I'd rather point them to the people who actually do it properly.
        </p>
        <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">
          I had a genuine question: is there a referral or affiliate relationship available for a site like ours, where we'd feature F1 Experiences as the option for readers who want premium hospitality, in exchange for a referral fee on completed bookings? Not looking to become a full reseller or hold inventory, just a simple, honest pointer from our content to yours.
        </p>
        <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:32px">
          Happy to share examples of our existing F1 guides if useful.
        </p>
        <p style="font-size:14px;color:#ffffff;font-weight:900">The Experiences | Curated team</p>
      </div>
    `,
  });
  console.log("✓ Sent to gsan.bookings@f1experiences.com");
} catch (err) {
  console.error("✗ Failed:", err.message);
}
