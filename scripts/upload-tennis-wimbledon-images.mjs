import { config } from "dotenv";
config({ path: ".env.local" });
import fs from "node:fs";
import path from "node:path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import postgres from "postgres";

// Uploads the 9 approved Wimbledon 2027 Ticket Intelligence experience
// photographs and the 4 seating maps to R2, then updates
// tennis_ticket_intelligence_options.hero_image for all 25 option rows per
// the approved image mapping in assets/PHOTO_OPTION_MANIFEST.json.
//
// IMPORTANT — image sourcing disclosure (per founder decision, 25 Oct
// 2026): the 9 "approved photographs" in the implementation package are
// AI-generated, not real photography — confirmed by the package's own
// audit/CONFIRMED_CANDIDATES.json "file" column (e.g.
// "wide_crisp_photorealistic_sports_stadium_scene.png" — a truncated
// AI-image-generation prompt, not a camera/stock filename), and every
// entry in assets/PHOTO_OPTION_MANIFEST.json carries an
// "approved_generation_id" (an AI generation job ID) rather than a
// photo-license/credit field. The founder explicitly approved uploading
// them as knowingly AI-generated illustrative placeholders — same
// disclosure pattern and founder call as French Open's identical image
// sourcing (see upload-tennis-french-open-images.mjs's header comment).
// They are labeled as such on the results page (ResultCard.tsx's existing
// "Illustrative arena view — actual seating perspective may vary."
// caption, unchanged) — this script does not alter that disclosure, it
// only uploads the already-approved files.
//
// The 4 seating maps are credited per the approved package to the All
// England Lawn Tennis Club, Wimbledon.com (ArenaMapsSection.tsx renders
// this attribution for the "wimbledon" slug specifically) — per the
// founder's explicit 25 Oct 2026 direction, this script uploads them
// as-is with that exact credit line rendered, same as the approved
// package instructs.
//
// Idempotent: re-running overwrites the same deterministic R2 keys with
// the same file content (SHA-256-identical source files, verified against
// audit/SHA256_MANIFEST.json before this script was written), and only
// updates hero_image on Wimbledon's own option rows (sporting_event_id
// filter), never touching Australian Open's or French Open's.

const WIMBLEDON_EVENT_ID = "8bb7090e-1ec7-4c3f-b4e2-7fd6bf9942cf";
const PACKAGE_ROOT =
  "C:/Users/HP/AppData/Local/Temp/claude/c--Users-HP--claude-projects-ExperienceCurator/70194cfc-eada-4e86-b5c3-2f9900cbaa56/scratchpad/wimbledon_pkg/Wimbledon_2027_FINAL_Developer_Handoff";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

async function uploadLocal(localPath, r2Key, contentType = "image/png") {
  const file = fs.readFileSync(localPath);
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

const photoManifest = JSON.parse(fs.readFileSync(path.join(PACKAGE_ROOT, "assets/PHOTO_OPTION_MANIFEST.json"), "utf8"));
if (photoManifest.length !== 9) throw new Error(`Expected 9 photo groups, found ${photoManifest.length}`);

console.log("Uploading 9 approved experience photographs...");
const imageUrlByGroup = new Map();
for (const p of photoManifest) {
  const localPath = path.join(PACKAGE_ROOT, p.file);
  const r2Key = `tennis-ticket-intelligence/wimbledon/2027/options/${p.group}.png`;
  const url = await uploadLocal(localPath, r2Key);
  imageUrlByGroup.set(p.group, url);
  console.log(`  ${p.group} (options ${p.option_numbers.join(",")}) -> ${url}`);
}

console.log("\nUploading 4 seating maps...");
const SEATING_MAPS = [
  { local: "assets/seating_maps/FINAL_Centre_Court.png", key: "WIM2027_centre-court_seating_map.png" },
  { local: "assets/seating_maps/FINAL_No1_Court.png", key: "WIM2027_no1-court_seating_map.png" },
  { local: "assets/seating_maps/FINAL_No2_Court.png", key: "WIM2027_no2-court_seating_map.png" },
  { local: "assets/seating_maps/FINAL_No3_Court.png", key: "WIM2027_no3-court_seating_map.png" },
];
for (const m of SEATING_MAPS) {
  const localPath = path.join(PACKAGE_ROOT, m.local);
  const r2Key = `tennis-ticket-intelligence/wimbledon/2027/arena-maps/${m.key}`;
  const url = await uploadLocal(localPath, r2Key);
  console.log(`  ${m.local} -> ${url}`);
}

console.log("\nUpdating hero_image on all 25 Wimbledon option rows...");
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

let updated = 0;
let missing = 0;
for (const p of photoManifest) {
  const url = imageUrlByGroup.get(p.group);
  if (!url) {
    console.error(`  MISSING uploaded URL for group ${p.group}`);
    missing += p.option_numbers.length;
    continue;
  }
  for (const optionNumber of p.option_numbers) {
    await sql`
      UPDATE tennis_ticket_intelligence_options
      SET hero_image = ${url}
      WHERE sporting_event_id = ${WIMBLEDON_EVENT_ID} AND option_number = ${optionNumber}
    `;
    updated++;
  }
}
console.log(`hero_image updated on ${updated} rows, ${missing} missing.`);

const [{ count: withImage }] = await sql`
  SELECT count(*)::int AS count FROM tennis_ticket_intelligence_options
  WHERE sporting_event_id = ${WIMBLEDON_EVENT_ID} AND hero_image IS NOT NULL
`;
console.log(`Wimbledon rows with hero_image set: ${withImage} / 25`);

const [{ count: aoWithImage }] = await sql`
  SELECT count(*)::int AS count FROM tennis_ticket_intelligence_options
  WHERE sporting_event_id = '1ced8699-d5ce-49fb-add4-6ebc6f251ec6' AND hero_image IS NOT NULL
`;
console.log(`Australian Open rows with hero_image (should be unchanged): ${aoWithImage}`);

const [{ count: rgWithImage }] = await sql`
  SELECT count(*)::int AS count FROM tennis_ticket_intelligence_options
  WHERE sporting_event_id = 'e6f2b585-196e-4842-8648-753a40979f4f' AND hero_image IS NOT NULL
`;
console.log(`French Open rows with hero_image (should be unchanged): ${rgWithImage}`);

await sql.end();
