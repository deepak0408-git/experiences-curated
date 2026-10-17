import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { sportingEvents } from "../schema/database.ts";

// Hungarian GP 2027 event-pack hero image.
//
// NOTE: sportingEvents has no heroImageCredit/heroImageAlt column (unlike
// experiences/blogArticles) — the real attribution "Kleszczu, CC BY 4.0"
// from the source filename cannot be persisted anywhere in the DB for an
// event hero image. Recording it here in the script comment only, same
// known gap as prior sporting_events hero image uploads.

const EVENT_ID = "a767ae5f-de6c-48a1-b6fb-fec941f3ad86"; // Hungarian GP 2027
const LOCAL_PATH = "Images/Hungarian GP 2027 - Hungaroring Hero Image Credit Kleszczu CC BY 4.0.jpg";
const R2_KEY = "sporting-events/hero/hungarian-gp-2027.jpg";

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

try {
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
    .returning({ id: sportingEvents.id, name: sportingEvents.name, slug: sportingEvents.slug, heroImageUrl: sportingEvents.heroImageUrl });

  console.log("Updated:", result);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
