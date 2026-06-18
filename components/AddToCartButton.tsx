'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useTranslations } from 'next-intl';
import { useCountry } from '@/context/CountryContext';
import { convertCurrency, formatCurrency, getCurrencyByCountry, getLocaleByCountry, type CurrencyCode } from '@/lib/currency';

import type { Product, StrapiDataItem } from '@/lib/types';

interface AddToCartButtonProps {
  product: StrapiDataItem<Product> | unknown;
  className?: string;
}

export default function AddToCartButton({ product, className = '' }: AddToCartButtonProps) {
  const t = useTranslations('products');
  const { country } = useCountry();
  const [quantity, setQuantity] = useState(1);
  const currency = getCurrencyByCountry(country) as CurrencyCode;
  const currencyLocale = getLocaleByCountry(country);
  const { addItem } = useCart();

  // استبدال any بـ Record<string, unknown>
  const castedProduct = product as Record<string, unknown>;
  const data = (castedProduct?.attributes ? castedProduct.attributes : castedProduct) as Record<string, unknown>;
  const productId = (castedProduct?.id as number) ?? 0;

  const name = (data?.name as string) ?? '';
  const price = (data?.price as number) ?? 0;
  const images = (data?.images as Record<string, unknown>[]) ?? [];
  const handleAddToCart = () => {
  const cartPayload = {
    id: productId,
    quantity,
    attributes: {
      name,
      price,
      images,
    }
  };
  
  // الحل الذكي: التحويل إلى unknown ثم عمل كاستينغ إلى نوع المعامل الأول للدالة تلقائياً
  // دون كتابة any ودون استيراد أنواع خارجية قد تسبب مشاكل
  addItem((cartPayload as unknown) as Parameters<typeof addItem>[0]);
};
    
    

  return (
    <div className={`space-y-4 ${className}`.trim()}>
      <div className="flex items-center gap-4">
        <label className="font-semibold text-gray-700">الكمية:</label>
        <div className="flex items-center border border-gray-300 rounded-xl bg-gray-50 overflow-hidden shadow-sm">
          <button 
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-2 hover:bg-gray-200 transition-colors font-bold text-gray-600 focus:outline-none"
          >
            -
          </button>
          <span className="px-5 py-2 font-bold text-gray-800 bg-white border-x border-gray-300 text-center min-w-12">
            {quantity}
          </span>
          <button 
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="px-4 py-2 hover:bg-gray-200 transition-colors font-bold text-gray-600 focus:outline-none"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        className="w-full bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 transition-all font-bold text-lg flex items-center justify-center gap-3 shadow-md hover:shadow-lg active:scale-[0.98]"
      >
        <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {t('addToCart')} - {formatCurrency(convertCurrency(price * quantity, 'SAR', currency), currency, currencyLocale)}
      </button>
    </div>
  );
}