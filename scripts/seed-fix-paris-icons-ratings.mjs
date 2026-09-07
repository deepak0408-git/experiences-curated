import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const [row] = await db
  .select({ bodyContent: experiences.bodyContent, editorialNote: experiences.editorialNote })
  .from(experiences)
  .where(eq(experiences.slug, "paris-icons-eiffel-tower-seine-arc-de-triomphe"));

const oldCruise =
  "A Seine cruise pairs naturally with the tower, since most operators depart from directly beneath it. An hour on the water takes in the Louvre, Notre-Dame, the Musée d'Orsay and the Hôtel de Ville from the river rather than the street, and late-afternoon departures around 5-6pm hit golden hour with fewer crowds than midday sailings — sometimes catching the tower's lights coming on just as the cruise ends.";

const newCruise =
  "Bateaux Parisiens, departing from Port de la Bourdonnais directly beneath the tower, is the pick for the Seine leg — one of the largest operators on the river, well-reviewed at real volume. An hour on the water takes in the Louvre, Notre-Dame, the Musée d'Orsay and the Hôtel de Ville from the river rather than the street, and late-afternoon departures around 5-6pm hit golden hour with fewer crowds than midday sailings — sometimes catching the tower's lights coming on just as the cruise ends. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=1827355776205250316)";

const oldArc =
  "the payoff is a genuinely different angle on the city: twelve avenues radiating out from directly beneath you, the Champs-Élysées running straight toward the Louvre, and the Eiffel Tower visible in the distance, especially striking at sunset when it's lighting up while you watch from above.";

const newArc =
  "the payoff is a genuinely different angle on the city: twelve avenues radiating out from directly beneath you, the Champs-Élysées running straight toward the Louvre, and the Eiffel Tower visible in the distance, especially striking at sunset when it's lighting up while you watch from above. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=15687558599447307325)";

if (!row.bodyContent.includes(oldCruise) || !row.bodyContent.includes(oldArc)) {
  throw new Error("Expected sentences not found in body_content — aborting to avoid a silent no-op.");
}

const bodyContent = row.bodyContent.replace(oldCruise, newCruise).replace(oldArc, newArc);

const editorialNote =
  (row.editorialNote ?? "") +
  " Updated 7 Sep 2026: Seine cruise operator named explicitly (Bateaux Parisiens, Port de la Bourdonnais) with its Google rating (4.3/5, 31,422 reviews) added; Arc de Triomphe Google rating added (4.7/5, 298,336 reviews). Both verified via Google Places API and cross-checked against the founder's own Google Maps screenshots. Experience now covers 3 rated landmarks (Eiffel Tower, Bateaux Parisiens, Arc de Triomphe) — MULTI_VENUE_RATINGS venueCount updated from 2 to 3.";

await db.update(experiences)
  .set({ bodyContent, editorialNote })
  .where(eq(experiences.slug, "paris-icons-eiffel-tower-seine-arc-de-triomphe"));

console.log("✓ paris-icons-eiffel-tower-seine-arc-de-triomphe — Bateaux Parisiens named + rated, Arc de Triomphe rating added");

await client.end();
