import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, like } from "drizzle-orm";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { experiences } from "../schema/database.ts";

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

const UPLOADS = [
  {
    slugPrefix: "atlantic-city-day-trip-",
    localFile: "Images/US Open 2026 - Atlantic City Boardwalk.jpg",
    r2Key: "experiences/hero/us-open-atlantic-city-boardwalk.jpg",
    alt: "The boardwalk in Atlantic City, New Jersey, lined with shops",
    credit: "Bruce Emmerling, CC BY-SA 4.0",
  },
  {
    slugPrefix: "hudson-valley-day-trip-",
    localFile: "Images/US Open 2026 - Hudson Valley Catskill Escarpment.jpg",
    r2Key: "experiences/hero/us-open-hudson-valley-catskill-escarpment.jpg",
    alt: "The Catskill Escarpment and Hudson River seen from North Germantown, NY",
    credit: "Daniel Case, CC BY-SA 3.0",
  },
  {
    slugPrefix: "us-open-arrival-guide-",
    localFile: "Images/US Open 2026 - Arrival Guide Tennis Center.jpg",
    r2Key: "experiences/hero/us-open-arrival-guide-tennis-center.jpg",
    alt: "The USTA Billie Jean King National Tennis Center grounds, Flushing Meadows-Corona Park",
    credit: "Ajay Suresh, CC BY 2.0",
  },
  {
    slugPrefix: "us-open-first-timer-guide-",
    localFile: "Images/US Open 2026 - First Timer Guide Grounds.jpg",
    r2Key: "experiences/hero/us-open-first-timer-guide-grounds.jpg",
    alt: "The US Open grounds at Flushing Meadows, with the Unisphere visible",
    credit: "Alexisrael, CC BY-SA 4.0",
  },
  {
    slugPrefix: "us-open-weather-packing-",
    localFile: "Images/US Open 2026 - Weather Rain Delay.jpg",
    r2Key: "experiences/hero/us-open-weather-rain-delay.jpg",
    alt: "A rain delay at the US Open, 2011",
    credit: "Madeleine Ball, CC BY-SA 2.0",
  },
];

for (const u of UPLOADS) {
  const file = readFileSync(u.localFile);
  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: u.r2Key,
    Body: file,
    ContentType: "image/jpeg",
  }));
  const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${u.r2Key}`;
  console.log("✓ Uploaded:", heroImageUrl);

  const [existing] = await db.select({ id: experiences.id, slug: experiences.slug })
    .from(experiences)
    .where(like(experiences.slug, `${u.slugPrefix}%`));

  if (!existing) {
    console.error("  ✗ No experience found for slug prefix:", u.slugPrefix);
    continue;
  }

  await db.update(experiences)
    .set({ heroImageUrl, heroImageAlt: u.alt, heroImageCredit: u.credit })
    .where(eq(experiences.id, existing.id));

  console.log("  ✓ DB updated:", existing.slug);
}

await client.end();
console.log("\nDone.");
