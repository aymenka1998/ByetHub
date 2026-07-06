'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <>
      {/* Promo Banner */}
      <div className="bg-linear-to-r from-blue-600 to-violet-700 text-center py-2.5 px-4 text-sm font-medium text-white/90">
        🎮 {t('promoBanner')}
        <Link href="/shop" className="ml-2 text-white text-xs underline underline-offset-2">
          {t('promoLink')} →
        </Link>
      </div>

      <section className="relative bg-[#060B18] overflow-hidden">

        {/* ambient glow */}
        <div className="absolute top-0 right-0 w-150 h-150 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* ── Left: copy ── */}
            <div className="order-2 lg:order-1 text-center lg:text-left">

              {/* Animated badge */}
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/25 text-blue-400 px-4 py-2 rounded-full text-xs font-semibold tracking-widest mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#22D3EE]" />
                {t('badge')}
              </div>

              {/* Title — Space Grotesk */}
              <h1
                className={`${spaceGrotesk.className} text-4xl lg:text-[3.4rem] font-bold leading-[1.08] tracking-tight text-[#F1F5FF] mb-3`}
              >
                {t('titleLine1')}
                <br />
                {t('titleLine2')}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400">
                  {t('titleLine3')}
                </span>
              </h1>

              <p className="text-[#8899BB] text-base leading-relaxed mb-8 max-w-md">
                {t('description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition-all hover:-translate-y-px"
                >
                  {t('shopNow')}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </Link>
                <Link
                  href="/shop?category=gaming-pcs"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/5 hover:bg-white/10 text-[#F1F5FF] rounded-xl font-semibold text-sm border border-white/10 hover:border-blue-500/40 transition-all"
                >
                  {t('gamingPcs')}
                </Link>
              </div>

              {/* Stats bar */}
              <div className="flex gap-8 mt-8 pt-7 border-t border-white/[0.07]">
                {[
                  { value: '2 000+', label: t('statProducts') },
                  { value: '50k+',   label: t('statClients') },
                  { value: '98%',    label: t('statSatisfaction') },
                ].map((s) => (
                  <div key={s.label}>
                    <p className={`${spaceGrotesk.className} text-xl font-bold text-[#F1F5FF]`}>{s.value}</p>
                    <p className="text-[10px] font-semibold tracking-widest text-[#4A5568] uppercase mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: PC visual + floating spec chips ── */}
            <div className="relative order-1 lg:order-2 flex items-center justify-center">

              {/* gradient frame */}
              <div className="relative w-full max-w-115 aspect-square mx-auto">
                <div className="absolute inset-0 rounded-4xl bg-linear-to-br from-blue-600/40 via-violet-600/40 to-transparent p-px">
                  <div className="relative w-full h-full rounded-[calc(2rem-1px)] bg-[#111827] overflow-hidden">
                    <Image
                      src="/images/gaming-pc.png"
                      alt="Gaming PC"
                      fill
                      loading="eager"
                      className="object-contain p-4 z-10"
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </div>

                {/* Spec chips */}
                <SpecChip className="top-[8%] right-[-16%]" color="blue" label="Intel Core i9-14900K" />
                <SpecChip className="bottom-[22%] right-[-20%]" color="violet" label="32 Go DDR5" />
                <SpecChip className="bottom-[6%] left-[-10%]" color="cyan"   label="2 To NVMe SSD" />

                {/* Available-now badge */}
                <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  {t('availableNow')}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

/* ── Spec chip helper ── */
function SpecChip({
  label,
  color,
  className,
}: {
  label: string;
  color: 'blue' | 'violet' | 'cyan';
  className?: string;
}) {
  const dot: Record<string, string> = {
    blue:   'bg-blue-400   shadow-[0_0_6px_#60A5FA]',
    violet: 'bg-violet-400 shadow-[0_0_6px_#A78BFA]',
    cyan:   'bg-cyan-400   shadow-[0_0_6px_#22D3EE]',
  };
  return (
    <div
      className={`absolute hidden lg:flex items-center gap-2 bg-[#0D1526]/95 backdrop-blur-sm border border-blue-500/30 rounded-full px-3 py-1.5 text-[11px] font-semibold text-[#F1F5FF] whitespace-nowrap z-20 ${className}`}
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${dot[color]}`} />
      {label}
    </div>
  );
}