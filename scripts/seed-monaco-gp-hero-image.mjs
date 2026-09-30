import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { sportingEvents } from "../schema/database.ts";

// Sporting event hero image for Monaco Grand Prix 2027.
// Credit: Matthew Lamb, CC BY-SA 2.0. Local file: "Images/Monaco GP - Hero
// Image By Matthew Lamb CC BY-SA 2.0.jpg" — Casino Square during Monaco GP
// race weekend, Monte-Carlo Casino building, palm trees, MONACO GRAND PRIX
// trackside banner, and the harbour-side street circuit barrier all
// visible. Matches Grandstand B's real location. Verified visually 30 Sep
// 2026 (matches the venue — no generic/wrong-circuit risk).
// Note: sportingEvents has no heroImageAlt/heroImageCredit columns (unlike
// experiences) — credit is recorded here in the seed script header as the
// audit trail, per R2 key convention.

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

const EVENT_SLUG = "monaco-grand-prix";
const localPath = "Images/Monaco GP - Hero Image By Matthew Lamb CC BY-SA 2.0.jpg";
const r2Key = "sporting-events/hero/monaco-grand-prix.jpg";

const file = readFileSync(localPath);
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: r2Key,
  Body: file,
  ContentType: "image/jpeg",
}));

const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${r2Key}`;
console.log("✓ Uploaded:", heroImageUrl);

await db.update(sportingEvents)
  .set({ heroImageUrl })
  .where(eq(sportingEvents.slug, EVENT_SLUG));

console.log(`✓ sportingEvents.heroImageUrl set for ${EVENT_SLUG}`);

await client.end();
