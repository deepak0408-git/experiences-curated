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
const slug = "alfa-romeo-museum-arese-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────
const imageKey = "experiences/hero/alfa-romeo-museum-arese.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/Alfa Romeo Museum Arese.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("✓ Hero image uploaded:", heroImageUrl);

// ─── 2. Content ───────────────────────────────────────────────────────────────
const bodyContent = `The Museo Storico Alfa Romeo sits in Arese, on the site of Alfa Romeo's old factory northwest of Milan. It first opened in 1976, closed in 2011, and reopened in June 2015 after a full rework: six floors, four themed areas, and 69 cars pulled from a collection that runs to more than 250 vehicles and 150 engines in total. What's on the floor at any given time is a rotating selection, not the whole archive, which is worth knowing if you're hoping for one specific model.

The reason this belongs on a Monza trip rather than just a general Milan itinerary is one car: the Alfa Romeo 159 Alfetta, the actual chassis Juan Manuel Fangio drove to the 1951 Formula 1 World Championship, Alfa Romeo's works team back when they still ran their own factory F1 effort. It's part of the permanent collection and normally on display, a direct, physical link between a museum and the sport currently drawing you twelve kilometres away at Monza.

The museum organizes its floors around a few core ideas rather than pure chronology, tracing everything from the brand's earliest road cars in 1910 through prototypes, dream cars, and Alfa's lesser-known aeronautical work. It's more coherent than a lot of manufacturer museums, which tend to just line cars up by decade and hope that's interesting enough on its own.

If you want more than a self-guided wander, there's a 90-minute guided tour every Saturday at 4pm, and a separate storage room tour every Sunday at 3pm for smaller groups that gets you into the part of the collection not normally on public display. Both need booking ahead through the museum's own site. Standard entry is €15 (€10 reduced for under-18s, over-65s, and a few other categories), and groups of 15 or more get a discounted rate.

Getting there without a car means either the M1 metro to Rho-Fiera and then bus 561 to the museum door, or a direct shuttle bus from Milano Centrale to Il Centro Arese, a 500-metre walk from the entrance, running daily for a €5 return ticket.`;

const whyItsSpecial = `Most manufacturer museums are essentially very well-lit showrooms: cars in a row, plaques with specs, a gift shop at the end. Arese is different because it's telling the story of a company that built both road cars people actually drove and, for a real stretch of history, its own Formula 1 team, and it keeps physical proof of both in the same building.

Standing next to the actual Fangio 159 does something a photo or a stat sheet doesn't. This isn't a replica or a static display model. It's the car, the one that won a world title in 1951, sitting in a museum a short drive from a circuit that's hosted the Italian Grand Prix since before that car existed. For anyone who's just spent a weekend watching current F1 cars at Monza, that's a genuinely direct line back to where this all started, not a metaphorical one.`;

const practicalInfo = {
  hours: "Monday 10:00-18:00, closed Tuesday, Wednesday-Sunday 10:00-18:00. Extraordinary opening days and closures vary by year (e.g. closed 24-25 and 31 Dec) — check the museum's calendar before visiting around holidays.",
  costRange: "Full admission €15; reduced €10 (under-18s, over-65s, journalists, Stellantis employees); groups of 15+ at €12 each.",
  bookingMethod: "Standard admission is walk-in, no reservation needed; the Saturday guided tour and Sunday storage room tour both require advance booking through the museum's own website.",
  howToBook: "For a client who specifically wants to see the Fangio 159, confirm it's on display before the visit, since the museum rotates roughly a quarter of its full collection through the public floors and pieces do occasionally move to loan exhibitions elsewhere. The Sunday storage room tour is the better recommendation for a serious enthusiast client over the standard Saturday tour, since it's the only way into the roughly 180 cars not normally on public display, though it only runs for small groups and needs booking well ahead. For clients without a car, the direct shuttle from Milano Centrale is simpler to explain and book than the metro-plus-bus route, even though it's a fixed daily schedule rather than on-demand.",
  website: "https://www.museoalfaromeo.com/en-us/",
  reservationsRequired: false,
};

const gettingThere = "M1 metro to Rho-Fiera, then bus 561 (Airpullman) to the museum door; or the direct shuttle bus from Milano Centrale (Piazza Duca d'Aosta) to Il Centro Arese, 500m walk from the entrance, €5 return, running daily.";

// ─── 3. Insert experience ─────────────────────────────────────────────────────
try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Alfa Romeo Museum, Arese",
      subtitle: "Fangio's actual 1951 title-winning car, twelve kilometres from Monza.",
      slug,
      experienceType: "cultural_site",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Arese",
      address: "Viale Alfa Romeo, 20017 Arese MI, Italy",
      heroImageUrl,
      heroImageAlt: "A 1954 Alfa Romeo 1900 Sport Spider on display at the Museo Storico Alfa Romeo in Arese",
      heroImageCredit: "Zairon, CC BY-SA 4.0",
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "The museum rotates its display, showing roughly 69 of a collection that runs past 250 vehicles — if a client wants a specific model, it's worth checking with the museum directly before the trip rather than assuming everything's on the floor.",
        "The Sunday storage room tour (3pm, small groups, 90 minutes) is the only way to see cars beyond the standard public display — book this one specifically ahead of a Saturday general tour if the client is a serious enthusiast.",
      ],
      whatToAvoid: "Don't turn up on a Tuesday — the museum is closed that day every week, unlike most Milan-area attractions that close Monday. And don't assume the shuttle bus from Milano Centrale runs on demand — it's a fixed daily schedule (roughly 30 minutes each way, €5 return), so check departure times before building it into a tight day plan.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: en.wikipedia.org Museo Alfa Romeo (1976 opening, 2011 closure, 2015 reopening, six floors, four theme areas, 69 cars of 250+ collection), museoalfaromeo.com Biglietteria/ticket office (hours, pricing, extraordinary dates), museoalfaromeo.com storage room tours (Sunday 3pm), stellantisheritage.com Alfa Romeo 159 Alfetta (Fangio 1951 championship car, confirmed in permanent collection), rome2rio.com Milan to Alfa Romeo Museum (shuttle bus, metro+bus routes). CORRECTION: memory's '60+ models' slightly imprecise — current renewed exhibit shows exactly 69 cars from a total collection over 250; used precise figures. GTG: N/A (museum admission). Booking.com: N/A. Hero image: Zairon, CC BY-SA 4.0, confirmed the actual Arese museum. Verified 8 Jul 2026. FINAL EXPERIENCE OF 16 FOR ITALIAN GP PACK.",
      sport: ["formula_one"],
      moodTags: ["historic", "cultural", "family-friendly"],
      interestCategories: ["culture", "sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "budget",
      budgetCurrency: "EUR",
      bestSeasons: ["sep"],
      advanceBookingRequired: false,
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
