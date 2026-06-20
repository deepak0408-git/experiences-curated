"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SignInLink({ overlay = false }: { overlay?: boolean }) {
  const pathname = usePathname();
  const href = pathname === "/" ? "/sign-in" : `/sign-in?next=${encodeURIComponent(pathname)}`;
  return (
    <Link href={href} className="text-sm transition-colors text-[#6A6A6A] hover:text-[#AAFF00]">
      Sign in
    </Link>
  );
}
