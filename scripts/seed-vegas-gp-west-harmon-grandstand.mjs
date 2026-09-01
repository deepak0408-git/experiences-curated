import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "f0388505-a1ca-4929-b14d-f33ae8075409";
const EVENT_ID = "cd5785a7-d37c-4d4b-a545-a8b8e28eac57";
const slug = "las-vegas-gp-west-harmon-grandstand-" + Date.now().toString(36);

const bodyContent = `West Harmon Grandstand, officially sold as the Lewis Hamilton Grandstand Package, is the cheapest genuine assigned-seat grandstand on the circuit, and it earns that price with a real view rather than a compromise one. It sits at the very end of the lap, on the run into Turn 17 and along the pit lane entrance, which means you're watching cars at their highest top speed of the whole circuit, slipstreaming off each other before braking hard for the final corner. It's a single-grandstand zone, which sounds like a downside until you realize what it actually means on the ground: food, drink, and restroom lines here are consistently shorter than in the multi-stand East Harmon or Koval zones, because there's only one stand's worth of people to serve.

The trade-off is honest, not hidden: this is a top-speed and pit-entrance stand, not a braking-zone or overtaking stand. Several past race-goers have noted the sightlines to actual corners and passing moves are more limited here than at stands built around a specific braking zone. If watching a wheel-to-wheel battle into a corner is the priority, this isn't that seat. If watching an F1 car at genuine top speed, engine screaming, is what you came for, lower rows also give you a clean look at cars peeling into the pits, which most other grandstands don't offer at all.

West Harmon sits on the inside of the circuit, closer on foot to the Bellagio, Paris, and Planet Hollywood than almost any other grandstand — genuinely useful if your hotel is on that stretch of the Strip and you want the shortest possible walk to your seat on race night.

For 2026, the West Harmon Zone connects on foot to both the East Harmon and Koval zones, so a West Harmon ticket also opens up the Heineken Silver Stage's live entertainment and driver interviews without needing a separate pass.`;

const whyItsSpecial = `This is the stand I'd send a first-time F1 fan on a real budget to, without any hedging. It's the cheapest assigned seat on the whole circuit, but it isn't a lesser experience — it's a different one, built around the exact moment a Formula 1 car is going its fastest, right before it has to slam the brakes on for the final corner. That's a genuinely different thrill than watching a braking zone, and it's one most premium grandstands don't sell at any price. Add in the shortest food and bathroom lines of any zone on the circuit, plus a walk to the Bellagio-Paris stretch of the Strip that's shorter than from almost any other stand, and this earns its spot on value alone — not as a consolation prize for people who couldn't afford Main Grandstand.`;

const insiderTips = [
  "If your hotel sits anywhere between the Bellagio and Planet Hollywood, West Harmon is very likely your shortest walk to any grandstand on the circuit — worth checking before booking a seat elsewhere purely on reputation.",
  "Because West Harmon is a single-stand zone rather than a multi-stand complex, arrive at your usual pre-race time rather than building in the extra buffer other zones need for food and restroom queues — the lines here run noticeably faster.",
];

const whatToAvoid = `Don't book this stand expecting to watch a genuine overtaking battle unfold in front of you — sightlines to braking zones and corner action are more limited here than at stands purpose-built around a specific turn, and that's a real trade-off, not a myth. Don't assume the "Lewis Hamilton Grandstand" branding means anything about the on-track view itself — it's a marketing name tied to a merchandise bundle, not a signal that this particular stand has any special connection to a corner Hamilton is known for.`;

const practicalInfo = {
  hours: "Practice Thu 19 Nov, Qualifying Fri 20 Nov, Race Sat 21 Nov 2026 — all sessions run evening into night, Pacific time",
  costRange: "From US$102 single-day; Lewis Hamilton Grandstand Package (3-day, includes exclusive merchandise item) from US$1,012 (2026 pricing)",
  bookingMethod: "Book via f1lasvegasgp.com or tickets.formula1.com under West Harmon Grandstands. This is the entry-level grandstand tier and tends to have more late availability than East Harmon or Koval Zone stands, but don't wait past the final few weeks before race weekend.",
  howToBook: "",
  website: "https://www.f1lasvegasgp.com/tickets/grandstands/west-harmon-grandstands/, https://tickets.formula1.com/en/f1-59007-las-vegas/23398-grandstand-lewis-hamilton",
  reservationsRequired: true,
};

const gettingThere = "West Harmon Zone entrance, off Harmon Avenue near the pit lane entry. This is the closest grandstand zone to the Bellagio/Paris/Planet Hollywood stretch of the Strip — walking is the fastest way in on race days once road closures begin.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "West Harmon Grandstand — the real budget assigned seat",
      subtitle: "Top speed into the final corner, the cheapest genuine grandstand ticket on the circuit",
      slug,
      experienceType: "sports_venue",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "West Harmon Zone",
      address: "West Harmon Grandstand, West Harmon Zone, Las Vegas Strip Circuit, Las Vegas, NV",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from f1lasvegasgp.com official West Harmon Grandstands page, fanamp.com seating guide (top-speed/pit-entrance view, shorter lines, proximity to Bellagio/Paris), and gpfans.com 2026 pricing. Verified 29 Aug 2026.",
      sport: ["formula_one"],
      moodTags: ["high-energy", "value"],
      interestCategories: ["sport"],
      pace: "active",
      physicalIntensity: 2,
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
