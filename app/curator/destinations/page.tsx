export const dynamic = "force-dynamic";

import Link from "next/link";
import { getAllDestinations } from "./actions";

export const metadata = { title: "Destinations" };

export default async function DestinationsPage() {
  const destinations = await getAllDestinations();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#AAFF00]">Destinations</h1>
          <p className="mt-1 text-sm text-[#6A6A6A]">
            {destinations.length} destination{destinations.length !== 1 ? "s" : ""} in the database
          </p>
        </div>
        <Link
          href="/curator/destinations/new"
          className="px-4 py-2.5 rounded-sm bg-[#AAFF00] text-sm font-black text-black hover:bg-[#BBFF33] transition-colors"
        >
          + Add Destination
        </Link>
      </div>

      {destinations.length === 0 ? (
        <div className="rounded-sm border border-dashed border-[#2A2A2A] p-12 text-center">
          <p className="text-[#6A6A6A] text-sm">No destinations yet.</p>
          <Link
            href="/curator/destinations/new"
            className="mt-3 inline-block text-sm font-medium text-[#AAFF00] underline"
          >
            Add your first destination
          </Link>
        </div>
      ) : (
        <div className="bg-[#141414] rounded-sm border border-[#2A2A2A] divide-y divide-[#2A2A2A]">
          {destinations.map((d) => (
            <div key={d.id} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center justify-center w-10 h-7 rounded-sm bg-[#1A1A1A] border border-[#2A2A2A] text-xs font-bold text-[#A3A3A3] tracking-wider">
                  {d.countryCode}
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{d.name}</p>
                  <p className="text-xs text-[#6A6A6A] capitalize">
                    {d.destinationType}{d.region ? ` · ${d.region}` : ""}{d.currency ? ` · ${d.currency}` : ""}
                  </p>
                </div>
              </div>
              <Link
                href={`/curator/submit?destination=${d.id}`}
                className="text-xs text-[#6A6A6A] hover:text-[#AAFF00] transition-colors"
              >
                Add experience →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
