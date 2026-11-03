import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { attachDatabasePool } from "@vercel/functions";
import * as schema from "@/schema/database";

// Singleton prevents Next.js hot-reload from creating new connections on every
// module re-evaluation and exhausting the Supabase pooler's connection limit.
declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

const pool =
  global._pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL!,
    ssl: { rejectUnauthorized: false },
    // max: 3 caps connections per serverless instance — without it each instance
    // defaults higher, and enough concurrent instances exhaust Supabase's pooler
    // (fixed at 200 client connections on the Micro compute tier).
    max: 3,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 10000,
  });

if (!global._pgPool) {
  // Lets Vercel's Fluid Compute runtime release idle pool clients before a
  // function instance suspends, instead of leaving them to go stale and be
  // handed to the next invocation dead — the cause of the recurring 57014
  // statement-timeout incidents (postgres.js has no equivalent hook; this is
  // the reason for the pg/node-postgres driver switch).
  attachDatabasePool(pool);
}

if (process.env.NODE_ENV !== "production") {
  global._pgPool = pool;
}

pool.on("error", (error) => {
  console.error("[DB] Unexpected idle pool client error", {
    message: error.message,
    code: (error as NodeJS.ErrnoException).code,
  });
});

export const db = drizzle(pool, { schema });
