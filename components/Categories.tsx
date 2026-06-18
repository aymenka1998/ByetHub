'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';

const categories = [
  { key: 'gamingPcs',    slug: 'gaming-pcs',   count: '01', image: '/images/gaming-pc.png' },
  { key: 'laptops',      slug: 'laptops',       count: '02', image: '/images/laptop.png' },
  { key: 'monitors',     slug: 'monitors',      count: '03', image: '/images/monitor.png' },
  { key: 'accessories',  slug: 'accessories',   count: '04', image: '/images/keyboard.png' },
];

export default function Categories() {
  const t = useTranslations('categories');

  return (
    <section className="py-20 bg-[#060B18]">
      <div className="max-w-7xl mx-auto px-4">

        {/* Section heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">{t('title')}</h2>
          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map(({ key, slug, count, image }) => (
            <Link
              key={key}
              href={`/shop?category=${slug}`}
              className="group relative rounded-2xl overflow-hidden bg-[#0D1526] border border-white/[0.07] hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(34,211,238,0.12)]"
            >
              {/* Category image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[#111827]">
                <Image
                  src={image}
                  alt={t(key)}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1526]/90 via-transparent to-transparent" />

                {/* Number badge */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-xs font-bold text-cyan-400">{count}</span>
                </div>
              </div>

              {/* Label */}
              <div className="p-4 text-center">
                <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {t(key)}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
