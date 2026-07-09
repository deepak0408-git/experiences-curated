import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

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

const DESTINATION_ID = "0b0d8f9a-911d-4cc7-8049-50e4685958ca"; // Milan
const EVENT_ID = "b93770c0-3d96-4e81-b3d0-c1e3a788fd8e"; // Italian GP 2026
const slug = "eating-in-milan-serious-italians-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────
const imageKey = "experiences/hero/eating-in-milan-serious-italians.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/Eating in Milan Where Serious Italians Go.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("✓ Hero image uploaded:", heroImageUrl);

// ─── 2. Content ───────────────────────────────────────────────────────────────
const bodyContent = `Milan's food scene splits cleanly into two registers, and both are worth knowing about for race weekend. One is the trattoria that hasn't changed its menu philosophy in a century. The other is a chef who's rebuilt Italian fine dining inside a nineteenth-century shopping arcade.

Trattoria Masuelli San Marco has been run by the same family since 1921 and is now in its fourth generation. It sits on Viale Umbria in Porta Romana, a few tram stops from the centre, and the room still has the chandeliers and framed memorabilia you'd expect from somewhere that's been feeding the same neighbourhood for a hundred years. The dish to order is risotto allo zafferano with ossobuco, saffron risotto under a braised veal shank with the marrow still in the bone, plus the classics: cotoletta alla milanese, vitello tonnato, polpette. Expect to spend €46-65 a head. It's closed Sunday and Monday, and Tuesday is dinner only, so plan around that if you're trying to fit it into a race weekend.

Cracco in Galleria sits at the opposite end of the spectrum. Carlo Cracco's restaurant occupies four floors inside the Galleria Vittorio Emanuele II, Milan's grand nineteenth-century arcade next to the Duomo, and holds a Michelin star. Tasting menus have run around €200 per person in past seasons, and the dining room itself, glass roof, marble floors, the arcade's foot traffic passing just outside, is as much the draw as the food. There's also a ground-floor café attached that's open all day and doesn't take bookings, which is a genuinely useful fallback if the restaurant proper is full or you just want a coffee and don't need the full tasting menu experience.

Both are close enough to central Milan hotels to fit into an evening around race weekend without a long trip back. Masuelli works well after a long day at the circuit when you want something that feels like a home-cooked meal scaled up for a dining room. Cracco works better as the one big meal of the trip, the kind you book ahead for rather than walk into.`;

const whyItsSpecial = `Anyone can find a decent restaurant in Milan on the day. What's harder to find without knowing where to look is the difference between "good food" and "food that tells you something about how Milanese people actually eat." Masuelli is the second kind: a fourth-generation family running the same trattoria their grandparents opened, serving the dishes their grandparents served, largely unbothered by trends.

Cracco is a different kind of honest. It's not the same idea preserved. It's a chef who took Milanese fine dining and rebuilt it inside one of the most recognisable buildings in the city, and it's confident enough in that idea to charge accordingly. Putting these two next to each other in one experience isn't about picking a winner. It's about giving a visitor the actual range of what "eating well in Milan" means, rather than just one version of it.`;

const practicalInfo = {
  hours: "Masuelli: closed Sunday and Monday, Tuesday dinner only (19:30–22:30), Wednesday–Saturday lunch and dinner. Cracco: Tuesday–Friday 12:30–15:00 and 19:30–22:00, Monday and Saturday dinner only, closed Sunday.",
  costRange: "Masuelli roughly €46–65 per person; Cracco tasting menus have run around €200 per person in recent seasons (confirm current pricing directly, as fine dining prices shift seasonally).",
  bookingMethod: "Masuelli takes reservations by phone or email; Cracco books through its own online system and typically needs advance notice, especially for race weekend when the city fills up.",
  howToBook: "For Cracco, book well ahead of race weekend specifically, Michelin-starred tables in Milan get squeezed by both F1 and any overlapping fashion or design week traffic, and confirm directly by phone (+39 02 876774) or prenotazioni@ristorantecracco.it if the online system shows no availability, since some tables are held back for direct enquiries. For Masuelli, phone or email (prenotazioni@masuellitrattoria.it) a few days out is normally enough outside of a major event weekend, but during race weekend treat it like any other in-demand table and book earlier than you would normally. If a client wants the Cracco experience without the full tasting-menu commitment or the advance booking, point them to the attached ground-floor café, same building, no reservation needed, open all day.",
  website: "https://www.ristorantecracco.it/en/",
  reservationsRequired: true,
};

const gettingThere = "Masuelli is a short walk from Lodi T.I.B.B. or Porta Romana metro stops; Cracco sits directly inside the Galleria Vittorio Emanuele II, adjoining Piazza del Duomo, reachable via Duomo metro (M1/M3).";

// ─── 3. Insert experience ─────────────────────────────────────────────────────
try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Eating in Milan — Where Serious Italians Go",
      subtitle: "A fourth-generation trattoria and a Michelin star, ten minutes apart by taxi.",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Porta Romana / Duomo",
      address: "Trattoria Masuelli San Marco, Viale Umbria 80, 20135 Milano MI; Cracco in Galleria, Galleria Vittorio Emanuele II, 20121 Milano MI",
      heroImageUrl,
      heroImageAlt: "Shoppers inside the Galleria Vittorio Emanuele II in Milan, Italy",
      heroImageCredit: "Haim Charbit, Pexels Licence",
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "Masuelli is closed Sunday and Monday, and Tuesday is dinner-only — check this before building it into a race-weekend itinerary that might include a Monday or early-week visit.",
        "Cracco's ground-floor café, in the same Galleria building, is open all day and doesn't take bookings — a solid fallback if the main restaurant is booked out for race weekend.",
      ],
      whatToAvoid: "Don't try to walk into Cracco without a reservation expecting a table, especially during race weekend — book well ahead, and call directly if the online system shows nothing available. And don't assume Masuelli's hours match a typical trattoria — the Tuesday dinner-only quirk and Sunday/Monday closure catch people out if they're planning around a specific day.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: masuellitrattoria.com official site, ristorantecracco.it official site, guide.michelin.com Cracco in Galleria listing, eatoutmilan.com Masuelli hours. Source conflict noted: one source claimed Masuelli open Sunday lunch, another (more specific, eatoutmilan.com) confirmed closed Sun/Mon with Tuesday dinner-only — went with the more specific source, worth a confirming call before publish. GTG: N/A (dining, not ticketed). Booking.com: N/A (not accommodation). Hero image: Haim Charbit, Pexels Licence. Verified 8 Jul 2026.",
      sport: ["formula_one"],
      moodTags: ["authentic", "romantic", "indulgent"],
      interestCategories: ["food"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "splurge",
      budgetCurrency: "EUR",
      bestSeasons: ["sep"],
      advanceBookingRequired: true,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-07-08",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
  console.log("  Status:", result.status);
  console.log("\n→ Review at:    http://localhost:3000/curator/review");
  console.log("→ Experience:   http://localhost:3000/experience/" + result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
