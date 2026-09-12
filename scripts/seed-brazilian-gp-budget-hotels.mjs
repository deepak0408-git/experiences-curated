import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { experiences, sportingEventExperiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const DESTINATION_ID = "9c01f960-ff51-45eb-8fd1-d55f05b7f8cb";
const EVENT_ID = "37e82616-34fd-4acb-a4b4-6575b0d674f4";
const slug = "brazilian-gp-budget-hotels-morumbi-" + Date.now().toString(36);

const bodyContent = `Not everyone wants Jardins prices for a race weekend, and Morumbi — the neighborhood directly between central São Paulo and Interlagos — has two genuinely solid options that trade boutique polish for a shorter commute and a real price break.

Blue Tree Premium Verbo Divino is the better of the two if you want something closer to a proper hotel experience. It's a 4-star business hotel geared toward corporate travelers most of the year, close to Morumbi Shopping and Market Place mall, with the kind of consistent, professional service that comes from a hotel built for repeat business guests rather than one-off tourists. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=11954665115420635314&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA) — it holds a strong, well-attested rating from a large review sample.

Ibis Budget São Paulo Morumbi is the more stripped-down option — 378 rooms, air conditioning, free WiFi, and not much beyond that, which is exactly the point at this price tier. Rooms are clean and reliably consistent across the Ibis Budget chain, and reviewers specifically call out cleanliness as a strength here. It won't feel special, but for a few nights built around race sessions rather than time spent in the room, that's a fair trade. [See live rating and reviews on Google Maps](https://maps.google.com/?cid=10388608763370266040&g_mp=Cidnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaFRleHQQAhgEIAA) for current guest sentiment.

Both sit in Morumbi or Campo Belo, meaningfully closer to Interlagos than Jardins or Itaim Bibi — a real advantage on an early gate-opening day when you'd rather sleep in an extra 20-30 minutes than save on a hotel bill and lose that time in transit instead.`;

const whyItsSpecial = `A race weekend doesn't require a special hotel — it requires a hotel that gets you to the circuit without friction and lets you sleep properly in between long days. Morumbi's two real options prove that trade works: neither is trying to be a destination in itself, and that's fine, because the destination this weekend is Interlagos, not your room. The genuine, well-reviewed consistency at both properties — not glamour, just reliability — is worth more here than it would be on a trip built around the hotel itself.`;

const insiderTips = [
  "Morumbi and Campo Belo's real advantage isn't price alone — it's proximity to Interlagos specifically, which matters most on early session days when a shorter commute buys you real extra sleep rather than just saving money.",
  "Ibis Budget's 378-room scale means it rarely sells out completely even close to race weekend — if you're booking late and Jardins/Itaim options are gone, this is one of the more reliable options still likely to have rooms.",
];

const whatToAvoid = `Don't expect Morumbi itself to have much of a food or nightlife scene to walk to — it's a business and shopping-mall district, not a neighborhood built for evening wandering, so plan to eat near the mall, order in, or travel to Jardins/Vila Madalena for a proper night out. And don't book Ibis Budget expecting hotel-standard extras like a full breakfast spread or a fitness center — it's a genuinely no-frills budget chain, and the value is in the clean, consistent basics, not added amenities.`;

const practicalInfo = {
  hours: "Standard hotel check-in/check-out (verify exact times directly with each property when booking)",
  costRange: "Blue Tree Premium Verbo Divino: roughly US$70-110/night. Ibis Budget São Paulo Morumbi: roughly US$35-55/night. Both carry a race-weekend premium.",
  bookingMethod: "Book directly via each hotel's website, or through Booking.com/Expedia — both properties are listed on major platforms.",
  website: "https://all.accor.com, https://www.bluetree.com.br",
};

const gettingThere = "Both hotels sit in Morumbi, closer to Interlagos than the Jardins/Itaim Bibi area — check each property's exact address against the nearest Line 9 (Esmeralda) station or plan for a short rideshare to the Autódromo stop.";

try {
  const [result] = await db
    .insert(experiences)
    .values({
      title: "Budget & Mid-Range Stays Near Interlagos",
      subtitle: "Blue Tree Premium Verbo Divino and Ibis Budget Morumbi — closer to the circuit, easier on the wallet",
      slug,
      experienceType: "accommodation",
      status: "in_review",
      destinationId: DESTINATION_ID,
      sportingEventId: EVENT_ID,
      neighborhood: "Morumbi / Campo Belo",
      address: "Morumbi and Campo Belo districts, São Paulo, SP, Brazil",
      heroImageUrl: null,
      bodyContent,
      whyItsSpecial,
      insiderTips,
      whatToAvoid,
      practicalInfo,
      gettingThere,
      editorialNote: "Both properties confirmed currently operating and rated via Tripadvisor listings, 11 Sep 2026: Blue Tree Premium Verbo Divino (#40/423 SP hotels, 3/5 Tripadvisor scale), Ibis Budget São Paulo Morumbi (#142/423, 3/5 Tripadvisor, 9.1 couples score, 378 rooms, praised for cleanliness). Real Google Maps ratings confirmed via Places API, 11 Sep 2026: Blue Tree 4.3/5,564 reviews; Ibis Budget Morumbi 4.3/2,208 reviews — both well-attested, large samples, used as the primary cited rating per skill's rule favoring a real large-sample Google rating over a thinner or differently-scaled Tripadvisor figure. Multi-venue experience — inline Google Maps links per venue per skill §2c, no single top-level rating field set; add MULTI_VENUE_RATINGS entry (venueCount: 2) to app/experience/[slug]/page.tsx in the same pass as any future edit to this experience.",
      sport: ["formula_one"],
      moodTags: ["practical", "budget-friendly"],
      interestCategories: ["accommodation"],
      pace: "moderate",
      physicalIntensity: 1,
      budgetTier: "budget",
      budgetCurrency: "USD",
      bestSeasons: ["nov"],
      advanceBookingRequired: true,
      availability: "perennial",
      curationTier: "editorial",
      lastVerifiedDate: "2026-09-11",
    })
    .returning({ id: experiences.id, slug: experiences.slug, title: experiences.title, status: experiences.status });

  await db.insert(sportingEventExperiences)
    .values({ experienceId: result.id, sportingEventId: EVENT_ID })
    .onConflictDoNothing();

  console.log("Experience #10 seeded:", result.title, "|", result.id, "|", result.slug);
} catch (e) {
  console.error("Error:", e.message);
  if (e.cause) console.error("Cause:", e.cause.message ?? e.cause);
} finally {
  await client.end();
}
