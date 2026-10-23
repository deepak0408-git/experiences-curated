import { AO2027_ARENA_MAPS, RG2027_ARENA_MAPS } from "../_lib/arenaMaps";
import ZoomableArenaMap from "./ZoomableArenaMap";

// Static reference content — spec 20 Oct 2026. Renders immediately after
// the second alternative recommendation card, outside the recommendation
// cards themselves. Not a ticket option; reads no scoring/eligibility
// data. Single-column vertical layout on all viewports, per spec (no
// carousel/tabs/accordion/grid).
//
// Parameterized by eventSlug (22 Oct 2026, French Open onboarding) instead
// of importing AO2027_ARENA_MAPS directly — the previous version was
// hardcoded to Australian Open's 3 maps and copy ("the three main
// Australian Open arenas") for every tournament. Defaults to Australian
// Open's own maps/copy when eventSlug is omitted or unrecognized, so any
// existing call site that doesn't pass eventSlug keeps rendering
// byte-identically to before this change.
const MAPS_BY_SLUG: Record<string, { label: string; introCopy: string; maps: readonly { arena: string; url: string }[] }> = {
  "australian-open": {
    label: "Arena Maps",
    introCopy: "Explore the seating layouts of the three main Australian Open arenas.",
    maps: AO2027_ARENA_MAPS,
  },
  "french-open": {
    label: "Court Maps",
    introCopy: "Explore the seating layouts of Roland-Garros's four ticketed courts.",
    maps: RG2027_ARENA_MAPS,
  },
};

export default function ArenaMapsSection({ eventSlug }: { eventSlug?: string }) {
  const config = (eventSlug && MAPS_BY_SLUG[eventSlug]) || MAPS_BY_SLUG["australian-open"];
  return (
    <div className="max-w-2xl mt-10">
      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">{config.label}</p>
      <p className="text-sm text-[#A3A3A3] mb-6">{config.introCopy}</p>
      <div className="flex flex-col gap-10">
        {config.maps.map((map) => (
          <div key={map.arena}>
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">{map.arena}</p>
            <ZoomableArenaMap src={map.url} alt={`${map.arena} seating map`} />
          </div>
        ))}
      </div>
      <p className="text-xs text-[#6A6A6A] mt-6 italic">
        Illustrative seating maps for orientation only. Actual seat locations, configurations and availability may
        vary. Refer to the official ticketing platform for current details.
      </p>
    </div>
  );
}
