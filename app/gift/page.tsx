import { db } from "@/lib/db";
import { sportingEvents, purchases } from "@/schema/database";
import { eq, gte, and } from "drizzle-orm";
import type { Metadata } from "next";
import HomepageNav from "@/app/_components/HomepageNav";
import { createClient } from "@/lib/supabase/server";
import GiftRedeemForm from "./_components/GiftRedeemForm";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Redeem a Gift — Experiences | Curated",
};

export default async function GiftPage() {
  if (process.env.HIDE_PRO === "true") notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const today = new Date().toISOString().slice(0, 10);
  const [liveEvents, ownedPurchases] = await Promise.all([
    db
      .select({ id: sportingEvents.id, name: sportingEvents.name, slug: sportingEvents.slug, heroImageUrl: sportingEvents.heroImageUrl, startDate: sportingEvents.startDate })
      .from(sportingEvents)
      .where(and(eq(sportingEvents.isHidden, false), gte(sportingEvents.endDate, today)))
      .orderBy(sportingEvents.startDate),
    user?.email
      ? db
          .select({ sportingEventId: purchases.sportingEventId })
          .from(purchases)
          .where(eq(purchases.email, user.email))
      : Promise.resolve([]),
  ]);

  const ownedEventIds = ownedPurchases.map((p) => p.sportingEventId).filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <HomepageNav email={user?.email ?? null} />

      <div className="max-w-lg mx-auto px-6 sm:px-8 py-20">
        <p className="text-xs font-mono font-black tracking-widest uppercase text-[#AAFF00] mb-3">Gift</p>
        <h1 className="text-2xl font-black text-white mb-3">Redeem your gift</h1>
        <p className="text-sm text-[#A3A3A3] leading-relaxed mb-10">
          Enter your gift code and choose any live event pack — it&apos;s yours, on the person who sent it.
        </p>

        <GiftRedeemForm events={liveEvents} isSignedIn={!!user} ownedEventIds={ownedEventIds} />
      </div>
    </div>
  );
}
