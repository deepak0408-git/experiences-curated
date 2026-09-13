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

// Hero image update, batch 4 of Qatar GP 2026 experiences.
// Curator-confirmed picks, 13 Sep 2026. #18 source independently verified by curator.
const UPDATES = [
  {
    id: "1dd9d1be-dab8-441d-b1ab-f3943014af65",
    title: "National Museum of Qatar",
    localFile: "Images/Qatar GP - Desert Rose Architecture credit Abdullah Ghatasheh Pexels.jpg",
    imageKey: "experiences/hero/qatar-gp-national-museum-qatar.jpg",
    alt: "Desert rose-inspired architecture of the National Museum of Qatar",
    credit: "Abdullah Ghatasheh / Pexels Licence",
  },
  {
    id: "8a162ae8-6c17-4a1e-b98a-8aeefb68d2a2",
    title: "Khor Al Adaid (Inland Sea) Desert Safari",
    localFile: "Images/Qatar GP - Khor al credit LBM1948 CC BY 4.0.jpg",
    imageKey: "experiences/hero/qatar-gp-khor-al-adaid.jpg",
    alt: "Khor Al Adaid Inland Sea and surrounding desert dunes",
    credit: "LBM1948 / CC BY 4.0",
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
