import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "883ac422-5318-460f-819a-6ae784ac4b8c";
const EVENT_ID = "538fdb6f-0e39-49a6-ba77-32dec65d640a";
const slug = "autodromo-hermanos-rodriguez-venue-" + Date.now().toString(36);

const bodyContent = `The circuit opened in 1959 as the Autódromo Magdalena Mixiuhca, built inside a public sports park in northeast Mexico City. It's named for brothers Pedro and Ricardo Rodríguez, Mexico's first genuine Formula 1 talents — Ricardo died at 20 during practice here in 1962, Pedro nine years later racing in Germany, and the circuit has carried their names since 1972. F1 raced here through the 1960s and 70s, left the calendar for over two decades, and returned in 2015 after a full redesign that cut the new final sector straight through the Foro Sol baseball stadium built on the site in the 1990s — rather than route around it, the designers threaded turns 12 through 15 between the stadium's own grandstands, which is why this circuit doesn't look or feel like anywhere else on the calendar.

The layout itself runs 4.304km with 17 corners, built around a 1.29km main straight — one of the longest on the calendar, running from the exit of the final corner to the apex of Turn 1, and the reason overtaking into Turn 1 is one of the most reliable passing spots on the schedule. The Foro Sol stadium section (turns 12-15) splits into Foro Sol Norte and Foro Sol Sur, the two halves of the old baseball stadium, seating well over 15,000 fans in a genuine amphitheater setup — this is the loudest, most stadium-like sector on the F1 calendar, and it's also where the podium ceremony happens, so the crowd noise on a race-winning lap through here is a real, different experience from any other grandstand.

The Pit Building sits on the main straight and houses all 33 team garages on its ground floor, with grandstand seating and hospitality suites built into the floors above — Paddock Club sits directly on top of this building, which is why its balcony looks straight down onto pit lane. A two-story Media Center built for around 470 journalists sits nearby, and the wider paddock area behind the Pit Building is where team transporters and hospitality units set up for the weekend — not publicly accessible without a paddock-tier ticket, but visible in glimpses from the right vantage points around the circuit.

The venue sits inside the wider Magdalena Mixhuca sports complex, a roughly 292-hectare public sports city spanning the Iztacalco and Venustiano Carranza boroughs that also includes an Olympic-legacy velodrome and other sports facilities — it's a genuine public park the rest of the year, not a dedicated racing facility, which is part of why race weekend here feels more like a city festival built around the track than a traditional closed-circuit motor-racing weekend. Food and beverage on race weekend runs through temporary stalls and food trucks spread around the different zones rather than one central food court, so what's available depends on which part of the circuit you're in — expect a genuine range from quick Mexican street-food-style options to more considered offerings, consistent with the city's food culture generally.

Because the circuit sits at over 2,200 meters above sea level, it's the highest-altitude venue on the F1 calendar, and that affects visitors as much as it affects the cars — see the dedicated weather and altitude experience elsewhere in this pack for what that actually means for a day spent walking the grounds.`;

const whyItsSpecial = `Most circuit names on the F1 calendar are geographic or corporate — a place, a sponsor, sometimes a person honored decades after the fact with little emotional weight left attached. This one is different. The Rodríguez brothers died nine years apart, both still young, both racing, and the circuit carries their names because a country wanted to remember two of its own who never got to grow old in the sport. Walking into a venue that's also, quietly, a memorial changes how the whole weekend reads — the noise and color of the crowd sit on top of something with real history underneath it, not just a backdrop chosen for its acoustics.`;

const insiderTips = [
  "The Foro Sol stadium section was a genuine baseball park built decades after the circuit itself — if you want to understand why this track looks so different from every other F1 venue, it's because the stadium came first and the modern track was designed around it, not the other way round.",
  "Because food is spread across temporary stalls in different zones rather than one central area, don't wait until you're actually hungry to start looking — options nearer the more popular grandstands sell out or develop long lines faster than quieter corners of the circuit.",
  "If you want a real look at the Pit Building without a paddock-tier ticket, the approach to Turn 1 from the main straight gives the clearest public sightline of the building's full length and the team garages beneath it — worth timing a walk past there during a support session rather than only race day, when the crowd is thickest.",
];

const whatToAvoid = `Don't leave the circuit mid-day assuming you can pop back in — re-entry isn't permitted once you exit through a gate, confirmed directly on F1's own official visitor guidance, so treat leaving the grounds during a session day as a one-way decision, not a quick errand. And don't assume this is a purpose-built, permanent racing facility the way Silverstone or Spa are — large parts of the circuit's race-weekend infrastructure (stages, some food areas, fan zone structures) are temporary builds inside a public sports park, which is part of why the atmosphere feels more like a city festival than a traditional motor-racing weekend.`;

const practicalInfo = {
  hours: "Circuit grounds open ahead of each day's first on-track session during race weekend (30 Oct - 1 Nov 2026)",
  costRange: "Entry is via race-weekend ticket (see the Ticket Guide elsewhere in this pack) — no separate venue-only admission",
  bookingMethod: "Access the circuit via any valid race-weekend ticket — general admission, grandstand, or hospitality.",
  website: "https://www.mexicogp.mx/mapa-del-circuito/",
};

const gettingThere = "The circuit sits inside the Magdalena Mixhuca sports complex in Iztacalco, reachable via Mexico City Metro Line 9 to Ciudad Deportiva station, a walk of roughly 10-15 minutes from there to the main gates.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Autódromo Hermanos Rodríguez — Inside the Venue",
      subtitle: "Named for two brothers who died racing — the history behind F1's loudest circuit",
      slug,
      experienceType: "sports_venue",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Granjas México, Iztacalco",
      address: "Autódromo Hermanos Rodríguez, Av. Río Churubusco S/N, Granjas México, Iztacalco, 08400 Ciudad de México",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "History (1959 opening, Ricardo Rodríguez's 1962 death, Pedro Rodríguez's 1971 Norisring death, 1972 renaming) sourced from Motorsport.com's 'heartbreaking history of Mexico's first F1 stars' feature and PlanetF1's circuit history feature, cross-checked against each other for consistency, Sep 2026 — condensed to one paragraph 6 Sep 2026 per founder request to prioritize venue/facilities detail over history depth. Circuit layout (4.304km, 17 corners, 1.29km main straight, Foro Sol Norte/Sur stadium seating 15,000+) sourced from F1Chronicle's circuit profile and oversteer48.com's circuit-layout guide, 6 Sep 2026. Pit Building (33 team garages, ground floor with grandstand/hospitality above, Paddock Club positioned directly above it) and two-story ~470-capacity Media Center sourced from Motorpasion.com.mx's 2015 pre-season construction coverage — these are the same permanent structures built for the 2015 return, still in current use, not a 2026-specific renovation claim. Magdalena Mixhuca complex scale (~292 hectares, Iztacalco/Venustiano Carranza boroughs, Olympic-legacy velodrome) sourced from CDMX government's official venue page and Audiala's Magdalena Mixhuca profile, 6 Sep 2026. Capacity and food/concessions detail retained from original research (mexicocity.cdmx.gob.mx, sportsmatik.com). Insider tips and What to Avoid rebuilt 6 Sep 2026 to remove overlap with the new body content and with the Arrival & Queue Guide experience (which fully owns bag policy/prohibited items/camera rules) — 14-gate entry guidance and the re-entry restriction sourced from Formula1.com's own official 'Helpful information when visiting the Autódromo Hermanos Rodríguez' article, 6 Sep 2026, not previously covered anywhere in this pack.",
      sport: ["formula_one"],
      moodTags: ["historic", "emotional", "iconic"],
      interestCategories: ["sport", "culture"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["oct", "nov"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-06",
      googleMapsRating: "4.6",
      googleMapsReviewCount: 64717,
      googleMapsUrl: "https://maps.google.com/?cid=3746825022711309021&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #6 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
