import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const PARIS_ID = "488adb47-5327-43e2-8206-d40480301962";
const FRENCH_OPEN_EVENT_ID = "e6f2b585-196e-4842-8648-753a40979f4f";
const slug = "paris-landmarks-louvre-notre-dame";

const bodyContent = `The Louvre and Notre-Dame anchor opposite ends of central Paris and opposite ends of a museum-versus-monument day, and 2026 changed something about each of them worth knowing before booking either.

The Louvre introduced its first-ever nationality-based pricing in 2026: €22 for EEA residents (the EU plus Iceland, Liechtenstein and Norway), €32 for everyone else. Every standard ticket, regardless of price tier, comes with a timed entry slot built in — book online and you get a 30-minute arrival window that routes you past the general queue entirely, the actual skip-the-line mechanism rather than a separate paid add-on. Children under 18 enter free regardless of nationality, and EEA residents aged 18-25 get in free too. The ticket also covers same-day or next-day entry to the nearby Musée national Eugène-Delacroix. Book well ahead — slots for popular dates and times fill up weeks in advance. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=13363865620386383060)

Notre-Dame reopened on 7 December 2024 after the five-and-a-half-year restoration following the 2019 fire, and the cathedral itself is free to enter for everyone. There's no ticket sales system at all — entry runs through a free online reservation system, strongly recommended April through October but not strictly mandatory; walk-ins are accepted. Hours run Monday-Friday 7:50am-7pm, Saturday-Sunday 8:15am-7:30pm, until 10pm on Thursdays, with last entry 30 minutes before closing. The bell towers, reopened separately on 20 September 2025, require their own paid ticket (€16) bought exclusively through the Centre des Monuments Nationaux site — the cathedral's free entry doesn't extend up there. One date is worth flagging directly: the cathedral closes entirely 24-26 September 2026 for a papal visit, a detail that won't affect a May-June 2027 Roland-Garros trip but is worth knowing the cathedral does close for specific events. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=3909157082539624077)

Both sit close enough to the Seine and to each other that a single day covers both comfortably, museum in the morning, cathedral in the afternoon, or the reverse.`;

const whyItsSpecial = `These are the two landmarks that most define what "seeing Paris" actually means to most first-time visitors, and both are, independently, undergoing their own real moment: the Louvre adjusting its entire pricing model for the first time in its history, and Notre-Dame back from a fire that genuinely threatened to be permanent. Visiting either right now means visiting them at a specific, notable point in their long histories, not just ticking a box on a tourist checklist.

Notre-Dame in particular carries weight that's easy to underestimate until you're actually standing inside it. The restoration wasn't a foregone conclusion in 2019 — plenty of structures don't come back from fires this severe, this fast, this completely. Walking through a cathedral that was, five years ago, genuinely at risk of permanent closure, is a different experience than walking through one that's simply always been open.`;

const insiderTips = [
  "Book Louvre timed-entry slots as far ahead as possible — popular dates and time windows during May-June (Roland-Garros season, also peak Paris tourist season) sell out weeks in advance, and the timed-entry system only works if you actually have a confirmed slot.",
  "Notre-Dame's bell tower ticket (€16) is entirely separate from the free cathedral entry and sold exclusively through the Centre des Monuments Nationaux site — don't expect to buy it at the cathedral door or assume free entry covers it.",
];

const whatToAvoid = `Don't assume EEA and non-EEA Louvre pricing applies uniformly to every ticket type — this is specifically the standard admission price distinction introduced in 2026; check the exact ticket category you're buying rather than assuming the headline €22/€32 figures apply to every pass or combo ticket on the site. And don't skip Notre-Dame's free online reservation thinking walk-in access is equally reliable April through October — walk-ins are accepted, but the cathedral's own guidance specifically recommends booking ahead during those months, meaning a walk-in visitor risks a longer wait or a less convenient entry time than someone who reserved.`;

const practicalInfo = {
  address: "Louvre: Rue de Rivoli, 75001 Paris. Notre-Dame: 6 Parvis Notre-Dame – Place Jean-Paul II, 75004 Paris.",
  website: "https://www.louvre.fr, https://www.notredamedeparis.fr",
  hours: "Louvre: check official site for current daily hours, typically closed Tuesdays. Notre-Dame: Mon-Fri 07:50-19:00, Sat-Sun 08:15-19:30, Thu until 22:00.",
  costRange: "Louvre €22 (EEA) / €32 (non-EEA), free under 18 and EEA 18-25. Notre-Dame free entry; bell tower €16.",
  bookingMethod: "Louvre: book timed-entry tickets online well in advance via louvre.fr. Notre-Dame: free online reservation recommended April-October via notredamedeparis.fr; walk-ins accepted. Bell tower tickets via the Centre des Monuments Nationaux site only.",
  reservationsRequired: true,
};

const gettingThere = `Louvre: Palais-Royal–Musée du Louvre (Métro Lines 1, 7). Notre-Dame: Cité or Saint-Michel (Métro Line 4, or RER B/C). Both sit within walking distance of each other along the Seine's Right Bank/Île de la Cité.`;

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Paris Landmarks — Louvre & Notre-Dame",
      subtitle: "A museum with new pricing, a cathedral back from the brink — both anchoring central Paris",
      slug,
      experienceType: "cultural_site",
      status: "in_review",
      destinationId: PARIS_ID,
      sportingEventId: FRENCH_OPEN_EVENT_ID,
      neighborhood: "1st / 4th arrondissement",
      address: "Rue de Rivoli, 75001 Paris, France",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Louvre 2026 dual-pricing (€22 EEA / €32 non-EEA) from afar.com and artvisitguide.com. Notre-Dame reopening (7 Dec 2024), hours, free entry, bell tower (€16, reopened 20 Sep 2025), and papal-visit closure (24-26 Sep 2026) from notredamedeparis.fr official FAQ. Both ratings verified via Places API: Louvre 4.7/376,048, Notre-Dame 4.7/99,161. Multi-venue — MULTI_VENUE_RATINGS registry entry required, venueCount=2. Verified 4 Sep 2026. Hero image pending — batch pass to follow.",
      moodTags: ["iconic", "must-see", "historic"],
      interestCategories: ["culture_and_history"],
      pace: "moderate",
      physicalIntensity: 2,
      budgetTier: "moderate",
      budgetCurrency: "EUR",
      budgetMinCost: "0",
      budgetMaxCost: "32",
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
