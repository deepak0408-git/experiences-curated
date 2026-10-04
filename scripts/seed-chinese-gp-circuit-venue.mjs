// Shanghai Intl Circuit — Karting Land, Museum & Porsche Experience Centre.
// Sources: english.shanghai.gov.cn (official Shanghai govt tourism site —
// 4A-rated attraction, tour room list, tour times, phone number),
// en.wikipedia.org/wiki/Shanghai_International_Circuit (length 5.451km,
// 16 turns, Hermann Tilke design, June 2004 opening, ¥2.6bn/$450m cost),
// newsroom.porsche.com + pec-shanghai.cn (Porsche's own official sources —
// PEC facts, address, driving package pricing via WebSearch citing
// pec-shanghai.cn/en/package/100 directly — PEC's own site returned HTTP
// 456 on direct fetch), sh.bendibao.com (Shanghai local-government-
// affiliated info portal — circuit tour + karting pricing, 2 Oct 2026),
// Google Places API (New) — real rating/review lookup, 23 Sep 2026. No
// formula1shanghai.com or third-party ticket site cited.
import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "998a8774-05ac-4482-ba7a-4ca2a556b963";
const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d";
const slug = "chinese-gp-circuit-venue-" + Date.now().toString(36);

const bodyContent = `Shanghai International Circuit isn't just a race weekend venue — it's a national 4A-rated tourist attraction in its own right, per Shanghai's own official tourism authority, open to visitors well beyond the three days of the Grand Prix. If you're in the city outside race week, or want to add something genuinely track-adjacent to your itinerary before or after the event, there's real substance here.

The circuit itself is a Hermann Tilke design, 5.451km long with 16 turns, opened in June 2004 at a construction cost of roughly ¥2.6 billion (about US$450 million at the time) — one of the most expensive purpose-built F1 venues ever constructed, and still one of Tilke's signature layouts, built around his trademark long back straight into a tight hairpin. That history is part of what the guided tours below actually walk you through, not just a fact for the record.

The circuit runs guided tours through parts of the facility most fans never see even on race weekend: the model room, the main grandstand, the media center, the actual podium, the control center, the garage and maintenance areas, and a 20th-anniversary collection marking the track's history since it opened. Tours run three times a day — 10:00-11:00, 13:00-14:00, and 15:00-16:00 — and tickets are sold on-site only, no advance booking needed for the standard tour.

Next to the main circuit sits SIC Karting Land, a genuine FIA International Grade A kart track — one of the most demanding karting circuits in Asia, not a casual fairground loop. Recreational sessions can be booked through the circuit's own WeChat mini-program; professional-level karting needs a phone reservation ahead of your visit.

The site's third major draw is a short walk away: the Porsche Experience Centre, the sixth of its kind in the world and the first in Asia, sharing the same address as the circuit itself. Across 100,000 square meters, it runs a genuine handling course and an off-road track alongside a restaurant, café, and Porsche's own Driver's Selection retail store — a real driving-focused attraction, not a branded showroom.

Together, these three things make the circuit a legitimate half-day or full-day destination independent of race weekend — worth knowing about whether you're building a rest day around motorsport during your trip or simply want to see the track up close without a grandstand ticket.`;

const whyItsSpecial = `Most Grand Prix venues disappear from a visitor's itinerary the moment the checkered flag falls — three days of racing, then nothing until next year. Shanghai International Circuit does something more interesting: it stays open as a genuine year-round destination, with a real guided tour into the parts of the facility a race-day ticket never gets you into, a serious FIA-grade karting track next door, and one of only six Porsche Experience Centres in the world sharing its address. That combination — motorsport heritage, hands-on driving, and a premium manufacturer's own flagship experience center, all in one place — is rare even among circuits that host a full Formula 1 calendar. For anyone building a Chinese Grand Prix trip with time to spare before or after race weekend, this is where that time is best spent.`;

const practicalInfo = {
  hours: "Guided circuit tours run 3 times daily: 10:00-11:00, 13:00-14:00, 15:00-16:00. Karting and Porsche Experience Centre hours vary — confirm via WeChat mini-program or PEC's own site before visiting.",
  costRange: "Circuit tours: Leisure Tour (model room, grandstand, media center, podium) ¥70/person (~US$10); Track Exploration Tour (walking + a full shuttle-bus lap of the 5.451km circuit) ¥188/person (~US$26). Recreational karting at SIC Karting Land: ¥180-200/session weekdays, ¥208-228/session weekends (tandem vs. single-seat entertainment kart), 8-minute drive time. Porsche Experience Centre driving packages start around ¥3,600 (Panamera/Macan/Cayenne Performance Driving Experience) and run up to ¥11,911-15,911 for top-tier 911 GT3/718 GT4 RS experiences — all per Porsche's own official booking site. Tickets sold on-site only for the circuit tour; no advance booking needed.",
  bookingMethod: "Circuit tours: purchase on-site, no advance booking required — for package details, call the circuit directly at 021-6956-9516. Recreational karting: book via the Shanghai International Circuit Tourist Area WeChat mini-program. Professional karting: advance phone reservation required. Porsche Experience Centre: book driving packages directly via pec-shanghai.cn.",
  howToBook: "For a private or customized circuit visit beyond the standard 3-times-daily tour slots — useful if you want to time a visit around your own travel schedule rather than the fixed tour windows — call the circuit's visitor line directly at 021-6956-9516 and ask specifically about package options beyond the standard guided tour; the standard tour is walk-up only, but package and group inquiries go through this number.",
  website: "https://pec-shanghai.cn/en/",
};

const gettingThere = "Shanghai Metro Line 11 to Shanghai Circuit station, then a short walk within the circuit complex — the karting facility and Porsche Experience Centre share the same general address as the main circuit (No. 2000 Yining Road, Anting Town, Jiading District).";

const insiderTips = [
  "The circuit's guided tour only runs 3 fixed daily slots (10-11am, 1-2pm, 3-4pm) and tickets are on-site only — arrive with one of those windows in mind rather than showing up expecting a flexible start time.",
  "Professional-level karting at SIC Karting Land needs a phone reservation in advance, unlike recreational sessions which can be booked same-day via the WeChat mini-program — decide which tier you want before you arrive, not after.",
];

const whatToAvoid = "Don't assume this is a casual fairground karting experience — SIC Karting Land is built to FIA International Grade A standard, one of Asia's more demanding kart tracks, so come with realistic expectations if you're a first-time karter rather than expecting a leisurely lap. Don't try to book the standard circuit tour in advance — tickets are sold on-site only, so advance online booking attempts for the regular tour will come up empty; the phone number is for package/group inquiries specifically, not the standard walk-up tour.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Shanghai Circuit — Karting, Museum & Porsche Centre",
      subtitle: "A 4A-rated attraction year-round: guided tours, FIA-grade karting, and one of six Porsche Experience Centres worldwide.",
      slug,
      experienceType: "sports_venue",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Anting, Jiading District",
      address: "Shanghai International Circuit, No. 2000 Yining Road, Anting Town, Jiading District, Shanghai, China",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from english.shanghai.gov.cn (official Shanghai govt tourism — 4A rating, tour rooms/times, phone number), en.wikipedia.org/wiki/Shanghai_International_Circuit (circuit length 5.451km, 16 turns, Hermann Tilke design, June 2004 opening, ¥2.6bn/US$450m construction cost), newsroom.porsche.com + pec-shanghai.cn (Porsche's own official sources — PEC facts and driving package pricing, via WebSearch citing pec-shanghai.cn/en/package/100 directly — PEC's own site returned HTTP 456 on direct fetch, so pricing is WebSearch-aggregated from the official domain rather than a direct page read). Circuit tour and karting pricing via sh.bendibao.com (Shanghai local-government-affiliated info portal), 2 Oct 2026 — Leisure Tour ¥70, Track Exploration Tour ¥188, karting ¥180-228 by day/kart type. Google Places API (New) lookup, 23 Sep 2026: 4.4/343 reviews (listed as 'Shanghai Audi International Circuit', current sponsorship naming).",
      googleMapsRating: "4.4",
      googleMapsReviewCount: 343,
      googleMapsUrl: "https://maps.google.com/?cid=2015127197958322509&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
      sport: ["formula_one"],
      moodTags: ["adventurous", "hands-on"],
      interestCategories: ["sport", "activity"],
      pace: "active",
      physicalIntensity: 3,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: new Date().toISOString().slice(0, 10),
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓", result.title, "→", result.id, `(${result.slug})`, result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
