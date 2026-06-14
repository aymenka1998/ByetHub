'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { type Product, getDiscount } from '@/lib/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: unknown; 
}

// Centralise the public Strapi base URL — defined once, used everywhere
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? '';

function resolveImageUrl(url: string): string {
  if (!url) return '/placeholder.jpg';
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}

export default function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations('products');
  const locale = useLocale();
  const { addItem } = useCart();
  const currency = locale === 'fr' ? 'DZD' : (locale === 'ar' ? t('sar') : 'SAR');

  // تحويل مبدئي آمن للتعامل مع الخصائص المجهولة دون استخدام any
  const castedProduct = product as Record<string, unknown>;

  // الاستخراج الذكي: يدعم Strapi v5 مباشرة، ويعود لـ attributes كـ fallback إذا كانت v4
  const rawData = castedProduct?.attributes ? castedProduct.attributes : castedProduct;

  // الحل النظيف: دمج الأنماط باستخدام Record<string, unknown> بدلاً من any لإسكات الـ Linter تماماً
  const data = rawData as Product & Record<string, unknown>;

  // إذا لم تكن هناك بيانات، تجنب انهيار المكون
  if (!data) return null;

  const name = (data.name as string) ?? '';
  const slug = (data.slug as string) ?? '';
  const price = (data.price as number) ?? 0;
  const originalPrice = data.originalPrice as number | undefined;
  
  const discount = getDiscount(price, originalPrice);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const cartPayload = {
      id: castedProduct.id as number,
      quantity: 1,
      attributes: {
        name,
        price,
        images: data.images
      }
    };
    addItem(cartPayload as Parameters<typeof addItem>[0]);
  };

  /**
   * جلب الصورة الذكي المتوافق مع Strapi v5:
   * في v5، مصفوفة الصور تعود مباشرة كـ `images` دون الحاجة لـ `data` أو `attributes`.
   */
  const rawImages = data.images as Record<string, unknown>[] | undefined;
  const rawImageSingle = data.image as Record<string, unknown> | undefined;
  const rawImagesV4 = (data.images as Record<string, unknown> | undefined)?.data as Record<string, unknown>[] | undefined;
  const rawImageV4Single = (data.image as Record<string, unknown> | undefined)?.data as Record<string, unknown> | undefined;

  const firstImage =
    rawImages?.[0] || 
    rawImageSingle || 
    rawImagesV4?.[0]?.attributes || 
    rawImageV4Single?.attributes;

  const firstImageCasted = firstImage as Record<string, unknown> | undefined;
  const imageUrl = resolveImageUrl((firstImageCasted?.url as string) ?? '');
  const imageAlt = (firstImageCasted?.alternativeText as string) || name;

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      <Link href={`/product/${slug}`} className="block relative aspect-square overflow-hidden">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {discount && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            -{discount}%
          </span>
        )}
      </Link>

      <div className="p-4 pt-1 text-right" dir="rtl">
        <Link href={`/product/${slug}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 transition-colors line-clamp-2">
            {name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-3 justify-start">
          <span className="text-xl font-bold text-blue-600">
            {price.toLocaleString()} {currency}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-sm text-gray-400 line-through">
              {originalPrice.toLocaleString()} {currency}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
          aria-label={`${t('addToCart')}: ${name}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {t('addToCart')}
        </button>
      </div>
    </div>
  );
}