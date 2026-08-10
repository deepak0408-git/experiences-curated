import { config } from "dotenv";
config({ path: ".env.local" });
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// REAL SEND -- to tennisguyofficial@gmail.com, per explicit user approval
// of this exact draft after confirming the test copy rendered correctly.
const TEST_MODE = false;
const TEST_RECIPIENT = "deepak0408@gmail.com";
const REAL_RECIPIENT = "tennisguyofficial@gmail.com";

const subject = "Instagram Collaboration for the US Open";

const html = `
<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#0A0A0A">
  <p style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#AAFF00;margin-bottom:28px">Experiences | Curated</p>

  <p style="font-size:14px;color:#ffffff;font-weight:700;margin-bottom:16px">Hello Vishesh,</p>

  <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">
    It was good to connect up this afternoon to talk about our shared love for tennis and for opportunities to collaborate on Instagram before the US Open.
  </p>

  <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">
    We discussed a few ideas which you'll run by your team. I look forward to hearing back.
  </p>

  <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:24px">
    As a reminder, we are Experiences | Curated, a sports experiences platform aimed at providing curated sports travel planning and content experiences for global fans traveling to the world's greatest sporting events. We currently feature the best tennis, cricket, Formula 1, and golf sports events. After the US Open, we will feature the Shanghai Masters and the season-ending Nitto ATP Finals.
  </p>

  <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:24px">
    Platform: <a href="https://www.experiences-curated.com" style="color:#AAFF00;text-decoration:none">www.experiences-curated.com</a><br/>
    Instagram: <a href="https://instagram.com/experiences.curated" style="color:#AAFF00;text-decoration:none">@experiences.curated</a>
  </p>

  <p style="font-size:14px;color:#ffffff;font-weight:900">Thanks,<br/>Deepak from Experiences | Curated</p>
</div>
`;

const to = TEST_MODE ? TEST_RECIPIENT : REAL_RECIPIENT;

const result = await resend.emails.send({
  from: "Experiences | Curated <hello@experiences-curated.com>",
  to,
  subject: TEST_MODE ? `[TEST] ${subject}` : subject,
  html,
});

console.log(`Email sent (${TEST_MODE ? "TEST" : "REAL"}) to ${to}:`, result);
