import type { Metadata } from "next";
import SpokeShell from "../_components/SpokeShell";

export const metadata: Metadata = {
  title: "Italian Grand Prix Weather — What to Pack for Monza",
};

export default function WeatherSpoke() {
  return (
    <SpokeShell status="public" h1="Monza weather & what to pack" question="What's the weather like at Monza, and what should I pack?">
      <Placeholder />
    </SpokeShell>
  );
}

function Placeholder() {
  return (
    <div className="rounded-sm border border-dashed border-[#2A2A2A] bg-[#141414]/50 p-6">
      <p className="text-sm text-[#6A6A6A]">
        Real, researched content for this section — not yet written. Placeholder shown so the full page shape is visible.
      </p>
    </div>
  );
}
