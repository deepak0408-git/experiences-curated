import Link from "next/link";

// Shared "event has passed" notice for both pack formats — classic
// (page.tsx) and hub-and-spoke (HubPage.tsx + SpokeShell.tsx). Extracted so
// both formats show identical copy/styling instead of two hand-maintained
// copies. Purchase CTAs are hidden by the caller (gate on !isEventPast
// around the checkout block) — this banner only adds the explanatory notice
// and, for an already-purchased visitor, a way back into their pack.
export default function EventEndedBanner({ hasAccess }: { hasAccess: boolean }) {
  return (
    <div className="mb-8 rounded-sm border border-[#2A2A2A] bg-[#141414] px-5 py-4">
      <span className="inline-block px-2.5 py-0.5 rounded-sm bg-[#2A2A2A] text-[#6A6A6A] text-xs font-semibold tracking-widest uppercase mb-2">
        Event ended
      </span>
      <p className="text-sm text-[#A3A3A3] leading-6">
        This event has now passed. This pack is no longer available to purchase.
        {hasAccess && " Your guide is still here for reference."}
      </p>
      {!hasAccess && (
        <Link
          href="/#on-the-calendar"
          className="inline-flex items-center mt-3 text-xs font-semibold text-[#6A6A6A] hover:text-[#AAFF00] transition-colors"
        >
          Browse upcoming events →
        </Link>
      )}
    </div>
  );
}
