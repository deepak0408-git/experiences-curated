import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences } from "../schema/database.ts";
import { eq, sql } from "drizzle-orm";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "chinese-gp-ticket-guide-mud1pntb";

const newBodyContent = `Three real tiers exist once sales open. General admission is the roaming, no-assigned-seat ticket — cheapest, most flexible, and the only tier that lets you walk the circuit's perimeter across the weekend rather than committing to one grandstand; it suits a first-timer who wants to see the whole venue before deciding where they actually like to watch from, or anyone travelling on a tighter budget who'd rather spend on the trip than the seat. Reserved grandstand seating covers five named stands with genuinely different views: Grandstand A, the circuit's largest, on the main straight facing the start, finish, and podium, best for a fan who wants the full arc of a race weekend from one seat; Grandstand B, just past A, looking into the tight opening corners where first-lap incidents cluster, suited to someone who wants to watch the race actually get decided in the first few seconds; Grandstand E, the newest stand, overlooking the Turn 11-13 complex on the run toward the back straight, a good fit for a fan more interested in watching cars work through a technical sequence than a single passing moment; and Grandstand H and Grandstand K, facing each other across the hairpin at the end of the circuit's longest straight — H watches the braking-zone attempt and suits someone who wants to see a driver commit to a move, K watches whether it actually worked and suits someone who wants to see the result. Formula 1's own race guide singles out Grandstand K by name as the best seat for overtaking, and separately flags Turn 6 as the circuit's other genuine passing zone worth knowing about if K isn't available.

Above grandstand seating sits hospitality. F1 Experiences, the sport's official hospitality and travel partner, has published three 2027 package tiers already: Starter (Grandstand B or H/K, plus a pit lane walk, guided track tour, and trophy photo), a reasonable first step up for a fan who wants a taste of behind-the-scenes access without paying for the full hospitality experience; Hero (Grandstand A or B, with added "Inside F1" access), built for a fan who wants that deeper access and a better grandstand guaranteed together; and Podium | A (Grandstand A plus genuine F1 podium access, paddock insider entry, and an FIA Safety Car inspection), aimed at someone treating this trip as a genuine once-in-a-while splurge rather than a regular habit. The true top tier, the F1 Paddock Club itself — a panoramic suite above the pits, with a dedicated Gordon Ramsay dining concept for this race specifically — is confirmed to exist for 2027 but hasn't published its own package details yet; it's the tier for a fan prioritising comfort, food, and a day out over proximity to any single corner.

Every ticket at every tier, without exception, requires attendees to register full passport details several weeks ahead of the event — this is stated directly and plainly on F1's own ticketing site, applies circuit-wide, and is genuinely easy to overlook if you're used to buying F1 tickets somewhere that doesn't ask for this.`;

const newInsiderTips = [
  "If you're deciding between Grandstand H and K, the real question is which half of an overtake you want to watch: H faces the braking-zone attempt, K faces the exit and result — they're not interchangeable even though F1 Experiences sometimes bundles them as one package choice.",
  "Don't choose a grandstand purely by name recognition — Grandstand A is the biggest and most popular, but Grandstand E's view of the Turn 11-13 complex rewards a fan who wants to watch cornering technique rather than a single straight-line moment, and it's consistently less crowded than A or B.",
];

const newBookingMethod = "General admission and grandstand tickets are sold through ticketing.formula1.com/china, the circuit's official platform (Fever-powered). Hospitality packages (Starter, Hero, Podium | A) and Paddock Club access go through f1experiences.com/2027-chinese-grand-prix, F1's official hospitality partner. Buy only through these two official channels — not a reseller or third-party site.";

const newWhatToAvoid = "Don't buy from a reseller or third-party site for this circuit — general admission and grandstand tickets only go through ticketing.formula1.com, and hospitality packages only through f1experiences.com; any other channel claiming to sell Chinese GP tickets isn't official, whatever the sale status. Don't leave passport registration until race week — it's a genuine, stated requirement for every ticket type at this circuit, not a formality, and it's designed to be done well in advance.";

const [row] = await db.select({ practicalInfo: experiences.practicalInfo })
  .from(experiences)
  .where(eq(experiences.slug, SLUG));

const newPracticalInfo = { ...row.practicalInfo, bookingMethod: newBookingMethod };

await db.update(experiences)
  .set({
    bodyContent: newBodyContent,
    insiderTips: newInsiderTips,
    practicalInfo: newPracticalInfo,
    gettingThere: null,
    whatToAvoid: newWhatToAvoid,
  })
  .where(eq(experiences.slug, SLUG));

console.log("Updated chinese-gp-ticket-guide-mud1pntb: body, insiderTips, practicalInfo.bookingMethod, gettingThere cleared.");

await client.end();
