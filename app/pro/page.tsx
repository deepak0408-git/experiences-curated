import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { hasProSubscription } from "@/lib/pro";
import { db } from "@/lib/db";
import { userProfiles, sportingEvents } from "@/schema/database";
import { eq, gte, and } from "drizzle-orm";
import ProCheckout from "./_components/ProCheckout";
import DodoProCheckout from "./_components/DodoProCheckout";
import { ARCHETYPE_DETAILS } from "@/lib/quiz";
import ProComingSoon from "./_components/ProComingSoon";
import HomepageNav from "@/app/_components/HomepageNav";

export const metadata: Metadata = {
  title: "Pro — Experiences | Curated",
  description: "Unlock concierge picks, insider booking guidance, and exclusive experiences with a Pro subscription.",
};

const PRO_FEATURES: { label: string; detail: string; annualOnly?: boolean; comingSoon?: boolean }[] = [
  {
    label: "Unlimited experience reads",
    detail: "Browse every experience in every pack — no 3-read cap",
    annualOnly: false,
  },
  {
    label: "All event packs, free",
    detail: "Includes every pack published while your subscription is active — buy once, read everything",
    annualOnly: true,
  },
  {
    label: "Concierge picks",
    detail: "Exclusive luxury experiences with private booking guidance — not in the free tier",
    annualOnly: false,
  },
  {
    label: "How to book",
    detail: "Specific operator contacts, lead times, and what to ask for — not just a link",
    annualOnly: false,
  },
  {
    label: "Booking reminders",
    detail: "Timed alerts before sell-out deadlines for high-demand experiences",
    annualOnly: false,
  },
  {
    label: "Unlimited Trip Boards",
    detail: "Save and plan across as many trips as you like",
    annualOnly: false,
  },
  {
    label: "Offline event packs",
    detail: "Download your pack before you travel — no signal needed on the ground",
    annualOnly: false,
  },
  {
    label: "Ask the curator",
    detail: "Ask anything about a venue, experience, or logistics — a human reply within 48 hours",
    annualOnly: false,
  },
  {
    label: "Gift a pack",
    detail: "One free gift code per year — your recipient claims any live event pack",
    annualOnly: true,
  },
  {
    label: "Trip Planner",
    detail: "Day-by-day itinerary builder — drag experiences onto your schedule",
    annualOnly: false,
    comingSoon: true,
  },
];

export default async function ProPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (process.env.HIDE_PRO === "true") {
    return (
      <>
        <HomepageNav email={user?.email ?? null} />
        <ProComingSoon userEmail={user?.email} />
      </>
    );
  }

  const isPro = user?.email ? await hasProSubscription(user.email) : false;

  const [profile] = isPro && user?.email
    ? await db.select({ archetype: userProfiles.archetype }).from(userProfiles).where(eq(userProfiles.email, user.email)).limit(1)
    : [null];

  const today = new Date().toISOString().slice(0, 10);
  const upcomingEvents = await db
    .select({ slug: sportingEvents.slug, name: sportingEvents.name, sport: sportingEvents.sport, heroImageUrl: sportingEvents.heroImageUrl, startDate: sportingEvents.startDate, endDate: sportingEvents.endDate })
    .from(sportingEvents)
    .where(and(gte(sportingEvents.endDate, today), eq(sportingEvents.isHidden, false)))
    .orderBy(sportingEvents.startDate);

  const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? "";
  const monthlyPriceId = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PRO_MONTHLY ?? "";
  const annualPriceId = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID_PRO_ANNUAL ?? "";
  const paymentProvider = process.env.NEXT_PUBLIC_PAYMENT_PROVIDER ?? "paddle";
  const dodoMonthlyProductId = process.env.NEXT_PUBLIC_DODO_PRICE_ID_PRO_MONTHLY ?? "";
  const dodoAnnualProductId = process.env.NEXT_PUBLIC_DODO_PRICE_ID_PRO_ANNUAL ?? "";

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <nav className="border-b border-[#2A2A2A] bg-[#0A0A0A]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-xs sm:text-sm font-black tracking-widest uppercase text-[#6A6A6A] hover:text-[#AAFF00] transition-colors whitespace-nowrap">
            Experiences | Curated
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/search" className="hidden sm:block text-sm text-[#6A6A6A] hover:text-[#AAFF00] transition-colors">
              Browse experiences
            </Link>
            {user?.email && (
              <>
                <span className="hidden sm:inline text-[#2A2A2A]">|</span>
                <Link
                  href="/profile"
                  className="flex items-center justify-center w-7 h-7 rounded-sm bg-[#2A2A2A] text-white text-xs font-black uppercase flex-shrink-0 hover:bg-[#AAFF00] hover:text-black transition-colors"
                  aria-label="Profile"
                  title={user.email}
                >
                  {user.email[0]}
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#AAFF00] mb-3">Pro</p>
          <h1 className="text-xl sm:text-2xl font-black text-white leading-tight mb-4">
            The version for people who take trips seriously
          </h1>
          <p className="text-[#A3A3A3] text-sm leading-7">
            Event packs give you great experiences. Pro adds the layer that turns a good trip into one you'll talk about — private booking contacts, concierge-only picks, and reminders before the good things sell out.
          </p>
        </div>

        {isPro ? (
          <div className="max-w-xl mx-auto space-y-10">
            {/* You're on Pro */}
            <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-6">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#AAFF00] inline-block" />
                  Pro active
                </span>
                {profile?.archetype ? (
                  <p className="text-sm text-[#A3A3A3]">
                    {ARCHETYPE_DETAILS[profile.archetype as keyof typeof ARCHETYPE_DETAILS]?.label}
                  </p>
                ) : (
                  <p className="text-sm text-[#A3A3A3]">Tell us how you travel to personalise your recommendations.</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-6">
                {profile?.archetype ? (
                  <>
                    <Link href="/profile" className="text-xs text-[#6A6A6A] hover:text-[#AAFF00] transition-colors">
                      Retake the quiz
                    </Link>
                    <Link href="/trip-board" className="inline-flex justify-center px-3 py-1 rounded-sm bg-[#AAFF00] text-black text-xs font-black hover:bg-[#BBFF33] transition-colors">
                      Trip Board
                    </Link>
                  </>
                ) : (
                  <Link href="/pro/onboarding" className="inline-flex justify-center px-4 py-2 rounded-sm bg-[#AAFF00] text-black text-xs font-black hover:bg-[#BBFF33] transition-colors">
                    Set up your profile
                  </Link>
                )}
              </div>
            </div>

            {/* Event packs */}
            {upcomingEvents.length > 0 && (
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-5">Upcoming event packs</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {upcomingEvents.map((ev) => (
                    <Link key={ev.slug} href={`/event-pack/${ev.slug}`} className="group text-left rounded-sm border border-[#2A2A2A] overflow-hidden hover:border-[#AAFF00] transition-colors">
                      <div className="relative h-32 overflow-hidden bg-[#1A1A1A]">
                        {ev.heroImageUrl && (
                          <Image src={ev.heroImageUrl} alt={ev.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 100vw, 33vw" />
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-[10px] font-semibold tracking-widest uppercase text-[#6A6A6A] mb-1">
                          {ev.sport.charAt(0).toUpperCase() + ev.sport.slice(1)}
                        </p>
                        <p className="text-sm font-black text-white group-hover:text-[#AAFF00] transition-colors mb-1">{ev.name}</p>
                        <p className="text-xs text-[#6A6A6A]">
                          {new Date(ev.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} – {new Date(ev.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Features */}
            <div className="space-y-5">
              {PRO_FEATURES.map((f) => (
                <div key={f.label} className="flex gap-3">
                  <span className="mt-0.5 w-4 h-4 rounded-sm bg-[#AAFF00] flex-shrink-0 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 10 8">
                      <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-black text-white">{f.label}</p>
                      {f.annualOnly && (
                        <span className="text-[10px] font-black tracking-widest uppercase text-[#AAFF00] border border-[#AAFF00]/30 rounded-sm px-1.5 py-0.5">Annual</span>
                      )}
                      {f.comingSoon && (
                        <span className="text-[10px] font-black tracking-widest uppercase text-[#6A6A6A] border border-[#2A2A2A] rounded-sm px-1.5 py-0.5">Soon</span>
                      )}
                    </div>
                    <p className="text-xs text-[#A3A3A3] mt-0.5 leading-5">{f.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing card */}
            <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-7 lg:sticky lg:top-6">
              {paymentProvider === "dodo" ? (
                <DodoProCheckout
                  monthlyProductId={dodoMonthlyProductId}
                  annualProductId={dodoAnnualProductId}
                  monthlyDisplay="£9"
                  annualDisplay="£89"
                  annualMonthlyEquiv="£7.42"
                />
              ) : (
                <ProCheckout
                  monthlyPriceId={monthlyPriceId}
                  annualPriceId={annualPriceId}
                  clientToken={clientToken}
                  environment={(process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT as "sandbox" | "production") ?? "sandbox"}
                  monthlyDisplay="£9.99"
                  annualDisplay="£83.88"
                  annualMonthlyEquiv="£6.99"
                  userEmail={user?.email}
                />
              )}
              <p className="text-center text-xs text-[#6A6A6A] mt-4">
                Cancel any time. No lock-in.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
