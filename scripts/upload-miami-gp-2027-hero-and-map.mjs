import { config } from "dotenv";
config({ path: ".env.local" });

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync } from "fs";
import postgres from "postgres";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const EVENT_ID = "048d7693-b616-4747-ab3c-49b3de61a025"; // Miami GP 2027

// Hero image — CC BY 4.0, credit: Bassfish22. Hard Rock Stadium grandstands
// with cars on track, verified visually 28 Sep 2026.
const HERO_LOCAL = "Images/Miami GP - Hero Image Bassfish22 CC BY 4.0.jpg";
const HERO_KEY = "sporting-events/hero/miami-grand-prix-2027.jpg";

// Circuit map — CC BY 4.0, credit: Dh16dh. 19-turn Miami International
// Autodrome layout, verified visually 28 Sep 2026.
const MAP_LOCAL = "Images/Miami GP - Circuit Map Dh16dh CC BY 4.0.jpg";
const MAP_KEY = "sporting-events/hero/miami-grand-prix-2027-map.jpg";

async function upload(localFile, key, contentType) {
  const body = readFileSync(localFile);
  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  }));
  const url = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${encodeURIComponent(key).replace(/%2F/g, "/")}`;
  console.log(`Uploaded: ${url}`);
  return url;
}

const heroUrl = await upload(HERO_LOCAL, HERO_KEY, "image/jpeg");
const mapUrl = await upload(MAP_LOCAL, MAP_KEY, "image/jpeg");

// Update sportingEvents.heroImageUrl
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
await sql`
  UPDATE sporting_events
  SET hero_image_url = ${heroUrl}, updated_at = NOW()
  WHERE id = ${EVENT_ID}
`;
console.log(`\nsporting_events.hero_image_url set to: ${heroUrl}`);
console.log(`\nCircuit map URL (for CIRCUIT_MAP_BY_EVENT in FullResult.tsx): ${mapUrl}`);
console.log(`Credit: Dh16dh, CC BY 4.0`);

await sql.end();
