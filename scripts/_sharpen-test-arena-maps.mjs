import sharp from "sharp";
import fs from "node:fs";

const OUT_DIR =
  "C:/Users/HP/AppData/Local/Temp/claude/c--Users-HP--claude-projects-ExperienceCurator/4cb0a89b-5cce-4e1a-b3f1-2d23ffa9e9bd/scratchpad/sharpen-test";
fs.mkdirSync(OUT_DIR, { recursive: true });

const files = [
  { name: "Arthur Ashe Map.PNG", out: "arthur-ashe" },
  { name: "Louis Armstrong Map.PNG", out: "louis-armstrong" },
  { name: "Grandstand Map.PNG", out: "grandstand" },
];

for (const f of files) {
  const input = `Images/${f.name}`;
  await sharp(input)
    .sharpen({ sigma: 1.2, m1: 1.0, m2: 2.0 })
    .toFile(`${OUT_DIR}/${f.out}-sharpened.png`);
  console.log("done:", f.out);
}
