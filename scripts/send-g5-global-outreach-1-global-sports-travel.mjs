import { config } from "dotenv";
config({ path: ".env.local" });

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

try {
  await resend.emails.send({
    from: "Experiences | Curated <hello@experiences-curated.com>",
    to: "hello@globalsports.travel",
    subject: "Quick question about destination research for your tours",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#0A0A0A">
        <p style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#AAFF00;margin-bottom:28px">Experiences | Curated</p>
        <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">Hi there,</p>
        <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">
          I run Experiences | Curated (experiences-curated.com), a small site that builds detailed destination and logistics guides for sports fans travelling to specific events. Right now that's our Australia tour of South Africa cricket guide, Wimbledon, the US Open, and a run of F1 races, Belgian GP, Italian GP, Hungarian GP, with Singapore and Las Vegas GP in the works.
        </p>
        <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">
          I noticed the overlap with what you cover, cricket, tennis majors, and Formula 1, and had a genuine question rather than a pitch: when you're building out a tour for a new destination or event, is destination-specific research (getting-there logistics, local recommendations, that level of detail) something you handle in-house, or is it ever a gap?
        </p>
        <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:32px">
          No agenda beyond curiosity, I'd just be interested to know how that side of things works for an operator like yours. Happy to point you to a specific example if useful.
        </p>
        <p style="font-size:14px;color:#ffffff;font-weight:900">The Experiences | Curated team</p>
      </div>
    `,
  });
  console.log("✓ Sent to hello@globalsports.travel");
} catch (err) {
  console.error("✗ Failed:", err.message);
}
