import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "arrival";

export default async function ArrivalSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const flamingoGA = linkedExperiences.find((e) => e.slug.includes("las-vegas-gp-flamingo-ga"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Las Vegas Grand Prix"
      status="public"
      h1="Real session times are confirmed — road closures are what actually sets your arrival window"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Real session times are now confirmed: Practice 1 (4:30-5:30pm PT) and Practice 2 (8:00-9:00pm PT) run
        Thursday 19 Nov, Practice 3 (4:30-5:30pm PT) and Qualifying (8:00-9:00pm PT) run Friday 20 Nov, and the
        Race starts 8:00pm PT Saturday 21 Nov. Specific gate-opening times haven&apos;t been published separately —
        what actually determines how early you need to leave your hotel is the road-closure pattern: soft closures
        begin at 3pm and full closures at 5pm each day. Plan your arrival around beating the closure window at your
        specific entrance, well ahead of that day&apos;s first session.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What to expect at entry</p>
      <div className="flex flex-col gap-4 mb-8">
        <ArrivalCard
          title="Security and ticket scanning"
          detail="Arrive earlier than you think — security, ticket scanning, and crowd flow can add real time, and detours around road closures are normal for a street circuit, not a sign something's gone wrong."
        />
        <ArrivalCard
          title="General Admission is single-zone"
          detail="A GA ticket only grants access to its specific zone for that day — you can't move between zones on the same ticket, so know exactly which entrance you need before you arrive."
        />
        <ArrivalCard
          title="Have everything on your phone"
          detail="Save tickets, maps, and a meeting point with anyone you're traveling with before you leave your hotel — cell service can be patchy in dense crowds right at entry gates."
        />
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Arrival strategy actually differs by tier</p>
      <div className="flex flex-col gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Reserved grandstands (Main Grandstand, West Harmon, Turn 3)</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Your seat is yours regardless of arrival time, so getting there early is about clearing security before
            the closer-to-session crush, not claiming ground. At Main Grandstand specifically, blocks PG1-103 and
            PG1-115 rows 32-40 sit under the Skybox overhang and lose the pit-lane sightline — every other row in
            those blocks is clear, so it&apos;s worth knowing before you&apos;re seated, not after.
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">General Admission (Flamingo Zone, T-Mobile Zone at Sphere)</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            No reserved spot means arrival time genuinely determines your view — viewing platforms are first-come,
            first-served, and the best sightlines toward the Koval Straight/Turn 5G braking zone fill up fastest.
            Arrive well before your session starts, especially for Saturday&apos;s race.
          </p>
        </div>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Use the official app for real-time routing</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          The Las Vegas Grand Prix app shows real-time road openings and closures and builds a custom walking
          route from wherever you are to your specific ticketed zone — the most reliable way to know exactly when
          to leave and which entrance is actually open.
        </p>
      </div>

      {flamingoGA && (
        <div className="mb-8">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What General Admission gets you</p>
          <SpokeExperienceCard experience={flamingoGA} isPro={isPro} />
        </div>
      )}

      <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The timing we&apos;d actually plan around</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          Build in real buffer before the 5pm full closure if you're not already on the Strip — once it hits,
          there's no driving around it, only walking. If your hotel sits close to your ticketed zone's entrance,
          leaving right as soft closures begin (3pm) gives the most predictable walk in before the heaviest
          crowds build. For Saturday's race specifically, treat the whole afternoon as arrival time, not just the
          hour before the session — this is the one day road closures start earliest and crowds peak hardest.
        </p>
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: formula1.com 2026 session calendar, f1lasvegasgp.com official A-Z Guide (road closures, gate/zone
        entrances), f1lasvegasgp.com and tickets.formula1.com grandstand pages (block/row sightline detail).
      </p>
    </SpokeShell>
  );
}

function ArrivalCard({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5">
      <p className="text-sm font-bold text-white mb-1.5">{title}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{detail}</p>
    </div>
  );
}
