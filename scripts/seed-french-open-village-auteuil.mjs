import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const PARIS_ID = "488adb47-5327-43e2-8206-d40480301962";
const FRENCH_OPEN_EVENT_ID = "e6f2b585-196e-4842-8648-753a40979f4f";
const slug = "village-dauteuil-neighborhood";

const bodyContent = `Auteuil was its own separate village until 1860, when Paris annexed it along with a handful of other outlying communes, and it has spent the century and a half since quietly refusing to feel like the rest of the 16th arrondissement. Before the annexation, this was rural high ground above the Seine, owned by the Abbey of St-Geneviève, known for its hot springs and its wine. Between the 1600s and 1700s a dozen or so grand aristocratic properties went up here; from 1830 the bourgeoisie and a wave of artists joined them, renting more modest houses in what was still, functionally, a village.

That layered history shows up directly in the architecture. Rue Boileau is the street to walk for it: the Vietnamese embassy at no. 62 sits in an unusual purpose-built structure, while the Hôtel Danois at no. 40 blends Art Nouveau with genuinely Oriental architectural details, now home to the Algerian embassy. Beyond the street itself, a cluster of private cul-de-sacs, Villa Montmorency, Villa Dietz-Monnin, Villa Molitor, hide some of the neighborhood's best domestic Art Nouveau behind gates most visitors walk straight past. Notre-Dame d'Auteuil, a Romano-Byzantine church from 1892, anchors the district's more public architecture.

Rue d'Auteuil itself is the neighborhood's actual high street: specialty shops, local businesses, and a market that's run every Wednesday and Saturday morning for generations, not staged for visitors but genuinely still serving the people who live here.

For a place to stay inside this character rather than looking at it from outside, Hôtel Boileau earns its place: a modest, family-run three-star a short walk from Exelmans Métro, rated consistently well across platforms (7.6-8.5 on Booking/Trip.com, 4.4/5 on Google from nearly 300 reviews). [See live rating and reviews on Google Maps](https://maps.google.com/?cid=4857200684637475518) Small rooms and no elevator are the recurring, honest complaints — the tradeoff for a genuinely local, quiet-street stay in a neighborhood most Roland-Garros visitors never actually explore.`;

const whyItsSpecial = `Most Roland-Garros visitors treat the 16th arrondissement purely as "the area near the stadium" and never register that it contains an actual former village with its own distinct architectural identity. That's the gap Village d'Auteuil fills — not a manufactured "hidden gem" narrative, but a genuinely under-visited pocket of Paris that happens to sit a walk away from a Grand Slam tournament most of its visitors will only ever see from inside the stadium gates.

The private villas are the detail that rewards actually walking the streets rather than just passing through. Paris doesn't have many neighborhoods where a gate on an ordinary residential street opens onto a hidden cul-de-sac of genuine Art Nouveau houses — Auteuil has three of them within a few minutes' walk of each other. Combine a morning at the tournament with an afternoon walk down Rue Boileau and through the market on Rue d'Auteuil, and you've had two entirely different, equally real versions of the same corner of Paris in a single day.`;

const insiderTips = [
  "The Rue d'Auteuil market runs Wednesday and Saturday mornings only — plan a non-match morning around it if visiting on the right day, since it's a genuine, long-running local market rather than a daily tourist draw.",
  "The private villas (Villa Montmorency, Villa Dietz-Monnin, Villa Molitor) are residential cul-de-sacs behind gates — walk past respectfully during daytime hours rather than treating them as an open tourist attraction; residents live there year-round.",
];

const whatToAvoid = `Don't book Hôtel Boileau expecting an elevator or spacious rooms — both are recurring, honest complaints across review platforms, and guests with mobility concerns or heavy luggage should factor this in before booking. And don't rush through Auteuil expecting it to look distinctly "village-like" from the main roads alone — the character reveals itself on the side streets and in the private villas, not from Avenue Mozart or the main arterial roads that cut through the district, so a walking route that actually detours onto Rue Boileau and into the villa entrances matters more than a quick drive-through would suggest.`;

const practicalInfo = {
  address: "Auteuil, 75016 Paris, France",
  website: "https://www.unjourdeplusaparis.com/en/paris-balades/village-dauteuil",
  hours: "Rue d'Auteuil market: Wednesday and Saturday mornings",
  costRange: "Free to walk; Hôtel Boileau typically €90-150/night",
  bookingMethod: "No booking needed to walk the neighborhood. For Hôtel Boileau, book directly via the hotel's site or standard platforms (Booking.com, Expedia).",
  reservationsRequired: false,
};

const gettingThere = `Exelmans (Métro Line 9) and Michel-Ange–Auteuil (Lines 9 and 10) both sit within the neighborhood, a short walk from Rue d'Auteuil and Rue Boileau. Porte d'Auteuil (Line 9) connects directly toward Roland-Garros.`;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Village d'Auteuil",
      subtitle: "A former separate village hiding Art Nouveau villas behind gates most visitors miss",
      slug,
      experienceType: "neighborhood",
      status: "in_review",
      destinationId: PARIS_ID,
      sportingEventId: FRENCH_OPEN_EVENT_ID,
      neighborhood: "Auteuil, 16th arrondissement",
      address: "Auteuil, 75016 Paris, France",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Neighborhood history (1860 annexation, aristocratic origins, Art Nouveau architecture) from bonjourparis.com and unjourdeplusaparis.com. Rue Boileau/villa detail from parisjetaime.com. Hôtel Boileau ratings cross-checked across Booking (7.6-8.5), Trip.com (8.5), Tripadvisor (4/5), and Google Places API (4.4/5, 297 reviews) — consistent, well-attested pick, cited inline rather than as a top-level rating since this experience's primary subject is the neighborhood, not the hotel. Verified 4 Sep 2026. Hero image pending — batch pass to follow.",
      moodTags: ["charming", "authentic", "quiet"],
      interestCategories: ["culture_and_history", "accommodation"],
      pace: "slow",
      physicalIntensity: 2,
      budgetTier: "budget",
      budgetCurrency: "EUR",
      budgetMinCost: "90",
      budgetMaxCost: "150",
      bestSeasons: ["may"],
      advanceBookingRequired: false,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-04",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: FRENCH_OPEN_EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created:", result.title, "→", result.slug, `(${result.status})`);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
