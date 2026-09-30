// Sets packCurrency to USD on Japanese GP 2027, matching the site-wide
// USD-only pricing migration (CLAUDE.md, completed 1 Aug 2026) — every event
// pack price is USD, and sportingEvents.packCurrency is the DB-level source
// of truth grantFreeAccess/gift-code redemption read (falling back to USD).
// This event's row was created with packCurrency left null; every sibling
// hub-and-spoke event built since 1 Aug 2026 has this set explicitly.
import postgres from 'postgres';
const sql = postgres(process.env.DATABASE_URL);
await sql`update sporting_events set pack_currency = 'USD' where id = '9fe13c2e-37d1-49f0-8a48-d3ea40186fe4'`;
console.log('Set packCurrency = USD for Japanese GP 2027');
await sql.end();
