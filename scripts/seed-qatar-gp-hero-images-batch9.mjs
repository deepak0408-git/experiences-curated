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

// Hero image update, batch 9 of Qatar GP 2026 experiences.
// Curator-confirmed pick, 13 Sep 2026. Source independently verified by curator.
const UPDATES = [
  {
    id: "3cf26bcb-75d6-45ea-9c79-d39d48c8c8af",
    title: "Fan Zone",
    localFile: "Images/Qatar GP - Simulator credit Michael Gaylard CC BY 4.0.jpg",
    imageKey: "experiences/hero/qatar-gp-fan-zone.jpg",
    alt: "Fan zone racing simulator activity",
    credit: "Michael Gaylard / CC BY 4.0",
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
