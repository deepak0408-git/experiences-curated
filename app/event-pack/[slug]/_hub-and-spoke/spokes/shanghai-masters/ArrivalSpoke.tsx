import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "arrival";

// Rebuilt 10 Aug 2026 — the previous version only covered airport arrival
// (Pudong vs. Hongqiao), which genuinely overlaps with Getting There and
// left the spoke's actual job — venue-gate arrival, which entrance, when
// to show up — completely uncovered. Real venue-arrival facts (Gate #2
// will-call, shuttle terminus at Gates 1-2) are now sourced and included;
// gate-by-ticket-type entrance mapping and exact gate-opening times are
// genuinely not published for this event (unlike ATP Finals' documented
// north/south split), so that's stated honestly rather than invented —
// see hub-and-spoke skill §2a-3. Per curator instruction, this spoke's
// hero image stays untouched.
export default async function ArrivalSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const maglev = linkedExperiences.find((e) => e.slug.includes("shanghai-maglev-airport-question"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Shanghai Masters"
      status="public"
      h1="From the airport to your seat at Qizhong"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Two separate arrivals matter for this trip: landing in Shanghai, and getting into Qizhong itself once
        you&apos;re there. Unlike a fully-reserved-seating event, Shanghai Masters sells a genuine Grounds Pass
        alongside numbered seats — so which gate you use and how early you show up both actually matter, not just
        which airport you land at.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Which airport you&apos;ll land at</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-2">Pudong (PVG)</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            Primary international hub, ~60% of Shanghai flights, ~30km from the city centre. Expect this if
            you&apos;re flying internationally direct into Shanghai.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
          <p className="text-sm font-bold text-white mb-2">Hongqiao (SHA)</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            More domestic/regional East Asian flights, ~13km from the city centre. More convenient for onward city
            travel if you land here.
          </p>
        </div>
      </div>

      {maglev && (
        <div className="mb-8">
          <SpokeExperienceCard experience={maglev} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Getting into the venue itself</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-4">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Will-call ticket collection is at Gate #2 — if you&apos;re picking up physical tickets rather than using a
          mobile ticket, build that into your timing. The tournament shuttle from Xinzhuang and Zhuanqiao metro
          stations terminates between Gates 1 and 2, so most fans arriving by public transit will naturally come in
          through that side of the 80-hectare complex regardless of which court they&apos;re headed to. See the{" "}
          <a href={`/event-pack/${eventSlug}/getting-there`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
            Getting There guide
          </a>{" "}
          for the full shuttle route and timing.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">When to actually arrive</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          A Grounds Pass has no reserved seat, so arriving early genuinely earns you better viewing at the outer
          courts and Court 17&apos;s practice sessions — this is the one part of Shanghai Masters where showing up
          early has a real payoff, unlike a fully-reserved event. If you&apos;re holding a numbered Grandstand or
          Center Court ticket, your seat is yours whenever you arrive, so the early-arrival advantage is about
          getting through Gate 1-2, browsing the wider complex, and settling in before your session — not about
          claiming a spot.
        </p>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Gate-by-ticket-type mapping and opening times</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Unlike some Masters 1000 venues, the official site doesn&apos;t publish which specific entrance each
          ticket tier uses, or exact gate-opening times ahead of a session — we won&apos;t invent either. Check{" "}
          <a
            href="https://en.rolexshanghaimasters.com/en/tickets/tickets"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#AAFF00] hover:text-[#BBFF33] underline"
          >
            en.rolexshanghaimasters.com
          </a>{" "}
          closer to the event, or contact the tournament directly, for confirmed details.
        </p>
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: travelchinaguide.com, remitly.com, letstraveltochina.com (airport split and distances,
        cross-checked across 2 sources); 247tickets.com (Gate #2 will-call location). Verified 10 Aug 2026.
      </p>
    </SpokeShell>
  );
}
