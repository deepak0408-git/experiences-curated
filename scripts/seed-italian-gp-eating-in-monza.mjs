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
const slug = "eating-in-monza-risotto-luganega-" + Date.now().toString(36);

const IMAGE_URL = "https://images.pexels.com/photos/2364734/pexels-photo-2364734.jpeg";
const LOCAL_PATH = "Images/Eating in Monza Risotto Luganega.jpg";
const R2_KEY = "experiences/hero/eating-in-monza-risotto-luganega.jpg";

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
const bodyContent = `Monza sits in Brianza — the strip of Lombardy between Milan and the lakes — and the local food reflects that position exactly. Not as polished as Milan, not as tourist-facing as the lakes. The cooking here is direct: good ingredients, traditional technique, no fuss. You'll eat better than you expect to.

The dish to order is risotto con la luganega. Luganega is the local pork sausage — coarse-ground, intensely flavoured, with none of the sweetness of supermarket sausage. Combined with saffron risotto and finished properly (mantecato, not dry), it's one of the definitive plates of northern Italy. Il Feudo dei Sapori on Via Antonio Gramsci does a version with saffron rice and Parmesan wafer that gets consistently praised; they also run ossobuco with saffron rice, busecca (tripe soup, a Lombard staple), and taroz — a Brianza potato and green bean casserole that sounds humble and tastes better than it sounds.

La Cucina di Via Zucchi (Via Bartolomeo Zucchi 10) has been running since 1968 and is the local reference point for territorial cuisine. The focus is on seasonal risotti, slow-cooked mains, and artisanal pinse. Business lunch changes daily and runs seven days a week — which matters on a race weekend when half of Monza closes.

Trattoria Mercato at Vicolo Spalto Isolino 2 stays open until midnight. For post-qualifying dinner when you're back from the circuit later than planned, it's the practical choice. Not the most refined room in Monza but one of the most reliable.

Derby Grill at Hotel de la Ville is the serious option — Brianza-inspired tasting menus, three Michelin forks, locally sourced. Book a table even if you're not staying at the hotel. Just remember it's closed Sunday and Monday.`;

const whyItsSpecial = `Milan gets the food press. Monza doesn't. But Brianza cooking has been quietly producing some of the most satisfying food in northern Italy for a long time, and the Italian GP crowd — mostly focused on getting to the circuit and back — tends to miss it entirely.

What's interesting about eating in Monza during race weekend is the contrast. Outside the circuit gates: red shirts, crowd noise, €8 arancini. Ten minutes away in the centro storico, Il Feudo dei Sapori is serving proper saffron risotto to locals who've been coming since before the cars got interesting. The GP doesn't change the restaurants. They were here before F1, they'll be here after it, and they cook the same food regardless of who's at the table. That indifference to the spectacle is exactly what makes them worth finding.`;

const practicalInfo = {
  hours: "Il Feudo dei Sapori: Tue–Sun 12:00–14:30 & 19:00–22:30, closed Mon. La Cucina di Via Zucchi: daily 12:00–15:00 & 19:00–23:00. Trattoria Mercato: daily 12:00–14:30 & 19:00–00:00. Derby Grill: Tue–Sat lunch & dinner.",
  costRange: "~€35–45/head at Il Feudo and Via Zucchi; ~€25–35 at Trattoria Mercato; Derby Grill $$$$",
  bookingMethod: "Il Feudo dei Sapori: +39 039 387423. La Cucina di Via Zucchi: TheFork or info@lacucinadiviazucchi.it. Trattoria Mercato: walk-ins welcome.",
  howToBook: "Book Il Feudo dei Sapori and La Cucina di Via Zucchi as soon as your race weekend dates are confirmed — both fill up on Saturday and Sunday evenings during GP weekend. Call Il Feudo directly (+39 039 387423) or book La Cucina via TheFork or info@lacucinadiviazucchi.it. For Derby Grill, book the table at the same time as your hotel room — it's closed Sunday and Monday, so Friday or Saturday dinner is your window. Race weekend walk-in dining in Monza centro is possible at lunch on weekdays but a gamble on Saturday and Sunday evenings.",
  website: "https://turismo.monza.it/en/dining/il-feudo-dei-sapori-24938",
  reservationsRequired: true,
};

const gettingThere = "All three restaurants are in Monza centro storico, 10–15 minutes by taxi from the circuit gates or a short walk from Hotel de la Ville. From Milan, take the S8/S9/S11 to Monza station and walk or take a short taxi to the centro.";

// ─── 3. Insert experience ─────────────────────────────────────────────────────
try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Eating in Monza — Risotto, Luganega & the Brianza Table",
      subtitle: "Saffron risotto with local sausage, ossobuco, and a dining scene that has nothing to prove. Where serious locals eat.",
      slug,
      experienceType: "dining",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Monza Centro",
      address: "Via Antonio Gramsci 17, 20900 Monza MB, Italy",
      heroImageUrl,
      heroImageAlt: "Close-up of saffron risotto plated on white ceramic in a restaurant setting",
      heroImageCredit: "Igreja Preta, Pexels Licence",
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "At Il Feudo dei Sapori, order the risotto con luganega if it's on the menu — the saffron and sausage version is their signature and the best single plate in Monza.",
        "La Cucina di Via Zucchi is open every day including Sunday — one of the few quality restaurants in Monza that is, useful if you're staying an extra night after the race.",
      ],
      whatToAvoid: "Don't eat near the circuit gates on race day — overpriced and underwhelming. Ten minutes by taxi gets you into Monza centro and proper food. And don't assume Derby Grill is open on your chosen evening — Tuesday to Saturday only, no exceptions.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: tripadvisor.com (Il Feudo dei Sapori 322 reviews, 4.3/5), turismo.monza.it, lacucinadiviazucchi.it, tripadvisor.com (Trattoria Mercato). Il Feudo hours and address confirmed via TripAdvisor and turismo.monza.it. La Cucina di Via Zucchi open since 1968, confirmed trading Jun 2026. Trattoria Mercato confirmed open via Yelp Mar 2026. Luganega and Brianza dish descriptions sourced from TripAdvisor reviews of Il Feudo. Hero image: Igreja Preta, Pexels Licence.",
      moodTags: ["local", "authentic", "low-key"],
      interestCategories: ["food", "sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "moderate",
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
