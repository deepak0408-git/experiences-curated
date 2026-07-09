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
const slug = "lake-como-race-weekend-from-the-lake-" + Date.now().toString(36);

// ─── 1. Upload hero image ─────────────────────────────────────────────────────
const imageKey = "experiences/hero/lake-como-race-weekend-from-the-lake.jpg";
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const file = readFileSync("Images/Lake Como Race Weekend from the Lake.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
console.log("✓ Hero image uploaded:", heroImageUrl);

// ─── 2. Content ───────────────────────────────────────────────────────────────
const bodyContent = `Some people basing themselves for Monza want the fastest possible commute. Others want a place worth waking up in even on the days they're not at the circuit. Lake Como is for the second group, and it's worth being honest about the trade-off before recommending it: this is not a quick hop to the track.

Varenna is the practical base of the two main options. It has its own train station with a direct Trenord service to Milano Centrale in about 64 minutes, running roughly hourly from 05:35 to 21:35. From there, getting to Monza means either continuing on to Milano Centrale and picking up the separate direct Como–Monza line, or routing via Milan generally, since there's no single direct train from Varenna to Monza itself. Realistically, budget close to two hours door to door on a race day, not the "quick weekend trip" some guides imply.

Bellagio, the more famous of the two towns, doesn't have a train station at all. Getting there means a ferry from Varenna (about 15 minutes, running hourly, first departure 6:45am) or a bus from Como (just over an hour). It's the prettier base of the two, with genuine promenade views and a slower pace, but every day you head to the circuit adds a ferry or bus leg on top of the train.

For where to stay, Varenna keeps things simpler. Hotel Olivedo sits two minutes from the ferry pier in a Liberty-style 1896 building, though it only operates February through October, so check dates if you're eyeing shoulder-season travel. Albergo Milano, a few hundred metres away, runs a strong reputation for the price. In Bellagio, Hotel Belvedere has been run by the same family for five generations and looks straight across the lake and up toward the Alps, which is the actual reason to choose Bellagio over Varenna in the first place.

The honest recommendation: this works well for a longer stay where race day is one part of a bigger trip, less well if you're trying to squeeze in three tight circuit days around a day job's worth of commuting.`;

const whyItsSpecial = `I'll say this plainly: Lake Como is not the efficient choice, and I don't think it should be sold as one. What it offers instead is a genuinely different kind of race weekend, the kind where you watch qualifying, come back to a lakefront hotel that's been in the same family for generations, and remember that Monza is one part of a trip rather than the whole of it.

The towns themselves earn that trade-off. Varenna's waterfront and Bellagio's promontory position are the reason Lake Como has drawn visitors for over a century, well before anyone built a racetrack forty minutes away by the most generous possible routing. For a client who's done Monza once already and wants a different shape to the trip the second time, or for anyone extending into a longer Italian holiday around race weekend, this is the right answer. For someone who wants to walk out of their hotel and be at the circuit in twenty minutes, it isn't, and that's worth saying clearly rather than glossing over.`;

const practicalInfo = {
  hours: "Varenna–Milano Centrale trains run roughly hourly, 05:35–21:35; Varenna–Bellagio ferry runs hourly, first departure 06:45, last departure from Varenna 23:20.",
  costRange: "Hotel Olivedo and Albergo Milano run mid-range (roughly €130–200/night in peak season); Hotel Belvedere in Bellagio sits at the higher end reflecting its lake-view position.",
  bookingMethod: "Book hotels directly or via Booking.com; ferry and train tickets are bought separately through Navigazione Laghi and Trenord.",
  howToBook: "Be precise with clients about the commute before they book this: there is no direct train from Varenna or Bellagio to Monza, and the realistic door-to-door time on a race day, accounting for the Varenna–Milan leg plus onward connection, is closer to two hours than the \"40 minutes\" figure that circulates in some older trip write-ups. This makes Lake Como a strong recommendation for a client extending their trip into a proper lake holiday around race weekend, and a weaker one for a client who wants to shuttle back and forth to the circuit efficiently across three days. For Hotel Olivedo, confirm the February–October operating window before booking shoulder-season dates. For Hotel Belvedere in Bellagio, its family-run five-generation history is a genuine selling point for a client who wants a personal, non-chain stay rather than a standard resort experience.",
  website: "https://www.trenord.it/en/routes-and-timetables/most-searched-lines/milano-central-station-varenna-esino/",
  reservationsRequired: true,
};

const gettingThere = "Milano Centrale to Varenna-Esino direct by Trenord, about 64 minutes. For Monza specifically, there's no single direct service — route via Milano Centrale, or use the separate direct Como San Giovanni–Monza line (about 30–41 minutes) if basing nearer Como.";

// ─── 3. Insert experience ─────────────────────────────────────────────────────
try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Lake Como — Race Weekend from the Lake",
      subtitle: "A slower, more scenic base than Milan — with a genuine commute trade-off worth knowing upfront.",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Varenna / Bellagio, Lake Como",
      address: "Varenna: Piazza Martiri, 23829 Varenna LC, Italy; Bellagio: Piazza della Chiesa, 22021 Bellagio CO, Italy",
      heroImageUrl,
      heroImageAlt: "Panoramic view of Varenna on Lake Como, Italy",
      heroImageCredit: "Gabrielle Merk, CC BY-SA 4.0",
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "There's no single direct train from Varenna to Monza — plan on routing via Milano Centrale, and budget close to two hours door to door rather than assuming a short commute.",
        "Bellagio has no train station at all — getting there from Varenna means a 15-minute ferry (hourly, from 6:45am), which is worth factoring into any day you plan to visit the circuit and return.",
      ],
      whatToAvoid: "Don't book this as a quick-commute base for a tightly scheduled three-day circuit trip — the realistic travel time to Monza is meaningfully longer than Milan or Como town, so it suits a longer, slower stay better than a packed race-only itinerary. And don't book Hotel Olivedo outside its February–October operating season without checking current dates directly with the hotel first.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: trenord.it Milano Centrale-Varenna Esino route (64 min direct, 05:35-21:35), trenord.it Como S.Giovanni-Milano route (Como-Monza direct 30-41 min, separate from Varenna line), rome2rio.com Como San Giovanni to Varenna (no direct Varenna-Monza service, 2h11m via Monza transfer), bellagiolakecomo.com public transport (Bellagio has no train station, ferry/bus only), olivedo.it (Hotel Olivedo, Feb-Oct season), belvederebellagio.com (Hotel Belvedere, five-generation family run). CORRECTION: prior memory note claimed '40 mins from San Giovanni' — this does not hold up; verified real logistics are more complex (see body). GTG: no Monza/Italian GP listings found. Booking.com: Hotel Olivedo, Albergo Milano, Hotel Belvedere all confirmed listed and bookable — TODO affiliate links batched with #8, #9 per user decision 8 Jul 2026. Hero image: Gabrielle Merk, CC BY-SA 4.0, Wikimedia Commons. Verified 8 Jul 2026.",
      sport: ["formula_one"],
      moodTags: ["scenic", "relaxed", "romantic"],
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
