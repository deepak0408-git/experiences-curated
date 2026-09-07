import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const bodyContent = `Auteuil was its own village until Paris annexed it in 1860, and it still doesn't feel like the rest of the 16th arrondissement. Rue Boileau is the street to walk for the architecture — the Vietnamese and Algerian embassies both occupy striking early-20th-century buildings — and a cluster of gated cul-de-sacs (Villa Montmorency, Villa Dietz-Monnin, Villa Molitor) hide some of the neighborhood's best Art Nouveau houses behind gates most visitors walk straight past. Rue d'Auteuil is the actual high street, with a market running every Wednesday and Saturday morning.

Auteuil sits right against Roland-Garros, not just nearby. Porte d'Auteuil, the Métro Line 10 stop, is the closest station to the stadium — a 2 to 9 minute walk depending on which gate you're heading for — and the village center along Rue d'Auteuil is a further 10-15 minute walk beyond that. It's realistic to combine a morning session at the tournament with an afternoon walking the neighborhood without any real transit time lost.

For a stay inside this character rather than looking at it from outside, two options:

Hôtel Boileau is a modest, family-run three-star a short walk from Exelmans Métro, rated consistently well across platforms (7.6-8.5 on Booking/Trip.com, 4.4/5 on Google from nearly 300 reviews). Small rooms and no elevator are the recurring, honest complaints — the tradeoff for a genuinely local, quiet-street stay. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=4857200684637475518)

Hotel Auteuil Tour Eiffel, on Rue Félicien David toward the Seine side of the neighborhood, is a four-star with a higher review volume (4.1/5 from 841 reviews) and around 1.8km/1.1mi from the stadium — a step up in comfort and price from Hôtel Boileau, still walkable but better suited to those who'd rather not carry bags up stairs. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=9127555841347791341)`;

const whyItsSpecial = `Most Roland-Garros visitors treat the 16th arrondissement purely as "the area near the stadium" and never register it contains an actual former village with its own architectural identity. That's the gap this entry fills — a genuinely under-visited pocket of Paris that happens to sit close enough to the stadium to combine with a match day rather than requiring a separate trip.

The private villas are the detail that rewards actually walking the streets rather than passing through — Auteuil has three gated pockets of genuine Art Nouveau houses within a few minutes of each other, something most Paris neighborhoods simply don't have.`;

const editorialNote = `Neighborhood history trimmed 7 Sep 2026 per founder direction — too much civic/architectural backstory, not enough tactical stay/distance information; annexation date and Rue Boileau/villa detail (from bonjourparis.com, unjourdeplusaparis.com, parisjetaime.com) kept but condensed. Porte d'Auteuil-to-stadium walking times (2-9 min depending on gate) from Moovit/Rome2Rio Roland-Garros transit guides, verified 7 Sep 2026. Hotel Auteuil Tour Eiffel (8-10 Rue Félicien David, 75016) added as a second stay option per founder direction — verified via Google Places API 7 Sep 2026, 4.1/5 from 841 reviews, ~1.8km/1.1mi from the stadium. Hôtel Boileau ratings cross-checked across Booking (7.6-8.5), Trip.com (8.5), Tripadvisor (4/5), and Google Places API (4.4/5, 297 reviews). Both hotels now carry real Google ratings via the MULTI_VENUE_RATINGS pattern rather than a single top-line rating, since this experience covers two named venues. Verified 7 Sep 2026. Hero image pending — batch pass to follow.`;

await db.update(experiences)
  .set({
    bodyContent,
    whyItsSpecial,
    editorialNote,
    address: "Hôtel Boileau, 81 Rue Boileau, 75016 Paris; Hotel Auteuil Tour Eiffel, 8-10 Rue Félicien David, 75016 Paris",
    practicalInfo: {
      hours: "Rue d'Auteuil market: Wednesday and Saturday mornings",
      address: "Hôtel Boileau: 81 Rue Boileau, 75016 Paris. Hotel Auteuil Tour Eiffel: 8-10 Rue Félicien David, 75016 Paris.",
      website: "https://www.unjourdeplusaparis.com/en/paris-balades/village-dauteuil",
      costRange: "Free to walk; Hôtel Boileau typically €90-150/night, Hotel Auteuil Tour Eiffel typically €150-250/night",
      bookingMethod: "No booking needed to walk the neighborhood. For either hotel, book directly via the hotel's site or standard platforms (Booking.com, Expedia).",
      reservationsRequired: false,
    },
  })
  .where(eq(experiences.slug, "village-dauteuil-neighborhood"));

console.log("✓ village-dauteuil-neighborhood — trimmed history, added distance/transit + second hotel + multi-venue ratings + real addresses");

await client.end();
