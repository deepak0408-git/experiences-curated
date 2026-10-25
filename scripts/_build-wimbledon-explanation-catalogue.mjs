import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Builds the compact lookup-catalogue JSON
// (wimbledonExplanationCatalogue.json) from the approved frozen
// Wimbledon_2027_50112_Frozen_Explanation_Lookup.csv — same approach as
// French Open's frenchOpenExplanationCatalogue.json: a pooled-string table
// plus a key->indices map, so the app never parses the 13MB source CSV at
// runtime. Deterministic, pure transform — no text is generated, rephrased,
// or altered; every pooled string is copied verbatim from the approved CSV.
//
// Key shape confirmed (ZIP's own validation/check_package.py + Stage 2's
// RG precedent for Q4 exclusion): (mode, day, q1, q2, q3, q5, q6, rank).
// q4 is always "neutral_all" in Wimbledon's source data (verified below) —
// excluded from the key exactly as French Open excludes q7, since it never
// varies and carries no information.

const dir = path.dirname(fileURLToPath(import.meta.url));
const SRC = process.argv[2];
const OUT = process.argv[3];

function parseLineQuoted(line) {
  const out = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; } else inQ = false;
      } else cur += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === ",") { out.push(cur); cur = ""; }
      else cur += c;
    }
  }
  out.push(cur);
  return out;
}

const lines = fs.readFileSync(SRC, "utf8").trim().split(/\r?\n/);
const header = lines[0].split(",");
const idx = Object.fromEntries(header.map((h, i) => [h, i]));

const strings = [];
const stringIndex = new Map();
function internString(s) {
  if (stringIndex.has(s)) return stringIndex.get(s);
  const i = strings.length;
  strings.push(s);
  stringIndex.set(s, i);
  return i;
}

// entries[key] = [optionNumber, score, textIdx]
const entries = {};
let q4Values = new Set();

for (let i = 1; i < lines.length; i++) {
  const cells = parseLineQuoted(lines[i]);
  const mode = cells[idx.mode];
  const day = cells[idx.day];
  const q1 = cells[idx.q1];
  const q2 = cells[idx.q2];
  const q3 = cells[idx.q3];
  const q4 = cells[idx.q4];
  const q5 = cells[idx.q5];
  const q6 = cells[idx.q6];
  const rank = cells[idx.rank];
  const optionNumber = parseInt(cells[idx.option_number], 10);
  const score = parseFloat(cells[idx.score]);
  const text = cells[idx.fan_facing_text];

  q4Values.add(q4);

  const key = [mode, day, q1, q2, q3, q5, q6, rank].join("|");
  if (entries[key]) {
    throw new Error(`Duplicate key at row ${i + 1}: ${key} — stop, catalogue must have exactly one row per key.`);
  }
  entries[key] = [optionNumber, score, internString(text)];
}

if (q4Values.size !== 1 || !q4Values.has("neutral_all")) {
  throw new Error(`Expected q4 to always be "neutral_all", found: ${[...q4Values].join(",")} — Q4 may not be safely excludable from the key.`);
}

const catalogue = {
  uniqueKeyCount: Object.keys(entries).length,
  strings,
  entries,
};

fs.writeFileSync(OUT, JSON.stringify(catalogue));
console.log(`Wrote ${OUT}`);
console.log(`uniqueKeyCount: ${catalogue.uniqueKeyCount} (expect 50112)`);
console.log(`pooled strings: ${strings.length}`);
console.log(`q4 values seen: ${[...q4Values].join(",")}`);
