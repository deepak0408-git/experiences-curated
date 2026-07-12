import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0d01105a-1e01-40a7-91af-89299939389b";
const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86";
const slug = "where-to-sit-hungaroring-" + Date.now().toString(36);

const bodyContent = `Three grandstands come up again and again when people plan a Hungaroring weekend, and each answers a different question about what you actually want to watch.

T1, formerly known as Gold 4, sits on the tight right-hander at the end of the pit straight, the corner where Nelson Piquet passed Ayrton Senna around the outside, sideways, on lap 68 of the very first Hungarian Grand Prix in 1986. It's still the one corner on this circuit where overtaking reliably happens, and the grandstand gives you a close, repeated view of the same braking zone lap after lap. The tradeoff: because of the slope through this section, your sightline up the main straight is restricted, so you get the moment of the pass, not the buildup to it.

The Apex Grandstand, at Turn 14, covers the opposite end of the same story. This is the long, drawn-out final corner that decides whether a car carries enough exit speed to threaten for a pass at Turn 1 on the next lap. Watching from here means watching cause and effect: the line you see through Apex is the overtake (or non-overtake) you'll see moments later, just out of view. Ask specifically for Apex 1 over Apex 2 if you want to keep cars in view as they exit onto the straight, Apex 2 loses the sightline right at the corner exit.

The Hungaroring Grandstand answers a completely different question: comfort. It's the only fully covered seating at the circuit, positioned on the main straight opposite the pit garages, rebuilt ahead of the 2025 race. You lose the close-corner drama of T1 or Apex in exchange for pit lane activity, the start-finish line, and a roof, which matters more here than it sounds. Hungaroring race weekend regularly pushes past 30°C in late July, and Hungary's afternoon storms don't always announce themselves.

None of these three is objectively the best seat. T1 rewards people who want to watch skill and risk up close. Apex rewards people who think in terms of tactics and sequences. Hungaroring Grandstand rewards people who'd rather not choose between comfort and a decent view. Pick based on what kind of race you want to watch, not on which grandstand sounds most famous.`;

const whyItsSpecial = `Most circuit guides list grandstands as if the only variable that matters is proximity to something dramatic. The more honest way to choose is by asking what kind of attention you want to pay for three days: close and repetitive (T1), tactical and anticipatory (Apex), or comfortable and wide-angle (Hungaroring Grandstand). None of these are wrong choices. They're different bets on what makes a race weekend memorable, and the Hungaroring's specific layout, one real overtaking corner, one corner that sets it up, one covered stand opposite the pit garages, happens to make all three genuinely distinct rather than just marginally different views of the same thing.`;

const insiderTips = [
  "If you can only book one grandstand, T1 gives the highest chance of seeing an actual overtake, it's the circuit's one reliable passing zone.",
  "Weather-check your dates before booking an uncovered stand. If any forecast shows rain risk during your visit, the Hungaroring Grandstand is worth the premium purely for the roof.",
];

const whatToAvoid = `Don't book Apex 2 over Apex 1 without checking the seat plan first, Apex 2 sits further back and loses the cars from view right at the corner exit, the opposite of what most people want from a final-corner stand. And don't assume any of these three has to be your seat for the whole weekend, some visitors book different stands for different sessions to see more than one version of the circuit.`;

const practicalInfo = {
  hours: "Gates typically open around 8am on race day; grandstand seating is allocated and holds for the full session",
  costRange: "T1 and Apex are mid-tier grandstand pricing; the Hungaroring Grandstand (covered, premium tier) costs more, with its Platinum upper section priced highest. See the Ticket Guide experience for the full price comparison across all tiers including GA and hospitality.",
  bookingMethod: "Book via tickets.formula1.com/en/f1-3277-hungary or f1hungary.com/en/tickets. Check the current seat plan before choosing, especially for Apex 1 vs Apex 2, and note that grandstand numbering can shift slightly year to year.",
  website: "https://tickets.formula1.com/en/f1-3277-hungary",
  reservationsRequired: true,
};

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Where to Sit — T1, Apex, or the Covered Grandstand",
      subtitle: "Three grandstands, three different bets on what makes a Hungaroring weekend worth watching.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Hungaroring, Mogyoród",
      address: "Hungaroring, 2146 Mogyoród, Hungary",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere: "Free F1 shuttle buses run from Kerepes HÉV station (reached via M2 metro to Örs vezér tere, then HÉV suburban rail) directly to Gate 3, timed to match train arrivals.",
      editorialNote: "Merged from three separate experiences (T1 Grandstand, Apex Grandstand, Hungaroring Grandstand) on 11 Jul 2026 after user flagged image-sourcing struggles and overlap with the new Ticket Guide experience — collapsed into one comparison piece rather than three thin standalone cards. Sources: en.wikipedia.org/wiki/1986_Hungarian_Grand_Prix, f1hungary.com/en/ticket-info/grandstand-t1-2, oversteer48.com/hungaroring-apex-1-grandstand, oversteer48.com/hungaroring-grandstand. Verified 11 Jul 2026.",
      sport: ["formula_one"],
      moodTags: ["practical", "comparative", "planning"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "EUR",
      bestSeasons: ["jul"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-07-11",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
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
