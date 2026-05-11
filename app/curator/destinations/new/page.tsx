import { createDestination } from "../actions";

export const metadata = { title: "Add Destination" };

const TIMEZONES = [
  { group: "Australia & Pacific", options: [
    { value: "Australia/Sydney",    label: "Sydney, Canberra (AEST/AEDT)" },
    { value: "Australia/Melbourne", label: "Melbourne (AEST/AEDT)" },
    { value: "Australia/Brisbane",  label: "Brisbane (AEST, no DST)" },
    { value: "Australia/Adelaide",  label: "Adelaide (ACST/ACDT)" },
    { value: "Australia/Perth",     label: "Perth (AWST)" },
    { value: "Australia/Darwin",    label: "Darwin (ACST, no DST)" },
    { value: "Pacific/Auckland",    label: "Auckland, Wellington (NZST/NZDT)" },
    { value: "Pacific/Fiji",        label: "Fiji (FJT)" },
    { value: "Pacific/Honolulu",    label: "Honolulu (HST)" },
  ]},
  { group: "Asia", options: [
    { value: "Asia/Tokyo",          label: "Tokyo, Osaka (JST)" },
    { value: "Asia/Shanghai",       label: "Beijing, Shanghai (CST)" },
    { value: "Asia/Hong_Kong",      label: "Hong Kong (HKT)" },
    { value: "Asia/Singapore",      label: "Singapore, Kuala Lumpur (SGT)" },
    { value: "Asia/Bangkok",        label: "Bangkok, Chiang Mai (ICT)" },
    { value: "Asia/Jakarta",        label: "Jakarta (WIB)" },
    { value: "Asia/Makassar",       label: "Bali, Lombok (WITA)" },
    { value: "Asia/Seoul",          label: "Seoul (KST)" },
    { value: "Asia/Taipei",         label: "Taipei (CST)" },
    { value: "Asia/Kolkata",        label: "India — Delhi, Mumbai (IST)" },
    { value: "Asia/Colombo",        label: "Sri Lanka (IST)" },
    { value: "Asia/Kathmandu",      label: "Nepal, Kathmandu (NPT)" },
    { value: "Asia/Dubai",          label: "Dubai, Abu Dhabi (GST)" },
    { value: "Asia/Qatar",          label: "Doha (AST)" },
    { value: "Asia/Riyadh",         label: "Riyadh (AST)" },
    { value: "Asia/Jerusalem",      label: "Tel Aviv (IST/IDT)" },
    { value: "Asia/Beirut",         label: "Beirut (EET/EEST)" },
    { value: "Asia/Karachi",        label: "Karachi (PKT)" },
  ]},
  { group: "Europe", options: [
    { value: "Europe/London",       label: "London, Edinburgh (GMT/BST)" },
    { value: "Europe/Dublin",       label: "Dublin (GMT/IST)" },
    { value: "Europe/Lisbon",       label: "Lisbon, Porto (WET/WEST)" },
    { value: "Europe/Paris",        label: "Paris, Madrid, Rome (CET/CEST)" },
    { value: "Europe/Berlin",       label: "Berlin, Vienna, Warsaw (CET/CEST)" },
    { value: "Europe/Amsterdam",    label: "Amsterdam, Brussels (CET/CEST)" },
    { value: "Europe/Zurich",       label: "Zurich, Geneva (CET/CEST)" },
    { value: "Europe/Stockholm",    label: "Stockholm, Oslo, Copenhagen (CET/CEST)" },
    { value: "Europe/Helsinki",     label: "Helsinki (EET/EEST)" },
    { value: "Europe/Athens",       label: "Athens (EET/EEST)" },
    { value: "Europe/Istanbul",     label: "Istanbul (TRT)" },
    { value: "Europe/Moscow",       label: "Moscow (MSK)" },
    { value: "Atlantic/Reykjavik",  label: "Reykjavik (GMT, no DST)" },
  ]},
  { group: "Africa & Middle East", options: [
    { value: "Africa/Cairo",           label: "Cairo (EET)" },
    { value: "Africa/Casablanca",      label: "Casablanca, Marrakech (WET)" },
    { value: "Africa/Johannesburg",    label: "Cape Town, Johannesburg (SAST)" },
    { value: "Africa/Nairobi",         label: "Nairobi, Zanzibar (EAT)" },
    { value: "Africa/Dar_es_Salaam",   label: "Dar es Salaam (EAT)" },
    { value: "Indian/Maldives",        label: "Maldives (MVT)" },
    { value: "Indian/Mauritius",       label: "Mauritius (MUT)" },
  ]},
  { group: "Americas", options: [
    { value: "America/New_York",    label: "New York, Miami, Toronto (ET)" },
    { value: "America/Chicago",     label: "Chicago, New Orleans (CT)" },
    { value: "America/Denver",      label: "Denver (MT)" },
    { value: "America/Phoenix",     label: "Phoenix (MST, no DST)" },
    { value: "America/Los_Angeles", label: "Los Angeles, Seattle, Vancouver (PT)" },
    { value: "America/Anchorage",   label: "Anchorage (AKT)" },
    { value: "America/Mexico_City", label: "Mexico City (CST/CDT)" },
    { value: "America/Cancun",      label: "Cancun (EST, no DST)" },
    { value: "America/Havana",      label: "Havana (CST/CDT)" },
    { value: "America/Costa_Rica",  label: "San Jose, Costa Rica (CST)" },
    { value: "America/Bogota",      label: "Bogota (COT)" },
    { value: "America/Lima",        label: "Lima (PET)" },
    { value: "America/Sao_Paulo",   label: "Sao Paulo, Rio (BRT/BRST)" },
    { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires (ART)" },
    { value: "America/Santiago",    label: "Santiago (CLT/CLST)" },
  ]},
];

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent";

export default function NewDestinationPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Add Destination</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Destinations are the parent cities or regions that experiences belong to.
        </p>
      </div>

      <form action={createDestination} className="space-y-6">
        <div className="bg-white rounded-xl border border-neutral-200 p-8 space-y-6">

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                City / Region Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                required
                placeholder="e.g. London"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Country Code <span className="text-red-500">*</span>
              </label>
              <input
                name="countryCode"
                required
                placeholder="GB"
                maxLength={2}
                className={`${inputClass} uppercase`}
              />
              <p className="mt-1 text-xs text-neutral-400">2-letter ISO code</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Region / State
              </label>
              <input
                name="region"
                placeholder="e.g. England"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Type
              </label>
              <select name="destinationType" className={inputClass}>
                <option value="city">City</option>
                <option value="region">Region</option>
                <option value="island">Island</option>
                <option value="national_park">National Park</option>
                <option value="neighborhood">Neighborhood</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Currency
              </label>
              <input
                name="currency"
                placeholder="GBP"
                maxLength={10}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Primary Language
              </label>
              <input
                name="language"
                placeholder="English"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Timezone
            </label>
            <select name="timezone" className={inputClass}>
              <option value="">— select timezone —</option>
              {TIMEZONES.map((group) => (
                <optgroup key={group.group} label={group.group}>
                  {group.options.map((tz) => (
                    <option key={tz.value} value={tz.value}>{tz.label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Editorial Overview
            </label>
            <p className="text-xs text-neutral-400 mb-2">
              Optional — a short description of the destination's character. You can fill this in later.
            </p>
            <textarea
              name="editorialOverview"
              rows={4}
              placeholder="e.g. London is a city of neighbourhoods, each with its own distinct personality. From the grand museums of South Kensington to the street food markets of Borough, it rewards the traveller who slows down."
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <a
            href="/curator/destinations"
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            ← Back to destinations
          </a>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-neutral-900 text-sm font-medium text-white hover:bg-neutral-700 transition-colors"
          >
            Save Destination
          </button>
        </div>
      </form>
    </div>
  );
}
