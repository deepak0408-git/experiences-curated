import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { newsletterSubscribers } from "@/schema/database";

export const metadata = { title: "Unsubscribed — Experiences | Curated" };

export default async function UnsubscribePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, id));

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-[#AAFF00] mb-4">
          Experiences | Curated
        </p>
        <h1 className="text-2xl font-black text-white leading-snug mb-3">
          You&apos;ve been unsubscribed.
        </h1>
        <p className="text-sm text-[#A3A3A3] leading-relaxed">
          You won&apos;t hear from us again unless you sign up separately.
        </p>
      </div>
    </div>
  );
}
