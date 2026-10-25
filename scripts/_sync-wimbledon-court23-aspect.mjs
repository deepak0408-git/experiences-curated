import sharp from "sharp";

// Pads Court 2/3's seating maps out to Centre Court's EXACT canvas size
// (761x551), centering the existing artwork within that fixed frame via
// whitespace padding — never stretching/distorting content. If an image
// is larger than the target in either dimension, it's scaled down first
// (preserving aspect ratio) so it fits inside 761x551 before padding.
// Result: all four seating-map images share identical pixel dimensions.

const TARGET_WIDTH = 761;
const TARGET_HEIGHT = 551;

const jobs = [
  { file: "Images/Court 2.PNG", out: "Images/Court 2 - synced.png" },
  { file: "Images/Court 3.PNG", out: "Images/Court 3 - synced.png" },
];

for (const { file, out } of jobs) {
  const meta = await sharp(file).metadata();
  const { width, height } = meta;

  await sharp(file)
    .resize({
      width: TARGET_WIDTH,
      height: TARGET_HEIGHT,
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png()
    .toFile(out);

  const newMeta = await sharp(out).metadata();
  console.log(`${file}: ${width}x${height} -> ${newMeta.width}x${newMeta.height}`);
}
