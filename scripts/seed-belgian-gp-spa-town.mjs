import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync } from "fs";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const BELGIAN_ARDENNES_ID = "101b815a-ba64-4484-aad6-63721a44ed85";
const BELGIAN_GP_EVENT_ID = "b1816396-6d71-4693-a53f-05bccb2d8a8e";
const slug = "spa-town-thermal-city-belgian-gp-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const imageFilename = "Spa Town The Thermal City 13km from the Circuit.jpg";
const r2Key = `experiences/hero/${imageFilename}`;
const imageBuffer = readFileSync(`Images/${imageFilename}`);

await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: r2Key,
  Body: imageBuffer,
  ContentType: "image/jpeg",
}));

console.log("✓ Hero image uploaded to R2");

const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/experiences/hero/${encodeURIComponent(imageFilename)}`;

// ─── 2. Content ───────────────────────────────────────────────────────────────

const bodyContent = `Spa is 13km from Circuit de Spa-Francorchamps, a fact that surprises first-timers who assume the town and track are the same place. They share a name and nothing else. The circuit sits in a valley in Francorchamps village; the town of Spa is a 20-minute drive along the N62, a proper Belle Époque resort that made the word "spa" a common noun. Royalty came here. Peter the Great came here. The Casino de Spa, opened in 1763, claims to be the oldest continuously operating casino in the world. None of that has anything to do with the race, which is precisely the point. Thursday and Friday of race weekend, and race Sunday evening, are when Spa town makes the most sense.

The thermal baths — Les Thermes de Spa — sit on a hilltop above the town, accessible by funicular from the centre. The building is modern, opened in 2004, which means the facilities are what you would expect from a serious wellness centre rather than a restored Victorian curiosity. Eight hundred square metres of indoor and outdoor pools, saunas, hammam, infrared relaxation rooms. Entry for 3 hours is €35 on weekdays, €37 at weekends. The saunas open from 10:00. A full day pass is €48. Under-15s are not admitted, and booking is strongly advised — the baths get full on race weekend without warning. Phones and cameras are banned inside. That ban is, in practice, the main attraction.

The centre of town is walkable in an afternoon. Place Royale is the main square, surrounded by the Neoclassical architecture that went up when Spa was at the height of its European reputation. From there, Parc de Sept Heures is a 5-minute walk — an 18th-century promenade park laid out for guests who came to take the waters and wanted somewhere to walk at seven in the evening. The covered gallery along the park is 130 metres long and provides the only reliable shelter in Spa when the Ardennes decides to rain, which it does. Pouhon Pierre-le-Grand is a 5-minute walk from the park — an octagonal Neoclassical pavilion built in 1880 over the town's most famous mineral spring. Entry is €1. The spring still flows. You can drink the water; it tastes strongly of iron and will not appeal to everyone, but trying it once is the correct thing to do.

The Casino de Spa is the Redoute building on Place Royale. It opens at 11:00. Minimum age is 21. The games are roulette, Texas Hold'em, blackjack, and slots. On a Thursday evening during race week the casino draws F1 paddock and hospitality crowd, which makes it a specific kind of atmosphere — worth experiencing if you are curious, less so if you are there to gamble seriously.

Lac de Warfaaz is 2km northeast of the town centre, a 600-metre-long lake created in 1892. There is a paved path around it, cafes on the south shore, and pedalos available in summer. The walk from town and back takes about an hour at a relaxed pace. It is the best way to start a rest day morning before the baths.

Getting from Spa town to the circuit on race days: the 744 bus runs between Spa centre and Francorchamps village, journey time approximately 19 minutes, cost around €3. Taxis run €20–30 each way and are bookable in advance — do not rely on on-demand taxis on race Sunday. The City Shuttle does not serve Spa town; it operates between major cities and the circuit only.`;

const whyItsSpecial = `The Belgian GP is one of a very small number of race weekends where the town closest to the circuit has an independent reason to exist. Spa predates the race by several centuries. It was a European resort town before Formula 1 was a concept, and the infrastructure built for its 18th and 19th-century guests — the baths, the casino, the park, the promenades — is still in active use.

The practical argument for spending time in Spa town is straightforward: rest day Thursday and Friday afternoon give you several hours with no race sessions running, and the thermes on the hill offer the single best use of those hours. A 3-hour session in the thermal pools on Thursday evening, after the drive in, resets the body for a long weekend on grandstands and concrete concourses. The funicular, the hill view over the town, and the enforced no-phones rule make it more disconnected from race weekend than it has any right to be.

The cultural argument is harder to articulate but easier to feel. Spa is the reason the word "spa" exists in every language that uses it. Peter the Great bathed here. The Casino de Spa has been operating continuously since 1763. These are specific things with specific weight, and arriving for a race in the Belgian Ardennes and spending no time in the town that named the whole tradition feels like leaving the same way you arrived.

The 1km walk along the Parc de Sept Heures gallery on a wet Ardennes afternoon, with nothing racing on track, is not an experience that appears in any race guide. It should.`;

const insiderTips = [
  "Book the Thursday evening slot at Les Thermes de Spa (after 17:30 — weekday rate drops to €31) before you leave for the race weekend; the baths fill during GP week and unbooked visitors can be turned away at the door.",
  "Take the funicular up to the thermes from Spa town centre rather than walking — the hill is steep enough that arriving on foot in warm weather before a thermal session is counterproductive; walk down after instead.",
  "Try the Pouhon Pierre-le-Grand mineral spring water when you visit (€1 entry) — it tastes strongly of iron and is not to everyone's taste, but it is the specific water that made Spa famous and skipping it misses the point of the place.",
];

const whatToAvoid = `Don't try to visit Spa town on race Sunday — taxis out of Francorchamps after the podium are effectively unavailable on demand, and the bus frequency drops in the post-race window. Spa town is for Thursday, Friday, and possibly Saturday morning. Don't assume the Casino de Spa is a casual drop-in — minimum age is 21, photo ID is required, and the dress code is smart casual; arriving in race-branded casualwear on a busy Thursday may see you turned away.`;

const practicalInfo = {
  hours: "Les Thermes de Spa: Mon–Thu 09:00–21:00, Fri 09:00–22:00, Sat 09:00–21:00, Sun 09:00–20:00. Casino de Spa: from 11:00 daily. Pouhon Pierre-le-Grand: 09:00–17:00.",
  costRange: "Thermes: 3hr weekday €35, weekend €37, after 17:30 weekday €31, full day €48. Pouhon spring: €1. Casino: free entry (min age 21). Lac de Warfaaz: free.",
  bookingMethod: "Book Les Thermes de Spa in advance at thermesdespa.com — walk-in possible but the baths fill during race weekend and entry can be refused. Pouhon and the park are walk-in only.",
  howToBook: "Book Les Thermes de Spa online at thermesdespa.com for your preferred slot — Thursday evening (from 17:30, €31 weekday rate) is the optimal race weekend visit: quieter than daytime, cheaper rate, rest day afternoon stays free. The baths close annually June 7–12 but are open for the July race. The funicular up from town runs from Rue du Waux-Hall — check thermesdespa.com for current seasonal hours. For the Casino de Spa: bring photo ID (strictly 21+), dress smart casual. Thursday race week evening is the busiest and most atmospheric night. For taxis from the circuit to Spa town on Friday evening, book a local firm the day before — Taxis Gilles (+32 87 77 29 28) is one recommended option. Do not rely on on-demand taxis on race days.",
  website: "https://thermesdespa.com",
  reservationsRequired: true,
};

const gettingThere = `Spa town centre (Place Royale) is 13km from Circuit de Spa-Francorchamps via the N62. By bus: 744 line from Spa centre to Francorchamps village, approx. 19 min, ~€3. By taxi: €20–30 each way — book in advance for race days. By car: follow N62 toward Francorchamps; note the City Shuttle does not serve Spa town. Les Thermes de Spa: funicular from Spa town centre (Rue du Waux-Hall) up to the hilltop baths.`;

// ─── 3. Insert experience ─────────────────────────────────────────────────────

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Spa Town — The Thermal City 13km from the Circuit",
      subtitle: "The town that gave its name to the word \"spa\" — a rest day base with thermal baths, a 1763 casino, and a lake walk",
      slug,
      experienceType: "neighborhood",
      status: "in_review",
      destinationId: BELGIAN_ARDENNES_ID,
      sportingEventId: BELGIAN_GP_EVENT_ID,
      neighborhood: "Spa",
      address: "Place Royale, 4900 Spa, Belgium",
      heroImageUrl,
      heroImageAlt: "The octagonal Neoclassical Pouhon Pierre-le-Grand spring pavilion in Spa, Belgium",
      heroImageCredit: "Nenea hartia / Wikimedia Commons (CC BY-SA 4.0)",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      bookingLinks: [],
      editorialNote: "Thermes de Spa pricing and hours from thermesdespa.com (verified June 2026). Pouhon Pierre-le-Grand entry price from trip.com/Lonely Planet. Transport options (744 bus, taxi costs) from gpdestinations.com. Casino de Spa details from thecrazytourist.com. Lac de Warfaaz from thecrazytourist.com. Parc de Sept Heures from greatspatownsofeurope.eu. Hero image: Pouhon Pierre le Grand, CC BY-SA 4.0, Nenea hartia, Wikimedia Commons. Verified June 2026.",
      sport: ["formula_one"],
      moodTags: ["relaxation", "cultural", "adventure"],
      interestCategories: ["sport", "wellness", "culture"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "moderate",
      budgetCurrency: "EUR",
      budgetMinCost: "1",
      budgetMaxCost: "48",
      bestSeasons: ["jul"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-06-14",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: BELGIAN_GP_EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
  console.log("  Status:", result.status);
  console.log("  → Join row inserted into sporting_event_experiences");
  console.log("\n→ Ready to review at: http://localhost:3000/curator/review");
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
