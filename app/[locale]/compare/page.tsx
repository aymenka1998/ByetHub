'use client';

import React from 'react';
import { useCompare } from '@/context/CompareContext';
import { useCountry } from '@/context/CountryContext';
import { convertCurrency, formatCurrency, getCurrencyByCountry, getLocaleByCountry, type CurrencyCode } from '@/lib/currency';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ArrowRight } from 'lucide-react';
import { useParams } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? '';

export default function ComparePage() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const { country } = useCountry();
  const currency = getCurrencyByCountry(country) as CurrencyCode;
  const currencyLocale = getLocaleByCountry(country);
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  const isRtl = locale === 'ar';

  if (compareItems.length === 0) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-[#060b18]" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="text-gray-400 mb-6 bg-[#0a1120] p-8 rounded-2xl border border-cyan-900/30 text-center shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-4">قائمة المقارنة فارغة</h2>
          <p className="text-gray-400 mb-8 max-w-sm mx-auto">
            لم تقم بإضافة أي منتجات للمقارنة بعد. يمكنك تصفح المنتجات وإضافتها لجدول المقارنة من صفحة تفاصيل المنتج.
          </p>
          <Link href="/shop" className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-xl transition-colors">
            تصفح المنتجات
          </Link>
        </div>
      </main>
    );
  }

  // Extract all unique feature keys from both products
  const allFeatureKeys = Array.from(
    new Set(
      compareItems.flatMap((item) =>
        Object.keys(item.attributes?.features || {})
      )
    )
  );

  return (
    <main className="min-h-screen bg-[#060b18] py-12 px-4" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <h1 className="text-3xl font-bold text-white">مقارنة المنتجات</h1>
          <button 
            onClick={clearCompare}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-semibold bg-red-400/10 hover:bg-red-400/20 px-4 py-2 rounded-lg"
          >
            مسح الكل
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-[#0a1120] border border-cyan-900/30 rounded-2xl overflow-x-auto shadow-2xl">
          <table className="w-full text-right min-w-[700px]">
            <thead>
              <tr>
                <th className="w-1/4 p-6 bg-[#060b18] border-b border-gray-800 border-l border-gray-800">
                  <div className="text-gray-500 font-medium">المواصفات</div>
                </th>
                {compareItems.map((item) => {
                  const data = item.attributes;
                  const rawImg = data.image?.data?.attributes?.url || data.images?.data?.[0]?.attributes?.url;
                  const imageUrl = rawImg ? (rawImg.startsWith('http') ? rawImg : `${STRAPI_URL}${rawImg}`) : '/placeholder.jpg';
                  
                  return (
                    <th key={item.id} className="w-[37.5%] p-6 border-b border-gray-800 border-l border-gray-800 last:border-l-0 bg-[#060b18]/50 relative group">
                      <button 
                        onClick={() => removeFromCompare(item.id)}
                        className="absolute top-4 left-4 text-gray-500 hover:text-red-400 bg-black/50 p-1.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      <div className="flex flex-col items-center text-center">
                        <Link href={`/product/${data.slug}`} className="block relative w-40 h-40 mb-4 bg-white/[0.02] rounded-xl overflow-hidden hover:scale-105 transition-transform">
                          <Image src={imageUrl} alt={data.name} fill className="object-contain p-4" />
                        </Link>
                        
                        <Link href={`/product/${data.slug}`} className="text-lg font-bold text-white hover:text-cyan-400 transition-colors line-clamp-2 h-14">
                          {data.name}
                        </Link>
                        
                        <div className="text-2xl font-black text-cyan-400 mt-2 mb-4">
                           {formatCurrency(convertCurrency(data.price, 'DZD', currency), currency, currencyLocale)}
                        </div>
                        
                        <div className="w-full px-4">
                          <AddToCartButton product={item} />
                        </div>
                      </div>
                    </th>
                  );
                })}
                {/* Fill empty column if only 1 item */}
                {compareItems.length === 1 && (
                  <th className="w-[37.5%] p-6 border-b border-gray-800 bg-[#060b18]/30">
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 border-2 border-dashed border-gray-800 rounded-xl p-8">
                      <div className="text-4xl mb-4 font-light">+</div>
                      <p>أضف منتجاً آخر من نفس الفئة للمقارنة</p>
                      <Link href={`/shop?category=${compareItems[0].attributes.category?.data?.attributes?.slug}`} className="mt-4 text-cyan-500 hover:underline">
                        تصفح الفئة
                      </Link>
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {allFeatureKeys.map((key, index) => (
                <tr key={key} className={index % 2 === 0 ? 'bg-white/[0.01]' : 'bg-transparent'}>
                  <td className="p-4 px-6 border-b border-gray-800 border-l border-gray-800 text-gray-400 font-medium capitalize">
                    {key.replace(/_/g, ' ')}
                  </td>
                  {compareItems.map((item) => {
                    const featureValue = item.attributes.features?.[key];
                    return (
                      <td key={`${item.id}-${key}`} className="p-4 px-6 border-b border-gray-800 border-l border-gray-800 last:border-l-0 text-white">
                        {featureValue !== undefined && featureValue !== null ? (
                          typeof featureValue === 'boolean' ? (
                            featureValue ? <span className="text-green-400">✓ نعم</span> : <span className="text-red-400">✗ لا</span>
                          ) : (
                            <span>{String(featureValue)}</span>
                          )
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </td>
                    );
                  })}
                  {compareItems.length === 1 && (
                    <td className="p-4 px-6 border-b border-gray-800"></td>
                  )}
                </tr>
              ))}
              
              {/* Show warning if no features are found at all */}
              {allFeatureKeys.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">
                    لا توجد مواصفات تقنية دقيقة متوفرة لهذين المنتجين للمقارنة بينهما.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
