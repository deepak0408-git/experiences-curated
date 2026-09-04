import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "map";

// Real facts sourced during experience research: court capacities (Chatrier
// 15,225, Lenglen 10,068), Court 14's semi-sunken outer-court design, the
// Tenniseum's 2024 reopening. Stadium Backstage Tour + Tenniseum's card
// lives here as the grounds/facility anchor.
export default async function MapSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const { hasPurchased, justPurchased, isPro } = await getPurchaseStatus(eventSlug, event.id, event.isHidden);
  const isUnlocked = hasPurchased;
  const tenniseum = linkedExperiences.find((e) => e.slug.includes("roland-garros-stadium-tour-tenniseum"));

  return (
    <SpokeShell
      eventSlug={eventSlug}
      eventId={event.id}
      eventCurrency={event.packCurrency}
      spokeId={SPOKE_ID}
      justPurchased={justPurchased}
      eventName="French Open"
      status="public"
      h1="Three show courts, a botanical-garden court, and a museum inside the grounds"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Stade Roland-Garros packs three show courts, more than a dozen outer courts, and a genuine museum into a
        compact site in the 16th arrondissement. What's less obvious from a broadcast feed is how each court has its
        own distinct character — this is the grounds-level guide to what's actually where.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Site facts</p>
      <div className="flex flex-col gap-2 mb-8">
        <FactRow label="Address" value="2 Avenue Gordon Bennett, 75016 Paris, France" />
        <FactRow label="Court Philippe-Chatrier" value="15,225 seats, red clay since 1928, retractable roof since 2020" />
        <FactRow label="Court Suzanne-Lenglen" value="10,068 seats, built 1994, retractable roof since 2020" />
        <FactRow label="Court Simonne-Mathieu" value="5,000 seats, opened 2019, wrapped in working greenhouses in the Jardin des Serres d'Auteuil" />
      </div>

      {tenniseum && (
        <div className="mb-8">
          <SpokeExperienceCard experience={tenniseum} isPro={isPro} />
        </div>
      )}

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm font-bold text-white mb-2">Court 14 — the loudest room on the grounds</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Semi-sunken, 2,200 seats, inaugurated 2018, in the Fonds des Princes extension. French players actively
          want to be drawn here in the first week — the crowd is close, loud, and partisan in a way the bigger show
          courts rarely match. Outer-court seating is unreserved and first-come.
        </p>
      </div>

      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm font-bold text-white mb-2">Watching outer-court tennis well</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Check the daily order of play the evening before at rolandgarros.com — first-round matches at Courts 6,
          7, 9, 12, and 13 regularly feature ranked professionals in front of crowds small enough to hear the
          players talking to themselves between points.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Food and facilities on-site</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Concessions across the grounds</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            Bar des Mousquetaires, a main food court (croque-monsieur, galettes), and grocery-style stands near
            Suzanne-Lenglen, Court 6, and Fonds des Princes. See the full{" "}
            <a href={`/event-pack/${eventSlug}/where-to-eat`} className="text-[#AAFF00] hover:text-[#BBFF33] underline">
              Where to Eat guide
            </a>
            .
          </p>
        </div>
        <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <p className="text-sm font-bold text-white mb-1">Le Jardin des Chefs</p>
          <p className="text-xs text-[#A3A3A3] leading-5">
            A chef-led culinary hub built into the Jardin des Serres d&apos;Auteuil near Court Simonne-Mathieu — a
            2026-specific initiative; confirm it recurs for 2027 closer to the tournament.
          </p>
        </div>
      </div>

      <p className="text-xs text-[#6A6A6A] mt-8">
        Sources: rolandgarros.com, stade.rolandgarros.com.
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
