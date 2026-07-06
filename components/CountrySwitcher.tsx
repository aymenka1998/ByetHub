'use client';

import { useCountry } from '@/context/CountryContext';

export default function CountrySwitcher() {
  const { country } = useCountry();

  return (
    <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-white/50 bg-white/[0.05] border border-white/[0.08] rounded-lg px-2.5 py-1.5 select-none">
      <span className="text-base leading-none">🇩🇿</span>
      <span>{country === 'DZ' ? 'الجزائر · د.ج' : 'الجزائر · د.ج'}</span>
    </div>
  );
}
