"use client";

import Link from "next/link";
import { phEvent } from "@/lib/posthog-events";

export default function TennisCockpitHomepageCtaLink({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <Link href="/tennis" className={className} onClick={() => phEvent.tennisCockpitHomepageCtaClicked()}>
      {children}
    </Link>
  );
}
