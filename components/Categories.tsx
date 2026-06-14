'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

const categories = [
  { key: 'gamingPcs', slug: 'gaming-pcs', gradient: 'from-blue-500 to-cyan-400', count: '1' },
  { key: 'laptops', slug: 'laptops', gradient: 'from-purple-500 to-pink-500', count: '2' },
  { key: 'monitors', slug: 'monitors', gradient: 'from-emerald-500 to-teal-400', count: '3' },
  { key: 'accessories', slug: 'accessories', gradient: 'from-orange-500 to-red-500', count: '4' },
];

export default function Categories() {
  const t = useTranslations('categories');

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{t('title')}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(({ key, slug, gradient, count }) => (
            <Link
              key={key}
              href={`/shop?category=${slug}`}
              className={`relative group rounded-2xl p-6 bg-gradient-to-br ${gradient} text-white overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1`}
            >
              <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-sm font-bold backdrop-blur-sm">
                {count}
              </div>

              <div className="mt-12">
                <h3 className="text-xl font-bold mb-2">{t(key)}</h3>
                <span className="inline-flex items-center gap-1 text-sm opacity-90 group-hover:opacity-100">
                  {t('shopNow')}
                  <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
