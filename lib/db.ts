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
    // max: 1 matches Supabase's documented guidance (start at one connection per
    // warm serverless instance, raise only with evidence of queueing) — max: 3
    // multiplied potential concurrent connections across instances well beyond
    // what this app's traffic needs, against a 200-client pooler cap.
    max: 1,
    // No idleTimeoutMillis: a short idle timeout forces frequent connection
    // teardown/reopen, and each reopen is a fresh TCP/TLS/SCRAM handshake —
    // more handshakes means more exposure to a Fluid Compute instance freezing
    // mid-handshake (Supavisor logs this as a SCRAM final timeout /
    // ECLIENTSOCKETCLOSED, seen recurring from 5-6 Nov). attachDatabasePool
    // already releases idle clients before suspend, so this timer was redundant
    // with it and actively increased handshake frequency instead.
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
  console.error("[DB] Idle pool client error", {
    message: error.message,
    code: (error as NodeJS.ErrnoException).code,
    total: pool.totalCount,
    idle: pool.idleCount,
    waiting: pool.waitingCount,
  });
});

pool.on("connect", () => {
  console.info("[DB] Pool client connected", {
    total: pool.totalCount,
    idle: pool.idleCount,
    waiting: pool.waitingCount,
  });
});

pool.on("remove", () => {
  console.info("[DB] Pool client removed", {
    total: pool.totalCount,
    idle: pool.idleCount,
    waiting: pool.waitingCount,
  });
});

export const db = drizzle(pool, { schema });
