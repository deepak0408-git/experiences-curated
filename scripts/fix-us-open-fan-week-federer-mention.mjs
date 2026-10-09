import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "us-open-fan-week-free-grounds-access-before-the-open-mrw9yvsj";

const OLD = `Recent editions have packed the week with extras beyond the tennis itself — a Kids' Day stadium show, celebrity exhibitions, themed fan nights, and a block party with DJs and a silent disco at Fountain Plaza, the open square at the center of the grounds. The exact 2027 lineup isn't published yet; check the official US Open app or usopen.org in the weeks before Fan Week for the confirmed schedule rather than assuming a prior year's programming repeats exactly.`;

const NEW = `Recent editions have packed the week with extras beyond the tennis itself — a Kids' Day stadium show, celebrity exhibitions (2026 brought Roger Federer back to Arthur Ashe Stadium for a one-night exhibition with Andy Roddick, Andre Agassi, and John McEnroe), themed fan nights, and a block party with DJs and a silent disco at Fountain Plaza, the open square at the center of the grounds. The exact 2027 lineup isn't published yet; check the official US Open app or usopen.org in the weeks before Fan Week for the confirmed schedule rather than assuming a prior year's programming repeats exactly.`;

const [existing] = await db.select({ bodyContent: experiences.bodyContent }).from(experiences).where(eq(experiences.slug, SLUG));

if (!existing.bodyContent.includes(OLD)) {
  console.error("OLD string not found — body may have changed since last read. Aborting.");
  process.exit(1);
}

const updatedBody = existing.bodyContent.replace(OLD, NEW);

const result = await db
  .update(experiences)
  .set({ bodyContent: updatedBody })
  .where(eq(experiences.slug, SLUG))
  .returning({ id: experiences.id, slug: experiences.slug });

console.log("Updated:", result);
process.exit(0);
