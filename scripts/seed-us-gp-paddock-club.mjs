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
const slug = "us-gp-paddock-club-" + Date.now().toString(36);

const [existingEvent] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, EVENT_SLUG));

if (!existingEvent) {
  throw new Error(`Sporting event not found for slug ${EVENT_SLUG}`);
}
const eventId = existingEvent.id;

const bodyContent = `The Paddock Club is F1's own hospitality product, run identically at every round on the calendar, and Austin's version sits in a covered venue directly above the team garages on the Main Straight — looking straight down into pit lane and across at the starting grid. The specific tier here is the 300 Club, one rung of the Paddock Club structure, and it comes with the full Friday-through-Sunday hospitality package: all-inclusive curated local food menus, a premium open bar running spirits, champagne, beer, wine and soft drinks, large TVs with the live track feed, and access to the Paddock Club Lounge's activations, food stations, and its own F1 Store.

What actually separates this from a very good grandstand seat is the access layered on top of the food and view. Every day of the weekend includes the Aramco F1 Pit Lane Walk — a genuine chance to get close to a team's crew as they run pit-stop practice, not a roped-off distant look. One day of your package also includes a Guided Track Tour, riding the back of a flatbed truck around the full circuit with expert commentary, and a separate Photo Safari day taking you to exclusive circuit locations you can't reach as a general ticket holder. The track tour has a minimum height requirement of 110cm; the photo safari is 18-plus only, both worth knowing if you're planning this for a family group rather than just yourself.

Seating inside the venue is seat-back, allocated first-come, first-served rather than pre-assigned — arriving earlier in the day genuinely gets you a better spot, which is a small but real planning detail most hospitality products don't have. Multi-night hotel add-ons are available directly through the operator too, bundling a 4-night stay with daily transfers at either Austin Marriott Downtown or JW Marriott Austin.

This is F1's own product, run the same way at every Grand Prix — Austin's version carries the same weight as Monaco's or Silverstone's Paddock Club, just with COTA's specific view of the Main Straight and garages rather than a different circuit's layout.`;

const whyItsSpecial = `Most hospitality tiers sell atmosphere — a nice room, a good bar, a view. The Paddock Club sells proximity to the actual mechanics of the sport: pit crews running real stop drills close enough to watch their hands move, a truck lap of the full circuit with someone explaining what you're looking at, camera access to angles a general ticket can't reach. That's a meaningfully different product from paying more for a better seat. The genuine argument for the price isn't the champagne — it's that F1 doesn't let you get physically closer to a working Formula 1 team anywhere else on a standard ticket, at any circuit on the calendar. For a fan who already knows the sport and wants to see how a pit stop actually comes together rather than just watch cars pass by, this is the one product built specifically for that curiosity.`;

const insiderTips = [
  "Seating inside the venue is first-come, first-served rather than pre-assigned — arrive earlier in the day than you think you need to if a specific spot matters to you, since a later arrival genuinely means a worse seat within the same ticket.",
  "The Guided Track Tour and Photo Safari are each only included on one day of your 3-day package, not all three — plan which day you want each experience on in advance rather than assuming you can do both whenever you like.",
];

const whatToAvoid = `Don't bring young children expecting them to join every included activity — the Guided Track Tour requires a minimum height of 110cm, and the Photo Safari is 18-plus only, so at least one of the two headline activities will exclude anyone below those thresholds. Don't wait until race week to look for availability — both the 300 Club and Champions Club tiers were already sold out well ahead of the 2026 event; if you want Paddock Club access for a future Austin GP, this needs to be one of your very first bookings, not something arranged after flights and hotels are locked in.`;

const gettingThere = `COTA sits about 15 miles (24km) southeast of downtown Austin. Hotel-package transfers are available directly through F1 Experiences for guests who add the accommodation bundle, or use the standard race-weekend shuttle from Downtown's Waterloo Park or the Travis County Expo Center.`;

const practicalInfo = {
  hours: "Friday through Sunday of race weekend (23-25 October), hospitality access runs the full circuit-open hours each day",
  costRange: "Pricing not published by F1 Experiences as of this listing; the 2026 US GP 300 Club package is currently sold out — comparable Paddock Club tiers at other rounds have historically run into the low five figures per person for a 3-day package",
  bookingMethod: "Book through F1 Experiences, the official Paddock Club operator (f1experiences.com), or an authorized reseller. US contact line: +1.888.326.5430.",
  howToBook:
    "Both the 300 Club and the Champions Club sold out for the 2026 US GP well ahead of race weekend — this is F1's flagship American round, and its Paddock Club allocations move faster here than at most other stops on the calendar. If you're planning for a future edition, call F1 Experiences directly at +1.888.326.5430 rather than waiting for the public web listing to show availability — returning or repeat clients are typically offered early access to the next season's allocation before it opens to general sale, and by the time a tier shows \"sold out\" on the website, it's already gone from the standard channel entirely. If this year's sold out, ask specifically about waitlist releases or authorized-reseller inventory rather than assuming the door is closed.",
  website: "https://f1experiences.com/2026-united-states-grand-prix/paddock-club-3-days-300-club",
  reservationsRequired: true,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Paddock Club — Above the Garages, Inside the Action",
      subtitle: "F1's official hospitality tier, built directly over the pit lane at Austin's own Grand Prix",
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
        "Sources: f1experiences.com 300 Club Paddock Club page (fetched 5 Sep 2026 — confirmed sold-out status, full inclusions list, height/age requirements, US contact +1.888.326.5430), f1experiences.com Champions Club page (confirmed also sold out, used to establish the genuine lead-time pattern across both tiers). Concierge pick per pre-approval (Paddock Club named as a candidate before research began) — genuine VIP tier + real named operator/contact + genuine sell-out lead-time trap, all three criteria independently met. Public bookingMethod deliberately keeps only the website/general line; the tactical 'call ahead of public sale' detail lives only in howToBook per the no-duplicate-contact rule. No exact price published by F1 Experiences — flagged honestly rather than citing an unconfirmed figure. No Booking.com/GYG affiliate opportunity. Google Places rating reused from Circuit of the Americas' own venue listing. Verified 5 Sep 2026.",
      googleMapsRating: "4.6",
      googleMapsReviewCount: 17782,
      googleMapsUrl: "https://maps.google.com/?cid=10009294002508390637&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
      sport: ["formula_one"],
      moodTags: ["luxury", "hospitality", "exclusive"],
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
