import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { sportingEvents } from "../schema/database.ts";

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

const EVENT_SLUG = "french-open";
const LOCAL_FILE = "Images/Roland Garros French Open Hero Image.jpg";
const imageKey = `sporting-events/hero/french-open.jpg`;

const file = readFileSync(LOCAL_FILE);
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));

const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;
console.log("Hero image uploaded:", heroImageUrl);

const [updated] = await db
  .update(sportingEvents)
  .set({ heroImageUrl })
  .where(eq(sportingEvents.slug, EVENT_SLUG))
  .returning({ id: sportingEvents.id, slug: sportingEvents.slug, heroImageUrl: sportingEvents.heroImageUrl });

console.log("Updated:", updated);
await client.end();
