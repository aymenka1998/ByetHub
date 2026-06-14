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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <Link
            href="/shop"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {t('viewAll')}
          </Link>
          <h2 className="text-3xl font-bold">{t('featuredTitle')}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}