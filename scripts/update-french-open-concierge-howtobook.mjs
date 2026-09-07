import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const today = new Date().toISOString().slice(0, 10);

const updates = [
  {
    slug: "roland-garros-official-hospitality",
    howToBook:
      "Book direct via booking.sodexolive-hospitality.com/booking.roland-garros/lid/2 or call +33 (0)1 83 77 33 70. Groups of 10+ should go straight to hospitality@factory-se.com rather than the general line. Four tiers run in ascending order: Le Pavillon, La Mezzanine, L'Orangerie, then La Brasserie des Mousquetaires (Chatrier court-level, price on enquiry only, not listed publicly). The real trap is timing, not price: premium dates around the semi-final and final weekend routinely show \"No Seats Available\" for day sessions well before the tournament starts, so lock in that weekend the moment allocation opens rather than waiting to see how the draw shapes up.",
    editorialNote:
      "Concierge pick added 7 Sep 2026 — real direct-booking contact (Sodexo Live! phone +33 (0)1 83 77 33 70, Factory SE group email hospitality@factory-se.com, both confirmed via sodexolive-hospitality.com and factory-se.com) plus the genuine tier hierarchy and finals-weekend scarcity pattern (confirmed via factory-se.com's own live availability listing). No prices quoted in this field per founder direction — pricing lives in the pack's own pricing fields, not duplicated here.",
  },
  {
    slug: "hotel-molitor-paris-luxury-stay",
    howToBook:
      "Book direct at molitorparis.com or call 01 56 07 08 50 rather than through an OTA — Accor's Best Price Guarantee (all.com/app/hotel line) only covers direct bookings: if a lower rate turns up on Booking.com or Expedia within 24 hours of booking direct, Accor matches it and then undercuts that lower rate by 25%. One name-alike trap to know: a Booking.com listing called \"Suite Molitor Roland Garros\" is an unrelated third-party apartment several kilometres away, not a room type at the actual hotel — don't let it show up in a search and get mistaken for the real property.",
    editorialNote:
      "Concierge pick added 7 Sep 2026 — real, sourced Accor-wide policy (Best Price Guarantee terms confirmed via all.accor.com's own conditions page: 24hr window, 25% additional discount on top of price match) plus a genuine name-collision risk found during research (booking.com's unrelated 'Suite Molitor Roland Garros' apartment listing). No prices quoted per founder direction.",
  },
  {
    slug: "roland-garros-stadium-tour-tenniseum",
    howToBook:
      "This isn't sold on-site — book online in advance (GetYourGuide, Headout, Klook, or Cultival are the main resellers) and check in at the Grande Boutique meeting point with your confirmation on your phone. Weekend slots during the tournament and the surrounding high season fill up, so book as soon as your Paris dates are fixed rather than waiting until the week of the trip.",
    editorialNote:
      "Concierge pick added 7 Sep 2026 — confirmed no on-site sales (GetYourGuide/Headout/Klook listings all state advance-only booking, meeting point at Grande Boutique) plus weekend-sellout pattern noted across reseller listings. No prices quoted per founder direction.",
  },
  {
    slug: "roland-garros-grounds-pass-tickets",
    howToBook:
      "The real mechanic is a ballot, not first-come-first-served. Register for the draw at tickets.rolandgarros.com during its roughly two-week window in early December — a court-appointed official (huissier de justice) supervises the draw, and winners are notified by email by the end of February with a personal purchase slot. Winning the draw guarantees a chance to buy, not the seats themselves. A second, smaller first-come-first-served phase opens in late March at 10:00 CET for Opening Week and outside-court tickets — worth a calendar reminder set for that exact time, since it moves fast. Only four channels sell real tickets: tickets.rolandgarros.com, travel.rolandgarros.com, hospitality.rolandgarros.com, and FFT's named official agencies — Roland-Garros has issued its own fraud warning naming sites that copy the tournament's branding to look official. If you win a ticket you can't use, resell only through the official FFT resale marketplace at face value; that's the one legitimate resale channel. Entry is app-only — no paper tickets, so download the official Roland-Garros app before travelling.",
    editorialNote:
      "Concierge pick added 7 Sep 2026 — genuinely opaque booking mechanics (ballot/draw system, huissier-supervised, exact registration window and notification timing, four official channels, face-value-only official resale, app-only entry) all confirmed directly via rolandgarros.com's own 2026 ticket-draw article and its own fraud-warning article. No prices quoted per founder direction.",
  },
  {
    slug: "french-open-luxury-dining-bois-de-boulogne",
    howToBook:
      "Le Pré Catelan (3-star): reserve via leprecatelan.paris or +33 (0)1 44 14 41 14. Note the 72-hour rule — modifying or cancelling inside 72 hours of your table incurs a penalty, so book through a flexible channel if your match schedule isn't locked yet. La Grande Cascade (1-star): call the dedicated reservations line 01 45 27 33 54, email commercial@restaurantsparisiens.com, or book free via the Michelin Guide's own site. General tournament-fortnight tip: book through OpenTable or Resy where free cancellation runs up to 1-2 hours out, since night-session overruns can blow up a fixed dinner reservation with almost no notice.",
    editorialNote:
      "Concierge pick added 7 Sep 2026 — real direct reservation contacts for both restaurants (Le Pré Catelan phone + 72hr penalty window confirmed via leprecatelan.paris's own reservation/CGV pages; La Grande Cascade phone/email confirmed via restaurantsparisiens.com) plus a genuine tournament-specific tactic (flexible-cancellation booking channels given match-schedule unpredictability). No prices quoted per founder direction.",
  },
];

for (const u of updates) {
  const [row] = await db
    .select({ practicalInfo: experiences.practicalInfo })
    .from(experiences)
    .where(eq(experiences.slug, u.slug));

  if (!row) {
    console.error("NOT FOUND:", u.slug);
    continue;
  }

  const [updated] = await db
    .update(experiences)
    .set({
      practicalInfo: {
        ...row.practicalInfo,
        howToBook: u.howToBook,
      },
      editorialNote: u.editorialNote,
      lastVerifiedDate: today,
    })
    .where(eq(experiences.slug, u.slug))
    .returning({ id: experiences.id, slug: experiences.slug });

  console.log("Updated:", updated);
}

await client.end();
