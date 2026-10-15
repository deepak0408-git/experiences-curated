"use client";

import Link from "next/link";
import { phEvent } from "@/lib/posthog-events";

export default function CockpitHomepageCtaLink({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <Link href="/formula-1" className={className} onClick={() => phEvent.cockpitHomepageCtaClicked()}>
      {children}
    </Link>
  );
}
