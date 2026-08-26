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

const SLUG = "late-night-melbourne-park-midnight-finishes-svfimc";
const LOCAL_FILE = "Images/Australian Open - Rod Laver Arena by Night.jpg";
const imageKey = `experiences/hero/late-night-melbourne-park.jpg`;

const file = readFileSync(LOCAL_FILE);
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));

const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;
console.log("Hero image uploaded:", heroImageUrl);

const [existing] = await db.select().from(experiences).where(eq(experiences.slug, SLUG));

const [updated] = await db
  .update(experiences)
  .set({
    heroImageUrl,
    heroImageAlt: "Rod Laver Arena illuminated at night during the Australian Open",
    heroImageCredit: "Fir0002/Flagstaffotos, GFDL 1.2",
    editorialNote:
      existing.editorialNote +
      " Hero image replaced 26 Aug 2026 via hero-image-search skill — Wikimedia Commons 'Rod_laver_arena_by_night.jpg', dual-licensed CC BY-NC 3.0 / GFDL 1.2; used under GFDL 1.2 specifically (not the CC BY-NC option) since this is a commercial/paid content product and CC BY-NC would conflict. Credit: Fir0002/Flagstaffotos.",
    lastVerifiedDate: new Date().toISOString().slice(0, 10),
  })
  .where(eq(experiences.slug, SLUG))
  .returning({ id: experiences.id, slug: experiences.slug, heroImageUrl: experiences.heroImageUrl });

console.log("Updated:", updated);
await client.end();
