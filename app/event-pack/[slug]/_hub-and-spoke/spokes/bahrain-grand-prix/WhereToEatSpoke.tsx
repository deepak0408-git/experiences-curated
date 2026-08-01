import Link from "next/link";
import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";

const SPOKE_ID = "where-to-eat";

export default async function WhereToEatSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const jalanAlor = linkedExperiences.find((e) => e.slug.includes("jalan-alor"));
  const oldChinaCafe = linkedExperiences.find((e) => e.slug.includes("old-china-cafe"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Bahrain Grand Prix"
      status="teaser"
      h1="A first-timer's guide to eating like a local in Kuala Lumpur"
      question="Where to eat in Kuala Lumpur during race weekend?"
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="Both picks above are real and free. The pack adds which specific dishes to order and why, how to fit both into one trip without wasting an evening, and the full guide to each venue."
    >
      {/* Cuisine-orientation intro — added 1 Aug 2026 after the user
          flagged the page as too barebones for a reader with zero context
          on Malaysian food. Built entirely from real facts already in the
          two linked experiences' own body_content (hawker-street culture,
          the Peranakan/Nyonya definition, the multi-ethnic stall mix at
          Jalan Alor) — nothing invented. */}
      <p className="text-sm text-[#A3A3A3] leading-7 mb-4">
        Kuala Lumpur&apos;s food scene is built on hawker culture — open-air street stalls and food courts where
        locals actually eat, not a tourist-facing version of it. Malay, Chinese, Indian, and Peranakan (the fusion
        cuisine born from generations of Chinese immigrants marrying into Malay communities) traditions all sit side
        by side here, genuinely reflecting the country&apos;s mix rather than any single food tradition. If you&apos;ve
        never eaten this way before, the two picks below cover both real modes of it: standing in the street with a
        plate in hand, and sitting down properly for a meal with real history behind it.
      </p>

      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Kuala Lumpur gives you two genuinely different good meals, not a ranked list — one loud and communal, one
        quiet and historic. Both are worth doing on their own terms across a three-day weekend.
      </p>

      {jalanAlor && (
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-4">
          <p className="text-sm font-bold text-white mb-1">{jalanAlor.title}</p>
          <p className="text-sm text-[#A3A3A3] leading-6 mb-3">{jalanAlor.subtitle}</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            The anchor is Wong Ah Wah, grilling BBQ chicken wings here for more than 70 years — famous enough to have
            drawn Jay Chou and, before his death, Anthony Bourdain. Runs 5pm to 4am. Most dishes run RM5-15, cash
            only.
          </p>
        </div>
      )}

      {oldChinaCafe && (
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
          <p className="text-sm font-bold text-white mb-1">{oldChinaCafe.title}</p>
          <p className="text-sm text-[#A3A3A3] leading-6 mb-3">{oldChinaCafe.subtitle}</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            A pre-war shophouse dating to 1920, the cafe operating inside it since 1997. Peranakan and Nyonya
            cooking, 4.2 out of 5 from over 3,000 Google reviews. Open 11am-10pm, kitchen closes 9:15pm.
          </p>
        </div>
      )}

      <p className="text-sm text-[#A3A3A3] leading-7">
        Jalan Alor sits inside Bukit Bintang, a short walk from the monorail and most of the hotels a Sepang-bound
        visitor is already likely to be staying in — no special trip required. Old China Cafe is in Chinatown,
        walkable from Pasar Seni LRT/MRT, and fits naturally into a daytime wander through the older quarter.
      </p>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What to actually order</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            At Old China Cafe, order the Devil curry and the Nyonya nasi lemak — the two dishes that come up
            repeatedly across reviews as genuine standouts, not safe tourist picks. At Jalan Alor, don&apos;t stop at
            the famous chicken wings: try Uncle Lim Pan Mee for hand-pulled noodles and Alor Corner or Sister Drunken
            Chicken Noodles alongside it. Coming hungry enough to try more than one stall is how the street is
            actually meant to be eaten.
          </p>
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">How to fit both in</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Do Old China Cafe for a calmer lunch after exploring Chinatown&apos;s older streets, and save Jalan
            Alor for one properly loud evening with a group — book ahead for Old China Cafe specifically, since the
            heritage building means genuinely limited seating and it&apos;s a well-known, well-reviewed spot that
            fills at peak times. Jalan Alor never needs a reservation; that&apos;s part of what it is.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Full guides</p>
          <div className="flex flex-wrap gap-4">
            {jalanAlor && (
              <Link href={`/experience/${jalanAlor.slug}`} className="text-xs text-[#AAFF00] hover:text-[#BBFF33] underline">
                {jalanAlor.title} — full guide →
              </Link>
            )}
            {oldChinaCafe && (
              <Link href={`/experience/${oldChinaCafe.slug}`} className="text-xs text-[#AAFF00] hover:text-[#BBFF33] underline">
                {oldChinaCafe.title} — full guide →
              </Link>
            )}
          </div>
        </div>
      )}
    </SpokeShell>
  );
}
