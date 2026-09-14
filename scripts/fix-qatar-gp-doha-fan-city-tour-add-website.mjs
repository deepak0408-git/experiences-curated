// Qatar GP 2026 — fix qatar-gp-doha-fan-city-tour-mtyn7fqi: add a second
// website (GetYourGuide listing) alongside the existing Viator link,
// comma-separated per the multi-operator website field rule (bookingMethod
// already names GetYourGuide, Viator, and tourHQ as options). Founder
// instruction 14 Sep 2026.

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "qatar-gp-doha-fan-city-tour-mtyn7fqi";

const [existing] = await db
  .select({ practicalInfo: experiences.practicalInfo, editorialNote: experiences.editorialNote })
  .from(experiences)
  .where(eq(experiences.slug, SLUG));

const practicalInfo = {
  ...existing.practicalInfo,
  website:
    "https://www.viator.com/Doha-tours/City-Tours/d4453-g12-c5330, https://www.getyourguide.com/doha-l1885/doha-guided-city-tour-with-airport-and-hotel-pickup-t633791",
};

const result = await db
  .update(experiences)
  .set({
    practicalInfo,
    editorialNote:
      (existing?.editorialNote || "") +
      " 14 Sep 2026: added GetYourGuide listing as a second, comma-separated website entry alongside the existing Viator link, per founder instruction — matches bookingMethod's existing mention of both platforms.",
    updatedAt: new Date(),
  })
  .where(eq(experiences.slug, SLUG))
  .returning({ id: experiences.id, slug: experiences.slug, status: experiences.status });

console.log("Updated:", result);
process.exit(0);
