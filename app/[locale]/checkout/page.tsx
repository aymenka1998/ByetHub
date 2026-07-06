'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useCountry } from '@/context/CountryContext';
import { convertCurrency, formatCurrency, getCurrencyByCountry, getLocaleByCountry, type CurrencyCode } from '@/lib/currency';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import AuthModal from '@/components/AuthModal';

const ALGERIA_WILAYAS = [
  'أدرار', 'الشلف', 'الأغواط', 'أم البواقي', 'باتنة', 'بجاية', 'بسكرة', 'بشار',
  'البليدة', 'البويرة', 'تمنراست', 'تبسة', 'تلمسان', 'تيارت', 'تيزي وزو', 'الجزائر',
  'الجلفة', 'جيجل', 'سطيف', 'سعيدة', 'سكيكدة', 'سيدي بلعباس', 'عنابة', 'قالمة',
  'قسنطينة', 'المدية', 'مستغانم', 'المسيلة', 'معسكر', 'ورقلة', 'وهران', 'البيض',
  'إليزي', 'برج بوعريريج', 'بومرداس', 'الطارف', 'تندوف', 'تيسمسيلت', 'الوادي',
  'خنشلة', 'سوق أهراس', 'تيبازة', 'ميلة', 'عين الدفلى', 'النعامة', 'عين تموشنت',
  'غرداية', 'غليزان', 'تيميمون', 'برج باجي مختار', 'أولاد جلال', 'بني عباس',
  'عين صالح', 'عين قزام', 'توقرت', 'جانت', 'المغير', 'المنيعة',
];

export default function CheckoutPage() {
  const { items, total, removeItem } = useCart();
  const { country } = useCountry();
  const currency = getCurrencyByCountry(country) as CurrencyCode;
  const currencyLocale = getLocaleByCountry(country);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  const SHIPPING_COST = 500; // تكلفة الشحن بالدينار الجزائري
  const grandTotal = total + SHIPPING_COST;
  const formatPrice = (amount: number) =>
    formatCurrency(convertCurrency(amount, 'DZD', currency), currency, currencyLocale);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    wilaya: 'الجزائر',
    address: '',
    paymentMethod: 'cod',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (formData.name.trim().length < 3) newErrors.name = 'الاسم يجب أن يكون أكثر من ٣ أحرف';
    if (!/^\d{9,10}$/.test(formData.phone)) newErrors.phone = 'رقم الهاتف يجب أن يتكون من ٩ أو ١٠ أرقام';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'يرجى إدخال بريد إلكتروني صحيح';
    if (formData.address.trim().length < 5) newErrors.address = 'يرجى إدخال العنوان بالتفصيل (الحي، الشارع)';

    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) newErrors.cardNumber = 'رقم البطاقة غير صحيح (١٦ رقم)';
      if (!formData.cardExpiry.match(/^\d{2}\/\d{2}$/)) newErrors.cardExpiry = 'التنسيق المطلوب MM/YY';
      if (!formData.cardCvv.match(/^\d{3}$/)) newErrors.cardCvv = 'الرمز السري غير صحيح (٣ أرقام)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const paymentApiKey = process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_API_KEY;
    if (paymentApiKey && formData.paymentMethod === 'card') {
      console.log('إعادة التوجيه لبوابة الدفع باستخدام المفتاح:', paymentApiKey);
    }

    setOrderNumber(Math.floor(100000 + Math.random() * 900000));
    setIsSubmitted(true);
    setShowAuthModal(true);
    items.forEach((item) => removeItem(item.id));
  };

  /* ─── Success Screen ─── */
  if (isSubmitted) {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-4 py-20 text-center"
        style={{ background: 'linear-gradient(135deg, #0d1117 0%, #0f1923 100%)' }}
      >
        {/* Glow ring */}
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20 blur-xl animate-pulse" />
          <div className="relative w-24 h-24 rounded-full border-2 border-blue-500/40 bg-[#0d1f35] flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-black text-white mb-2">تم استلام طلبك بنجاح!</h1>
        <p className="text-gray-400 mb-8">
          رقم الطلب الخاص بك:{' '}
          <span className="text-blue-400 font-bold font-mono">#BH-{orderNumber}</span>
        </p>

        <div
          className="w-full max-w-md rounded-2xl p-6 text-right space-y-3 mb-8"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <h3 className="font-bold text-white border-b border-white/10 pb-3 mb-3">تفاصيل التوصيل</h3>
          {[
            ['المستلم', formData.name],
            ['رقم التواصل', formData.phone],
            ['العنوان', `${formData.wilaya}، ${formData.address}`],
            ['طريقة الدفع', formData.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : 'بطاقة بنكية'],
            ['وقت التوصيل المتوقع', '٢ - ٥ أيام عمل'],
          ].map(([label, value]) => (
            <p key={label} className="text-sm text-gray-400">
              <span className="font-semibold text-gray-200">{label}: </span>
              {value}
            </p>
          ))}
        </div>

        <Link
          href="/"
          className="px-8 py-3.5 rounded-xl font-bold text-white transition-all text-base shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:shadow-[0_0_30px_rgba(59,130,246,0.55)] active:scale-95"
          style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
        >
          العودة للرئيسية
        </Link>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} locale={locale} />
      </main>
    );
  }

  /* ─── Empty Cart ─── */
  if (items.length === 0) {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
        style={{ background: '#0d1117' }}
      >
        <h2 className="text-2xl font-black text-white mb-4">السلة فارغة!</h2>
        <Link
          href="/shop"
          className="px-6 py-3 rounded-xl font-bold text-white transition-all"
          style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
        >
          تصفح المنتجات
        </Link>
      </main>
    );
  }

  /* ─── Input class helper ─── */
  const inputCls = (field: string) =>
    `w-full px-4 py-3 rounded-xl text-sm font-medium text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-all ${
      errors[field]
        ? 'border border-red-500 focus:ring-red-500'
        : 'border border-white/10 focus:border-blue-500 focus:ring-blue-500'
    }`;

  const inputStyle = { background: 'rgba(255,255,255,0.05)' };

  /* ─── Main Checkout ─── */
  return (
    <main
      className="min-h-screen px-4 sm:px-6 lg:px-8 py-12"
      style={{ background: 'linear-gradient(135deg, #0d1117 0%, #0f1923 100%)' }}
    >
      {/* Page Title */}
      <h1 className="text-3xl font-black text-white text-center mb-10 tracking-tight">
        إتمام عملية الشراء
      </h1>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ── Shipping Form ── */}
        <div
          className="lg:col-span-7 rounded-2xl p-6 sm:p-8"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-3">
            بيانات الشحن والتوصيل
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">الاسم الكامل *</label>
                <input
                  type="text" name="name" required
                  value={formData.name} onChange={handleInputChange}
                  placeholder="أحمد خالد"
                  className={inputCls('name')} style={inputStyle}
                />
                {errors.name && <p className="text-red-400 text-xs font-bold">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300">رقم الهاتف *</label>
                <input
                  type="tel" name="phone" required pattern="[0-9]{9,10}"
                  value={formData.phone} onChange={handleInputChange}
                  placeholder="0550XXXXXXX"
                  className={inputCls('phone')} style={inputStyle}
                />
                {errors.phone && <p className="text-red-400 text-xs font-bold">{errors.phone}</p>}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">البريد الإلكتروني *</label>
              <input
                type="email" name="email" required
                value={formData.email} onChange={handleInputChange}
                placeholder="example@email.com"
                className={inputCls('email')} style={inputStyle}
              />
              {errors.email && <p className="text-red-400 text-xs font-bold">{errors.email}</p>}
            </div>

            {/* Wilaya + Address */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2 sm:col-span-1">
                <label className="text-sm font-semibold text-gray-300">الولاية *</label>
                <select
                  name="wilaya"
                  value={formData.wilaya}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all border border-white/10"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  {ALGERIA_WILAYAS.map((w) => (
                    <option key={w} value={w} style={{ background: '#0d1117' }}>{w}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-semibold text-gray-300">العنوان بالتفصيل *</label>
                <input
                  type="text" name="address" required
                  value={formData.address} onChange={handleInputChange}
                  placeholder="الحي، اسم الشارع، رقم المبنى"
                  className={inputCls('address')} style={inputStyle}
                />
                {errors.address && <p className="text-red-400 text-xs font-bold">{errors.address}</p>}
              </div>
            </div>

            {/* Payment Method */}
            <h2 className="text-xl font-bold text-white pt-2 mb-1 border-b border-white/10 pb-3">
              طريقة الدفع
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  value: 'cod',
                  title: 'الدفع عند الاستلام',
                  desc: 'ادفع نقداً عند استلام طلبك',
                },
                {
                  value: 'card',
                  title: 'بطاقة CIB / بطاقة ائتمان',
                  desc: 'ادفع بأمان عبر بوابتنا الرقمية',
                },
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.paymentMethod === opt.value
                      ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  style={{ background: formData.paymentMethod === opt.value ? 'rgba(37,99,235,0.08)' : 'rgba(255,255,255,0.03)' }}
                >
                  <input
                    type="radio" name="paymentMethod" value={opt.value}
                    checked={formData.paymentMethod === opt.value}
                    onChange={handleInputChange}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <div className="text-right">
                    <p className="font-bold text-sm text-white">{opt.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* Card Fields */}
            {formData.paymentMethod === 'card' && (
              <div
                className="p-5 rounded-2xl space-y-4"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400">رقم البطاقة *</label>
                  <input
                    type="text" name="cardNumber"
                    placeholder="XXXX XXXX XXXX XXXX"
                    required={formData.paymentMethod === 'card'}
                    value={formData.cardNumber} onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-white focus:outline-none transition-all border ${
                      errors.cardNumber ? 'border-red-500' : 'border-white/10 focus:border-blue-500'
                    }`}
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  />
                  {errors.cardNumber && <p className="text-red-400 text-[10px] font-bold">{errors.cardNumber}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'cardExpiry', label: 'تاريخ الانتهاء *', placeholder: 'MM/YY' },
                    { name: 'cardCvv', label: 'الرمز السري CVV *', placeholder: '***', type: 'password', maxLength: 3 },
                  ].map((f) => (
                    <div key={f.name} className="space-y-2">
                      <label className="text-xs font-semibold text-gray-400">{f.label}</label>
                      <input
                        type={f.type || 'text'} name={f.name}
                        placeholder={f.placeholder}
                        maxLength={f.maxLength}
                        required={formData.paymentMethod === 'card'}
                        value={formData[f.name as keyof typeof formData]}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-white text-center focus:outline-none transition-all border ${
                          errors[f.name] ? 'border-red-500' : 'border-white/10 focus:border-blue-500'
                        }`}
                        style={{ background: 'rgba(255,255,255,0.05)' }}
                      />
                      {errors[f.name] && <p className="text-red-400 text-[10px] font-bold">{errors[f.name]}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-4 rounded-xl font-bold text-white text-lg transition-all active:scale-95 shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:shadow-[0_0_35px_rgba(59,130,246,0.55)]"
              style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
            >
              إكمال الطلب — {formatPrice(grandTotal)}
            </button>
          </form>
        </div>

        {/* ── Order Summary ── */}
        <div className="lg:col-span-5">
          <div
            className="rounded-2xl p-6"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-3">
              ملخص الطلب
            </h2>

            <div className="max-h-64 overflow-y-auto space-y-4 mb-6 pr-1 scrollbar-thin scrollbar-thumb-white/10">
              {items.map((item: unknown) => {
                const castedItem = item as { id: string | number; quantity: number; attributes?: Record<string, unknown> };
                const itemData = (castedItem.attributes || castedItem) as Record<string, unknown>;
                const name = (itemData.name as string) || 'Product';
                const price = (itemData.price as number) || 0;

                const rawImages = itemData.images as Record<string, unknown>[] | undefined;
                const firstImage = (
                  Array.isArray(rawImages)
                    ? rawImages[0]
                    : ((itemData.image as Record<string, unknown> | undefined)?.data as Record<string, unknown>[] | undefined)?.[0] || itemData.image
                ) as Record<string, unknown> | undefined;
                const imageUrlRaw =
                  (firstImage?.attributes as Record<string, unknown> | undefined)?.url as string | undefined ||
                  (firstImage?.url as string | undefined);

                const imageUrl = imageUrlRaw
                  ? imageUrlRaw.startsWith('/') || imageUrlRaw.startsWith('http')
                    ? imageUrlRaw.startsWith('/')
                      ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${imageUrlRaw}`
                      : imageUrlRaw
                    : `${process.env.NEXT_PUBLIC_STRAPI_URL}${imageUrlRaw}`
                  : '/placeholder.jpg';

                return (
                  <div key={castedItem.id} className="flex gap-4">
                    <div
                      className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0"
                      style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <Image src={imageUrl} alt={name} fill className="object-cover" sizes="64px" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-white line-clamp-1">{name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">الكمية: {castedItem.quantity}</p>
                      <p className="text-sm font-bold text-blue-400 mt-1">{formatPrice(price * castedItem.quantity)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div className="border-t border-white/10 pt-4 space-y-3 text-sm font-semibold text-gray-400">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span className="text-white">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span>تكلفة الشحن:</span>
                <span className="text-white">{formatPrice(SHIPPING_COST)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-white border-t border-white/10 pt-3">
                <span>الإجمالي الكلي:</span>
                <span className="text-blue-400">{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div
            className="mt-4 rounded-2xl p-4 grid grid-cols-2 gap-3"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            {[
              { icon: '🔒', text: 'دفع آمن ومشفر' },
              { icon: '🚚', text: 'توصيل سريع لكل ولايات الجزائر' },
              { icon: '↩️', text: 'إرجاع خلال ١٤ يوم' },
              { icon: '✅', text: 'ضمان أصالة المنتج' },
            ].map((b) => (
              <div key={b.text} className="flex items-center gap-2">
                <span className="text-base">{b.icon}</span>
                <span className="text-xs text-gray-500 leading-tight">{b.text}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
