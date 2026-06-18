// Currency conversion rates (base: SAR)
export const CURRENCY_RATES: Record<CurrencyCode, number> = {
  SAR: 1,
  USD: 0.27,    // 1 SAR ≈ 0.27 USD
  EUR: 0.24,    // 1 SAR ≈ 0.24 EUR
  DZD: 36,      // 1 SAR ≈ 36 DZD
};

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  SAR: 'ر.س',
  USD: '$',
  EUR: '€',
  DZD: 'د.ج',
};

export type CurrencyCode = 'SAR' | 'USD' | 'EUR' | 'DZD';
export type CountryCode = 'SA' | 'US' | 'FR' | 'DZ';

const CURRENCY_LOCALES: Record<CurrencyCode, string> = {
  SAR: 'ar-SA',
  USD: 'en-US',
  EUR: 'fr-FR',
  DZD: 'fr-DZ',
};

const CURRENCY_BY_COUNTRY: Record<CountryCode, CurrencyCode> = {
  SA: 'SAR',
  US: 'USD',
  FR: 'EUR',
  DZ: 'DZD',
};

const LOCALE_BY_COUNTRY: Record<CountryCode, string> = {
  SA: 'ar-SA',
  US: 'en-US',
  FR: 'fr-FR',
  DZ: 'fr-DZ',
};

export function convertCurrency(
  amount: number,
  fromCurrency: CurrencyCode = 'SAR',
  toCurrency: CurrencyCode = 'SAR'
): number {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const amountInSAR =
    fromCurrency === 'SAR'
      ? amount
      : amount / CURRENCY_RATES[fromCurrency];

  return amountInSAR * CURRENCY_RATES[toCurrency];
}

export function formatCurrency(
  price: number,
  currency: CurrencyCode,
  locale?: string
): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const formatted = price.toLocaleString(locale || CURRENCY_LOCALES[currency], {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `${formatted} ${symbol}`;
}

export function getCurrencyByCountry(country: string): CurrencyCode {
  const normalized = country.toUpperCase().split('-')[0] as CountryCode;
  return CURRENCY_BY_COUNTRY[normalized] || 'SAR';
}

export function getLocaleByCountry(country: string): string {
  const normalized = country.toUpperCase().split('-')[0] as CountryCode;
  return LOCALE_BY_COUNTRY[normalized] || 'ar-SA';
}
