import { config } from "dotenv";
config({ path: ".env.local" });
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";

// Constructed inline (not imported from lib/r2.ts) — same pattern as
// scripts/archive-*.mjs. lib/r2.ts reads process.env at module-eval time,
// which happens before this script's config() call due to ESM import
// hoisting, producing an empty R2_BUCKET. Reading process.env here,
// after config() has actually run, avoids that.
const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});
const R2_BUCKET = process.env.CLOUDFLARE_R2_BUCKET_NAME;
function getPublicUrl(key) {
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL.replace(/\/$/, "");
  return `${base}/${key}`;
}

// Uploads the 12 approved AO2027 Tennis Ticket Intelligence placeholder
// images to R2. Source: AO2027_Tennis_Ticket_Images_LOCKED.zip, extracted
// to an isolated temp dir (never run from inside the extracted dir itself
// — this script lives in scripts/, reads from the temp path as an
// argument). Repeatable/idempotent: re-running re-verifies and re-uploads
// identical bytes to the same stable key, never creating a duplicate.

const EXTRACT_DIR = process.argv[2];
if (!EXTRACT_DIR) {
  console.error("Usage: node upload-ao2027-ticket-images.mjs <path-to-extracted-ZIP-dir>");
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(path.join(EXTRACT_DIR, "manifest.json"), "utf8"));
const NAMESPACE = "tennis-ticket-intelligence/australian-open/2027";

const results = [];
for (const img of manifest.images) {
  const localPath = path.join(EXTRACT_DIR, img.filename);
  const bytes = fs.readFileSync(localPath);

  const actualHash = crypto.createHash("sha256").update(bytes).digest("hex");
  if (actualHash !== img.sha256) {
    throw new Error(`Checksum mismatch for ${img.filename}: manifest says ${img.sha256}, actual is ${actualHash}`);
  }

  const key = `${NAMESPACE}/${path.basename(img.filename)}`;
  await r2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: bytes,
      ContentType: "image/png",
    })
  );

  // Verify retrievable + byte-identical, not just "upload didn't throw".
  const getResult = await r2.send(new GetObjectCommand({ Bucket: R2_BUCKET, Key: key }));
  const downloadedChunks = [];
  for await (const chunk of getResult.Body) downloadedChunks.push(chunk);
  const downloadedBytes = Buffer.concat(downloadedChunks);
  const downloadedHash = crypto.createHash("sha256").update(downloadedBytes).digest("hex");

  const publicUrl = getPublicUrl(key);
  const verified = downloadedHash === img.sha256 && downloadedBytes.length === img.size_bytes;

  results.push({
    imageNumber: img.image_number,
    key,
    publicUrl,
    sha256: img.sha256,
    uploadedBytes: downloadedBytes.length,
    expectedBytes: img.size_bytes,
    verified,
  });

  console.log(`${verified ? "✓" : "✗ FAILED"} image #${img.image_number} -> ${publicUrl}`);
}

const allVerified = results.every((r) => r.verified);
console.log(`\n${results.filter((r) => r.verified).length}/${results.length} images uploaded and checksum-verified.`);

fs.writeFileSync(
  path.join(EXTRACT_DIR, "_upload-results.json"),
  JSON.stringify({ namespace: NAMESPACE, results }, null, 2)
);
console.log(`Upload results written to ${path.join(EXTRACT_DIR, "_upload-results.json")}`);

if (!allVerified) {
  console.error("One or more uploads failed verification — see above.");
  process.exit(1);
}
