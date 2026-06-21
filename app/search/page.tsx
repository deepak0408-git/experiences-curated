import type { Metadata } from "next";
import { SearchUI } from "./_components/SearchUI";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { userProfiles, sportingEvents } from "@/schema/database";
import { eq, inArray } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search — Experiences | Curated",
  description: "Discover handpicked travel experiences around the world.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sport?: string }>;
}) {
  noStore();

  const { q, sport } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let archetype: string | null = null;
  if (user?.email) {
    const [profile] = await db
      .select({ archetype: userProfiles.archetype })
      .from(userProfiles)
      .where(eq(userProfiles.email, user.email))
      .limit(1);
    archetype = profile?.archetype ?? null;
  }

  const freeEventSlugs = (process.env.FREE_EVENT_SLUGS ?? "").split(",").filter(Boolean);
  let freeEventIds: string[] = [];
  if (freeEventSlugs.length > 0) {
    const rows = await db.select({ id: sportingEvents.id })
      .from(sportingEvents)
      .where(inArray(sportingEvents.slug, freeEventSlugs));
    freeEventIds = rows.map(r => r.id);
  }

  return (
    <SearchUI
      appId={process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!}
      searchKey={process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!}
      indexName={process.env.ALGOLIA_EXPERIENCES_INDEX!}
      initialQuery={q ?? ""}
      initialSport={sport ?? ""}
      archetype={archetype}
      userEmail={user?.email ?? null}
      hideProCtas={process.env.HIDE_PRO === "true"}
      freeEventIds={freeEventIds}
    />
  );
}
