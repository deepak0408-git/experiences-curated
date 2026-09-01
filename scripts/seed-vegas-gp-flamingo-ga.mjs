import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f0388505-a1ca-4929-b14d-f33ae8075409";
const EVENT_ID = "cd5785a7-d37c-4d4b-a545-a8b8e28eac57";
const slug = "las-vegas-gp-flamingo-ga-" + Date.now().toString(36);

const bodyContent = `Flamingo Zone, officially "General Admission: Flamingo by Caesars Rewards," is the single cheapest way to be inside the Las Vegas Grand Prix rather than watching it from a hotel balcony or a bar. A 3-day pass starts around $492, and single-day tickets run from $50 for Thursday practice up to roughly $393 for Saturday's race — a fraction of even the most affordable assigned grandstand seat on the circuit.

What you're actually buying is standing-room access to first-come, first-served viewing platforms overlooking the Koval straightaway toward Turn 5G, the same braking zone the Turn 3 Grandstand looks onto from the seated side. You get real racing in front of you: cars accelerating hard down Koval, then braking into a genuine passing zone. Beyond the racing, Flamingo Zone includes interactive fan activations and live entertainment, and food and drink are available to buy, though not included in the ticket price.

The trade-offs are real ones, not fine print to gloss over. There's no assigned seat and no seating at all — you stand, and you can't bring your own chair or stool. Viewing platforms fill up on a first-come, first-served basis, so arriving early on race day matters more here than at any grandstand. And a General Admission ticket locks you into that one zone for the day: you can't wander over to another part of the circuit or into a different zone on the same ticket. If following the whole race matters as much as the live corner action, know that the big screen sits on the main stage behind most viewing platforms, so you'll be turning around to check it rather than glancing at it while watching the track.`;

const whyItsSpecial = `Flamingo Zone is the entry point that makes the Las Vegas Grand Prix actually reachable for someone who isn't ready to spend four figures on a single seat. What sells it to me isn't just the price, it's that the view is genuinely good: Koval straightaway into Turn 5G is real racing, not a compromise corner tucked away from the action. Plenty of general admission zones at other circuits sell distance from the track; this one sells a real braking zone at a tenth of the grandstand price. For a first Vegas race weekend on a tight budget, this is the ticket that gets someone in the door without pretending the trade-offs — standing, one zone only, no reserved spot — don't exist.`;

const insiderTips = [
  "Arrive well before your session starts, especially for Saturday's race — viewing platforms are first-come, first-served, and the best sightlines toward Turn 5G's braking zone fill up fastest.",
  "A General Admission ticket only grants access to the Flamingo Zone itself for that day — if you want to see other parts of the circuit across the weekend, you'll need separate tickets for those zones, not one GA pass that lets you roam.",
];

const whatToAvoid = `Don't buy a Flamingo GA ticket assuming you can move between zones during the day — access is locked to Flamingo Zone only, and trying to enter another zone on the same ticket won't work. Don't plan to watch most of the race off the big screen either — it sits on the main stage behind the viewing platforms, so unlike a grandstand seat where the screen is often visible alongside the track, here you have to physically turn away from the racing to check it.`;

const practicalInfo = {
  hours: "Practice Thu 19 Nov, Qualifying Fri 20 Nov, Race Sat 21 Nov 2026 — all sessions run evening into night, Pacific time",
  costRange: "From US$50 single-day Thursday practice; from US$99 Friday qualifying; from US$393 Saturday race; from US$492 for a 3-day pass (2026 pricing)",
  bookingMethod: "Book via f1lasvegasgp.com or tickets.formula1.com under General Admission: Flamingo. This is the highest-demand budget option and single-day race tickets have sold out in past years — book well ahead of race weekend rather than waiting for a late deal.",
  howToBook: "",
  website: "https://www.f1lasvegasgp.com/tickets/general-admission/flamingo-ga/, https://www.tickets.gp/en/event/f1/f1lasvegas/general-admission-flamingo",
  reservationsRequired: true,
};

const gettingThere = "Flamingo Zone entrance, off Las Vegas Boulevard near Flamingo Road. Strip road closures begin early afternoon on race days — walk or use the monorail from a nearby Strip hotel rather than driving.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Flamingo Zone GA — the cheapest way into race weekend",
      subtitle: "Standing room over Koval's braking zone into Turn 5G, a fraction of any grandstand's price",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Flamingo Zone",
      address: "General Admission: Flamingo, Flamingo Zone, Las Vegas Strip Circuit, Las Vegas, NV",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from f1lasvegasgp.com official Flamingo GA page, 8newsnow.com 2026 pricing breakdown, and oversteer48.com General Admission guide (single-zone access, first-come platforms, screen placement). Verified 29 Aug 2026.",
      sport: ["formula_one"],
      moodTags: ["high-energy", "value"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 3,
      budgetTier: "budget",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-08-29",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓ Created:", result.title, "→", result.id, result.slug, result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
