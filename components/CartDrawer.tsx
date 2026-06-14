'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, total } = useCart();
  const t = useTranslations('products');
  const locale = useLocale();
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? '';

  function resolveImageUrl(url: string | undefined): string {
    if (!url || url === '/placeholder.jpg') return '/placeholder.jpg';
    return url.startsWith('http') || url.startsWith('/') ? url : `${STRAPI_URL}${url}`;
  }

  // استخدام منطق مرن لتجنب خطأ Missing Message في حال عدم وجود المفاتيح في fr.json أو en.json
  const currency = locale === 'fr' ? 'DZD' : (locale === 'ar' ? t('sar') : 'SAR');

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={onClose} />
      )}
      
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 text-right ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`} dir="rtl">
        <div className="p-6 h-full flex flex-col">
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">سلة التسوق</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-black">
              ✕
            </button>
          </div>

          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-4">
              <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="text-lg">السلة فارغة حالياً</span>
              <button onClick={onClose} className="mt-2 text-blue-600 font-semibold hover:underline">
                ابدأ التسوق الآن
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-auto space-y-4 pl-1">
                {items.map((item: unknown) => {
                  // تحويل العنصر إلى كائن غير معلوم البنية بدقة بدلاً من any لإرضاء ESLint
                  const castedItem = item as Record<string, unknown>;
                  
                  const itemData = (castedItem?.attributes ? castedItem.attributes : castedItem) as Record<string, unknown>;
                  const name = (itemData?.name as string) ?? 'منتج غير معروف';
                  const price = (itemData?.price as number) ?? 0;
                  const itemQuantity = (castedItem?.quantity as number) ?? 1;
                  const itemId = castedItem?.id as string | number;
                  
                  // معالجة قراءة الصور بشكل آمن ديناميكياً
                  const rawImages = itemData?.images as Record<string, unknown>[] | undefined;
                  const rawImg = (itemData?.image as Record<string, unknown>)?.url || rawImages?.[0]?.url || itemData?.image;
                  const imageUrl = resolveImageUrl(typeof rawImg === 'string' ? rawImg : undefined);

                  return (
                    <div key={itemId} className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100/75 transition-colors border border-gray-100">
                      
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-white border border-gray-200">
                        <Image
                          src={imageUrl}
                          alt={name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      
                      <div className="flex flex-col justify-between flex-1">
                        <div>
                          <h3 className="font-medium text-gray-900 line-clamp-1 hover:text-blue-600 transition-colors">
                            {name}
                          </h3>
                          <p className="text-blue-600 font-bold mt-1">
                            {price.toLocaleString()} {currency} × {itemQuantity}
                          </p>
                        </div>
                        
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-400">
                            الإجمالي: {(price * itemQuantity).toLocaleString()} {currency}
                          </span>
                          <button 
                           
                             onClick={() => removeItem(itemId as number)} // أو itemId as string بناءً على معرّفات الـ Context لديك
                            className="text-red-500 text-xs font-semibold hover:text-red-700 transition-colors"
                            >
                             حذف
                           </button>
                        
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex justify-between text-xl font-bold mb-4 text-gray-900">
                  <span>المجموع:</span>
                  <span className="text-blue-600">{total.toLocaleString()} {currency}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="block w-full bg-blue-600 text-white text-center py-3 rounded-xl hover:bg-blue-700 font-bold text-lg shadow-md hover:shadow-lg transition-colors"
                >
                  إتمام الشراء
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}