import fs from "node:fs";
import { createHash } from "node:crypto";

// Exports a hash of the DEPLOYED Wimbledon explanation lookup
// (wimbledonExplanationCatalogue.json, built from the approved frozen CSV
// by scripts/_build-wimbledon-explanation-catalogue.mjs) alongside a
// SHA-256 of the catalogue file itself, so an independent reviewer can
// confirm the deployed catalogue is byte-identical to what was built from
// the approved source CSV, without needing to re-run the app. Handback
// artifact #3 of the implementation contract's Section 10C.

const CATALOGUE_PATH = "app/ticket-intelligence/tennis/[slug]/_lib/wimbledonExplanationCatalogue.json";
const OUT = process.argv[2] ?? "wimbledon-explanation-catalogue-hash.json";

const raw = fs.readFileSync(CATALOGUE_PATH);
const catalogue = JSON.parse(raw.toString("utf8"));

const sha256 = createHash("sha256").update(raw).digest("hex");

// Per-entry hash export (key -> sha256 of [optionNumber, score, text])
// lets a reviewer diff individual entries without re-deriving the whole
// catalogue, while the top-level sha256 covers the whole file for a
// single-pass integrity check.
const entryHashes = {};
for (const [key, [optionNumber, score, textIdx]] of Object.entries(catalogue.entries)) {
  const text = catalogue.strings[textIdx];
  const h = createHash("sha256").update(JSON.stringify([optionNumber, score, text])).digest("hex");
  entryHashes[key] = h;
}

fs.writeFileSync(
  OUT,
  JSON.stringify(
    {
      catalogueFileSha256: sha256,
      uniqueKeyCount: catalogue.uniqueKeyCount,
      stringPoolSize: catalogue.strings.length,
      entryHashes,
    },
    null,
    2
  )
);
console.log(`Wrote ${OUT}`);
console.log(`catalogueFileSha256: ${sha256}`);
console.log(`uniqueKeyCount: ${catalogue.uniqueKeyCount}`);
console.log(`entryHashes: ${Object.keys(entryHashes).length}`);
