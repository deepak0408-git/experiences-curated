import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "e21441e5-0f88-46c3-99a5-0d73ba603024"; // Getting to Interlagos

const practicalInfo = {
  hours: "F1 Express shuttles run 6am-1pm Friday through Sunday of race weekend; Metrô Line 9 runs standard citywide operating hours",
  website: "https://www.brasilf1.com/en/by-mass-transport",
  costRange: "Metrô: R$5.40 (~US$1) per ride on the standard Bilhete Único. F1 Express shuttle: 27 BRL one-way / 38 BRL round-trip (~US$5-8)",
  bookingMethod: "No advance booking needed for either option — buy a Bilhete Único card at any metro station, or pay for the F1 Express shuttle at the departure point.",
};

const editorialNote = "All transit detail (Metrô Line 9/Esmeralda to Autódromo stop ~500m from circuit, F1 Express shuttle routes/pickup points/pricing/hours, Bilhete Único card requirement) sourced directly from brasilf1.com's own official 'By Mass Transport' page, 11 Sep 2026 — this is the official race-ticketing site's own transit guidance, the highest-confidence source available for this fact set. Driving/parking discouragement is standard, widely-corroborated advice across every travel-guide source checked, not a single-sourced claim. Metrô single-trip fare (R$5.40) confirmed directly on metro.sp.gov.br's official 'Bilhetes e Cartões' page, 12 Sep 2026.";

const [row] = await db
  .update(experiences)
  .set({ practicalInfo, editorialNote })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ title: experiences.title, practicalInfo: experiences.practicalInfo });

console.log("✓", row.title, "→", row.practicalInfo.costRange);
await client.end();
