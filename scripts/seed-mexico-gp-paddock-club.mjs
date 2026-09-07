import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "883ac422-5318-460f-819a-6ae784ac4b8c";
const EVENT_ID = "538fdb6f-0e39-49a6-ba77-32dec65d640a";
const slug = "mexico-city-gp-paddock-club-" + Date.now().toString(36);

const bodyContent = `The F1 Paddock Club sits directly above the team garages on the main straight, a covered, climate-controlled suite with an outdoor balcony looking straight down onto the starting grid and pit lane. This is the top hospitality tier at every race on the calendar, and Mexico City's version includes everything the format is known for: a premium open bar running spirits, champagne, wine, and beer all weekend, food stations rather than a single set menu, a one-time guided tour of the actual paddock led by F1 hosts, and pit lane walks where you get close enough to watch a real pit stop being practiced. There's usually an appearance from a recognizable F1 name over the weekend as well, though who that is varies race to race and isn't confirmed far in advance.

One rung below Paddock Club sits the Champions Club, F1 Experiences' second hospitality tier, positioned on the main straight a short walk from the Main Grandstand — you get views of the grid, the finish line, and into the team garages and pit lane, without paying for the paddock-level position itself. Food here runs canapés, light snacks, and a curated lunch rather than full food stations, still with an open bar of sparkling wine, beer, wine, and soft drinks. Champions Club guests also get a Grid Walk with a photo opportunity next to the Championship Trophy on Saturday, plus a guided paddock tour — a genuinely different, lower-cost way into some of the same access points Paddock Club offers.

Both tiers are sold as 3-day packages covering the full weekend, not single-day options, and both are run through F1 Experiences, the officially licensed hospitality operator for the sport — not a third-party reseller. That matters here specifically because Mexico City's overall ticket demand is unusually high (see the Ticket Guide elsewhere in this pack): general admission and grandstand seats sell out fast, and hospitality inventory, while more expensive, is also genuinely finite and has sold out in past seasons before race week.

If you're deciding between the two tiers, the real trade is proximity versus price: Paddock Club puts you physically above the garages with full food service and the most complete paddock access; Champions Club gets you most of the same grid-walk and paddock-tour experiences at a meaningfully lower price point, just without the elevated suite position.`;

const whyItsSpecial = `Hospitality tiers can feel like the same experience with different price tags attached, but at Mexico City specifically the physical position genuinely changes what you see. Paddock Club sits directly above where the pit stops happen — you're watching mechanics work in real time, not on a screen. That's a different kind of access than most circuits offer even at the top tier, because not every track lets hospitality guests get physically this close to the operational side of the sport. Combined with a race weekend already running at a fever pitch of crowd energy below in the grandstands, the Paddock Club position turns the loudest race on the calendar into something you're watching from directly above the action rather than across a fence from it.`;

const insiderTips = [
  "Champions Club gets you the Grid Walk, the paddock tour, and views into the same garages Paddock Club overlooks, at a materially lower price — worth serious consideration if the paddock-level suite position itself isn't the specific draw for you.",
  "Because Mexico City's overall demand is unusually high, hospitality inventory here has sold out before race week in past seasons — treat the booking window the same way you'd treat grandstand tickets, not as something with unlimited availability right up to the date.",
];

const whatToAvoid = `Don't show up in flip-flops, beach wear, or gym clothes assuming hospitality means anything-goes — F1 Experiences enforces a smart-casual dress code across both tiers, and those three categories specifically are turned away at entry regardless of ticket type. Smart jeans and tailored shorts are fine, but pack accordingly rather than finding out at the gate. And don't leave booking until close to race week assuming hospitality always has room — unlike general admission resale, hospitality packages here don't reliably reappear once sold out, since they're a fixed, catered headcount rather than a seat that can be resold individually.`;

const practicalInfo = {
  hours: "Both tiers run across all 3 days of race weekend (30 Oct - 1 Nov 2026), doors open ahead of each day's first session",
  costRange: "Champions Club from approximately US$5,600 for 3 days · F1 Paddock Club from approximately US$9,600 for 3 days — both all-inclusive of food and beverage",
  bookingMethod: "Book through F1 Experiences, the sport's officially licensed hospitality partner, via f1experiences.com or Formula1.com's own hospitality pages.",
  howToBook: "If you want the Paddock Club specifically, call F1 Experiences directly at +1 718-682-7493 rather than relying only on the online booking flow — Mexico City's hospitality inventory has sold out before race week in past seasons, and a phone call gets you a real person who can tell you current availability by suite section, something the website's standard checkout won't show you. Ask specifically about Champions Club as a fallback in the same call if Paddock Club is already tight — it's a lower price point with real overlap in what you get (Grid Walk, paddock tour) and is worth comparing live with an agent rather than assuming Paddock Club is your only option once you're already on the phone.",
  website: "https://f1experiences.com/2026-mexico-city-grand-prix, https://tickets.formula1.com/en/pc-4861-mexico-paddock-club",
};

const gettingThere = "Paddock Club and Champions Club entry uses dedicated hospitality gates, separate from general grandstand and GA entrances — your confirmation will specify which gate to use; arrive with time to spare since hospitality check-in is more thorough than a standard ticket scan.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "F1 Paddock Club & Champions Club — Mexico City",
      subtitle: "Two hospitality tiers, one above the garages — here's the real difference",
      slug,
      experienceType: "fan_experience",
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
      editorialNote: "Paddock Club/Champions Club inclusions and locations sourced from F1Experiences.com's official 2026 Mexico City Grand Prix hospitality pages and Formula1.com's own Paddock Club ticketing page, Sep 2026. F1 Experiences contact number (+1 718-682-7493) sourced from motosportstravel.com/raceexperiences.com listings referencing F1 Experiences' official contact line — confirmed as the standard F1 Experiences customer line used across multiple GP listings, not specific to a third-party reseller.",
      sport: ["formula_one"],
      moodTags: ["luxury", "vip", "premium"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "luxury",
      budgetCurrency: "USD",
      bestSeasons: ["oct", "nov"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-06",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #4 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
