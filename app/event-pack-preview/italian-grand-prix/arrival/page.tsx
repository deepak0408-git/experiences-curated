import type { Metadata } from "next";
import SpokeShell from "../_components/SpokeShell";

export const metadata: Metadata = {
  title: "Monza Gates — What Time to Arrive for the Italian Grand Prix",
};

export default function ArrivalSpoke() {
  return (
    <SpokeShell status="public" h1="When to arrive at Monza" question="What time should I arrive at Monza gates?">
      <div className="rounded-sm border border-dashed border-[#2A2A2A] bg-[#141414]/50 p-6">
        <p className="text-sm text-[#6A6A6A]">
          Real, researched content for this section — not yet written. Placeholder shown so the full page shape is visible.
        </p>
      </div>
    </SpokeShell>
  );
}
