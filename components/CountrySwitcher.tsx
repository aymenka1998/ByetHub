'use client';

import { useCountry } from '@/context/CountryContext';

const countries = [
  { code: 'SA', label: 'السعودية' },
  { code: 'US', label: 'United States' },
  { code: 'FR', label: 'France' },
  { code: 'DZ', label: 'Algeria' },
];

export default function CountrySwitcher() {
  const { country, setCountry } = useCountry();

  return (
    <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
      <span className="sr-only">Select country</span>
      <select
        value={country}
        onChange={(event) => setCountry(event.target.value as typeof country)}
        className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {countries.map((item) => (
          <option key={item.code} value={item.code}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}
