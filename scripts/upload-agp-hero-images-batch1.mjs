import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import postgres from "postgres";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const sql = postgres(process.env.DIRECT_URL);

const IMAGES = [
  {
    slug: "albert-park-circuit-inside-the-track-mu9c6dq0",
    file: "Images/Aus GP/Australian GP - Albert Park Circuit — Inside the Track Tom Reynolds CC BY 2.0.jpg",
    alt: "Albert Park Grand Prix Circuit, Melbourne",
    credit: "Tom Reynolds, CC BY 2.0",
  },
  {
    slug: "brabham-grandstand-turns-1-2-mu9c1dch",
    file: "Images/Aus GP/Australian GP - Brabham Grandstand Tom Reynolds CC BY 2.0.jpg",
    alt: "Brabham Grandstand at Albert Park, Turns 1 & 2",
    credit: "Tom Reynolds, CC BY 2.0",
  },
  {
    slug: "f1-paddock-club-trackside-hospitality-mu9c506w",
    file: "Images/Aus GP/Australian GP - F1 Paddock Club & Trackside Hospitality Representative Image.jpg",
    alt: "F1 Paddock Club hospitality suite, trackside",
    credit: "Representative image",
  },
  {
    slug: "fan-zone-melbourne-walk-fan-forum-mu9cfep3",
    file: "Images/Aus GP/Australian GP - Fan Zone — Melbourne Walk & Fan Forum Yu Chu Chin CC BY 4.0.jpg",
    alt: "Fan Zone at Melbourne Walk during the Australian Grand Prix",
    credit: "Yu Chu Chin, CC BY 4.0",
  },
  {
    slug: "fangio-grandstand-albert-park-mu9bxaeb",
    file: "Images/Aus GP/Australian GP - Fangio Grandstand Tom Reynolds CC BY 2.0.jpg",
    alt: "Fangio Grandstand at Albert Park, opposite the pit straight",
    credit: "Tom Reynolds, CC BY 2.0",
  },
  {
    slug: "first-timers-guide-albert-park-mu9cdxo6",
    file: "Images/Aus GP/Australian GP - First Timer's Guide — Etiquette & Crowd Culture Yu Chu Chin CC BY 4.0.jpg",
    alt: "Crowd at Albert Park during the Australian Grand Prix",
    credit: "Yu Chu Chin, CC BY 4.0",
  },
  {
    slug: "general-admission-park-pass-hills-mu9c2qyt",
    file: "Images/Aus GP/Australian GP - General Admission Wild Horses CC BY 2.0.jpg",
    alt: "General admission hill viewing area at Albert Park",
    credit: "Wild Horses, CC BY 2.0",
  },
  {
    slug: "lakeside-festival-albert-park-mu9cgpaz",
    file: "Images/Aus GP/Australian GP - Lakeside Concert Representative Image.jpg",
    alt: "Lakeside Festival concert stage at Albert Park",
    credit: "Representative image",
  },
  {
    slug: "melbourne-april-weather-what-to-pack-mu9c9btl",
    file: "Images/Aus GP/Australian GP - Melbourne in April Weather & What to Pack Dietmar Rabich CC BY 4.0.jpg",
    alt: "Melbourne in April, autumn shoulder season",
    credit: "Dietmar Rabich, CC BY 4.0",
  },
  {
    slug: "piastri-grandstand-albert-park-mu9bykxi",
    file: "Images/Aus GP/Australian GP - Piastri Grandstand Representative Image.jpg",
    alt: "Piastri Grandstand at Albert Park",
    credit: "Representative image",
  },
  {
    slug: "ausgp-ticket-guide-grandstands-park-pass-mu9ccj0n",
    file: "Images/Aus GP/Australian GP - Ticket Guide — Park Pass, Grandstands & Hospitality Tom Reynolds CC BY 2.0.jpg",
    alt: "Grandstand seating at Albert Park Grand Prix Circuit",
    credit: "Tom Reynolds, CC BY 2.0",
  },
  {
    slug: "vettel-stand-turns-11-12-mu9bzrti",
    file: "Images/Aus GP/Australian GP - Vettel Grandstand Representative Image.jpg",
    alt: "Vettel Stand at Albert Park, Turns 11 & 12",
    credit: "Representative image",
  },
];

for (const img of IMAGES) {
  try {
    const file = readFileSync(img.file);
    const imageKey = `experiences/hero/${img.slug}.jpg`;
    await r2.send(new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: imageKey,
      Body: file,
      ContentType: "image/jpeg",
    }));
    const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

    const [result] = await sql`
      UPDATE experiences
      SET hero_image_url = ${heroImageUrl}, hero_image_alt = ${img.alt}, hero_image_credit = ${img.credit}
      WHERE slug = ${img.slug}
      RETURNING slug, hero_image_url, status
    `;

    if (!result) {
      console.error(`✗ No experience found for slug ${img.slug}`);
      continue;
    }
    console.log(`✓ ${result.slug} (${result.status})`);
  } catch (e) {
    console.error(`✗ ${img.slug}: ${e.message}`);
  }
}

await sql.end();
