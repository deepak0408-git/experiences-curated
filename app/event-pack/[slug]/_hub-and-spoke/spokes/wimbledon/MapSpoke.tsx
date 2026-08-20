import Image from "next/image";
import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "map";

// Content ported from the real "The Hill," "The Outer Courts," "The
// Practice Courts," and "Wimbledon Museum & Private Tour" experiences plus
// the classic pack's Quick Reference address row — the real, already-
// approved classic-pack copy. "The Hill" added 14 Aug 2026 — it had no
// SpokeExperienceCard anywhere in the pack (§4b-1 item 1 gap, caught during
// the pre-launch gate pass) despite being one of Wimbledon's most iconic
// experiences; Map is its natural home alongside the other grounds/facility
// cards. Official grounds map PDF link and Facilities & Accessibility
// section added 16 Aug 2026 — content is from the real AELTC Championships
// Accessibility Guide (Church Road grounds, confirmed by real landmarks:
// Gate 3/11a/13, Court 18, No.1/No.2 Court, Wimbledon Park) — the first
// version drew from the wrong PDF (the Qualifying Competition guide, a
// different venue at Roehampton with its own gate/court numbering) and was
// corrected before shipping.
export default async function MapSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const theHill = linkedExperiences.find((e) => e.slug.includes("the-hill-wimbledon"));
  const outerCourts = linkedExperiences.find((e) => e.slug.includes("wimbledon-outer-courts"));
  const practiceCourts = linkedExperiences.find((e) => e.slug.includes("wimbledon-practice-courts"));
  const museum = linkedExperiences.find((e) => e.slug.includes("wimbledon-museum-private-tour"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Wimbledon"
      status="public"
      h1="18 courts, Aorangi Park practice courts, and the museum"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Inside the All England Club you&apos;ll find 18 courts and about forty years of compressed tradition. What&apos;s
        less obvious from the outside is how accessible it actually is once you know how to move around.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Site facts</p>
      <div className="flex flex-col gap-2 mb-8">
        <FactRow label="Address" value="Church Road, Wimbledon, London SW19 5AE" />
        <FactRow label="Total courts" value="18, including Centre Court and No. 1 Court" />
        <FactRow label="Best grounds-pass courts" value="Courts 3, 12, and 18 — Court 3 most often draws a seeded player in the first week" />
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Official grounds map</p>
      <div className="relative w-full aspect-[800/567] rounded-sm border border-[#2A2A2A] overflow-hidden mb-2 bg-[#141414]">
        <Image
          src="https://pub-1f82767ac9104d8fb6843eda4d7971e3.r2.dev/sporting-events/hero/wimbledon-grounds-map.png"
          alt="Official AELTC grounds map showing court layout, gates, and facilities at the Wimbledon Championships"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 720px"
        />
      </div>
      <p className="text-xs text-[#6A6A6A] mb-8">Credit: wimbledon.org.</p>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        {theHill && <SpokeExperienceCard experience={theHill} isPro={isPro} />}
        {outerCourts && <SpokeExperienceCard experience={outerCourts} isPro={isPro} />}
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm font-bold text-white mb-2">Watching outer-court tennis well</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Think match competitiveness over names: a seeded player in a tight early-round match beats watching a big
          name cruise. Check the Order of Play each morning at wimbledon.com before you arrive — it goes up the
          night before.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        {practiceCourts && <SpokeExperienceCard experience={practiceCourts} isPro={isPro} />}
        {museum && <SpokeExperienceCard experience={museum} isPro={isPro} />}
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm font-bold text-white mb-2">Aorangi Park practice courts</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          North end of the grounds — walk up and watch, no reserved spots or upgrade needed. Best access in the
          first few days, when top seeds are still warming up before their early-round matches. Grounds open at
          10am but practice can start before that — worth arriving early if you want to catch a specific player.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Facilities &amp; accessibility</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Accessibility Services kiosk</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            Outside the southwest corner of Centre Court, with a team member also at the Information Point opposite
            Gate 3. Call 020 8944 1066 or email accessibility@aeltc.com at least a week ahead if you want to
            arrange support before you arrive.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Gate 13 — the quietest entrance</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            There&apos;s no dedicated quiet gate, but Gate 13 is the quietest general ticket-holder entrance if
            crowded queues at the main gates aren&apos;t workable for you.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Accessibility Waiting Area — an alternative to the Queue</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            In Wimbledon Park, for guests who can&apos;t wait in the standard overnight Queue due to access needs —
            make yourself known to stewards at the Queue Welcome area. Queue card rules still apply; one companion
            per guest, unless young children are in the group. A buggy runs from Blue Badge parking (Car Park 6) to
            this area.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Quiet Room and Family Room</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            The Quiet Room is in Centre Court&apos;s West Hall, opposite Gangway 104. The Family Room is in the
            Southern Village near Gate 11a, with sensory facilities and equipment available for feeding young
            children or getting away from the crowds.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Accessible toilets and Changing Places</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            Accessible toilets are located throughout the grounds and marked on the site map by left-hand (LH) or
            right-hand (RH) transfer. Two Changing Places facilities are on-site — next to Court 18 on St Mary&apos;s
            Walk, and south of No.2 Court by the Southern Village Larder.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Wheelchair &amp; mobility scooter charging</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            Charging points for electric scooters and wheelchairs are in Centre Court&apos;s North East and North
            West Halls.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4 sm:col-span-2">
          <p className="text-sm font-bold text-white mb-1">Wheelchair &amp; mobility scooter parking</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            A limited number of parking spaces for mobility scooters are available inside the grounds — shown on
            the site map.
          </p>
        </div>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Centre Court tours run outside the Championships only</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Tours of Centre Court aren&apos;t available during the Championships — book for the week before (closes
          mid-June) or after the tournament ends in mid-July.
        </p>
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Source: wimbledon.com, AELTC Accessibility Guide.
      </p>
    </SpokeShell>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] px-4 py-3">
      <p className="text-xs font-black tracking-widest uppercase text-[#6A6A6A] mb-0.5">{label}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{value}</p>
    </div>
  );
}
