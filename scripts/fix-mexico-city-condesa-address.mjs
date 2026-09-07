import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const EXPERIENCE_ID = "beb0a3f4-97bc-4c8b-bea9-c77ce72afd45";

const address = "Condesa df: Av. Veracruz 102, Col. Condesa, Cuauhtémoc, 06700 Ciudad de México. Casa Cuenca: Cuernavaca 4, Col. Condesa, Cuauhtémoc, 06140 Ciudad de México.";

const editorialNote = "Condesa neighborhood character sourced from CasaGoliana.com's Roma-vs-Condesa comparison, Sep 2026. Hotel picks (Hotel CondesaDF, Casa Cuenca) sourced from BridgesAndBalloons.com and Hotel-Scoop.com boutique roundups; Google ratings via Places API lookup same session (CondesaDF 4.3/2,537 reviews, Casa Cuenca 4.4/67 reviews — smaller but above the thin-count threshold, noted explicitly in body copy). Multi-venue: MULTI_VENUE_RATINGS entry required, venueCount 2. Check-in/check-out times added 7 Sep 2026: Condesa df (3:00pm/12:00pm) and Casa Cuenca (3:00pm-midnight/12:00pm) sourced from Momondo/Tripadvisor and Booking.com/Trip.com listings respectively. Real addresses added 7 Sep 2026: Condesa df (Av. Veracruz 102, corroborated on Yelp and HotelPlanner listings) and Casa Cuenca (Cuernavaca 4, corroborated on Tablet Hotels and Michelin Guide listings — not listed on the hotel's own site). bookingLinks replaced 7 Sep 2026 with the founder's own real affiliate URLs (per feedback_affiliate_link_generation.md — identification only is done here, the founder generates the actual affiliate link) plus distinct per-hotel `label` values, after the original plain non-affiliate URLs were found to have been written in error during initial seeding.";

const [result] = await db
  .update(experiences)
  .set({ address, editorialNote, lastVerifiedDate: "2026-09-07" })
  .where(eq(experiences.id, EXPERIENCE_ID))
  .returning({ id: experiences.id, title: experiences.title });

console.log(`✓ Updated: ${result.title}`);
await client.end();
