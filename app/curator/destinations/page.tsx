import Link from "next/link";
import { getAllDestinations } from "./actions";

export const metadata = { title: "Destinations" };

export default async function DestinationsPage() {
  const destinations = await getAllDestinations();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Destinations</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {destinations.length} destination{destinations.length !== 1 ? "s" : ""} in the database
          </p>
        </div>
        <Link
          href="/curator/destinations/new"
          className="px-4 py-2.5 rounded-lg bg-neutral-900 text-sm font-medium text-white hover:bg-neutral-700 transition-colors"
        >
          + Add Destination
        </Link>
      </div>

      {destinations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 p-12 text-center">
          <p className="text-neutral-400 text-sm">No destinations yet.</p>
          <Link
            href="/curator/destinations/new"
            className="mt-3 inline-block text-sm font-medium text-neutral-900 underline"
          >
            Add your first destination
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-neutral-200 divide-y divide-neutral-100">
          {destinations.map((d) => (
            <div key={d.id} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center justify-center w-10 h-7 rounded bg-neutral-100 text-xs font-bold text-neutral-600 tracking-wider">
                  {d.countryCode}
                </span>
                <div>
                  <p className="text-sm font-medium text-neutral-900">{d.name}</p>
                  <p className="text-xs text-neutral-400 capitalize">
                    {d.destinationType}{d.region ? ` · ${d.region}` : ""}{d.currency ? ` · ${d.currency}` : ""}
                  </p>
                </div>
              </div>
              <Link
                href={`/curator/submit?destination=${d.id}`}
                className="text-xs text-neutral-400 hover:text-neutral-900 transition-colors"
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
