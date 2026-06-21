'use client';

import { useState, useEffect } from 'react';
import { auth, googleProvider, signInWithPopup, signInWithPhoneNumber, RecaptchaVerifier } from '@/lib/firebase';
import type { ConfirmationResult, RecaptchaVerifier as RecaptchaVerifierType } from 'firebase/auth';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifierType;
  }
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}

export default function AuthModal({ isOpen, onClose, locale }: AuthModalProps) {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginMethod, setLoginMethod] = useState<'selection' | 'phone'>('selection');

  useEffect(() => {
    if (isOpen && loginMethod === 'phone' && !window.recaptchaVerifier) {
      setTimeout(() => {
        const container = document.getElementById('recaptcha-container');
        if (container) {
              try {
                window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                  size: 'invisible',
                });
              } catch (e: unknown) {
                console.error('Recaptcha init error', e);
              }
        }
      }, 100);
    }
  }, [isOpen, loginMethod]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithPopup(auth, googleProvider);
      router.push(`/${locale}/track`);
    } catch (err: unknown) {
      setError(getFirebaseErrorMessage(err, 'login'));
      setLoading(false);
    }
  };

  const handleTikTokSignIn = async () => {
    // Mock TikTok sign in
    setLoading(true);
    setTimeout(() => {
      alert("TikTok Login is mocked for development.");
      router.push(`/${locale}/track`);
    }, 1000);
  };

  const handleSendCode = async () => {
    if (!phoneNumber) {
      setError('الرجاء إدخال رقم الهاتف');
      return;
    }
    try {
      setLoading(true);
      setError('');
      const appVerifier = window.recaptchaVerifier;
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+213${phoneNumber.replace(/^0/, '')}`;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier as RecaptchaVerifierType);
      setConfirmationResult(confirmation);
      setLoading(false);
    } catch (err: unknown) {
      setError(getFirebaseErrorMessage(err, 'sendCode'));
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) return;
    try {
      setLoading(true);
      setError('');
      if (!confirmationResult) {
        setError('لم يتم إرسال كود التحقق');
        setLoading(false);
        return;
      }
      await confirmationResult.confirm(verificationCode);
      router.push(`/${locale}/track`);
    } catch (err: unknown) {
      setError(getFirebaseErrorMessage(err, 'verifyCode'));
      setLoading(false);
    }
  };

  const getFirebaseErrorMessage = (err: unknown, context: 'login' | 'sendCode' | 'verifyCode') => {
    if (typeof err === 'object' && err !== null) {
      const e = err as { code?: string; message?: string };
      if (e.code === 'auth/operation-not-allowed') {
        return 'طريقة تسجيل الدخول هذه غير مفعّلة على Firebase. فعّلها من Firebase Console → Authentication → Sign-in method.';
      }
      if (e.code === 'auth/invalid-phone-number') {
        return 'رقم الهاتف غير صالح.';
      }
      if (e.code === 'auth/invalid-verification-code' || e.code === 'auth/code-expired') {
        return 'كود التحقق غير صحيح أو منتهي الصلاحية.';
      }
      if (e.code === 'auth/too-many-requests') {
        return 'تم إرسال الكثير من الطلبات. حاول لاحقًا.';
      }
      if (e.message) return e.message;
    }
    if (err instanceof Error) return err.message;
    if (context === 'login') return 'حدث خطأ أثناء تسجيل الدخول';
    if (context === 'sendCode') return 'حدث خطأ في إرسال كود التحقق';
    return 'حدث خطأ في التحقق';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" dir="rtl">
      <div className="bg-[#0a1120] border border-cyan-900/50 rounded-2xl p-6 w-full max-w-md shadow-[0_0_40px_rgba(34,211,238,0.15)] relative">
        
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-400 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <h2 className="text-2xl font-bold text-white mb-2 text-center mt-4">تتبع طلبك بسهولة</h2>
        <p className="text-gray-400 text-sm text-center mb-6">سجل الدخول الآن لمتابعة حالة طلبك خطوة بخطوة</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {loginMethod === 'selection' && (
          <div className="space-y-3">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-black font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-50"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              تسجيل الدخول باستخدام جوجل
            </button>
            
            <button
              onClick={handleTikTokSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-900 text-white border border-gray-700 font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-50"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.24-2.61.94-5.22 3.01-6.79 1.63-1.24 3.73-1.65 5.72-1.22.4.08.79.2 1.16.35v4.1c-.69-.26-1.44-.34-2.18-.2-.84.14-1.63.63-2.11 1.34-.48.7-.63 1.58-.38 2.38.25.79.88 1.45 1.63 1.76.77.33 1.67.33 2.44.02.73-.28 1.35-.85 1.67-1.57.17-.38.25-.8.25-1.22.02-6.52.01-13.04.01-19.56z"/></svg>
              تسجيل الدخول باستخدام تيك توك
            </button>

            <div className="relative py-3 flex items-center">
              <div className="flex-grow border-t border-gray-800"></div>
              <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">أو</span>
              <div className="flex-grow border-t border-gray-800"></div>
            </div>

            <button
              onClick={() => setLoginMethod('phone')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-transparent border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              الدخول برقم الهاتف
            </button>
          </div>
        )}

        {loginMethod === 'phone' && (
          <div className="space-y-4">
            {!confirmationResult ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">رقم الهاتف</label>
                  <input
                    type="tel"
                    placeholder="0550XXXXXX"
                    dir="ltr"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-[#060b18] border border-cyan-900/50 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div id="recaptcha-container"></div>
                <button
                  onClick={handleSendCode}
                  disabled={loading}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50"
                >
                  {loading ? 'جاري الإرسال...' : 'إرسال كود التحقق'}
                </button>
                <button
                  onClick={() => setLoginMethod('selection')}
                  className="w-full text-gray-500 hover:text-white text-sm py-2"
                >
                  العودة للخيارات السابقة
                </button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">كود التحقق (OTP)</label>
                  <input
                    type="text"
                    placeholder="123456"
                    dir="ltr"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full px-4 py-3 bg-[#060b18] border border-cyan-900/50 rounded-xl text-white focus:outline-none focus:border-cyan-500 text-center tracking-[0.5em] font-mono text-xl"
                  />
                </div>
                <button
                  onClick={handleVerifyCode}
                  disabled={loading}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50"
                >
                  {loading ? 'جاري التحقق...' : 'تأكيد الدخول'}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
