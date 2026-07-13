'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { type Product, getDiscount } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useCountry } from '@/context/CountryContext';
import { convertCurrency, formatCurrency, getCurrencyByCountry, getLocaleByCountry, CURRENCY_SYMBOLS, type CurrencyCode } from '@/lib/currency';

interface ProductCardProps {
  product: unknown; 
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? '';

function resolveImageUrl(url: string): string {
  if (!url) return '/placeholder.jpg';
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}

const BADGE_LABELS: Record<number, { text: string; color: string }> = {
  0: { text: 'Bestseller', color: 'bg-[#1A1A2E] text-white border-white/20' },
  1: { text: 'New Arrival', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
};

export default function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations('products');
  const { country } = useCountry();
  const { addItem } = useCart();
  const currency = getCurrencyByCountry(country) as CurrencyCode;
  const currencyLocale = getLocaleByCountry(country);

  const castedProduct = product as Record<string, unknown>;
  const rawData = castedProduct?.attributes ? castedProduct.attributes : castedProduct;
  const data = rawData as Product & Record<string, unknown>;

  if (!data) return null;

  const name = (data.name as string) ?? '';
  const slug = (data.slug as string) ?? '';
  const price = (data.price as number) ?? 0;
  const originalPrice = data.originalPrice as number | undefined;

  // category in Strapi is a relation object — extract its name safely
  const rawCategory = data.category as Record<string, unknown> | string | undefined;
  const category =
    typeof rawCategory === 'string'
      ? rawCategory
      : typeof rawCategory === 'object' && rawCategory !== null
        ? ((rawCategory.name ?? rawCategory.title ?? '') as string)
        : '';

  const discount = getDiscount(price, originalPrice);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const cartPayload = {
      id: castedProduct.id as number,
      quantity: 1,
      attributes: { name, price, images: data.images }
    };
    addItem(cartPayload as Parameters<typeof addItem>[0]);
  };

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

  // Pick a badge pseudo-randomly from the index (demo only)
  const idx = typeof castedProduct.id === 'number' ? castedProduct.id % 3 : 0;
  const badge = BADGE_LABELS[idx];

  return (
    <div className="group relative bg-[#0D1526] rounded-2xl border border-white/[0.07] hover:border-blue-500/30 overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.12)] hover:-translate-y-1">

      {/* Image area */}
      <Link href={`/product/${slug}`} className="block relative aspect-[4/3] overflow-hidden bg-[#111827]">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          loading="lazy"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1526]/60 to-transparent" />

        {/* Badge top-left */}
        {badge && (
          <span className={`absolute top-3 left-3 border text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm ${badge.color}`}>
            {badge.text}
          </span>
        )}

        {/* Discount badge */}
        {discount && (
          <span className="absolute top-3 right-3 bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
            -{discount}%
          </span>
        )}
      </Link>

      {/* Info area */}
      <div className="p-5" dir="rtl">
        {/* Category label */}
        {category && (
          <p className="text-xs font-bold text-cyan-400/80 tracking-widest uppercase mb-1">{category}</p>
        )}

        <Link href={`/product/${slug}`}>
          <h3 className="font-bold text-base text-white/90 mb-3 group-hover:text-white transition-colors line-clamp-2 tracking-wide" title={name}>
            {name}
          </h3>
        </Link>

        {/* Price row */}
        <div className="flex items-center gap-3 mb-4 justify-start">
          <span className="text-lg font-bold text-white">
            {formatCurrency(convertCurrency(price, 'DZD', currency), currency, currencyLocale)}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-sm text-white/30 line-through">
              {formatCurrency(convertCurrency(originalPrice, 'DZD', currency), currency, currencyLocale)}
            </span>
          )}
        </div>

        {/* Add to cart button */}
        <button
          onClick={handleAddToCart}
          className="w-10 h-10 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center justify-center transition-all hover:shadow-[0_0_16px_rgba(59,130,246,0.5)] ml-auto"
          aria-label={`${t('addToCart')}: ${name}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}