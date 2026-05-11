import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences, sportingEvents } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const LONDON_ID = "75758888-28b9-4e09-82ba-f05681ecc904";
const slug = "wimbledon-museum-private-tour-" + Date.now().toString(36);

const [event] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, "wimbledon-2026"));

const wimbledonEventId = event?.id ?? null;
console.log("✓ Sporting event ID:", wimbledonEventId);

const bodyContent = `The Wimbledon Lawn Tennis Museum runs a 90-minute guided tour of the All England Club on non-match days. You get Centre Court, the royal box, the gentlemen's dressing room, the trophy room, and the Millennium Building that players use during the Championships. None of it is accessible on a match day without debenture seats.

Standard tours run daily outside the Championships (April to September, 10am to 5:30pm) and cost £32 for adults, led by a Blue Badge Guide in a group of up to 20. Private tours are available with a dedicated guide and completely flexible pacing.

That pacing is what makes the private version worth it. A standard group moves at a speed that accommodates 20 strangers with different levels of interest. Private means you spend as long as you want in the dressing room, or skip the museum sections entirely and go straight to Centre Court.

Centre Court empty is a different place from the one on television. Quieter, obviously. But the scale surprises people who've only seen it through a camera — you're much closer to the baseline from the royal box than any broadcast angle suggests. The chair umpire's seat, unmanned and covered in the off-season, is oddly compelling to stand next to.

The trophy room has both the singles trophies. They're smaller than most people expect.

The museum itself covers 130 years of the tournament and includes the CentreCourt 360 display, the Championship Trophies exhibition, and the press interview room. The Millennium Building — the glass-fronted structure that appears in every player arrival shot — is included in the tour and is otherwise closed to the public.

The Championships run 29 June to 12 July 2026. Tours of Centre Court are not available during the fortnight. The last available date before the grounds go into tournament preparation is typically mid-June; tours resume in late July.`;

const whyItsSpecial = `The practical reason to do this is Centre Court access without a match ticket. The stands hold 14,979 people on a match day and are otherwise closed. A museum tour is the only way in.

The more honest reason is that the All England Club in the off-season has a different quality to it. Every surface that gets covered in television graphics and sponsor boards is just grass and chalk lines. The royal box is just a row of chairs with better cushions. The players' entrance is a narrow tunnel that smells slightly of grass and whatever they used to clean it. These are not romantic details. They're just details that you don't otherwise get to notice.

Private tours cost more and require more planning than the standard version. The standard version is genuinely good. But if you're spending a significant amount on the trip overall, this is worth adding as the day before or after your match day ticket.`;

const insiderTips = [
  "Book private tours directly via museum@aeltc.com — 4 to 6 weeks lead time is realistic in peak season (May to September)",
  "The last available pre-tournament tour date is typically mid-June; book before April if you want a date close to the Championships",
  "Standard tours cost £32 and are available without advance planning outside peak dates — good option if private tours are full",
];

const practicalInfo = {
  hours: "April to September: 10am to 5:30pm (last admission 4:30pm). October to March: 10am to 5pm (last admission 4pm). Closed during the Championships (late June to mid-July).",
  costRange: "Standard tour: £32 adult, £22 child. Private group tours: price on application.",
  bookingMethod: "Standard tours: bookings.wimbledon.com. Private tours: museum@aeltc.com",
  reservationsRequired: true,
  website: "https://www.wimbledon.com/en_GB/museum_and_tours/index.html",
  howToBook: "Email museum@aeltc.com with your preferred date, group size (up to 20), and whether you want a standard or private guide. Mention you're visiting around the Championships if relevant — they'll advise on the last available pre-tournament date. Standard tours can be booked online at bookings.wimbledon.com with no minimum group size.",
};

const gettingThere = `Gate 4 on Church Road, Wimbledon, SW19 5AE. District line to Southfields (Zone 3), 12-minute walk east on Wimbledon Park Road. Alternatively, SWR from Waterloo to Wimbledon, then bus 493 directly to the AELTC. The museum entrance is separate from the main Championships gates and has its own signage on Church Road.`;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Wimbledon Museum & Private Tour",
      subtitle: "Behind the gates on a non-match day — Centre Court, the royal box, and the trophy room with a guide to yourself",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: LONDON_ID,
      sportingEventId: wimbledonEventId,
      neighborhood: "SW19, Wimbledon",
      address: "All England Lawn Tennis Club, Church Road, Wimbledon, London SW19 5AE",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      practicalInfo,
      gettingThere,
      editorialNote: "Based on official Wimbledon Museum booking page (bookings.wimbledon.com), Viator listing confirming 90-minute Blue Badge guided tour at £32, and AELTC museum contact. Private tour pricing on application — confirmed via museum@aeltc.com contact path.",
      moodTags: ["exclusive", "behind-the-scenes", "historic"],
      interestCategories: ["sports", "culture"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "splurge",
      budgetCurrency: "GBP",
      budgetMinCost: "32",
      budgetMaxCost: "200",
      bestSeasons: ["apr", "may", "jun", "jul", "aug", "sep"],
      advanceBookingRequired: true,
      availability: "event_adjacent",
      curationTier: "editorial",
      comfortLevel: 80,
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
