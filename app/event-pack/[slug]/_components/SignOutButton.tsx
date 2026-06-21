"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <button
      onClick={signOut}
      className="text-xs text-[#6A6A6A] hover:text-[#AAFF00] transition-colors underline underline-offset-2 shrink-0"
    >
      Sign out
    </button>
  );
}
