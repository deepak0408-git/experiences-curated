import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { users, userProfiles, travelLogs, purchases, sportingEvents, proSubscriptions } from "@/schema/database";
import { eq, count, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ARCHETYPE_DETAILS } from "@/lib/quiz";
import SignOutButton from "@/app/event-pack/[slug]/_components/SignOutButton";
import { hasProSubscription } from "@/lib/pro";
import ManageSubscriptionButton from "./_components/ManageSubscriptionButton";
import GiftCodeSection from "./_components/GiftCodeSection";
import CookieSettingsButton from "./_components/CookieSettingsButton";
import DeleteAccountButton from "./_components/DeleteAccountButton";

export const metadata: Metadata = {
  title: "Profile — Experiences | Curated",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const [dbUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.authId, user.id))
    .limit(1);

  const [profile] = dbUser
    ? await db
        .select({ archetype: userProfiles.archetype })
        .from(userProfiles)
        .where(eq(userProfiles.email, user.email!))
        .limit(1)
    : [];

  const archetype = profile?.archetype ?? null;
  const isPro = user.email ? await hasProSubscription(user.email) : false;

  const [proSub] = isPro && user.email
    ? await db
        .select({ paddleCustomerId: proSubscriptions.paddleCustomerId, billingCycle: proSubscriptions.billingCycle })
        .from(proSubscriptions)
        .where(eq(proSubscriptions.email, user.email))
        .limit(1)
    : [];
  const paddleCustomerId = proSub?.paddleCustomerId ?? null;
  const isAnnualPro = proSub?.billingCycle === "annual";
  const archetypeDetails = archetype ? ARCHETYPE_DETAILS[archetype as keyof typeof ARCHETYPE_DETAILS] : null;

  const [stats] = dbUser
    ? await db
        .select({
          visitCount: count(travelLogs.id),
          avgRating: sql<string>`round(avg(${travelLogs.rating})::numeric, 1)`,
        })
        .from(travelLogs)
        .where(eq(travelLogs.userId, dbUser.id))
    : [];

  const visitCount = stats?.visitCount ?? 0;
  const avgRating = stats?.avgRating ? Number(stats.avgRating) : null;

  const linkedPacks = user.email
    ? await db
        .select({
          eventName: sportingEvents.name,
          eventSlug: sportingEvents.slug,
          heroImageUrl: sportingEvents.heroImageUrl,
          purchasedAt: purchases.purchasedAt,
        })
        .from(purchases)
        .innerJoin(sportingEvents, eq(purchases.sportingEventId, sportingEvents.id))
        .where(eq(purchases.email, user.email))
    : [];

  const purchasedSlugs = new Set(linkedPacks.map((p) => p.eventSlug));
  const annualProPacks = isAnnualPro
    ? (await db
        .select({
          eventName: sportingEvents.name,
          eventSlug: sportingEvents.slug,
          heroImageUrl: sportingEvents.heroImageUrl,
        })
        .from(sportingEvents)
        .where(eq(sportingEvents.isHidden, false))
      ).filter((p) => !purchasedSlugs.has(p.eventSlug))
    : [];

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <nav className="border-b border-[#2A2A2A] bg-[#0A0A0A]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-xs sm:text-sm font-black tracking-widest uppercase text-[#6A6A6A] hover:text-[#AAFF00] transition-colors whitespace-nowrap">
            Experiences | Curated
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/search" className="hidden sm:block text-sm text-[#6A6A6A] hover:text-[#AAFF00] transition-colors">Browse experiences</Link>
            <Link href="/trip-board" className="text-sm text-[#6A6A6A] hover:text-[#AAFF00] transition-colors">Trip Board</Link>
            <Link href="/my-travels" className="hidden sm:block text-sm text-[#6A6A6A] hover:text-[#AAFF00] transition-colors">My Travels</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 sm:px-8 py-14 space-y-10">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-1">Profile</p>
          <h1 className="text-2xl font-black text-white">Your account</h1>
        </div>

        {/* Archetype */}
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-4">Your archetype</p>
          {archetypeDetails ? (
            <div>
              <p className="text-lg font-black text-white mb-1">{archetypeDetails.label}</p>
              <p className="text-sm text-[#A3A3A3] leading-6 mb-4">{archetypeDetails.tagline}</p>
              <Link
                href="/pro/onboarding?retake=true"
                className="text-xs font-medium text-[#6A6A6A] underline underline-offset-2 hover:text-[#AAFF00] transition-colors"
              >
                Retake the quiz
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-sm text-[#A3A3A3] mb-4">You haven't taken the archetype quiz yet.</p>
              <Link
                href="/pro/onboarding"
                className="inline-block px-4 py-2 rounded-sm bg-[#AAFF00] text-black text-xs font-black hover:bg-[#BBFF33] transition-colors"
              >
                Take the quiz
              </Link>
            </div>
          )}
        </div>

        {/* Travel stats */}
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-4">Travel stats</p>
          <div className="flex items-center gap-10">
            <div>
              <p className="text-3xl font-black text-white">{visitCount}</p>
              <p className="text-xs text-[#6A6A6A] mt-0.5">experience{visitCount !== 1 ? "s" : ""} visited</p>
            </div>
            {avgRating !== null && visitCount > 0 && (
              <div>
                <p className="text-3xl font-black text-white">{avgRating.toFixed(1)}</p>
                <p className="text-xs text-[#6A6A6A] mt-0.5">average rating</p>
              </div>
            )}
          </div>
          {visitCount > 0 && (
            <Link
              href="/my-travels"
              className="inline-block mt-4 text-xs font-medium text-[#6A6A6A] underline underline-offset-2 hover:text-[#AAFF00] transition-colors"
            >
              View travel log →
            </Link>
          )}
        </div>

        {/* Linked event packs */}
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-4">Linked event packs</p>
          {linkedPacks.length === 0 ? (
            <div>
              <p className="text-sm text-[#A3A3A3] mb-3">No event packs purchased yet.</p>
              <Link href="/" className="text-xs font-medium text-[#6A6A6A] underline underline-offset-2 hover:text-[#AAFF00] transition-colors">
                Browse upcoming events →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {linkedPacks.map((pack) => (
                <Link
                  key={pack.eventSlug}
                  href={`/event-pack/${pack.eventSlug}`}
                  className="flex items-center gap-4 rounded-sm border border-[#2A2A2A] hover:border-[#AAFF00] transition-colors overflow-hidden"
                >
                  <div className="w-16 h-16 flex-shrink-0 bg-[#1A1A1A] overflow-hidden">
                    {pack.heroImageUrl && (
                      <Image src={pack.heroImageUrl} alt={pack.eventName} width={64} height={64} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="py-2 pr-4">
                    <p className="text-sm font-black text-white">{pack.eventName}</p>
                    <p className="text-xs text-[#6A6A6A] mt-0.5">
                      Purchased {new Date(pack.purchasedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Annual Pro — included packs */}
        {isAnnualPro && annualProPacks.length > 0 && (
          <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-1">Included with Annual Pro</p>
            <p className="text-xs text-[#6A6A6A] mb-4">Every live event pack is part of your subscription.</p>
            <div className="space-y-3">
              {annualProPacks.map((pack) => (
                <Link
                  key={pack.eventSlug}
                  href={`/event-pack/${pack.eventSlug}`}
                  className="flex items-center gap-4 rounded-sm border border-[#2A2A2A] hover:border-[#AAFF00] transition-colors overflow-hidden"
                >
                  <div className="w-16 h-16 flex-shrink-0 bg-[#1A1A1A] overflow-hidden">
                    {pack.heroImageUrl && (
                      <Image src={pack.heroImageUrl} alt={pack.eventName} width={64} height={64} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="py-2 pr-4">
                    <p className="text-sm font-black text-white">{pack.eventName}</p>
                    <p className="text-xs text-[#6A6A6A] mt-0.5">Included — Annual Pro</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Pro member gift code */}
        {isPro && isAnnualPro && process.env.HIDE_PRO !== "true" && (
          <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-6">
            <GiftCodeSection />
          </div>
        )}

        {/* Account */}
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-4">Account</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#A3A3A3]">{user.email}</p>
              <SignOutButton />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#A3A3A3]">Cookie preferences</p>
              <CookieSettingsButton />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#A3A3A3]">Delete account</p>
              <DeleteAccountButton />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#A3A3A3]">Status</p>
              {isPro ? (
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#AAFF00] border border-[#AAFF00]/30 rounded-sm px-2.5 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#AAFF00]" />
                    Pro
                  </span>
                  {paddleCustomerId && (
                    <ManageSubscriptionButton paddleCustomerId={paddleCustomerId} />
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-end gap-1">
                  <span className="inline-flex items-center text-xs font-medium text-[#6A6A6A] border border-[#2A2A2A] rounded-sm px-2.5 py-1">Free</span>
                  {process.env.HIDE_PRO !== "true" && (
                    <Link href="/pro" className="text-xs font-semibold text-[#AAFF00] underline underline-offset-2 hover:text-white transition-colors">Upgrade →</Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
