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

  const franklin = linkedExperiences.find((e) => e.slug.includes("us-gp-franklin-barbecue"));
  const bbqBeyond = linkedExperiences.find((e) => e.slug.includes("us-gp-bbq-beyond-franklin"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="United States Grand Prix"
      status="teaser"
      h1="The line, or three real alternatives with the same Michelin depth"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      heroImagePosition={spoke.heroImagePosition}
      isUnlocked={isUnlocked}
      ctaCopy="Franklin's real wait times and three genuinely great alternatives are already free above. The pack adds our actual verdict on which one fits your specific trip, plus a genuine reservation tactic for skipping Franklin's queue entirely without settling for a lesser brisket."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Austin&apos;s barbecue scene is genuinely one of the best in the country, and it goes deeper than the one
        restaurant everyone&apos;s heard of. Franklin Barbecue earns its reputation, but three other spots — all
        with real Michelin recognition — do the craft at an equally serious level, without the multi-hour
        commitment. And if you&apos;d rather not leave the circuit at all, COTA&apos;s own food scene on race
        weekend is a real, serious option in its own right.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Eating inside COTA itself</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          The COTA Culinary Experience runs five food villages with 30+ restaurants across the circuit, built
          around real Austin chefs and purveyors rather than generic stadium concessions — Taste of Texas covers
          gourmet grab-and-go from local eateries, and the COTA Biergarten leans into the city&apos;s German
          heritage with sausage and schnitzel from Austin purveyors. Expect roughly US$15-25 for a meal and
          US$8-10 for a beer, alongside standard concessions (hot dogs, pizza, Tex-Mex) and food trucks covering
          Turkish, Thai, and vegan options. Everything is cashless — see the First-Timer Guide — and the COTA app
          is the fastest way to find the specific stand or village you want rather than wandering the Grand Plaza.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">The one everyone's heard of</p>
      {franklin && (
        <div className="mb-8">
          <SpokeExperienceCard experience={franklin} isPro={isPro} />
        </div>
      )}

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Three real alternatives, same seriousness</p>
      {bbqBeyond && (
        <div className="mb-8">
          <SpokeExperienceCard experience={bbqBeyond} isPro={isPro} />
        </div>
      )}

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Which one we&apos;d pick in Austin</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            If this is your first Austin trip and the Franklin mythology genuinely matters to you, do it once — the
            brisket is worth the wait — but pre-order online (5-pound minimum) as a group if you can&apos;t
            sacrifice a full morning to the line. For a race weekend where every hour matters, LeRoy and Lewis is
            the strongest single alternative: One Star in the Michelin Guide, genuinely different from traditional
            Central Texas barbecue, and a wait measured in tens of minutes rather than hours. Micklethwait and la
            Barbecue are both excellent, but their genuinely limited weekly hours (Micklethwait closed Mon-Wed, la
            Barbecue closed Mon-Tue) make them a harder fit to plan around during an already-packed race weekend.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What to pick inside COTA itself</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            Skip the generic concession lines and head for Lone Star Land, the BBQ-focused food village at one of
            the circuit&apos;s busiest entrances — it actually carries Micklethwait Craft Meats trackside, so you
            can get real, serious Austin barbecue without leaving the grounds during a session. If you want
            something lighter or faster between sessions, Taste of Texas is the better bet — genuine grab-and-go
            variety (ramen, burgers, and local favorites) rather than a single-cuisine village, so it&apos;s easier
            to eat quickly and get back to your seat. Save Rodeo Driveway, behind the Main Grandstand, for a
            slower moment — it runs noticeably more upscale (Brasserie Mon Chou Chou, Little Ola&apos;s biscuits)
            and rewards actually sitting down rather than grabbing food on the move.
          </p>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">The real Franklin shortcut</p>
          <p className="text-sm text-[#A3A3A3] leading-6">
            Order online for pickup with a 5-pound minimum — a genuine way to get Franklin&apos;s brisket without
            the line at all, and the minimum makes more sense split across a group traveling together for the
            weekend.
          </p>
        </div>
      )}

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: franklinbbq.com, Michelin Guide, bestbiteguide.com, circuitoftheamericas.com, austinfoodmagazine.com
        (COTA Culinary Experience food villages and vendors).
      </p>
    </SpokeShell>
  );
}
