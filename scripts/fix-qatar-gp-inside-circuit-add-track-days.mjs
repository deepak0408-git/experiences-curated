// Qatar GP 2026 Inside Lusail Circuit — add a new body paragraph covering
// the circuit's own public track-day programmes (Karting, Cars Track Day,
// Motorbikes Track Day, Mixed Training Days), sourced from the official
// venue site lcsc.qa/circuit-experience (verified 14 Sep 2026). Also removes
// practical_info.costRange and rewrites bookingMethod, since "no separate
// entry, no booking required" was accurate for race-weekend access but is
// now misleading once these separately-priced, separately-booked programmes
// are covered in the same experience.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "qatar-gp-inside-lusail-circuit-mtymp2ma";

const NEW_PARAGRAPH = "Lusail isn't only a race-week venue — outside the Formula 1 calendar, the circuit runs its own public track-day programme, open to visitors with no racing licence required. Karting sessions run Wednesday to Saturday evenings (6-11pm), 12 minutes per session on a roughly 900m kart layout, at QAR 125 including helmet. Cars Track Day and Motorbikes Track Day both put drivers and riders — novice through experienced — on the full circuit for 3-hour sessions, run as either private (smaller group, more personalised) or public (mixed skill levels) format, at QAR 1,000 per car (plus QAR 250 per passenger) or QAR 1,000 per bike, with expert supervision throughout. Mixed Training Days take a different angle entirely: a 3-hour open-track window (6-9pm) for cycling, walking, or running the 5.38km lap, open to all fitness levels. All four programmes book through the circuit's own member portal (members.lcsc.qa) with advance registration required — none of it is walk-up.";

const [row] = await db.select({ id: experiences.id, bodyContent: experiences.bodyContent, practicalInfo: experiences.practicalInfo })
  .from(experiences).where(eq(experiences.slug, SLUG));
if (!row) throw new Error("Experience not found: " + SLUG);
if (row.bodyContent.includes(NEW_PARAGRAPH)) {
  throw new Error("New paragraph already present — aborting to avoid duplicate.");
}

const newBody = row.bodyContent + "\n\n" + NEW_PARAGRAPH;

const OLD_COST_RANGE = "No separate entry — access included with any race ticket tier";
if (row.practicalInfo?.costRange !== OLD_COST_RANGE) {
  throw new Error("costRange did not match expected value verbatim — aborting. Current: " + row.practicalInfo?.costRange);
}

const { costRange, ...rest } = row.practicalInfo;
const newPracticalInfo = {
  ...rest,
  bookingMethod: "Race-weekend access is included with any ticket tier. The circuit's own track-day programmes (Karting, Cars Track Day, Motorbikes Track Day, Mixed Training Days) run separately from race weekend and require advance registration via members.lcsc.qa.",
};

await db.update(experiences).set({ bodyContent: newBody, practicalInfo: newPracticalInfo }).where(eq(experiences.id, row.id));

console.log("Updated", SLUG, "— added track-day paragraph, removed costRange, revised bookingMethod.");
await client.end();
