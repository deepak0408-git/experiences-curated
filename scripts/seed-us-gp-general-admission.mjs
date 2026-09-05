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
const slug = "us-gp-general-admission-" + Date.now().toString(36);

const [existingEvent] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, EVENT_SLUG));

if (!existingEvent) {
  throw new Error(`Sporting event not found for slug ${EVENT_SLUG}`);
}
const eventId = existingEvent.id;

const bodyContent = `General Admission is COTA's actual budget entry point, and it works completely differently from every grandstand ticket at this track. There's no reserved seat and no fixed location — you get access to the standing and grass areas ringing the circuit, free to move between vantage points across all three days rather than committing to one view for the whole weekend. That flexibility is the entire product: you can watch the start from one spot, walk to a different corner for the middle of the race, and end up somewhere else entirely for the podium.

Where you actually stand matters enormously, and the good spots get crowded fast. The Turn 1 area covers the most track — the full start-finish straight, Turns 1 and 2, and a sightline across to Turns 17-19 — plus proximity to the podium for the trophy ceremony, but it is, by every account, brutally crowded on race day itself. Turn 6 gives you a genuine run of corners from Turn 2 through Turn 6 with glimpses of the back straight, also popular, also crowded. The quieter alternative is the grass banking around Turns 17-19, which trades some centrality and a longer walk from the south parking areas for actual breathing room and a real cross-track view back to Turn 1. Only the Turn 11 and back-straight infield areas have general-admission TV screens — everywhere else, you're watching live with no fallback if the action moves out of sight.

Here's the detail that catches people out: General Admission tickets are not issued electronically like every other COTA ticket. You get a physical wristband mailed to you, typically 4-6 weeks before race weekend, and you have to wear it to get in — lose it or don't receive it, and your options are the on-site Box Office during race week, not your phone. If you bought through a reseller like Costco, there's a separate voucher-redemption deadline (11 October 2026) to get your wristband mailed rather than picked up at will call.

Every ticket covers all three race-weekend days, fan zone, fan shop, and food and drink access, plus entry to the Germania Insurance Super Stage Festival Lawn concerts on Friday and Saturday nights — the same concert access every ticket tier gets, GA included.`;

const whyItsSpecial = `A grandstand ticket commits you to one view for the entire weekend. General Admission is the only ticket at COTA that lets you actually explore the circuit — walk the fence line at Turn 1 for the start, wander over to the elevation changes around Turn 6 for the mid-race corners, and settle somewhere quieter for the closing laps. For a first-timer who genuinely doesn't know yet what kind of seat they'll want next time, GA is a real way to scout the whole track before committing serious money to a specific grandstand in a future year. It rewards fans who are willing to walk, arrive early, and treat the day as active rather than a fixed seat you settle into — a genuinely different kind of race-day experience from any of COTA's reserved products, not just a cheaper version of one.`;

const insiderTips = [
  "Scout your preferred viewing spot on Friday or Saturday practice/qualifying, when crowds are lighter, then head straight for that exact spot before gates open on Sunday — the popular areas (Turn 1 especially) fill in fast enough on race morning that showing up mid-morning can mean settling for whatever's left.",
  "Bring a folding camping chair, a portable radio (COTA's own broadcast runs on FM 102.7 and AM 1370), and sun protection — none of these are optional extras for a GA day, they're what separates a comfortable day from a rough one when you have no seat and no shade guaranteed.",
];

const whatToAvoid = `Don't assume your ticket arrives on your phone like every other COTA ticket tier — General Admission wristbands are physically mailed 4-6 weeks ahead, and if you're not confident your shipping address is current or you're buying close to the event, you may need to collect it in person at the Box Office instead. Don't head straight for the Turn 1 area assuming it's simply "the best spot" — it covers the most track, but it's also, by every account, the single most crowded general-admission area at the entire circuit on race day; if personal space matters as much as sightlines, the Turns 17-19 grass banking is a genuinely less crowded trade worth considering.`;

const gettingThere = `COTA sits about 15 miles (24km) southeast of downtown Austin. Shuttles run continuously throughout race weekend from two pick-up points — Downtown at Waterloo Park and the Travis County Expo Center — with a journey time of roughly 30 minutes with no traffic, well over an hour on race day itself.`;

const practicalInfo = {
  hours: "Gates typically open 9:00-10:00am each day of the 23-25 October race weekend",
  costRange: "3-Day General Admission Grounds Pass has run around US$450 including fees at recent COTA rounds — confirm current pricing directly, as the 2026 listing is currently showing sold out",
  bookingMethod: "Tickets sell through circuitoftheamericas.com and austin.gp. Wristbands are mailed 4-6 weeks before the event, not issued digitally — make sure your shipping address is current on your account, and if it hasn't arrived by race week, go to the on-site Box Office rather than waiting.",
  website: "https://circuitoftheamericas.com/ticket/f1-general-admission/",
  reservationsRequired: false,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "General Admission — the Budget Way In",
      subtitle: "No seat, no fixed spot, and — unlike every grandstand — a physical wristband mailed to your house",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: eventId,
      neighborhood: "Circuit of the Americas",
      address: "9201 Circuit of the Americas Blvd, Austin, TX 78617",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote:
        "Sources: help.thecircuit.com General Admission Grounds Pass + 'digital or physical tickets' pages (confirmed GA wristbands are physically mailed 4-6 weeks ahead, not digital — the one genuinely load-bearing fact here, sourced from COTA's own help center, not the unofficial reseller site initially surfaced), oversteer48.com COTA General Admission viewing guide (Turn 1/Turn 6/Turns 17-19 spot comparison, crowd levels, what to bring, radio frequencies). Price ($450 incl. fees) sourced from GPDestinations aggregator citing recent COTA pricing, not directly confirmed on COTA's own page (currently sold out, no price shown) — flagged as 'has run around' per skill §2d rather than stated as confirmed current fact. No Concierge trigger, no affiliate opportunity. Google Places rating reused from Circuit of the Americas' own venue listing. Verified 5 Sep 2026.",
      googleMapsRating: "4.6",
      googleMapsReviewCount: 17782,
      googleMapsUrl: "https://maps.google.com/?cid=10009294002508390637&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
      sport: ["formula_one"],
      moodTags: ["budget", "flexible", "active"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 3,
      budgetTier: "budget",
      budgetCurrency: "USD",
      bestSeasons: ["oct"],
      advanceBookingRequired: true,
      availability: "event_only",
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
