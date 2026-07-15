import { config } from "dotenv";
config({ path: ".env.local" });

import { writeFileSync, readFileSync } from "fs";
import https from "https";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
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

const DESTINATION_ID = "de40345a-9fbc-4b77-9833-dafed8189e40";
const EVENT_ID = "be8e1129-6e53-4e45-a574-931250988806";
const slug = "getting-to-newlands-" + Date.now().toString(36);

function download(url, dest, attempt = 1) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "ExperiencesCuratedBot/1.0 (contact: hello@experiences-curated.com)" } }, (res) => {
      if (res.statusCode === 429 && attempt < 4) {
        res.resume();
        return setTimeout(() => download(url, dest, attempt + 1).then(resolve, reject), 3000 * attempt);
      }
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest, attempt).then(resolve, reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => { writeFileSync(dest, Buffer.concat(chunks)); resolve(); });
    }).on("error", reject);
  });
}

const bodyContent = `Newlands might be the one ground on this tour where the train is genuinely the best option, not just the cheap one. The Southern Line runs straight from Cape Town Station — buy a ticket from Platform 1, it's about a 20-minute ride, and Newlands station shares a wall with the ground itself. You walk out of the station and you're already there. No road to cross, no ten-minute trudge from a car park.

If you're staying in the City Bowl or the Southern Suburbs closer to Newlands, the train covers both starting points without much difference in effort. From further out, or if you'd rather not deal with a station, Uber and Bolt have their own dedicated pickup and drop-off point at the Newlands Swimming Pool — that's the address to set, not the ground itself, since it keeps you out of the pedestrian crush right at the gates.

Driving means picking one of a few named parking options around Groote Schuur High School and Sans Souci Girls High School, all a short walk from the ground. Some of it is reserved and ticketed in advance; the unreserved lots run on cash payment at the gate, and prices land somewhere in the R50-R70 range depending on which lot and how the day is structured. Campground Road itself closes to through traffic on match days, so build that into your route if you're driving anywhere nearby, not just to the ground.

This is the tour's last stop, and it's a five-day Test — the longest single stretch of any venue on this trip. Gates typically open two to three hours before play, depending on the day, which is more relevant here than it sounds: the first arrival is when you figure out which entrance actually suits you, and every day after that gets faster once you're not re-learning the layout. If you're doing all five days, the train's consistency — same platform, same walk, same time, every morning — is hard to beat against re-parking or re-booking a ride each day.

The Southern Line carries the same big-city caveat as any commuter rail line into a stadium crowd: keep an eye on your bag, especially on a packed carriage heading to or from a big session. Test days are daylight cricket in Cape Town's summer, so you're never doing this journey in the dark, which takes the edge off the usual evening-train concern entirely.`;

const whyItsSpecial = `Every other ground on this tour asks you to choose between convenience and cost. Newlands doesn't. The train is the cheap option and the fast one — a shared wall between station and stadium isn't something you get anywhere else on this trip, and it turns "getting to the ground" from a logistics problem into a five-minute non-event.

It's also the venue that rewards showing up more than once. A five-day Test means five mornings of the same walk, the same platform, the same rhythm — and once you've done it on day one, every day after is on autopilot. That's not true of a ground where you're re-booking parking or hunting for a rideshare pickup point each time. By day three you'll know exactly which carriage door lines up with the exit, and that kind of small, earned familiarity is part of what makes a Test match feel less like a tourist stop and more like something you actually settle into.`;

const insiderTips = [
  "Set your Uber or Bolt pickup point to Newlands Swimming Pool specifically — it's the venue's actual dedicated e-hailing point, not a workaround, and it keeps you clear of the crowd bottleneck right at the stadium gates.",
  "For the full five-day Test, the train's consistency is worth choosing deliberately over driving — same platform, same short walk, every single morning, with none of the re-parking or rideshare-surge variability a car brings on a big session day.",
];

const whatToAvoid = "Don't assume any parking lot near the ground is unreserved and walk-up — some, like the upper Groote Schuur High School lot, are reserved and ticket-only, and turning up without checking means driving around looking for one of the smaller cash lots instead. And don't route yourself down Campground Road on a match day if you're just passing through the area — it closes to through traffic for the day, and treating it as a normal road will cost you a detour you didn't plan for.";

const practicalInfo = {
  hours: "Gates typically open 2-3 hours before play, varying by match day — confirm the exact time against the published schedule for each day of the Test",
  costRange: "Reserved parking varies by lot and requires advance ticketing; unreserved cash parking runs approximately R50-R70 per vehicle",
  bookingMethod: "No ticket needed for the train or rideshare option — just budget the ~20-minute Southern Line ride or set your pickup point to Newlands Swimming Pool, not the ground itself. If driving, reserved parking near Groote Schuur High School requires an advance ticket; unreserved lots at Groote Schuur Primary and Sans Souci Girls High School take cash on the day, roughly R50-R70.",
  website: "https://newlandscricket.com",
  reservationsRequired: false,
};

try {
  const imagePath = "Images/Southern Line Muizenberg Station.jpg";
  await download("https://upload.wikimedia.org/wikipedia/commons/0/09/Alstom-Gibela_X%27Trapolis_Mega_arriving_at_the_Muizenberg_station%2C_May_2026.jpg", imagePath);
  console.log("✓ Downloaded hero image");

  const imageKey = "experiences/hero/getting-to-newlands-cape-town.jpg";
  const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;
  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: imageKey,
    Body: readFileSync(imagePath),
    ContentType: "image/jpeg",
  }));
  console.log("✓ Uploaded to R2:", heroImageUrl);

  const [result] = await db
    .insert(experiences)
    .values({
      title: "Getting to Newlands — Southern Line & Groote Schuur Parking",
      subtitle: "The train drops you inside the wall, and e-hailing has its own pickup point at the pool.",
      slug,
      experienceType: "transit",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Newlands / Southern Suburbs",
      address: "Newlands Cricket Ground, 146 Campground Rd, Newlands, Cape Town, 7780",
      heroImageUrl,
      heroImageAlt: "Alstom-Gibela X'Trapolis Mega train arriving at Muizenberg station on Cape Town's Southern Line",
      heroImageCredit: "Lefcentreright, CC0 1.0 (public domain)",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere: "Southern Line train from Platform 1, Cape Town Station — approximately 20 minutes, Newlands station adjoins the ground directly. Uber/Bolt pickup and drop-off at Newlands Swimming Pool. Driving: parking at Groote Schuur High School and Sans Souci Girls High School lots nearby; Campground Road closes to through traffic on match days.",
      editorialNote: "Sources: newlandscricket.com (Betway SA20 spectator arrangements — parking lots/pricing, gate times, e-hailing pickup point), Wikipedia (Newlands railway station), Tripadvisor (visitor directions and parking), icbmd.org.za (confirmed address). Verified 15 Jul 2026. Parking pricing sourced from SA20 (T20 league) spectator guide, not Test-specific — kept broad rather than presented as exact for this tour. No GTG/Booking.com affiliate opportunity — transit experience, no bookable product.",
      sport: ["cricket"],
      moodTags: ["practical", "coastal", "easy"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "free",
      budgetCurrency: "ZAR",
      bestSeasons: ["oct"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-07-15",
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
  console.log("\n→ Ready to review at: http://localhost:3000/curator/review");
  console.log("→ Preview at: http://localhost:3000/experience/" + result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
