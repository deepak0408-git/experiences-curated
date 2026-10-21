"use client";

import Link from "next/link";
import CockpitModal from "./CockpitModal";

// All 6 live tennis host destinations, confirmed directly against
// sportingEvents.destinationId for every tennis sporting_events row (not
// assumed) — unlike F1's DestinationsModal, every entry here is a genuine
// host destination, so no "nearby but not a host" exception is needed.
// PLACEHOLDER LIST pending explicit founder sign-off, per CLAUDE.md's
// destination/experience-list confirmation rule — do not treat as final.
const DESTINATIONS = [
  { slug: "london-gb", name: "London", note: "Host destination — Wimbledon" },
  { slug: "new-york-us", name: "New York", note: "Host destination — US Open" },
  { slug: "paris-fr", name: "Paris", note: "Host destination — French Open" },
  { slug: "melbourne-au", name: "Melbourne", note: "Host destination — Australian Open" },
  { slug: "turin", name: "Turin", note: "Host destination — Nitto ATP Finals" },
  { slug: "shanghai", name: "Shanghai", note: "Host destination — Shanghai Masters" },
];

export default function DestinationsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <CockpitModal open={open} onClose={onClose} title="Tennis Destinations">
      <p className="text-sm text-[#A3A3A3] mb-4">
        The host destinations of every tennis tournament we currently cover.
      </p>
      <ul className="space-y-2">
        {DESTINATIONS.map((d) => (
          <li key={d.slug}>
            <Link
              href={`/destination/${d.slug}?from=tennis-cockpit`}
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
