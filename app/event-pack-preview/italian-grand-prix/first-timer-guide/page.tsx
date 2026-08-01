import type { Metadata } from "next";
import SpokeShell from "../_components/SpokeShell";

export const metadata: Metadata = {
  title: "Italian Grand Prix First-Timer's Guide — Common Mistakes to Avoid",
};

export default function FirstTimerSpoke() {
  return (
    <SpokeShell status="public" h1="Monza first-timer's guide" question="What do first-time Monza visitors get wrong?">
      <div className="rounded-sm border border-dashed border-[#2A2A2A] bg-[#141414]/50 p-6">
        <p className="text-sm text-[#6A6A6A]">
          Real, researched content for this section — not yet written. Placeholder shown so the full page shape is visible.
        </p>
      </div>
    </SpokeShell>
  );
}
