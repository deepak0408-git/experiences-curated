import { config } from "dotenv";
config({ path: ".env.local" });

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const SUBJECT = "Re: Travel guides and trip planning for your customers — a possible partnership";

function buildBody(companyName) {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#0A0A0A">
      <p style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#AAFF00;margin-bottom:28px">Experiences | Curated</p>
      <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">Hi there,</p>
      <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">
        Following up on my note a little while back — wanted to check if it's something worth a short conversation, or if it just got buried.
      </p>
      <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">
        Quick recap: Experiences | Curated builds detailed, event-specific travel guides (F1, tennis, golf, cricket) — where to sit, where to stay, how to actually get to the venue. We're exploring licensing or co-branding this content for tour operators like ${companyName}, so your customers get the same level of destination detail as part of their booking, without your team building it from scratch.
      </p>
      <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:32px">
        Happy to share a couple of real examples first if that's easier, or jump on a quick call whenever suits.
      </p>
      <p style="font-size:14px;color:#ffffff;font-weight:900">The Experiences | Curated team</p>
    </div>
  `;
}

// Batch 1's true non-responders — excludes Dream Sports (already in an
// active reply thread, 21 Aug) and TraveloSports/GoSportTravel (dual-batch
// orgs already followed up today under the Batch 4 thread).
const RECIPIENTS = [
  { company: "Bharat Army", to: "helpme@batravel.com" },
  { company: "Roadtrips", to: "info@roadtrips.com" },
  { company: "GoIndiaHoliday", to: "info@goindiaholiday.net" },
  { company: "Vishwa Vihar Holidays", to: "smile@vishwaviharholidays.com" },
  { company: "Sports Net Holidays", to: "travel@sportsnetholidays.com" },
  { company: "World Sports Travels", to: "mehul@worldsportstravels.in" },
  { company: "Elegant Resorts", to: "enquiries@elegantresorts.co.uk" },
  { company: "Discovery Holidays", to: "info@discoveryholidays.in" },
  { company: "Beyond the Castle Travel", to: "info@beyondthecastletravel.com" },
  { company: "Cassidy Travel", to: "sports@cassidytravel.ie" },
  { company: "Celtic Horizon Tours", to: "info@celtichorizontours.com" },
];

const TEST_MODE = process.argv.includes("--test");
const TEST_RECIPIENT = "deepak0408@gmail.com";

const targets = TEST_MODE
  ? [{ company: RECIPIENTS[0].company, to: TEST_RECIPIENT }]
  : RECIPIENTS;

console.log(`\n${TEST_MODE ? "[TEST] Sending" : "Sending"} to ${targets.length} recipient(s):`);
targets.forEach((r) => console.log(" ", r.to, `(${r.company})`));
console.log();

let sent = 0;
for (const r of targets) {
  try {
    await resend.emails.send({
      from: "Experiences | Curated <hello@experiences-curated.com>",
      to: r.to,
      subject: TEST_MODE ? `[TEST] ${SUBJECT}` : SUBJECT,
      html: buildBody(r.company),
    });
    console.log(`✓ Sent to ${r.to} — ${r.company}`);
    sent++;
  } catch (err) {
    console.error(`✗ Failed to send to ${r.to}:`, err.message);
  }
}

console.log(`\nDone — sent: ${sent} / ${targets.length}`);
