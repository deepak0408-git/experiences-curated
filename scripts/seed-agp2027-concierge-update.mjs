// Updates Concierge (Pro-gated howToBook) content for Australian GP 2027 experiences.
// Per founder decision 21 Sep 2026:
//  1. Brabham Grandstand — Turns 1 & 2: add tactical howToBook (new 2027 Premium
//     Membership gate) — phone/email, payment-plan mechanic + hard deadline,
//     merch discount, early-entry perk, renewal-trap warning.
//  2. F1 Paddock Club & Trackside Hospitality: rewrite howToBook with real
//     verified phone numbers (AU + North America) and genuine call-vs-form
//     rationale, replacing generic "book directly" copy.
//  3. AusGP Ticket Guide — Park Pass, Grandstands & Hospitality: remove howToBook
//     entirely (founder call — not a genuine Concierge case), revert to public-only.
//
// Sources verified live 21 Sep 2026:
//   https://www.membership.grandprix.com.au/en/premium
//   https://www.membership.grandprix.com.au/en/FAQs
//   https://f1experiences.com/2027-australian-grand-prix
//   https://f1experiences.com/paddock-club

import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const BRABHAM_SLUG = "brabham-grandstand-turns-1-2-mu9c1dch";
const PADDOCK_SLUG = "f1-paddock-club-trackside-hospitality-mu9c506w";
const TICKET_GUIDE_SLUG_MATCH = "AusGP Ticket Guide"; // resolved by title below

const BRABHAM_HOW_TO_BOOK =
  "Call Member Services on (03) 9258 7100 or email membership@grandprix.com.au if you want to check availability before committing — Premium Membership quantities are limited and this is a new tier for 2027, so staff there are your best read on real demand. If the A$2,185–2,365 combined cost is a stretch upfront, ask about a payment plan: AGPC can split it into three instalments (deposit at purchase, then two equal payments over the following two months), but every instalment must be cleared by 15 January 2027 regardless of when you bought in — factor that hard deadline into your budget before race weekend costs stack on top. Membership also gets you into the grandstand 30 minutes before general admission and a 15% discount on Albert Park Circuit merchandise, both easy to miss if you only skim the ticket price. One thing to flag before you buy: this is a renewing membership, not a one-off pass — if you don't renew next year, you lose the priority right to rebook the same seat, so decide going in whether you're treating this as a 2027-only purchase or the start of an annual commitment.";

const PADDOCK_HOW_TO_BOOK =
  "For the AGPC's own eight Sunday suites, skip the phone call — book directly at grandprix.com.au/en/tickets (filter to Hospitality, Sunday), no reseller needed. For Paddock Club or Champions Club specifically, call F1 Experiences' Australia line on +61 (0)2 8319 9314 (North America: +1.888.326.5430) rather than filling out their web enquiry form and waiting — packages here aren't sold with published fixed pricing or an online checkout, so a call gets you a real read on current availability and whatever current-season pricing applies, faster than the form does. Ask specifically whether a deposit/payment-plan option exists for this booking — F1 Experiences doesn't publish payment-plan terms on-site, but grandstand memberships elsewhere at this circuit (Brabham's Premium Membership, for instance) do offer instalments, so it's worth asking rather than assuming Paddock Club is pay-in-full only. Melbourne's hospitality allocation moves faster than most rounds given the season-opener's strong local corporate demand — call well before April, not the month before.";

async function updateHowToBook(slug, newValue, label) {
  const [row] = await db.select().from(experiences).where(eq(experiences.slug, slug));
  if (!row) {
    console.error(`NOT FOUND: ${label} (${slug})`);
    return;
  }
  const updatedPracticalInfo = { ...(row.practicalInfo ?? {}), howToBook: newValue };
  await db.update(experiences).set({ practicalInfo: updatedPracticalInfo }).where(eq(experiences.slug, slug));
  console.log(`Updated howToBook: ${label} (${slug})`);
}

async function removeHowToBook(slug, label) {
  const [row] = await db.select().from(experiences).where(eq(experiences.slug, slug));
  if (!row) {
    console.error(`NOT FOUND: ${label} (${slug})`);
    return;
  }
  const { howToBook, ...rest } = row.practicalInfo ?? {};
  await db.update(experiences).set({ practicalInfo: rest }).where(eq(experiences.slug, slug));
  console.log(`Removed howToBook: ${label} (${slug})`);
}

// Resolve the AusGP Ticket Guide slug by title (not hardcoded — confirm exact row first).
const [ticketGuideRow] = await db
  .select()
  .from(experiences)
  .where(eq(experiences.title, "AusGP Ticket Guide — Park Pass, Grandstands & Hospitality"));

await updateHowToBook(BRABHAM_SLUG, BRABHAM_HOW_TO_BOOK, "Brabham Grandstand — Turns 1 & 2");
await updateHowToBook(PADDOCK_SLUG, PADDOCK_HOW_TO_BOOK, "F1 Paddock Club & Trackside Hospitality");

if (ticketGuideRow) {
  await removeHowToBook(ticketGuideRow.slug, ticketGuideRow.title);
} else {
  console.error(`NOT FOUND by title: ${TICKET_GUIDE_SLUG_MATCH}`);
}

await client.end();
