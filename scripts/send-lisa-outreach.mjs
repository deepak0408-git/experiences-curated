import { config } from "dotenv";
config({ path: ".env.local" });

const bodyHtml = `
<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#0A0A0A">
  <p style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#AAFF00;margin-bottom:28px">Experiences | Curated</p>
  <p style="font-size:14px;color:#A3A3A3;line-height:1.6">Hi Lisa,</p>
  <p style="font-size:14px;color:#A3A3A3;line-height:1.6">I'm reaching out from Experiences | Curated — we build in-depth travel guides for major sporting events, covering everything from where to watch and stay to the neighbourhood, food, and logistics around race weekend. Think of us as the trip-planning layer that sits underneath the racing itself.</p>
  <p style="font-size:14px;color:#A3A3A3;line-height:1.6">We're currently covering the Italian Grand Prix at Monza (4-6 September), the Bahrain Grand Prix in Malaysia (2-4 October), and the Singapore Grand Prix at Marina Bay (9-11 October) — all live guides today.</p>
  <p style="font-size:14px;color:#A3A3A3;line-height:1.6">Given your motorsport content, we'd love to explore an Instagram collaboration — potentially a joint Reel or story series around one of these race weekends, pairing your on-the-ground motorsport angle with our travel/logistics guide for fans making the trip. Happy to talk through what that could look like on your end.</p>
  <p style="font-size:14px;color:#A3A3A3;line-height:1.6">Would you be open to a quick call this week to explore it?</p>
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
    to: "premereurlisa@gmail.com",
    subject: "Collaboration idea — Experiences | Curated x your motorsport content",
    html: bodyHtml,
  }),
});

const data = await res.json();
console.log("Status:", res.status);
console.log(JSON.stringify(data, null, 2));
