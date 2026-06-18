'use client';

import { useTranslations } from 'next-intl';

const featureIcons = {
  techSupport: (
    <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  originalParts: (
    <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warranty: (
    <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  shipping: (
    <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
};

export default function Features() {
  const t = useTranslations('features');

  const features = [
    { key: 'techSupport',  icon: featureIcons.techSupport },
    { key: 'originalParts', icon: featureIcons.originalParts },
    { key: 'warranty',     icon: featureIcons.warranty },
    { key: 'shipping',     icon: featureIcons.shipping },
  ] as const;

  return (
    <section className="py-16 bg-[#080D1A] border-y border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ key, icon }) => (
            <div
              key={key}
              className="group flex items-center gap-4 p-5 rounded-2xl bg-[#0D1526] border border-white/[0.06] hover:border-cyan-500/20 transition-all duration-300 hover:bg-[#0D1A30]"
              dir="rtl"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 group-hover:bg-cyan-500/20 transition-colors">
                {icon}
              </div>
              <div>
                <h3 className="font-bold text-white text-sm mb-0.5">{t(`${key}.title`)}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{t(`${key}.description`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
