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

  const nagpur = linkedExperiences.find((e) => e.slug.includes("nagpur-saoji-food"));
  const chennai = linkedExperiences.find((e) => e.slug.includes("chennai-filter-coffee-dosa"));
  const ahmedabad = linkedExperiences.find((e) => e.slug.includes("ahmedabad-thali-manek-chowk"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      eventSport={event.sport}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="Border-Gavaskar Trophy"
      status="teaser"
      h1="Fiery Saoji in Nagpur, filter coffee in Chennai, a rotating thali and a night market in Ahmedabad"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
      ctaCopy="The three food identities are free above, with real prices and the named places for each city. Unlocking adds our eating order across the trip: why to eat tarri poha before you try Saoji mutton, what time to reach Chennai's breakfast places before the menu changes, and the exact hour Ahmedabad's Manek Chowk turns from a market into a crush, plus what you can and can't take into Jamtha."
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        You&apos;ll eat three completely different regional cuisines on this trip, and none of them is
        &quot;generic Indian food&quot;. Nagpur is known for Saoji cooking, one of the spiciest regional styles in
        the country, and for its oranges. Chennai runs on filter coffee, idli and dosa done at a level of
        consistency you don&apos;t find everywhere. Gujarat eats sweeter and more varied per meal, from a formal
        rotating thali to one of India&apos;s best-known street food markets. Eating well here is a big part of
        why this trip is worth more than the cricket.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {nagpur && (
          <div>
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Nagpur</p>
            <SpokeExperienceCard eventSlug={eventSlug} experience={nagpur} isPro={isPro} />
          </div>
        )}
        {chennai && (
          <div>
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Chennai</p>
            <SpokeExperienceCard eventSlug={eventSlug} experience={chennai} isPro={isPro} />
          </div>
        )}
        {ahmedabad && (
          <div className="sm:col-span-2">
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Ahmedabad</p>
            <SpokeExperienceCard eventSlug={eventSlug} experience={ahmedabad} isPro={isPro} />
          </div>
        )}
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">What meals cost</p>
      <div className="grid sm:grid-cols-3 gap-3 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-xs font-black tracking-widest uppercase text-white mb-1">Nagpur</p>
          <p className="text-sm font-black text-[#AAFF00]">₹200–₹400</p>
          <p className="text-xs text-[#6A6A6A] mt-1">A Saoji thali or rassa meal per person; tarri poha is a few dozen rupees</p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-xs font-black tracking-widest uppercase text-white mb-1">Chennai</p>
          <p className="text-sm font-black text-[#AAFF00]">₹100–₹200</p>
          <p className="text-xs text-[#6A6A6A] mt-1">Idli or dosa with filter coffee, per person</p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-xs font-black tracking-widest uppercase text-white mb-1">Ahmedabad</p>
          <p className="text-sm font-black text-[#AAFF00]">₹800–₹1,200</p>
          <p className="text-xs text-[#6A6A6A] mt-1">A heritage-hotel thali per person; Manek Chowk street food is mostly ₹30–150</p>
        </div>
      </div>

      {isUnlocked && (
        <div className="mt-10 pt-10 border-t border-[#2A2A2A]">
          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Where we&apos;d actually eat, city by city</p>
          <div className="flex flex-col gap-2 mb-6">
            <p className="text-sm text-[#A3A3A3] leading-6">
              <span className="font-bold text-white">Nagpur:</span>{" "}
              Start with tarri poha at Saburi Tarri Poha Misal Centre, a mild breakfast that works as a safe first
              stop. Move to Baba Saoji for the mutton rassa once you know your spice tolerance, and ask for it with
              jowar bhakri, which is what the dish is built around. Haldiram&apos;s is the easy place for orange
              barfi if you want to taste the Orange City claim.
            </p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              <span className="font-bold text-white">Chennai:</span>{" "}
              Breakfast at Ratna Cafe on Triplicane High Road before a session, for the idli-sambar with unlimited
              refills, and try Murugan Idli Shop for a direct comparison. Be there before 10am, or you&apos;ll
              likely be choosing from a shorter menu once lunch service starts. Ask for the coffee &quot;meter&quot;
              style if you want to watch it poured tumbler to dabara.
            </p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              <span className="font-bold text-white">Ahmedabad:</span>{" "}
              Book Agashiye for a thali, and call ahead if you want a specific dish because the menu changes
              daily. Get to Manek Chowk around 8pm, when the market first turns into a food street, and leave before
              it becomes a crush at 9-10pm.
            </p>
          </div>

          <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Eating on matchday</p>
          <p className="text-sm text-[#A3A3A3] leading-7 mb-6">
            At VCA Stadium in Jamtha, outside food, drinks and large bags aren&apos;t allowed past the gates, and
            the food court queues get long fast once play starts, so eat properly before you arrive. Jamtha is a
            stadium precinct, not a neighbourhood, so there&apos;s nowhere to walk to for lunch. At Ahmedabad, the
            stadium is so large that reaching food and getting back to your seat takes noticeably longer than at a
            normal ground, so plan your breaks around that.
          </p>

          <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5">
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">One rule for all three cities</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Drink only sealed bottled water with an intact cap, use it to brush your teeth, and be cautious with
              ice unless you know where it came from. Street food stalls at Manek Chowk are worth doing for the
              atmosphere, but stick to busy stalls with high turnover.
            </p>
          </div>
        </div>
      )}
    </SpokeShell>
  );
}
