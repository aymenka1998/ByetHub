'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import ProductCard from './ProductCard';
import { type StrapiDataItem, type Product } from '@/lib/types';

interface FeaturedProductsProps {
  products: StrapiDataItem<Product>[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const t = useTranslations('products');

  return (
    <section className="py-20 bg-[#080D1A]">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-end justify-between mb-12 rtl:flex-row-reverse">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{t('featuredTitle')}</h2>
            <p className="text-white/40 text-sm">{t('featuredSubtitle')}</p>
          </div>
          <Link
            href="/shop"
            className="flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-cyan-400 transition-colors group"
          >
            {t('viewAll')}
            <svg
              className="w-4 h-4 rtl:rotate-180 group-hover:-translate-x-0.5 transition-transform"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}