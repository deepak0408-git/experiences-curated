// Extracted static prose from FirstTimerGuideSpoke.tsx (app/event-pack/
// [slug]/_hub-and-spoke/spokes/shanghai-masters/FirstTimerGuideSpoke.tsx),
// for the Full Pack PDF build. Prose half only, hand-copied not
// paraphrased.
//
// Note: source spoke has no {isUnlocked && (...)} Pro-gated block — no
// `verdicts` field here, matches the source.

export const shanghaiMastersFirstTimerGuideSpokeContent = {
  intro:
    "Shanghai is the first destination in our coverage where the basic mechanics of a trip — visas, maps, paying for things — work differently enough from the UK, EU, US, or Australia that it's worth a dedicated guide rather than assuming it works like everywhere else.",

  fourThings: {
    label: "The four things to sort before you fly",
    items: [
      { label: "1. Check your visa-free eligibility", body: "45 countries get 30-day visa-free entry; a separate 240-hour transit-free policy covers 54 countries through specific ports. Check your specific nationality before booking." },
      { label: "2. Download Amap, not Google Maps", body: "Google Maps is blocked in China and a VPN doesn't fix the underlying data. Amap (Gaode Maps) has the best English support of the local options." },
      { label: "3. Link a foreign card to Alipay", body: "Alipay and WeChat Pay both accept international Visa/Mastercard directly, no Chinese bank account needed — set this up before you land." },
      { label: "4. Set up a metro-gate app: Metro Daduhui or Suishenxing", body: "Metro Daduhui is Shanghai Metro's own QR-scan app for gate entry/exit and transfers, drawing on Alipay or WeChat Pay. For more than a couple of trips, Suishenxing (SH MaaS) bundles metro, bus, and ferry into one code with 1/3/7-day passes." },
    ],
  },

  gateRules: {
    label: "What's not allowed through Qizhong's gates",
    body:
      "Bags larger than 55 × 40 × 20cm, glass bottles, alcohol, unauthorized professional camera/video equipment, and long-handled umbrellas are all prohibited — bring a compact one instead, since this is an outdoor hard-court venue and Shanghai in October does see occasional rain. One genuinely distinctive rule: food that's strong-smelling or disruptive to other spectators is banned by name — durian, stinky tofu, eggs, and potato chips are all specifically called out. Bring sun protection and your ID/passport used for the ticket purchase.",
  },

  cityBeyondTennis: {
    label: "The city, not just the tennis",
    body:
      "Shanghai is a genuinely distinct city beyond the arena — the Bund's colonial-era waterfront facing off against Lujiazui's futuristic skyline across the river, Yu Garden's Ming-dynasty lanes tucked into the Old City, and the French Concession's tree-lined streets a world away from either. If this is your first trip here, budget real time for the city itself, not just Qizhong.",
  },

  sourcesFooter:
    "Sources: china-briefing.com, newlandchase.com, chinadiscovery.com (visa policy), chinasurvivalkit.com (Amap/Baidu), realchinatrip.com and you.co (payments), english.shanghai.gov.cn (metro apps), ATP Tour official article \"Shanghai 2025 Savour The Spectacle\" (Court 17), en.rolexshanghaimasters.com/en/faqs (bag policy, prohibited items — official source). Verified 10 Aug 2026.",
};

// DB-derived data NOT extracted here — the PDF route must wire this up
// itself via getSpokeData(eventSlug):
// - linkedExperiences lookup for a card:
//   - "china-visa-apps-payments-guide" (visaGuide)
