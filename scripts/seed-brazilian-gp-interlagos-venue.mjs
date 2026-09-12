import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9c01f960-ff51-45eb-8fd1-d55f05b7f8cb";
const EVENT_ID = "37e82616-34fd-4acb-a4b4-6575b0d674f4";
const slug = "interlagos-autodromo-jose-carlos-pace-venue-" + Date.now().toString(36);

const bodyContent = `Interlagos opened in May 1940, built into a strip of land between two reservoirs — Guarapiranga and Billings — that the city had dammed decades earlier for water and power. "Interlagos" just means "between lakes." The original layout ran a genuinely enormous 7.8km, and F1 raced that full circuit through the 1970s before a 1990 rebuild cut it down to today's 4.309km to meet new FIA length limits. The circuit was renamed in 1985 for José Carlos Pace, Brazil's first F1 race winner, killed in a plane crash in 1977 — his name has been on the venue for longer than most current fans have been alive.

The lap itself is short, anticlockwise, and drops over 40 metres of elevation in one direction only to claw it back — a genuine three-dimensional track in a sport where most circuits are flat. From the start-finish straight, the field plunges downhill through Senna's S (a left-right-left combination named for the driver who called Interlagos home even after his F1 career took him to Europe), sweeps through Curva do Sol, and climbs the long uphill Reta Oposta back toward the stadium section — the double DRS zones on the main straight and Reta Oposta both exist because this layout, short as it is, keeps producing genuine overtaking. Fifteen corners in total, and almost none of them are a straightforward radius — the elevation changes the line into nearly every one.

The Pit Building sits on the main straight, rebuilt with expanded garage and paddock space in recent years, and the Paddock Club sits directly above it — guests get a straight sightline down onto the garages and the start-finish line, plus daily pit lane walks. Twenty-one lighting towers went up in 2018, one roughly every 200 metres, though Brazil doesn't run a genuine night race — the lights are there for the shorter daylight hours a November weekend can bring and for any session that runs late. Grandstands M and B sit on the main straight looking at the grid and the garages; Grandstand D looks straight into the chaos of the opening corners.

São Paulo's altitude — the circuit sits around 800 metres above sea level — is nowhere near Mexico City's, so it doesn't affect the cars the way Interlagos' South American neighbor does. It does mean November afternoons here run cooler and rain arrives fast and hard; more than one Brazilian GP has been decided in a downpour, including the wet, chaotic 2003 and 2012 races that are still argued about today.`;

const whyItsSpecial = `Most F1 venues either predate the sport's modern safety and commercial era by decades, or were purpose-built in the last twenty years with none of that history attached. Interlagos sits in between — old enough that its 1940 opening and 1990 shortening are both still visible in how the track behaves, modern enough to have Paddock Club and LED lighting towers. What actually makes it matter is smaller and stranger: it's short by modern F1 standards, and short tracks are supposed to punish drivers with fewer chances to make a move. Interlagos does the opposite. The elevation and the double DRS zones turn a 4.3km lap into one of the most reliably chaotic races on the calendar, which is exactly why so many championships have gone down to the wire here. A venue's age tells you what it's seen. This one's layout tells you why it keeps producing races worth watching.`;

const insiderTips = [
  "Interlagos runs completely counter to the usual short-track-equals-predictable-racing rule — its two DRS zones on the main straight and Reta Oposta sit back-to-back with minimal recovery time between them, which is a real, track-specific reason overtaking chains happen here more than almost anywhere else on the calendar, not just weather luck.",
  "November in São Paulo means real rain risk, not just a chance of showers — check which grandstand you've booked against the covered/uncovered breakdown before race weekend, since Grandstands A and G are the two uncovered options and a downpour there is a very different experience from a covered stand.",
];

const whatToAvoid = `Don't assume Interlagos shares Mexico City's altitude problem — at roughly 800 metres it's a mild, unremarkable elevation that has no meaningful effect on your body or the cars, unlike the 2,200-metre Autódromo Hermanos Rodríguez three races earlier on the calendar; treat any warning about "high-altitude Brazil" as confused with Mexico. And don't picture this as a modern, purpose-built facility on the scale of newer calendar additions — large sections of the grounds are genuinely mid-20th-century infrastructure with newer buildings layered in, which is part of the atmosphere, not a flaw to route around.`;

const practicalInfo = {
  hours: "Circuit grounds open ahead of each day's first on-track session during race weekend (6-8 Nov 2026)",
  costRange: "Entry is via race-weekend grandstand or hospitality ticket — see the Ticket Guide elsewhere in this pack. Interlagos has no separate general admission product.",
  bookingMethod: "Access the circuit via any valid grandstand or hospitality ticket for the weekend.",
  website: "https://www.formula1.com/en/racing/2026/brazil",
};

const gettingThere = "The circuit sits in the Interlagos district in southern São Paulo. The nearest station is Autódromo on Line 9 (Esmeralda) of the CPTM commuter rail, roughly a 10-minute walk from the main gates — see the Getting There experience elsewhere in this pack for the full route from central São Paulo.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Interlagos — Inside the Venue",
      subtitle: "Built between two lakes in 1940, shortened in 1990 — the track behind F1's most chaotic races",
      slug,
      experienceType: "sports_venue",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Interlagos",
      address: "Autódromo José Carlos Pace, Av. Senador Teotônio Vilela, 261, Interlagos, 04329-030 São Paulo, SP, Brazil",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "History (1940 opening, Guarapiranga/Billings lake naming, 1990 shortening from 7.8km to 4.309km, 1985 renaming for José Carlos Pace) sourced from Wikipedia's Interlagos Circuit page and Autopedia/Formula One History circuit profiles, cross-checked, 11 Sep 2026. Layout detail (15 corners, 40m+ elevation change, Senna's S, Curva do Sol, Reta Oposta, dual DRS zones) sourced from Mercedes-AMG F1's corner-naming feature and Total-Motorsport's corner history piece, 11 Sep 2026. Facilities (Pit Building rebuild, Paddock Club position, 2018 lighting towers, Grandstand M/B/D positioning) sourced from GPDestinations trackside guide and RacingCircuits.info, 11 Sep 2026. Altitude figure (~800m) is a standard, widely-cited elevation for São Paulo generally, included specifically to correct the common confusion with Mexico City's much higher altitude three races earlier in the season.",
      sport: ["formula_one"],
      moodTags: ["historic", "iconic", "energetic"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-11",
      googleMapsRating: "4.6",
      googleMapsReviewCount: 39222,
      googleMapsUrl: "https://maps.google.com/?cid=3457880540196939200&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #1 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
