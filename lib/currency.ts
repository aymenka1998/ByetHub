// العملة الأساسية للموقع: الدينار الجزائري (DZD)
// جميع أسعار المنتجات مسجّلة بالدينار الجزائري مباشرة

export type CurrencyCode = 'SAR' | 'USD' | 'EUR' | 'DZD';
export type CountryCode = 'SA' | 'US' | 'FR' | 'DZ';

// معدلات التحويل (الأساس: DZD)
export const CURRENCY_RATES: Record<CurrencyCode, number> = {
  DZD: 1,
  SAR: 0.0278,   // 1 DZD ≈ 0.028 SAR
  USD: 0.0074,   // 1 DZD ≈ 0.0074 USD
  EUR: 0.0068,   // 1 DZD ≈ 0.0068 EUR
};

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  DZD: 'د.ج',
  SAR: 'ر.س',
  USD: '$',
  EUR: '€',
};

const CURRENCY_LOCALES: Record<CurrencyCode, string> = {
  DZD: 'fr-DZ',
  SAR: 'ar-SA',
  USD: 'en-US',
  EUR: 'fr-FR',
};

export function convertCurrency(
  amount: number,
  fromCurrency: CurrencyCode = 'DZD',
  toCurrency: CurrencyCode = 'DZD'
): number {
  if (fromCurrency === toCurrency) {
    return amount;
  }
  // تحويل إلى DZD أولاً، ثم إلى العملة المطلوبة
  const amountInDZD =
    fromCurrency === 'DZD'
      ? amount
      : amount / CURRENCY_RATES[fromCurrency];

  return amountInDZD * CURRENCY_RATES[toCurrency];
}

export function formatCurrency(
  price: number,
  currency: CurrencyCode,
  locale?: string
): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const formatted = price.toLocaleString(locale || CURRENCY_LOCALES[currency], {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `${formatted} ${symbol}`;
}

// الموقع يستهدف الجزائر حصراً — العملة دائماً DZD
export function getCurrencyByCountry(_country: string): CurrencyCode {
  return 'DZD';
}

export function getLocaleByCountry(_country: string): string {
  return 'fr-DZ';
}
