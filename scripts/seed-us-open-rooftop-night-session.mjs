import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences, sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const NY_ID = "fb782de2-bbe6-410f-b466-2a4e628cda10";
const slug = "us-open-rooftop-night-session-" + Date.now().toString(36);

const [event] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, "us-open-2026"));

const usOpenEventId = event?.id ?? null;
console.log("✓ Sporting event ID:", usOpenEventId);

const bodyContent = `The US Open night session starts at 7pm. The gap between arriving in New York and walking through the Arthur Ashe gates is typically four to five hours, which is enough time to eat well in Manhattan before taking the 7 train to Flushing.

The Rooftop at Pier 17 in the Seaport District runs a dedicated "Dinner and a Match" package during the US Open fortnight — outdoor dining on the East River with the tournament showing on a 32-foot screen, followed by the option to head out to Queens for the live session. Packages start at $140 per person and include dinner; the format is designed around the night session schedule. The roof has unobstructed views south toward the Statue of Liberty and east toward the bridges.

The contrast between the two venues is part of the point. Pier 17 is calm, open, and quiet by New York standards — tables spread across a roof with a view, crowd that's there for dinner rather than tennis. Arthur Ashe at 8:30pm is 23,000 people in a closed bowl with the lights on, music between points, and the specific noise a New York crowd makes when a match turns. You go from one to the other in about 55 minutes door to door on the 7 from Hudson Yards.

For the dinner, Haven Rooftop at the Sanctuary Hotel (132 West 47th Street) is the official US Open cocktail partner — they run US Open specialty cocktails during the fortnight and show the day sessions on screens. More of a bar than a dinner venue, but good for a pre-match drink if you're coming from Midtown rather than the Seaport.

If you want a proper restaurant rather than a rooftop package, Le Bernardin is 15 minutes from Penn Station and takes reservations for 5pm seatings that clear by 6:30pm comfortably. It's a different calibre of food from what's available at the tournament and worth planning around if the Pier 17 format isn't right.

The 7 train from Hudson Yards (34th Street–Hudson Yards station) runs direct to Mets-Willets Point in 40 minutes. Night session gates open at 6pm; arriving at 7:15 for a 7pm first ball is realistic if the first match matters to you. The second match starts roughly 9:30pm and typically runs past midnight.`;

const whyItsSpecial = `The US Open night session is already worth going to on its own terms — the atmosphere in Arthur Ashe Stadium after dark is the loudest thing in tennis, and the 7pm start means you have a full evening in the city before you need to be in Queens.

What this itinerary does is use that gap properly. Most people either arrive too early and kill time at the grounds, or rush from wherever they are and arrive stressed. Dinner at Pier 17 solves the timing problem and adds something genuinely good to the evening rather than treating Manhattan as a waiting room.

The Pier 17 package is an official US Open partner product, which matters because the timing is calibrated around the night session schedule. They know when people need to leave for the 7 train. The dinner isn't an afterthought.`;

const insiderTips = [
  "Pier 17 'Dinner and a Match' packages book out 3 to 4 weeks ahead for peak week sessions — reserve as soon as you have night session tickets",
  "The 7 train from Hudson Yards (34th St) runs direct to Mets-Willets Point in 40 minutes — aim to leave the restaurant by 6:15pm for a comfortable arrival",
  "Night session gates open at 6pm; the second match starts around 9:30pm and can run past midnight — plan your return journey before you arrive",
];

const practicalInfo = {
  hours: "Pier 17 dinner from approx 4pm. US Open night session gates open 6pm, first match 7pm.",
  costRange: "Pier 17 Dinner and a Match packages from $140pp. Le Bernardin from $185pp (dinner only, tasting menu). Night session tickets separate: from $90 (upper deck) to $400+ (lower bowl), varies by round.",
  bookingMethod: "Pier 17: rooftopatpier17.com — search 'US Open' during the fortnight for the specific package. Le Bernardin: exploretock.com/lebernardin. Night session tickets: usopen.org",
  reservationsRequired: true,
  website: "https://rooftopatpier17.com",
  howToBook: "Book night session tickets first at usopen.org — they sell out months ahead, particularly for week two. Then book the dinner. Pier 17's Dinner and a Match package at rooftopatpier17.com lists specific dates during the Open fortnight; select your date and party size. For Le Bernardin, book via exploretock.com/lebernardin and request a 5pm seating explicitly — this gives comfortable time to finish and reach the 7 train.",
};

const gettingThere = `Pier 17 is at 89 South Street, Seaport District, Manhattan. From there, take the 7 train from Hudson Yards (34th Street–Hudson Yards, a 15-minute cab or the High Line walk from the Seaport). Direct to Mets-Willets Point, 40 minutes, 10-minute walk to the Arthur Ashe gates. Return: the 7 runs through midnight and beyond, though it gets crowded immediately after matches end — staying 10 minutes after the final point avoids the platform crush.`;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Rooftop Dinner Then the Night Session",
      subtitle: "Dinner on the East River at Pier 17, then the 7 train to Arthur Ashe — the right way to do a US Open evening",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: NY_ID,
      sportingEventId: usOpenEventId,
      neighborhood: "Seaport District / Flushing Meadows",
      address: "Pier 17, 89 South Street, New York, NY 10038",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      practicalInfo,
      gettingThere,
      editorialNote: "Pier 17 'Dinner and a Match' confirmed as official US Open partner product via rooftopatpier17.com — packages listed during Open fortnight from $140pp. Haven Rooftop at Sanctuary Hotel confirmed as official US Open cocktail partner. 7 train journey time confirmed at 40 minutes from 34th St–Hudson Yards. Le Bernardin pricing confirmed via exploretock.com.",
      moodTags: ["electric", "celebratory", "only-in-new-york"],
      interestCategories: ["sports", "food", "nightlife"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "splurge",
      budgetCurrency: "USD",
      budgetMinCost: "230",
      budgetMaxCost: "600",
      bestSeasons: ["aug", "sep"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      comfortLevel: 90,
      lastVerifiedDate: "2026-05-04",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title });

  console.log("\n✓ Experience created:", result.title);
  console.log("  Slug:", result.slug);
  console.log("\n→ http://localhost:3000/curator/review");
} catch (e) {
  console.error("Error:", e.message);
} finally {
  await client.end();
}
