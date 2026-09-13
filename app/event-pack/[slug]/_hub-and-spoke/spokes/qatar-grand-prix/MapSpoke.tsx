import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "map";

// Real facts sourced from Inside Lusail Circuit (qatar-gp-inside-lusail-
// circuit-mtymp2ma), 13 Sep 2026: 2023 rebuild to 52,000 capacity, 50-box
// pit lane building (largest on the calendar), 85 screens, three access
// tunnels, 15,000 parking spaces, Lusail Hill's own origin as a purpose-
// built elevated viewing area.
export default async function MapSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const venueGuide = linkedExperiences.find((e) => e.slug.includes("qatar-gp-inside-lusail-circuit-"));
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Qatar Grand Prix"
      status="public"
      h1="A 2023 rebuild took capacity from 8,000 to over 52,000 without touching the actual track layout"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Lusail International Circuit opened in 2004 as a motorcycle venue and spent nearly two decades as one before
        F1 arrived in 2021. The venue most fans see today is largely a 2023 rebuild, done ahead of that year&apos;s
        race without altering the 5.419km, 16-turn layout underneath it.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <FactCard label="Capacity" value="52,000+ (up from the original 8,000)" />
        <FactCard label="Pit lane building" value="50 individual pit boxes — more than any other circuit on the F1 calendar" />
        <FactCard label="Screens around the venue" value="85 — a screen nearby wherever your seat can't see the action directly" />
        <FactCard label="Parking" value="15,000 spaces, plus three dedicated access tunnels to improve crowd flow" />
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Lusail Hill — purpose-built, not a leftover space</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          The elevated public viewing area at Turn 1 was new with the 2023 rebuild, purpose-built as a genuine
          viewing area rather than a repurposed space — which is why the General Admission and Lusail Hill Lounge
          products both sit there today. See the Ticket Guide for the full breakdown of what each tier at Lusail
          Hill actually gets you.
        </p>
      </div>

      {venueGuide && (
        <div className="mb-8">
          <SpokeExperienceCard experience={venueGuide} isPro={isPro} />
        </div>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually do</p>
          <p className="text-sm text-[#A3A3A3] leading-7">
            Use the three access tunnels rather than defaulting to whichever entrance is closest to your rideshare
            drop-off — the tunnels exist specifically to spread crowd flow around the site, and the busiest single
            entrance on a full-capacity race day is rarely the fastest way in. If your seat is anywhere that doesn&apos;t
            have a clean sightline to a corner you care about, the venue&apos;s 85 screens are genuinely dense enough
            that you won&apos;t lose the action — check where the nearest one is to your section on arrival rather
            than assuming you&apos;ll have to rely on the big screens at the main straight alone.
          </p>
        </div>
      )}
    </SpokeShell>
  );
}

function FactCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
      <p className="text-xs font-black tracking-widest uppercase text-[#6A6A6A] mb-1">{label}</p>
      <p className="text-sm text-white font-bold">{value}</p>
    </div>
  );
}
