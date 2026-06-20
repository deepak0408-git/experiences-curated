import { S3Client, ListObjectsV2Command, CopyObjectCommand } from "@aws-sdk/client-s3";
import postgres from "postgres";

const ACCOUNT_ID = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
const ACCESS_KEY = process.env.NEW_R2_ACCESS_KEY_ID ?? process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const SECRET_KEY = process.env.NEW_R2_SECRET_ACCESS_KEY ?? process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const OLD_BUCKET = "experience-curator-media";
const NEW_BUCKET = "experience-curator-media-eu";
const OLD_PUBLIC_URL = "https://pub-54336f49677b40e28b803aeff2aca3c2.r2.dev";
const NEW_PUBLIC_URL = "https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY },
});

// 1. List all objects in old bucket
console.log("Listing objects in old bucket...");
const objects = [];
let continuationToken;
do {
  const res = await r2.send(new ListObjectsV2Command({
    Bucket: OLD_BUCKET,
    ContinuationToken: continuationToken,
  }));
  objects.push(...(res.Contents ?? []));
  continuationToken = res.NextContinuationToken;
} while (continuationToken);

console.log(`Found ${objects.length} objects to copy`);

// 2. Copy each object to new bucket
let copied = 0;
for (const obj of objects) {
  await r2.send(new CopyObjectCommand({
    Bucket: NEW_BUCKET,
    Key: obj.Key,
    CopySource: `${OLD_BUCKET}/${obj.Key}`,
  }));
  copied++;
  process.stdout.write(`\r  Copied ${copied}/${objects.length}: ${obj.Key}`);
}
console.log("\n✓ All objects copied");

// 3. Update DB URLs
const sql = postgres(process.env.DATABASE_URL, { max: 1 });

const expResult = await sql`
  UPDATE experiences
  SET hero_image_url = REPLACE(hero_image_url, ${OLD_PUBLIC_URL}, ${NEW_PUBLIC_URL})
  WHERE hero_image_url LIKE ${OLD_PUBLIC_URL + "%"}
`;
console.log(`✓ Updated ${expResult.count} experience hero_image_url records`);

const eventResult = await sql`
  UPDATE sporting_events
  SET hero_image_url = REPLACE(hero_image_url, ${OLD_PUBLIC_URL}, ${NEW_PUBLIC_URL})
  WHERE hero_image_url LIKE ${OLD_PUBLIC_URL + "%"}
`;
console.log(`✓ Updated ${eventResult.count} sporting_event hero_image_url records`);

await sql.end();
console.log("\nDone! Now update env vars:");
console.log("  CLOUDFLARE_R2_BUCKET_NAME=experience-curator-media-eu");
console.log(`  NEXT_PUBLIC_R2_PUBLIC_URL=${NEW_PUBLIC_URL}`);
