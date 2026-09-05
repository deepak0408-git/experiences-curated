import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const PARIS_ID = "488adb47-5327-43e2-8206-d40480301962";
const FRENCH_OPEN_EVENT_ID = "e6f2b585-196e-4842-8648-753a40979f4f";
const slug = "paris-icons-eiffel-tower-seine-arc-de-triomphe";

const bodyContent = `A first Roland-Garros trip is often a first Paris trip, and for a non-match day, three landmarks cover the essential version of the city in a single afternoon and evening: the Eiffel Tower, a Seine cruise, and the Arc de Triomphe's rooftop.

The Eiffel Tower's ticketing changed meaningfully in recent years — there's no longer a stairs option all the way to the summit. Second-floor lift access runs €23.50 and is, honestly, the better buy for most visitors: the view connects more directly to the city below and the slot books out later than summit tickets. The combo of stairs to the second floor plus a lift to the top costs €28, the cheapest genuine summit route; a direct lift straight to the summit runs €36.70. From late September 2026, even the stairs option requires advance booking, so this is not a walk-up attraction regardless of budget. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=10222232094831998944)

A Seine cruise pairs naturally with the tower, since most operators depart from directly beneath it. An hour on the water takes in the Louvre, Notre-Dame, the Musée d'Orsay and the Hôtel de Ville from the river rather than the street, and late-afternoon departures around 5-6pm hit golden hour with fewer crowds than midday sailings — sometimes catching the tower's lights coming on just as the cruise ends.

The Arc de Triomphe's rooftop is the third stop, and arguably the most underrated of the three. Standard rooftop entry starts at €15, with guided summit tours from €25 and a Seine-cruise combo from €45. The climb is 284 steps (an underground passage provides step-free access to the monument itself, though not to the rooftop), and the payoff is a genuinely different angle on the city: twelve avenues radiating out from directly beneath you, the Champs-Élysées running straight toward the Louvre, and the Eiffel Tower visible in the distance, especially striking at sunset when it's lighting up while you watch from above.

All three sit close enough together, Eiffel Tower, the river, Arc de Triomphe via the Champs-Élysées, to realistically cover in one extended afternoon and evening.`;

const whyItsSpecial = `These three landmarks earn the "icons" label honestly rather than by default — between them they cover nearly 800,000 combined Google reviews at a 4.7 average, a level of sustained praise that very few attractions anywhere maintain at that scale. That's not a coincidence or inertia; it's what genuinely works about them holding up trip after trip, view after view. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=15687558599447307325)

The sequencing matters more than people expect. Doing the tower first, then the river at golden hour, then finishing at the Arc de Triomphe for sunset gives you the same city from three genuinely different vantage points, in ascending order of how quiet and how personal the experience gets — thousands of people at the tower, dozens on the boat, and by the time you're on the Arc's rooftop at sunset, a genuinely intimate view of a very unintimate city.`;

const insiderTips = [
  "Book Eiffel Tower tickets well ahead regardless of which tier — from late September 2026 even stair tickets need advance reservation, and second-floor lift tickets (the best-value option at €23.50) sell out fastest since most visitors correctly prefer them over the pricier summit ticket.",
  "Time a Seine cruise for 5-6pm departure specifically — golden hour lighting plus a real chance of catching the Eiffel Tower's lights switching on right as the cruise ends, a detail that midday sailings simply can't replicate.",
];

const whatToAvoid = `Don't buy a full summit Eiffel Tower ticket assuming it's the "complete" experience — the second-floor lift ticket is genuinely the better view for most visitors according to repeat guidance, connecting more directly to the city below, and it costs €13 less than the summit option. And don't climb the Arc de Triomphe's 284 steps assuming the underground passage gets you to the rooftop too — the passage only provides safe, step-free access to the monument itself; reaching the actual rooftop viewing platform still requires the stairs (or the separate paid VIP elevator option).`;

const practicalInfo = {
  address: "Eiffel Tower: Champ de Mars, 5 Avenue Anatole France, 75007 Paris. Arc de Triomphe: Place Charles de Gaulle, 75008 Paris.",
  website: "https://www.toureiffel.paris/en/rates-opening-times, https://www.bateauxparisiens.com/en/cruise-tours.html, https://www.paris-arc-de-triomphe.fr",
  hours: "Eiffel Tower: daily 09:15-23:45 (seasonal variation); Arc de Triomphe: daily 10:00-22:30 (seasonal variation)",
  costRange: "Eiffel Tower €23.50-36.70; Seine cruise typically €15-25; Arc de Triomphe rooftop from €15 (combo packages from €45)",
  bookingMethod: "Book all three online in advance via their official sites — Eiffel Tower tickets specifically sell out fastest and increasingly require advance booking even for stairs access.",
  reservationsRequired: true,
};

const gettingThere = `Bir-Hakeim or Trocadéro (Métro Line 6 and 9 respectively) serve the Eiffel Tower; most Seine cruises depart from piers directly beneath the tower. Charles de Gaulle–Étoile (Métro Lines 1, 2, 6, RER A) serves the Arc de Triomphe, connected to the Eiffel Tower area via the Champs-Élysées.`;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Paris Icons — Eiffel Tower, Seine & Arc de Triomphe",
      subtitle: "One afternoon, three landmarks, and the city's best sunset view from a rooftop most visitors skip",
      slug,
      experienceType: "cultural_site",
      status: "in_review",
      destinationId: PARIS_ID,
      sportingEventId: FRENCH_OPEN_EVENT_ID,
      neighborhood: "7th / 8th arrondissement",
      address: "Champ de Mars, 75007 Paris, France",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Eiffel Tower 2026 pricing (€23.50 second floor, €28 combo, €36.70 summit) and Sept 2026 stairs-booking change from thebettervacation.com and francetravel.wiki. Seine cruise timing/route from bateauxparisiens.com and parisjetaime.com. Arc de Triomphe pricing (€15-45 tiers, 284 steps) from headout.com. Both Eiffel Tower and Arc de Triomphe ratings verified via Places API: Eiffel Tower 4.7/494,972, Arc de Triomphe 4.7/298,109. Multi-venue — MULTI_VENUE_RATINGS registry entry required, venueCount=2 (Seine cruise has no single defensible venue rating to link). Verified 4 Sep 2026. Hero image pending — batch pass to follow.",
      moodTags: ["iconic", "romantic", "must-see"],
      interestCategories: ["culture_and_history"],
      pace: "active",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "EUR",
      budgetMinCost: "15",
      budgetMaxCost: "45",
      bestSeasons: ["may"],
      advanceBookingRequired: true,
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
