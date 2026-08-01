import { config } from "dotenv";
config({ path: ".env.local" });
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// REAL SEND -- to zach@behindtheracquet.com, per explicit user approval of
// this exact draft after confirming the test copy rendered correctly.

const subject = "US Open collab — following up from my outreach during Wimbledon";

const html = `
<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#0A0A0A">
  <p style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#AAFF00;margin-bottom:28px">Experiences | Curated</p>

  <p style="font-size:14px;color:#ffffff;font-weight:700;margin-bottom:16px">Hi Zach,</p>

  <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">
    I reached out to you during Wimbledon — thanks again for saying you'd be up for a collab around the US Open. Quick reminder of who we are: Experiences | Curated builds curated, on-the-ground travel guides for major sporting events — where to sit, where to stay, and what nobody tells you about actually attending. We currently cover tennis, F1, golf, and cricket, all built from real research rather than generic listicles. You can find us on Instagram at @experiences.curated and Facebook at facebook.com/experiencescurated.
  </p>

  <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:12px">
    We're currently featuring the US Open, and given Behind The Racquet's whole ethos of "everyone has a story," a few directions came to mind:
  </p>

  <ol style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:20px;padding-left:20px">
    <li style="margin-bottom:8px">A joint piece on the fan's side of a Slam — the travel, the queue, the first practice-court sighting — told in your storytelling style, paired with our on-the-ground guide.</li>
    <li style="margin-bottom:8px">A Reel or Story takeover around US Open week, splitting the "player's story" and "fan's story" of the same tournament.</li>
    <li style="margin-bottom:8px">A simple cross-post/shoutout swap timed to Fan Week or the main draw, pointing each other's audiences to the other account.</li>
  </ol>

  <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:24px">
    No fixed idea from our side — just wanted to get the conversation moving again before the Open. How do you want to take this forward?
  </p>

  <p style="font-size:14px;color:#ffffff;font-weight:900">Best,<br/>Deepak from Experiences | Curated</p>
</div>
`;

const result = await resend.emails.send({
  from: "Experiences | Curated <hello@experiences-curated.com>",
  to: "zach@behindtheracquet.com",
  subject,
  html,
});

console.log("Email sent to Zach:", result);
