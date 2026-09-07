import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "28d326df-f515-41aa-bc9c-1fb2fceb7d77";

const whatToAvoid = `Don't call this "Mexican Halloween" anywhere, including in your own social media captions — it trivializes a genuine act of remembrance and mourning that happens to also be publicly celebratory, and locals notice the framing. And don't get so absorbed in the parade crowd along Reforma that you stop tracking your bag or your group — hundreds of thousands of people line this route, and pickpocketing in exactly this kind of dense, distracted crowd is the most commonly reported real safety issue, not a hypothetical one. Use a bag that closes securely, keep valuables off your back, and agree on a meeting point with anyone you're with in case the crowd separates you.`;

const editorialNote = "Parade route, timing, and viewing-spot recommendations sourced from CasaGoliana.com's 2026 Day of the Dead parade guide and RioTimesOnline.com's 2026 expat guide, Sep 2026 — exact 2026 date not yet officially confirmed by CDMX government at time of writing, stated honestly in body copy as 'traditionally/likely' rather than asserted as confirmed fact. Etiquette guidance sourced from InsideTheUpgrade.com's 'what tourists get wrong' feature and MyWanderlustyLife.com's foreigner's guide. Second What to Avoid replaced 6 Sep 2026 — the original ('don't treat a cemetery vigil as a photo backdrop') restated bodyContent almost verbatim. Replaced with real parade-crowd pickpocket safety guidance (hundreds of thousands of attendees along Reforma, dense-crowd pickpocketing as the most commonly reported real safety issue), sourced from Covermore.com.au's Day of the Dead travel-safety guide and multiple corroborating visitor-safety sources, 6 Sep 2026 — distinct from the Metro-crowding pickpocket avoid already used in the Getting There experience, since this is about the parade crowd specifically, not transit.";

const [result] = await db
  .update(experiences)
  .set({ whatToAvoid, editorialNote, lastVerifiedDate: "2026-09-06" })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log(`✓ Updated: ${result.title}`);
await client.end();
