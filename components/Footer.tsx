'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-[#060B18] border-t border-white/[0.06] text-white pt-16 pb-6">
      <div className="max-w-7xl mx-auto px-6">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12" dir="rtl">

          {/* Brand column */}
          <div>
            <div className="flex items-center gap-1 mb-4">
              <span className="text-2xl font-bold text-white tracking-tight">Byte</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tight">Hub</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-5">
              {t('about.description')}
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              <button className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all">
                <svg className="w-4 h-4 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" stroke="none"/>
                </svg>
              </button>
              <button className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all">
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white mb-5 tracking-wider">{t('quickLinks.title')}</h3>
            <ul className="space-y-3">
              {[
                { href: '/', label: t('quickLinks.home') },
                { href: '/shop', label: t('quickLinks.store') },
                { href: '/shop?category=gaming-pcs', label: t('quickLinks.gamingPcs') },
                { href: '/shop?category=laptops', label: t('quickLinks.laptops') },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-white/40 hover:text-white text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-bold text-white mb-5 tracking-wider">{t('categories.title')}</h3>
            <ul className="space-y-3">
              {[
                t('categories.screens'),
                t('categories.accessories'),
                t('categories.pcParts'),
                t('categories.components'),
              ].map((label) => (
                <li key={label}>
                  <span className="text-white/40 text-sm">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-white mb-5 tracking-wider">{t('contact.title')}</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-white/40 text-sm">
                <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.06] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                {t('contact.phone')}
              </li>
              <li className="flex items-center gap-3 text-white/40 text-sm">
                <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.06] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-cyan-400/80 hover:text-cyan-400 transition-colors cursor-pointer">
                  {t('contact.email')}
                </span>
              </li>
              <li className="flex items-start gap-3 text-white/40 text-sm">
                <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                {t('contact.address')}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] pt-6 flex flex-col md:flex-row justify-between items-center gap-4" dir="rtl">
          <p className="text-white/30 text-sm">{t('copyright')}</p>

          <div className="flex items-center gap-4 text-white/30 text-xs">
            <Link href="/privacy" className="hover:text-white/60 transition-colors">{t('privacyPolicy')}</Link>
            <Link href="/terms" className="hover:text-white/60 transition-colors">{t('termsConditions')}</Link>
            <Link href="/support" className="hover:text-white/60 transition-colors">{t('techSupport')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
