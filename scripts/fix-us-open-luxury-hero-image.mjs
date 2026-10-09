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

const r2Key = "experiences/hero/us-open-luxury-hospitality.jpg";
const file = readFileSync("Images/US Open 2026 - Hospitality.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: r2Key,
  Body: file,
  ContentType: "image/jpeg",
}));
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${r2Key}`;
console.log("✓ Uploaded:", heroImageUrl);

// User-supplied stock/representative image, not a real photo of US Open's
// actual hospitality suites — heroImageCredit left null per the standing
// rule (no placeholder credit text; "representative image" is a caveat
// about the photo's subject, not a photographer/licence attribution, so it
// belongs in heroImageAlt/editorialNote, not heroImageCredit).
const [updated] = await db.update(experiences)
  .set({
    heroImageUrl,
    heroImageAlt: "A representative hospitality/lounge setting — not an actual photo of US Open's official suites",
    heroImageCredit: null,
  })
  .where(eq(experiences.slug, "us-open-luxury-hospitality-muv8p3m4"))
  .returning({ slug: experiences.slug });

console.log("✓ DB updated:", updated);
await client.end();
