import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

try {
  const [row] = await db.select({
    id: experiences.id,
    bodyContent: experiences.bodyContent,
    whyItsSpecial: experiences.whyItsSpecial,
    insiderTips: experiences.insiderTips,
    whatToAvoid: experiences.whatToAvoid,
    practicalInfo: experiences.practicalInfo,
    editorialNote: experiences.editorialNote,
  })
    .from(experiences)
    .where(eq(experiences.title, "Where to Stay in Adelaide — City vs. North Adelaide"));

  if (!row) throw new Error("Experience not found");

  const bodyContent = row.bodyContent.replace(
    /The Mayfair Hotel, on North Terrace in the CBD, is the pick if you'd rather have Adelaide's actual city life within reach\. It's a five-minute walk from Elder Park and roughly ten minutes across the river footbridge to the Oval, but it also puts Rundle Mall's shops and restaurants and the rest of the CBD's dining scene right outside the door — which the Oval Hotel, wrapped around a stadium in parkland, genuinely doesn't offer on non-match days\. \[See live rating and reviews on Google Maps\]\(https:\/\/maps\.google\.com\/\?cid=1109715416105002973&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA\)/,
    `The InterContinental Adelaide, on the CBD side of the same river footbridge, is the pick if you'd rather have Adelaide's actual city life within reach. It sits directly across the River Torrens from Adelaide Oval — a footbridge walk to the ground — while also putting the Adelaide Festival Centre, the Convention Centre, and Rundle Mall's shops and restaurants within easy reach, which the Oval Hotel, wrapped around a stadium in parkland, genuinely doesn't offer on non-match days.`
  );

  const whatToAvoid = row.whatToAvoid.replace(
    "Avoid assuming all North Terrace CBD hotels are equally close to the Oval footbridge crossing — North Terrace runs for over a kilometre, so a hotel at the eastern end near the Botanic Gardens is a noticeably longer walk to the ground than one nearer Government House and King William Road.",
    "Avoid assuming all North Terrace CBD hotels are equally close to the Oval footbridge crossing — North Terrace runs for over a kilometre, so a hotel at the eastern end near the Botanic Gardens is a noticeably longer walk to the ground than one nearer the Riverbank Precinct, where the InterContinental sits."
  );

  const updatedPracticalInfo = {
    ...row.practicalInfo,
    costRange: "Oval Hotel from roughly AU$350-480/night in peak December demand; InterContinental Adelaide and comparable CBD Riverbank hotels from roughly AU$280-400/night — both rise during the Test window",
    bookingMethod: "Book the Oval Hotel directly via ovalhotel.com.au, or the InterContinental Adelaide via icadelaide.com.au — both also list on major booking platforms.",
    website: "https://www.ovalhotel.com.au, https://icadelaide.com.au",
  };

  const editorialNote = row.editorialNote.replace(
    "tripexpert.com and expedia.com (Mayfair Hotel location, 5-min walk to Elder Park, 10-min walk to Adelaide Oval across the river). Google Places API lookups for Oval Hotel (4.5/777 reviews) and Mayfair Hotel Adelaide (4.4/1,506 reviews), captured 16 Aug 2026 — both real, well-attested ratings, no thin-review concern.",
    "icadelaide.com.au (InterContinental Adelaide, Riverbank Precinct, footbridge to Adelaide Oval). Mayfair Hotel dropped 17 Aug 2026 — its own domain (mayfairhotel.com.au) returns an SSL certificate mismatch (resolves to a generic WPEngine placeholder, not the hotel) and the property is reported closed for refurbishment until Q4 2026; replaced with InterContinental Adelaide (real, currently trading, 4/5 Tripadvisor, ~8/10 aggregate from 2,300+ reviews per tripexpert.com, confirmed via WebFetch to icadelaide.com.au). Google Places API lookup for Oval Hotel (4.5/777 reviews) captured 16 Aug 2026 — real, well-attested rating, no thin-review concern. InterContinental Adelaide's own Google Places rating/review-count lookup and its Google Maps rating link still need to be pulled the same way before this experience is finalized."
  );

  if (bodyContent === row.bodyContent) throw new Error("bodyContent replacement did not match");
  if (whatToAvoid === row.whatToAvoid) throw new Error("whatToAvoid replacement did not match");
  if (editorialNote === row.editorialNote) throw new Error("editorialNote replacement did not match");

  const [result] = await db.update(experiences)
    .set({ bodyContent, whatToAvoid, practicalInfo: updatedPracticalInfo, editorialNote })
    .where(eq(experiences.id, row.id))
    .returning({ id: experiences.id, title: experiences.title });

  console.log("Updated:", result.title);
  console.log("\n--- bodyContent (Mayfair paragraph) ---\n");
  console.log(bodyContent.split("\n\n")[2]);
  console.log("\n--- practicalInfo ---\n");
  console.log(JSON.stringify(updatedPracticalInfo, null, 2));
} catch (e) {
  console.error("Error:", e.message);
} finally {
  await client.end();
}
