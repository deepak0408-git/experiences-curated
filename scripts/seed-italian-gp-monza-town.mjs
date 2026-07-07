import { config } from "dotenv";
config({ path: ".env.local" });

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";
import https from "https";
import fs from "fs";

const DESTINATION_ID = "0b0d8f9a-911d-4cc7-8049-50e4685958ca"; // Milan
const EVENT_ID = "b93770c0-3d96-4e81-b3d0-c1e3a788fd8e"; // Italian GP 2026
const slug = "monza-town-royal-villa-" + Date.now().toString(36);

const IMAGE_URL = "https://upload.wikimedia.org/wikipedia/commons/8/85/Monza_Piazza_Duomo.jpg";
const LOCAL_PATH = "Images/Monza Town Royal Villa.jpg";
const R2_KEY = "experiences/hero/monza-town-royal-villa.jpg";

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

// ─── 1. Download & upload hero image ─────────────────────────────────────────
console.log("Downloading image...");
await new Promise((resolve, reject) => {
  const file = fs.createWriteStream(LOCAL_PATH);
  https.get(IMAGE_URL, { headers: { "User-Agent": "ExperiencesCurated/1.0 (admin@experiences-curated.com)" } }, (res) => {
    if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
    res.pipe(file);
    file.on("finish", () => { file.close(); resolve(); });
  }).on("error", reject);
});
console.log("✓ Downloaded to", LOCAL_PATH);

const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${R2_KEY}`;
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: R2_KEY,
  Body: fs.readFileSync(LOCAL_PATH),
  ContentType: "image/jpeg",
}));
console.log("✓ Uploaded to R2:", heroImageUrl);

// ─── 2. Content ───────────────────────────────────────────────────────────────
const bodyContent = `Monza's historic centre is ten minutes from the circuit by taxi and feels like a different world. The GP crowd stays inside Parco di Monza. That's their loss.

Start in Piazza Roma. The Arengario — Monza's medieval town hall, black-and-white striped marble — anchors the square. From there it's a short walk to the Duomo di San Giovanni Battista, the cathedral Queen Theodelinda founded in the 6th century. The facade is the same striped Lombard Romanesque as the Arengario. Inside: the Cappella di Teodolinda, lined with 15th-century frescoes, and the Iron Crown of Lombardy. This is the object that Charlemagne, Frederick Barbarossa, Charles V, and Napoleon each placed on their heads to claim dominion over Italy. It's kept in a glass case above the altar. The guided tour to see it up close costs €8 and lasts about 30 minutes — book by phone (+39 039 326383) as walk-up availability is limited.

The Museo e Tesoro del Duomo next door (entrance on Via Lambro) holds fourteen centuries of Lombard religious art connected to the Basilica. Combined ticket with the chapel and crown is €14. Open Tuesday–Sunday 09:00–18:00, closed Monday.

Villa Reale di Monza sits just north, directly opposite Hotel de la Ville. The Habsburgs commissioned it in 1777 from architect Giuseppe Piermarini — the same architect who designed La Scala in Milan. The state rooms on the first noble floor still have their original neoclassical decorations. Tours run Wednesday–Friday 10:00–16:00, Saturday–Sunday 10:30–18:30. Full ticket €15, reduced €12. Book via villarealemonza.org or call 039 5787160.

The Giardini Reali behind the villa — English landscape gardens with ponds, grottos, and a small temple — are free to enter and worth the walk through even if you skip the palace interior.`;

const whyItsSpecial = `Most Italian GP visitors experience Monza as a circuit in a park. They arrive, watch cars, leave. The town itself — ten minutes away, genuinely historic, with one of the most significant medieval relics in Europe — goes unvisited.

The Iron Crown is not a minor attraction. This is the object Napoleon had reforged and placed on his own head in 1805, proclaiming himself King of Italy. Charlemagne wore it in 774. It contains what Lombard tradition holds to be a nail from the Crucifixion. You can see it in a small chapel, on a guided tour, for €8. The fact that most race weekend visitors don't bother is baffling. Monza the town has far more to offer than Monza the chicane.`;

const practicalInfo = {
  hours: "Duomo Museum: Tue–Sun 09:00–18:00, closed Mon. Villa Reale: Wed–Fri 10:00–16:00, Sat–Sun 10:30–18:30.",
  costRange: "Iron Crown guided tour €8; Museum + Chapel + Crown €14. Villa Reale €15 full / €12 reduced. Giardini Reali free.",
  bookingMethod: "Iron Crown chapel tour: book by phone (+39 039 326383). Villa Reale tickets: villarealemonza.org or 039 5787160.",
  howToBook: "The Iron Crown chapel tour has limited capacity per slot — call +39 039 326383 as soon as you have your race weekend dates. Tuesday or Wednesday before the race are the quietest times; Saturday during qualifying is the worst (town fills with GP overflow). For Villa Reale, book the first slot of the day (10:00 Wed–Fri or 10:30 weekends) to finish before the afternoon heat and circuit sessions. The Museum + Chapel + Crown combined ticket at €14 is the right choice if you only have one visit — covers everything in a single 90-minute circuit.",
  website: "https://turismo.monza.it/en/places/reggia-di-monza-24639",
  reservationsRequired: true,
};

const gettingThere = "10–15 minutes by taxi from the circuit gates, or a 20-minute walk from Biassono-Lesmo Parco station. The historic centre is compact and walkable — Piazza Roma, the Duomo, and Villa Reale are all within 10 minutes on foot of each other.";

// ─── 3. Insert experience ─────────────────────────────────────────────────────
try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Monza Town & the Royal Villa",
      subtitle: "The Iron Crown, a neoclassical palace, a medieval centre 2km from the circuit. Most GP visitors never leave the park.",
      slug,
      experienceType: "neighborhood",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Monza Centro",
      address: "Piazza Roma, 20900 Monza MB, Italy",
      heroImageUrl,
      heroImageAlt: "Piazza Duomo in Monza with the striped black-and-white marble facade of the cathedral and the surrounding square",
      heroImageCredit: "Zairon, CC BY-SA 4.0",
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "Book the Iron Crown chapel tour in advance by phone (+39 039 326383) — walk-up slots are limited and it's the only way to see the crown up close. The guided visit lasts about 30 minutes.",
        "The Giardini Reali behind Villa Reale are free to enter and the quietest part of the Monza park complex — ponds, a small temple, English landscape gardens. Worth 30 minutes on a race morning.",
      ],
      whatToAvoid: "Don't visit the centro storico on Saturday afternoon — qualifying day crowds spill into the town centre. Tuesday or Wednesday before race weekend is the right time. And don't skip the Museum next to the Duomo: the Iron Crown is in the chapel, on a guided tour only — the cathedral nave alone doesn't include it.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: turismo.monza.it (Duomo Museum hours and prices confirmed), villarealemonza.org (Villa Reale hours and prices confirmed), guidetoitaly.com/monza-travel-guide. Iron Crown guided tour €8 confirmed via museoduomomonza.it. Combined ticket €14 confirmed. Villa Reale €15/€12 confirmed. All verified Jun 2026. GTG: N/A. Booking.com: N/A. Hero image: Zairon, CC BY-SA 4.0.",
      moodTags: ["cultural", "historic", "off-the-beaten-track"],
      interestCategories: ["culture", "sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "budget",
      budgetCurrency: "EUR",
      bestSeasons: ["sep"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-06-29",
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
