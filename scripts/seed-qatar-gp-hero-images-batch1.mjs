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

// Hero image update for 5 already-seeded Qatar GP 2026 experiences.
// Curator-confirmed picks, 13 Sep 2026 (Exp.1 "Where to Sit" deliberately skipped/deferred).
const UPDATES = [
  {
    id: "a825c4f5-87d4-4674-b683-f035fdc654fc",
    title: "Paddock Club & Champions Club",
    localFile: "Images/Qatar GP - Paddock Club credit Jezael Melgoza Unsplash Licence.jpg",
    imageKey: "experiences/hero/qatar-gp-paddock-champions-club.jpg",
    alt: "Modern glass balcony overlooking a spacious interior, evoking a hospitality terrace",
    credit: "Jezael Melgoza / Unsplash Licence",
  },
  {
    id: "0c54551a-a1e8-4f9a-aa13-df95ed86fbb7",
    title: "Main Grandstand",
    localFile: "Images/Qatar GP - Main Grandstand credit Trinidade CC BY 3.0.jpg",
    imageKey: "experiences/hero/qatar-gp-main-grandstand.jpg",
    alt: "Spectators in the grandstand at Losail Circuit",
    credit: "Trinidade / CC BY 3.0",
  },
  {
    id: "c5ea52bf-522f-4069-bcec-f8ff800ed567",
    title: "Inside Lusail Circuit",
    localFile: "Images/Qatar GP - Lusail credit Trinidade CC BY 3.0.jpg",
    imageKey: "experiences/hero/qatar-gp-inside-lusail-circuit.jpg",
    alt: "Lusail International Circuit grandstand at night",
    credit: "Trinidade / CC BY 3.0",
  },
  {
    id: "64d62627-563f-4187-a604-5d993f06a6b0",
    title: "Getting to Lusail Circuit",
    localFile: "Images/Qatar GP - Doha Metro credit Randwick CC0.jpg",
    imageKey: "experiences/hero/qatar-gp-getting-to-lusail-circuit.jpg",
    alt: "Doha Metro Red Line train, the line serving Lusail",
    credit: "Randwick / CC0 1.0",
  },
  {
    id: "686330f2-9498-477c-b4ed-dfa7f238aff5",
    title: "Raffles Doha & Fairmont Doha",
    localFile: "Images/Qatar GP - Doha skyline credit Zairon CC BY 4.0.jpg",
    imageKey: "experiences/hero/qatar-gp-raffles-fairmont-doha.jpg",
    alt: "Doha skyline, Katara Towers district",
    credit: "Zairon / CC BY 4.0",
  },
];

for (const u of UPDATES) {
  const file = readFileSync(u.localFile);
  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: u.imageKey,
    Body: file,
    ContentType: "image/jpeg",
  }));
  const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${u.imageKey}`;

  const [result] = await db
    .update(experiences)
    .set({
      heroImageUrl,
      heroImageAlt: u.alt,
      heroImageCredit: u.credit,
    })
    .where(eq(experiences.id, u.id))
    .returning({ id: experiences.id, title: experiences.title, heroImageUrl: experiences.heroImageUrl });

  console.log(`✓ ${result.title}`);
  console.log(`  R2 key: ${u.imageKey}`);
  console.log(`  hero_image_url: ${result.heroImageUrl}\n`);
}

await client.end();
