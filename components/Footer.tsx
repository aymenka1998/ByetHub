'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4">{t('about.title')}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('about.description')}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">{t('quickLinks.title')}</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('quickLinks.home')}
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('quickLinks.store')}
                </Link>
              </li>
              <li>
                <Link href="/shop?category=gaming-pcs" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('quickLinks.gamingPcs')}
                </Link>
              </li>
              <li>
                <Link href="/shop?category=laptops" className="text-gray-400 hover:text-white transition-colors text-sm">
                  {t('quickLinks.laptops')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">{t('categories.title')}</h3>
            <ul className="space-y-3">
              <li><span className="text-gray-400 text-sm">{t('categories.screens')}</span></li>
              <li><span className="text-gray-400 text-sm">{t('categories.accessories')}</span></li>
              <li><span className="text-gray-400 text-sm">{t('categories.pcParts')}</span></li>
              <li><span className="text-gray-400 text-sm">{t('categories.components')}</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">{t('contact.title')}</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {t('contact.phone')}
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {t('contact.email')}
              </li>
              <li className="flex items-start gap-2 text-gray-400 text-sm">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t('contact.address')}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-gray-800 px-3 py-1 rounded text-xs font-medium">Apple Pay</span>
            <span className="bg-gray-800 px-3 py-1 rounded text-xs font-medium">MasterCard</span>
            <span className="bg-gray-800 px-3 py-1 rounded text-xs font-medium">VISA</span>
            <span className="bg-gray-800 px-3 py-1 rounded text-xs font-medium">مدى</span>
          </div>

          <p className="text-gray-500 text-sm text-center">
            {t('payment')}
          </p>

          <p className="text-gray-500 text-sm">
            {t('copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
