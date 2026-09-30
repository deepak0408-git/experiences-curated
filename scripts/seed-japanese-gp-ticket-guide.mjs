// Seed: "Ticket Guide: Suzuka's Tiers, Explained" — experience #1/20 for
// Japanese Grand Prix 2027 (Suzuka).
//
// Sources (verified 21 Sep 2026):
// - https://www.japan.gp/en/tickets, https://www.japan.gp/en/ticket-info/general-admission-west-area
//   (2027 pricing not yet published — confirmed "coming soon" via direct fetch)
// - https://www.total-motorsport.com/japanese-gp-2026-tickets/ (2026 confirmed GA + grandstand pricing)
// - https://www.paddockintel.com/suzuka-2026-japanese-grand-prix-cost-economic-impact/ (2026 pricing detail)
// - https://tickets.formula1.com/en/f1-3309-japan (official F1 ticket store)
//
// CORRECTED 22 Sep 2026: japan.gp is an affiliate site, not official. Live DB
// row corrected to ticketing.formula1.com/japan via
// scripts/_fix-japan-gp-official-urls.mjs. This file is left as the
// historical record of what actually ran — do not re-run it, and do not
// treat its japan.gp values below as current truth.
//
// 2027 grandstand/GA prices are genuinely unpublished as of Sep 2026 — this
// piece cites the last-confirmed 2026 figures explicitly labeled as such,
// per skill §2a-3 (never invent a specific unpublished number).

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9a26a4f4-2d3b-4e68-9bc3-ce2b55bb15e9"; // Suzuka
const EVENT_ID = "9fe13c2e-37d1-49f0-8a48-d3ea40186fe4"; // Japanese Grand Prix 2027
const slug = "japanese-gp-suzuka-ticket-guide";

const bodyContent = `Suzuka doesn't sell tickets the way most circuits do. There's no simple general admission, grandstand, premium tier structure — the circuit prices roughly a dozen named grandstands individually, each with its own view, seat type, and price, on top of a roaming general admission ticket. Get the tier wrong here and you either overpay for a seat you didn't need or end up standing behind a fence on race day wondering why you didn't just buy a grandstand ticket in the first place.

General Admission, sold as the West Area ticket, is the flexible option. It's a four-day pass covering the full Sprint weekend — Friday practice and sprint qualifying, Saturday sprint and qualifying, Sunday's race — and it lets you move freely through the open viewing areas around the circuit rather than locking you into one seat. The one quirk worth knowing: on Friday only, GA also grants entry into every grandstand except V1 and V2. That's a genuinely useful way to sit in two or three different stands across one day and work out which corner you actually want a seat at, before committing to a specific grandstand for the rest of the weekend or for next year.

Grandstands split into two real tiers by seat type, not just by price. Most stands — the bulk of the lineup — use bench or bleacher seating, fine for a session or two but a real consideration across three consecutive days. The premium stands (A2, Q2, V1, and V2) use individual bucket seats with headrests, and some of the newer temporary stands (G3, G4, G5, M, P, O) are concrete or gravel terraces at the cheaper end, built to add capacity rather than comfort. V2, the Main Straight Upper stand, sits at the top of the grandstand range — roofed, with a clear line to the podium and access to Saturday's driver interviews, which is as close to a hospitality-adjacent grandstand ticket as Suzuka sells.

As of September 2026, Suzuka's official ticket site lists 2027 pricing as not yet released — the circuit is still running a waitlist rather than open sales. The most recent confirmed figures, from the 2026 race, put GA from around ¥18,000 (roughly US$122), with grandstands running from about ¥22,000 up to ¥105,000 or more (roughly US$149 to US$709+) at the V2 end. Treat these as the reference point for what a similar tier will likely cost in 2027, not as a locked-in 2027 price.

Above the grandstands sits Suzuka's hospitality tier, starting from roughly ¥1,100,000 for the top VIP packages — Paddock Club and its alternatives get their own full breakdown elsewhere in this guide, so this is just where hospitality sits in the overall structure: above every grandstand, priced closer to a small trip than a ticket.

The buying decision comes down to how you're actually watching the race. If you want to see multiple corners and don't mind standing for parts of the weekend, GA is the honest budget option, and the Friday grandstand-hopping trick makes it a genuine scouting tool. If you know you want one seat and one view for the whole weekend, a mid-tier grandstand — bench seating, a real corner, a fraction of V2's price — is where most first-time Suzuka visitors land. Only go straight for a premium bucket-seat stand if a comfortable seat across three days matters more to you than the price difference, because that's specifically what you're paying for at that tier.

Suzuka's premium grandstands and hospitality packages have historically sold out well before race week once sales open — the exact 2027 on-sale date isn't published yet, but the pattern across recent years has been consistent enough that waiting until close to the event is a real risk for anything above general admission.`;

const whyItsSpecial = `Suzuka is one of the few circuits where "buy a grandstand ticket" isn't a single decision — it's roughly twelve separate decisions dressed up as one. A stand's letter or number tells you almost nothing about what you're actually getting until you know whether it's bench seating or a bucket seat, whether it faces 130R or the main straight, and where it sits in a price range that runs from a fraction of the cost of the top tier to nearly six figures in yen.

That's worth understanding before buying, not after. A GA ticket bought without knowing about the Friday grandstand-hopping option is a missed chance to actually test a stand. A grandstand ticket bought without checking seat type is a fine choice for a single session and a genuine discomfort across three days of a Sprint weekend. None of this is complicated once it's laid out — it just isn't laid out anywhere obvious before you're already on the checkout page.`;

const insiderTips = [
  "The Friday-only grandstand access on a GA ticket is easy to miss and genuinely useful — spend an hour or two in two or three different stands before deciding where you actually want to sit for the sprint and race.",
  "If you're buying a grandstand ticket for all three days, check whether it's one of the bench-seating stands or one of the bucket-seat stands (A2, Q2, V1, V2) before you buy — a hard bench for three consecutive days of an April Sprint weekend is a real comfort tradeoff, not a minor one.",
];

const whatToAvoid = `Don't assume General Admission gets you into every grandstand on Friday — V1 and V2 are the two specific exceptions, so if either of those is the stand you want to scout, GA won't get you in even on the one day it otherwise would. Don't buy a mid-tier grandstand seat purely on price without checking its seat type — one of the newer temporary stands (G3, G4, G5, M, P, O) can be a bare concrete or gravel terrace, a genuinely different experience from a standard bench-seat grandstand at a similar price point.`;

const practicalInfo = {
  hours: "Gate times follow the official race-day schedule — not yet published for 2027",
  costRange: "¥18,000–¥105,000+ (2026 confirmed range; 2027 pricing not yet released as of Sep 2026)",
  bookingMethod: "Official tickets at japan.gp/en/tickets and ticketing.formula1.com/japan. 2027 sales have not opened yet — both sites currently run a waitlist ('be first to know when tickets drop').",
  website: "https://www.japan.gp/en/tickets",
};

// UPDATED 22 Sep 2026 (live DB, not this const): getting_there now carries the
// full Nagoya Station -> Suzuka Circuit Ino Station route detail directly,
// per founder's instruction to put it on every in-circuit experience rather
// than only cross-referencing the dedicated Getting to Suzuka experience.
const gettingThere = "See the dedicated Getting to Suzuka experience for full transit detail from Nagoya and the circuit's rail/shuttle connections.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Ticket Guide: Suzuka's Tiers, Explained",
      subtitle: "General admission, grandstands, and hospitality — what each Suzuka ticket actually buys you, and when to book.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Suzuka Circuit",
      address: "Suzuka Circuit, 7992 Ino-cho, Suzuka, Mie 510-0295, Japan",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote:
        "Sources: japan.gp official ticket pages (2027 pricing confirmed unpublished via direct fetch, 21 Sep 2026), total-motorsport.com and paddockintel.com (2026 confirmed GA/grandstand pricing, cited explicitly as prior-year reference, not 2027 fact).",
      sport: ["formula_one"],
      moodTags: ["planning", "first-timer"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-21",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db
    .insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓ Experience created:", result.title, "|", result.id, "|", result.slug, "|", result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
