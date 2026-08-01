import { config } from "dotenv";
config({ path: ".env.local" });

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";
import { readFileSync } from "fs";

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

const items = [
  {
    experienceId: "f33b1720-a12c-4ccc-b728-a7ca71e90b9a", // Main Grandstand — Start, Finish & the Whole Straight
    localFile: "Bahrain GP in KL - Main Grandstand.jpg",
    r2Key: "experiences/hero/main-grandstand-sepang-start-finish.jpg",
    alt: "Main Grandstand at Sepang International Circuit, over the start/finish straight",
    credit: "User-provided image",
  },
  {
    experienceId: "72564dac-4c59-485d-bcd3-17754e5f5d0e", // K1 Grandstand — Turn 1's Overtaking Zone
    localFile: "Bahrain GP in KL - K1 Grandstand.jpg",
    r2Key: "experiences/hero/k1-grandstand-sepang-turn-1.jpg",
    alt: "K1 Grandstand at Turn 1, Sepang International Circuit",
    credit: "User-provided image",
  },
  {
    experienceId: "b3965e92-30c1-4ebe-a1bd-6a0b55baae0d", // Grandstand F — The Widest View on the Lap
    localFile: "Bahrain GP in KL - F Grandstand.jpg",
    r2Key: "experiences/hero/grandstand-f-sepang-panoramic.jpg",
    alt: "Grandstand F overlooking Turns 6-8 at Sepang International Circuit",
    credit: "User-provided image",
  },
  {
    experienceId: "960a4c4c-c65b-4bcb-9f35-af32a6c2d6f5", // Hill Stand (C2) — The Real Budget Seat
    localFile: "Bahrain GP in KL - Hill stand.jpg",
    r2Key: "experiences/hero/hill-stand-c2-sepang-general-admission.jpg",
    alt: "Hill Stand (C2) general admission embankment at Sepang International Circuit",
    credit: "User-provided image",
  },
];

for (const item of items) {
  try {
    const file = readFileSync(`Images/${item.localFile}`);
    await r2.send(new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: item.r2Key,
      Body: file,
      ContentType: "image/jpeg",
    }));
    const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${item.r2Key}`;

    const [result] = await db
      .update(experiences)
      .set({ heroImageUrl, heroImageAlt: item.alt, heroImageCredit: item.credit })
      .where(eq(experiences.id, item.experienceId))
      .returning({ id: experiences.id, title: experiences.title, slug: experiences.slug });

    console.log(`✓ ${result.title} -> ${heroImageUrl}`);
    console.log(`  http://localhost:3000/experience/${result.slug}`);
  } catch (e) {
    console.error(`✗ Failed for ${item.localFile}:`, e.message);
  }
}

await client.end();
console.log("\nDone.");
