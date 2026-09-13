import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
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

// Hero image update, batch 3 of Qatar GP 2026 experiences.
// Curator-confirmed picks, 13 Sep 2026. #16 source independently verified by curator.
const UPDATES = [
  {
    id: "ecc2e700-c53b-48d9-87a1-5050fc9e2b3a",
    title: "Four Seasons Hotel Doha, West Bay",
    localFile: "Images/Qatar GP - West Bay Skyline credit Gregory Hawken Kramer CC BY-SA 4.0.jpg",
    imageKey: "experiences/hero/qatar-gp-four-seasons-west-bay.jpg",
    alt: "West Bay Doha skyline with boats in the foreground",
    credit: "Gregory Hawken Kramer / CC BY-SA 4.0",
  },
  {
    id: "3a49daf8-2d82-4664-894f-f2ad8353ce2e",
    title: "Qatari Cuisine in Souq Waqif",
    localFile: "Images/Qatar GP - Mezze Snacks credit Rachel Claire Pexels.jpg",
    imageKey: "experiences/hero/qatar-gp-qatari-cuisine-souq.jpg",
    alt: "Mediterranean-style mezze snacks laid out on a table",
    credit: "Rachel Claire / Pexels Licence",
  },
  {
    id: "d8e45e0d-e4d8-4f69-b1e9-12736719f266",
    title: "Sawa by Sanad",
    localFile: "Images/Qatar GP - Mezze Platter credit Karolina Grabowska Pexels.jpg",
    imageKey: "experiences/hero/qatar-gp-sawa-by-sanad.jpg",
    alt: "Middle Eastern mezze platter with pita bread and dips",
    credit: "Karolina Grabowska / Pexels Licence",
  },
  {
    id: "1d4e8f83-57f8-47e9-88b2-f890909fb0bc",
    title: "Parisa — Souq Waqif Atmosphere Dining",
    localFile: "Images/Qatar GP - Dining Room credit Rene Terp Pexels.jpg",
    imageKey: "experiences/hero/qatar-gp-parisa-atmosphere-dining.jpg",
    alt: "Luxurious ornate dining room interior with chandeliers",
    credit: "Rene Terp / Pexels Licence",
  },
  {
    id: "5b50c8b1-aaf3-4a34-a946-e0f2e871ec5f",
    title: "Museum of Islamic Art",
    localFile: "Images/Qatar GP - Museum credit Francesco Bini CC BY 4.0.jpg",
    imageKey: "experiences/hero/qatar-gp-museum-islamic-art.jpg",
    alt: "Museum of Islamic Art, Doha",
    credit: "Francesco Bini / CC BY 4.0",
  },
];

for (const u of UPDATES) {
  const file = readFileSync(u.localFile);
  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: u.imageKey,
    Body: file,
    ContentType: "image/jpeg",
  }));
  const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${u.imageKey}`;

  const [result] = await db
    .update(experiences)
    .set({
      heroImageUrl,
      heroImageAlt: u.alt,
      heroImageCredit: u.credit,
    })
    .where(eq(experiences.id, u.id))
    .returning({ id: experiences.id, title: experiences.title, heroImageUrl: experiences.heroImageUrl });

  console.log(`✓ ${result.title}`);
  console.log(`  R2 key: ${u.imageKey}`);
  console.log(`  hero_image_url: ${result.heroImageUrl}\n`);
}

await client.end();
