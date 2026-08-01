import type { Metadata } from "next";
import SpokeShell from "../_components/SpokeShell";

export const metadata: Metadata = {
  title: "Monza Circuit Map — Grandstands & Gates Explained",
};

// Scope note: this spoke is inside-the-venue only (grandstands, entrances,
// facilities once you're through the gate) — the macro route + last-mile
// walk lives on Getting There instead, so the two don't overlap.
export default function MapSpoke() {
  return (
    <SpokeShell status="public" h1="Monza circuit map" question="Where are the Monza grandstands on the circuit map?">
      <div className="rounded-sm border border-dashed border-[#2A2A2A] bg-[#141414]/50 p-6">
        <p className="text-sm text-[#6A6A6A]">
          Real, researched content for this section — not yet written. Placeholder shown so the full page shape is visible.
        </p>
      </div>
    </SpokeShell>
  );
}
