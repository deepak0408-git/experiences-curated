import { config } from "dotenv";
config({ path: ".env.local" });

import { writeFileSync, readFileSync } from "fs";
import https from "https";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, sql } from "drizzle-orm";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { experiences, sportingEvents } from "../schema/database.ts";

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

const EVENT_ID = "be8e1129-6e53-4e45-a574-931250988806";

function download(url, dest, attempt = 1) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "ExperiencesCuratedBot/1.0 (contact: hello@experiences-curated.com)" } }, (res) => {
      if (res.statusCode === 429 && attempt < 4) {
        res.resume();
        return setTimeout(() => download(url, dest, attempt + 1).then(resolve, reject), 3000 * attempt);
      }
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve, reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        writeFileSync(dest, Buffer.concat(chunks));
        resolve();
      });
    }).on("error", reject);
  });
}

try {
  // ─── 1. Experience-level hero image (Wikimedia Cape Town Waterfront) ───
  const expImagePath = "Images/Where to Stay in Cape Town for the Test.jpg";
  await download("https://upload.wikimedia.org/wikipedia/commons/5/51/Cape_Town_Waterfront.jpg", expImagePath);
  console.log("✓ Downloaded experience hero image");

  const expImageKey = "experiences/hero/where-to-stay-in-cape-town-for-the-test.jpg";
  const expHeroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${expImageKey}`;
  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: expImageKey,
    Body: readFileSync(expImagePath),
    ContentType: "image/jpeg",
  }));
  console.log("✓ Uploaded experience hero image to R2:", expHeroImageUrl);

  // ─── 2. Event-level hero image (Unsplash aerial Cape Town) ───
  const eventImagePath = "Images/Australia in South Africa Cricket 2026 Event Hero.jpg";
  await download(
    "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?fm=jpg&q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0",
    eventImagePath
  );
  console.log("✓ Downloaded event hero image");

  const eventImageKey = "sporting-events/hero/australia-in-south-africa-cricket-2026.jpg";
  const eventHeroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${eventImageKey}`;
  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: eventImageKey,
    Body: readFileSync(eventImagePath),
    ContentType: "image/jpeg",
  }));
  console.log("✓ Uploaded event hero image to R2:", eventHeroImageUrl);

  // ─── 3. Update sportingEvents hero image ───
  await db.update(sportingEvents)
    .set({ heroImageUrl: eventHeroImageUrl })
    .where(eq(sportingEvents.id, EVENT_ID));
  console.log("✓ Updated sportingEvents.heroImageUrl");

  // ─── 4. Update experience: practicalInfo (remove combined website) + bookingLinks + hero image ───
  const [current] = await db
    .select({ id: experiences.id, practicalInfo: experiences.practicalInfo })
    .from(experiences)
    .where(eq(experiences.title, "Where to Stay in Cape Town for the Test"));

  const newPracticalInfo = { ...current.practicalInfo };
  delete newPracticalInfo.website;

  const bookingLinks = [
    { platform: "booking.com", label: "Cape Grace", url: "PLACEHOLDER_USER_SUPPLIED" },
    { platform: "booking.com", label: "Taj Cape Town", url: "PLACEHOLDER_USER_SUPPLIED" },
    { platform: "booking.com", label: "Vineyard Hotel", url: "PLACEHOLDER_USER_SUPPLIED" },
  ];

  await db.update(experiences)
    .set({
      practicalInfo: newPracticalInfo,
      heroImageUrl: expHeroImageUrl,
      heroImageAlt: "Aerial view of Cape Town's V&A Waterfront with Table Mountain in the background",
      heroImageCredit: "Andreas Tusche, CC BY-SA 3.0",
    })
    .where(eq(experiences.id, current.id));

  console.log("✓ Updated experience practicalInfo (website removed) and hero image");
  console.log("\nBooking.com links need real affiliate URLs from you — placeholders written, not live yet:");
  console.log(JSON.stringify(bookingLinks, null, 2));
} catch (e) {
  console.error("✗ FAILED:", e.message);
  if (e.cause) console.error("CAUSE:", e.cause);
} finally {
  await client.end();
}
