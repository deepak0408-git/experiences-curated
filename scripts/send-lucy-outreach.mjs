import { config } from "dotenv";
config({ path: ".env.local" });

const bodyHtml = `
<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#0A0A0A">
  <p style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#AAFF00;margin-bottom:28px">Experiences | Curated</p>
  <p style="font-size:14px;color:#A3A3A3;line-height:1.6">Hi Lucy,</p>
  <p style="font-size:14px;color:#A3A3A3;line-height:1.6">I'm reaching out from Experiences | Curated — we build detailed travel guides for major sporting events, covering match-day logistics, where to stay, where to eat, and the city around the ground, not just the sport itself.</p>
  <p style="font-size:14px;color:#A3A3A3;line-height:1.6">On the cricket side, we're currently covering the Australia tour of South Africa (ODIs 24-30 September, Tests 9-31 October, across Durban, Johannesburg, and Cape Town), and coming up we also have the New Zealand tour of Australia (four Tests, 9 December to 8 January, across Perth, Adelaide, Melbourne, and Sydney), the England tour of South Africa (17 December to 15 January), and the Border-Gavaskar Trophy — Australia in India (21 January to 3 March 2027).</p>
  <p style="font-size:14px;color:#A3A3A3;line-height:1.6">Given your focus on cricket content, we'd love to explore an Instagram collaboration around one of these tours — a joint Reel or series pairing your cricket commentary with our travel-guide angle for fans planning to actually attend. Happy to talk through what that could look like on your end.</p>
  <p style="font-size:14px;color:#A3A3A3;line-height:1.6">Would you be up for a quick call this week to talk through it?</p>
  <p style="font-size:14px;color:#ffffff;font-weight:900">Best,<br/>Deepak<br/>Experiences | Curated<br/>www.experiences-curated.com</p>
</div>
`;

const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    from: "hello@experiences-curated.com",
    to: "lucyblitz2204@gmail.com",
    subject: "Collaboration idea — Experiences | Curated x your cricket content",
    html: bodyHtml,
  }),
});

const data = await res.json();
console.log("Status:", res.status);
console.log(JSON.stringify(data, null, 2));
