import { config } from "dotenv";
config({ path: ".env.local" });

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sportingEvents } from "../schema/database.ts";
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

const EVENT_ID = "91f298a3-ca22-49c3-9c8e-5a200f0026c9";
const LOCAL_PATH = "Images/us-open-night1.jpg";
const R2_KEY = "sporting-events/hero/us-open-2026.jpg";

const file = readFileSync(LOCAL_PATH);
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: R2_KEY,
  Body: file,
  ContentType: "image/jpeg",
}));

const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${R2_KEY}`;

const [result] = await db
  .update(sportingEvents)
  .set({ heroImageUrl })
  .where(eq(sportingEvents.id, EVENT_ID))
  .returning({ id: sportingEvents.id, name: sportingEvents.name, slug: sportingEvents.slug });

console.log(`✓ ${result.name} hero updated -> ${heroImageUrl}`);
console.log(`  http://localhost:3000/event-pack/${result.slug}`);

await client.end();
