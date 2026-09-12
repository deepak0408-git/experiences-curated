import { config } from "dotenv";
config({ path: ".env.local" });

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const TEST_MODE = process.argv.includes("--test");
const TEST_RECIPIENT = "deepak0408@gmail.com";

// Follow-up to the Batch 4 tour-operator/portal wave (original send predates
// Resend's retention window, approximate lastContactedAt ~1 Aug 2026 in
// business_partners). Excludes the 2 cricket clubs, which got a distinct
// group-discount pitch, not this general destination-research angle.
const RECIPIENTS = [
  "info@gulliversportstravel.co.uk", // Gulliver's Sports Travel
  "hello@bacsport.co.uk", // BAC Sport
  "hello@globalsports.travel", // Global Sports Travel
  "premium@sporttours.com.au", // Sport Tours Australia
  "info@sasportstours.co.za", // SA Sports Tours
  "hello@followontours.com", // Follow On Tours
  "sales@champions-travel.com", // Champions Travel
  "sales@cuttingedgein.com", // Cutting Edge
  "info@dreamteamsportstours.com", // Dream Team Sports Tours
  "info@travelosports.com", // TraveloSports
  "info@gosporttravel.com", // GoSportTravel
];

const recipients = TEST_MODE ? [TEST_RECIPIENT] : RECIPIENTS;

console.log(`\n${TEST_MODE ? "[TEST] Sending" : "Sending"} to ${recipients.length} recipient(s):`);
recipients.forEach((r) => console.log(" ", r));
console.log();

const subject = `Following up — travel guides for your customers`;

const body = `Hi there,

We reached out a little while ago about Experiences | Curated — we build destination-research guides for major sporting events (F1 Grand Prix weekends, Grand Slams, major golf and cricket tours), covering the gaps that ticket-only research usually misses: getting from circuit to city, where to actually stay, real day-trip options around the event. In addition, we offer customized trip planning services, if that's a better fit for how you work with your customers.

Wanted to circle back in case it got buried. We think there could be a genuine fit for your customers — either as a value-add you point people to, or something more structured if that's of interest.

Happy to send over a sample guide for one of your upcoming destinations, or jump on a quick call if that's easier. Either way, no pressure — just didn't want to let it drop without a nudge.

Best,
Deepak
Experiences | Curated
experiences-curated.com`;

let sent = 0;

for (const email of recipients) {
  try {
    await resend.emails.send({
      from: "Experiences | Curated <hello@experiences-curated.com>",
      to: email,
      subject: TEST_MODE ? `[TEST] ${subject}` : subject,
      text: body,
    });

    console.log(`✓ Sent to ${email}`);
    sent++;
  } catch (err) {
    console.error(`✗ Failed to send to ${email}:`, err.message);
  }
}

console.log(`\nDone — sent: ${sent} / ${recipients.length}`);
