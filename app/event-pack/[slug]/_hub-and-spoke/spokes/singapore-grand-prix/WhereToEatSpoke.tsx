import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "where-to-eat";

export default async function WhereToEatSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const lauPaSat = linkedExperiences.find((e) => e.slug.includes("singapore-gp-lau-pa-sat"));
  const maxwell = linkedExperiences.find((e) => e.slug.includes("singapore-gp-maxwell-food-centre"));
  const bayfront = linkedExperiences.find((e) => e.slug.includes("singapore-gp-bayfront-hawkers"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Singapore Grand Prix"
      status="teaser"
      h1="Hawker centres, ranked honestly"
      question="Where to eat during Singapore GP race weekend?"
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The three venues are named above — the pack adds the real detail on each one, our full verdict on which spot fits which moment of race weekend, the Makansutra vs. Satay by the Bay distinction that trips people up, and specific stall picks at Lau Pa Sat's Satay Street."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        A hawker centre is Singapore&apos;s everyday food hall format — dozens of independent stalls, each usually
        specializing in one dish, sharing communal seating under one roof (or, for Satay Street, one closed-off
        stretch of road). It&apos;s the real, default way most Singaporeans actually eat out, not a tourist
        invention, and several sit close enough to Marina Bay Street Circuit to work as an actual pre or
        post-session stop.
      </p>
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Ranked here by how honestly each one holds up against its own reputation, not just by name recognition —
        the most photogenic option and the most locally-recommended one aren&apos;t the same place.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        {maxwell && <SpokeExperienceCard experience={maxwell} isPro={isPro} />}
        {lauPaSat && <SpokeExperienceCard experience={lauPaSat} isPro={isPro} />}
        {bayfront && (
          <div className="sm:col-span-2">
            <SpokeExperienceCard experience={bayfront} isPro={isPro} />
          </div>
        )}
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where we'd send you first</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
            After a night session specifically, Makansutra Gluttons Bay is the right call, it's built for exactly
            this rhythm, open till 2-3am — don't confuse it with Satay by the Bay, which closes hours earlier. For
            an authentic hawker meal earlier in the day, Maxwell Food Centre and Tian Tian beat Lau Pa Sat on
            genuine local recommendation, even though Lau Pa Sat's setting is more photogenic. If you do go to Lau
            Pa Sat's Satay Street, stalls 7 and 8 are worth trying first — a repeated tip in visitor reviews, though
            not one we've independently verified stall-by-stall.
          </p>

          <div className="flex flex-col gap-3">
            <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
              <p className="text-sm font-bold text-white mb-1">Maxwell Food Centre</p>
              <p className="text-sm text-[#A3A3A3] leading-6">Tian Tian's Michelin Bib Gourmand chicken rice — the hawker centre locals actually recommend over Lau Pa Sat, on genuine quality-for-price, not just atmosphere.</p>
            </div>
            <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
              <p className="text-sm font-bold text-white mb-1">Bayfront hawkers</p>
              <p className="text-sm text-[#A3A3A3] leading-6">Two distinct venues, different hours: Makansutra Gluttons Bay runs late (till 2-3am) for post-session eating, Satay by the Bay closes at 10pm and suits a daytime Gardens visit instead — don't mix the two up on race night.</p>
            </div>
            <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
              <p className="text-sm font-bold text-white mb-1">Lau Pa Sat</p>
              <p className="text-sm text-[#A3A3A3] leading-6">1894 cast-iron national monument, Satay Street runs till 3am, 5-10 min walk from the circuit. Genuinely the most photogenic of the three, but honestly the most tourist-priced — go for the setting and the satay, not for a bargain.</p>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: Michelin Guide official listings (guide.michelin.com), Google Maps (live ratings, linked from each
        venue's own experience page), esplanade.com (Makansutra hours/stalls), gardensbythebay.com.sg (Satay by the
        Bay hours/stalls), laupasat.sg (history). Verified 7 Aug 2026.
      </p>
    </SpokeShell>
  );
}
