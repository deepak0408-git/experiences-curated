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
const slug = "getting-to-kingsmead-" + Date.now().toString(36);

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

const bodyContent = `Kingsmead sits close enough to the Golden Mile that most visitors staying along the beachfront can just walk. From the North Beach hotel strip it's about 15 minutes on foot, and that's the easiest way to arrive on both match days — no parking search, no traffic, no post-match queue for a car.

If you're not walking, the stadium has two entrances built for two different jobs. The South Entrance on K.E. Masinga Road is the Uber and Bolt pickup and drop-off point — set this as your destination when booking a ride, not a generic "Kingsmead" pin, since rideshare drivers are routed here specifically. The North Entrance on Masabalala Yengwa Avenue handles the park-and-ride shuttle, including the paid service running to and from Suncoast Casino for anyone based further up the coast.

Driving yourself means booking parking in advance, not showing up and hoping. Green Zone parking at the Oval runs R50, Gold Zone at the SABC lot is R85 and online-only, and there's overflow paid parking at the Centrum and ICC venues nearby. All of it goes through ticketpros.co.za. Parking opens 90 minutes before gates — for a 16:00 start that's 14:30 — and turning up right at gate-open on a big session means competing for whatever's left.

Gates open two hours before the first ball, which matters more for the Test than the ODI. A single ODI day means one arrival to plan around. The five-day Test means doing this same walk or ride five times, and by day two most regulars have already settled into whichever entrance and route worked best on day one. If you're staying beachfront for the full Test, that repetition is the argument for walking over driving — no parking booking to redo each morning, no exit queue each evening.

Everyone gets searched at the gate — bags and person, standard for a stadium this size — so build a few extra minutes into arrival regardless of which entrance you're using.

One more thing worth knowing if your day runs late: the Durban CBD gets genuinely quieter and less comfortable after dark, in a way the Golden Mile itself generally isn't. A Test match evening session or a late finish is exactly the scenario where booking an Uber back rather than walking is the sensible call, not an overcautious one.`;

const whyItsSpecial = `This isn't really about the cricket — it's about the fact that Kingsmead might be the easiest ground on the entire tour to actually get to. Most Test venues make you choose between a hotel that's convenient and one that's actually nice to stay in. Durban's Golden Mile lets you have both: a beachfront hotel that's also a fifteen-minute walk from the ground. I don't think enough people plan around that.

The two-entrance system also just works, once you know it exists. Uber drivers know the South Entrance. Park-and-ride regulars know the North. Nobody's guessing which gate to aim for, which is more than you can say for most cricket grounds I've read about. The only real decision left is whether you're walking or riding — and for a Test that runs five straight days, that decision is worth making early rather than re-litigating every morning.`;

const insiderTips = [
  "For the Test's five-day stretch, pick one route (walk or rideshare) on day one and stick with it — most regulars settle into a rhythm by day two, and re-deciding each morning wastes time you don't get back.",
  "If you're on the park-and-ride from further up the coast, the Suncoast Casino shuttle link via the North Entrance is worth checking specifically — it's a named, paid service, not just generic parking.",
];

const whatToAvoid = "Don't set a generic \"Kingsmead\" or \"cricket stadium\" pin for your Uber or Bolt — the actual pickup/drop-off point is the South Entrance on K.E. Masinga Road, and a vague pin can mean a longer walk to find your driver in a crowd. And don't plan on walking back to a beachfront hotel after a late Test evening session without at least considering a rideshare instead — the Durban CBD gets noticeably less comfortable after dark, even though the Golden Mile itself is fine.";

const practicalInfo = {
  hours: "Gates open 2 hours before first ball (e.g. 15:30 for a 17:30 start; confirm against published start times per match)",
  costRange: "Green Zone parking R50, Gold Zone parking R85 (online only) — both via ticketpros.co.za",
  bookingMethod: "No ticket needed for the walk or rideshare option. If driving, book Green (R50) or Gold (R85, online-only) parking in advance via ticketpros.co.za — parking opens 90 minutes before gates and fills fast on big session days. Set your rideshare destination to the South Entrance on K.E. Masinga Road specifically, not a general stadium pin.",
  website: "https://www.durbanssupergiants.com, https://www.ticketpros.co.za",
  reservationsRequired: false,
};

try {
  const imagePath = "Images/Coastal City Promenade Golden Mile Durban.jpg";
  await download("https://unsplash.com/photos/btD_mJRxpgM/download", imagePath);
  console.log("✓ Downloaded hero image");

  const imageKey = "experiences/hero/getting-to-kingsmead-durban.jpg";
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
      title: "Getting to Kingsmead — Golden Mile & K.E. Masinga Road",
      subtitle: "The South Entrance is the Uber drop-off, and Durban's stadium is a genuine 15-minute walk from the beachfront hotels.",
      slug,
      experienceType: "transit",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Golden Mile / Durban CBD",
      address: "Kingsmead Cricket Ground, Walter Gilbert Road area, Durban, KwaZulu-Natal",
      heroImageUrl,
      heroImageAlt: "Coastal city promenade with ocean waves, representing the Golden Mile walking route to Kingsmead",
      heroImageCredit: "Frederick Adegoke Snr., Unsplash Licence",
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere: "15-minute walk from North Beach/Golden Mile hotels. Uber/Bolt pickup and drop-off at the South Entrance, K.E. Masinga Road. Park-and-ride shuttle (including a paid Suncoast Casino service) via the North Entrance, Masabalala Yengwa Avenue.",
      editorialNote: "Sources: durbanssupergiants.com (SA20 2025 Kingsmead general info — entrances, parking zones/pricing, gate times, bag policy), Wikipedia (Kingsmead Cricket Ground), rome2rio.com (Durban to Kingsmead transit), travelsafe-abroad.com + africanjacana.com (2026 Durban safety guidance — CBD after-dark caution, Golden Mile daytime safety). Verified 15 Jul 2026. No GTG/Booking.com affiliate opportunity — transit experience, no bookable product.",
      sport: ["cricket"],
      moodTags: ["practical", "coastal", "easy"],
      interestCategories: ["sport"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "free",
      budgetCurrency: "ZAR",
      bestSeasons: ["sep", "oct"],
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
