export const dynamic = "force-dynamic";

import { getEventsForPriceEditor } from "./actions";
import PriceEditorForm from "./_components/PriceEditorForm";
import { getAuthUser } from "@/lib/supabase/server";

export const metadata = { title: "Pricing — Curator" };

export default async function PricePage() {
  const events = await getEventsForPriceEditor();
  const { user } = await getAuthUser();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#AAFF00]">Pricing</h1>
        <p className="mt-1 text-sm text-[#6A6A6A]">
          Update a pack&apos;s displayed price here right after changing it in the Dodo dashboard — this is what
          shows on the pack page, homepage, and experience pages. Early-bird cutoff is read-only, set via Vercel
          env vars.
        </p>
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-[#6A6A6A]">No priced, unended events found.</p>
      ) : (
        <PriceEditorForm events={events} curatorEmail={user?.email ?? "unknown"} />
      )}
    </div>
  );
}
