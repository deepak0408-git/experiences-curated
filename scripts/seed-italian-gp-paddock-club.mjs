import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "0b0d8f9a-911d-4cc7-8049-50e4685958ca"; // Milan
const EVENT_ID = "b93770c0-3d96-4e81-b3d0-c1e3a788fd8e"; // Italian GP 2026
const slug = "paddock-club-champions-club-hospitality-" + Date.now().toString(36);

// ─── 1. Content ───────────────────────────────────────────────────────────────
const bodyContent = `Monza runs three distinct hospitality tiers above a standard grandstand seat, and they're not interchangeable, so it's worth knowing which one you're actually being sold.

Champions Club sits in the Centrale grandstand, directly opposite the start-finish straight, and includes hospitality seating, a grid walk with a championship trophy photo, appearances from F1 insiders, and a guided paddock tour. The 2-day version has run at roughly €2,600 per person for recent seasons. It's the entry point into premium Monza, and it's still genuinely close to the action, since Centrale looks straight across at the team garages and the pit lane.

Paddock Club is the official F1 tier above that: covered seating with an outdoor balcony overlooking the team garages, an open bar running sparkling wine through to spirits, a proper sit-down lunch service, and a one-time guided tour through the actual restricted paddock where the chance of a driver selfie is real rather than promised. It's a 3-day ticket only, no single-day option, and recent comparable races have priced it somewhere between €4,500 and €6,500 per person. There's no way to buy just Sunday.

Then there's House 44, the Lewis Hamilton and Soho House collaboration that's been touring select races since 2025 and returns to Monza for 2026. It's built inside the Paddock Club footprint above the start-finish straight, styled like an actual Soho House rather than generic corporate hospitality, with its own cocktail menu and semi-regular Hamilton appearances across the weekend. For 2026 at Monza, House 44 sold out before race weekend, which tells you what kind of demand this specific product has compared with standard Paddock Club.

None of these three tiers include your race ticket automatically bundled with a hotel or flights. They're hospitality add-ons to the weekend, priced and sold separately from a standard grandstand seat, and most people buying them are doing it through F1 Experiences or an authorized reseller rather than turning up and asking at the gate.

If you're weighing which one actually matters for a client: Champions Club buys the atmosphere and the grid walk without the full paddock access. Paddock Club buys the paddock itself. House 44 buys a specific, branded experience inside that same paddock that happens to be harder to get than the standard version.`;

const whyItsSpecial = `Most Grand Prix hospitality is interchangeable between circuits: the same white marquee, the same open bar, the same generic "VIP experience" language. What's different about Monza is what's on the other side of the fence. This is a paddock that's hosted Ferrari's actual home race since before hospitality tiers existed as a concept, and a guided walk through it means walking past the exact garages the Tifosi have been screaming outside of all weekend.

House 44 selling out before the weekend even started is the detail that tells the real story here. It's not just that people want a nice lunch and a good seat. It's that they want the specific version of the paddock that has Lewis Hamilton wandering through it. At a circuit like Monza, where the crowd outside is already the loudest fan base on the calendar, that kind of demand for the tier just above them says something about how far the appetite goes.`;

const practicalInfo = {
  hours: "Friday–Sunday, 4–6 Sep 2026, circuit opening hours; Paddock Club and House 44 are 3-day only, Champions Club Centrale is available as a 2-day (Sat–Sun) or full weekend package.",
  costRange: "Champions Club (Centrale, 2-day) around €2,600pp; Paddock Club (3-day) roughly €4,500–€6,500pp depending on season and demand; House 44 pricing not published, sold out for 2026 at time of writing.",
  bookingMethod: "Champions Club and Paddock Club are sold through F1Italy.com, Formula1.com, or F1 Experiences; House 44 is sold directly through F1 Paddock Club and Soho House and tends to sell out fastest of the three.",
  howToBook: "For a client who wants paddock access without the House 44 premium, book standard Paddock Club directly through f1experiences.com or an authorized reseller like Motorsport Tickets — it moves slower than House 44 and typically still has availability into the summer of the race year. If a client specifically wants House 44, they need to move in Q1: it sold out for Monza 2026 well ahead of the weekend, and Soho House's own event notes describe it as one of a handful of races on the 2026 world tour, so allocation is tight everywhere it appears, not just at Monza. Champions Club Centrale is the more forgiving booking window of the three and a sensible fallback recommendation if Paddock Club sells out. For corporate or group bookings across any tier, F1 Experiences and GP Tours both handle multi-seat allocations and can sometimes secure inventory that's gone from the public-facing sites.",
  website: "https://www.f1italy.com/en/ticket-info/paddock-club-7",
  reservationsRequired: true,
};

const gettingThere = "Same circuit access as general admission — Trenord train to Biassono-Lesmo or Monza station, then circuit shuttle. Paddock Club and hospitality guests typically use a dedicated entrance; check your confirmation email for the specific gate.";

// ─── 2. Insert experience ─────────────────────────────────────────────────────
try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Paddock Club & Champions Club — F1 Hospitality at Monza",
      subtitle: "Open bar, a paddock tour, and a driver walking past your table. Three real tiers, three real price points.",
      slug,
      experienceType: "fan_experience",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Autodromo Nazionale Monza",
      address: "Autodromo Nazionale Monza, Parco di Monza, 20900 Monza MB, Italy",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips: [
        "House 44 sold out for Monza 2026 ahead of race weekend — if a client wants it for a future season, the booking window opens with the general Paddock Club on-sale, not separately.",
        "Champions Club Centrale looks directly across at the team garages and pit lane, so even without paddock access, it's a genuinely strong view for the price relative to Paddock Club.",
      ],
      whatToAvoid: "Don't buy Paddock Club expecting a single-day option — it's a 3-day ticket only, so a client who only wants Sunday should look at Champions Club instead. And don't assume a driver selfie or appearance is guaranteed on any tier — the paddock tour and grid walk are real and confirmed, but which drivers show up and when is never published in advance.",
      practicalInfo,
      gettingThere,
      editorialNote: "Sources: f1italy.com/en/ticket-info/paddock-club-7 (Paddock Club inclusions, 3-day only), f1experiences.com/2026-italian-grand-prix/champions-club-2-days-centrale (Champions Club Centrale price ~€2,600pp), house44atf1paddockclub.com/2026-italian-grand-prix (House 44 sold out for 2026), sohohouse.com House 44 F1 2026 world tour notes. GTG: no Monza/Italian GP listings found. Booking.com: N/A. No hero image — searched Unsplash/Pexels/Wikimedia/Flickr across two passes, all genuine F1 hospitality/paddock club VIP photos found were 'all rights reserved' (e.g. Fuji Speedway Crystal Room); seeded without image per user decision 8 Jul 2026, TODO: revisit if venue press photo becomes available. Verified 8 Jul 2026.",
      sport: ["formula_one"],
      moodTags: ["exclusive", "high-energy"],
      interestCategories: ["sport"],
      pace: "slow",
      physicalIntensity: 1,
      budgetTier: "luxury",
      budgetCurrency: "EUR",
      bestSeasons: ["sep"],
      advanceBookingRequired: true,
      availability: "event_only",
      curationTier: "editorial",
      lastVerifiedDate: "2026-07-08",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("\n✓ Experience created successfully");
  console.log("  Title: ", result.title);
  console.log("  ID:    ", result.id);
  console.log("  Slug:  ", result.slug);
  console.log("  Status:", result.status);
  console.log("\n→ Review at:    http://localhost:3000/curator/review");
  console.log("→ Experience:   http://localhost:3000/experience/" + result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
