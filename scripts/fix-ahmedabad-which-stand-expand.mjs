import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "ahmedabad-which-stand-muecmt5o";

const NEW_BODY = `With 132,000 seats, Narendra Modi Stadium doesn't really have a "wrong" stand so much as a wide spread of genuinely different experiences at different price points, and picking blind means you might end up somewhere that doesn't match what you actually wanted from the day. The ground has 11 named stands in total plus four large tiered stands named for cricket legends, so it's worth knowing the real lineup rather than just the two or three names that come up most often.

For the purist's view, the two ends behind the bowler's arm are the Adani Pavilion End (south) and the Jio End (north) — both give the straight-on sightline you see on TV broadcasts, where line, length, and lateral movement are easiest to read, and they're the first pick for anyone who wants to watch the bowling itself rather than just the overall spectacle.

Four of the stadium's biggest stands are named after cricket legends with direct ties to this exact ground: the Sunil Gavaskar Stand, Sachin Tendulkar Stand, Kapil Dev Stand, and Virender Sehwag Stand, each a three-tier structure holding roughly 33,000 people on its own. The connection isn't just branding — Gavaskar passed 10,000 Test runs here in 1987, Kapil Dev took the wicket that made him the leading Test wicket-taker in the world here in 1994, and Tendulkar passed 30,000 international runs at this ground in 2013, so these stands sit on genuinely significant cricketing history.

For value without sacrificing a good look at the pitch, Blocks N and E are consistently flagged as the best combination of affordable pricing and genuinely solid views, a rarity at a ground this size where cheap seats can sometimes mean genuinely distant ones. Blocks F and G sit a tier up in price and are generally rated for better proximity to the action, while Blocks P and Q run toward the cheaper end alongside N.

The Dream11 Stand sits in the mid-range tier, offering strong visibility without the premium price tag, a sensible pick if you want a proper seat without committing to hospitality-tier spending. Above that, the Adani Upper and Lower Pavilions, GMDC Upper and Lower Pavilions, and West Pavilion form a cluster of more premium stands with better proximity and comfort, the Torrent Corporate Box is air-conditioned with cushioned seating and food included, one of 76 corporate boxes at the stadium, each built to hold 25 people, and the ground's Club Pavilion and President's Gallery sit at the very top of the pricing structure with the fullest amenities, closest to the Adani End.

Given this is the final Test of a five-match series, likely to carry real stakes either way the series has gone by the time it arrives, the honest advice is to think about what kind of five days you actually want: a purist's straight-on view from behind the arm, a loud, affordable seat with a good sightline, a seat with genuine cricketing history behind its name, or a genuinely comfortable, air-conditioned day watching from a corporate box, all of which exist at this stadium simultaneously.`;

const [row] = await db.select({ bodyContent: experiences.bodyContent }).from(experiences).where(eq(experiences.slug, SLUG));
console.log("Current length:", row.bodyContent.length, "chars");

const [result] = await db.update(experiences)
  .set({ bodyContent: NEW_BODY })
  .where(eq(experiences.slug, SLUG))
  .returning({ slug: experiences.slug, status: experiences.status });

console.log("Updated:", result);
console.log("New length:", NEW_BODY.length, "chars");
process.exit(0);
