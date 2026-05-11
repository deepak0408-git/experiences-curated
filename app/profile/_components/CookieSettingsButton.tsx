"use client";

export default function CookieSettingsButton() {
  const reset = () => {
    localStorage.removeItem("ec_cookie_consent");
    window.location.reload();
  };

  return (
    <button
      onClick={reset}
      className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors underline underline-offset-2"
    >
      Cookie settings
    </button>
  );
}
