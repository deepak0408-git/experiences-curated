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

// Hero image update, batch 6 of Qatar GP 2026 experiences.
// Curator-confirmed picks, 13 Sep 2026. #21 source independently verified by curator.
const UPDATES = [
  {
    id: "1a30c4e7-9b51-423d-bfbc-0b4481a70c49",
    title: "Souq Waqif",
    localFile: "Images/Qatar GP - Souk Waqif credit Diego Delso CC BY-SA.jpg",
    imageKey: "experiences/hero/qatar-gp-souq-waqif.jpg",
    alt: "Vibrant alley with colourful umbrella canopy, Souq Waqif, Doha",
    credit: "Diego Delso / CC BY-SA 3.0",
  },
  {
    id: "6902f121-802c-4765-b94c-0c07f099c1d2",
    title: "Doha City Highlights Tour",
    localFile: "Images/Qatar GP - Doha credit P. Hughes CC BY 4.0.jpg",
    imageKey: "experiences/hero/qatar-gp-doha-city-highlights-tour.jpg",
    alt: "Doha skyline",
    credit: "P. Hughes / CC BY 4.0",
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
