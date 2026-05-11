import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { travelLogs, users, experiences } from "@/schema/database";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import TravelsClient from "./_components/TravelsClient";

export const metadata: Metadata = {
  title: "My Travels — Experiences | Curated",
};

export default async function MyTravelsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const [dbUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.authId, user.id))
    .limit(1);

  if (!dbUser) redirect("/");

  const logs = await db
    .select({
      id: travelLogs.id,
      experienceId: travelLogs.experienceId,
      visitedAt: travelLogs.visitedAt,
      rating: travelLogs.rating,
      moodTags: travelLogs.moodTags,
      title: experiences.title,
      slug: experiences.slug,
      heroImageUrl: experiences.heroImageUrl,
      experienceType: experiences.experienceType,
    })
    .from(travelLogs)
    .innerJoin(experiences, eq(travelLogs.experienceId, experiences.id))
    .where(eq(travelLogs.userId, dbUser.id))
    .orderBy(desc(travelLogs.visitedAt));

  return (
    <TravelsClient
      logs={logs.map((l) => ({ ...l, visitedAt: l.visitedAt.toString() }))}
      userEmail={user.email ?? ""}
    />
  );
}
