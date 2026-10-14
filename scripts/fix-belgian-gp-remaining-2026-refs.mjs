import { config } from "dotenv";
config({ path: ".env.local" });

import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });

function replaceField(column, id, oldStr, newStr) {
  return sql`
    UPDATE experiences
    SET practical_info = jsonb_set(
      practical_info,
      ${"{" + column + "}"},
      to_jsonb(replace(practical_info->>${column}, ${oldStr}, ${newStr}))
    )
    WHERE id = ${id}
  `;
}

function replaceBody(id, oldStr, newStr) {
  return sql`
    UPDATE experiences
    SET body_content = replace(body_content, ${oldStr}, ${newStr})
    WHERE id = ${id}
  `;
}

function replaceWhy(id, oldStr, newStr) {
  return sql`
    UPDATE experiences
    SET why_its_special = replace(why_its_special, ${oldStr}, ${newStr})
    WHERE id = ${id}
  `;
}

// --- Pouhon Corner — website year ---
await replaceField("website", "346b2125-2f4b-4b82-95ef-7b73c1c2515c",
  "https://www.formula1.com/en/racing/2026/belgium", "https://www.formula1.com/en/racing/2027/belgium");
await replaceField("costRange", "346b2125-2f4b-4b82-95ef-7b73c1c2515c",
  "3-day Silver ticket approx. €280–€320 (check belgium.gp for 2026 pricing)",
  "3-day Silver ticket approx. €280–€320 (check belgium.gp for current pricing)");

// --- Kemmel Straight — website year ---
await replaceField("website", "ef526456-69f3-4a80-b96a-5c8f4200072b",
  "https://www.formula1.com/en/racing/2026/belgium", "https://www.formula1.com/en/racing/2027/belgium");
await replaceField("costRange", "ef526456-69f3-4a80-b96a-5c8f4200072b",
  "Bronze 3-day general admission approx. €120–€150 (check official site for 2026 pricing)",
  "Bronze 3-day general admission approx. €120–€150 (check official site for current pricing)");

// --- Eau Rouge Gold 3 — website year + flag stale pricing baseline ---
await replaceField("website", "3ff418ed-a8d6-46d6-b070-44ad594b4f89",
  "https://www.formula1.com/en/racing/2026/belgium", "https://www.formula1.com/en/racing/2027/belgium");
await replaceField("costRange", "3ff418ed-a8d6-46d6-b070-44ad594b4f89",
  "3-day Gold 3 ticket approx. €610 (2023 pricing; check official site for 2026 prices)",
  "3-day Gold 3 ticket approx. €610 (2023 pricing baseline — confirm current price at official site before booking)");

// --- Fan Zone — website year ---
await replaceField("website", "e0c36bc7-2478-41b0-8f85-5cd94f5d5fcb",
  "https://www.formula1.com/en/racing/2026/belgium", "https://www.formula1.com/en/racing/2027/belgium");

// --- Getting to Circuit — stale sales-close date ---
await replaceBody("b9424db5-4f4f-4bd1-80f5-64dbdbefb7b8",
  "Sales close on 26 June 2026, well before race weekend — if you are considering this option, book it now.",
  "Sales typically close around three weeks before race weekend — if you are considering this option, book it as soon as the City Shuttle goes on sale.");
await replaceField("bookingMethod", "b9424db5-4f4f-4bd1-80f5-64dbdbefb7b8",
  "Sales close 26 June — this is a hard deadline.",
  "Sales close roughly three weeks before race weekend — this is a hard deadline, confirm the exact date at spagrandprix.com when the shuttle goes on sale.");

// --- Camping — dates were 2026-specific (Thu 16 Jul / Mon 20 Jul); 2027 race is 23-25 Jul ---
await replaceBody("5bbf9b99-9861-401e-971b-942a6378ac21",
  "The full camping period runs from Thursday 16 July at 08:00 to Monday 20 July at 11:00. You can arrive from Thursday and leave any time Monday morning.",
  "The full camping period typically opens the Thursday before race weekend at 08:00 and closes the Monday after at 11:00 — for the 2027 race (23-25 Jul), that's expected to be Thursday 22 July through Monday 26 July, but confirm exact dates at spagrandprix.com once published. You can arrive from Thursday and leave any time Monday morning.");
await replaceField("hours", "5bbf9b99-9861-401e-971b-942a6378ac21",
  "Campsite opens Thu 16 Jul 08:00; closes Mon 20 Jul 11:00. No vehicle departures Sun 16:30–19:30.",
  "Campsite typically opens the Thursday before race weekend at 08:00; closes the Monday after at 11:00 — confirm exact 2027 dates at spagrandprix.com. No vehicle departures Sun 16:30–19:30.");
await replaceBody("5bbf9b99-9861-401e-971b-942a6378ac21",
  "Last availability for 2026 was visible in May; check gptents.com.",
  "Availability has historically run out by spring; check gptents.com for the current year.");

// --- Romantik Hotel — stale "race weekend July 2026" in howToBook ---
await replaceField("howToBook", "6ecde867-c9f7-40c4-b173-519ea139394d",
  "For race weekend July 2026, call", "For race weekend, call");

// --- Track Experiences — generalize 2026-specific calendar references ---
await replaceBody("1ca53bb0-083a-48e0-a34e-0b2a85fac3b5",
  "The 2026 calendar includes July 29 — ten days after the Belgian GP — which makes it an obvious extension of a race weekend visit if you are already in the Ardennes.",
  "The circuit's Public Driving Experience calendar often adds dates within a few weeks of the Belgian GP, which makes an obvious extension of a race weekend visit if you are already in the Ardennes — check spa-francorchamps.be for the current year's dates.");
await replaceBody("1ca53bb0-083a-48e0-a34e-0b2a85fac3b5",
  "For Taxi Laps specifically, new July 29 and August 13 dates were added for the 2026 season — both within three weeks of the Belgian GP.",
  "For Taxi Laps specifically, the circuit has a history of adding dates within a few weeks of the Belgian GP — check spa-francorchamps.be for the current season's calendar.");
await replaceWhy("1ca53bb0-083a-48e0-a34e-0b2a85fac3b5",
  "The Public Driving Experience on July 29 sits immediately after the Belgian GP and is the logical next step for anyone who watched the race and wanted to understand what the drivers were doing.",
  "When the Public Driving Experience calendar lands a date shortly after the Belgian GP, it's the logical next step for anyone who watched the race and wanted to understand what the drivers were doing.");
await replaceField("hours", "1ca53bb0-083a-48e0-a34e-0b2a85fac3b5",
  "Taxi Laps and Public Driving Experience dates vary — check spa-francorchamps.be for 2026 calendar.",
  "Taxi Laps and Public Driving Experience dates vary — check spa-francorchamps.be for the current season's calendar.");
await replaceField("howToBook", "1ca53bb0-083a-48e0-a34e-0b2a85fac3b5",
  "July 29 is the closest PDE date to the 2026 Belgian GP and sells out weeks in advance; book early.",
  "The PDE date closest to the Belgian GP sells out weeks in advance; book early once the season's dates are published.");

const check = await sql`
  SELECT id, title, body_content, why_its_special, practical_info
  FROM experiences
  WHERE id IN (
    '346b2125-2f4b-4b82-95ef-7b73c1c2515c',
    'ef526456-69f3-4a80-b96a-5c8f4200072b',
    '3ff418ed-a8d6-46d6-b070-44ad594b4f89',
    'e0c36bc7-2478-41b0-8f85-5cd94f5d5fcb',
    'b9424db5-4f4f-4bd1-80f5-64dbdbefb7b8',
    '5bbf9b99-9861-401e-971b-942a6378ac21',
    '6ecde867-c9f7-40c4-b173-519ea139394d',
    '1ca53bb0-083a-48e0-a34e-0b2a85fac3b5'
  )
`;

const stillStale = [];
for (const r of check) {
  const fields = [r.body_content, r.why_its_special, ...Object.values(r.practical_info || {})];
  for (const f of fields) {
    if (typeof f === "string" && /2026/.test(f)) {
      stillStale.push({ title: r.title, snippet: f.match(/.{0,50}2026.{0,50}/g) });
    }
  }
}
console.log("Remaining 2026 references in these 8 rows:");
console.log(JSON.stringify(stillStale, null, 2));

await sql.end();
