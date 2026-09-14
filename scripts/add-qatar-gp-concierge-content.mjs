// Qatar GP 2026 — Concierge (howToBook) content for 4 experiences, added
// 15 Sep 2026 to close the Concierge-proportion gap flagged in the
// pre-deployment audit (was 1/22, ~4.5%, vs. ~20-30% guideline). Real
// tactical specifics only — named contacts, exact lead-times, gotchas — per
// the standing bar: "if you deleted the Pro gate, would a non-Pro reader
// lose anything real?" Sources verified 15 Sep 2026 via direct web search
// and page fetches against each property/venue's own site.

import { config } from "dotenv";
config({ path: ".env.local" });
import postgres from "postgres";

const sql = postgres(process.env.DIRECT_URL);

const UPDATES = [
  {
    slug: "qatar-gp-pearl-hotel-mtymuro9",
    howToBook:
      "Email reservations.marsamalaz@kempinski.com directly rather than booking through a third-party platform — Kempinski's own reservations desk can offer suite upgrades and rate matching that don't show on public listings, and will confirm butler service assignment ahead of arrival. The property has 281 rooms total, including 69 suites plus 2 Presidential and 2 Royal suites — for race weekend, ask specifically for Pearl-view or Sea-view categories, since standard Deluxe rooms without a water view sell out first and get allocated to OTAs before the Royal/Presidential tier does. Request early: race-weekend suite inventory at this property is genuinely small (4 top-tier suites total across the whole hotel), and Kempinski doesn't hold a release-date-specific booking window the way F1 Experiences does — email as soon as the calendar date is confirmed each year, not closer to the race.",
  },
  {
    slug: "qatar-gp-lusail-hill-lounge-mtymm3gw",
    howToBook:
      "Book directly through hospitality.lcsc.qa (the circuit's own hospitality portal) or call +44 020 8068 5205 (UK) / +1.833.233.4624 (US) — pricing isn't published live on the site, so you'll need to submit an inquiry or call to get the current 3-day rate confirmed (running approx. £3,449pp / US$4,300+ for 2025's package; expect 2026 to track similarly, confirm exact figure at inquiry). Ask specifically about the 4-night hotel add-on bundled with W Doha or Marriott Marquis, including daily ground transfers — this is a real package option not advertised on the main product page, and booking hotel + hospitality together through the circuit can undercut arranging both separately. Cabana-tier seating within the Lounge is limited and allocated first-come — if a cabana specifically (rather than open lounge seating) matters to your group, say so explicitly when you inquire, since the standard package doesn't guarantee one.",
  },
  {
    slug: "qatar-gp-parisa-atmosphere-dining-mtyn04fd",
    howToBook:
      "Call +974 4441 1494 directly for race-weekend evenings rather than booking through a third-party app — this is the restaurant's own line, and staff can seat larger parties or request a terrace-facing table (the ones actually overlooking the souq's lit alleyways, which is the reason to eat here) in a way generic online booking widgets don't let you specify. Table space is genuinely limited on any given night, and Souq Waqif evenings during race weekend draw both race tourists and Doha's own dinner crowd — call at least a few days ahead for peak weekend nights, and mention explicitly if you want a table with a souq view versus standard indoor seating, since those are allocated differently.",
  },
  {
    slug: "qatar-gp-lusail-marina-hotels-mtymsd31",
    howToBook:
      "Raffles: email info.doha@raffles.com directly and ask about the Book Early offer — a genuine 25% saving off suite rates for bookings made at least 3 days ahead of arrival (non-refundable, applies to Urban Suite category and above), which is a real, current promotion, not a generic \"book early\" platitude. All 132 rooms at Raffles are suites with 24-hour butler service as standard — there's no lower room tier to fall back to if suites sell out, so for a confirmed race date, book as soon as the calendar is announced rather than waiting. Fairmont: call +974 4030 7200 or email info.doha@fairmont.com, and ask specifically about Fairmont Gold rooms — a distinct tier with its own lounge access and benefits, not listed as a headline category on the main booking flow. Fairmont also offers up to 25% off for bookings made 3+ days ahead, same as Raffles next door. Since both hotels share one building but run fully separate reservations systems, confirm which brand you're actually emailing — a request sent to the wrong property's desk won't be forwarded.",
  },
];

for (const { slug, howToBook } of UPDATES) {
  const [current] = await sql`SELECT title, practical_info FROM experiences WHERE slug = ${slug}`;
  if (!current) {
    console.log(`✗ No experience found for slug ${slug}`);
    continue;
  }
  const practicalInfo = { ...current.practical_info, howToBook };
  await sql`UPDATE experiences SET practical_info = ${sql.json(practicalInfo)} WHERE slug = ${slug}`;
  console.log(`✓ ${current.title} — Concierge content added`);
}

await sql.end();
