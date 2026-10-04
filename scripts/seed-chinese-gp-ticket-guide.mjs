// Ticket Guide — Chinese GP 2027. Sources: ticketing.formula1.com/china
// (official — waitlist via Fever, passport requirement, 200,000 capacity,
// GA + Paddock Club confirmed), formula1.com/en/racing/2027/china (official
// — Grandstand K recommendation, Turn 6), f1experiences.com/2027-chinese-
// grand-prix (official F1 hospitality/travel partner — Starter/Hero/Podium
// tiers). No third-party reseller cited per founder instruction, 23 Sep
// 2026 — this experience explicitly does NOT include the standard §2k
// "verified reseller" frame other live F1 events carry, since no reseller
// has been vetted against that bar for this event yet; flagged as an open
// follow-up rather than silently applying an unverified name.
import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "998a8774-05ac-4482-ba7a-4ca2a556b963";
const EVENT_ID = "020c6a95-1b15-4a63-8a55-853656b1fe8d";
const slug = "chinese-gp-ticket-guide-" + Date.now().toString(36);

const bodyContent = `Three real tiers exist once sales open. General admission is the roaming, no-assigned-seat ticket — cheapest, most flexible, and the only tier that lets you walk the circuit's perimeter across the weekend rather than committing to one grandstand; it suits a first-timer who wants to see the whole venue before deciding where they actually like to watch from, or anyone travelling on a tighter budget who'd rather spend on the trip than the seat. Reserved grandstand seating covers five named stands with genuinely different views: Grandstand A, the circuit's largest, on the main straight facing the start, finish, and podium, best for a fan who wants the full arc of a race weekend from one seat; Grandstand B, just past A, looking into the tight opening corners where first-lap incidents cluster, suited to someone who wants to watch the race actually get decided in the first few seconds; Grandstand E, the newest stand, overlooking the Turn 11-13 complex on the run toward the back straight, a good fit for a fan more interested in watching cars work through a technical sequence than a single passing moment; and Grandstand H and Grandstand K, facing each other across the hairpin at the end of the circuit's longest straight — H watches the braking-zone attempt and suits someone who wants to see a driver commit to a move, K watches whether it actually worked and suits someone who wants to see the result. Formula 1's own race guide singles out Grandstand K by name as the best seat for overtaking, and separately flags Turn 6 as the circuit's other genuine passing zone worth knowing about if K isn't available.

Above grandstand seating sits hospitality. F1 Experiences, the sport's official hospitality and travel partner, has published three 2027 package tiers already: Starter (Grandstand B or H/K, plus a pit lane walk, guided track tour, and trophy photo), a reasonable first step up for a fan who wants a taste of behind-the-scenes access without paying for the full hospitality experience; Hero (Grandstand A or B, with added "Inside F1" access), built for a fan who wants that deeper access and a better grandstand guaranteed together; and Podium | A (Grandstand A plus genuine F1 podium access, paddock insider entry, and an FIA Safety Car inspection), aimed at someone treating this trip as a genuine once-in-a-while splurge rather than a regular habit. The true top tier, the F1 Paddock Club itself — a panoramic suite above the pits, with a dedicated Gordon Ramsay dining concept for this race specifically — is confirmed to exist for 2027 but hasn't published its own package details yet; it's the tier for a fan prioritising comfort, food, and a day out over proximity to any single corner.

Every ticket at every tier, without exception, requires attendees to register full passport details several weeks ahead of the event — this is stated directly and plainly on F1's own ticketing site, applies circuit-wide, and is genuinely easy to overlook if you're used to buying F1 tickets somewhere that doesn't ask for this.`;

const whyItsSpecial = `Most ticket guides exist to help you choose between tiers that are already on sale. This one exists to be honest about something less comfortable: for the 2027 Chinese Grand Prix, that choice doesn't exist yet, and pretending otherwise would do a first-time visitor a disservice. What this piece can do instead is give you the real shape of the decision before you have to make it — four distinct grandstands with genuinely different views, a general admission tier built for exploring rather than committing, and a hospitality ladder that runs from a modest grandstand-plus-extras package up to F1's own signature Paddock Club. Knowing that shape now, while everything is still a waitlist signup rather than a purchase, means you'll be ready to move the moment real pricing lands — which, for a circuit that regularly sells out its premium tiers well ahead of race week, is worth more than knowing a number that isn't confirmed yet.`;

const practicalInfo = {
  hours: "N/A — no gate times published yet for 2027",
  costRange: "No 2027 pricing published for any tier as of Sep 2026 — every ticket type is on a pre-sale waitlist",
  bookingMethod: "General admission and grandstand tickets are sold through ticketing.formula1.com/china, the circuit's official platform (Fever-powered). Hospitality packages (Starter, Hero, Podium | A) and Paddock Club access go through f1experiences.com/2027-chinese-grand-prix, F1's official hospitality partner. Buy only through these two official channels — not a reseller or third-party site.",
  website: "https://ticketing.formula1.com/china/, https://www.formula1.com/en/racing/2027/china, https://f1experiences.com/2027-chinese-grand-prix",
};

const gettingThere = null;

const insiderTips = [
  "If you're deciding between Grandstand H and K, the real question is which half of an overtake you want to watch: H faces the braking-zone attempt, K faces the exit and result — they're not interchangeable even though F1 Experiences sometimes bundles them as one package choice.",
  "Don't choose a grandstand purely by name recognition — Grandstand A is the biggest and most popular, but Grandstand E's view of the Turn 11-13 complex rewards a fan who wants to watch cornering technique rather than a single straight-line moment, and it's consistently less crowded than A or B.",
];

const whatToAvoid = "Don't buy from a reseller or third-party site for this circuit — general admission and grandstand tickets only go through ticketing.formula1.com, and hospitality packages only through f1experiences.com; any other channel claiming to sell Chinese GP tickets isn't official, whatever the sale status. Don't leave passport registration until race week — it's a genuine, stated requirement for every ticket type at this circuit, not a formality, and it's designed to be done well in advance.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Chinese GP Ticket Guide — Tiers, Grandstands & Strategy",
      subtitle: "GA, four named grandstands, a real hospitality ladder — honest about what's still unconfirmed for 2027.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Anting, Jiading District",
      address: "Shanghai International Circuit, No. 2000 Yining Road, Anting Town, Jiading District, Shanghai, China",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Sourced from ticketing.formula1.com/china (official — Fever-powered waitlist, passport requirement, GA + Paddock Club confirmed), formula1.com/en/racing/2027/china (K recommendation, Turn 6), f1experiences.com/2027-chinese-grand-prix (official hospitality partner tiers). No third-party reseller cited per founder instruction, 23 Sep 2026 — this experience deliberately omits the standard verified-reseller frame (§2k pattern used on other live F1 events) since no reseller has been vetted to that bar for this event yet. FLAG: revisit once a reseller can be properly verified, or once real 2027 pricing/tickets go on sale.",
      sport: ["formula_one"],
      moodTags: ["practical"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "free",
      budgetCurrency: "USD",
      bestSeasons: ["apr"],
      advanceBookingRequired: false,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: new Date().toISOString().slice(0, 10),
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("✓", result.title, "→", result.id, `(${result.slug})`, result.status);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
