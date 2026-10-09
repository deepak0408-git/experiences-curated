import fs from "fs";

const rows = JSON.parse(fs.readFileSync("scratchpad/bgt-flights-table.json", "utf-8"));
const htmlPath = "C:/Users/HP/AppData/Local/Temp/claude/c--Users-HP--claude-projects-ExperienceCurator/74758a02-1e39-447f-83e3-808d35eb40ba/scratchpad/bgt-flights-review.html";
const html = fs.readFileSync(htmlPath, "utf-8");
const out = html.replace("__DATA__", JSON.stringify(rows));
fs.writeFileSync(htmlPath, out);
console.log("injected", rows.length, "rows");
