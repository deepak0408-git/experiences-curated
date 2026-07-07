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
const slug = "hotel-de-la-ville-monza-" + Date.now().toString(36);

const IMAGE_URL = "https://upload.wikimedia.org/wikipedia/commons/d/dc/Villa_Reale_di_Monza_%28Giuseppe_Piermarini%2C_1777-1780%29%2C_veduta_dal_fronte.jpg";
const LOCAL_PATH = "Images/Hotel de la Ville Monza.jpg";
const R2_KEY = "experiences/hero/hotel-de-la-ville-monza.jpg";

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
const bodyContent = `Monza has one luxury hotel. Hotel de la Ville sits on Viale Regina Margherita di Savoia, directly opposite the Villa Reale palace, 2 kilometres from the Autodromo gates. During Italian GP weekend, the paddock comes here. Michael Schumacher, Kimi Räikkönen, Sebastian Vettel, Charles Leclerc — the hotel earned the name "pilots' hotel" over decades of Grand Prix weekends, and the reputation has stuck.

The hotel has 62 rooms across three floors, individually furnished, a number of them overlooking the royal palace gardens. The Derby Grill restaurant — led by chef Fabio Silva — is the serious dining option in Monza: Brianza-inspired, locally sourced, three Michelin forks. The breakfast buffet gets consistently singled out in reviews. There's also a bar, a gym, a sauna in the La Villa annex, and free parking in a closed courtyard.

What you're paying for is location. Walk through Parco di Monza to the circuit gates in under 20 minutes — the same park walk that train arrivals take from Biassono-Lesmo, but from your hotel room instead of the station. On race weekend, that's not a small thing. The alternative is a hotel in Milan with a 25-minute train journey each way, three times a day. Here you walk.

The hotel is a member of Small Luxury Hotels of the World. Standard rates run from around €300/night. Race weekend pricing is considerably higher, and availability goes months before September — this is the only property of its kind in Monza, and the circuit crowd knows it.`;

const whyItsSpecial = `Most Italian GP visitors stay in Milan. It makes sense logistically — good train links, more hotel options, the city itself. But Hotel de la Ville offers something no Milan hotel can: you're already at Monza. Walk to the circuit. Walk back after the race without waiting for a train. Eat at Derby Grill, sleep opposite the Villa Reale, and spend the weekend inside the event rather than commuting to it.

The F1 teams have been staying here for decades, which tells you something about the standard of the place. But what's more interesting is the location itself — directly opposite one of Italy's finest neoclassical palaces, inside a park that contains a world championship motor racing circuit. That combination exists nowhere else. Staying here is the only way to properly live inside it rather than passing through.`;

const practicalInfo = {
  hours: "Check-in from 15:00; check-out by 12:00. Derby Grill open Tuesday–Saturday, lunch and dinner.",
  costRange: "From ~€300/night standard; race weekend significantly higher — contact hotel directly for GP pricing.",
  bookingMethod: "Book directly at hoteldelaville.com or via Booking.com — race weekend sells out months in advance.",
  howToBook: "Race weekend rooms typically sell out by February or March for a September event — book as soon as the calendar is confirmed, usually the previous autumn. Book direct (info@hoteldelaville.com / +39 039 39421) for the best chance of room upgrades and flexibility. Ask specifically about their driving experience package with Pure Sport, which bundles circuit time with the hotel stay. If the hotel is full, On Location Experiences and F1 Experiences sometimes bundle Hotel de la Ville rooms as part of hospitality packages — check onlocationexp.com and f1experiences.com.",
  website: "https://hoteldelaville.com/en/",
  reservationsRequired: true,
};

const gettingThere = "From Milan, take the S8/S9/S11 suburban train from Milano Porta Garibaldi to Biassono-Lesmo Parco (20 mins, €3.10), then a short taxi or 15-minute walk to the hotel. By car: free closed-courtyard parking on site. The circuit is a 20-minute walk through Parco di Monza.";

// ─── 3. Insert experience ─────────────────────────────────────────────────────
try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Hotel de la Ville — Monza's F1 Pilots' Hotel",
      subtitle: "2km from the circuit, opposite the Villa Reale. The only luxury hotel in Monza, and where the F1 teams stay.",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Monza Centro",
      address: "Viale Regina Margherita di Savoia 15, 20900 Monza MB, Italy",
      heroImageUrl,
      heroImageAlt: "The neoclassical facade of Villa Reale di Monza, the royal palace directly opposite Hotel de la Ville",
      heroImageCredit: "Paolobon140, CC BY-SA 4.0",
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "Ask for a room overlooking the Villa Reale gardens when booking — the palace view at dusk is the best free thing about staying here.",
        "Derby Grill is closed Sunday and Monday — plan your dinner reservations around that, and book the table at the same time as your room.",
      ],
      whatToAvoid: "Don't leave race weekend booking later than March. This is the only luxury hotel in Monza, the teams use it, and it fills completely. There is no late availability — you're either in early or staying in Milan.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: hoteldelaville.com, slh.com/hotels/hotel-de-la-ville-monza, it.wikipedia.org/wiki/Hotel_de_la_Ville_(Monza), tripadvisor.com. F1 guest list (Schumacher, Räikkönen, Vettel, Leclerc) confirmed via Wikipedia and hotel site. Derby Grill Michelin forks confirmed via Wikipedia. Race weekend sell-out timing estimated from travel package lead times (gpdestinations.com). Booking.com affiliate opportunity: hotel listed at booking.com/hotel/it/de-la-ville-monza.html — add affiliate tag to bookingLinks when publishing. Hero image: Villa Reale facade, Paolobon140, CC BY-SA 4.0.",
      moodTags: ["iconic", "exclusive", "insider"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "luxury",
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
