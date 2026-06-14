'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-right order-2 lg:order-1">
            <span className="inline-block px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium mb-6 border border-blue-500/30">
              {t('badge')}
            </span>

            <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
              <span className="text-white">{t('title').split(' ').slice(0, 4).join(' ')}</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                {t('title').split(' ').slice(4).join(' ')}
              </span>
            </h1>

            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {t('description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/shop"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-blue-600/30 text-center"
              >
                {t('shopNow')}
              </Link>
              <Link
                href="/shop?category=gaming-pcs"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-lg transition-all border border-white/20 text-center backdrop-blur-sm"
              >
                {t('gamingPcs')}
              </Link>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl" />
              <Image
                src="/images/gaming-pc.png"
                alt="Gaming PC"
                fill
                className="object-contain relative z-10"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 z-20">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                {t('availableNow')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}