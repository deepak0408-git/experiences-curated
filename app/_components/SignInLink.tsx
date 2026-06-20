"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SignInLink({ overlay = false }: { overlay?: boolean }) {
  const pathname = usePathname();
  const href = pathname === "/" ? "/sign-in" : `/sign-in?next=${encodeURIComponent(pathname)}`;
  return (
    <Link href={href} className={`text-sm transition-colors ${overlay ? "text-white/80 hover:text-white" : "text-neutral-500 hover:text-neutral-900"}`}>
      Sign in
    </Link>
  );
}
