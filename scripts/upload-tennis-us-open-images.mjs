import { config } from "dotenv";
config({ path: ".env.local" });
import fs from "node:fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import postgres from "postgres";

// Uploads the 12 approved US Open 2027 Ticket Intelligence option images
// and the 3 stadium maps to R2, then updates
// tennis_ticket_intelligence_options.hero_image for all 31 option rows per
// the approved mapping in 02_visual_assets/phase2_approved/
// Approved_31_Option_Image_Mapping.csv (local copy:
// scripts/_uso27-source/image_mapping.csv).
//
// IMPORTANT — image sourcing disclosure (per the handoff package's own
// Phase 2 README, carried forward the same way Wimbledon's and French
// Open's AI-generated-image disclosures were): these 12 images are
// AI-generated illustrative renders, not real photography. The package's
// own provenance caveat is stronger than Wimbledon's: only 4 of the 12
// (images 9-12) are matched to exact generation-ID output filenames; the
// other 8 (1-8) were selected by visual comparison to approved
// descriptions and "cannot be independently authenticated as exact
// generation IDs from PNG metadata alone" (Phase 2 README's own words).
// They are labeled as illustrative on the results page (ResultCard.tsx's
// existing "Illustrative arena view — actual seating perspective may
// vary." caption, unchanged, slug-agnostic) — this script does not alter
// that disclosure, it only uploads the already-supplied files.
//
// The 3 stadium maps are marked FOUNDER_APPROVED in
// Stadium_Map_Mapping_APPROVED.csv, with no attribution/credit field
// (unlike Wimbledon's All England Lawn Tennis Club credit) — no
// attribution line is wired for US Open's ArenaMapsSection entry.
//
// Idempotent: re-running overwrites the same deterministic R2 keys with
// the same file content, and only updates hero_image on US Open's own
// option rows (sporting_event_id filter), never touching AO/French
// Open/Wimbledon's.

const US_OPEN_EVENT_ID = "91f298a3-ca22-49c3-9c8e-5a200f0026c9";
const PACKAGE_ROOT = "C:/Users/HP/AppData/Local/Temp/uso27_unpack/02_visual_assets/phase2_approved";
const MAPS_ROOT = "C:/Users/HP/AppData/Local/Temp/uso27_unpack/02_visual_assets/stadium_maps";

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

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") {
        row.push(field);
        field = "";
      } else if (c === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else if (c === "\r") {
        // skip
      } else field += c;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  const header = rows[0];
  return rows.slice(1).filter((r) => r.length > 1).map((cells) => {
    const obj = {};
    header.forEach((h, i) => (obj[h] = cells[i] ?? ""));
    return obj;
  });
}

const mapping = parseCsv(fs.readFileSync(`${PACKAGE_ROOT}/Approved_31_Option_Image_Mapping.csv`, "utf8"));
if (mapping.length !== 31) throw new Error(`Expected 31 option->image mappings, found ${mapping.length}`);

console.log("Uploading 12 approved option images...");
const imageUrlById = new Map();
for (let imageId = 1; imageId <= 12; imageId++) {
  const padded = String(imageId).padStart(2, "0");
  const localPath = `${PACKAGE_ROOT}/images/USO27_Image_${padded}.png`;
  const r2Key = `tennis-ticket-intelligence/us-open/2027/options/USO27_Image_${padded}.png`;
  const url = await uploadLocal(localPath, r2Key);
  imageUrlById.set(String(imageId), url);
  console.log(`  USO27_Image_${padded}.png -> ${url}`);
}

console.log("\nUploading 3 stadium maps...");
const MAPS = [
  { local: "USO27_MAP_AA_Arthur_Ashe.PNG", key: "USO27_AA_Arthur_Ashe_seating_map.png", arena: "Arthur Ashe Stadium" },
  { local: "USO27_MAP_LA_Louis_Armstrong.PNG", key: "USO27_LA_Louis_Armstrong_seating_map.png", arena: "Louis Armstrong Stadium" },
  { local: "USO27_MAP_GS_Grandstand.PNG", key: "USO27_GS_Grandstand_seating_map.png", arena: "Grandstand" },
];
const mapUrls = [];
for (const m of MAPS) {
  const localPath = `${MAPS_ROOT}/${m.local}`;
  const r2Key = `tennis-ticket-intelligence/us-open/2027/arena-maps/${m.key}`;
  const url = await uploadLocal(localPath, r2Key);
  mapUrls.push({ arena: m.arena, url });
  console.log(`  ${m.local} -> ${url}`);
}
console.log("\nUSO2027_ARENA_MAPS entries (paste into arenaMaps.ts):");
console.log(JSON.stringify(mapUrls, null, 2));

console.log("\nUpdating hero_image on all 31 US Open option rows...");
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

let updated = 0;
let missing = 0;
for (const row of mapping) {
  const optionNumber = parseInt(row.option_id, 10);
  const url = imageUrlById.get(row.image_id);
  if (!url) {
    console.error(`  MISSING uploaded URL for image_id ${row.image_id} (option ${optionNumber})`);
    missing++;
    continue;
  }
  await sql`
    UPDATE tennis_ticket_intelligence_options
    SET hero_image = ${url}
    WHERE sporting_event_id = ${US_OPEN_EVENT_ID} AND option_number = ${optionNumber}
  `;
  updated++;
}
console.log(`hero_image updated on ${updated} rows, ${missing} missing.`);

const [{ count: withImage }] = await sql`
  SELECT count(*)::int AS count FROM tennis_ticket_intelligence_options
  WHERE sporting_event_id = ${US_OPEN_EVENT_ID} AND hero_image IS NOT NULL
`;
console.log(`US Open rows with hero_image set: ${withImage} / 31`);

await sql.end();
