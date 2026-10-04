import { db } from "../lib/db.ts";
import { sportingEvents } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const rows = await db.select().from(sportingEvents).where(eq(sportingEvents.slug, "japanese-grand-prix"));
console.log(JSON.stringify(rows, null, 2));
process.exit(0);
