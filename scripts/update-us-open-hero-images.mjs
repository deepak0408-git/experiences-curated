import { config } from "dotenv";
config({ path: ".env.local" });

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

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const images = [
  {
    title: "Arthur Ashe Stadium",
    photoId: 10277945,
    key: "experiences/hero/us-open-arthur-ashe.jpg",
    alt: "Arthur Ashe Stadium at the USTA Billie Jean King National Tennis Center, Flushing",
  },
  {
    title: "The Night Sessions",
    photoId: 9229498,
    key: "experiences/hero/us-open-night-sessions.jpg",
    alt: "Night tennis under floodlights at the US Open, Flushing Meadows",
  },
  {
    title: "Louis Armstrong Stadium",
    photoId: 2815207,
    key: "experiences/hero/us-open-louis-armstrong.jpg",
    alt: "Louis Armstrong Stadium at the US Open, USTA Billie Jean King National Tennis Center",
  },
  {
    title: "Morning at the Practice Facility",
    photoId: 33436529,
    key: "experiences/hero/us-open-practice-facility.jpg",
    alt: "Tennis practice courts at the US Open grounds, Flushing Meadows",
  },
  {
    title: "The Food Concourse at Flushing",
    photoId: 2466407,
    key: "experiences/hero/us-open-food-concourse.jpg",
    alt: "Food vendors and concourse at the US Open, Flushing Meadows",
  },
  {
    title: "When Play Stops",
    photoId: 3766107,
    key: "experiences/hero/us-open-rain-delay.jpg",
    alt: "Rain delay at the US Open, covered courts at Flushing Meadows",
  },
  {
    title: "The 7 Train to Flushing",
    photoId: 34545412,
    key: "experiences/hero/us-open-7-train.jpg",
    alt: "The 7 subway train to Flushing, Queens, New York",
  },
  {
    title: "The US Open Briefing",
    photoId: 8223992,
    key: "experiences/hero/us-open-briefing.jpg",
    alt: "US Open grounds guide — bags, tickets, and getting around Flushing Meadows",
  },
  {
    title: "Flushing's Golden Mall",
    photoId: 7363686,
    key: "experiences/hero/us-open-golden-mall.jpg",
    alt: "Golden Mall basement food court in Flushing, Queens — Chinese regional cuisine",
  },
  {
    title: "Jackson Heights: The Food Mile",
    photoId: 30563089,
    key: "experiences/hero/us-open-jackson-heights.jpg",
    alt: "Jackson Heights, Queens — South Asian and Latin American food street",
  },
  {
    title: "Where to Stay for the US Open",
    photoId: 15087271,
    key: "experiences/hero/us-open-where-to-stay.jpg",
    alt: "Hotel in Queens or Manhattan near the US Open, Flushing Meadows",
  },
  {
    title: "Flushing Meadows-Corona Park",
    photoId: 17071499,
    key: "experiences/hero/us-open-corona-park.jpg",
    alt: "Flushing Meadows-Corona Park, Queens, with Unisphere globe sculpture",
  },
  {
    title: "Queens: A Day Beyond the Courts",
    photoId: 3586966,
    key: "experiences/hero/us-open-queens-day.jpg",
    alt: "Queens, New York — diverse neighborhoods, street food, and culture beyond the US Open",
  },
];

for (const { title, photoId, key, alt } of images) {
  const pexelsUrl = `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`;

  // 1 — download from Pexels
  let imageBuffer;
  try {
    const res = await fetch(pexelsUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    imageBuffer = Buffer.from(await res.arrayBuffer());
  } catch (err) {
    console.error(`✗ [${title}] Download failed: ${err.message}`);
    continue;
  }

  // 2 — upload to R2
  const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;
  try {
    await r2.send(new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
      Body: imageBuffer,
      ContentType: "image/jpeg",
    }));
  } catch (err) {
    console.error(`✗ [${title}] R2 upload failed: ${err.message}`);
    continue;
  }

  // 3 — update DB
  const result = await sql`
    UPDATE experiences
    SET hero_image_url = ${publicUrl}, hero_image_alt = ${alt}
    WHERE title = ${title}
    RETURNING id, title, hero_image_url
  `;

  if (result.length) {
    console.log(`✓ [${title}]`);
    console.log(`    ${publicUrl}`);
  } else {
    console.log(`⚠ [${title}] DB row not found — uploaded to R2 but DB not updated`);
  }
}

await sql.end();
console.log("\nDone.");
