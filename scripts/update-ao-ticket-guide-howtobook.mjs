import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import { experiences } from "../schema/database.ts";

const client = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });
const db = drizzle(client);

const SLUG = "ao-ticket-guide-grounds-session-finals-p0773j";

const howToBook =
  "If general sale has already passed and you still need a session or finals seat, use Ticketmaster's official resale marketplace at ticketmaster.com.au (the same site tickets were sold on, not a third-party reseller) — Victoria's Major Events Act caps resale price at face value plus 10%, so a listed resale ticket can't legally be marked up beyond that, unlike unofficial resale sites. For any purchase issue directly with Tennis Australia, the only published contact is 1800 752 983 (1800 PLAY TENNIS) or customersupport@tennis.com.au — note that's an Australian toll-free number, not a normal international line, so email is the more reliable route if you're calling from outside Australia; there's no separate ticketing department either way, so lead with your order number. If you'd rather book a ticket-inclusive package than chase individual seats, On Location (onlocationexp.com/tennis) sells an official AO 2027 package (17-31 Jan 2027) bundling tickets, a 4-star hotel, and local tours — a real alternative if solo ticket-hunting this late isn't worth your time.";

const bookingMethod =
  "All tickets sold via ausopen.com and Ticketmaster. For 2027: Accessibility Pre-sale opened 28 Jul 2026, Mastercard Presale 5 Aug 2026, AO Extras Pre-sale 6-12 Aug 2026, general public on-sale 13 Aug 2026. Early-bird grounds pass pricing ran through 30 Nov 2026.";

const editorialNote =
  "Concierge pick — genuine lead-time trap: real, dated 2027 presale calendar (Accessibility 28 Jul, Mastercard 5 Aug, AO Extras 6-12 Aug, general sale 13 Aug 2026) confirmed via ausopen.com's own announcement, meeting skill §2b criterion 2. howToBook updated 26 Aug 2026 — presale windows have now passed, so the tactical content shifted to real post-presale mechanisms: Ticketmaster official resale (Victoria's Major Events Act caps resale at face value +10%, confirmed via help.ticketmaster.com.au and public reporting on Victorian resale law), Tennis Australia's only published contact channel (1800 752 983 / customersupport@tennis.com.au, confirmed live on ausopen.com/contact-us 26 Aug 2026 — no separate ticketing department line exists, and the 1800 number is Australian toll-free/domestic, flagged for international callers), and On Location's official AO 2027 package (onlocationexp.com/tennis, confirmed live 26 Aug 2026: 17-31 Jan 2027, official tickets + 4-star hotel + local tours). Also checked whether AO has any Wimbledon-style international-fan mechanism (federation ticket allocation, overseas-specific program, residency restriction, Debenture-equivalent) — confirmed none exists; a search-surfaced international callers number (+61 3 9039 9407) could not be verified on any live, fetchable ausopen.com/tennis.com.au page (the presale-info page 403'd, the pre-sale guide page didn't show it), so it was deliberately left out of howToBook per the no-unverified-contact-info rule. Sources: ausopen.com 'Australian Open 2027 tickets: On sale earlier than ever' (presale dates), tennis.com.au media release (corroborating dates), sportskeeda.com AO 2026 ticket pricing article, thefirstserve.com.au finals pricing article ($8,999 best-available, $1,299 entry reserved), au.finance.yahoo.com AO finals resale pricing article, tennisticketservice.com pricing breakdown, ozbargain.com.au Ticketmaster AO tickets-from-$29 listing, ausopen.com/contact-us (fetched live 26 Aug 2026), onlocationexp.com/tennis (fetched live 26 Aug 2026), help.ticketmaster.com.au + discover.ticketmaster.com.au/contact (confirmed no public Ticketmaster AU phone line exists). Verified 26 Aug 2026.";

const [updated] = await db
  .update(experiences)
  .set({
    practicalInfo: {
      hours: "Ticket sales open in tiers well ahead of the tournament — presales from late July, general on-sale in mid-August for the following January's tournament",
      website: "https://ausopen.com/tickets",
      costRange: "Ground Pass runs AU$49 early-bird (through 30 November 2026) — standard pricing after that date hasn't been published yet. Reserved session and finals ticket pricing for 2027 also hasn't been published. See the Ticket Guide's own tier breakdown for the most recently confirmed session pricing.",
      howToBook,
      bookingMethod,
      reservationsRequired: true,
    },
    editorialNote,
    lastVerifiedDate: new Date().toISOString().slice(0, 10),
  })
  .where(eq(experiences.slug, SLUG))
  .returning({ id: experiences.id, slug: experiences.slug });

console.log("Updated:", updated);
await client.end();
