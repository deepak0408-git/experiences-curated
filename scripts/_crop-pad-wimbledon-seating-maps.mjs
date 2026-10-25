import sharp from "sharp";
import path from "node:path";

// Crops No.2/No.3 Court seating maps to their tight content bbox (computed
// via a PNG pixel scan — see conversation record, 25 Oct 2026) then pads
// evenly, to fix the oversized 768x1024 portrait canvas / large dead
// bottom whitespace that made them render tiny and mis-proportioned next
// to Centre Court/No.1 Court's properly-framed ~760x550 landscape images.
//
// Does NOT and CANNOT restore the "EAST END" (No.2) / "WEST END" (No.3)
// text clipped at the canvas edge in the original source assets — that
// pixel data was never rendered in the source PNG, so no crop/pad
// operation can recover it. Flagged separately as an unresolved source-
// asset defect; this script only fixes the sizing/whitespace problem.

const srcDir = process.argv[2];
const outDir = process.argv[3];

const jobs = [
  { file: "FINAL_No2_Court.png", bbox: { minX: 22, maxX: 767, minY: 35, maxY: 977 } },
  { file: "FINAL_No3_Court.png", bbox: { minX: 0, maxX: 735, minY: 35, maxY: 977 } },
];

const PAD = 18;

for (const { file, bbox } of jobs) {
  const { minX, maxX, minY, maxY } = bbox;
  const cropWidth = maxX - minX + 1;
  const cropHeight = maxY - minY + 1;
  const srcPath = path.join(srcDir, file);
  const outPath = path.join(outDir, file);

  await sharp(srcPath)
    .extract({ left: minX, top: minY, width: cropWidth, height: cropHeight })
    .extend({ top: PAD, bottom: PAD, left: PAD, right: PAD, background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(outPath);

  const meta = await sharp(outPath).metadata();
  console.log(`${file}: cropped to ${cropWidth}x${cropHeight}, padded to ${meta.width}x${meta.height} (aspect=${(meta.width / meta.height).toFixed(3)})`);
}
