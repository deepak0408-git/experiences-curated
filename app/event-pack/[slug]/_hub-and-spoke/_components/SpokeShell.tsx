import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import HomepageNav from "@/app/_components/HomepageNav";
import { getSpokesForEvent, type SpokeStatus } from "../_lib/getSpokeData";
import { getPackPricing } from "../_lib/packPricing";
import DodoCheckout from "../../_components/DodoCheckout";
import LocalCurrencyHint from "../../_components/LocalCurrencyHint";

// Shared shell for every spoke page — slug-driven so it works for any
// hub_and_spoke event, not just one. Structure copied from the pilot;
// href/breadcrumb now derived from eventSlug + SPOKES_BY_EVENT lookup.
// eventId/eventCurrency are required for real checkout and currency
// conversion — every spoke already has them from its own getSpokeData()
// call, so they're passed as props here rather than re-querying the DB a
// second time just for these two fields. spokeId lets checkout redirect
// back to the SAME spoke it was initiated from, instead of always
// bouncing to the hub — fixed 1 Aug 2026, previously every spoke's
// successUrl pointed at /event-pack/${eventSlug} regardless of origin.
export default async function SpokeShell({
  eventSlug,
  eventId,
  eventName,
  eventCurrency,
  spokeId,
  status,
  h1,
  question,
  ctaCopy,
  heroImageUrl,
  heroImagePosition,
  isUnlocked = false,
  justPurchased = false,
  children,
}: {
  eventSlug: string;
  eventId: string;
  eventName: string;
  eventCurrency: string | null;
  spokeId: string;
  status: SpokeStatus;
  h1: string;
  question: string;
  ctaCopy?: string;
  heroImageUrl?: string | null;
  heroImagePosition?: string;
  isUnlocked?: boolean;
  justPurchased?: boolean;
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const spokes = getSpokesForEvent(eventSlug);
  const pricing = await getPackPricing(eventSlug, eventCurrency);

  // "Next spoke" navigation — added 15 Aug 2026 per direct UX feedback.
  // Follows SPOKES_BY_EVENT's own declared array order (already a
  // deliberate sequence — cost, tickets, hotels, getting-there, weather,
  // first-timer-guide, where-to-eat, day-trips, itinerary, arrival, map,
  // luxury), wrapping from the last spoke (luxury) back to the first
  // (cost). No separate order constant needed — the array order IS the
  // order, for every hub-and-spoke event, not just Wimbledon.
  const currentIdx = spokes.findIndex((s) => s.id === spokeId);
  const nextSpoke = currentIdx === -1 ? null : spokes[(currentIdx + 1) % spokes.length];

  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <HomepageNav email={user?.email ?? null} />

      {heroImageUrl && (
        <div className="relative h-[55vh] min-h-[380px] overflow-hidden bg-[#0A0A0A]">
          <Image
            src={heroImageUrl}
            alt=""
            fill
            className="object-cover opacity-90"
            style={heroImagePosition ? { objectPosition: heroImagePosition } : undefined}
            sizes="100vw"
            priority
          />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-12">
        <nav className="flex items-center justify-between gap-2 text-xs text-[#6A6A6A] mb-6">
          <Link href={`/event-pack/${eventSlug}`} className="text-[#AAFF00] hover:text-[#BBFF33] transition-colors">
            ← All {spokes.length} {eventName} planning guides
          </Link>
          {nextSpoke && (
            <Link href={`/event-pack/${eventSlug}/${nextSpoke.id}`} className="text-[#AAFF00] hover:text-[#BBFF33] transition-colors">
              Next: {nextSpoke.label} →
            </Link>
          )}
        </nav>

        {/* One-time celebratory banner — justPurchased is derived server-side
            from the real purchases.createdAt timestamp (see
            getPurchaseStatus), never from a client-controlled query param.
            A ?purchased=1-style flag would be trivially fakeable by hand-
            editing the URL; this can't be, since it's checked against our
            own DB write. */}
        {justPurchased && (
          <div className="mb-6 rounded-sm border border-[#AAFF00]/40 bg-[#AAFF00]/10 px-5 py-4">
            <p className="text-sm font-black text-[#AAFF00]">🎉 You&apos;re in — {eventName} is unlocked</p>
            <p className="text-xs text-[#A3A3A3] mt-1">Every spoke in this guide now shows our full curated picks and booking detail.</p>
          </div>
        )}

        <div className="mb-2">
          {isUnlocked ? (
            <span className="inline-block text-[10px] font-black tracking-widest uppercase rounded-sm px-2 py-0.5 border backdrop-blur-sm bg-black/30 text-[#AAFF00] border-[#AAFF00]/50">
              ✓ Unlocked — you own this pack
            </span>
          ) : (
            <StatusBadge status={status} />
          )}
        </div>
        {/* h1 is the literal search-style question — best SEO signal for
            how a visitor actually phrases this in Google. The shorter
            editorial phrase (the `h1` prop, historically the visible
            heading before this swap) now renders as a secondary h2 line
            underneath. Swapped 29 Jul 2026 per explicit user SEO
            direction — do not revert without re-confirming. */}
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 leading-tight">{question}</h1>
        <h2 className="text-sm text-[#6A6A6A] font-semibold mb-8">{h1}</h2>

        {children}

        {status === "teaser" && !isUnlocked && (
          <div className="mt-10 rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-6">
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Get the full picture</p>
            <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
              {ctaCopy ?? "The Event Pack adds our single curated recommendation and the tactical detail — booking lead times, contacts, and which option is actually worth it — not just the raw facts above."}
            </p>
            {pricing?.freeAccessEnabled ? (
              <>
                <p className="text-2xl font-black text-white mb-1">Free</p>
                <p className="text-xs text-[#6A6A6A] mb-4">Free access, no card needed</p>
              </>
            ) : (
              pricing && (
                <p className="text-2xl font-black text-white mb-4">
                  {pricing.priceDisplay}
                  <LocalCurrencyHint baseAmount={parseFloat(pricing.priceDisplay.replace(/[^0-9.]/g, ""))} baseCurrency={pricing.currency} />
                  {pricing.isEarlyBird && pricing.earlyBirdDisplay !== pricing.standardDisplay && (
                    <span className="block text-xs font-normal text-[#6A6A6A] mt-0.5">
                      Rises to {pricing.standardDisplay} after{" "}
                      {new Date(pricing.earlyBirdCutoff).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}
                    </span>
                  )}
                </p>
              )
            )}
            <div className="flex flex-wrap items-center gap-3">
              {/* Free-event branch mirrors the classic pack's exact markup
                  (page.tsx ~line 742) — a real "Sign in for free access"
                  CTA, not a no-button dead end. Anonymous visitors still
                  need to sign in to actually get free access
                  (grantFreeAccess only runs for a logged-in user). */}
              {pricing?.freeAccessEnabled ? (
                <Link
                  href={`/sign-in?next=/event-pack/${eventSlug}/${spokeId}`}
                  className="inline-flex items-center px-5 py-2.5 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors"
                >
                  Sign in for free access
                </Link>
              ) : pricing?.dodoProductId ? (
                <DodoCheckout
                  productId={pricing.dodoProductId}
                  sportingEventId={eventId}
                  eventSlug={eventSlug}
                  eventName={eventName}
                  priceTier={pricing.isEarlyBird ? "early_bird" : "standard"}
                  successUrl={user?.email
                    ? `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/event-pack/${eventSlug}/${spokeId}`
                    : `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/event-pack/${eventSlug}/welcome?spoke=${spokeId}`}
                  buttonClassName="inline-flex items-center px-5 py-2.5 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors"
                  label="Get the Pack →"
                />
              ) : (
                <Link
                  href={`/event-pack/${eventSlug}`}
                  className="inline-flex items-center px-5 py-2.5 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors"
                >
                  Get the Event Pack →
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Bottom back-link — mirrors the one at the top so a reader who
            finishes the page doesn't have to scroll all the way back up
            just to return to the hub. Added 4 Aug 2026 per direct UX
            feedback. Right-aligned "Next spoke" link added 15 Aug 2026,
            same reasoning — a reader who reaches the bottom shouldn't have
            to scroll up to see where to go next either. */}
        <nav className="flex items-center justify-between gap-2 text-xs text-[#6A6A6A] mt-12 pt-6 border-t border-[#2A2A2A]">
          <Link href={`/event-pack/${eventSlug}`} className="text-[#AAFF00] hover:text-[#BBFF33] transition-colors">
            ← All {spokes.length} {eventName} planning guides
          </Link>
          {nextSpoke && (
            <Link href={`/event-pack/${eventSlug}/${nextSpoke.id}`} className="text-[#AAFF00] hover:text-[#BBFF33] transition-colors">
              Next: {nextSpoke.label} →
            </Link>
          )}
        </nav>
      </div>
    </main>
  );
}

export const STATUS_LABEL: Record<SpokeStatus, string> = {
  public: "Free",
  teaser: "Free · Pack unlocks more",
  gated: "Pack exclusive",
};

function StatusBadge({ status }: { status: SpokeStatus }) {
  const isTeaser = status === "teaser";
  return (
    <span
      className={`inline-block text-[10px] font-black tracking-widest uppercase rounded-sm px-2 py-0.5 border backdrop-blur-sm bg-black/30 ${
        isTeaser ? "text-[#AAFF00] border-[#AAFF00]/50" : "text-white/70 border-white/20"
      }`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
