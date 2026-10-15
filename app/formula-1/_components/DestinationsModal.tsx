"use client";

import Link from "next/link";
import CockpitModal from "./CockpitModal";

// 4 live homepage destinations only (London, Melbourne, Shanghai, Abu Dhabi
// — homepageSlot 1-4), per owner instruction. Melbourne/Shanghai/Abu Dhabi
// are direct F1 host destinations (live Event Guide); London is included
// for its ~90km proximity to Silverstone (British GP 2027, still planned/
// hidden) — never described as an F1 host city itself.
const DESTINATIONS = [
  { slug: "melbourne-au", name: "Melbourne", note: "Host destination — Australian Grand Prix" },
  { slug: "shanghai", name: "Shanghai", note: "Host destination — Chinese Grand Prix" },
  { slug: "abu-dhabi", name: "Abu Dhabi", note: "Host destination — Abu Dhabi Grand Prix" },
  { slug: "london-gb", name: "London", note: "Near Silverstone, home of the British Grand Prix" },
];

export default function DestinationsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <CockpitModal open={open} onClose={onClose} title="F1 Destinations">
      <p className="text-sm text-[#A3A3A3] mb-4">
        A few featured F1-related destinations — not an exhaustive list of every city we cover.
      </p>
      <ul className="space-y-2">
        {DESTINATIONS.map((d) => (
          <li key={d.slug}>
            <Link
              href={`/destination/${d.slug}?from=cockpit`}
              className="flex items-center justify-between rounded-sm border border-[#2A2A2A] hover:border-[#AAFF00] transition-colors p-3.5"
            >
              <span>
                <span className="block text-sm font-black text-white">{d.name}</span>
                <span className="block text-xs text-[#6A6A6A] mt-0.5">{d.note}</span>
              </span>
              <span className="text-[#AAFF00] text-sm">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </CockpitModal>
  );
}
