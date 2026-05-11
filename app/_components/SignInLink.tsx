"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SignInLink() {
  const pathname = usePathname();
  const href = pathname === "/" ? "/sign-in" : `/sign-in?next=${encodeURIComponent(pathname)}`;
  return (
    <Link href={href} className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
      Sign in
    </Link>
  );
}
