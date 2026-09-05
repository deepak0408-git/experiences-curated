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
const slug = "us-gp-super-stage-concerts-" + Date.now().toString(36);

const [existingEvent] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, EVENT_SLUG));

if (!existingEvent) {
  throw new Error(`Sporting event not found for slug ${EVENT_SLUG}`);
}
const eventId = existingEvent.id;

const bodyContent = `Austin's F1 weekend doesn't stop when the checkered flag drops each day — it turns into a genuine concert weekend on top of the racing, staged at the Germania Insurance Super Stage inside COTA. For 2026, Maroon 5 headlines Friday night (23 October), Post Malone takes Saturday (24 October), and Alesso closes the whole weekend with a post-race set on Sunday. This isn't a side attraction squeezed in after track sessions end — it's built into the ticket structure as a real second reason to be on-site each evening, not just during the day's on-track action.

Access works more simply than it might sound: every race ticket, whatever tier you bought, includes entry to the Festival Lawn for that day's headline concert. You don't need a separate concert ticket to see Maroon 5 or Post Malone if you already hold a Friday or Saturday race ticket — it's baked in. What you can add is proximity. Paid upgrades let you move from the general festival lawn onto the actual racetrack in front of the stage for standing room, or into reserved seating further back, and premium hospitality options like The Haven — a new climate-controlled space at Turn 7 for 2026 — bundle grandstand seating with concert access and hospitality in one package.

Worth being clear-eyed about: this is a headline-artist concert layered on top of an already long day of racing, not a standalone festival you plan your whole evening around. If you've spent the day in the sun watching practice or qualifying, factor that fatigue into whether you want to also stand through a full concert set afterward, or whether the festival lawn — further back, more room to sit — suits you better than fighting for a track-side upgrade spot.`;

const whyItsSpecial = `Most Grand Prix weekends give you racing and nothing else once the sessions end. Austin gives you an actual second event most nights, headlined by artists who'd sell out arenas on their own — and it's already included in the ticket you bought for the racing. That combination is a real part of why COTA's race weekend has built the reputation it has among American fans specifically: it's not just a motorsport event, it's being pitched and delivered as a full entertainment weekend, sport and music both taken seriously rather than one propping up the other. For anyone building their first US GP trip, factoring the concerts into your day-by-day plan — not as an afterthought, but as an actual reason to stay on-site after the chequered flag — changes what "a day at COTA" even means.`;

const insiderTips = [
  "You only need a race ticket for the specific day of the concert you want to see — a Friday-only ticket gets you Maroon 5, but not Post Malone on Saturday, so check your ticket's exact day coverage against which artist you actually want to see before assuming a single-day pass covers both.",
  "The Haven, new for 2026 at Turn 7, bundles grandstand seating with climate-controlled hospitality and concert access in one package — worth comparing directly against buying a standard grandstand ticket plus a separate concert upgrade, since the bundle may work out better value depending on which grandstand you'd otherwise pick.",
];

const whatToAvoid = `Don't assume the concerts are a free-standing festival ticket you can buy on their own — access is tied to holding a race ticket for that specific day; there's no way to attend just the Friday concert without a Friday race ticket. Don't underestimate how tiring a full day of track sessions followed by a standing concert actually is in late-October Texas heat — the festival lawn's more relaxed, seated-friendly space is a genuinely reasonable choice over a track-floor upgrade if you've already been on your feet since the morning.`;

const gettingThere = `Same circuit access as any race-day ticket — COTA sits about 15 miles (24km) southeast of downtown Austin. Race-weekend shuttles run from Downtown's Waterloo Park and the Travis County Expo Center.`;

const practicalInfo = {
  hours: "Friday 23 October (Maroon 5), Saturday 24 October (Post Malone), Sunday 25 October post-race (Alesso) — exact stage times confirmed closer to the event",
  costRange: "Included with every race-weekend ticket tier; paid upgrades available for track-floor standing, reserved seating, or premium hospitality packages like The Haven",
  bookingMethod: "No separate purchase needed if you already hold a race ticket for that day — festival-lawn concert access is included automatically. Upgrade to track-floor or reserved seating at checkout when buying your race ticket, or through austin.gp/circuitoftheamericas.com directly if adding on afterward.",
  website: "https://circuitoftheamericas.com/ticket/the-haven/",
  reservationsRequired: false,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Germania Insurance Super Stage — Race Weekend's Concerts",
      subtitle: "Maroon 5, Post Malone, and a post-race Alesso set — included with every race ticket, upgradeable if you want closer",
      slug,
      experienceType: "event",
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
        "Sources: cbsaustin.com + austinmonthly.com (confirmed Maroon 5 Fri 23 Oct, Post Malone Sat 24 Oct, Alesso Sun post-race closing set), circuitoftheamericas.com The Haven page (confirmed every race ticket includes that day's concert via Festival Lawn access, paid upgrades for track-floor/reserved seating, The Haven as new-for-2026 Turn 7 hospitality bundle). Reconciled an apparent source conflict — one search result implied concerts required separate purchase, another confirmed inclusion — both consistent once clarified: base access included, upgrades paid. No Concierge trigger, no affiliate opportunity. Google Places rating reused from Circuit of the Americas' own venue listing. Verified 5 Sep 2026.",
      googleMapsRating: "4.6",
      googleMapsReviewCount: 17782,
      googleMapsUrl: "https://maps.google.com/?cid=10009294002508390637&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
      sport: ["formula_one"],
      moodTags: ["music", "nightlife", "included"],
      interestCategories: ["sport", "entertainment"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["oct"],
      advanceBookingRequired: false,
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
