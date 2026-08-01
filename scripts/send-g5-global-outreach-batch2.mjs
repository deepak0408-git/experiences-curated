import { config } from "dotenv";
config({ path: ".env.local" });

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const SIGNOFF = `<p style="font-size:14px;color:#ffffff;font-weight:900">The Experiences | Curated team</p>`;
const HEADER = `<p style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#AAFF00;margin-bottom:28px">Experiences | Curated</p>`;
const NO_PITCH = `<p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:32px">No agenda beyond curiosity, I'd just be interested to know how that side of things works for an operator like yours. Happy to point you to a specific example if useful.</p>`;

function wrap(intro, overlapLine) {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#0A0A0A">
      ${HEADER}
      <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">Hi there,</p>
      <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">${intro}</p>
      <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">${overlapLine}</p>
      ${NO_PITCH}
      ${SIGNOFF}
    </div>
  `;
}

const emails = [
  {
    to: "premium@sporttours.com.au",
    intro: "I run Experiences | Curated (experiences-curated.com), a small site that builds detailed destination and logistics guides for sports fans travelling to specific events. Right now that's our Australia tour of South Africa cricket guide, the BMW PGA Championship and Open Championship on golf, Wimbledon and the US Open on tennis, and Belgian GP, Italian GP, and Hungarian GP on motorsport, with Singapore GP, Las Vegas GP, Abu Dhabi GP, the Alfred Dunhill Links Championship, the ATP Finals, and a New Zealand in Australia Test series guide featuring the Boxing Day and New Year Test matches all in the works.",
    overlapLine: "I noticed the overlap with what you cover, cricket tours, golf, tennis, and motorsport, and had a genuine question rather than a pitch: when you're building out a tour for a new destination or event, is destination-specific research (getting-there logistics, local recommendations, that level of detail) something you handle in-house, or is it ever a gap?",
  },
  {
    to: "info@travelosports.com",
    intro: "I run Experiences | Curated (experiences-curated.com), a small site that builds detailed destination and logistics guides for sports fans travelling to specific events. Right now that's our India in England cricket tour guide, the Australia tour of South Africa, the Open Championship and BMW PGA on golf, and Wimbledon and the US Open on tennis, with the Alfred Dunhill Links Championship and the ATP Finals in the works.",
    overlapLine: "I noticed the overlap with what you cover, cricket and golf tours specifically, and had a genuine question rather than a pitch: when you're building out a tour for a new destination or event, is destination-specific research (getting-there logistics, local recommendations, that level of detail) something you handle in-house, or is it ever a gap?",
  },
  {
    to: "sales@cuttingedgein.com",
    intro: "I run Experiences | Curated (experiences-curated.com), a small site that builds detailed destination and logistics guides for sports fans travelling to specific events. Right now that's our India in England cricket tour guide, the Australia tour of South Africa, Belgian GP, Italian GP, and Hungarian GP on motorsport, and Wimbledon and the US Open on tennis, with Singapore GP, Las Vegas GP, Abu Dhabi GP, the ATP Finals, and a New Zealand in Australia Test series guide featuring the Boxing Day and New Year Test matches all in the works.",
    overlapLine: "I noticed the overlap with what you cover, cricket, F1, and tennis majors, and had a genuine question rather than a pitch: when you're building out a tour for a new destination or event, is destination-specific research (getting-there logistics, local recommendations, that level of detail) something you handle in-house, or is it ever a gap?",
  },
  {
    to: "info@sasportstours.co.za",
    intro: "I run Experiences | Curated (experiences-curated.com), a small site that builds detailed destination and logistics guides for sports fans travelling to specific events. Right now that's our Australia tour of South Africa cricket guide, covering Durban, Johannesburg, and Cape Town, the Open Championship and BMW PGA on golf, Belgian GP, Italian GP, and Hungarian GP on motorsport, and Wimbledon and the US Open on tennis, with Singapore GP, Las Vegas GP, Abu Dhabi GP, the Alfred Dunhill Links Championship, the ATP Finals, and a New Zealand in Australia Test series guide featuring the Boxing Day and New Year Test matches all in the works.",
    overlapLine: "I noticed the overlap with what you cover, golf majors, F1, rugby, and cricket specifically, and had a genuine question rather than a pitch: when you're building out a tour for a new destination or event, is destination-specific research (getting-there logistics, local recommendations, that level of detail) something you handle in-house, or is it ever a gap?",
  },
  {
    to: "info@dreamteamsportstours.com",
    intro: "I run Experiences | Curated (experiences-curated.com), a small site that builds detailed destination and logistics guides for sports fans travelling to specific events. Right now that's the Open Championship and BMW PGA Championship on golf, and our Italian GP guide for Monza, right in your part of the world, with the Alfred Dunhill Links Championship in the works.",
    overlapLine: "I noticed the overlap with golf specifically, and had a genuine question rather than a pitch: when you're building out a tour for a new destination or event, is destination-specific research (getting-there logistics, local recommendations, that level of detail) something you handle in-house, or is it ever a gap?",
  },
  {
    to: "hello@followontours.com",
    intro: "I run Experiences | Curated (experiences-curated.com), a small site that builds detailed destination and logistics guides for sports fans travelling to specific events. Right now that's our India in England cricket tour guide and our Australia tour of South Africa cricket guide, covering Durban, Johannesburg, and Cape Town, with a New Zealand in Australia Test series as well as England's tour of South Africa guide featuring the Boxing Day and New Year Test matches as well as IPL 2027 in the works.",
    overlapLine: "Given your own background in cricket travel specifically, I had a genuine question rather than a pitch: when you're building out a tour for a new destination or event, is destination-specific research (getting-there logistics, local recommendations, that level of detail) something you handle in-house, or is it ever a gap?",
  },
  {
    to: "info@gosporttravel.com",
    intro: "I run Experiences | Curated (experiences-curated.com), a small site that builds detailed destination and logistics guides for sports fans travelling to specific events. Right now that's Belgian GP, Italian GP at Monza, and Hungarian GP, with Singapore GP, Las Vegas GP, and Abu Dhabi GP in the works.",
    overlapLine: "I noticed you cover F1 at Monza specifically, which we already have a full guide for, and had a genuine question rather than a pitch: when you're building out a tour for a new destination or event, is destination-specific research (getting-there logistics, local recommendations, that level of detail) something you handle in-house, or is it ever a gap?",
  },
  {
    to: "sales@champions-travel.com",
    intro: "I run Experiences | Curated (experiences-curated.com), a small site that builds detailed destination and logistics guides for sports fans travelling to specific events. Right now that's our Wimbledon and US Open guide, and Belgian GP, Italian GP, and Hungarian GP on motorsport, with Singapore GP, Las Vegas GP, and Abu Dhabi GP in the works.",
    overlapLine: "I noticed the overlap with what you cover, F1 and Wimbledon specifically, and had a genuine question rather than a pitch: when you're building out a tour for a new destination or event, is destination-specific research (getting-there logistics, local recommendations, that level of detail) something you handle in-house, or is it ever a gap?",
  },
];

const BATCH_SIZE = 8;
const BATCH_DELAY_MS = 1200;
let sent = 0;
const failed = [];

for (let i = 0; i < emails.length; i += BATCH_SIZE) {
  const batch = emails.slice(i, i + BATCH_SIZE);
  const settled = await Promise.allSettled(
    batch.map((e) =>
      resend.emails.send({
        from: "Experiences | Curated <hello@experiences-curated.com>",
        to: e.to,
        subject: "Quick question about destination research for your tours",
        html: wrap(e.intro, e.overlapLine),
      })
    )
  );

  settled.forEach((result, idx) => {
    const email = batch[idx].to;
    if (result.status === "fulfilled" && !result.value.error) {
      console.log(`✓ Sent to ${email}`);
      sent++;
    } else {
      const reason = result.status === "rejected" ? result.reason?.message : result.value?.error?.message;
      console.error(`✗ Failed to send to ${email}:`, reason);
      failed.push({ email, reason });
    }
  });

  if (i + BATCH_SIZE < emails.length) {
    await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS));
  }
}

console.log(`\nDone — sent: ${sent} / ${emails.length}`);
if (failed.length > 0) console.log("Failed:", JSON.stringify(failed, null, 2));
