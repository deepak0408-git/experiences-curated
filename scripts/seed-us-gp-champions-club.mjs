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
const slug = "us-gp-champions-club-" + Date.now().toString(36);

const [existingEvent] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, EVENT_SLUG));

if (!existingEvent) {
  throw new Error(`Sporting event not found for slug ${EVENT_SLUG}`);
}
const eventId = existingEvent.id;

const bodyContent = `Champions Club sits one tier below the Paddock Club in F1 Experiences' hospitality structure, and Austin's version makes that distinction clear rather than blurring it. Where the Paddock Club puts you above the garages, Champions Club seating is trackside — Main Grandstand Trackside East/West sections — with a climate-controlled venue and partially-covered outdoor terrace behind it, looking out over the Main Straight and into the team garages and pit lane. It's a genuinely different physical vantage point from the Paddock Club, not just a cheaper version of the same seat.

The food and drink runs Friday through Sunday: light bites plus a specially curated lunch menu, and a premium open bar covering spirits, beer, wine, and soft drinks — a step down from the Paddock Club's full all-inclusive local menu, but a real hospitality spread rather than a stripped-back one. The activities are where Champions Club earns its own identity rather than reading as a discount Paddock Club. Every guest gets a Grid Walk, taking you down the actual starting grid before race day, followed by a professional photo alongside the Formula 1 World Championship trophy — assigned to either Friday or Saturday of the weekend. There's also a guided F1 Paddock Tour on one day, and scheduled F1 Insider Appearances on Saturday and Sunday, past guests have specifically noted F1 driver appearances as part of this tier's programming.

Like the Paddock Club, hotel bundling is available directly through the operator — a 4-night stay, Thursday through Monday, with daily round-trip transfers to COTA baked into the package rather than arranged separately.

Champions Club and the 300 Club Paddock Club tier both sold out for the 2026 US GP well ahead of the event, which says something real about how fast Austin's flagship-round hospitality moves compared to other stops on the calendar — this isn't a product that's realistically available as a last-minute upgrade.`;

const whyItsSpecial = `The Grid Walk is the thing that actually separates this tier from being "Paddock Club, but cheaper." Standing on the exact tarmac where cars will line up hours later, then getting your own photo with the World Championship trophy, is a specific, singular moment that no grandstand seat at any price replicates — it's not proximity to the racing, it's proximity to the sport's own ceremony. Champions Club works best for someone who wants a genuine hospitality experience and a story to tell afterward, without necessarily needing the Paddock Club's deeper mechanical access (the pit-stop walk, the full circuit truck tour). It's the tier built for the moment, not the process.`;

const insiderTips = [
  "Your Grid Walk and trophy photo are assigned to one specific day — Friday or Saturday, not your choice — so don't build other Friday/Saturday plans assuming you'll know your exact slot until it's confirmed.",
  "Past attendees have reported F1 driver appearances as part of the Saturday-Sunday Insider Appearances programming — not guaranteed every year, but a real, recurring feature worth factoring into which day you prioritize being on-site if driver access matters to you.",
];

const whatToAvoid = `Don't book this tier expecting the Paddock Club's food-and-bar standard — Champions Club's lunch menu and open bar are real and good, but it's explicitly a lighter, less all-inclusive spread than what the tier above it offers, and the gap is worth knowing before you compare prices. Don't wait for a late-availability deal — both Champions Club and the 300 Club sold out for 2026 well ahead of race weekend, meaning any future Austin round should be one of the very first bookings you make, not something you shop for once flights and hotels are already locked in.`;

const gettingThere = `COTA sits about 15 miles (24km) southeast of downtown Austin. Hotel-package transfers are available directly through F1 Experiences for guests who add the accommodation bundle, or use the standard race-weekend shuttle from Downtown's Waterloo Park or the Travis County Expo Center.`;

const practicalInfo = {
  hours: "Friday through Sunday of race weekend (23-25 October); Grid Walk and trophy photo assigned to either Friday or Saturday",
  costRange: "Pricing not published by F1 Experiences as of this listing; the 2026 US GP Champions Club package is currently sold out",
  bookingMethod: "Book through F1 Experiences (f1experiences.com) or an authorized reseller. US contact line: +1.888.326.5430.",
  howToBook:
    "This tier sold out for 2026 alongside the 300 Club Paddock Club — Austin's flagship US round moves through hospitality inventory faster than most other rounds on the calendar. Call F1 Experiences directly at +1.888.326.5430 for a future edition rather than waiting on the public web listing, since repeat clients are typically offered early access before general sale opens, and a tier that shows \"sold out\" online has usually been gone from the standard channel for some time already. If you specifically want the Grid Walk and trophy photo experience over the Paddock Club's pit-lane access, say so when you call — it's the deciding factor between the two tiers and worth stating up front rather than defaulting to whichever tier has availability first.",
  website: "https://f1experiences.com/2026-united-states-grand-prix/champions-club-3-days",
  reservationsRequired: true,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Champions Club — Grid Walk and a Trophy Photo",
      subtitle: "A step below Paddock Club on price, but with its own signature: walking the actual starting grid",
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
        "Sources: f1experiences.com Champions Club 3-Day page (fetched 5 Sep 2026 — confirmed sold-out status, trackside E/W seating, lunch/open-bar detail, grid walk + trophy photo, paddock tour, insider appearances), WebSearch corroboration on F1 driver appearances at insider sessions and grid-walk/trophy-photo day assignment. Concierge pick per pre-approval — genuine VIP tier distinct from Paddock Club (trackside vs. above-garage, lighter hospitality, signature grid-walk/trophy moment), real named operator/contact (+1.888.326.5430), genuine sold-out lead-time trap. Public bookingMethod kept to website/general line only; tactical detail gated in howToBook per the no-duplicate-contact rule. No exact price published — flagged honestly rather than citing an unconfirmed figure. No Booking.com/GYG affiliate opportunity. Google Places rating reused from Circuit of the Americas' own venue listing. Verified 5 Sep 2026.",
      googleMapsRating: "4.6",
      googleMapsReviewCount: 17782,
      googleMapsUrl: "https://maps.google.com/?cid=10009294002508390637&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
      sport: ["formula_one"],
      moodTags: ["luxury", "hospitality", "photo-op"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "luxury",
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
