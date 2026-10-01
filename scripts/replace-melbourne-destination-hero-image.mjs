import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { destinations } from "../schema/database.ts";
import { eq } from "drizzle-orm";

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

// Replaces the Melbourne destination hero image — CC BY 4.0 (Dietmar Rabich), skyline.
const DESTINATION_ID = "f6b2c13f-cb70-45e3-9dcf-2a821d9e6f50";
const localFile = "Images/Melbourne - Skyline Dietmar Rabich CC BY 4.0.jpg";
const imageKey = "destinations/hero/melbourne.jpg";

const file = readFileSync(localFile);
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const [result] = await db
  .update(destinations)
  .set({ heroImageUrl })
  .where(eq(destinations.id, DESTINATION_ID))
  .returning({ id: destinations.id, name: destinations.name, heroImageUrl: destinations.heroImageUrl });

console.log(`✓ ${result.name}`);
console.log(`  hero_image_url: ${result.heroImageUrl}`);

await client.end();
