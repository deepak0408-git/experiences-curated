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

const r2Key = "experiences/hero/us-open-nyc-museums-the-met.jpg";
const file = readFileSync("Images/US Open 2026 - NYC Museums The Met.jpg");
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: r2Key,
  Body: file,
  ContentType: "image/jpeg",
}));
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${r2Key}`;
console.log("✓ Uploaded:", heroImageUrl);

const [updated] = await db.update(experiences)
  .set({
    heroImageUrl,
    heroImageAlt: "The Metropolitan Museum of Art facade, seen from Central Park",
    heroImageCredit: "Hugo Schneider, CC BY-SA 2.0",
  })
  .where(eq(experiences.slug, "nyc-museums-day-trip-muverkw6"))
  .returning({ slug: experiences.slug });

console.log("✓ DB updated:", updated);
await client.end();
