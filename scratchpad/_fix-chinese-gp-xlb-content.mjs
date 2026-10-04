import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "chinese-gp-nanxiang-xiaolongbao-mud1x6t2";

const newBodyContent = `Every Shanghai visitor eventually eats xiaolongbao, the city's signature soup dumpling. What most don't realize is that the dish wasn't invented downtown — it traces back to Nanxiang, a town now inside Jiading District, close enough to Shanghai International Circuit to make a genuinely easy stop before or after a race weekend.

The dumpling itself dates to 1871, when Huang Mingxian, running a dim sum shop called Rihuaxuan on what's now Renmin Street in Nanxiang's old town, reworked an older tradition of soup-filled buns into something more refined: a thinner wrapper around a filling built partly from solid pork-skin aspic that melts into liquid soup during steaming. In 1900, a relative of the Rihuaxuan family opened a second shop nearby, Changxinglou, which later expanded into central Shanghai as what's now known as the Nanxiang Steamed Bun Restaurant beside Yu Garden — the dish's most famous downtown home. But Rihuaxuan and Changxinglou, both still standing in Nanxiang's old town today, are where the recipe actually started.

How you eat it matters as much as where. Lift a dumpling carefully by the pleated top — by hand with chopsticks, or set on a spoon — then nibble a small opening in the side to let the steam and broth escape before eating it whole. The classic pairing is a dip of Zhenjiang black vinegar with a few thin shreds of fresh ginger, used lightly rather than as a soak, to cut through the richness of the pork and the soup without masking it. Most Nanxiang restaurants also serve a simple side — a light soup or a plate of stir-fried greens — specifically because xiaolongbao itself is rich enough that a second heavy dish feels like too much.

Nanxiang is one of Shanghai's oldest settlements, established during the Liang Dynasty in 505 AD, roughly 1,500 years before Formula 1 ever came to Shanghai. Its old town still has the twin pagodas and the classical Guyi Garden that give the area its character beyond the food. Just outside the garden's south gate sits Guyi Garden Restaurant, a well-established name in its own right, known locally for its seasonal crab roe xiaolongbao when crab is in season — a genuinely well-reviewed, currently-operating option if Rihuaxuan or Changxinglou have a wait.

This is a genuinely budget-friendly stop: dumplings are inexpensive street-level or casual-dining food across China, and Nanxiang's old town doesn't charge circuit-adjacent or tourist-trap prices for the privilege of eating where the dish began. Pair it with a walk through the old town itself and it's a half-day that costs very little and delivers a real piece of food history most race-weekend visitors to Shanghai never find.`;

const newWhyItsSpecial = `A lot of "authentic food" claims in tourist cities are marketing, not history. This one is genuinely both. Nanxiang isn't styled to look like the birthplace of xiaolongbao — it actually is, a fact documented back to 1871 at Rihuaxuan and recognized in 2014 as National Intangible Cultural Heritage. For a race-weekend visitor already staying near Jiading, that's a rare alignment: the historically correct answer to "where should I eat dumplings" and the geographically convenient answer happen to be the same town. Most trips to Shanghai involve a deliberate detour to chase food history like this; this one barely requires one.`;

const newInsiderTips = [
  "Rihuaxuan and Changxinglou, both on or near Renmin Street in the old town, are the two genuinely original shops — Rihuaxuan from 1871, Changxinglou from 1900 — and each gets a steady stream of locals rather than tour groups, so don't expect a polished tourist setup at either.",
  "Order the black vinegar and ginger on the side if it doesn't come automatically, and use it lightly — a quick dip, not a soak — or it overwhelms the broth you're actually there for.",
];

const newWhatToAvoid = "Don't confuse Nanxiang the town with the Nanxiang Steamed Bun Restaurant beside Yu Garden downtown — the downtown restaurant (a branch that grew out of Changxinglou) is a famous, real destination in its own right, but it's a different location from the actual birthplace town this experience covers, and conflating the two means visiting the wrong place if the goal is Nanxiang itself. Don't bite straight into a fresh-steamed dumpling — the broth inside is genuinely hot enough to burn, so nibble a small opening first and let the steam escape before eating it whole.";

const newPracticalInfo = {
  hours: "Guyi Garden Restaurant: 8:00 AM–7:00 PM (lobby service ends around 4 PM on weekdays — no full dinner service). Changxinglou: 7:00 AM–8:00 PM. Rihuaxuan: hours not published by any source found — call ahead or check on arrival.",
  website: "https://en.wikipedia.org/wiki/Nanxiang, https://en.wikipedia.org/wiki/Nanxiang_Steamed_Bun_Restaurant, https://en.wikipedia.org/wiki/Xiaolongbao",
  costRange: "Budget — dumplings are inexpensive casual dining across Nanxiang's old town, well below downtown tourist-district pricing",
  bookingMethod: "Walk-in — no reservation typically needed at Guyi Garden Restaurant, Rihuaxuan, or Changxinglou.",
};

await db.update(experiences)
  .set({
    bodyContent: newBodyContent,
    whyItsSpecial: newWhyItsSpecial,
    insiderTips: newInsiderTips,
    whatToAvoid: newWhatToAvoid,
    practicalInfo: newPracticalInfo,
    editorialNote: "Sourced from en.wikipedia.org/wiki/Nanxiang, en.wikipedia.org/wiki/Nanxiang_Steamed_Bun_Restaurant, en.wikipedia.org/wiki/Xiaolongbao (neutral, well-documented history); thatsmags.com Nanxiang day-trip article (Rihuaxuan/Huang Mingxian 1871 founding, Changxinglou 1900, both corroborated by jiemian.com and sohu.com Chinese-language sources); jiading.gov.cn official government xiaolongbao guide (Guyi Garden Restaurant's crab-roe specialty, Changxinglou's Renmin Street 75 address and 7:00-20:00 hours). Google Places API (New) lookups, 2 Oct 2026: Shanghai Guyi Garden Restaurant 4.0/38 reviews (kept as the one rated venue); Rihuaxuan (日华轩) and Changxinglou (长兴楼) both confirmed as real, currently-operating restaurants via Chinese-name search, but each returned only 1 Google review — too thin to cite as a rating per founder instruction, so both are named in body/insider tips as the historic originals without a googleMapsRating. A third candidate with a strong review count (南翔馒头店, 731 reviews) could not be confirmed as the Nanxiang-town location rather than the downtown Yu Garden branch, so it was excluded rather than guessed at. Vinegar/ginger pairing and eating technique via WebSearch of general xiaolongbao food-culture sources (thechairmansbao.com, chinesefoodwiki.org). FLAG: corrects a prior factual error — body previously stated 'Guyi Garden Restaurant, founded 1871' as the original xiaolongbao venue; the 1871 founding actually belongs to Rihuaxuan, and Guyi Garden Restaurant is a separate, real, well-regarded but not historically-original restaurant near the garden's south gate.",
  })
  .where(eq(experiences.slug, SLUG));

console.log("Updated", SLUG, ": body, whyItsSpecial, insiderTips, whatToAvoid, practicalInfo, editorialNote.");

await client.end();
