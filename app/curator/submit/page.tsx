export const dynamic = "force-dynamic";

import Link from "next/link";
import { getDestinations } from "./actions";
import { ExperienceForm } from "./_components/ExperienceForm";

export const metadata = {
  title: "Submit Experience",
};

export default async function SubmitExperiencePage() {
  const destinations = await getDestinations();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#AAFF00]">New Experience</h1>
        <p className="mt-1 text-sm text-[#6A6A6A]">
          Every field matters. The specificity you bring here is what makes an
          experience worth reading.
        </p>
      </div>
      {destinations.length === 0 && (
        <div className="mb-6 rounded-sm border border-amber-800 bg-amber-950 px-4 py-3 text-sm text-amber-400">
          No destinations yet.{" "}
          <Link href="/curator/destinations/new" className="font-medium underline">
            Add a destination first
          </Link>{" "}
          before submitting an experience.
        </div>
      )}
      <ExperienceForm destinations={destinations} />
    </div>
  );
}
