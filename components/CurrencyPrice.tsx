'use client';

import { useCountry } from '@/context/CountryContext';
import { convertCurrency, formatCurrency, getCurrencyByCountry, getLocaleByCountry, type CurrencyCode } from '@/lib/currency';

interface CurrencyPriceProps {
  amount: number | undefined;
}

import { useTranslations } from 'next-intl';

export default function CurrencyPrice({ amount = 0 }: CurrencyPriceProps) {
  const { country } = useCountry();
  const t = useTranslations('products');
  const currency = getCurrencyByCountry(country) as CurrencyCode;
  const currencyLocale = getLocaleByCountry(country);
  const converted = convertCurrency(amount, 'DZD', currency);
  return <>{formatCurrency(converted, currency, currencyLocale).replace('د.ج', t('dzd'))}</>;
}
