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
const slug = "staying-in-milan-city-base-strategy-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────
const imageKey = "experiences/hero/staying-in-milan-city-base-strategy.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/Staying in Milan The City Base Strategy.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("✓ Hero image uploaded:", heroImageUrl);

// ─── 2. Content ───────────────────────────────────────────────────────────────
const bodyContent = `Monza itself has a small handful of hotels, and they get booked out fast and priced accordingly for race weekend. Most people who've done this trip more than once end up basing in Milan instead, and the train math is the reason why: Trenord runs Milano Centrale to Monza in 9 minutes, with trains roughly every hour from 5:25am to 11:22pm. That's a shorter commute than plenty of people have to their own office.

Three areas make sense depending on what you want out of the trip. Right around Milano Centrale itself puts you two minutes from the fastest train to Monza and inside easy walking distance of the Hyatt Centric Milan Centrale, a 141-room hotel with a proper spa setup (Roman bath, sauna, Turkish bath, salt cave) if you want to recover between sessions. The Hilton Milan sits a couple of blocks further out on Via Luigi Galvani, still inside that same walk-to-the-station radius, and tends to run a little more corporate and a little less design-forward than the Hyatt, which some people prefer for a race weekend where you're mostly just sleeping there.

If you'd rather trade a few minutes of commute for a lower nightly rate, Sesto San Giovanni is worth knowing about. It's the last stop on Milan's M1 metro line, which means you get direct metro access into the city center and a short hop to a Trenord connection toward Monza without needing a car. The BB Hotels Smarthotel Re Milano Nord sits in this area, a 43-room 4-star property with a garden and terrace that's meaningfully cheaper than anything near Centrale, at the cost of one metro change to get anywhere central.

The bigger case for Milan over Monza itself is what happens outside race hours. Monza empties out at night during a normal week. Milan doesn't. You get actual restaurants, actual nightlife, and a city that isn't purely organized around a racetrack, which matters over a three or four night stay more than people expect going in.`;

const whyItsSpecial = `The obvious move is to book the hotel closest to the circuit and assume that's the smart play. At Monza, it usually isn't. The commute from central Milan is short enough that it stops being a real trade-off, and what you get in exchange is a proper city for the hours you're not at the track.

I think this is the detail people underestimate about a race weekend: you spend maybe ten hours a day at the circuit across three days, and the rest of the time you're somewhere else. Somewhere else being Monza, a pleasant but genuinely quiet town, versus somewhere else being Milan, is not a close call for most travellers. The train being 9 minutes is what makes this an easy decision rather than a compromise.`;

const practicalInfo = {
  hours: "Trenord Milano Centrale–Monza trains run roughly hourly, first departure 05:25, last departure 23:22.",
  costRange: "Hyatt Centric and Hilton run standard-to-upper city hotel rates (higher during race weekend); BB Hotels Smarthotel Re Milano Nord is meaningfully cheaper, reflecting its Sesto San Giovanni location.",
  bookingMethod: "All three hotels are bookable directly or through Booking.com — book Milan accommodation for race weekend as early as possible, since Monza weekend drives citywide demand, not just circuit-adjacent demand.",
  howToBook: "For a client who wants zero commute friction, Hyatt Centric Milan Centrale is the tightest walk to the fastest Monza train and has the strongest on-site recovery amenities (spa, sauna, salt cave) for a multi-day race weekend where clients are on their feet a lot. Hilton Milan is the safer, more predictable corporate-standard choice a couple of blocks further out, good for clients who prioritize loyalty points or consistency over design. For budget-conscious clients or larger groups, BB Hotels Smarthotel Re Milano Nord in Sesto San Giovanni cuts the nightly rate meaningfully in exchange for one extra metro leg; brief them clearly that \"Sesto San Giovanni\" is the far northern end of the M1 line, not walking distance to central Milan, so they should plan the metro connection into their schedule rather than assume proximity. Whichever hotel, book the specific Trenord Milano Centrale–Monza service rather than assuming any Milan-Monza train works; some services require a change and take considerably longer than the direct 9-minute one.",
  website: "https://www.trenord.it/en/routes-and-timetables/most-searched-lines/milano-centrale-monza/",
  reservationsRequired: true,
};

const gettingThere = "Milano Centrale to Monza by Trenord train takes 9 minutes with no changes; from Sesto San Giovanni, take the M1 metro to Milano Centrale or connect directly via Trenord toward Monza.";

// ─── 3. Insert experience ─────────────────────────────────────────────────────
try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Staying in Milan — The City Base Strategy",
      subtitle: "Nine minutes by train to Monza, and a real city to come back to every night of the weekend.",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Milano Centrale / Porta Garibaldi",
      address: "Milano Centrale area — Hyatt Centric Milan Centrale, Piazza Duca d'Aosta area, 20124 Milano MI; Hilton Milan, Via Luigi Galvani 12, 20124 Milano MI; BB Hotels Smarthotel Re Milano Nord, Sesto San Giovanni, 20099 MI",
      heroImageUrl,
      heroImageAlt: "Milan's financial district skyline with Porta Garibaldi railway station in the foreground",
      heroImageCredit: "FlavMi, CC BY-SA 3.0",
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "The direct Trenord service between Milano Centrale and Monza takes 9 minutes with no changes — always confirm you're booked on this specific service, since some Milan–Monza trains are slower and require a change.",
        "Sesto San Giovanni sits at the far end of Milan's M1 metro line, so it's a genuine budget option but requires planning the metro connection into your Monza-day schedule rather than assuming central-Milan proximity.",
      ],
      whatToAvoid: "Don't wait to book Milan hotels assuming Monza weekend only affects circuit-adjacent towns — demand and pricing rise citywide, including well outside race weekend, so book as early as you would a Monza hotel. And don't assume every Milan–Monza train is the same journey time — some services run considerably longer than the direct 9-minute Trenord connection from Milano Centrale, so check the specific service before planning your morning.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: trenord.it Milano Centrale-Monza route page (9 min, hourly, 05:25-23:22), hyatt.com Hyatt Centric Milan Centrale hotel-info (141 rooms, spa amenities), hilton.com Hilton Milan (Via Luigi Galvani 12 address), booking.com BB Hotels Smarthotel Re Milano Nord listing (43 rooms, garden/terrace, Sesto San Giovanni), rome2rio.com Sesto San Giovanni to Monza (M1 metro + Trenord connection). GTG: no Monza/Italian GP listings found. Booking.com: all three hotels confirmed listed and bookable — TODO: add affiliate links in a batch pass alongside #8 Hotel de la Ville and #10 Lake Como, per user decision 8 Jul 2026. Hero image: FlavMi, CC BY-SA 3.0, Wikimedia Commons. Verified 8 Jul 2026.",
      sport: ["formula_one"],
      moodTags: ["convenient", "urban", "budget-friendly"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "moderate",
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
