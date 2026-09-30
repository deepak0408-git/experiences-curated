import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { sportingEvents } from "../schema/database.ts";

// Sporting event hero image for British Grand Prix 2027.
// Credit: Jen Ross, CC BY 4.0. Local file: "Images/British GP - Hero Image
// Jen Ross CC BY 4.0.jpg" — wet-weather race-weekend shot at Silverstone,
// Abbey grandstand and the circuit's Ferris wheel visible, AWS-branded
// trackside boards. Verified visually 30 Sep 2026 (matches the venue — no
// generic/wrong-circuit risk).
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

const EVENT_SLUG = "british-grand-prix";
const localPath = "Images/British GP - Hero Image Jen Ross CC BY 4.0.jpg";
const r2Key = "sporting-events/hero/british-grand-prix.jpg";

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
