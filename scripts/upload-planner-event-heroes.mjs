import { config } from "dotenv";
config({ path: ".env.local" });

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import postgres from "postgres";
import { readFileSync } from "fs";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const UPLOADS = [
  { eventId: "c2bc1d6c-19ab-4d8c-9002-cb41d48a35de", file: "Images/South Africa Eng.jpg", key: "sporting-events/hero/england-in-south-africa-cricket-2026-27.jpg" },
  { eventId: "48aa4415-f6a2-4867-b390-eb6b28b6903b", file: "Images/Singapore GP.jpg", key: "sporting-events/hero/singapore-gp-2026.jpg" },
  { eventId: "cd5785a7-d37c-4d4b-a545-a8b8e28eac57", file: "Images/Las Vegas.jpg", key: "sporting-events/hero/las-vegas-gp-2026.jpg" },
  { eventId: "1ced8699-d5ce-49fb-add4-6ebc6f251ec6", file: "Images/Aus Open.jpg", key: "sporting-events/hero/australian-open-2027.jpg" },
  { eventId: "ecda0640-72bb-47bc-a8da-02eb2d1d5646", file: "Images/Alfred Dunhill.jpg", key: "sporting-events/hero/alfred-dunhill-links-2026.jpg" },
  { eventId: "8f45cb75-f205-458b-8f31-48551e6d7cb8", file: "Images/Abu Dhabi Grand Prix.jpg", key: "sporting-events/hero/abu-dhabi-gp-2026.jpg" },
  { eventId: "8e4d5aac-f472-48ac-b515-d253487cda50", file: "Images/Nitto ATP.jpg", key: "sporting-events/hero/atp-finals-2026.jpg" },
];

for (const u of UPLOADS) {
  const file = readFileSync(u.file);
  await r2.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    Key: u.key,
    Body: file,
    ContentType: "image/jpeg",
  }));

  const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${u.key}`;
  await client`UPDATE sporting_events SET hero_image_url = ${heroImageUrl} WHERE id = ${u.eventId}`;
  console.log(`✓ ${u.file} -> ${heroImageUrl}`);
}

const rows = await client`
  SELECT name, slug, hero_image_url FROM sporting_events
  WHERE id IN ${client(UPLOADS.map((u) => u.eventId))}
  ORDER BY name
`;
console.table(rows);

await client.end();
