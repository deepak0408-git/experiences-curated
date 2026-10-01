// Hero images for the 4-city destination-page pilot (London, Melbourne,
// Shanghai, Abu Dhabi) — 1 Oct 2026 brainstorm. Images chosen by founder
// from 3 verified CC/free-licence candidates per city (see
// scratchpad/hero-images-<city>-destination.md for full candidate sets and
// rejected options). Local files already downloaded to Images/ per standing
// rule — uploads to R2 under destinations/hero/<slug>.jpg, then updates
// destinations.hero_image_url + hero_image_alt directly (no credit field on
// destinations — unlike experiences, that table only has heroImageUrl, no
// heroImageCredit column, confirmed against schema/database.ts).
import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { destinations } from "../schema/database.ts";

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

async function uploadLocal(localPath, r2Key) {
  const file = readFileSync(localPath);
  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: r2Key,
    Body: file,
    ContentType: "image/jpeg",
  }));
  return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${r2Key}`;
}

async function setHero(slug, heroImageUrl) {
  await db.update(destinations)
    .set({ heroImageUrl, updatedAt: new Date() })
    .where(eq(destinations.slug, slug));
  console.log(`✓ ${slug} → ${heroImageUrl}`);
}

// London — Option 1, Tower Bridge & skyline (Susan Q Yin, Unsplash Licence)
{
  const url = await uploadLocal(
    "Images/London Destination - Tower Bridge Susan Q Yin Unsplash.jpg",
    "destinations/hero/london-gb.jpg"
  );
  await setHero("london-gb", url);
}

// Melbourne — Option 3, Princes Bridge evening panorama (Costa Karabelas, Pexels Licence)
{
  const url = await uploadLocal(
    "Images/Melbourne Destination - Princes Bridge Evening Panorama Costa Karabelas Pexels.jpg",
    "destinations/hero/melbourne-au.jpg"
  );
  await setHero("melbourne-au", url);
}

// Shanghai — Option 1, The Bund at night (Roger Goh, Unsplash Licence)
{
  const url = await uploadLocal(
    "Images/Shanghai Destination - The Bund at Night Roger Goh Unsplash.jpg",
    "destinations/hero/shanghai.jpg"
  );
  await setHero("shanghai", url);
}

// Abu Dhabi — Option 1, Sheikh Zayed Grand Mosque golden hour (David Rodrigio, Unsplash Licence)
{
  const url = await uploadLocal(
    "Images/Abu Dhabi Destination - Sheikh Zayed Grand Mosque David Rodrigio Unsplash.jpg",
    "destinations/hero/abu-dhabi.jpg"
  );
  await setHero("abu-dhabi", url);
}

console.log("\nAll 4 pilot destination hero images seeded.");
await client.end();
