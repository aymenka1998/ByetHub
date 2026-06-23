'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import Link from 'next/link';

// تعريف نوع الحدث الخاص بـ PWA لتجنب استخدام any
interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function TrackPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  // استخدام Lazy Initialization لتجنب خطأ setState داخل useEffect
  const [isAppInstalled, setIsAppInstalled] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(display-mode: standalone)').matches;
    }
    return false;
  });

  useEffect(() => {
    // مراقبة حالة تسجيل الدخول
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // منطق طلب تثبيت الـ PWA
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

    return () => {
      unsubscribe();
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsAppInstalled(true);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060b18]">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#060b18] text-white px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">يجب تسجيل الدخول أولاً</h1>
        <p className="text-gray-400 mb-8">لمتابعة طلباتك، يرجى تسجيل الدخول</p>
        <Link href="/" className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#060b18] text-white px-4 py-12" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0a1120] p-6 rounded-2xl border border-cyan-900/50">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">مرحباً بك!</h1>
            <p className="text-gray-400 text-sm">
              أنت مسجل الدخول بـ: <span className="text-cyan-400">{user.phoneNumber || user.email || 'حسابك'}</span>
            </p>
          </div>
          
          {/* تم استخدام bg-linear-to-r وهو المعيار الجديد في Tailwind */}
          {!isAppInstalled && deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-2 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-6 py-3 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              تثبيت التطبيق على هاتفك
            </button>
          )}
        </div>

        <h2 className="text-xl font-bold border-b border-cyan-900/50 pb-4">طلباتي الحالية</h2>

        <div className="bg-[#0a1120] border border-cyan-900/30 p-6 rounded-xl space-y-6">
          <div className="flex justify-between items-start border-b border-gray-800 pb-4">
            <div>
              <p className="text-gray-400 text-xs mb-1">رقم الطلب</p>
              <p className="font-mono text-cyan-400 font-bold">#BH-849302</p>
            </div>
            <div className="text-left">
              <p className="text-gray-400 text-xs mb-1">تاريخ الطلب</p>
              <p className="font-bold text-sm">21 يونيو 2026</p>
            </div>
          </div>

          {/* Tracking Stepper */}
          <div className="relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -translate-y-1/2 z-0 rounded-full"></div>
            <div className="absolute top-1/2 right-0 w-2/3 h-1 bg-cyan-500 -translate-y-1/2 z-0 rounded-full"></div>
            
            <div className="relative z-10 flex justify-between">
              {[
                { label: 'تم الاستلام', active: true },
                { label: 'قيد التجهيز', active: true },
                { label: 'تم الشحن', active: true },
                { label: 'تم التوصيل', active: false },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    step.active ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'bg-gray-800 text-gray-500'
                  }`}>
                    {step.active ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs font-bold ${step.active ? 'text-white' : 'text-gray-500'}`}>{step.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-800">
            <p className="text-sm text-gray-400">
              طلبك الآن مع شركة الشحن. سيتم التواصل معك قريباً لتحديد موعد التسليم.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}