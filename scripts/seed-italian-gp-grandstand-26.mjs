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
const slug = "grandstand-26-pit-lane-grid-podium-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────
const imageKey = "experiences/hero/grandstand-26-laterale-destra-monza.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/Grandstand 26 Laterale Destra Monza.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("✓ Hero image uploaded:", heroImageUrl);

// ─── 2. Content ───────────────────────────────────────────────────────────────
const bodyContent = `Monza's start/finish straight is where the Italian GP is decided. Grandstand 26 — the Laterale Destra — sits directly opposite the pit lane, which means you see everything: the grid build-up before lights out, pit stops in real time across the track, the race finish, and the podium ceremony. Not from a screen. From your seat.

The stand has three sections. 26A is closest to the start line, opposite grid positions 7–14. 26B moves you further along the grid. 26C is the podium section — lower row numbers here give you the clearest view of the ceremony of any grandstand at Monza. If the podium is what you came for, 26C is your seat, and it's €414 cheaper than 26A.

The stand faces east and is shaded from midday onward — useful in early September when Monza sits at 28–30°C. Avoid rows D and E in all sections; roof support pillars clip sightlines. Rows A–C or the upper tier are the ones to book.

Grandstand 26 sells out months before race weekend. Section 26A is gone through official channels — the secondary market and hospitality packages are your routes in now.`;

const whyItsSpecial = `At most F1 circuits, a grandstand seat means watching cars go past. Grandstand 26 is different. You're opposite the pit lane, which means you're watching the race operationally — pit stops played out across the track in real time, strategy unfolding before the commentators explain it. When a driver pits from the lead and comes out in traffic, you see it first.

And then there's the podium. Section 26C has the best view of the ceremony of any grandstand at Monza. When a Ferrari driver climbs it, the Tifosi around you lose all composure in the best possible way. At this circuit, with this crowd, the podium is not an afterthought. It's half the reason you came.`;

const practicalInfo = {
  hours: "Gates open 08:00 on race days; qualifying from 15:00 Saturday; race start ~15:00 Sunday",
  costRange: "€594–€1,008 for a 3-day pass (26C to 26A); 26A sold out through official channels",
  bookingMethod: "Book 3-day passes via f1italy.com — check availability for 26B/C or join the waitlist for 26A.",
  howToBook: "Grandstand 26A sold out through official channels before June 2026. Routes in: (1) Secondary market — StubHub and Viagogo carry resale tickets, typically at 30–50% premium over face value; verify seller ratings carefully. (2) F1 Experiences Champions Club and Paddock Club packages include premium grandstand access bundled with hospitality — book via f1experiences.com. (3) On Location Experiences, the official F1 hospitality partner, sells inclusive packages with grandstand seating and pit lane access; onlocationexp.com. (4) GTG (getthegig.com) — check for Italian GP hospitality and grandstand bundles. For 26B/C, the official waitlist at f1italy.com releases tickets when corporate allocations are returned, usually 4–6 weeks before race day.",
  website: "https://www.f1italy.com/en/ticket-info/26-laterale-destra-a",
  reservationsRequired: true,
};

const gettingThere = "Take S8, S9 or S11 train from Milano Porta Garibaldi (20 mins) to Biassono-Lesmo Parco, then the Black Line shuttle bus or a 20-minute walk through Parco di Monza to the circuit gates. Allow 90 minutes from Milan city centre to your seat on race day.";

// ─── 3. Insert experience ─────────────────────────────────────────────────────
try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Grandstand 26 — Pit Lane, Grid & Podium Views",
      subtitle: "The start/finish straight's premium seat: pit lane opposite, grid positions in front, podium dead centre.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Autodromo Nazionale Monza",
      address: "Autodromo Nazionale Monza, Viale Vedano 5, 20900 Monza MB, Italy",
      heroImageUrl,
      heroImageAlt: "Ferrari racing car in motion blur on the Monza start/finish straight during the Italian Grand Prix",
      heroImageCredit: "Jenda Kubeš, Pexels Licence",
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "Book section 26C if the podium ceremony matters to you — it has the clearest sightline of any grandstand at Monza and is €414 cheaper than 26A for the same 3-day pass.",
        "The stand faces east and gets shade from midday onward — bring sunscreen for the morning session but you won't need it by race start on Sunday afternoon.",
      ],
      whatToAvoid: "Avoid rows D and E in all three sections — roof support pillars obstruct your view of the pit lane. And don't arrive after 09:30 on race day; the walk from Biassono-Lesmo through Parco di Monza gets very crowded. Choose rows A–C or the upper tier when booking.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: oversteer48.com/monza-grandstand-26-laterale-destra, f1italy.com/en/ticket-info/26-laterale-destra-a, gpdestinations.com/budget-planner-italian-f1-grand-prix. Prices verified Jun 2026. 26A confirmed sold out via f1italy.com Jun 2026. GTG affiliate opportunity flagged. Hero image: Pexels Licence, Jenda Kubeš.",
      moodTags: ["exhilarating", "unmissable", "front-row"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "splurge",
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
