"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <button
      onClick={handleSignOut}
      className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors underline"
    >
      Sign out
    </button>
  );
}
