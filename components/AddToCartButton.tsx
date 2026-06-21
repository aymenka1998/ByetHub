'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useTranslations } from 'next-intl';
import { useCountry } from '@/context/CountryContext';
import { convertCurrency, formatCurrency, getCurrencyByCountry, getLocaleByCountry, type CurrencyCode } from '@/lib/currency';
import { ShoppingCart } from 'lucide-react';

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
    addItem((cartPayload as unknown) as Parameters<typeof addItem>[0]);
  };

  return (
    <div className={`space-y-6 w-full ${className}`.trim()} dir="rtl">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-gray-300">الكمية:</label>
        <div className="flex items-center border border-cyan-900/50 rounded bg-[#060b18] overflow-hidden shadow-sm">
          <button 
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="px-5 py-2 hover:bg-cyan-900/30 transition-colors font-bold text-cyan-500 focus:outline-none"
          >
            +
          </button>
          <span className="px-5 py-2 font-bold text-white font-mono border-x border-cyan-900/50 text-center min-w-12">
            {quantity}
          </span>
          <button 
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-5 py-2 hover:bg-cyan-900/30 transition-colors font-bold text-cyan-500 focus:outline-none"
          >
            -
          </button>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        className="w-full bg-[#4F84F6] text-white py-4 rounded hover:bg-[#3f6edb] transition-all font-bold text-lg flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(79,132,246,0.3)] active:scale-[0.98]"
      >
        <span>{t('addToCart')} - {formatCurrency(convertCurrency(price * quantity, 'SAR', currency), currency, currencyLocale)}</span>
        <ShoppingCart className="w-6 h-6" />
      </button>
    </div>
  );
}