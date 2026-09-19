import Link from "next/link";

// Same 4-action model as blog's ArticleActionSidebar / experience page's
// ExperienceActionSidebar. Spoke-page variant: rendered only inside
// SpokeShell, which only ever renders for an event whose hub-and-spoke pack
// already exists and is being actively viewed — so unlike the other two
// sidebars, there's no "pack not live yet" state to branch on here. The
// 4th action always points back to the hub, same destination as SpokeShell's
// own "All N guides" nav link, just reframed as a clear commerce CTA.

export default function SpokeActionSidebar({
  eventSlug,
}: {
  eventSlug: string;
}) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
      <p className="text-xs font-black tracking-widest uppercase text-white mb-3.5">
        This Guide
      </p>

      <Link
        href="/calendar"
        className="flex items-center gap-2.5 py-3 border-b border-[#2A2A2A] hover:opacity-80 transition-opacity"
      >
        <span className="text-base flex-shrink-0 w-5 text-center">📅</span>
        <span className="flex-1">
          <span className="block text-sm font-bold text-[#A3A3A3]">See it on the calendar</span>
          <span className="block text-xs text-[#6A6A6A] mt-0.5">Dates, venue, full fixture</span>
        </span>
      </Link>

      <Link
        href="/planner"
        className="flex items-center gap-2.5 py-3 border-b border-[#2A2A2A] hover:opacity-80 transition-opacity"
      >
        <span className="text-base flex-shrink-0 w-5 text-center">💰</span>
        <span className="flex-1">
          <span className="block text-sm font-bold text-[#A3A3A3]">Budget your trip</span>
          <span className="block text-xs text-[#6A6A6A] mt-0.5">Real flight, hotel and ticket costs</span>
        </span>
      </Link>

      <Link
        href="/custom-itinerary"
        className="flex items-center gap-2.5 py-3 border-b border-[#2A2A2A] hover:opacity-80 transition-opacity"
      >
        <span className="text-base flex-shrink-0 w-5 text-center">🧭</span>
        <span className="flex-1">
          <span className="block text-sm font-bold text-[#A3A3A3]">Build a custom itinerary</span>
          <span className="block text-xs text-[#6A6A6A] mt-0.5">Tell us your trip, we&apos;ll shape it</span>
        </span>
      </Link>

      <Link
        href={`/event-pack/${eventSlug}`}
        className="flex items-center gap-2.5 py-4 px-5 -mx-5 -mb-5 mt-0 rounded-b-sm bg-[#AAFF00] hover:bg-[#BBFF33] transition-colors"
      >
        <span className="text-base flex-shrink-0 w-5 text-center">🎟</span>
        <span className="flex-1">
          <span className="block text-sm font-black text-black">Get the full guide</span>
          <span className="block text-xs text-black/65 mt-0.5">Every planning guide in one place</span>
        </span>
      </Link>
    </div>
  );
}
