import { getSpokeData, getSpokeImage, getSpokesForEvent, getPurchaseStatus } from "../../_lib/getSpokeData";
import SpokeShell from "../../_components/SpokeShell";
import SpokeExperienceCard from "../../_components/SpokeExperienceCard";

const SPOKE_ID = "getting-there";

// Real content sourced from the seeded Getting to Lusail Circuit experience
// (qatar-gp-getting-there-mtymqst2), 13 Sep 2026: Doha Metro Red Line to
// Lusail Station + free ticket-holder shuttle (included with any race
// ticket, extended race-weekend hours), Karwa taxi as the paid door-to-door
// option, and a real self-drive route + warning.
export default async function GettingThereSpoke({ eventSlug }: { eventSlug: string }) {
  const { event, linkedExperiences } = await getSpokeData(eventSlug);
  const spoke = getSpokesForEvent(eventSlug).find((s) => s.id === SPOKE_ID)!;
  const heroImageUrl = spoke.imageOverride ?? getSpokeImage(linkedExperiences, spoke.imageSlug);
  const gettingThereGuide = linkedExperiences.find((e) => e.slug.includes("qatar-gp-getting-there-"));
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
      h1="The Doha Metro Red Line to Lusail Station, then a free shuttle — no extra cost with any race ticket"
      question={spoke.question}
      heroImageUrl={heroImageUrl}
      heroImagePosition={spoke.heroImagePosition}
      isUnlocked={isUnlocked}
    >
      <p className="text-sm text-[#A3A3A3] leading-7 mb-8">
        Getting to Lusail Circuit costs nothing beyond the ticket you already bought, which is a genuine rarity on
        this calendar — most other Grands Prix charge separately for the shuttle or leave you to figure out transit
        on your own.
      </p>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Doha Metro Red Line + free shuttle — the default choice</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6 mb-4">
          Ride the Red Line to Lusail Metro Station — both central Doha and Hamad International Airport connect
          directly, no transfers needed. From the station&apos;s east side, a free shuttle bus runs straight to the
          circuit. Any valid race ticket already includes a 3-day metro and shuttle pass, so this route is genuinely
          free on top of what you paid for entry.
        </p>
        <div className="flex flex-col gap-2">
          <FactRow label="Shuttle ride time" value="~20 minutes normally, up to 40 at peak times when traffic backs up near the venue" />
          <FactRow label="Friday hours" value="11:45am – 1am" />
          <FactRow label="Saturday hours" value="1:15pm – 1am" />
          <FactRow label="Sunday hours" value="11:45am – 2am (covers the post-race crowd exodus)" />
        </div>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Karwa taxi — the faster, paid door-to-door option</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <p className="text-sm text-[#A3A3A3] leading-6">
          Karwa&apos;s turquoise metered cabs run 24/7 and reliably handle both directions, including pickups from
          the circuit itself after the race. Uber can get you there but doesn&apos;t reliably handle circuit
          departures — plan to use Karwa for the return trip regardless of which app you book going in. Expect
          roughly QAR 35 (about US$10) from central Doha, with a 50% surcharge after midnight — relevant since the
          race itself doesn&apos;t finish until well after dark. Budget 30 minutes without traffic, more on race
          weekend.
        </p>
      </div>

      <div className="rounded-sm border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-5 mb-8">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">Driving yourself — possible, with real caveats</p>
        <p className="text-sm text-[#A3A3A3] leading-6">
          Parking is free but limited, so car-sharing among your group is worth it. Exit the motorway at Exit 29B and
          follow spectator signage from there; avoid the Al Khor Coastal Road after the Wadi Al Wasah junction, a
          known race-day bottleneck. Rental cars are available from Europcar, Hertz, and Avis at Hamad International
          Airport. Worth knowing before you get behind the wheel: driving standards in Doha, particularly in denser
          traffic, run less predictable than many visitors are used to — factor that into whether self-driving is
          actually the right call for your trip.
        </p>
      </div>

      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Essential apps for the trip</p>
      <div className="rounded-sm border border-[#2A2A2A] bg-[#141414] p-5 mb-8">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-bold text-white mb-1">The official F1 Race Guide app</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Covers every circuit on the calendar, including Lusail — interactive circuit maps, real-time schedule
              alerts, and geotagged points for grandstands, food, and fan-zone activities. Worth downloading before
              you land.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Karwa</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Qatar&apos;s own metered taxi app, and the reliable choice for a circuit departure after the race —
              Uber often can&apos;t find drivers willing to pick up from Lusail once the crowd starts leaving. Have
              it installed before race day, not downloaded on the fly at the exit.
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Doha Metro app / Qatar Rail</p>
            <p className="text-sm text-[#A3A3A3] leading-6">
              Useful for checking real-time Red Line service and station status, particularly on race weekend when
              crowd volumes can affect normal timing. Your physical or digital race ticket is your metro pass — no
              separate top-up needed for this trip.
            </p>
          </div>
        </div>
      </div>

      {gettingThereGuide && (
        <div className="mb-8">
          <SpokeExperienceCard eventSlug={eventSlug} experience={gettingThereGuide} isPro={isPro} />
        </div>
      )}

      <div className="mt-2 pt-10 border-t border-[#2A2A2A]">
        <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-2">What we&apos;d actually do</p>
        <p className="text-sm text-[#A3A3A3] leading-7">
          Take the metro and free shuttle on the way in — it&apos;s genuinely free, direct from the airport if
          you&apos;re arriving that day, and there&apos;s no real reason to pay for a taxi when the included option
          is this straightforward. On the way out, especially after a night race finishing well past dark, switch
          to Karwa rather than fighting the post-race shuttle crowd — the 50%-after-midnight surcharge is a small
          price for skipping what can be a genuinely long wait for the last shuttles of the night.
        </p>
      </div>
    </SpokeShell>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-black tracking-widest uppercase text-[#6A6A6A] mb-0.5">{label}</p>
      <p className="text-sm text-[#A3A3A3] leading-6">{value}</p>
    </div>
  );
}
