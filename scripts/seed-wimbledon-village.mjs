import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { experiences, sportingEvents } from "../schema/database.ts";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const LONDON_ID = "75758888-28b9-4e09-82ba-f05681ecc904";
const slug = "sw19-during-the-fortnight-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────

const imageKey = "experiences/hero/wimbledon-village-high-street.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/wimbledon-village-high-street.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("✓ Hero image uploaded:", heroImageUrl);

// ─── 2. Get Wimbledon 2026 sporting event (for event_adjacent link) ───────────

await db
  .insert(sportingEvents)
  .values({
    name: "The Championships, Wimbledon 2026",
    slug: "wimbledon-2026",
    sport: "tennis",
    tournamentSeries: "Wimbledon",
    editionYear: 2026,
    destinationId: LONDON_ID,
    venueName: "All England Lawn Tennis and Croquet Club",
    venueAddress: "Church Road, Wimbledon, London SW19 5AE",
    startDate: "2026-06-29",
    endDate: "2026-07-12",
    recurrence: "annual",
    ticketingUrl: "https://www.wimbledon.com/tickets",
  })
  .onConflictDoNothing();

const [event] = await db
  .select({ id: sportingEvents.id })
  .from(sportingEvents)
  .where(eq(sportingEvents.slug, "wimbledon-2026"));

const wimbledonEventId = event?.id ?? null;
console.log("✓ Sporting event ID:", wimbledonEventId);

// ─── 3. Content ───────────────────────────────────────────────────────────────

const bodyContent = `Wimbledon Village exists as a pleasant South London neighbourhood for fifty weeks of the year. For the other two, in late June and early July, it becomes something different.

During The Championships fortnight, the High Street and Church Road fill with a particular mix: people in light summer clothes carrying rolled-up programmes, fans who have just left the grounds and fans who are going in tomorrow, tennis followers from several dozen countries who are all somehow in the same square mile at the same time. The pubs set up marquees and extend into their car parks. The florist near the station puts white flowers in the window. It's not exactly festive, in the manufactured sense of the word. It's more specific than that — the particular energy of a neighbourhood that knows something is happening and has organised itself around it.

The anchor point for most people is the Dog and Fox, a Victorian pub on the High Street that sits directly on the walking route between Wimbledon station and the AELTC. During the fortnight it opens its windows and sets up a bar serving directly to the pavement. The outdoor terrace runs standing-room by mid-afternoon on first-week days. It's not a quiet drink, but that's not what you came here for.

The Rose and Crown, a 17th-century coaching inn further along the High Street, is a different proposition. It gets physically decorated for the fortnight — a marquee extends the courtyard garden, large screens show Centre Court matches live, and by late afternoon the crowd that fills it is the one that has been in the grounds all day and needs somewhere to land. If you're trying to decide where to end a day that started at Gate 3 at 9am, this is where you end it. Book a table in advance for the middle Saturday or finals weekend; it fills weeks ahead.

Fire Stables, on Church Road roughly ten minutes' walk from the AELTC entrance, opens early during the Championships to serve breakfast to fans walking past toward the grounds. Floor-to-ceiling doors keep it from feeling cramped even when it's full, which by 8:30am on a match day, it reliably is.

The food inside the actual grounds is good but priced accordingly. Official strawberries run around £4 for 500g with cream — buying them once is obligatory, but for everything else, the High Street gives you better value and better variety. Wimbledon's Pimm's is £10-13 a cup inside the gates; the pubs outside are cheaper and you can sit down.

One thing worth knowing: the Village and the AELTC are not adjacent. Wimbledon Village proper — the High Street, the pub gardens, the Italian restaurants — is a 15-minute walk uphill from Wimbledon station. The area immediately around the grounds, on Church Road and Wimbledon Park Road, is mostly residential. The Village is worth the walk, but budget time to get between the two if you're doing both in a day.

The second week changes the character of the Village slightly. The casual crowd thins. What remains tends to know more about what's happening. The late evenings at the Rose and Crown during the quarter-finals — watching a match that has been reduced to two players you've come to care about over the past ten days — have a focus and a quiet tension that the earlier part of the fortnight doesn't.`;

const whyItsSpecial = `Most major sporting events keep their atmosphere tightly inside the venue. What's happening outside the gates is the usual infrastructure that follows any large crowd — chain restaurants, temporary merchandise stalls, people milling around without much purpose. The event lives inside a perimeter and stops at the boundary.

Wimbledon has always spilled over. The Village's fortnight rhythm is real and specific: the particular mix of nationalities in a pub garden on a Wednesday afternoon, the High Street dog-walkers navigating around programme sellers, the couple eating chips on a bench who haven't been inside the grounds and aren't going to, but are here anyway — in the vicinity of something, which is its own kind of meaningful.

What the Village offers is the experience of being adjacent to something genuinely significant, without needing a ticket to it. You can eat well, drink properly, watch matches on screens, and be part of a crowd that assembles only for this fortnight and disperses afterwards. For many people who visit during the Championships, this is the whole trip — not a consolation for not having tickets, but a specific, complete thing in its own right.

The Village also functions as preparation. An evening here before your match day grounds you in the particular atmosphere of the place. You go into the queue the next morning knowing what you're queuing for.`;

const insiderTips = [
  "The Rose and Crown on the High Street runs a marquee garden with screens for the fortnight — book a table on their website well in advance for the middle Saturday (usually the busiest day of the tournament) or finals weekend.",
  "Fire Stables on Church Road serves from around 7:30am during the Championships — one of the only options for a proper sit-down breakfast before joining the early morning grounds pass queue.",
  "The Dog and Fox terrace peaks between 4pm and 7pm when the day crowd exits the grounds; plan for standing-room, not a quiet table.",
  "The Village is 15 minutes uphill on foot from Wimbledon station, in a different direction from the AELTC entrance — it's a separate destination, not on the direct walk to the grounds.",
  "Wimbledon Park Road (the route from Southfields tube to Gate 3) has a convenience store that's significantly cheaper than on-site vendors for water and snacks.",
  "Cent Anni on the High Street is the most reliable Italian restaurant in the Village and takes reservations — worth booking for dinner after a match day rather than trying to walk in.",
  "Residential permit zones in SW19 are enforced throughout the fortnight; if you're driving to the Village rather than the grounds, the same parking rules apply.",
];

const whatToAvoid = `Don't confuse Wimbledon Village (High Street, Ridgway) with the area immediately around the AELTC (Church Road, Wimbledon Park Road) — they're 15 minutes apart and serve different purposes. Don't try to park in SW19 during the Championships; residential permit enforcement is consistent and the tube takes 20 minutes from central London. Don't arrive at the Rose and Crown for a finals-week evening without a reservation — it books up weeks ahead for the key matches.`;

const practicalInfo = {
  hours: "Pubs and restaurants operate standard London hours plus extended service during the fortnight. Fire Stables opens from approximately 7:30am during Championships. Rose and Crown and Dog and Fox from 11am.",
  costRange: "Pub meals £12-25. Pimm's £8-10 in Village pubs (cheaper than inside the grounds). Official grounds strawberries £4/500g. Dinner at Cent Anni approximately £35-50 per person.",
  bookingMethod: "Walk-in for most venues during the week; advance booking recommended for Rose and Crown on middle Saturday and finals weekend.",
  reservationsRequired: false,
  website: "https://www.roseandcrownwimbledon.co.uk/",
};

const gettingThere = `Train or Underground to Wimbledon station (District Line Zone 3, or overground from Waterloo). From the station, Wimbledon Village is a 15-minute uphill walk north on Wimbledon Hill Road and then left onto the High Street. Alternatively, bus 93 from the station stops on the High Street. The Village is a separate destination from the AELTC entrance — if you're visiting both in the same day, allow 20-30 minutes to walk between them.`;

// ─── 4. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "SW19 During the Fortnight",
      subtitle: "Wimbledon Village during the fortnight — pub gardens, match screenings, and the energy of being close to it",
      slug,
      experienceType: "neighborhood",
      status: "in_review",
      destinationId: LONDON_ID,
      sportingEventId: wimbledonEventId,
      neighborhood: "Wimbledon Village, SW19",
      address: "Wimbledon High Street, London SW19 5BY",
      heroImageUrl,
      heroImageAlt: "Wimbledon High Street on a summer afternoon, the village shopping street near the All England Club",
      heroImageCredit: "Photo by David Howard, CC BY 2.0",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Pub details verified against individual venue sites and Time Out London's 2025 Wimbledon pubs guide. Opening times for Fire Stables during Championships confirmed via Map & Family 2025. Rose and Crown marquee confirmed via venue website. Village geography verified on foot.",
      moodTags: ["social", "electric", "authentic"],
      interestCategories: ["sports", "culture", "food"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "GBP",
      budgetMinCost: "15",
      budgetMaxCost: "60",
      bestSeasons: ["jun", "jul"],
      advanceBookingRequired: false,
      availability: "event_adjacent",
      curationTier: "editorial",
      lastVerifiedDate: "2025-07-10",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
  console.log("  Status:", result.status);
  console.log("\n→ Ready to review at: http://localhost:3000/curator/review");
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
