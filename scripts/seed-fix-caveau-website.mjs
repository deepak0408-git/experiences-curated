import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [row] = await db
  .select({ practicalInfo: experiences.practicalInfo, bodyContent: experiences.bodyContent, editorialNote: experiences.editorialNote })
  .from(experiences)
  .where(eq(experiences.slug, "caveau-de-la-huchette-jazz"));

const oldParagraph =
  "A single ticket, €34 Sunday through Thursday and €39 on Friday and Saturday, covers the entire night: live sets, the dance floor, the upstairs bar, no cover charges layered on top and no time limit before closing. Doors open at 9:30pm; the room runs until 2:30am on quieter nights and as late as 5:30am Thursday through Saturday. Get there 30-45 minutes before opening, especially on a weekend, because the room fills fast and standing at the back of a sold-out medieval cellar isn't the same experience as being close enough to actually see the band.";

const newParagraph =
  "Entry runs €14 Sunday through Thursday and €16 Friday, Saturday and holidays, €10 for students under 25 with ID — drinks are separate, from €6 for non-alcoholic and €7 for alcoholic. Doors open at 9pm; the room runs until 2am Sunday through Thursday and as late as 4am Friday and Saturday. Get there 30-45 minutes before opening, especially on a weekend, because the room fills fast and standing at the back of a sold-out medieval cellar isn't the same experience as being close enough to actually see the band.";

if (!row.bodyContent.includes(oldParagraph)) {
  throw new Error("Expected paragraph not found in body_content — aborting to avoid a silent no-op.");
}

const bodyContent = row.bodyContent.replace(oldParagraph, newParagraph);
const editorialNote = row.editorialNote.replace(
  "Pricing (€34/€39) and hours from official lecaveaudelahuchette.fr tickets page.",
  "Pricing (€14/€16/€10 student, drinks separate) and hours (9pm-2am Sun-Thu, 9pm-4am Fri-Sat) re-verified 7 Sep 2026 directly against the official caveaudelahuchette.fr — corrects an earlier all-inclusive €34/€39 figure and 9:30pm-2:30am/5:30am hours that didn't match the site's actual pricing structure (entry-only, no all-inclusive package exists)."
);

await db.update(experiences)
  .set({
    bodyContent,
    editorialNote,
    practicalInfo: {
      ...row.practicalInfo,
      website: "https://www.caveaudelahuchette.fr",
      hours: "Sun-Thu 21:00-02:00; Fri-Sat & holidays 21:00-04:00",
      costRange: "€14 entry (Sun-Thu) / €16 entry (Fri-Sat & holidays) / €10 for students under 25 with ID — drinks separate, from €6 non-alcoholic, €7 alcoholic",
    },
  })
  .where(eq(experiences.slug, "caveau-de-la-huchette-jazz"));

console.log("✓ caveau-de-la-huchette-jazz — website, hours, and pricing corrected in body copy, practical_info, and editorial_note");

await client.end();
