import { config } from "dotenv";
config({ path: ".env.local" });
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";

// Uploads the 3 approved Arena Maps (RLA/MCA/JCA seating diagrams) to R2.
// Same inline-client pattern as upload-ao2027-ticket-images.mjs — lib/r2.ts
// reads process.env at module-eval time, before dotenv's config() can run,
// due to ESM import hoisting.

const EXTRACT_DIR = process.argv[2];
if (!EXTRACT_DIR) {
  console.error("Usage: node upload-ao2027-arena-maps.mjs <path-to-extracted-ZIP-dir>");
  process.exit(1);
}

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
  return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`;
}

const manifest = JSON.parse(fs.readFileSync(path.join(EXTRACT_DIR, "manifest.json"), "utf8"));
const NAMESPACE = "tennis-ticket-intelligence/australian-open/2027/arena-maps";

const results = [];
for (const f of manifest.files) {
  const localPath = path.join(EXTRACT_DIR, f.file);
  const bytes = fs.readFileSync(localPath);

  const actualHash = crypto.createHash("sha256").update(bytes).digest("hex");
  if (actualHash !== f.sha256) {
    throw new Error(`Checksum mismatch for ${f.file}: manifest says ${f.sha256}, actual is ${actualHash}`);
  }

  const key = `${NAMESPACE}/${f.file}`;
  await r2.send(new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: bytes, ContentType: "image/png" }));

  const getResult = await r2.send(new GetObjectCommand({ Bucket: R2_BUCKET, Key: key }));
  const chunks = [];
  for await (const chunk of getResult.Body) chunks.push(chunk);
  const downloadedBytes = Buffer.concat(chunks);
  const downloadedHash = crypto.createHash("sha256").update(downloadedBytes).digest("hex");

  const publicUrl = getPublicUrl(key);
  const verified = downloadedHash === f.sha256 && downloadedBytes.length === f.bytes;

  results.push({ arena: f.arena, file: f.file, key, publicUrl, sha256: f.sha256, verified });
  console.log(`${verified ? "✓" : "✗ FAILED"} ${f.arena} (${f.file}) -> ${publicUrl}`);
}

const allVerified = results.every((r) => r.verified);
console.log(`\n${results.filter((r) => r.verified).length}/${results.length} arena maps uploaded and checksum-verified.`);

fs.writeFileSync(path.join(EXTRACT_DIR, "_upload-results.json"), JSON.stringify({ namespace: NAMESPACE, results }, null, 2));
console.log(`Upload results written to ${path.join(EXTRACT_DIR, "_upload-results.json")}`);

if (!allVerified) {
  console.error("One or more uploads failed verification.");
  process.exit(1);
}
