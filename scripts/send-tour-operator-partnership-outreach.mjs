import { config } from "dotenv";
config({ path: ".env.local" });

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const SUBJECT = "Travel guides and trip planning for your customers — a possible partnership";

function buildBody(companyName) {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;background:#0A0A0A">
      <p style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#AAFF00;margin-bottom:28px">Experiences | Curated</p>
      <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">Hi there,</p>
      <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">
        I run Experiences | Curated (www.experiences-curated.com) — a sports travel platform offering trip budget planning services and detailed, event-specific travel guides: where to sit, where to stay, how to actually get to the venue, real researched detail rather than generic advice. We currently cover F1, tennis, golf, and cricket.
      </p>
      <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:16px">
        I am reaching out because we're exploring a different model alongside our own platform: licensing or co-branding this content for tour operators like you, so your customers get the same level of destination detail as part of their booking, without your team having to build it from scratch. That could mean guides bundled into your packages, white-labelled content for your customer materials, or something else entirely, depending on what's actually useful to you.
      </p>
      <p style="font-size:14px;color:#A3A3A3;line-height:1.6;margin-bottom:32px">
        Would you be open to a short call to talk through whether this could work for ${companyName}? Happy to share a couple of real examples first if that's easier.
      </p>
      <p style="font-size:14px;color:#ffffff;font-weight:900">The Experiences | Curated team</p>
    </div>
  `;
}

const recipients = [
  { company: "Dream Sports", to: "contactus@dreamsetgo.com" },
  { company: "Bharat Army", to: "helpme@batravel.com" },
  { company: "TraveloSports", to: "info@travelosports.com" },
  { company: "Roadtrips", to: "info@roadtrips.com" },
  { company: "GoSportTravel", to: "info@gosporttravel.com" },
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

// Standing rule: never send without an explicit test copy to the founder's own
// inbox first, and never send to the real list without explicit approval of
// this exact draft + this exact recipient list. TEST_MODE defaults to true —
// must be deliberately overridden to send to the real list.
const TEST_MODE = process.env.OUTREACH_TEST_MODE !== "false";
const TEST_RECIPIENT = "deepak0408@gmail.com";

const targets = TEST_MODE
  ? [{ company: recipients[0].company, to: TEST_RECIPIENT }]
  : recipients;

let sent = 0;
for (const r of targets) {
  try {
    await resend.emails.send({
      from: "Experiences | Curated <hello@experiences-curated.com>",
      to: r.to,
      subject: SUBJECT,
      html: buildBody(r.company),
    });
    console.log(`✓ Sent (${TEST_MODE ? "TEST" : "LIVE"}) to ${r.to} — ${r.company}`);
    sent++;
  } catch (err) {
    console.error(`✗ Failed to send to ${r.to}:`, err.message);
  }
}

console.log(`\nDone — sent: ${sent} / ${targets.length}${TEST_MODE ? " (TEST MODE — set OUTREACH_TEST_MODE=false to send to the real list)" : ""}`);
