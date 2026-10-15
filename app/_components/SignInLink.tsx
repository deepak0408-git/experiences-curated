"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

function SignInLinkInner({ overlay = false }: { overlay?: boolean }) {
  const pathname = usePathname();
  // Preserve the query string (e.g. ?from=cockpit) through the sign-in
  // redirect, not just the path — previously `next=` dropped any query
  // params, silently losing contextual-return state like the Cockpit's
  // "Back to F1 Cockpit" origin. Approved — Phase 2 Decision 2.
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const fullPath = search ? `${pathname}?${search}` : pathname;
  const href = pathname === "/" ? "/sign-in" : `/sign-in?next=${encodeURIComponent(fullPath)}`;
  return (
    <Link href={href} className={`text-xs sm:text-sm transition-colors whitespace-nowrap hover:text-[#AAFF00] ${overlay ? "text-white/80" : "text-[#6A6A6A]"}`}>
      Sign in
    </Link>
  );
}

// useSearchParams() requires a Suspense boundary in Next 16 or prerendering
// fails — wrapped internally here, rather than requiring every HomepageNav
// call site across the site to add its own boundary. Fallback renders the
// same link without query preservation for the one-frame gap before
// searchParams resolves, so nothing visibly breaks.
export default function SignInLink({ overlay = false }: { overlay?: boolean }) {
  return (
    <Suspense fallback={<Link href="/sign-in" className={`text-xs sm:text-sm transition-colors whitespace-nowrap hover:text-[#AAFF00] ${overlay ? "text-white/80" : "text-[#6A6A6A]"}`}>Sign in</Link>}>
      <SignInLinkInner overlay={overlay} />
    </Suspense>
  );
}
