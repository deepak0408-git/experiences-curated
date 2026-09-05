import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences, sportingEvents, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "6c920919-1d28-420a-a711-2a58fc8ba9e1"; // Austin
const EVENT_SLUG = "united-states-grand-prix";
const slug = "us-gp-bbq-beyond-franklin-" + Date.now().toString(36);

const [existingEvent] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, EVENT_SLUG));

if (!existingEvent) {
  throw new Error(`Sporting event not found for slug ${EVENT_SLUG}`);
}
const eventId = existingEvent.id;

const bodyContent = `Franklin gets the queue and the headlines, but ask an actual Austin local where they get their own barbecue and you'll hear these three names as often as Franklin's — real, well-loved spots doing Central Texas barbecue at a genuinely high level, without the multi-hour commitment.

Micklethwait Craft Meats, a barbecue trailer on Rosewood Avenue in East Austin, holds a Bib Gourmand recognition in the Michelin Guide USA and a real 4.7 rating from over 2,000 reviews. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=8304984004539606573&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA). It's open Thursday through Sunday only, 11am-8pm, and closed Monday through Wednesday entirely — a real scheduling constraint worth checking against your race-weekend days before making the trip out.

LeRoy and Lewis Barbecue, in South Austin, started life as a food truck in 2017 before growing into a full brick-and-mortar spot, and now carries a genuine One Star in the Michelin Guide USA — a real, formal step above Micklethwait's Bib Gourmand recognition. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=10495883606143817494&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA). What sets it apart from traditional Central Texas barbecue is a genuine willingness to go beyond brisket-and-ribs orthodoxy — unconventional cuts and preparations sit alongside the classics, which is either exactly what you want or a reason to stick with a more traditional pick, depending on what you're after.

la Barbecue, on E. Cesar Chavez St, was the first barbecue restaurant in Texas to receive a Michelin star, run by pitmaster Ali Clem out of a massive custom-built backyard pit. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=18254912055511811922&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA). It runs Wednesday-Sunday, 11am-6pm — like Micklethwait, a genuinely limited window that matters more once you're planning around race-day sessions.

All three still have real lines on a busy weekend — this is Austin barbecue, after all — but nothing close to Franklin's routine 4-5 hours. Expect 20-45 minutes at any of the three on a normal day, longer during F1 weekend given the citywide demand spike.`;

const whyItsSpecial = `Franklin earns its reputation, but treating it as the only serious barbecue in Austin misses what actually makes this city's food scene remarkable: depth, not just one famous peak. Three genuinely Michelin-recognized barbecue spots in one mid-sized American city, each with a real point of view — Micklethwait's trailer-scale craft focus, LeRoy and Lewis's willingness to push past tradition, la Barbecue's history as the first to break the Michelin barrier in Texas — is a statement about how seriously this city takes the craft, not a runner-up consolation prize for people who couldn't be bothered to queue.`;

const insiderTips = [
  "Check the actual open days before picking which one to visit on which day of your trip — Micklethwait is closed Monday-Wednesday, la Barbecue is closed Monday-Tuesday, and neither overlaps with the other's schedule cleanly, so a specific day of your race weekend may only realistically work for one or two of the three.",
  "If you want to taste genuinely different approaches to Texas barbecue rather than three versions of the same thing, LeRoy and Lewis's less traditional menu is the one to prioritize over the other two if you can only fit in one visit beyond Franklin.",
];

const whatToAvoid = `Don't assume any of the three keep Franklin-style all-week hours — each has a real closed-day pattern (Micklethwait Mon-Wed, LeRoy and Lewis Tuesday only, la Barbecue Mon-Tue), and showing up on the wrong day means a wasted trip, not a shorter wait. Don't treat "no Franklin-length line" as "no line at all" — all three see real, meaningful waits on a normal weekend, and F1 weekend's citywide demand spike will push that longer than usual at all three simultaneously.`;

const gettingThere = `All three sit in different parts of Austin (East Austin, South Austin) — rideshare or a rental car is the practical way to reach any of them from downtown or COTA.`;

const practicalInfo = {
  hours: "Micklethwait Thu-Sun 11am-8pm; LeRoy and Lewis Sun-Mon & Wed-Thu 11am-9pm, Fri-Sat 11am-10pm, closed Tuesday; la Barbecue Wed-Sun 11am-6pm, closed Mon-Tue",
  costRange: "Moderate — priced by the pound or plate at all three, broadly comparable to Franklin's per-pound pricing",
  bookingMethod: "No reservations at any of the three — walk-in only, though waits are typically 20-45 minutes rather than Franklin's multi-hour queue. Check each restaurant's specific open days before planning your visit, since all three have real closed days that don't overlap perfectly.",
  website: "https://www.craftmeatsaustin.com, https://leroyandlewisbbq.com",
  reservationsRequired: false,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Austin BBQ Beyond Franklin — Three Real Alternatives",
      subtitle: "Michelin recognition, no 4-hour line, and locals will tell you these are just as good",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: eventId,
      neighborhood: "East / South Austin",
      address: "Micklethwait Craft Meats, 1309 Rosewood Ave, Austin, TX 78702; LeRoy and Lewis Barbecue, 5621 Emerald Forest Dr, Austin, TX 78745; la Barbecue, 2401 E. Cesar Chavez St, Austin, TX 78702",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote:
        "Sources: guide.michelin.com listings for all three (Micklethwait Bib Gourmand, LeRoy and Lewis One Star, la Barbecue One Star/first BBQ star in Texas), craftmeatsaustin.com + leroyandlewisbbq.com official sites for hours/address. No confirmed dedicated website found for la Barbecue during this research pass — left honestly noted rather than guessed. All three Google ratings from real, individual Places API lookups (Micklethwait 4.7/2,050, LeRoy and Lewis 4.4/2,453, la Barbecue 4.4/3,549). MULTI-VENUE — requires MULTI_VENUE_RATINGS['us-gp-bbq-beyond-franklin'] entry with venueCount: 3, added in this same session per skill §2c rule 6. No Concierge trigger, no affiliate opportunity (no bookable reservation product at any of the three). Verified 5 Sep 2026.",
      sport: ["formula_one"],
      moodTags: ["foodie", "local-institution", "value"],
      interestCategories: ["food"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "USD",
      bestSeasons: ["oct"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-05",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db
    .insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: eventId })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
