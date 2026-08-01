import type { Metadata } from "next";
import Link from "next/link";
import SpokeShell from "../_components/SpokeShell";

// Pack-exclusive by design (26 Jul design session) — a real itinerary is
// inherently personal (days, budget, which experiences someone picked),
// so there's no meaningful "facts" layer to publish separately. A generic
// public itinerary would just be filler with no independent SEO value.
// robots noindex since this URL has no real public content of its own —
// it exists to route intent to the Event Pack, not to rank.
export const metadata: Metadata = {
  title: "Your Italian Grand Prix Race Weekend Plan",
  robots: { index: false, follow: true },
};

export default function ItinerarySpoke() {
  return (
    <SpokeShell status="gated" h1="What does a 3-day Monza GP weekend actually look like?" question="What does a 3-day Monza GP weekend actually look like?">
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-8 text-center">
        <p className="text-sm text-[#A3A3A3] leading-6 max-w-md mx-auto mb-6">
          A real itinerary depends on your budget, which days you&apos;re there, and what kind of trip you&apos;re
          building — there&apos;s no single generic answer worth publishing. The Event Pack builds this out day by
          day, specific to your trip.
        </p>
        <Link
          href="/event-pack/italian-gp-2026"
          className="inline-flex items-center px-6 py-3 rounded-sm bg-[#AAFF00] text-black text-sm font-black hover:bg-[#BBFF33] transition-colors"
        >
          Get the Event Pack →
        </Link>
      </div>
    </SpokeShell>
  );
}
