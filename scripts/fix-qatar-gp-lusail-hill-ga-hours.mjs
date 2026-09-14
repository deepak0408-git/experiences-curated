// Qatar GP 2026 — fix qatar-gp-lusail-hill-general-admission-mtzc059v:
// practicalInfo.hours led with a vague "Gates open ahead of each day's
// on-track session" framing before the real session times. Founder asked
// to replace with the actual hours directly, 14 Sep 2026 — confirmed
// against the official F1 schedule page (formula1.com/en/racing/2026/qatar,
// Track time toggle) via screenshot: P1 Fri 27 Nov 16:30-17:30, P2 Fri 27
// Nov 20:00-21:00, P3 Sat 28 Nov 17:30-18:30, Qualifying Sat 28 Nov
// 21:00-22:00, Race Sun 29 Nov 19:00 — all times already matched what was
// stored, so this is a framing fix (lead with the real schedule, drop the
// vague opener), not a data correction.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "qatar-gp-lusail-hill-general-admission-mtzc059v";

const [existing] = await db
  .select({ practicalInfo: experiences.practicalInfo, editorialNote: experiences.editorialNote })
  .from(experiences)
  .where(eq(experiences.slug, SLUG));

const practicalInfo = {
  ...existing.practicalInfo,
  hours:
    "Fri 27 Nov: Practice 1 4:30-5:30pm, Practice 2 8-9pm. Sat 28 Nov: Practice 3 5:30-6:30pm, Qualifying 9-10pm. Sun 29 Nov: Race 7pm. All times local/Doha (AST); gates open ahead of each session.",
};

const result = await db
  .update(experiences)
  .set({
    practicalInfo,
    editorialNote:
      (existing?.editorialNote || "") +
      " 14 Sep 2026: reworded practicalInfo.hours to lead with the actual session schedule instead of a vague 'gates open ahead of each session' opener, per founder instruction. Times themselves already matched the official formula1.com schedule (confirmed via founder screenshot, Track time toggle) — no data correction, just framing.",
    updatedAt: new Date(),
  })
  .where(eq(experiences.slug, SLUG))
  .returning({ id: experiences.id, slug: experiences.slug, status: experiences.status });

console.log("Updated:", result);
process.exit(0);
