import { AO2027_ARENA_MAPS } from "../_lib/arenaMaps";
import ZoomableArenaMap from "./ZoomableArenaMap";

// Static reference content — spec 20 Oct 2026. Renders immediately after
// the second alternative recommendation card, outside the recommendation
// cards themselves. Not a ticket option; reads no scoring/eligibility
// data. Single-column vertical layout on all viewports, per spec (no
// carousel/tabs/accordion/grid).
export default function ArenaMapsSection() {
  return (
    <div className="max-w-2xl mt-10">
      <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">Arena Maps</p>
      <p className="text-sm text-[#A3A3A3] mb-6">
        Explore the seating layouts of the three main Australian Open arenas.
      </p>
      <div className="flex flex-col gap-10">
        {AO2027_ARENA_MAPS.map((map) => (
          <div key={map.arena}>
            <p className="text-xs font-black tracking-widest uppercase text-[#AAFF00] mb-3">{map.arena}</p>
            <ZoomableArenaMap src={map.url} alt={`${map.arena} seating map`} />
          </div>
        ))}
      </div>
      <p className="text-xs text-[#6A6A6A] mt-6 italic">
        Illustrative seating maps for orientation only. Actual seat locations, configurations and availability may
        vary. Refer to the official Australian Open ticketing platform for current details.
      </p>
    </div>
  );
}
