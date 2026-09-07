import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "883ac422-5318-460f-819a-6ae784ac4b8c";
const EVENT_ID = "538fdb6f-0e39-49a6-ba77-32dec65d640a";
const slug = "mexico-city-frida-kahlo-museum-" + Date.now().toString(36);

const bodyContent = `The Frida Kahlo Museum, universally known as Casa Azul for the cobalt-blue walls of the house itself, is the building Frida Kahlo was born in, lived in for most of her life, and died in — not a recreation or a relocated collection, but the actual rooms, furniture, and studio space where the work happened. That authenticity is the whole draw, and it's part of why demand for entry consistently outstrips the museum's capacity.

There are no in-person ticket sales at all. Every ticket is bought online through the museum's own official site, sold in timed 15-minute entry slots running from 10am to 5pm, and popular slots — especially morning ones — sell out routinely. For a comfortable, non-stressful visit, buying two to four weeks ahead is the standard advice; during Mexico City's genuinely peak seasons, tickets have been known to sell out two to three months in advance. Given that 2026 race weekend collides directly with Día de Muertos, one of the city's single biggest tourism draws of the year, treat this trip's Frida Kahlo Museum visit with that same peak-season urgency rather than the more relaxed few-days-ahead timeline that might work in a quieter month.

Once you do have a ticket, the museum enforces its timing strictly: your actual confirmation, sent by WhatsApp and email, typically arrives the evening before your visit, and on the day itself there's a maximum 15-minute grace period after your slot's start time — arrive later than that and the ticket is void, with no refund. This isn't a museum where "we'll figure it out at the door" is a viable backup plan.

Inside, the collection includes Kahlo's personal effects, several of her paintings, and her preserved studio, alongside a walled garden that was as much a part of her daily life and work as the interior rooms. The house sits in Coyoacán, a genuinely different-feeling neighborhood from central Mexico City — cobblestone streets, a slower pace, and its own worthwhile plaza and market square if you want to build a half-day around the visit rather than treating it as a single stop.`;

const whyItsSpecial = `Plenty of "house museums" dedicated to a single artist end up feeling like a shrine assembled after the fact — objects gathered and arranged to represent a life rather than genuinely lived-in space. Casa Azul doesn't have that problem, because it never stopped being the actual house. The blue walls, the studio, the garden — none of it was recreated or relocated for the museum's benefit; it's simply been preserved as the place Kahlo's actual life happened, from birth to death. That distinction between "museum about someone" and "someone's real home, kept as it was" is rare, and it's the reason this specific stop justifies real advance planning rather than being treated as an easy walk-up addition to a Coyoacán afternoon.`;

const insiderTips = [
  "Morning slots (starting at 10am) sell out fastest — if you have flexibility, an afternoon slot is genuinely easier to secure with less advance notice, even during a busy travel window.",
  "Your entry confirmation typically doesn't arrive until the evening before your visit, sent via WhatsApp and email — don't panic if you've bought a ticket weeks ahead and haven't received the actual entry pass yet; that's the museum's normal process, not a sign something went wrong.",
];

const whatToAvoid = `Don't assume your regular admission ticket lets you photograph the interior — the museum sells photography as a separate add-on with its own small fee, purchasable online alongside your entry ticket or at the door, and taking photos inside without it (beyond the more relaxed courtyard/garden areas) risks a staff member asking you to stop. And don't take one of the pink-and-white taxis idling right outside the entrance — visitors have reported near-scam pricing from drivers specifically stationed there for tourists leaving the museum; walk a block or two and hail one independently, or use a rideshare app instead.`;

const practicalInfo = {
  hours: "Timed entry slots run 10am-5pm — check the official site for which days the museum is open, as most house museums in the area close one day a week",
  costRange: "Moderate entry fee, higher for foreign visitors than for Mexican nationals/residents — check current pricing on the official site, as it varies by ticket type",
  bookingMethod: "Tickets must be purchased online in advance via the museum's official ticketing site — no in-person sales exist. Given this trip's Día de Muertos overlap, buy as early as possible, ideally the 2-4 week standard window or earlier.",
  howToBook: "Book directly at boletos.museofridakahlo.org.mx as early as you can — given that your race weekend lands on Día de Muertos, one of the city's biggest tourism weeks, treat this like peak-season booking (aim for a month or more ahead, not the usual 2-4 week window) rather than risk finding every slot gone. If morning slots are already sold out by the time you look, afternoon slots consistently have better last-minute availability, so don't give up on the whole visit if 10am and 11am are gone. Once booked, watch for your actual entry confirmation via WhatsApp and email the evening before your visit — it won't arrive earlier than that, which is normal, not a sign of a problem with your order.",
  website: "https://boletos.museofridakahlo.org.mx/en, https://www.museofridakahlo.org.mx",
};

const gettingThere = "Coyoacán is a distinct neighborhood south of the historic center — reachable via Metro to Coyoacán or Viveros stations, followed by a taxi, rideshare, or roughly 15-20 minute walk to the museum itself.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Frida Kahlo Museum (Casa Azul), Coyoacán",
      subtitle: "The real house she lived and died in — book weeks ahead, arrive within 15 minutes or lose it",
      slug,
      experienceType: "cultural_site",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Coyoacán",
      address: "Londres 247, Del Carmen, Coyoacán, 04100 Ciudad de México",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Booking mechanics (2-4 week standard window, 2-3 months for peak season, 15-minute entry tolerance, WhatsApp/email confirmation timing) sourced from StoriesBySoumya.com and TwoTravel's Frida Kahlo Museum ticket guides, and the official boletos.museofridakahlo.org.mx site description, Sep 2026. Google rating via Places API lookup same session: 4.5/45,085 reviews. What to Avoid rebuilt 6 Sep 2026 after both original avoids were found to restate bodyContent verbatim — replaced with 2 genuinely new avoids: the separate paid photography add-on (sourced from TwoTravel's ticket guide, 6 Sep 2026, not otherwise mentioned in this experience) and the pink-and-white taxi overcharging risk right outside the entrance (sourced from real Tripadvisor visitor reports, 6 Sep 2026).",
      sport: ["formula_one"],
      moodTags: ["cultural", "must-book", "iconic"],
      interestCategories: ["culture", "art"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "MXN",
      bestSeasons: ["oct", "nov"],
      advanceBookingRequired: true,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-06",
      googleMapsRating: "4.5",
      googleMapsReviewCount: 45085,
      googleMapsUrl: "https://maps.google.com/?cid=7062107075614930081&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #17 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
