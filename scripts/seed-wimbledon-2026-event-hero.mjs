import { config } from "dotenv";
config({ path: ".env.local" });

import { readFileSync } from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import postgres from "postgres";
import { revalidateCacheTags } from "./_lib/revalidate-cache.mjs";
import { CACHE_TAGS } from "./_lib/cache-tags.mjs";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const sql = postgres(process.env.DIRECT_URL);

// Replaces Wimbledon 2026/27's event-level hero image (sporting_events.hero_image_url)
// with the founder-supplied "Wimbledon New Hero" image, 24 Oct 2026. Same
// pattern as seed-austrian-gp-2027-event-hero.mjs. Wimbledon is a
// hub_and_spoke-format event, so this also busts getSpokeData's cache —
// without that, the new hero would sit behind the 1-hour unstable_cache
// window on the live hub page and every spoke (see
// feedback_unstable_cache_tags_and_revalidation memory).
const EVENT_SLUG = "wimbledon";
const localFile = "Images/Wimbledon New Hero.jpeg";
const imageKey = "sporting-events/hero/wimbledon-2026-new-hero.jpg";

const file = readFileSync(localFile);
await r2.send(new PutObjectCommand({
  Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  Key: imageKey,
  Body: file,
  ContentType: "image/jpeg",
}));
const heroImageUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${imageKey}`;

const [result] = await sql`
  UPDATE sporting_events SET hero_image_url = ${heroImageUrl} WHERE slug = ${EVENT_SLUG}
  RETURNING slug, hero_image_url
`;

console.log(`✓ ${result.slug}`);
console.log(`  R2 key: ${imageKey}`);
console.log(`  hero_image_url: ${result.hero_image_url}`);

await sql.end();

await revalidateCacheTags([CACHE_TAGS.HUB_AND_SPOKE_SPOKE_DATA]);
