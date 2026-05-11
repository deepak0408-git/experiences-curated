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
      className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors underline shrink-0"
    >
      Sign out
    </button>
  );
}
