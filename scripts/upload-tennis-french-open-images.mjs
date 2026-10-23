import { config } from "dotenv";
config({ path: ".env.local" });
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import postgres from "postgres";

// Uploads the 23 approved French Open 2027 Ticket Intelligence experience
// images and the 4 Roland-Garros court seating maps to R2, then updates
// tennis_ticket_intelligence_options.hero_image for all 87 option rows per
// the approved image-mapping CSV.
//
// IMPORTANT — image sourcing disclosure (per founder decision, 22 Oct
// 2026): the 23 "approved" experience images in the implementation
// package are AI-generated, not real photography — confirmed by the
// package's own image_mapping.csv original_source_filename column (e.g.
// "wide_cinematic_night_time_stadium_scene_a_large.png" — a truncated
// AI-image-generation prompt, not a camera/stock filename). The founder
// explicitly approved uploading them as knowingly AI-generated
// illustrative placeholders. They are labeled as such on the results page
// (ResultCard.tsx's existing "Illustrative arena view — actual seating
// perspective may vary" caption, unchanged) — this script does not alter
// that disclosure, it only uploads the already-approved files.
//
// The 4 seating maps are the real, original user-supplied Roland-Garros
// category maps (not AI-generated) — verified visually during discovery.
//
// Idempotent: re-running overwrites the same deterministic R2 keys with
// the same file content (SHA-256-identical source files), and only
// updates hero_image on French Open's own option rows (sporting_event_id
// filter), never touching Australian Open's.

const dir = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = "C:/Users/HP/AppData/Local/Temp/claude/c--Users-HP--claude-projects-ExperienceCurator/3ecacd66-dd82-41c3-ac50-b7a7c46383e6/scratchpad/rg27_extract";
const FRENCH_OPEN_EVENT_ID = "e6f2b585-196e-4842-8648-753a40979f4f";

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

function parseCsv(file) {
  const content = fs.readFileSync(file, "utf8").trim();
  const lines = content.split(/\r?\n/);
  function parseLine(line) {
    const out = [];
    let cur = "";
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (inQ) {
        if (c === '"') {
          if (line[i + 1] === '"') {
            cur += '"';
            i++;
          } else inQ = false;
        } else cur += c;
      } else {
        if (c === '"') inQ = true;
        else if (c === ",") {
          out.push(cur);
          cur = "";
        } else cur += c;
      }
    }
    out.push(cur);
    return out;
  }
  const header = parseLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cells = parseLine(line);
    const row = {};
    header.forEach((h, i) => (row[h] = cells[i] ?? ""));
    return row;
  });
}

const imageRows = parseCsv(path.join(dir, "_rg27-source", "image_mapping.csv"));

console.log(`Uploading ${23} approved experience images...`);
const imageUrlByFilename = new Map();
for (let n = 1; n <= 23; n++) {
  const filename = `RG27_Image_${String(n).padStart(2, "0")}.png`;
  const localPath = path.join(PACKAGE_ROOT, "Approved_Images", filename);
  const r2Key = `tennis-ticket-intelligence/french-open/2027/options/${filename}`;
  const url = await uploadLocal(localPath, r2Key);
  imageUrlByFilename.set(filename, url);
  console.log(`  ${filename} -> ${url}`);
}

console.log("\nUploading 4 seating maps...");
const SEATING_MAPS = [
  { local: "philippe-chatrier.png", key: "RG2027_philippe-chatrier_seating_map.png" },
  { local: "suzanne-lenglen.png", key: "RG2027_suzanne-lenglen_seating_map.png" },
  { local: "simonne-mathieu.png", key: "RG2027_simonne-mathieu_seating_map.png" },
  { local: "court-14.png", key: "RG2027_court-14_seating_map.png" },
];
for (const m of SEATING_MAPS) {
  const localPath = path.join(PACKAGE_ROOT, "Seating_Maps", m.local);
  const r2Key = `tennis-ticket-intelligence/french-open/2027/arena-maps/${m.key}`;
  const url = await uploadLocal(localPath, r2Key);
  console.log(`  ${m.local} -> ${url}`);
}

console.log("\nUpdating hero_image on all 87 French Open option rows...");
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

let updated = 0;
let missing = 0;
for (const row of imageRows) {
  const optionNumber = parseInt(row.experience_id, 10);
  const url = imageUrlByFilename.get(row.image_filename);
  if (!url) {
    console.error(`  MISSING uploaded URL for option ${optionNumber} (${row.image_filename})`);
    missing++;
    continue;
  }
  await sql`
    UPDATE tennis_ticket_intelligence_options
    SET hero_image = ${url}
    WHERE sporting_event_id = ${FRENCH_OPEN_EVENT_ID} AND option_number = ${optionNumber}
  `;
  updated++;
}
console.log(`hero_image updated on ${updated} rows, ${missing} missing.`);

const [{ count: withImage }] = await sql`
  SELECT count(*)::int AS count FROM tennis_ticket_intelligence_options
  WHERE sporting_event_id = ${FRENCH_OPEN_EVENT_ID} AND hero_image IS NOT NULL
`;
console.log(`French Open rows with hero_image set: ${withImage} / 87`);

const [{ count: aoWithImage }] = await sql`
  SELECT count(*)::int AS count FROM tennis_ticket_intelligence_options
  WHERE sporting_event_id = '1ced8699-d5ce-49fb-add4-6ebc6f251ec6' AND hero_image IS NOT NULL
`;
console.log(`Australian Open rows with hero_image (should be unchanged from before this script ran): ${aoWithImage}`);

await sql.end();
