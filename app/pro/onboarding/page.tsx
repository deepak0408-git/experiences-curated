import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { hasProSubscription } from "@/lib/pro";
import { db } from "@/lib/db";
import { userProfiles } from "@/schema/database";
import { eq } from "drizzle-orm";
import OnboardingShell from "./_components/OnboardingShell";

export const metadata: Metadata = {
  title: "Set up your profile — Experiences | Curated",
};

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ retake?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user?.email) redirect("/pro");

  const isPro = await hasProSubscription(user.email);
  if (!isPro) redirect("/pro");

  const { retake } = await searchParams;

  if (!retake) {
    const [profile] = await db
      .select({ archetype: userProfiles.archetype })
      .from(userProfiles)
      .where(eq(userProfiles.email, user.email))
      .limit(1);

    if (profile?.archetype) redirect("/pro");
  }

  return <OnboardingShell />;
}
