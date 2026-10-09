import fs from "fs";
import path from "path";

const dir = "scratchpad/bgt-flights";
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));

const good = [];
const bad = [];

for (const file of files) {
  const raw = fs.readFileSync(path.join(dir, file), "utf-8");
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    bad.push({ file, reason: "invalid JSON" });
    continue;
  }
  if (!data.finalCostLow || !data.finalCostHigh || !data.origin) {
    bad.push({ file, reason: "incomplete", data });
  } else {
    good.push(data);
  }
}

console.log(`GOOD: ${good.length}`);
console.log(`BAD: ${bad.length}`);
for (const b of bad) console.log(" -", b.file, b.reason);
