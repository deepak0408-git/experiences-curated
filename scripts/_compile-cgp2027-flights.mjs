import fs from "fs";
const dir = "scratchpad/cgp2027-flights";
const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"));
const rows = [];
for (const f of files) {
  const d = JSON.parse(fs.readFileSync(`${dir}/${f}`, "utf8"));
  rows.push({ iata: f.replace(".json",""), ...d });
}
console.log(JSON.stringify(rows, null, 2));
