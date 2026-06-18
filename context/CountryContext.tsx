'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { type CountryCode } from '@/lib/currency';

const DEFAULT_COUNTRY: CountryCode = 'SA';

interface CountryContextValue {
  country: CountryCode;
  setCountry: (country: CountryCode) => void;
}

const CountryContext = createContext<CountryContextValue | undefined>(undefined);

export function CountryProvider({ children }: { children: ReactNode }) {
  const [country, setCountryState] = useState<CountryCode>(DEFAULT_COUNTRY);

  useEffect(() => {
    const stored = window.localStorage.getItem('selectedCountry') as CountryCode | null;
    if (stored && ['SA', 'US', 'FR', 'DZ'].includes(stored)) {
      setCountryState(stored);
    }
  }, []);

  const setCountry = (value: CountryCode) => {
    setCountryState(value);
    window.localStorage.setItem('selectedCountry', value);
  };

  return (
    <CountryContext.Provider value={{ country, setCountry }}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error('useCountry must be used within CountryProvider');
  }
  return context;
}
