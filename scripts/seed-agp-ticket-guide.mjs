import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f6b2c13f-cb70-45e3-9dcf-2a821d9e6f50"; // Melbourne
const EVENT_ID = "64792f75-c009-4070-a12b-23d7bd0a3a7f"; // Australian GP 2027
const slug = "ausgp-ticket-guide-grandstands-park-pass-" + Date.now().toString(36);

const bodyContent = `The 2027 Australian Grand Prix runs Thursday 1 to Sunday 4 April, and it's a genuinely different weekend from recent years — the first time Formula 1's Sprint format has ever been used at Albert Park. That means Sprint Qualifying lands on Friday and the Sprint race itself on Saturday, on top of the usual Qualifying-Saturday, Race-Sunday rhythm — effectively two competitive sessions worth watching on Saturday alone. Anyone who last attended before 2027 should recalibrate their weekend plan around that change rather than assuming the old schedule still applies.

Tickets go on sale in stages. Albert Park Circuit Club members get first access from Thursday 1 October 2026, American Express cardholders get a presale window from Friday 2 October at 12pm AEST, and general public sales open Tuesday 6 October at 12pm AEDT. Given the 2026 race drew a record 483,934 spectators across four days — the biggest crowd of Melbourne's F1 era — a new Sprint-format 2027 weekend is very likely to see comparable or higher demand, so buying inside the first general-sale window rather than waiting is the safer approach for any popular grandstand.

The three product types are genuinely different purchases, not just price points. Park Pass general admission (from around US$160 for a single day, per current planner-tier pricing) buys mobility around the whole circuit with no fixed seat. The mid-tier grandstands — Vettel, Waite, Stewart, Senna and similar corner-specific stands — run roughly US$330-400 for three days and buy a fixed, reserved seat with a specific view. The top-tier stands — Fangio, Piastri, Prost, Jones — run roughly US$485-625 for three days and add the pit lane, podium and start-finish straight to that reserved seat. Hospitality sits above all three, starting around US$3,900 for an entry-level suite and running well past US$15,000 for full Paddock Club access with its pit lane walks and rooftop deck.

Adult single-day passes start from around $45 — a genuine, low-cost way to attend a support-category or early-practice day without committing to a full weekend ticket, worth knowing about for a first Grand Prix visit or a group with mixed budgets.`;

const whyItsSpecial = `Most ticket guides just list prices. What actually matters at Albert Park is understanding that Park Pass, grandstand, and hospitality aren't three price tiers of the same product — they're three different ways of experiencing the same race weekend, and picking the wrong one for what you actually want to do is the real mistake, not overpaying or underpaying by a few dollars.

2027 adds a genuine wrinkle that's easy to miss if you're going off last year's experience: this is Albert Park's first Sprint weekend, which changes what happens on Friday and Saturday specifically. A ticket guide that doesn't flag that change isn't actually current, no matter how accurate its pricing is. Buying early, inside the first genuine sales window rather than the week before the race, matters more this year than most given the record crowd the 2026 race already drew before this format change was even announced.`;

const insiderTips = [
  "American Express cardholders get presale access a full four days before general public sale opens (2 Oct vs. 6 Oct 2026) — worth checking if anyone in your booking party holds an eligible card, since it's a genuine head start on popular grandstands.",
  "If you only want to attend one day, Friday of a Sprint weekend is worth more than a normal Grand Prix Friday — Sprint Qualifying now happens that day, not just first practice, so a single-day Friday ticket buys real competitive action for the first time under this format.",
];

const whatToAvoid = "Don't assume the old Friday-practice/Saturday-qualifying/Sunday-race rhythm still applies in 2027 — Sprint Qualifying is now on Friday and the Sprint race itself is on Saturday, alongside main qualifying, which changes what's worth attending on which day. And don't wait until closer to race weekend to buy, expecting inventory to still be open on your preferred grandstand — the 2026 race already set a record attendance of 483,934 across four days before this Sprint-format change was announced, and the added novelty of a first-ever Melbourne Sprint is likely to pull demand forward, not spread it out.";

const practicalInfo = {
  hours: "General public tickets go on sale Tuesday 6 October 2026, 12pm AEDT. Event runs Thursday 1 – Sunday 4 April 2027.",
  costRange: "From ~$45 (single-day adult) up to US$15,000+ (full Paddock Club, 3-day) — see individual grandstand, Park Pass and hospitality experiences for tier-specific pricing.",
  bookingMethod: "Buy through Ticketmaster Australia or directly via grandprix.com.au — Albert Park Circuit Club members and American Express cardholders get presale access ahead of the 6 October 2026 general sale.",
  howToBook: "If you want a specific grandstand with a real chance of it still being available, don't wait for general sale on 6 October 2026 — the Circuit Club membership (opens 1 Oct) and American Express presale (opens 2 Oct, noon AEST) both open days earlier, and Albert Park's 2026 record crowd of 483,934 makes early access genuinely worth pursuing for anyone who has a specific stand in mind rather than a flexible one. Check ticketmaster.com.au and grandprix.com.au from late September 2026 for the exact presale registration steps, since a Sprint-format debut year is likely to move faster through inventory than a standard-format year did previously.",
  website: "https://www.grandprix.com.au/en/tickets, https://ticketing.formula1.com/australia/",
  reservationsRequired: true,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "AusGP Ticket Guide — Park Pass, Grandstands & Hospitality",
      subtitle: "2027 is Albert Park's first Sprint weekend — the real on-sale calendar and which ticket type actually fits you.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Albert Park Grand Prix Circuit",
      address: "Albert Park Grand Prix Circuit, 12 Aughtie Dr, Albert Park VIC 3206, Australia",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      editorialNote: "Sources: speedcafe.com (full presale calendar: Circuit Club 1 Oct, Amex presale 2 Oct noon AEST, general sale 6 Oct noon AEDT; Sprint Qualifying Friday/Sprint race Saturday confirmed; 2026 attendance record 483,934), drive.com.au and grandprix.com.au news release (event dates Thu 1 - Sun 4 Apr 2027, Sprint format debut), gpfans.com (single-day pricing from $45). Cross-referenced grandstand/hospitality tier pricing against seeded planner_ticket_tier_cost and this pack's own Fangio/Vettel/Paddock Club experiences for consistency. IMPORTANT FLAG: this event's real confirmed dates (Thu 1 - Sun 4 Apr 2027, 4 days) differ from the sportingEvents DB row currently on file (startDate 2027-04-02, endDate 2027-04-04, 3 days) — flagged to founder for DB correction, not silently changed here. Concierge pick — real dated 2027 presale calendar. Verified 20 Sep 2026.",
      sport: ["formula_one"],
      moodTags: ["practical", "high-energy"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-20",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created:", result.title, "|", result.id, "|", result.slug, "|", result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
