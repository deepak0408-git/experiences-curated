"use client";

export default function CookieSettingsButton() {
  const reset = () => {
    try {
      localStorage.removeItem("ec_cookie_consent");
    } catch {
      // ignore — nothing to clear if storage is denied
    }
    window.location.reload();
  };

  return (
    <button
      onClick={reset}
      className="text-xs text-[#6A6A6A] hover:text-[#AAFF00] transition-colors underline underline-offset-2"
    >
      Cookie settings
    </button>
  );
}
