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

// 13 Sep 2026: curator-approved EXCEPTION — this hero image is AI-generated,
// not a real photo of the venue. heroImageCredit is public-facing (renders as
// photo attribution on the experience page) so it stays null; the AI-generated
// fact is tracked only in editorialNote (internal-only, never rendered).
// Same pattern as the Lusail Hill Lounge exception, same session — not a new
// default, a one-off override per curator instruction each time.
const EXPERIENCE_ID_MAIN_GRANDSTAND = "0c54551a-a1e8-4f9a-aa13-df95ed86fbb7"; // qatar-gp-main-grandstand-mtymn305

const localFile = "Images/Qatar GP - Main Grandstand.png";
const imageKey = "experiences/hero/qatar-gp-main-grandstand.png";

const file = readFileSync(localFile);
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/png",
}));
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const [result] = await db
  .update(experiences)
  .set({
    heroImageUrl,
    heroImageAlt: "Spectators in the main grandstand at Lusail International Circuit",
    heroImageCredit: null,
    editorialNote: "Hero image is AI-generated — curator-approved exception, 13 Sep 2026. Not a real photo of the venue.",
  })
  .where(eq(experiences.id, EXPERIENCE_ID_MAIN_GRANDSTAND))
  .returning({ id: experiences.id, title: experiences.title, heroImageUrl: experiences.heroImageUrl, heroImageCredit: experiences.heroImageCredit });

console.log(`✓ ${result.title}`);
console.log(`  R2 key: ${imageKey}`);
console.log(`  hero_image_url: ${result.heroImageUrl}`);
console.log(`  hero_image_credit: ${result.heroImageCredit}`);
console.log(`  NOTE: AI-generated flag recorded in editorialNote only`);

await client.end();
