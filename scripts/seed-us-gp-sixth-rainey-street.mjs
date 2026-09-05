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
const slug = "us-gp-sixth-rainey-street-" + Date.now().toString(36);

const [existingEvent] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, EVENT_SLUG));

if (!existingEvent) {
  throw new Error(`Sporting event not found for slug ${EVENT_SLUG}`);
}
const eventId = existingEvent.id;

const bodyContent = `Sixth Street was originally Pecan Street, part of Austin's first street grid back in the 1830s, and the grand Victorian buildings and old theaters from its late-1800s heyday still stand today — a genuine layer of history underneath what most visitors experience as pure party street. That party reputation solidified through the 1970s and 80s, when local musicians and bar owners turned the strip into a live-music hub built on cheap drinks and dive-bar charm, after a rougher stretch as home to strip clubs and adult theaters.

Today Sixth Street genuinely splits into three distinct personalities, and knowing which is which changes your night. "Dirty Sixth" — the stretch from Congress to I-35 — is the loud, cheap-drinks, big-crowd version most people picture, unapologetically a party street. West Sixth trades that in for trendy cocktail bars, upscale lounges, and craft beer, a noticeably more polished crowd and price point. East Sixth has become, over the last decade, the genuinely cool option — speakeasies, mezcal bars, intimate live-music venues with real character, the stretch locals actually go to rather than avoid.

Rainey Street is a different proposition entirely. Once a quiet residential block of early-20th-century bungalows, the whole street has been converted — actual houses turned into bars, food trucks parked in former front yards, string lights strung across what used to be porches. Half Step, a dimly lit remodeled bungalow with a large patio, consistently ranks among the strongest cocktail programs in the neighborhood. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=5652443256110082041&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA). Lustre Pearl, the original Rainey Street bar that arguably started the whole transformation, still runs a genuinely spacious backyard and a looser, more social atmosphere. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=11413838803015919003&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA). The juxtaposition of century-old bones with a modern cocktail bar inside is the actual appeal here, not just another bar strip.

Both districts sit close enough together that a night covering both — Rainey Street earlier for cocktails and food trucks, Sixth Street later for the louder party energy — is a realistic, walkable-or-short-rideshare plan rather than an either/or choice.`;

const whyItsSpecial = `A lot of cities have one main nightlife street; Austin genuinely has two with completely different characters within a few blocks of each other, and neither is a watered-down version of the other. Sixth Street's three-way split — Dirty Sixth's chaos, West Sixth's polish, East Sixth's cool — means the same street can be a completely different night depending on which block you land on, which is unusual for a strip most visitors treat as one undifferentiated thing. Rainey Street's specific charm — genuinely converted houses, not bars built to look historic — gives it a texture that's hard to replicate anywhere else in Austin, let alone most American cities. Together they're a real argument for treating an Austin race weekend's evenings as seriously as the racing itself.`;

const insiderTips = [
  "If you want Sixth Street's live-music energy without the loudest, most crowded version of it, head specifically to East Sixth rather than the default \"Dirty Sixth\" stretch closer to Congress Ave — it's the same street, but a genuinely different night.",
  "Rainey Street earlier in the evening, Sixth Street later, is a realistic one-night combination given how close the two districts sit — Rainey's food trucks and cocktails work well before dinner-to-late-night, Sixth Street's energy peaks later.",
];

const whatToAvoid = `Don't assume all of Sixth Street is the same experience just because it's one continuous street name — Dirty Sixth, West Sixth, and East Sixth are genuinely different in crowd, price, and atmosphere, and picking the wrong stretch for what you actually want is an easy, avoidable mistake. Don't skip Rainey Street assuming it's "just more bars" if you've already planned a Sixth Street night — the converted-bungalow format and food-truck-forward setup make it a genuinely different kind of evening, not a redundant stop.`;

const gettingThere = `Both are downtown, walkable from most Downtown/South Congress hotels, or a short rideshare from further out.`;

const practicalInfo = {
  hours: "Most bars open early evening through 2am; specific venue hours vary",
  costRange: "Free to walk both districts; drink prices vary meaningfully by which stretch — Dirty Sixth cheapest, West Sixth and Rainey Street's craft cocktail bars pricier",
  bookingMethod: "No booking needed for either street — walk in, though popular spots on both (especially Half Step and Lustre Pearl on a weekend night) can mean a wait at the door during peak hours.",
  website: "https://www.historic6thstreet.com, https://www.iloveraineystreet.com",
  reservationsRequired: false,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Sixth Street & Rainey Street — Two Very Different Nights Out",
      subtitle: "Historic dive bars, converted bungalows, and three distinct personalities packed into one downtown stretch",
      slug,
      experienceType: "neighborhood",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: eventId,
      neighborhood: "Sixth Street / Rainey Street",
      address: "Sixth Street, Congress Ave to I-35; Rainey Street, Downtown Austin",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote:
        "Sources: austinrelocationguide.com Ultimate Guide to Sixth Street Nightlife (Dirty Sixth/West Sixth/East Sixth three-way split, history), historic6thstreet.com (Pecan Street origin, Victorian-era buildings, 1970s-80s revival), theinfatuation.com + iloveraineystreet.com (Rainey Street bungalow-conversion history, Half Step and Lustre Pearl detail). MULTI-VENUE (Half Step, Lustre Pearl individually named) — requires MULTI_VENUE_RATINGS['us-gp-sixth-rainey-street'] entry with venueCount: 2, added in this same session. Both ratings real, individual Google Places lookups (Half Step 4.6/972, Lustre Pearl Rainey 4.2/484). No Concierge trigger, no affiliate opportunity (walk-in bars, no bookable product). Verified 5 Sep 2026.",
      sport: ["formula_one"],
      moodTags: ["nightlife", "atmosphere", "local"],
      interestCategories: ["culture", "nightlife"],
      pace: "active",
      physicalIntensity: 2,
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
