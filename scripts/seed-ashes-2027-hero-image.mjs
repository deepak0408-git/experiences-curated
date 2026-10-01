// Hero image for The Ashes 2027 sporting event — user-supplied local file
// (not sourced via hero-image-search), uploaded as-is. No heroImageCredit
// field exists on sportingEvents (only heroImageUrl), so no credit to omit
// or fabricate either way.
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

const file = readFileSync("Images/Blog One Cricket Series Ashes Urn.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: "sporting-events/hero/the-ashes-2027.jpg",
  Body: file,
  ContentType: "image/jpeg",
}));

const url = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/sporting-events/hero/the-ashes-2027.jpg`;

await db.update(sportingEvents)
  .set({ heroImageUrl: url, updatedAt: new Date() })
  .where(eq(sportingEvents.slug, "the-ashes-2027"));

console.log(`✓ the-ashes-2027 → ${url}`);
await client.end();
