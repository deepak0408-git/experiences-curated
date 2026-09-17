import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { sportingEvents } from "@/schema/database";
import { eq } from "drizzle-orm";
import InlineDodoCheckout from "./_components/InlineDodoCheckout";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    productId?: string;
    priceTier?: string;
    productType?: string;
    successUrl?: string;
  }>;
}

const VALID_PRODUCT_TYPES = ["tickets_guide", "hotels_guide", "itinerary_guide"] as const;

export default async function EventPackCheckoutPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { productId, priceTier, productType, successUrl } = await searchParams;

  if (!productId || !successUrl) notFound();

  const [event] = await db
    .select({ id: sportingEvents.id, name: sportingEvents.name })
    .from(sportingEvents)
    .where(eq(sportingEvents.slug, slug))
    .limit(1);

  if (!event) notFound();

  const resolvedProductType = VALID_PRODUCT_TYPES.includes(productType as (typeof VALID_PRODUCT_TYPES)[number])
    ? (productType as (typeof VALID_PRODUCT_TYPES)[number])
    : undefined;
  const resolvedPriceTier = priceTier === "early_bird" ? "early_bird" : "standard";

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-10 px-4">
      <div className="max-w-lg mx-auto">
        <Link href={`/event-pack/${slug}`} className="text-xs text-[#6A6A6A] hover:text-[#AAFF00] transition-colors">
          ← Back to {event.name}
        </Link>
        <div className="mt-6 rounded-sm border border-[#2A2A2A] bg-[#141414] p-4">
          <InlineDodoCheckout
            productId={productId}
            sportingEventId={event.id}
            priceTier={resolvedPriceTier}
            productType={resolvedProductType}
            successUrl={successUrl}
          />
        </div>
      </div>
    </div>
  );
}
