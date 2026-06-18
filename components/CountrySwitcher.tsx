'use client';

import { useCountry } from '@/context/CountryContext';

export default function CountrySwitcher() {
  const { country } = useCountry();

  return (
    <div className="text-sm font-medium text-gray-700">
      {country === 'DZ' ? 'الدينار الجزائري' : 'الدينار الجزائري'}
    </div>
  );
}
