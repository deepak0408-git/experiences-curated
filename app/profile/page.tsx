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
import CookieSettingsButton from "./_components/CookieSettingsButton";

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
        .select({ paddleCustomerId: proSubscriptions.paddleCustomerId })
        .from(proSubscriptions)
        .where(eq(proSubscriptions.email, user.email))
        .limit(1)
    : [];
  const paddleCustomerId = proSub?.paddleCustomerId ?? null;
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

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-widest uppercase text-neutral-400 hover:text-neutral-600 transition-colors">
            Experiences | Curated
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/search" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Browse experiences</Link>
            <Link href="/trip-board" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Trip Board</Link>
            <Link href="/my-travels" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">My Travels</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 sm:px-8 py-14 space-y-10">
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-1">Profile</p>
          <h1 className="text-2xl font-bold text-neutral-900">Your account</h1>
        </div>

        {/* Archetype */}
        <div className="rounded-xl border border-neutral-200 p-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-4">Your archetype</p>
          {archetypeDetails ? (
            <div>
              <p className="text-lg font-bold text-neutral-900 mb-1">{archetypeDetails.label}</p>
              <p className="text-sm text-neutral-500 leading-6 mb-4">{archetypeDetails.tagline}</p>
              <Link
                href="/pro/onboarding?retake=true"
                className="text-xs font-medium text-neutral-500 underline underline-offset-2 hover:text-neutral-900 transition-colors"
              >
                Retake the quiz
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-sm text-neutral-500 mb-4">You haven't taken the archetype quiz yet.</p>
              <Link
                href="/pro/onboarding"
                className="inline-block px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-700 transition-colors"
              >
                Take the quiz
              </Link>
            </div>
          )}
        </div>

        {/* Travel stats */}
        <div className="rounded-xl border border-neutral-200 p-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-4">Travel stats</p>
          <div className="flex items-center gap-10">
            <div>
              <p className="text-3xl font-bold text-neutral-900">{visitCount}</p>
              <p className="text-xs text-neutral-400 mt-0.5">experience{visitCount !== 1 ? "s" : ""} visited</p>
            </div>
            {avgRating !== null && visitCount > 0 && (
              <div>
                <p className="text-3xl font-bold text-neutral-900">{avgRating.toFixed(1)}</p>
                <p className="text-xs text-neutral-400 mt-0.5">average rating</p>
              </div>
            )}
          </div>
          {visitCount > 0 && (
            <Link
              href="/my-travels"
              className="inline-block mt-4 text-xs font-medium text-neutral-500 underline underline-offset-2 hover:text-neutral-900 transition-colors"
            >
              View travel log →
            </Link>
          )}
        </div>

        {/* Linked event packs */}
        <div className="rounded-xl border border-neutral-200 p-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-4">Linked event packs</p>
          {linkedPacks.length === 0 ? (
            <div>
              <p className="text-sm text-neutral-500 mb-3">No event packs purchased yet.</p>
              <Link href="/" className="text-xs font-medium text-neutral-500 underline underline-offset-2 hover:text-neutral-900 transition-colors">
                Browse upcoming events →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {linkedPacks.map((pack) => (
                <Link
                  key={pack.eventSlug}
                  href={`/event-pack/${pack.eventSlug}`}
                  className="flex items-center gap-4 rounded-xl border border-neutral-100 hover:border-neutral-300 transition-colors overflow-hidden"
                >
                  <div className="w-16 h-16 flex-shrink-0 bg-neutral-100 overflow-hidden">
                    {pack.heroImageUrl && (
                      <img src={pack.heroImageUrl} alt={pack.eventName} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="py-2 pr-4">
                    <p className="text-sm font-semibold text-neutral-900">{pack.eventName}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Purchased {new Date(pack.purchasedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Account */}
        <div className="rounded-xl border border-neutral-200 p-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-4">Account</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-700">{user.email}</p>
              <SignOutButton />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-500">Cookie preferences</p>
              <CookieSettingsButton />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-500">Status</p>
              {isPro ? (
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Pro
                  </span>
                  {paddleCustomerId && (
                    <ManageSubscriptionButton paddleCustomerId={paddleCustomerId} />
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-end gap-1">
                  <span className="inline-flex items-center text-xs font-medium text-neutral-500 bg-neutral-100 rounded-full px-2.5 py-1">Free</span>
                  <Link href="/pro" className="text-xs font-semibold text-neutral-900 underline underline-offset-2 hover:text-neutral-600 transition-colors">Upgrade →</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
