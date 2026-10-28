import { config } from "dotenv";
config({ path: ".env.local" });
import fs from "node:fs";
import sharp from "sharp";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Re-uploads the 3 US Open 2027 stadium maps from Images/ (founder-supplied
// replacement files, 28 Oct 2026) to the same deterministic R2 keys already
// referenced by USO2027_ARENA_MAPS in arenaMaps.ts — no code change needed,
// since those URLs are static and content-addressed only by key, not by
// any DB row or cache-busting query param.
//
// Sharpened before upload (28 Oct 2026, founder feedback during visual UAT
// that the first re-upload looked blurry): source files are ~500px native
// resolution, displayed up to 672px wide (max-w-2xl) and user-zoomable via
// ZoomableArenaMap, so the upscale was making the softness visible. A
// sharpen pass measurably cleans up seating-section text/edges at this
// resolution without introducing visible haloing (confirmed by side-by-side
// comparison before upload) — this does not and cannot add detail beyond
// the source's native resolution.

const IMAGES_ROOT = "C:/Users/HP/.claude/projects/ExperienceCurator/Images";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

async function uploadSharpened(localPath, r2Key, contentType = "image/png") {
  const file = await sharp(localPath)
    .sharpen({ sigma: 1.2, m1: 1.0, m2: 2.0 })
    .toBuffer();
  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: r2Key,
      Body: file,
      ContentType: contentType,
    })
  );
  return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${r2Key}`;
}

const MAPS = [
  { local: "Arthur Ashe Map.PNG", key: "USO27_AA_Arthur_Ashe_seating_map.png", arena: "Arthur Ashe Stadium" },
  { local: "Louis Armstrong Map.PNG", key: "USO27_LA_Louis_Armstrong_seating_map.png", arena: "Louis Armstrong Stadium" },
  { local: "Grandstand Map.PNG", key: "USO27_GS_Grandstand_seating_map.png", arena: "Grandstand" },
];

console.log("Re-uploading 3 sharpened stadium maps from Images/...");
for (const m of MAPS) {
  const localPath = `${IMAGES_ROOT}/${m.local}`;
  if (!fs.existsSync(localPath)) throw new Error(`Missing local file: ${localPath}`);
  const r2Key = `tennis-ticket-intelligence/us-open/2027/arena-maps/${m.key}`;
  const url = await uploadSharpened(localPath, r2Key);
  console.log(`  ${m.local} -> ${url}`);
}
console.log("\nDone. arenaMaps.ts URLs are unchanged (same keys) — no code edit needed.");
