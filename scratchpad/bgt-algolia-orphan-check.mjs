import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { algoliasearch } from "algoliasearch";
import postgres from "postgres";

const client = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY);
const indexName = process.env.ALGOLIA_EXPERIENCES_INDEX;
const sql = postgres(process.env.DATABASE_URL, { ssl: "require", prepare: false });

const res = await client.searchSingleIndex({
  indexName,
  searchParams: { query: "", filters: "destinationId:04682cdc-cc39-4f6a-8dc4-98fc4ac478f9", hitsPerPage: 100 },
});
console.log("Algolia hits for Chennai destination:", res.nbHits);

const dbRows = await sql`select count(*) from experiences where destination_id = '04682cdc-cc39-4f6a-8dc4-98fc4ac478f9' and status = 'published'`;
console.log("DB published experiences for Chennai destination:", dbRows[0].count);

await sql.end();
