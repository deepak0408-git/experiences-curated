import { db } from "@/lib/db";
import { plannerOriginMarkets } from "@/schema/database";
import { asc } from "drizzle-orm";

export type OriginMarketGroup = { region: string; cities: string[] };

// Real DB read, replaces the old originMarkets.ts TS constant — per the
// standing rule against hardcoded per-entity Record<string,> tables.
export async function getOriginMarkets(): Promise<OriginMarketGroup[]> {
  const rows = await db
    .select({ city: plannerOriginMarkets.city, region: plannerOriginMarkets.region })
    .from(plannerOriginMarkets)
    .orderBy(asc(plannerOriginMarkets.region), asc(plannerOriginMarkets.city));

  const byRegion = new Map<string, string[]>();
  for (const row of rows) {
    const list = byRegion.get(row.region) ?? [];
    list.push(row.city);
    byRegion.set(row.region, list);
  }

  return Array.from(byRegion.entries()).map(([region, cities]) => ({ region, cities }));
}
