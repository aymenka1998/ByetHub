'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { type CountryCode } from '@/lib/currency';

const DEFAULT_COUNTRY: CountryCode = 'DZ';

interface CountryContextValue {
  country: CountryCode;
}

const CountryContext = createContext<CountryContextValue | undefined>(undefined);

export function CountryProvider({ children }: { children: ReactNode }) {
  const country: CountryCode = DEFAULT_COUNTRY;

  return (
    <CountryContext.Provider value={{ country }}>
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
