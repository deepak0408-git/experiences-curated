// Qatar GP 2026 — fix qatar-gp-west-bay-hotel-mtymvrc6 (Four Seasons Hotel Doha, West Bay)
// whatToAvoid's first sentence ("Don't choose West Bay purely for circuit
// proximity... the case for staying here is really about the city itself,
// not the shortest commute") restated the same tradeoff already stated in
// bodyContent and whyItsSpecial — fails the hard bar in experience-researcher
// skill §5b / field table (avoid must not restate anything already said
// elsewhere in the experience). Founder flagged 14 Sep 2026, asked for a new,
// genuinely distinct angle.
// Replacement: the private beach/pool day-pass detail — QAR 375/adult, food
// & beverage credit included, bookable by non-guests — is real, sourced,
// and not mentioned anywhere else in the experience. It's a genuine planning
// fact (don't assume the beach is guest-exclusive if meeting up with others,
// or if considering a day visit before booking a room).
// Source: fourseasons.com/doha/landing-pages/property/pool-and-beach-day-pass/

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "qatar-gp-west-bay-hotel-mtymvrc6";

const whatToAvoid = `Don't assume the beach and pools are a guest-only perk worth paying a premium for privacy — Four Seasons sells day access to both for around QAR 375 per adult (with dining credit included), so non-guests can and do use the same facilities on any given day. Don't assume all West Bay hotels share this property's private beach and marina — several nearby high-rises are business-hotel format without beachfront access, so confirm the specific amenities before assuming they carry over from one address to a similarly-located one.`;

const result = await db
  .update(experiences)
  .set({
    whatToAvoid,
    editorialNote:
      "Sources: fourseasons.com/doha/dining/, forbestravelguide.com, tripadvisor.com (Nobu, Il Teatro, spa detail), visitqatar.com (location, amenities), fourseasons.com pool-and-beach-day-pass page (day pass pricing). Google Places API lookup 12 Sep 2026: 4.6/4,968 reviews (dedicated fields only). 14 Sep 2026: removed raw rating sentence, removed redundant Google Maps link paragraph, enhanced dining/spa with named venues, and replaced whatToAvoid's first sentence (restated the circuit-proximity tradeoff already in bodyContent/whyItsSpecial) with a genuinely new fact — the hotel sells beach/pool day passes to non-guests (~QAR 375/adult) — per founder instruction.",
    updatedAt: new Date(),
  })
  .where(eq(experiences.slug, SLUG))
  .returning({ id: experiences.id, slug: experiences.slug, status: experiences.status });

console.log("Updated:", result);
process.exit(0);
