import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { hasProSubscription } from "@/lib/pro";
import { db } from "@/lib/db";
import { userProfiles } from "@/schema/database";
import { eq } from "drizzle-orm";
import ProCheckout from "./_components/ProCheckout";
import { ARCHETYPE_DETAILS } from "@/lib/quiz";
import SignOutButton from "@/app/event-pack/[slug]/_components/SignOutButton";

export const metadata: Metadata = {
  title: "Pro — Experiences | Curated",
  description: "Unlock concierge picks, insider booking guidance, and exclusive experiences with a Pro subscription.",
};

const PRO_FEATURES = [
  { label: "Everything in Event Packs", detail: "All curated experiences, Worth knowing tips, tournament rhythm guides" },
  { label: "Concierge picks", detail: "Exclusive luxury experiences with private booking guidance — not available in the free tier" },
  { label: "How to book", detail: "Specific operator contacts, lead times, and what to ask for — not just a link" },
  { label: "Booking reminders", detail: "Timed alerts before sell-out deadlines for high-demand experiences" },
  { label: "Unlimited Trip Boards", detail: "Save and plan across as many trips as you like" },
  { label: "Offline event packs", detail: "Download your pack before you travel — no signal needed on the ground" },
];

export default async function ProPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const isPro = user?.email ? await hasProSubscription(user.email) : false;

  const [profile] = isPro && user?.email
    ? await db.select({ archetype: userProfiles.archetype }).from(userProfiles).where(eq(userProfiles.email, user.email)).limit(1)
    : [null];

  const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? "";
  const monthlyPriceId = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PRO_MONTHLY ?? "";
  const annualPriceId = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PRO_ANNUAL ?? "";

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold tracking-widest uppercase text-neutral-400 hover:text-neutral-600 transition-colors">
            Experiences | Curated
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/search" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
              Browse experiences
            </Link>
            {user?.email && (
              <>
                <span className="text-neutral-200">|</span>
                <p className="text-xs text-neutral-400">{user.email}</p>
                <SignOutButton />
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-sm font-semibold tracking-widest uppercase text-neutral-400 mb-3">Pro</p>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 leading-tight mb-4">
            The version for people who take trips seriously
          </h1>
          <p className="text-neutral-500 text-sm leading-7">
            Event packs give you great experiences. Pro adds the layer that turns a good trip into one you'll talk about — private booking contacts, concierge-only picks, and reminders before the good things sell out.
          </p>
        </div>

        {isPro ? (
          <div className="max-w-xl mx-auto space-y-10">
            {/* You're on Pro */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-6">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-emerald-600 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  Pro active
                </span>
                {profile?.archetype ? (
                  <p className="text-sm text-neutral-500">
                    {ARCHETYPE_DETAILS[profile.archetype as keyof typeof ARCHETYPE_DETAILS]?.label}
                  </p>
                ) : (
                  <p className="text-sm text-neutral-500">Tell us how you travel to personalise your recommendations.</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-6">
                {profile?.archetype ? (
                  <>
                    <Link href="/profile" className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors">
                      Retake the quiz
                    </Link>
                    <Link href="/trip-board" className="inline-flex justify-center px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-700 transition-colors">
                      Trip Board
                    </Link>
                  </>
                ) : (
                  <Link href="/pro/onboarding" className="inline-flex justify-center px-4 py-2 rounded-full bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-700 transition-colors">
                    Set up your profile
                  </Link>
                )}
              </div>
            </div>

            {/* Event packs */}
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-neutral-400 mb-5">Upcoming event packs</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link href="/event-pack/wimbledon-2026" className="group text-left rounded-xl border border-neutral-200 overflow-hidden hover:border-neutral-400 transition-colors">
                  <div className="h-32 overflow-hidden bg-neutral-100">
                    <img src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/sporting-events/hero/wimbledon-2026.jpg`} alt="Wimbledon 2026" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 mb-1">Tennis · London</p>
                    <p className="text-sm font-bold text-neutral-900 group-hover:text-neutral-600 transition-colors mb-1">Wimbledon 2026</p>
                    <p className="text-xs text-neutral-400">30 Jun – 13 Jul 2026</p>
                  </div>
                </Link>
                <Link href="/event-pack/us-open-2026" className="group text-left rounded-xl border border-neutral-200 overflow-hidden hover:border-neutral-400 transition-colors">
                  <div className="h-32 overflow-hidden bg-neutral-100">
                    <img src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/sporting-events/hero/us-open-2026.jpg`} alt="US Open 2026" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 mb-1">Tennis · New York</p>
                    <p className="text-sm font-bold text-neutral-900 group-hover:text-neutral-600 transition-colors mb-1">US Open 2026</p>
                    <p className="text-xs text-neutral-400">25 Aug – 7 Sep 2026</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Features */}
            <div className="space-y-5">
              {PRO_FEATURES.map((f) => (
                <div key={f.label} className="flex gap-3">
                  <span className="mt-0.5 w-4 h-4 rounded-full bg-neutral-900 flex-shrink-0 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
                      <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{f.label}</p>
                    <p className="text-xs text-neutral-500 mt-0.5 leading-5">{f.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing card */}
            <div className="rounded-2xl border border-neutral-200 p-7 lg:sticky lg:top-6">
              <ProCheckout
                monthlyPriceId={monthlyPriceId}
                annualPriceId={annualPriceId}
                clientToken={clientToken}
                environment={(process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as "sandbox" | "production") ?? "sandbox"}
                monthlyDisplay="£9.99"
                annualDisplay="£83.88"
                annualMonthlyEquiv="£6.99"
              />
              <p className="text-center text-xs text-neutral-400 mt-4">
                Cancel any time. No lock-in.
              </p>
              <div className="mt-6 pt-5 border-t border-neutral-100">
                <p className="text-xs text-neutral-400 text-center">
                  Already have an event pack?{" "}
                  <Link href="/trip-board" className="underline hover:text-neutral-700 transition-colors">
                    Sign in to your board
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
