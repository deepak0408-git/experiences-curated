import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

// Chinese GP (Shanghai) — Grandstand E, seeded 2 Oct 2026 via experience-researcher
// + experience-seeder skills. Approved by founder. No hero image yet (pending
// hero-image-search + curator choice — left null per skill §0 gate).
//
// Sources: formula1.com's official 2026 on-sale article (Turn 11-13 location,
// "newly configured", shuttle service), english.shanghai.gov.cn's official 2026
// spectator guide (capacity 4,000+, 3-day-only, shuttle route), citynewsservice.cn's
// Hai Guide spectator guide (Gate 6, P5->P13 shuttle hours). Price (1,580 CNY /
// ~US$224) matches the existing circuit_seating_profile tier2 figure already
// seeded for this event (seed-chinese-gp-circuit-seating.mjs) -- not a new or
// conflicting number. Confirmed via WebFetch of formula1shanghai.com/en/tickets
// that Grandstand E is NOT yet listed among 2027 products (only A/B/H/K) --
// stated honestly in body/avoid. No Google Maps rating -- not an independently
// addressable venue, consistent with sibling Grandstand A/B/H/K experiences in
// this pack. Not a Concierge pick (founder-confirmed) -- same treatment as A/B/H/K.
//
// INSERT ONLY -- per CLAUDE.md's standing rule, no delete script exists or will
// be written for this row.

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "998a8774-05ac-4482-ba7a-4ca2a556b963"; // Shanghai
const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d"; // Chinese Grand Prix 2027
const slug = "chinese-gp-grandstand-e-" + Date.now().toString(36);

const bodyContent = `Grandstand E is the newest seat at Shanghai International Circuit. It opened in 2026, built into the corner leading onto the circuit's 1.1km back straight, the Turn 11-13 complex, where cars are still carrying real speed before the track bends them toward the long run down to the Turn 14 hairpin. Shanghai's municipal government, which handles the circuit's spectator logistics, puts capacity at more than 4,000 and sells it on a three-day ticket only. No single-day option, at least for the one edition it's existed so far.

The location tells you what kind of seat this is. Turn 11-13 isn't where the circuit's drama concentrates. That's Turn 14, where Grandstands H and K face off across the hairpin, and where Formula 1's own race guide calls K the best seat at the circuit for watching overtakes outright. E catches the cars mid-flow instead, still at speed, before the lap's real business happens. It's a seat for the rhythm of the track rather than its one headline passing zone.

It also takes more effort to reach than a stand off the main paddock walk. Enter through Gate 6, then catch the dedicated shuttle running between the P5 parking lot near Grandstand J and P13 near Grandstand E itself, according to the circuit's own spectator guide. That shuttle only runs specific hours, roughly 8:30am-3pm outbound and 9:30am-3pm back, so arriving or leaving outside that window means a longer walk than you'd expect.

On price, E undercut the circuit's premium stands in its first year: a three-day ticket ran 1,580 CNY, roughly US$224, priced alongside H and K rather than the pricier Grandstand A. Formula 1's own announcement calls it "newly configured" and leans on the usual "unparalleled vantage point" line. Unlike A, H, and K, Grandstand E is uncovered — pack for Shanghai's April weather accordingly, since there's no roof between you and whatever the sky does that day.

One thing worth stating plainly: Grandstand E hasn't shown up yet on the circuit's own 2027 ticket pages, which list A, B, H and K but not E. It's a new, purpose-built stand rather than a temporary one, so there's no obvious reason it would quietly disappear. But until the circuit's site actually lists a 2027 Grandstand E product, that's a gap worth checking before you commit to this specific seat.`;

const whyItsSpecial = `Most grandstand write-ups tell you where the best seat is. This one is almost the opposite case. Grandstand E is worth knowing about precisely because it isn't trying to be Shanghai's best seat — that's K, at the hairpin, and anyone planning this trip already knows it. E is for someone who wants a real reserved seat in the circuit's mid-price band without fighting for the handful everyone wants first. It's also genuinely new, built for 2026, which means real uncertainty comes with recommending it. We don't know if it's covered. We don't know if 2027 keeps the same shuttle setup or the same price band. What we do know: it's real, it's reasonably priced, and it watches a stretch of track most seat-buyers never think about. A fair pick for anyone who's already decided the hairpin stands are sold out or not worth the premium.`;

const insiderTips = [
  "The P5→P13 shuttle only runs roughly 8:30am-3pm each way — if you're planning to leave the circuit earlier or stay later than that window, budget for a much longer walk back to the main gates instead.",
  "Grandstand E was priced in the same tier as H and K in its debut year, not the pricier Grandstand A tier — if those two sell out, E is a genuine same-price-band alternative, not a downgrade.",
];

const whatToAvoid = `Don't book Grandstand E expecting shelter — it's the one named grandstand at this circuit confirmed uncovered, unlike A, H, and K, so a rainy or sun-heavy session day means sitting through it exposed. Don't buy a single-day ticket hoping to add Grandstand E — it sold three-day-only in its first year, so if your plan is one session only, this stand isn't the one to build it around.`;

const gettingThere = "Enter through Gate 6; catch the dedicated shuttle between P5 parking lot (near Grandstand J) and P13 (near Grandstand E) — runs roughly 8:30am-3pm outbound, 9:30am-3pm return";

const practicalInfo = {
  hours: "Gates typically open several hours before the day's first session — exact 2027 times TBC",
  costRange: "3-day ticket ~1,580 CNY (~US$224) in 2026, priced alongside Grandstands H and K — 2027 pricing not yet published",
  bookingMethod: "Not yet on sale for 2027 — Grandstand E hasn't appeared on the circuit's own 2027 ticket pages yet (only A, B, H, and K are listed there so far). Register for pre-sale access on Formula 1's official China ticketing site and watch for this specific stand to appear before buying.",
  website: "https://ticketing.formula1.com/china",
  reservationsRequired: true,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Grandstand E — Shanghai's Newest Vantage Point",
      subtitle: "A fresh grandstand on the fast run into Turn 11-13, priced below the circuit's headline stands.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Anting, Jiading District",
      address: "Shanghai International Circuit, No. 2000 Yining Road, Anting Town, Jiading District, Shanghai",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote:
        "Sourced 2 Oct 2026: formula1.com's official 2026 on-sale article (Turn 11-13 location, 'newly configured', shuttle), english.shanghai.gov.cn's official 2026 spectator guide (capacity 4,000+, 3-day-only, shuttle route), citynewsservice.cn's Hai Guide spectator guide (Gate 6, P5→P13 shuttle hours). Price (1,580 CNY/~US$224) matches existing circuit_seating_profile tier2 figure already seeded for this event — not a new/conflicting number. Confirmed via WebFetch of formula1shanghai.com/en/tickets that Grandstand E is NOT yet listed among 2027 products (only A/B/H/K) — stated honestly in body/avoid. No Google Maps rating — not an independently addressable venue, consistent with sibling Grandstand A/B/H/K experiences. Not a Concierge pick — founder-confirmed 2 Oct 2026, same treatment as A/B/H/K. UPDATED 2 Oct 2026: covered status upgraded from 'unconfirmed' to confirmed uncovered (covered: false), and 3-day-only ticket status confirmed HIGH confidence, per this event's circuit_seating_profile row for Grandstand E, founder-confirmed 27 Sep 2026 — supersedes this experience's earlier hedged 'nothing on record confirms a roof' language. whatToAvoid rewritten accordingly.",
      sport: ["formula_one"],
      moodTags: ["trackside", "value_pick"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-10-02",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
  console.log("  Status:", result.status);
  console.log("\n→ Ready to review at: http://localhost:3000/curator/review");
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
